/**
 * Cree (ou reutilise) les produits et prix Stripe de la landing Proxima.
 *
 * Grille unique par paliers de volume (EUR HT, mensuel) :
 *   1-19 licences  -> 49 €/licence
 *   20-99 licences -> 29 €/licence
 *   100+ licences  -> 19 €/licence
 *
 * Les prix sont en mode `tiers_mode: 'volume'` : Stripe applique le tarif du
 * palier correspondant au nombre total de licences, et calcule la TVA via
 * Stripe Tax (`tax_behavior: 'exclusive'` => prix HT, TVA ajoutee).
 *
 * Idempotent : on retrouve produits et prix par `lookup_key` / metadata.
 *
 * Usage : STRIPE_SECRET_KEY=sk_live_... node scripts/setup-stripe.js
 */
import Stripe from 'stripe'

const KEY = process.env.STRIPE_SECRET_KEY
if (!KEY) {
  console.error('STRIPE_SECRET_KEY manquante. Usage : STRIPE_SECRET_KEY=sk_... node scripts/setup-stripe.js')
  process.exit(1)
}

const stripe = new Stripe(KEY, { apiVersion: '2025-04-30.basil' })

const TIERS = [
  { up_to: 19, unit_amount: 4900 },
  { up_to: 99, unit_amount: 2900 },
  { up_to: 'inf', unit_amount: 1900 },
]

const PRODUCTS = [
  { key: 'chat', name: 'Proxima Chat', lookup: 'proxima_chat_monthly', env: 'STRIPE_PRICE_CHAT' },
  { key: 'meet', name: 'Proxima Meet', lookup: 'proxima_meet_monthly', env: 'STRIPE_PRICE_MEET' },
  { key: 'pro',  name: 'Proxima Chat + Meet', lookup: 'proxima_pro_monthly', env: 'STRIPE_PRICE_PRO' },
]

async function findProduct(key) {
  const res = await stripe.products.search({ query: `metadata['proxima_key']:'${key}'`, limit: 1 })
  return res.data[0] || null
}

async function ensureProduct({ key, name }) {
  const existing = await findProduct(key)
  if (existing) {
    console.log(`  produit reutilise : ${existing.id} (${name})`)
    return existing
  }
  const created = await stripe.products.create({
    name,
    tax_code: 'txcd_10103001', // Software as a service (SaaS)
    metadata: { proxima_key: key },
  })
  console.log(`  produit cree       : ${created.id} (${name})`)
  return created
}

async function findPrice(lookup) {
  const res = await stripe.prices.list({ lookup_keys: [lookup], active: true, limit: 1 })
  return res.data[0] || null
}

async function ensurePrice(product, { lookup }) {
  const existing = await findPrice(lookup)
  if (existing) {
    console.log(`  prix reutilise     : ${existing.id} (${lookup})`)
    return existing
  }
  const created = await stripe.prices.create({
    product: product.id,
    currency: 'eur',
    recurring: { interval: 'month' },
    billing_scheme: 'tiered',
    tiers_mode: 'volume',
    tax_behavior: 'exclusive',
    tiers: TIERS,
    lookup_key: lookup,
  })
  console.log(`  prix cree          : ${created.id} (${lookup})`)
  return created
}

async function main() {
  console.log('Configuration Stripe Proxima (produits + prix a paliers)\n')
  const envLines = []
  for (const p of PRODUCTS) {
    console.log(`${p.name} :`)
    const product = await ensureProduct(p)
    const price = await ensurePrice(product, p)
    envLines.push(`${p.env}=${price.id}`)
    console.log('')
  }
  console.log('Variables d\'environnement a renseigner (Coolify) :\n')
  console.log(envLines.join('\n'))
  console.log('\nPensez aussi a activer Stripe Tax : https://dashboard.stripe.com/settings/tax')
}

main().catch((err) => {
  console.error('Echec :', err.message)
  process.exit(1)
})
