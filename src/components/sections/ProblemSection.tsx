import { motion } from 'framer-motion'
import { usePersonalization } from '../../context/PersonalizationContext'
import { getContent } from '../../lib/content'
import { SectionHeading } from '../ui/SectionHeading'

const icons = {
  clock: (color: string) => (
    <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10" />
      <polyline points="12 6 12 12 16 14" />
    </svg>
  ),
  leak: (color: string) => (
    <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10" />
      <path d="M17 2.5c1.5 2 2.5 5.5 2.5 9.5" />
      <path d="M12 12l5-5" />
      <path d="M14 7h3v3" />
    </svg>
  ),
  warning: (color: string) => (
    <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" />
      <line x1="12" y1="9" x2="12" y2="13" />
      <line x1="12" y1="17" x2="12.01" y2="17" />
    </svg>
  ),
}

export function ProblemSection() {
  const { segment } = usePersonalization()
  const content = getContent(segment)

  return (
    <section className="py-[var(--section-padding)] px-6 relative">
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-red-500/[0.02] to-transparent pointer-events-none" />

      <div className="max-w-[var(--container-max)] mx-auto relative z-10">
        <SectionHeading
          badge="Le problème"
          title={'Vous le savez : utiliser ChatGPT\navec des données clients, c\'est un risque'}
          subtitle="Pourtant, ne pas utiliser l'IA, c'est prendre du retard sur vos concurrents. Voici ce que ça coûte."
        />

        <div className="grid md:grid-cols-3 gap-8">
          {content.problems.map((problem, i) => (
            <motion.div
              key={i}
              className="glass rounded-2xl p-8 text-center group relative overflow-hidden"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.15 }}
            >
              {/* Icon */}
              <div className="flex justify-center mb-5">
                <div
                  className="w-20 h-20 rounded-full flex items-center justify-center"
                  style={{ backgroundColor: `${problem.color}15` }}
                >
                  {icons[problem.icon](problem.color)}
                </div>
              </div>

              {/* Stat */}
              <div
                className="text-4xl md:text-5xl font-bold mb-3 tracking-tight"
                style={{ color: problem.color }}
              >
                {problem.stat}
              </div>

              {/* Text */}
              <p className="text-text-secondary leading-relaxed mb-6 text-sm">
                {problem.text}
              </p>

              {/* Gauge bar */}
              <div className="w-full h-2 rounded-full bg-white/5 overflow-hidden">
                <motion.div
                  className="h-full rounded-full"
                  style={{ backgroundColor: problem.color }}
                  initial={{ width: 0 }}
                  whileInView={{ width: `${problem.gauge}%` }}
                  viewport={{ once: true }}
                  transition={{ duration: 1.2, delay: 0.3 + i * 0.15, ease: 'easeOut' }}
                />
              </div>
            </motion.div>
          ))}
        </div>

        <motion.p
          className="text-center text-lg text-text-secondary mt-12 max-w-2xl mx-auto"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.5 }}
        >
          La question n'est pas <span className="text-text-primary font-semibold">si</span> vous devez utiliser l'IA.
          C'est <span className="text-green-400 font-semibold">laquelle</span>.
        </motion.p>
      </div>
    </section>
  )
}
