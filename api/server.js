import express from 'express'
import Stripe from 'stripe'
import { dirname, join } from 'path'
import { fileURLToPath } from 'url'

const __dirname = dirname(fileURLToPath(import.meta.url))

const app = express()
app.use(express.json())

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || '', {
  apiVersion: '2025-04-30.basil',
})

const LANDING_URL = process.env.LANDING_URL || 'http://localhost:3000'

// ─── Prix unitaires (centimes) ───
const PRICES = {
  chat_1: 4500,       // Chat, 1 licence = 45€
  chat_multi: 3500,   // Chat, 2+ licences = 35€
  meet_standalone: 1500, // Meet seul = 15€
  bundle_chat: 3500,  // Bundle : Chat = 35€
  bundle_meet: 1000,  // Bundle : Meet = 10€
}

app.post('/api/create-checkout', async (req, res) => {
  try {
    const { plan, seats, segment, company, name: customerName } = req.body
    const quantity = Math.max(1, Math.min(500, Number(seats) || 1))

    const lineItems = []

    if (plan === 'pro') {
      // Bundle Chat + Meet
      lineItems.push({
        price_data: {
          currency: 'eur',
          product_data: { name: 'Proxima Chat' },
          unit_amount: PRICES.bundle_chat,
          recurring: { interval: 'month' },
        },
        quantity,
      })
      lineItems.push({
        price_data: {
          currency: 'eur',
          product_data: { name: 'Proxima Meet' },
          unit_amount: PRICES.bundle_meet,
          recurring: { interval: 'month' },
        },
        quantity,
      })
    } else {
      // Chat seul
      const unitAmount = quantity >= 2 ? PRICES.chat_multi : PRICES.chat_1
      lineItems.push({
        price_data: {
          currency: 'eur',
          product_data: { name: 'Proxima Chat' },
          unit_amount: unitAmount,
          recurring: { interval: 'month' },
        },
        quantity,
      })
    }

    const refId = [segment || 'general', company || 'direct', Date.now()].join('_')

    const session = await stripe.checkout.sessions.create({
      mode: 'subscription',
      line_items: lineItems,
      success_url: `${LANDING_URL}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${LANDING_URL}/#pricing`,
      client_reference_id: refId,
      metadata: {
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

// Serve static files from dist/
app.use(express.static(join(__dirname, '..', 'dist')))

// SPA fallback
app.get('*', (_req, res) => {
  res.sendFile(join(__dirname, '..', 'dist', 'index.html'))
})

const PORT = process.env.PORT || 3000
app.listen(PORT, () => {
  console.log(`Proxima server running on port ${PORT}`)
})
