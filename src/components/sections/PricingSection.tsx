import { useState, useCallback } from 'react'
import { usePersonalization } from '../../context/PersonalizationContext'
import { getContent } from '../../lib/content'
import { createCheckoutSession } from '../../lib/stripe'
import { SectionHeading } from '../ui/SectionHeading'
import { Button } from '../ui/Button'

/* ─── Tarification dégressive par volume ─── */

type Plan = 'pro' | 'chat' | 'meet'

// Prix €/utilisateur/mois selon le palier : [1-19, 20-99, 100+]
const PRICING: Record<Plan, [number, number, number]> = {
  pro: [49, 29, 19],
  chat: [35, 23, 15],
  meet: [20, 15, 9],
}

const TIERS = [
  { label: '1 à 19 licences', index: 0 },
  { label: '20 à 99 licences', index: 1 },
  { label: '100 licences et +', index: 2 },
]

function tierIndex(seats: number): 0 | 1 | 2 {
  if (seats >= 100) return 2
  if (seats >= 20) return 1
  return 0
}

function tierPrice(plan: Plan, seats: number): number {
  return PRICING[plan][tierIndex(seats)]
}

const PRODUCT_LABEL: Record<Plan, string> = {
  pro: 'Proxima Chat + Meet',
  chat: 'Proxima Chat',
  meet: 'Proxima Meet',
}

const DEFAULT_SEATS = 25

/* ─── Shared pricing logic hook ─── */

function usePricingLogic(initialChat: boolean, initialMeet: boolean) {
  const [includeChat, setIncludeChat] = useState(initialChat)
  const [includeMeet, setIncludeMeet] = useState(initialMeet)
  const [seats, setSeats] = useState(DEFAULT_SEATS)

  const active = includeChat || includeMeet
  const isBundle = includeChat && includeMeet
  const plan: Plan = isBundle ? 'pro' : includeChat ? 'chat' : 'meet'
  const pricePerSeat = active ? tierPrice(plan, seats) : 0
  const totalPrice = pricePerSeat * seats
  const dailyPerUser = active ? (pricePerSeat / 30).toFixed(2) : '0'

  const handleSeatsChange = (value: string) => {
    const n = parseInt(value, 10)
    if (!isNaN(n) && n >= 1 && n <= 500) setSeats(n)
  }

  return {
    includeChat, setIncludeChat,
    includeMeet, setIncludeMeet,
    seats, setSeats,
    active, isBundle, plan,
    pricePerSeat, totalPrice, dailyPerUser,
    handleSeatsChange,
  }
}

/* ─── Checkbox toggle component ─── */

function ProductToggle({
  checked,
  onChange,
  label,
  priceLabel,
}: {
  checked: boolean
  onChange: () => void
  label: string
  priceLabel: string
}) {
  return (
    <label className={`flex items-center justify-between p-4 rounded-xl border-2 cursor-pointer transition-all ${checked ? 'border-green-500/50 bg-green-500/[0.04]' : 'border-border-card'}`}>
      <div className="flex items-center gap-3">
        <input type="checkbox" checked={checked} onChange={onChange} className="sr-only" />
        <div className={`w-5 h-5 rounded-md border-2 flex items-center justify-center transition-all ${checked ? 'bg-green-500 border-green-500' : 'border-border-card'}`}>
          {checked && <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>}
        </div>
        <div>
          <p className="text-sm font-semibold text-text-primary">{label}</p>
          <p className="text-xs text-text-muted">{priceLabel}</p>
        </div>
      </div>
    </label>
  )
}

/* ─── Seat selector component ─── */

function SeatSelector({
  seats,
  setSeats,
  handleSeatsChange,
}: {
  seats: number
  setSeats: (n: number) => void
  handleSeatsChange: (v: string) => void
}) {
  return (
    <div>
      <p className="text-sm font-semibold text-text-primary mb-3">Nombre de licences</p>
      <div className="flex items-center gap-3">
        <button
          onClick={() => setSeats(Math.max(1, seats - 1))}
          className="w-10 h-10 rounded-xl bg-bg-card border border-border-subtle text-text-primary hover:border-green-500/40 transition-colors cursor-pointer flex items-center justify-center text-xl font-bold"
        >-</button>
        <input
          type="number" min={1} max={500} value={seats}
          onChange={(e) => handleSeatsChange(e.target.value)}
          className="w-20 h-12 text-center text-2xl font-bold bg-bg-card border border-border-subtle rounded-xl text-text-primary focus:outline-none focus:border-green-500/50 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
        />
        <button
          onClick={() => setSeats(Math.min(500, seats + 1))}
          className="w-10 h-10 rounded-xl bg-bg-card border border-border-subtle text-text-primary hover:border-green-500/40 transition-colors cursor-pointer flex items-center justify-center text-xl font-bold"
        >+</button>
      </div>
      <p className="text-xs text-text-muted mt-2">1 utilisateur = 1 licence</p>
    </div>
  )
}

/* ─── Upsell banner ─── */

function UpsellBanner({
  includeChat,
  includeMeet,
  seats,
  onAddChat,
  onAddMeet,
}: {
  includeChat: boolean
  includeMeet: boolean
  seats: number
  onAddChat: () => void
  onAddMeet: () => void
}) {
  if (includeChat && includeMeet) return null
  if (!includeChat && !includeMeet) return null

  const bundlePrice = tierPrice('pro', seats)
  const message = includeChat
    ? `Ajoutez Meet et passez au package à ${bundlePrice}€/licence`
    : `Ajoutez Chat et passez au package à ${bundlePrice}€/licence`

  const action = includeChat ? onAddMeet : onAddChat

  return (
    <div className="flex items-center gap-3 p-3 rounded-xl bg-green-500/10 border border-green-500/20">
      <svg className="w-5 h-5 text-green-500 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v6m3-3H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
      <div className="flex-1">
        <p className="text-xs text-green-500 font-medium">{message}</p>
      </div>
      <button
        onClick={action}
        className="shrink-0 px-3 py-1.5 rounded-lg text-xs font-bold bg-green-500 text-white hover:bg-green-600 transition-colors cursor-pointer"
      >
        Ajouter
      </button>
    </div>
  )
}

/* ─── Trust line ─── */

function TrustBadges() {
  return (
    <div className="flex items-center justify-center gap-2 text-xs text-text-muted">
      <svg className="w-3.5 h-3.5 text-green-500 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z" />
      </svg>
      Sans engagement -- Annulation en 1 clic -- Paiement sécurisé
    </div>
  )
}

/* ─── Inline Configurateur ─── */

function InlineConfigurateur() {
  const { segment, name, company } = usePersonalization()
  const {
    includeChat, setIncludeChat,
    includeMeet, setIncludeMeet,
    seats, setSeats,
    active, isBundle, plan,
    pricePerSeat, totalPrice, dailyPerUser,
    handleSeatsChange,
  } = usePricingLogic(true, true)
  const [loading, setLoading] = useState(false)

  const handleCheckout = useCallback(async () => {
    if (!includeChat && !includeMeet) return
    setLoading(true)
    try {
      const url = await createCheckoutSession({ segment, company, name, seats, plan })
      window.open(url, '_blank')
    } catch (err) {
      console.error('Checkout error:', err)
    } finally {
      setLoading(false)
    }
  }, [segment, company, name, seats, plan, includeChat, includeMeet])

  return (
    <div id="configurateur" className="glass rounded-2xl p-6 sm:p-8 max-w-2xl mx-auto mb-8 scroll-mt-24">
      <h3 className="text-xl font-bold text-text-primary mb-1 text-center">Configurez votre accès</h3>
      <p className="text-sm text-text-muted text-center mb-6">Choisissez vos produits, ajustez le nombre de licences</p>

      {/* Toggles */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-6">
        <ProductToggle
          checked={includeChat}
          onChange={() => setIncludeChat(!includeChat)}
          label="Proxima Chat"
          priceLabel={`${tierPrice('chat', seats)}€/mois par licence`}
        />
        <ProductToggle
          checked={includeMeet}
          onChange={() => setIncludeMeet(!includeMeet)}
          label="Proxima Meet"
          priceLabel={`${tierPrice('meet', seats)}€/mois par licence`}
        />
      </div>

      {/* Upsell banner */}
      <div className="mb-6">
        <UpsellBanner
          includeChat={includeChat}
          includeMeet={includeMeet}
          seats={seats}
          onAddChat={() => setIncludeChat(true)}
          onAddMeet={() => setIncludeMeet(true)}
        />
      </div>

      {/* Bundle badge */}
      {isBundle && (
        <div className="flex items-center gap-2 p-3 rounded-xl bg-green-500/10 border border-green-500/20 mb-6">
          <svg className="w-4 h-4 text-green-500 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <p className="text-xs text-green-500 font-medium">Package Chat + Meet appliqué : {tierPrice('pro', seats)}€/licence</p>
        </div>
      )}

      {/* Seats */}
      <div className="flex justify-center mb-6">
        <SeatSelector seats={seats} setSeats={setSeats} handleSeatsChange={handleSeatsChange} />
      </div>

      {/* Price Summary */}
      <div className="border-t border-border-subtle pt-5">
        {active ? (
          <div className="flex justify-between items-center mb-1">
            <span className="text-sm text-text-secondary">{PRODUCT_LABEL[plan]} x {seats} ({pricePerSeat}€/licence)</span>
            <span className="text-sm text-text-secondary">{totalPrice}€/mois</span>
          </div>
        ) : (
          <p className="text-sm text-text-muted text-center py-2">Sélectionnez au moins un produit</p>
        )}
        <div className="flex justify-between items-center mt-3 pt-3 border-t border-border-subtle">
          <span className="text-lg font-bold text-text-primary">Total</span>
          <div className="text-right">
            <span className="text-3xl font-bold text-text-primary">{totalPrice}€<span className="text-sm font-normal text-text-muted">/mois</span></span>
            {active && (
              <p className="text-xl sm:text-2xl font-bold text-green-500 mt-1">Soit {dailyPerUser}€/jour par collaborateur</p>
            )}
          </div>
        </div>
      </div>

      {/* CTA */}
      <Button variant="primary" className="w-full mt-6" onClick={handleCheckout} disabled={loading || !active}>
        {loading ? 'Redirection...' : `Démarrer maintenant - ${totalPrice}€/mois`}
      </Button>

      {/* Trust */}
      <div className="mt-4">
        <TrustBadges />
      </div>
    </div>
  )
}

/* ─── Offer card ─── */

function OfferCard({
  plan,
  description,
  features,
  highlighted,
}: {
  plan: Plan
  description: string
  features: string[]
  highlighted?: boolean
}) {
  return (
    <div className={`glass card-glow rounded-2xl p-6 flex flex-col ${highlighted ? 'border-green-500/40' : ''}`}>
      {highlighted && (
        <div className="inline-block self-start px-3 py-1 rounded-full text-xs font-bold bg-green-500 text-white mb-3">
          Offre recommandée
        </div>
      )}
      <h3 className="text-lg font-bold text-text-primary mb-2">{PRODUCT_LABEL[plan]}</h3>
      <p className="text-sm text-text-muted mb-4">{description}</p>

      <div className="mb-4">
        <div className="flex items-baseline gap-1">
          <span className="text-4xl font-bold text-text-primary">{tierPrice(plan, DEFAULT_SEATS)}€</span>
          <span className="text-text-muted">/utilisateur/mois</span>
        </div>
        <p className="text-xs text-text-muted mt-1">à partir de 20 utilisateurs</p>
      </div>

      {/* Paliers dégressifs */}
      <ul className="space-y-1 mb-5 text-xs text-text-muted">
        {TIERS.map((t) => (
          <li key={t.label} className="flex justify-between">
            <span>{t.label}</span>
            <span className="font-semibold text-text-secondary">{PRICING[plan][t.index]}€/user</span>
          </li>
        ))}
      </ul>

      <ul className="space-y-3 mb-6 flex-1">
        {features.map((f) => (
          <li key={f} className="flex items-center gap-2.5 text-sm text-text-secondary">
            <svg className="w-4 h-4 text-green-500 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
            </svg>
            {f}
          </li>
        ))}
      </ul>

      <Button variant={highlighted ? 'primary' : 'secondary'} className="w-full mt-auto" href="#configurateur">
        Configurer mon accès
      </Button>
    </div>
  )
}

/* ─── Main Section ─── */

export function PricingSection() {
  const { segment } = usePersonalization()
  const content = getContent(segment)

  return (
    <section id="pricing" className="py-[var(--section-padding)] px-6 relative section-fade-top">
      <div className="max-w-[var(--container-max)] mx-auto relative z-10">
        <SectionHeading
          badge="Tarifs"
          title={content.pricing.headline}
          subtitle={content.pricing.subheadline}
        />

        {/* Package mis en avant */}
        <div className="max-w-md mx-auto mb-8">
          <OfferCard
            plan="pro"
            description="L'offre complète : Chat IA souverain + visioconférence chiffrée."
            features={[
              'Chat IA illimité & RAG documentaire',
              'VM dédiée & dossiers cloisonnés',
              'Visio chiffrée + transcription temps réel',
              'Résumés & plans d\'action automatiques',
              'Support prioritaire',
            ]}
            highlighted
          />
        </div>

        {/* Offres unitaires */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-3xl mx-auto mb-12">
          <OfferCard
            plan="chat"
            description="Chat IA souverain pour votre équipe."
            features={[
              'Chat IA illimité',
              'RAG documentaire',
              'Dossiers cloisonnés',
              'VM dédiée & sécurisée',
              'Support prioritaire',
            ]}
          />
          <OfferCard
            plan="meet"
            description="Visioconférence IA chiffrée."
            features={[
              'Visio chiffrée de bout en bout',
              'Transcription en temps réel',
              'Résumé & plan d\'action auto',
              'Enregistrement sécurisé',
              'Intégration Proxima Chat',
            ]}
          />
        </div>

        {/* Inline Configurateur */}
        <InlineConfigurateur />

        {/* Trust line */}
        <p className="text-center text-sm text-text-muted">
          Sans engagement -- Annulation en 1 clic -- Paiement sécurisé
        </p>
      </div>
    </section>
  )
}
