/**
 * Stripe Payment Links configuration.
 *
 * IMPORTANT: Ne JAMAIS mettre de clé Stripe (sk_live, rk_live) dans le frontend.
 * Utiliser uniquement des Payment Links (URLs publiques et sécurisées).
 *
 * Pour créer les Payment Links :
 * 1. Aller sur https://dashboard.stripe.com/payment-links
 * 2. Créer un lien pour chaque produit/prix
 * 3. Coller l'URL ci-dessous
 *
 * Les Payment Links supportent :
 * - ?quantity=N pour pré-remplir le nombre de postes
 * - ?client_reference_id=xxx pour le tracking
 * - ?prefilled_email=xxx pour pré-remplir l'email
 */

const APP_URL = import.meta.env.VITE_APP_URL || 'https://app.proxima.green'

// ─── Plans & Pricing ───

export interface Plan {
  id: string
  name: string
  price: number          // par poste / mois
  description: string
  features: string[]
  recommended?: boolean
  stripeLink: string     // Payment Link Stripe
}

export const PLANS: Record<string, Plan> = {
  free: {
    id: 'free',
    name: 'Découverte',
    price: 0,
    description: 'Pour tester Proxima',
    features: [
      'Chat IA (usage limité)',
      'Recherche web',
      '1 dossier de conversation',
      'Interface épurée',
    ],
    stripeLink: '', // Pas de paiement, redirection vers signup
  },
  pro: {
    id: 'pro',
    name: 'Proxima Entreprise',
    price: 9,
    description: 'Pour les équipes professionnelles',
    features: [
      'Chat IA illimité',
      'Proxima Meet (visio IA)',
      'Agents IA personnalisés',
      'RAG documentaire',
      'Dossiers illimités',
      'VM dédiée & sécurisée',
      'Support prioritaire',
    ],
    recommended: true,
    // REMPLACER par le vrai Payment Link Stripe :
    // Créer sur https://dashboard.stripe.com/payment-links
    stripeLink: import.meta.env.VITE_STRIPE_PRO_LINK || '',
  },
}

// ─── URL Builders ───

interface CheckoutParams {
  segment: string
  company?: string | null
  name?: string | null
  email?: string | null
  seats?: number
}

/**
 * Génère l'URL de checkout Stripe pour le plan Pro.
 * Utilise un Payment Link avec paramètres query.
 */
export function getCheckoutUrl(params: CheckoutParams): string {
  const plan = PLANS.pro
  if (!plan.stripeLink) {
    // Fallback : redirige vers le signup si pas de Payment Link configuré
    return getSignupUrl(params)
  }

  const url = new URL(plan.stripeLink)

  // Pré-remplir la quantité (nombre de postes)
  if (params.seats && params.seats > 1) {
    url.searchParams.set('quantity', String(params.seats))
  }

  // Tracking : segment + company + timestamp
  const refId = [params.segment, params.company || 'direct', Date.now()].join('_')
  url.searchParams.set('client_reference_id', refId)

  // Pré-remplir l'email si disponible
  if (params.email) {
    url.searchParams.set('prefilled_email', params.email)
  }

  return url.toString()
}

/**
 * Génère l'URL de signup gratuit.
 */
export function getSignupUrl(params: CheckoutParams): string {
  const url = new URL(`${APP_URL}/signup`)
  url.searchParams.set('segment', params.segment)
  if (params.company) url.searchParams.set('company', params.company)
  if (params.name) url.searchParams.set('name', params.name)
  if (params.email) url.searchParams.set('email', params.email)
  return url.toString()
}
