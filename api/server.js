import express from 'express'
import Stripe from 'stripe'
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

// ─── Prix unitaires (centimes) ───
const PRICES = {
  chat_1: 4500,
  chat_multi: 3500,
  meet_standalone: 1500,
  bundle_chat: 3500,
  bundle_meet: 1000,
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
    const { plan, seats, segment, company, name: customerName } = req.body
    const quantity = Math.max(1, Math.min(500, Number(seats) || 1))

    const lineItems = []

    if (plan === 'pro') {
      lineItems.push({
        price_data: { currency: 'eur', product_data: { name: 'Proxima Chat' }, unit_amount: PRICES.bundle_chat, recurring: { interval: 'month' } },
        quantity,
      })
      lineItems.push({
        price_data: { currency: 'eur', product_data: { name: 'Proxima Meet' }, unit_amount: PRICES.bundle_meet, recurring: { interval: 'month' } },
        quantity,
      })
    } else if (plan === 'meet') {
      lineItems.push({
        price_data: { currency: 'eur', product_data: { name: 'Proxima Meet' }, unit_amount: PRICES.meet_standalone, recurring: { interval: 'month' } },
        quantity,
      })
    } else {
      const unitAmount = quantity >= 2 ? PRICES.chat_multi : PRICES.chat_1
      lineItems.push({
        price_data: { currency: 'eur', product_data: { name: 'Proxima Chat' }, unit_amount: unitAmount, recurring: { interval: 'month' } },
        quantity,
      })
    }

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

// ─── Redirect / -> /welcome ───
app.get('/', (_req, res) => {
  res.redirect('/welcome')
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
