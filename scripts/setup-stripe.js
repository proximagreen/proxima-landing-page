/**
 * Cree (ou reutilise) les produits et prix Stripe de la landing Proxima.
 *
 * Grilles par produit, par paliers de volume (EUR HT, mensuel) :
 *   Proxima Chat        : 35 / 23 / 15 €/licence (1-19 / 20-99 / 100+)
 *   Proxima Meet        : 20 / 15 /  9 €/licence
 *   Proxima Chat + Meet : 49 / 29 / 19 €/licence
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

// Paliers en centimes par produit : [1-19, 20-99, 100+]
const tiers = (a, b, c) => [
  { up_to: 19, unit_amount: a },
  { up_to: 99, unit_amount: b },
  { up_to: 'inf', unit_amount: c },
]

const PRODUCTS = [
  { key: 'chat', name: 'Proxima Chat', lookup: 'proxima_chat_monthly', env: 'STRIPE_PRICE_CHAT', tiers: tiers(3500, 2300, 1500) },
  { key: 'meet', name: 'Proxima Meet', lookup: 'proxima_meet_monthly', env: 'STRIPE_PRICE_MEET', tiers: tiers(2000, 1500, 900) },
  { key: 'pro',  name: 'Proxima Chat + Meet', lookup: 'proxima_pro_monthly', env: 'STRIPE_PRICE_PRO', tiers: tiers(4900, 2900, 1900) },
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
  // expand tiers : Stripe ne renvoie pas les paliers par defaut
  const res = await stripe.prices.list({ lookup_keys: [lookup], active: true, limit: 1, expand: ['data.tiers'] })
  return res.data[0] || null
}

// Compare la sequence des montants des paliers (les prix Stripe sont immuables)
function tiersMatch(existing, wanted) {
  const a = (existing.tiers || []).map((t) => t.unit_amount)
  const b = wanted.map((t) => t.unit_amount)
  return a.length === b.length && a.every((v, i) => v === b[i])
}

async function createPrice(product, lookup, tiers, transfer) {
  return stripe.prices.create({
    product: product.id,
    currency: 'eur',
    recurring: { interval: 'month' },
    billing_scheme: 'tiered',
    tiers_mode: 'volume',
    tax_behavior: 'exclusive',
    tiers,
    lookup_key: lookup,
    ...(transfer ? { transfer_lookup_key: true } : {}),
  })
}

async function ensurePrice(product, { lookup, tiers }) {
  const existing = await findPrice(lookup)
  if (existing && tiersMatch(existing, tiers)) {
    console.log(`  prix reutilise     : ${existing.id} (${lookup})`)
    return existing
  }
  if (existing) {
    // Paliers obsoletes : on cree un nouveau prix, on lui transfere le lookup_key,
    // puis on archive l'ancien (un prix Stripe ne se modifie pas).
    const created = await createPrice(product, lookup, tiers, true)
    await stripe.prices.update(existing.id, { active: false })
    console.log(`  prix recree        : ${created.id} (${lookup}) — ancien ${existing.id} archive`)
    return created
  }
  const created = await createPrice(product, lookup, tiers, false)
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
