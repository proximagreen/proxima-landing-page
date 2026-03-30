import { useState, useRef } from 'react'
import { motion, useInView } from 'framer-motion'
import { usePersonalization } from '../../context/PersonalizationContext'
import { getContent } from '../../lib/content'
import { getCheckoutUrl, getSignupUrl, PLANS } from '../../lib/stripe'
import { SectionHeading } from '../ui/SectionHeading'
import { Button } from '../ui/Button'

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

        {/* Configurateur — billing + seats en un bloc visible */}
        <motion.div
          className="glass rounded-2xl p-5 sm:p-8 max-w-xl mx-auto mb-12"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
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
                <span className="text-[10px] font-black px-2 py-0.5 rounded-full bg-green-500/20 text-green-400 border border-green-500/30">
                  -20%
                </span>
              </button>
            </div>
          </div>

          {/* Seat selector — gros et clair */}
          <div className="text-center">
            <p className="text-sm font-semibold text-text-primary mb-3">Combien de postes ?</p>
            <div className="flex flex-wrap justify-center gap-2">
              {SEAT_OPTIONS.map((n) => (
                <button
                  key={n}
                  onClick={() => setSeats(n)}
                  className={`w-12 h-12 sm:w-14 sm:h-14 rounded-xl text-base font-bold transition-all duration-300 cursor-pointer ${
                    seats === n
                      ? 'bg-green-500 text-white shadow-[0_0_20px_rgba(34,197,94,0.3)] scale-110'
                      : 'bg-bg-card border border-border-subtle text-text-secondary hover:border-green-500/40 hover:text-text-primary'
                  }`}
                >
                  {n}
                </button>
              ))}
            </div>
            {billing === 'annual' && annualSavings > 0 && (
              <p className="text-green-400 text-sm font-semibold mt-4">
                Vous économisez {annualSavings}€ par an
              </p>
            )}
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
        <ValueBreakdown seats={seats} pricePerSeat={activePrice} />

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

/* ─── Value Breakdown with Donut Charts ─── */

function ValueBreakdown({ seats, pricePerSeat }: { seats: number; pricePerSeat: number }) {
  const totalMonthly = pricePerSeat * seats
  const costPercent = Math.round((totalMonthly / 3500) * 100)

  return (
    <motion.div
      className="mt-14 max-w-4xl mx-auto w-full"
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
    >
      <h3 className="text-xl sm:text-2xl font-bold text-text-primary text-center mb-8">
        Concrètement, pour {seats} poste{seats > 1 ? 's' : ''}
      </h3>

      {/* 3 donut charts */}
      <div className="grid grid-cols-3 gap-4 sm:gap-8 mb-10">
        <DonutItem value={costPercent} label="du coût d'un recrutement" detail={`${totalMonthly}€ vs 3 500€`} color="var(--color-green-500)" />
        <DonutItem value={60} label="de temps récupéré" detail="3-4h gagnées/jour" color="var(--color-green-500)" />
        <DonutItem value={Math.round((pricePerSeat / 30) * 100) / 100 < 1 ? 100 : 0} label="de risque de fuite" detail="Isolation totale" color="var(--color-green-500)" isInverse />
      </div>

      {/* Résumé en une ligne */}
      <div className="glass rounded-xl p-4 sm:p-5 text-center">
        <p className="text-sm sm:text-base text-text-secondary">
          <span className="text-green-400 font-bold">Sur 12 mois</span> : Proxima coûte{' '}
          <span className="text-text-primary font-bold">{(totalMonthly * 12).toLocaleString('fr-FR')}€</span>. Un recrutement coûte{' '}
          <span className="text-text-primary font-bold">42 000€</span>.{' '}
          <span className="text-green-400 font-bold">Économie : {(42000 - totalMonthly * 12).toLocaleString('fr-FR')}€</span>
        </p>
      </div>
    </motion.div>
  )
}

function DonutItem({ value, label, detail, color, isInverse }: { value: number; label: string; detail: string; color: string; isInverse?: boolean }) {
  const ref = useRef<HTMLDivElement>(null)
  const isInView = useInView(ref, { once: true })
  const displayValue = isInverse ? 0 : value
  const size = 90
  const strokeWidth = 6
  const radius = (size - strokeWidth) / 2
  const circumference = radius * 2 * Math.PI
  const offset = circumference - (displayValue / 100) * circumference

  return (
    <div ref={ref} className="flex flex-col items-center text-center">
      <div className="relative mb-3" style={{ width: size, height: size }}>
        <svg width={size} height={size} className="-rotate-90">
          <circle cx={size/2} cy={size/2} r={radius} fill="none" stroke="currentColor" strokeWidth={strokeWidth} className="text-border-subtle" />
          <motion.circle
            cx={size/2} cy={size/2} r={radius} fill="none" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round"
            strokeDasharray={circumference}
            initial={{ strokeDashoffset: circumference }}
            animate={isInView ? { strokeDashoffset: offset } : {}}
            transition={{ duration: 1.2, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
          />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-lg sm:text-xl font-bold text-text-primary">{isInverse ? '0%' : `${value}%`}</span>
        </div>
      </div>
      <span className="text-xs sm:text-sm font-medium text-text-primary">{label}</span>
      <span className="text-[10px] sm:text-xs text-text-muted mt-0.5">{detail}</span>
    </div>
  )
}
