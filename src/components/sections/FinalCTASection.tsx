import { motion } from 'framer-motion'
import { usePersonalization } from '../../context/PersonalizationContext'
import { Button } from '../ui/Button'

export function FinalCTASection() {
  const { company } = usePersonalization()

  return (
    <section className="py-[var(--section-padding)] px-6 relative overflow-hidden section-fade-top">
      {/* Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-green-500/[0.04] blur-[150px] rounded-full pointer-events-none" />

      <div className="max-w-3xl mx-auto text-center relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        >
          <h2 className="text-3xl md:text-5xl font-bold text-text-primary mb-6 leading-[1.1] tracking-[-0.02em]">
            Votre équipe est prête.<br />
            <span className="text-gradient">On y va ?</span>
          </h2>
          <p className="text-lg text-text-secondary mb-10 max-w-lg mx-auto leading-relaxed">
            {company
              ? `${company}, votre espace Proxima est configuré et prêt. Connectez vos équipes et commencez à délivrer plus vite.`
              : 'Votre espace est déployé, sécurisé, et souverain. Il ne reste plus qu\'à connecter vos équipes.'
            }
          </p>

          <div className="flex items-center justify-center">
            <Button variant="primary" size="lg" href="#configurateur">
              Accéder à mon espace
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
            <h4 className="text-sm font-bold text-text-primary mb-4">Inclus dans votre accès :</h4>
            <ul className="space-y-3">
              {[
                'Déploiement sur cloud souverain dédié',
                'Support prioritaire et accompagnement',
                'Mises à jour et nouvelles fonctionnalités',
                'Hébergement 100% européen, conforme RGPD',
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
