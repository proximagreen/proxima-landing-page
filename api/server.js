import express from 'express'
import Stripe from 'stripe'
import nodemailer from 'nodemailer'
import crypto from 'crypto'
import { existsSync } from 'fs'
import { dirname, join } from 'path'
import { fileURLToPath } from 'url'

const __dirname = dirname(fileURLToPath(import.meta.url))

const app = express()
app.use(express.json())

const STRIPE_KEY = process.env.STRIPE_SECRET_KEY
let stripe = null
if (STRIPE_KEY) {
  stripe = new Stripe(STRIPE_KEY, { apiVersion: '2025-04-30.basil' })
} else {
  console.warn('STRIPE_SECRET_KEY non configuree -- le checkout sera desactive')
}

const POCKETBASE_URL = process.env.POCKETBASE_URL || ''
const LANDING_URL = process.env.LANDING_URL || 'http://localhost:3000'

// ─── Produits Stripe (catalogue) ───
// Prix a paliers de volume (49/29/19) et TVA geres directement dans Stripe.
// IDs crees par scripts/setup-stripe.js, a renseigner dans l'environnement.
const STRIPE_PRICES = {
  chat: process.env.STRIPE_PRICE_CHAT || '',
  meet: process.env.STRIPE_PRICE_MEET || '',
  pro:  process.env.STRIPE_PRICE_PRO  || '',
}

// ─── Helpers ───

function extractSlug(req) {
  // 1. Query param ?client=cabinet-laurent (prioritaire)
  if (req.query?.client) return req.query.client
  // 2. Sous-domaine : cabinet-laurent.proxima.green -> "cabinet-laurent"
  const parts = req.hostname.split('.')
  if (parts.length >= 3 && parts[0] !== 'go' && parts[0] !== 'www') return parts[0]
  return 'demo'
}

async function getClientConfig(slug) {
  if (!POCKETBASE_URL) return null

  try {
    const res = await fetch(
      `${POCKETBASE_URL}/api/collections/clients/records?filter=(slug='${slug}')&perPage=1`
    )
    if (!res.ok) return null
    const data = await res.json()
    if (data.items && data.items.length > 0) return data.items[0]
    return null
  } catch (err) {
    console.error('PocketBase error:', err.message)
    return null
  }
}

// ─── API : config client (appele par le frontend) ───

app.get('/api/client-config', async (req, res) => {
  const slug = extractSlug(req)
  const client = await getClientConfig(slug)

  if (client) {
    res.json({
      slug,
      name: client.company_name || slug,
      segment: client.segment || 'general',
      headline: client.headline || null,
      subheadline: client.subheadline || null,
      contact_name: client.contact_name || null,
      logo_url: client.logo_url || null,
      app_url: client.app_url || `https://${slug}.proxima.green`,
    })
  } else {
    // Fallback : config par defaut avec le slug
    res.json({
      slug,
      name: slug.replace(/-/g, ' ').replace(/\b\w/g, c => c.toUpperCase()),
      segment: 'general',
      headline: null,
      subheadline: null,
      contact_name: null,
      logo_url: null,
      app_url: `https://${slug}.proxima.green`,
    })
  }
})

// ─── API : Stripe Checkout ───

app.post('/api/create-checkout', async (req, res) => {
  if (!stripe) {
    return res.status(503).json({ error: 'Stripe non configure. Ajoutez STRIPE_SECRET_KEY dans les variables d\'environnement.' })
  }

  try {
    const { plan, seats, segment, company, name: customerName, email: customerEmail } = req.body
    const quantity = Math.max(1, Math.min(500, Number(seats) || 1))

    const planKey = plan === 'meet' ? 'meet' : plan === 'chat' ? 'chat' : 'pro'
    const priceId = STRIPE_PRICES[planKey]
    if (!priceId) {
      return res.status(503).json({ error: `Produit Stripe non configure pour le plan ${planKey} (renseignez STRIPE_PRICE_${planKey.toUpperCase()}).` })
    }

    const lineItems = [{ price: priceId, quantity }]

    const slug = extractSlug(req)
    const refId = [slug, segment || 'general', company || 'direct', Date.now()].join('_')
    const origin = req.headers.origin || req.headers.referer?.replace(/\/[^/]*$/, '') || LANDING_URL

    const session = await stripe.checkout.sessions.create({
      mode: 'subscription',
      line_items: lineItems,
      success_url: `${origin}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${origin}/welcome#pricing`,
      client_reference_id: refId,
      metadata: {
        slug,
        segment: segment || 'general',
        company: company || '',
        customer_name: customerName || '',
        seats: String(quantity),
        plan: plan || 'pro',
      },
      allow_promotion_codes: true,
      // TVA calculee automatiquement par Stripe Tax selon l'adresse du client
      // (Checkout collecte l'adresse de facturation requise).
      automatic_tax: { enabled: true },
      // Facture complete : nom + adresse de facturation obligatoires,
      // + nom de societe & n TVA (B2B, reverse charge) renseignes par le client.
      billing_address_collection: 'required',
      tax_id_collection: { enabled: true },
      ...(customerEmail ? { customer_email: customerEmail } : {}),
    })

    res.json({ url: session.url })
  } catch (err) {
    console.error('Stripe checkout error:', err)
    res.status(500).json({ error: err.message })
  }
})

// ─── Webhook Stripe : creation auto du client dans PocketBase ───

// IMPORTANT : le body doit etre raw pour la verification de signature
app.post('/api/stripe-webhook', express.raw({ type: 'application/json' }), async (req, res) => {
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET

  let event
  try {
    if (webhookSecret && stripe) {
      const sig = req.headers['stripe-signature']
      event = stripe.webhooks.constructEvent(req.body, sig, webhookSecret)
    } else {
      event = JSON.parse(req.body.toString())
    }
  } catch (err) {
    console.error('Webhook signature verification failed:', err.message)
    return res.status(400).json({ error: 'Signature invalide' })
  }

  if (event.type === 'checkout.session.completed') {
    const session = event.data.object
    const metadata = session.metadata || {}
    const slug = metadata.slug || 'unknown'
    const email = session.customer_details?.email || ''
    const customerName = session.customer_details?.name || metadata.customer_name || ''

    console.log(`Paiement recu : ${slug} / ${email} / ${metadata.plan} / ${metadata.seats} postes`)

    // Creer ou mettre a jour le client dans PocketBase
    if (POCKETBASE_URL && slug !== 'unknown') {
      try {
        // Verifier si le client existe deja
        const existing = await fetch(
          `${POCKETBASE_URL}/api/collections/clients/records?filter=(slug='${slug}')&perPage=1`
        )
        const data = await existing.json()

        const clientData = {
          slug,
          company_name: metadata.company || slug.replace(/-/g, ' ').replace(/\b\w/g, c => c.toUpperCase()),
          segment: metadata.segment || 'general',
          contact_name: customerName,
          contact_email: email,
          plan: metadata.plan || 'pro',
          seats: Number(metadata.seats) || 1,
          app_url: `https://${slug}.proxima.green`,
          stripe_customer_id: session.customer || '',
          stripe_subscription_id: session.subscription || '',
          status: 'active',
        }

        if (data.items && data.items.length > 0) {
          // Update
          await fetch(`${POCKETBASE_URL}/api/collections/clients/records/${data.items[0].id}`, {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(clientData),
          })
          console.log(`Client ${slug} mis a jour dans PocketBase`)
        } else {
          // Create
          await fetch(`${POCKETBASE_URL}/api/collections/clients/records`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(clientData),
          })
          console.log(`Client ${slug} cree dans PocketBase`)
        }
      } catch (err) {
        console.error('PocketBase write error:', err.message)
      }
    }
  }

  res.json({ received: true })
})

// ═══════════════════════════════════════════════════════════════
//  ACCES TELECHARGEMENT — code temporaire par email + fichiers self-hosted
// ═══════════════════════════════════════════════════════════════

// --- Config SMTP (Infomaniak ksuite) ---
const SMTP_HOST = process.env.SMTP_HOST || 'mail.infomaniak.com'
const SMTP_PORT = parseInt(process.env.SMTP_PORT || '465', 10)
const SMTP_USER = process.env.SMTP_USER || ''
const SMTP_PASS = process.env.SMTP_PASS || ''
const SMTP_FROM = process.env.SMTP_FROM || 'Proxima <noreply@proxima.green>'

// --- Config fichiers (volume persistant Coolify) ---
const DOWNLOADS_DIR = process.env.DOWNLOADS_DIR || join(__dirname, '..', 'downloads')
const DOWNLOAD_SECRET = process.env.DOWNLOAD_SECRET || crypto.randomBytes(32).toString('hex')

// Plateforme -> fichier attendu dans DOWNLOADS_DIR (a deposer une fois sur le volume)
const DOWNLOADS = {
  'mac-arm':  { file: process.env.DL_MAC_ARM  || 'Proxima-Meet-arm64.dmg', name: 'Proxima-Meet-Apple-Silicon.dmg', type: 'application/x-apple-diskimage' },
  'mac-intel':{ file: process.env.DL_MAC_INTEL|| 'Proxima-Meet-x64.dmg',   name: 'Proxima-Meet-Intel.dmg',         type: 'application/x-apple-diskimage' },
  'win-fr':   { file: process.env.DL_WIN_FR   || 'Proxima-Meet-fr.exe',    name: 'Proxima-Meet-FR.exe',            type: 'application/vnd.microsoft.portable-executable' },
  'win-en':   { file: process.env.DL_WIN_EN   || 'Proxima-Meet-en.exe',    name: 'Proxima-Meet-EN.exe',            type: 'application/vnd.microsoft.portable-executable' },
}

let mailer = null
if (SMTP_USER && SMTP_PASS) {
  mailer = nodemailer.createTransport({
    host: SMTP_HOST,
    port: SMTP_PORT,
    secure: SMTP_PORT === 465,
    auth: { user: SMTP_USER, pass: SMTP_PASS },
  })
  console.log(`SMTP configure (${SMTP_HOST}:${SMTP_PORT})`)
} else {
  console.log('SMTP non configure -- les codes seront affiches en console (mode dev)')
}

// --- Stockage en memoire des codes (TTL 10 min) ---
const codes = new Map()      // email -> { code, expires, attempts }
const lastSent = new Map()   // email -> timestamp (anti-spam)
const CODE_TTL = 10 * 60 * 1000
const RESEND_COOLDOWN = 60 * 1000
const MAX_ATTEMPTS = 5
const TOKEN_TTL = 60 * 60 * 1000

// Purge periodique
setInterval(() => {
  const now = Date.now()
  for (const [k, v] of codes) if (now > v.expires) codes.delete(k)
  for (const [k, t] of lastSent) if (now - t > RESEND_COOLDOWN) lastSent.delete(k)
}, 5 * 60 * 1000).unref()

const normEmail = (e) => String(e || '').trim().toLowerCase()
const validEmail = (e) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(e)
const genCode = () => String(crypto.randomInt(0, 1000000)).padStart(6, '0')

function signToken(email) {
  const exp = Date.now() + TOKEN_TTL
  const payload = Buffer.from(`${email}|${exp}`).toString('base64url')
  const sig = crypto.createHmac('sha256', DOWNLOAD_SECRET).update(payload).digest('base64url')
  return `${payload}.${sig}`
}
function verifyToken(token) {
  if (!token || typeof token !== 'string' || !token.includes('.')) return null
  const [payload, sig] = token.split('.')
  const expected = crypto.createHmac('sha256', DOWNLOAD_SECRET).update(payload).digest('base64url')
  const a = Buffer.from(sig), b = Buffer.from(expected)
  if (a.length !== b.length || !crypto.timingSafeEqual(a, b)) return null
  const [email, expStr] = Buffer.from(payload, 'base64url').toString().split('|')
  if (!email || Date.now() > Number(expStr)) return null
  return email
}

function codeEmailHtml(code) {
  return `<div style="font-family:Arial,Helvetica,sans-serif;max-width:480px;margin:0 auto;background:#060E09;color:#EDF5EF;border-radius:18px;overflow:hidden;border:1px solid rgba(0,232,122,.15)">
  <div style="padding:28px 32px;border-bottom:1px solid rgba(0,232,122,.12)">
    <span style="font-size:20px;font-weight:800;color:#EDF5EF;letter-spacing:.5px">Proxima</span>
  </div>
  <div style="padding:32px">
    <p style="margin:0 0 18px;font-size:15px;color:#8AAF92">Voici votre code d'acces pour telecharger Proxima&nbsp;:</p>
    <div style="font-size:36px;font-weight:800;letter-spacing:8px;color:#00E87A;background:rgba(0,232,122,.08);border:1px solid rgba(0,232,122,.2);border-radius:12px;padding:18px;text-align:center;margin:0 0 18px">${code}</div>
    <p style="margin:0;font-size:13px;color:#4A6E54">Ce code expire dans 10 minutes. Si vous n'etes pas a l'origine de cette demande, ignorez cet email.</p>
  </div>
  <div style="padding:18px 32px;border-top:1px solid rgba(237,245,239,.07);font-size:12px;color:#4A6E54">© 2026 Proxima · Heberge en Europe · RGPD natif</div>
</div>`
}

// Demande de code
app.post('/api/access/request', async (req, res) => {
  const email = normEmail(req.body?.email)
  if (!validEmail(email)) return res.status(400).json({ error: 'Adresse email invalide.' })

  const now = Date.now()
  if (now - (lastSent.get(email) || 0) < RESEND_COOLDOWN) {
    return res.status(429).json({ error: 'Patientez une minute avant de redemander un code.' })
  }

  const code = genCode()
  codes.set(email, { code, expires: now + CODE_TTL, attempts: 0 })
  lastSent.set(email, now)

  const text = `Votre code d'acces Proxima est : ${code}\n\nIl expire dans 10 minutes.\nSi vous n'avez pas demande ce code, ignorez cet email.`

  if (mailer) {
    try {
      await mailer.sendMail({
        from: SMTP_FROM, to: email,
        subject: `Votre code d'acces Proxima : ${code}`,
        text, html: codeEmailHtml(code),
      })
    } catch (e) {
      console.error('Echec envoi email:', e.message)
      return res.status(502).json({ error: "Impossible d'envoyer l'email pour le moment. Reessayez." })
    }
  } else {
    console.log(`[DEV] Code d'acces pour ${email} : ${code}`)
  }
  res.json({ sent: true })
})

// Verification du code -> token de telechargement
app.post('/api/access/verify', (req, res) => {
  const email = normEmail(req.body?.email)
  const code = String(req.body?.code || '').trim()
  const entry = codes.get(email)

  if (!entry) return res.status(400).json({ error: 'Aucun code en attente. Redemandez-en un.' })
  if (Date.now() > entry.expires) { codes.delete(email); return res.status(400).json({ error: 'Code expire. Redemandez-en un.' }) }
  entry.attempts++
  if (entry.attempts > MAX_ATTEMPTS) { codes.delete(email); return res.status(429).json({ error: 'Trop de tentatives. Redemandez un code.' }) }
  if (code !== entry.code) return res.status(400).json({ error: 'Code incorrect.' })

  codes.delete(email)
  res.json({ token: signToken(email) })
})

// Telechargement protege par token (fichiers servis depuis le volume)
app.get('/api/download/:platform', (req, res) => {
  if (!verifyToken(req.query.token)) {
    return res.status(403).send('Acces refuse ou expire. Redemandez un code d\'acces.')
  }
  const meta = DOWNLOADS[req.params.platform]
  if (!meta) return res.status(404).send('Plateforme inconnue.')

  const filePath = join(DOWNLOADS_DIR, meta.file)
  if (!existsSync(filePath)) {
    console.error(`Fichier introuvable : ${filePath}`)
    return res.status(404).send('Fichier temporairement indisponible.')
  }
  res.download(filePath, meta.name, (err) => {
    if (err && !res.headersSent) res.status(500).end()
  })
})

// ─── Redirect / -> /welcome ───
app.get('/', (_req, res) => {
  res.redirect('/welcome')
})

// ─── Page produits statique (Meet + Chat) ───
app.get('/products', (_req, res) => {
  res.sendFile(join(__dirname, '..', 'dist', 'products.html'))
})

// ─── Static files ───
app.use(express.static(join(__dirname, '..', 'dist')))

// ─── SPA fallback ───
app.get('{*path}', (_req, res) => {
  res.sendFile(join(__dirname, '..', 'dist', 'index.html'))
})

const PORT = process.env.PORT || 3000
app.listen(PORT, () => {
  console.log(`Proxima LP running on port ${PORT}`)
  if (POCKETBASE_URL) console.log(`PocketBase: ${POCKETBASE_URL}`)
  else console.log('PocketBase non configure -- mode fallback')
})
