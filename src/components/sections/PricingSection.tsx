import { useState, useCallback, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { usePersonalization } from '../../context/PersonalizationContext'
import { getContent } from '../../lib/content'
import { createCheckoutSession } from '../../lib/stripe'
import { SectionHeading } from '../ui/SectionHeading'
import { Button } from '../ui/Button'

const PRODUCTS = [
  {
    id: 'chat' as const,
    name: 'Proxima Chat',
    price: 45,
    priceFrom2: 35,
    description: 'Chat IA souverain pour votre équipe',
    features: [
      'Chat IA illimité',
      'RAG documentaire',
      'Dossiers cloisonnés',
      'VM dédiée & sécurisée',
      'Support prioritaire',
    ],
  },
  {
    id: 'meet' as const,
    name: 'Proxima Meet',
    price: 15,
    description: 'Visioconférence IA chiffrée',
    features: [
      'Visio chiffrée de bout en bout',
      'Transcription en temps réel',
      'Résumé & plan d\'action auto',
      'Enregistrement sécurisé',
      'Intégration Proxima Chat',
    ],
  },
  {
    id: 'agent' as const,
    name: 'Custom Agent',
    price: null,
    description: 'Agents IA sur mesure',
    features: [
      'Agents IA personnalisés',
      'Automatisation de workflows',
      'Intégrations sur mesure',
      'Accompagnement dédié',
      'SLA garanti',
    ],
  },
]

const PACKAGE = {
  name: 'Proxima Chat + Meet',
  price: 45,
  chatPrice: 35,
  meetPrice: 10,
  description: 'L\'offre complète pour votre équipe',
}

/* ─── Shared pricing logic hook ─── */

function usePricingLogic(initialChat: boolean, initialMeet: boolean) {
  const [includeChat, setIncludeChat] = useState(initialChat)
  const [includeMeet, setIncludeMeet] = useState(initialMeet)
  const [seats, setSeats] = useState(1)

  const isBundle = includeChat && includeMeet
  const chatPricePerSeat = !includeChat ? 0 : isBundle ? PACKAGE.chatPrice : (seats >= 2 ? PRODUCTS[0].priceFrom2! : PRODUCTS[0].price as number)
  const meetPricePerSeat = !includeMeet ? 0 : isBundle ? PACKAGE.meetPrice : PRODUCTS[1].price as number
  const pricePerSeat = chatPricePerSeat + meetPricePerSeat
  const totalPrice = pricePerSeat * seats
  const plan = (isBundle ? 'pro' : includeChat ? 'chat' : 'meet') as 'pro' | 'chat' | 'meet'
  const dailyPerUser = (includeChat || includeMeet) ? (totalPrice / seats / 30).toFixed(2) : '0'

  const handleSeatsChange = (value: string) => {
    const n = parseInt(value, 10)
    if (!isNaN(n) && n >= 1 && n <= 500) setSeats(n)
  }

  return {
    includeChat, setIncludeChat,
    includeMeet, setIncludeMeet,
    seats, setSeats,
    isBundle, chatPricePerSeat, meetPricePerSeat,
    pricePerSeat, totalPrice, plan, dailyPerUser,
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
  onAddChat,
  onAddMeet,
}: {
  includeChat: boolean
  includeMeet: boolean
  onAddChat: () => void
  onAddMeet: () => void
}) {
  if (includeChat && includeMeet) return null
  if (!includeChat && !includeMeet) return null

  const message = includeChat
    ? `Ajoutez Meet pour seulement +${PACKAGE.meetPrice}€/licence au lieu de ${PRODUCTS[1].price}€`
    : `Ajoutez Chat pour seulement +${PACKAGE.chatPrice}€/licence`

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

/* ─── Included features list ─── */

function IncludedFeatures({ includeChat, includeMeet }: { includeChat: boolean; includeMeet: boolean }) {
  const features: string[] = []
  if (includeChat) {
    features.push('Chat IA illimité & RAG documentaire')
    features.push('VM dédiée & dossiers cloisonnés')
  }
  if (includeMeet) {
    features.push('Visio chiffrée + transcription temps réel')
    features.push('Résumés & plans d\'action automatiques')
  }
  if (!includeChat && !includeMeet) return null

  return (
    <div>
      <p className="text-xs font-semibold text-text-muted uppercase tracking-wider mb-2">Ce qui est inclus</p>
      <ul className="space-y-2">
        {features.map((f) => (
          <li key={f} className="flex items-center gap-2 text-sm text-text-secondary">
            <svg className="w-4 h-4 text-green-500 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
            </svg>
            {f}
          </li>
        ))}
      </ul>
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

/* ─── Side Cart ─── */

function SideCart({
  open,
  onClose,
  initialProduct,
}: {
  open: boolean
  onClose: () => void
  initialProduct: 'chat' | 'meet' | 'bundle'
}) {
  const { segment, name, company } = usePersonalization()
  const {
    includeChat, setIncludeChat,
    includeMeet, setIncludeMeet,
    seats, setSeats,
    isBundle, chatPricePerSeat, meetPricePerSeat,
    totalPrice, plan, dailyPerUser,
    handleSeatsChange,
  } = usePricingLogic(
    initialProduct === 'chat' || initialProduct === 'bundle',
    initialProduct === 'meet' || initialProduct === 'bundle'
  )
  const [loading, setLoading] = useState(false)

  // Sync a chaque ouverture ou changement de produit
  useEffect(() => {
    if (!open) return
    if (initialProduct === 'bundle') {
      setIncludeChat(true)
      setIncludeMeet(true)
    } else if (initialProduct === 'chat') {
      setIncludeChat(true)
      setIncludeMeet(false)
    } else {
      setIncludeChat(false)
      setIncludeMeet(true)
    }
    setSeats(1)
  }, [open, initialProduct, setIncludeChat, setIncludeMeet, setSeats])

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
    <AnimatePresence>
      {open && (
        <>
          {/* Backdrop */}
          <motion.div
            className="fixed inset-0 z-[60] bg-black/40 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />

          {/* Panel */}
          <motion.div
            className="fixed top-0 right-0 z-[70] h-full w-full max-w-md sidecart-bg border-l border-border-card shadow-2xl overflow-y-auto"
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 30, stiffness: 300 }}
          >
            <div className="p-6 sm:p-8 flex flex-col h-full">
              {/* Header */}
              <div className="flex items-center justify-between mb-8">
                <h3 className="text-xl font-bold text-text-primary">Votre panier</h3>
                <button onClick={onClose} className="w-10 h-10 rounded-xl border border-border-card flex items-center justify-center hover:bg-bg-card transition-colors cursor-pointer">
                  <svg className="w-5 h-5 text-text-muted" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              {/* Product toggles */}
              <div className="space-y-3 mb-6">
                <ProductToggle
                  checked={includeChat}
                  onChange={() => setIncludeChat(!includeChat)}
                  label="Proxima Chat"
                  priceLabel={`${isBundle ? PACKAGE.chatPrice : seats >= 2 ? PRODUCTS[0].priceFrom2 : PRODUCTS[0].price}€/mois par licence`}
                />
                <ProductToggle
                  checked={includeMeet}
                  onChange={() => setIncludeMeet(!includeMeet)}
                  label="Proxima Meet"
                  priceLabel={`${isBundle ? PACKAGE.meetPrice : PRODUCTS[1].price}€/mois par licence`}
                />
              </div>

              {/* Upsell banner */}
              <div className="mb-6">
                <UpsellBanner
                  includeChat={includeChat}
                  includeMeet={includeMeet}
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
                  <p className="text-xs text-green-500 font-medium">Bundle appliqué : Meet à {PACKAGE.meetPrice}€ au lieu de {PRODUCTS[1].price}€</p>
                </div>
              )}

              {/* Seats */}
              <div className="mb-6">
                <SeatSelector seats={seats} setSeats={setSeats} handleSeatsChange={handleSeatsChange} />
              </div>

              {/* Included features */}
              <div className="mb-6">
                <IncludedFeatures includeChat={includeChat} includeMeet={includeMeet} />
              </div>

              {/* Spacer */}
              <div className="flex-1" />

              {/* Summary */}
              <div className="border-t border-border-subtle pt-5 mt-4">
                {includeChat && (
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-sm text-text-secondary">Chat x {seats}</span>
                    <span className="text-sm text-text-secondary">{chatPricePerSeat * seats}€</span>
                  </div>
                )}
                {includeMeet && (
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-sm text-text-secondary">Meet x {seats}</span>
                    <span className="text-sm text-text-secondary">{meetPricePerSeat * seats}€</span>
                  </div>
                )}
                {!includeChat && !includeMeet && (
                  <p className="text-sm text-text-muted text-center py-2">Sélectionnez au moins un produit</p>
                )}
                <div className="flex justify-between items-center mt-3 pt-3 border-t border-border-subtle">
                  <span className="text-lg font-bold text-text-primary">Total</span>
                  <span className="text-3xl font-bold text-text-primary">{totalPrice}€<span className="text-sm font-normal text-text-muted">/mois</span></span>
                </div>
                {(includeChat || includeMeet) && (
                  <p className="text-xs text-text-muted text-right mt-1">Soit {dailyPerUser}€/jour par collaborateur</p>
                )}
              </div>

              <Button variant="primary" className="w-full mt-6" onClick={handleCheckout} disabled={loading || (!includeChat && !includeMeet)}>
                {loading ? 'Redirection...' : `Payer ${totalPrice}€/mois`}
              </Button>

              <div className="mt-4">
                <TrustBadges />
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}

/* ─── Inline Configurateur ─── */

function InlineConfigurateur() {
  const { segment, name, company } = usePersonalization()
  const {
    includeChat, setIncludeChat,
    includeMeet, setIncludeMeet,
    seats, setSeats,
    isBundle, chatPricePerSeat, meetPricePerSeat,
    totalPrice, plan, dailyPerUser,
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
          priceLabel={`${isBundle ? PACKAGE.chatPrice : seats >= 2 ? PRODUCTS[0].priceFrom2 : PRODUCTS[0].price}€/mois par licence`}
        />
        <ProductToggle
          checked={includeMeet}
          onChange={() => setIncludeMeet(!includeMeet)}
          label="Proxima Meet"
          priceLabel={`${isBundle ? PACKAGE.meetPrice : PRODUCTS[1].price}€/mois par licence`}
        />
      </div>

      {/* Upsell banner */}
      <div className="mb-6">
        <UpsellBanner
          includeChat={includeChat}
          includeMeet={includeMeet}
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
          <p className="text-xs text-green-500 font-medium">Bundle appliqué : Meet à {PACKAGE.meetPrice}€ au lieu de {PRODUCTS[1].price}€</p>
        </div>
      )}

      {/* Seats */}
      <div className="flex justify-center mb-6">
        <SeatSelector seats={seats} setSeats={setSeats} handleSeatsChange={handleSeatsChange} />
      </div>

      {/* Price Summary */}
      <div className="border-t border-border-subtle pt-5">
        {includeChat && (
          <div className="flex justify-between items-center mb-1">
            <span className="text-sm text-text-secondary">Proxima Chat x {seats}</span>
            <span className="text-sm text-text-secondary">{chatPricePerSeat * seats}€/mois</span>
          </div>
        )}
        {includeMeet && (
          <div className="flex justify-between items-center mb-1">
            <span className="text-sm text-text-secondary">Proxima Meet x {seats}</span>
            <span className="text-sm text-text-secondary">{meetPricePerSeat * seats}€/mois</span>
          </div>
        )}
        {!includeChat && !includeMeet && (
          <p className="text-sm text-text-muted text-center py-2">Sélectionnez au moins un produit</p>
        )}
        <div className="flex justify-between items-center mt-3 pt-3 border-t border-border-subtle">
          <span className="text-lg font-bold text-text-primary">Total</span>
          <div className="text-right">
            <span className="text-3xl font-bold text-text-primary">{totalPrice}€<span className="text-sm font-normal text-text-muted">/mois</span></span>
            {(includeChat || includeMeet) && (
              <p className="text-xs text-text-muted mt-0.5">Soit {dailyPerUser}€/jour par collaborateur</p>
            )}
          </div>
        </div>
      </div>

      {/* CTA */}
      <Button variant="primary" className="w-full mt-6" onClick={handleCheckout} disabled={loading || (!includeChat && !includeMeet)}>
        {loading ? 'Redirection...' : `Démarrer maintenant - ${totalPrice}€/mois`}
      </Button>

      {/* Trust */}
      <div className="mt-4">
        <TrustBadges />
      </div>
    </div>
  )
}

/* ─── Main Section ─── */

export function PricingSection() {
  const { segment } = usePersonalization()
  const content = getContent(segment)
  const [cartOpen, setCartOpen] = useState(false)
  const [cartProduct, setCartProduct] = useState<'chat' | 'meet' | 'bundle'>('chat')

  const openCart = (productId: string) => {
    if (productId === 'chat' || productId === 'meet') {
      setCartProduct(productId)
      setCartOpen(true)
    }
  }

  return (
    <>
      <section id="pricing" className="py-[var(--section-padding)] px-6 relative section-fade-top">
        <div className="max-w-[var(--container-max)] mx-auto relative z-10">
          <SectionHeading
            badge="Tarifs"
            title={content.pricing.headline}
            subtitle={content.pricing.subheadline}
          />

          {/* 3 Product Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto mb-12">
            {PRODUCTS.map((product, i) => (
              <div
                key={product.id}
                className="glass card-glow rounded-2xl p-6 flex flex-col"
              >
                <h3 className="text-lg font-bold text-text-primary mb-2">{product.name}</h3>
                <p className="text-sm text-text-muted mb-4">{product.description}</p>

                <div className="mb-6">
                  {product.price !== null ? (
                    <div>
                      <div className="flex items-baseline gap-1">
                        <span className="text-4xl font-bold text-text-primary">{product.price}€</span>
                        <span className="text-text-muted">/utilisateur/mois</span>
                      </div>
                      {'priceFrom2' in product && product.priceFrom2 && (
                        <p className="text-xs text-green-500 font-medium mt-1">{product.priceFrom2}€/utilisateur à partir de 2 licences</p>
                      )}
                    </div>
                  ) : (
                    <div className="text-2xl font-bold text-text-primary">Sur devis</div>
                  )}
                </div>

                <ul className="space-y-3 mb-6 flex-1">
                  {product.features.map((f) => (
                    <li key={f} className="flex items-center gap-2.5 text-sm text-text-secondary">
                      <svg className="w-4 h-4 text-green-500 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                      </svg>
                      {f}
                    </li>
                  ))}
                </ul>

                {product.price !== null ? (
                  <Button variant={i === 0 ? 'primary' : 'secondary'} className="w-full mt-auto" onClick={() => openCart(product.id)}>
                    Choisir {product.name}
                  </Button>
                ) : (
                  <Button variant="secondary" className="w-full mt-auto" href="mailto:contact@proxima.green">
                    Nous contacter
                  </Button>
                )}
              </div>
            ))}
          </div>

          {/* Package highlight */}
          <div className="glass rounded-2xl p-5 sm:p-6 max-w-md mx-auto mb-12 text-center border-green-500/30 cursor-pointer hover:border-green-500/50 transition-colors" onClick={() => { setCartProduct('bundle'); setCartOpen(true) }}>
            <div className="inline-block px-3 py-1 rounded-full text-xs font-bold bg-green-500 text-white mb-3">
              Offre recommandée
            </div>
            <h3 className="text-xl font-bold text-text-primary mb-1">{PACKAGE.name}</h3>
            <p className="text-sm text-text-muted mb-3">{PACKAGE.description}</p>
            <div className="flex items-baseline justify-center gap-1">
              <span className="text-4xl font-bold text-text-primary">{PACKAGE.price}€</span>
              <span className="text-text-muted">/utilisateur/mois</span>
            </div>
            <p className="text-xs text-green-500 font-medium mt-2">
              Chat {PACKAGE.chatPrice}€ + Meet {PACKAGE.meetPrice}€ -- Cliquez pour configurer
            </p>
          </div>

          {/* Inline Configurateur */}
          <InlineConfigurateur />

          {/* Trust line */}
          <p className="text-center text-sm text-text-muted">
            Sans engagement -- Annulation en 1 clic -- Paiement sécurisé
          </p>
        </div>
      </section>

      {/* Side Cart */}
      <SideCart open={cartOpen} onClose={() => setCartOpen(false)} initialProduct={cartProduct} />
    </>
  )
}
