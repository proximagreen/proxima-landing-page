import { motion } from 'framer-motion'
import { usePersonalization } from '../../context/PersonalizationContext'
import { getContent } from '../../lib/content'
import { SectionHeading } from '../ui/SectionHeading'

export function ProblemSection() {
  const { segment } = usePersonalization()
  const content = getContent(segment)

  return (
    <section className="py-[var(--section-padding)] px-4 sm:px-6 relative overflow-hidden">
      <div className="max-w-[var(--container-max)] mx-auto relative z-10">
        <SectionHeading
          badge="Pourquoi Proxima"
          title={'Ce que vous gagnez\nen passant a l\'IA souveraine'}
          subtitle="Les chiffres parlent d'eux-memes."
        />

        {/* Stat cards — compactes */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6 mb-12">
          {content.problems.map((problem, i) => (
            <motion.div
              key={i}
              className="glass rounded-xl p-5 sm:p-6 text-center"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: i * 0.1 }}
            >
              <div className="text-3xl sm:text-4xl font-bold mb-2 tracking-tight" style={{ color: problem.color }}>
                {problem.stat}
              </div>
              <p className="text-text-secondary text-sm leading-relaxed">{problem.text}</p>
            </motion.div>
          ))}
        </div>

        {/* Tableau comparatif — simplifié et mobile-first */}
        <motion.div
          className="glass rounded-2xl p-4 sm:p-6 max-w-3xl mx-auto"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <h3 className="text-lg sm:text-xl font-bold text-text-primary text-center mb-6">IA Publique vs Proxima</h3>

          <div className="space-y-0 divide-y divide-border-subtle">
            {[
              { label: 'Hébergement', bad: 'Serveurs USA', good: 'Cloud souverain France' },
              { label: 'Vos données', bad: 'Servent à entraîner l\'IA', good: 'Isolation totale' },
              { label: 'Conformité RGPD', bad: 'Non garanti', good: 'Certifié dès le jour 1' },
              { label: 'Cloisonnement clients', bad: 'Inexistant', good: 'Par dossier / mission' },
            ].map((row, i) => (
              <div key={i} className="grid grid-cols-3 gap-2 py-3 sm:py-4 items-center">
                <span className="text-xs sm:text-sm font-medium text-text-secondary">{row.label}</span>
                <span className="text-xs sm:text-sm text-red-400 text-center flex items-center justify-center gap-1.5">
                  <svg className="w-3.5 h-3.5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>
                  <span className="hidden sm:inline">{row.bad}</span>
                </span>
                <span className="text-xs sm:text-sm text-green-400 font-medium text-center flex items-center justify-center gap-1.5">
                  <svg className="w-3.5 h-3.5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>
                  <span className="hidden sm:inline">{row.good}</span>
                </span>
              </div>
            ))}
          </div>

          {/* Header row labels for mobile */}
          <div className="grid grid-cols-3 gap-2 mt-2 sm:hidden">
            <span />
            <span className="text-[10px] text-red-400/60 text-center">IA publique</span>
            <span className="text-[10px] text-green-400/60 text-center">Proxima</span>
          </div>
        </motion.div>

        <motion.p
          className="text-center text-base sm:text-lg text-text-secondary mt-10 max-w-xl mx-auto"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
        >
          Votre espace est <span className="text-green-400 font-semibold">pret</span>.
          Il ne reste qu'a <span className="text-text-primary font-semibold">connecter votre equipe</span>.
        </motion.p>
      </div>
    </section>
  )
}
