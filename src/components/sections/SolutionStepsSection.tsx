import { motion } from 'framer-motion'
import { usePersonalization } from '../../context/PersonalizationContext'
import { getContent } from '../../lib/content'
import { SectionHeading } from '../ui/SectionHeading'
import { Icon } from '../ui/Icon'

export function SolutionStepsSection() {
  const { segment } = usePersonalization()
  const content = getContent(segment)

  return (
    <section className="py-[var(--section-padding)] px-6 relative">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-green-500/[0.04] blur-[150px] rounded-full pointer-events-none" />

      <div className="max-w-[var(--container-max)] mx-auto relative z-10">
        <SectionHeading
          badge="Comment ça marche"
          title={'3 étapes. 30 secondes.\nVous êtes opérationnel.'}
        />

        <div className="grid md:grid-cols-3 gap-8">
          {content.solutionSteps.map((step, i) => (
            <motion.div
              key={i}
              className="relative flex flex-col items-center text-center"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.2 }}
            >
              {/* Connector line */}
              {i < content.solutionSteps.length - 1 && (
                <div className="hidden md:block absolute top-10 left-[60%] w-[80%] h-px bg-gradient-to-r from-green-500/30 to-transparent" />
              )}

              {/* Step number + icon */}
              <div className="relative mb-6">
                <div className="w-20 h-20 rounded-2xl bg-green-500/10 border border-green-500/20 flex items-center justify-center">
                  <Icon name={step.icon} className="text-green-400" size={32} />
                </div>
                <div className="absolute -top-2 -right-2 w-7 h-7 rounded-full bg-green-500 text-white text-sm font-bold flex items-center justify-center">
                  {step.step}
                </div>
              </div>

              <h3 className="text-xl font-bold text-text-primary mb-3">{step.title}</h3>
              <p className="text-text-secondary leading-relaxed max-w-xs">{step.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
