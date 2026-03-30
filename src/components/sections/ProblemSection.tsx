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
        
        {/* Simple & explicit visual comparison (Tableau) */}
        <motion.div
          className="mt-16 glass rounded-3xl p-4 md:p-8 max-w-4xl mx-auto overflow-hidden relative shadow-2xl"
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          {/* Subtle glow */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-green-500/10 blur-[80px] rounded-full pointer-events-none" />

          <div className="text-center mb-10">
            <span className="inline-block px-4 py-1.5 rounded-full text-xs font-semibold tracking-wider uppercase bg-green-500/[0.08] text-green-500 dark:text-green-400 border border-green-500/20 mb-4">
              Comparatif explicite
            </span>
            <h3 className="text-2xl md:text-3xl font-bold text-text-primary mb-3">La différence en une image</h3>
            <p className="text-text-secondary">Si simple qu'un enfant de 7 ans peut le comprendre.</p>
          </div>

          <div className="grid grid-cols-12 gap-0 border border-border-card rounded-2xl overflow-hidden bg-bg-card shadow-lg relative z-10 w-full mb-4">
            {/* Headers */}
            <div className="col-span-4 bg-bg-tertiary p-3 md:p-6 font-bold flex items-center justify-center border-b border-border-card">
              <span className="text-text-primary text-xs md:text-base text-center">Ce qui compte</span>
            </div>
            <div className="col-span-4 bg-red-500/5 p-3 md:p-6 font-bold text-center border-l border-b border-border-card flex flex-col justify-center items-center">
              <span className="text-red-600 dark:text-red-500 text-sm md:text-lg">IA Publique</span>
              <span className="text-[10px] md:text-xs text-text-muted mt-1 font-normal">(ex: ChatGPT)</span>
            </div>
            <div className="col-span-4 bg-green-500/10 p-3 md:p-6 font-bold text-center border-l border-b border-green-500/20 flex flex-col justify-center items-center backdrop-blur-sm shadow-[0_0_30px_rgba(34,197,94,0.05)]">
              <span className="text-green-600 dark:text-green-500 text-sm md:text-xl flex items-center gap-1 md:gap-2">
                <span className="relative flex h-2 w-2 md:h-3 md:w-3">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full bg-green-600 dark:bg-green-500 h-2 w-2 md:h-3 md:w-3"></span>
                </span>
                Proxima
              </span>
            </div>
            
            {/* Row 1 */}
            <div className="col-span-4 p-3 md:p-6 flex flex-col sm:flex-row items-center sm:items-center justify-center sm:justify-start gap-2 md:gap-3 bg-bg-primary/50 text-center sm:text-left">
              <div className="w-8 h-8 hidden sm:flex rounded-lg bg-bg-tertiary items-center justify-center shrink-0">
                <svg className="w-4 h-4 text-text-muted" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 002-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" /></svg>
              </div>
              <span className="font-semibold text-text-secondary text-xs md:text-sm">Hébergement des documents</span>
            </div>
            <div className="col-span-4 p-3 md:p-6 border-l border-border-card text-center flex flex-col justify-center items-center gap-2 bg-red-100/10 dark:bg-red-500/[0.02]">
              <svg className="w-5 h-5 md:w-6 md:h-6 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" /></svg>
              <span className="text-text-primary text-[10px] md:text-sm font-medium">Serveurs étrangers (USA)</span>
            </div>
            <div className="col-span-4 p-3 md:p-6 border-l border-green-500/20 text-center flex flex-col justify-center items-center gap-2 bg-green-500/[0.05]">
              <svg className="w-5 h-5 md:w-6 md:h-6 text-green-600 dark:text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 6l3 1m0 0l-3 9a5.002 5.002 0 006.001 0M6 7l3 9M6 7l6-2m6 2l3-1m-3 1l-3 9a5.002 5.002 0 006.001 0M18 7l3 9m-3-9l-6-2m0-2v2m0 16V5m0 16H9m3 0h3" /></svg>
              <span className="text-green-600 dark:text-green-400 text-[10px] md:text-sm font-bold">Cloud souverain (France)</span>
            </div>

            {/* Row 2 */}
            <div className="col-span-4 p-3 md:p-6 border-t border-border-card flex flex-col sm:flex-row items-center sm:items-center justify-center sm:justify-start gap-2 md:gap-3 bg-bg-primary/50 text-center sm:text-left">
              <div className="w-8 h-8 hidden sm:flex rounded-lg bg-bg-tertiary items-center justify-center shrink-0">
                <svg className="w-4 h-4 text-text-muted" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
              </div>
              <span className="font-semibold text-text-secondary text-xs md:text-sm">Risque de fuite de données</span>
            </div>
            <div className="col-span-4 p-3 md:p-6 border-t border-l border-border-card text-center flex flex-col justify-center items-center gap-2 bg-red-100/10 dark:bg-red-500/[0.02]">
              <div className="w-full bg-red-500/20 rounded-full h-2 md:h-3 mb-1"><div className="bg-red-500 h-2 md:h-3 rounded-full w-[95%] shadow-[0_0_10px_rgba(239,68,68,0.5)]"></div></div>
              <span className="text-text-primary text-[10px] md:text-sm font-medium">Élevé (vos données nourrissent l'IA)</span>
            </div>
            <div className="col-span-4 p-3 md:p-6 border-t border-l border-green-500/20 text-center flex flex-col justify-center items-center gap-2 bg-green-500/[0.05]">
              <div className="w-full bg-green-500/20 rounded-full h-2 md:h-3 mb-1"><div className="bg-green-500 h-2 md:h-3 rounded-full w-0"></div></div>
              <span className="text-green-600 dark:text-green-400 text-[10px] md:text-sm font-bold">Inexistant (Isolation stricte)</span>
            </div>

            {/* Row 3 */}
            <div className="col-span-4 p-3 md:p-6 border-t border-border-card flex flex-col sm:flex-row items-center justify-center sm:justify-start gap-2 md:gap-3 bg-bg-tertiary/20 text-center sm:text-left">
              <div className="w-8 h-8 hidden sm:flex rounded-lg bg-bg-tertiary items-center justify-center shrink-0">
                <svg className="w-4 h-4 text-text-muted" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
              </div>
              <span className="font-semibold text-text-secondary text-xs md:text-sm">Conformité RGPD / ISO</span>
            </div>
            <div className="col-span-4 p-3 md:p-6 border-t border-l border-border-card text-center flex flex-col justify-center items-center gap-2 bg-red-100/10 dark:bg-red-500/[0.02]">
              <svg className="w-5 h-5 xl:w-6 xl:h-6 text-red-500/60" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
              <span className="text-text-muted text-[10px] md:text-sm font-medium line-through decoration-red-500/50">Complexe voire impossible</span>
            </div>
            <div className="col-span-4 p-3 md:p-6 border-t border-l border-green-500/20 text-center flex flex-col justify-center items-center gap-2 bg-green-500/[0.05]">
              <svg className="w-5 h-5 xl:w-6 xl:h-6 text-green-600 dark:text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" /></svg>
              <span className="text-green-600 dark:text-green-400 text-[10px] md:text-sm font-bold">Validée dès le 1er jour</span>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
