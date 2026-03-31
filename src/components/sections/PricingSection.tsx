import { useState } from 'react'
import { motion } from 'framer-motion'
import { usePersonalization } from '../../context/PersonalizationContext'
import { getContent } from '../../lib/content'
import { getCheckoutUrl } from '../../lib/stripe'
import { SectionHeading } from '../ui/SectionHeading'
import { Button } from '../ui/Button'

const PRODUCTS = [
  {
    id: 'chat',
    name: 'Proxima Chat',
    price: 35,
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
    id: 'meet',
    name: 'Proxima Meet',
    price: 20,
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
    id: 'agent',
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
  description: 'L\'offre complète pour votre équipe',
}

export function PricingSection() {
  const { segment, name, company } = usePersonalization()
  const content = getContent(segment)
  const [billing, setBilling] = useState<'monthly' | 'annual'>('monthly')
  const [seats, setSeats] = useState(5)
  const [includeMeet, setIncludeMeet] = useState(true)

  const chatPrice = PRODUCTS[0].price as number
  const meetPrice = PRODUCTS[1].price as number
  const pricePerSeat = includeMeet ? PACKAGE.price : chatPrice
  const annualPricePerSeat = Math.round(pricePerSeat * 0.8)
  const activePrice = billing === 'annual' ? annualPricePerSeat : pricePerSeat
  const totalPrice = activePrice * seats
  const annualSavings = (pricePerSeat - annualPricePerSeat) * seats * 12

  const stripeUrl = getCheckoutUrl({ segment, company, name, seats })

  const handleSeatsChange = (value: string) => {
    const n = parseInt(value, 10)
    if (!isNaN(n) && n >= 1 && n <= 500) {
      setSeats(n)
    }
  }

  return (
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
            <motion.div
              key={product.id}
              className="glass card-glow rounded-2xl p-6 flex flex-col"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: i * 0.1 }}
            >
              <h3 className="text-lg font-bold text-text-primary mb-2">{product.name}</h3>
              <p className="text-sm text-text-muted mb-4">{product.description}</p>

              <div className="mb-6">
                {product.price !== null ? (
                  <div className="flex items-baseline gap-1">
                    <span className="text-4xl font-bold text-text-primary">{product.price}€</span>
                    <span className="text-text-muted">/utilisateur/mois</span>
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
                <Button variant={i === 0 ? 'primary' : 'secondary'} className="w-full mt-auto" href="#configurateur">
                  Choisir {product.name}
                </Button>
              ) : (
                <Button variant="secondary" className="w-full mt-auto" href="mailto:contact@proxima.green">
                  Nous contacter
                </Button>
              )}
            </motion.div>
          ))}
        </div>

        {/* Package highlight */}
        <motion.div
          className="glass rounded-2xl p-5 sm:p-6 max-w-md mx-auto mb-12 text-center border-green-500/30"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
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
            Économisez {chatPrice + meetPrice - PACKAGE.price}€/utilisateur vs séparé
          </p>
        </motion.div>

        {/* Configurateur */}
        <motion.div
          id="configurateur"
          className="glass rounded-2xl p-5 sm:p-8 max-w-xl mx-auto mb-12"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <h3 className="text-lg font-bold text-text-primary text-center mb-6">Configurez votre accès</h3>

          {/* Option Meet */}
          <div className="flex items-center justify-between mb-6 p-3 rounded-xl bg-bg-card border border-border-subtle">
            <div>
              <p className="text-sm font-medium text-text-primary">Inclure Proxima Meet</p>
              <p className="text-xs text-text-muted">+{meetPrice}€/utilisateur/mois</p>
            </div>
            <button
              onClick={() => setIncludeMeet(!includeMeet)}
              className={`relative w-12 h-7 rounded-full transition-colors duration-300 cursor-pointer ${
                includeMeet ? 'bg-green-500' : 'bg-border-subtle'
              }`}
            >
              <div className={`absolute top-1 w-5 h-5 rounded-full bg-white transition-transform duration-300 ${
                includeMeet ? 'left-6' : 'left-1'
              }`} />
            </button>
          </div>

          {/* Billing toggle */}
          <div className="flex items-center justify-center mb-6">
            <div className="flex items-center gap-1 p-1 rounded-xl bg-bg-card border border-border-subtle">
              <button
                onClick={() => setBilling('monthly')}
                className={`px-5 py-2.5 rounded-lg text-sm font-semibold transition-all duration-300 cursor-pointer ${
                  billing === 'monthly'
                    ? 'bg-green-500 text-white'
                    : 'text-text-secondary hover:text-text-primary'
                }`}
              >
                Mensuel
              </button>
              <button
                onClick={() => setBilling('annual')}
                className={`px-5 py-2.5 rounded-lg text-sm font-semibold transition-all duration-300 cursor-pointer flex items-center gap-2 ${
                  billing === 'annual'
                    ? 'bg-green-500 text-white'
                    : 'text-text-secondary hover:text-text-primary'
                }`}
              >
                Annuel
                <span className="text-[10px] font-black px-2 py-0.5 rounded-full bg-green-500/20 text-green-500 border border-green-500/30">
                  -20%
                </span>
              </button>
            </div>
          </div>

          {/* Seat input — custom number */}
          <div className="text-center mb-6">
            <p className="text-sm font-semibold text-text-primary mb-3">Nombre de licences</p>
            <div className="flex items-center justify-center gap-3">
              <button
                onClick={() => setSeats(Math.max(1, seats - 1))}
                className="w-10 h-10 rounded-xl bg-bg-card border border-border-subtle text-text-primary hover:border-green-500/40 transition-colors cursor-pointer flex items-center justify-center text-xl font-bold"
              >
                -
              </button>
              <input
                type="number"
                min={1}
                max={500}
                value={seats}
                onChange={(e) => handleSeatsChange(e.target.value)}
                className="w-20 h-12 text-center text-2xl font-bold bg-bg-card border border-border-subtle rounded-xl text-text-primary focus:outline-none focus:border-green-500/50 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
              />
              <button
                onClick={() => setSeats(Math.min(500, seats + 1))}
                className="w-10 h-10 rounded-xl bg-bg-card border border-border-subtle text-text-primary hover:border-green-500/40 transition-colors cursor-pointer flex items-center justify-center text-xl font-bold"
              >
                +
              </button>
            </div>
            <p className="text-xs text-text-muted mt-2">1 utilisateur = 1 licence</p>
          </div>

          {/* Price summary */}
          <div className="border-t border-border-subtle pt-5">
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm text-text-secondary">
                {includeMeet ? 'Chat + Meet' : 'Proxima Chat'} x {seats} licence{seats > 1 ? 's' : ''}
              </span>
              <span className="text-sm text-text-secondary">{activePrice}€ x {seats}</span>
            </div>
            {billing === 'annual' && (
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm text-green-500 font-medium">Économie annuelle</span>
                <span className="text-sm text-green-500 font-medium">-{annualSavings}€</span>
              </div>
            )}
            <div className="flex justify-between items-center mt-3 pt-3 border-t border-border-subtle">
              <span className="text-lg font-bold text-text-primary">Total</span>
              <span className="text-3xl font-bold text-text-primary">{totalPrice}€<span className="text-sm font-normal text-text-muted">/mois</span></span>
            </div>
          </div>

          <Button variant="primary" className="w-full mt-6" href={stripeUrl}>
            Accéder à mon espace ({totalPrice}€/mois)
          </Button>
        </motion.div>

        {/* Trust line — sans "Powered by Stripe" */}
        <motion.div
          className="text-center mt-10"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.3 }}
        >
          <p className="text-sm text-text-muted">
            Sans engagement -- Annulation en 1 clic -- Paiement sécurisé
          </p>
        </motion.div>
      </div>
    </section>
  )
}
