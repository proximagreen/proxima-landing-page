import { useState, useRef } from 'react'
import { motion, useInView } from 'framer-motion'
import { usePersonalization } from '../../context/PersonalizationContext'
import { getContent } from '../../lib/content'
import { getCheckoutUrl, getSignupUrl, PLANS } from '../../lib/stripe'
import { SectionHeading } from '../ui/SectionHeading'
import { Button } from '../ui/Button'
import { AnimatedCounter } from '../ui/AnimatedCounter'
import { Icon } from '../ui/Icon'

const SEAT_OPTIONS = [1, 5, 10, 25, 50, 100]

export function PricingSection() {
  const { segment, name, company, plan: defaultPlan, seats: defaultSeats } = usePersonalization()
  const content = getContent(segment)
  const [billing, setBilling] = useState<'monthly' | 'annual'>('monthly')
  const [seats, setSeats] = useState(defaultSeats)
  const [selectedPlan, setSelectedPlan] = useState<'free' | 'pro'>(defaultPlan)

  const pro = PLANS.pro
  const monthlyPrice = pro.price
  const annualMonthlyPrice = Math.round(pro.price * 0.8) // -20% annuel
  const activePrice = billing === 'annual' ? annualMonthlyPrice : monthlyPrice
  const totalPrice = activePrice * seats
  const annualSavings = (monthlyPrice - annualMonthlyPrice) * seats * 12

  const stripeUrl = getCheckoutUrl({ segment, company, name, seats })
  const signupUrl = getSignupUrl({ segment, company, name })

  return (
    <section id="pricing" className="py-[var(--section-padding)] px-6 relative section-fade-top">

      <div className="max-w-[var(--container-max)] mx-auto relative z-10">
        <SectionHeading
          badge="Tarifs"
          title={content.pricing.headline}
          subtitle={content.pricing.subheadline}
        />

        {/* Billing toggle */}
        <motion.div
          className="flex items-center justify-center gap-4 mb-8"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <div className="flex items-center gap-1 p-1 rounded-xl bg-bg-card border border-border-subtle">
            <button
              onClick={() => setBilling('monthly')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 cursor-pointer ${
                billing === 'monthly'
                  ? 'bg-green-500 text-black shadow-[0_0_15px_rgba(34,197,94,0.3)]'
                  : 'text-text-secondary hover:text-text-primary'
              }`}
            >
              Mensuel
            </button>
            <button
              onClick={() => setBilling('annual')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 cursor-pointer flex items-center gap-2 ${
                billing === 'annual'
                  ? 'bg-green-500 text-black shadow-[0_0_15px_rgba(34,197,94,0.3)]'
                  : 'text-text-secondary hover:text-text-primary'
              }`}
            >
              Annuel
              <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded-full ${
                billing === 'annual'
                  ? 'bg-black/20 text-black'
                  : 'bg-green-500/15 text-green-400'
              }`}>
                -20%
              </span>
            </button>
          </div>
        </motion.div>

        {/* Seat selector */}
        <motion.div
          className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4 mb-14"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <span className="text-text-secondary text-sm">Nombre de postes :</span>
          <div className="flex flex-wrap justify-center gap-1.5 p-1 rounded-xl bg-bg-card border border-border-subtle">
            {SEAT_OPTIONS.map((n) => (
              <button
                key={n}
                onClick={() => setSeats(n)}
                className={`px-3 md:px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 cursor-pointer ${
                  seats === n
                    ? 'bg-green-500 text-black shadow-[0_0_20px_rgba(34,197,94,0.3)]'
                    : 'text-text-secondary hover:bg-bg-card-hover hover:text-text-primary'
                }`}
              >
                {n}
              </button>
            ))}
          </div>
        </motion.div>

        {/* Plans */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8 max-w-5xl mx-auto w-full">
          {/* Free */}
          <motion.div
            className={`glass card-glow rounded-2xl p-6 md:p-8 cursor-pointer transition-all duration-500 flex flex-col ${
              selectedPlan === 'free'
                ? 'border-green-500/40 ring-1 ring-green-500/20'
                : ''
            }`}
            onClick={() => setSelectedPlan('free')}
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            whileHover={{ y: -4 }}
            transition={{ type: 'spring', stiffness: 300, damping: 20 }}
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold text-text-primary">{PLANS.free.name}</h3>
              {selectedPlan === 'free' && (
                <div className="w-5 h-5 rounded-full bg-green-500/20 border border-green-500/50 flex items-center justify-center">
                  <div className="w-2.5 h-2.5 rounded-full bg-green-500" />
                </div>
              )}
            </div>

            <div className="text-5xl font-bold text-text-primary mb-1 tracking-tight">
              0<span className="text-lg font-medium text-text-muted ml-1">/mois</span>
            </div>
            <p className="text-sm text-text-muted mb-8">{PLANS.free.description}</p>

            <ul className="space-y-3.5 mb-8 flex-1">
              {PLANS.free.features.map((f) => (
                <li key={f} className="flex items-center gap-3 text-sm text-text-secondary">
                  <svg className="w-4 h-4 text-green-500 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                  {f}
                </li>
              ))}
            </ul>

            <Button variant="secondary" className="w-full mt-auto" href={signupUrl}>
              Essayer gratuitement
            </Button>
            
            <div className="flex flex-wrap items-center justify-center gap-4 mt-6 opacity-60">
              {['RGPD', 'ISO 27001', 'HDS', 'SOC 2'].map((cert) => (
                <span key={cert} className="text-[10px] md:text-xs font-bold text-text-muted tracking-[0.1em] uppercase">
                  {cert}
                </span>
              ))}
            </div>
          </motion.div>

          {/* Pro */}
          <motion.div
            className={`glass card-glow rounded-2xl p-6 md:p-8 cursor-pointer transition-all duration-500 relative overflow-hidden flex flex-col ${
              selectedPlan === 'pro'
                ? 'border-green-500/40 ring-1 ring-green-500/20 shadow-[0_0_60px_rgba(34,197,94,0.1)]'
                : ''
            }`}
            onClick={() => setSelectedPlan('pro')}
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            whileHover={{ y: -4 }}
            transition={{ type: 'spring', stiffness: 300, damping: 20 }}
          >
            {/* Accent line */}
            <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-green-500/50 to-transparent" />
            <div className="absolute -top-20 -right-20 w-40 h-40 bg-green-500/10 blur-[60px] rounded-full pointer-events-none" />

            {/* Badge */}
            <div className="absolute top-4 right-4 px-3 py-1 rounded-full text-xs font-bold bg-green-500 text-black shadow-[0_0_20px_rgba(34,197,94,0.3)]">
              Recommandé
            </div>

            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold text-text-primary mt-4 sm:mt-0">{PLANS.pro.name}</h3>
            </div>

            <div className="flex items-baseline gap-2 mb-1">
              <span className="text-5xl font-bold text-text-primary tracking-tight">
                {totalPrice}
              </span>
              <span className="text-lg font-medium text-text-muted">/mois</span>
              {billing === 'annual' && (
                <span className="text-sm text-text-muted line-through ml-1">
                  {monthlyPrice * seats}
                </span>
              )}
            </div>

            <div className="flex items-center gap-2 mb-8">
              <p className="text-sm text-text-muted">
                {seats > 1 ? `${seats} postes x ${activePrice}€` : `${activePrice}€ par poste`}
                {billing === 'annual' ? ' (facturé annuellement)' : ''}
              </p>
              {billing === 'annual' && annualSavings > 0 && (
                <span className="text-xs font-bold text-green-400 bg-green-500/10 border border-green-500/20 px-2 py-0.5 rounded-full">
                  -{annualSavings}€/an
                </span>
              )}
            </div>

            <ul className="space-y-3.5 mb-8 flex-1">
              {PLANS.pro.features.map((f) => (
                <li key={f} className="flex items-start gap-3 text-sm text-text-secondary">
                  <svg className="w-5 h-5 text-green-500 shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                  <span>{f}</span>
                </li>
              ))}
            </ul>

            <Button variant="primary" className="w-full mt-auto" href={stripeUrl}>
              S'inscrire ({totalPrice}€/mois)
            </Button>
            
            <div className="flex flex-wrap items-center justify-center gap-4 mt-6 opacity-60">
              {['RGPD', 'ISO 27001', 'HDS', 'SOC 2'].map((cert) => (
                <span key={cert} className="text-[10px] md:text-xs font-bold text-text-muted tracking-[0.1em] uppercase">
                  {cert}
                </span>
              ))}
            </div>
          </motion.div>
        </div>

        {/* Value breakdown */}
        <ValueBreakdown seats={seats} pricePerSeat={activePrice} billing={billing} />

        {/* Trust line */}
        <motion.div
          className="text-center mt-10 space-y-3"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.3 }}
        >
          <p className="text-sm text-text-muted">
            Sans engagement &bull; Annulation en 1 clic &bull; Paiement sécurisé par Stripe
          </p>
          <div className="flex items-center justify-center gap-1.5">
            <svg className="w-4 h-4 text-text-muted" viewBox="0 0 24 24" fill="currentColor">
              <path d="M13.976 9.15c-2.172-.806-3.356-1.426-3.356-2.409 0-.831.683-1.305 1.901-1.305 2.227 0 4.515.858 6.09 1.631l.89-5.494C18.252.975 15.697 0 12.165 0 9.667 0 7.589.654 6.104 1.872 4.56 3.147 3.757 4.992 3.757 7.218c0 4.039 2.467 5.76 6.476 7.219 2.585.92 3.445 1.574 3.445 2.583 0 .98-.84 1.545-2.354 1.545-1.875 0-4.965-.921-6.99-2.109l-.9 5.555C5.175 22.99 8.385 24 11.714 24c2.641 0 4.843-.624 6.328-1.813 1.664-1.305 2.525-3.236 2.525-5.732 0-4.128-2.524-5.851-6.591-7.305z" />
            </svg>
            <span className="text-xs text-text-muted">Powered by Stripe</span>
          </div>
        </motion.div>
      </div>
    </section>
  )
}

/* ─── Value Breakdown ─── */

function ComparisonBar({ label, amount, maxAmount, color, delay }: {
  label: string; amount: string; maxAmount: number; color: string; delay: number
}) {
  const ref = useRef<HTMLDivElement>(null)
  const isInView = useInView(ref, { once: true })
  const numericAmount = parseFloat(amount.replace(/[^\d.]/g, ''))
  const widthPercent = (numericAmount / maxAmount) * 100

  return (
    <div ref={ref} className="space-y-2">
      <div className="flex justify-between items-baseline">
        <span className="text-sm text-text-secondary">{label}</span>
        <span className="text-sm font-bold text-text-primary">{amount}</span>
      </div>
      <div className="h-3 rounded-full bg-bg-card overflow-hidden">
        <motion.div
          className={`h-full rounded-full ${color}`}
          initial={{ width: 0 }}
          animate={isInView ? { width: `${Math.min(widthPercent, 100)}%` } : {}}
          transition={{ duration: 1.2, delay, ease: [0.16, 1, 0.3, 1] }}
        />
      </div>
    </div>
  )
}

function ValueBreakdown({ seats, pricePerSeat, billing }: { seats: number; pricePerSeat: number; billing: string }) {
  const totalMonthly = pricePerSeat * seats
  const dailyPerSeat = pricePerSeat / 30

  return (
    <motion.div
      className="mt-16 md:mt-20 max-w-5xl mx-auto w-full"
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6 }}
    >
      <div className="text-center mb-12">
        <span className="inline-block px-4 py-1.5 rounded-full text-xs font-medium tracking-wider uppercase bg-green-500/[0.08] text-green-400 border border-green-500/20 mb-4">
          Concrètement
        </span>
        <h3 className="text-2xl md:text-3xl font-bold text-text-primary">
          Ce que ça représente vraiment
        </h3>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
        <motion.div className="glass rounded-2xl p-6 md:p-8 text-center" initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.1 }}>
          <div className="w-14 h-14 rounded-2xl bg-green-500/[0.08] border border-green-500/20 flex items-center justify-center mx-auto mb-4">
            <Icon name="sparkles" className="text-green-400" size={28} />
          </div>
          <div className="text-3xl md:text-4xl font-bold text-green-400 mb-1 tracking-tight">
            <AnimatedCounter target={parseFloat(dailyPerSeat.toFixed(2))} suffix="€" />
          </div>
          <div className="text-sm font-medium text-text-primary">par poste par jour</div>
          <p className="text-xs text-text-muted mt-2">Moins cher qu'un café</p>
        </motion.div>

        <motion.div className="glass rounded-2xl p-6 md:p-8 text-center" initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.2 }}>
          <div className="w-14 h-14 rounded-2xl bg-green-500/[0.08] border border-green-500/20 flex items-center justify-center mx-auto mb-4">
            <Icon name="search" className="text-green-400" size={28} />
          </div>
          <div className="text-3xl md:text-4xl font-bold text-text-primary mb-1 tracking-tight">
            <AnimatedCounter target={3} suffix="-4h" />
          </div>
          <div className="text-sm font-medium text-text-primary">gagnées par jour</div>
          <p className="text-xs text-text-muted mt-2">Recherche, rédaction, synthèse</p>
        </motion.div>

        <motion.div className="glass rounded-2xl p-6 md:p-8 text-center" initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.3 }}>
          <div className="w-14 h-14 rounded-2xl bg-green-500/[0.08] border border-green-500/20 flex items-center justify-center mx-auto mb-4">
            <Icon name="chart-bar" className="text-green-400" size={28} />
          </div>
          <div className="text-3xl md:text-4xl font-bold text-text-primary mb-1 tracking-tight">
            <AnimatedCounter target={50} suffix="x" />
          </div>
          <div className="text-sm font-medium text-text-primary">moins cher qu'un recrutement</div>
          <p className="text-xs text-text-muted mt-2">
            Proxima : <span className="text-green-400 font-semibold">{totalMonthly}€</span> vs 3 500€/collaborateur
          </p>
        </motion.div>
      </div>

      {/* Comparison bars */}
      <motion.div className="glass rounded-2xl p-6 md:p-10" initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
        <h4 className="text-lg font-bold text-text-primary mb-1">Coût mensuel comparé</h4>
        <p className="text-sm text-text-muted mb-8">Pour {seats} poste{seats > 1 ? 's' : ''} avec IA{billing === 'annual' ? ' (facturation annuelle)' : ''}</p>

        <div className="space-y-6">
          <ComparisonBar
            label={`Proxima Entreprise (${seats} poste${seats > 1 ? 's' : ''})`}
            amount={`${totalMonthly}€`}
            maxAmount={3500}
            color="bg-gradient-to-r from-green-500 to-green-400"
            delay={0.1}
          />
          <ComparisonBar
            label="ChatGPT Team (25$/poste/mois)"
            amount={`${seats * 25}€`}
            maxAmount={3500}
            color="bg-gradient-to-r from-text-muted/40 to-text-muted/20"
            delay={0.25}
          />
          <ComparisonBar
            label="Un collaborateur supplémentaire"
            amount="3 500€"
            maxAmount={3500}
            color="bg-gradient-to-r from-red-500/60 to-red-400/40"
            delay={0.4}
          />
        </div>

        <div className="mt-8 pt-6 border-t border-border-subtle flex flex-col sm:flex-row items-center justify-center gap-3 text-center">
          <Icon name="check-badge" className="text-green-400 shrink-0" size={20} />
          <span className="text-sm text-text-secondary">
            <span className="text-green-400 font-semibold">Sur 12 mois</span> : Proxima coûte{' '}
            <span className="text-text-primary font-bold">{(totalMonthly * 12).toLocaleString('fr-FR')}€</span> —
            un collaborateur coûte <span className="text-text-primary font-bold">42 000€</span>.
            Vous économisez <span className="text-green-400 font-bold">{(42000 - totalMonthly * 12).toLocaleString('fr-FR')}€</span>.
          </span>
        </div>
      </motion.div>
    </motion.div>
  )
}
