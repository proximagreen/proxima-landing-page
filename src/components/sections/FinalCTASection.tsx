import { motion } from 'framer-motion'
import { usePersonalization } from '../../context/PersonalizationContext'
import { getCheckoutUrl, getSignupUrl } from '../../lib/stripe'
import { Button } from '../ui/Button'

export function FinalCTASection() {
  const { segment, company, name } = usePersonalization()
  const stripeUrl = getCheckoutUrl({ segment, company, name })
  const signupUrl = getSignupUrl({ segment, company, name })

  return (
    <section className="py-[var(--section-padding)] px-6 relative overflow-x-clip section-fade-top">
      {/* Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-green-500/[0.08] blur-[150px] rounded-full pointer-events-none float-orb" />

      <div className="absolute inset-0 spotlight" />

      <div className="max-w-3xl mx-auto text-center relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        >
          <h2 className="text-3xl md:text-5xl font-bold text-text-primary mb-6 leading-[1.1] tracking-[-0.02em]">
            Votre equipe est prête.<br />
            <span className="text-gradient">On y va ?</span>
          </h2>
          <p className="text-lg text-text-secondary mb-10 max-w-lg mx-auto leading-relaxed">
            {company
              ? `${company}, votre espace Proxima est configure et pret. Connectez vos equipes et commencez a delivrer plus vite.`
              : 'Votre espace est deploye, securise, et souverain. Il ne reste plus qu\'a connecter vos equipes.'
            }
          </p>

          {/* Double CTA : Stripe + essai */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Button variant="primary" size="lg" href={stripeUrl}>
              Souscrire maintenant
            </Button>
            <Button variant="secondary" size="lg" href={signupUrl}>
              Essai gratuit d'abord
            </Button>
          </div>

          {/* Ce qui est inclus */}
          <motion.div
            className="mt-10 glass rounded-xl p-6 max-w-md mx-auto text-left"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.4 }}
          >
            <h4 className="text-sm font-bold text-text-primary mb-4">Inclus dans votre service :</h4>
            <ul className="space-y-3">
              {[
                'Deploiement sur cloud souverain dedie',
                'Support prioritaire et accompagnement',
                'Mises a jour et nouvelles fonctionnalites',
                'Hebergement 100% europeen, conforme RGPD',
              ].map((item, i) => (
                <li key={i} className="flex items-start gap-2.5 text-sm text-text-secondary">
                  <svg className="w-4 h-4 text-green-500 shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                  {item}
                </li>
              ))}
            </ul>
          </motion.div>
        </motion.div>
      </div>
    </section>
  )
}
