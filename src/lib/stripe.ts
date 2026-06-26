/**
 * Stripe Checkout integration.
 *
 * Le frontend envoie les details de commande au serveur API
 * qui cree une Stripe Checkout Session et retourne l'URL.
 */

const APP_URL = import.meta.env.VITE_APP_URL || 'https://app.proxima.green'
const API_URL = import.meta.env.VITE_API_URL || ''

// ─── Plans & Pricing ───

export interface Plan {
  id: string
  name: string
  price: number          // par poste / mois (1 licence)
  priceFrom2?: number    // par poste / mois (2+ licences)
  description: string
  features: string[]
  recommended?: boolean
}

export const PLANS: Record<string, Plan> = {
  free: {
    id: 'free',
    name: 'Demo',
    price: 0,
    description: 'Testez Proxima en conditions réelles',
    features: [
      'Chat IA (usage limité)',
      'Recherche web IA',
      '1 dossier de conversation',
      'Interface complète',
    ],
  },
  chat: {
    id: 'chat',
    name: 'Proxima Chat',
    price: 35,
    priceFrom2: 23,
    description: 'Chat IA souverain pour votre équipe',
    features: [
      'Chat IA illimité',
      'RAG documentaire',
      'Dossiers cloisonnés',
      'VM dédiée & sécurisée',
      'Support prioritaire',
    ],
  },
  pro: {
    id: 'pro',
    name: 'Proxima Chat + Meet',
    price: 49,
    description: 'Chat + Meet pour votre équipe',
    features: [
      'Chat IA illimité',
      'Proxima Meet (visio IA)',
      'RAG documentaire',
      'Dossiers illimités',
      'VM dédiée & sécurisée',
      'Support prioritaire & accompagnement',
    ],
    recommended: true,
  },
}

// ─── Grille par paliers de volume (€ HT/licence/mois) : [1-19, 20-99, 100+] ───
// Source d'affichage unique. La facturation reelle (et la TVA) est geree par
// les prix a paliers cote Stripe (voir scripts/setup-stripe.js).
export const VOLUME_PRICING: [number, number, number] = [49, 29, 19]

export function tierPriceForSeats(seats: number): number {
  if (seats >= 100) return VOLUME_PRICING[2]
  if (seats >= 20) return VOLUME_PRICING[1]
  return VOLUME_PRICING[0]
}

// ─── Checkout ───

interface CheckoutParams {
  segment: string
  company?: string | null
  name?: string | null
  email?: string | null
  seats?: number
  plan?: 'chat' | 'meet' | 'pro'
}

/**
 * Appelle le serveur API pour creer une Stripe Checkout Session.
 * Retourne l'URL de checkout.
 */
export async function createCheckoutSession(params: CheckoutParams): Promise<string> {
  const res = await fetch(`${API_URL}/api/create-checkout`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      plan: params.plan || 'pro',
      seats: params.seats || 1,
      segment: params.segment,
      company: params.company || null,
      name: params.name || null,
      email: params.email || null,
    }),
  })

  if (!res.ok) {
    const err = await res.json().catch(() => ({ error: 'Erreur serveur' }))
    throw new Error(err.error || 'Erreur lors de la creation du checkout')
  }

  const data = await res.json()
  return data.url
}

/**
 * Genere l'URL de signup gratuit.
 */
export function getSignupUrl(params: CheckoutParams): string {
  const url = new URL(`${APP_URL}/signup`)
  url.searchParams.set('segment', params.segment)
  if (params.company) url.searchParams.set('company', params.company)
  if (params.name) url.searchParams.set('name', params.name)
  if (params.email) url.searchParams.set('email', params.email)
  return url.toString()
}
