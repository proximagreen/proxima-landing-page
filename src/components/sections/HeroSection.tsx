import { motion } from 'framer-motion'
import { usePersonalization } from '../../context/PersonalizationContext'
import { getContent, resolveHeadline } from '../../lib/content'
import { Button } from '../ui/Button'
import { AnimatedCounter } from '../ui/AnimatedCounter'

const STATS = [
  { value: 100, suffix: '%', label: 'Données privées' },
  { value: 99.9, suffix: '%', label: 'Disponibilité' },
  { value: 0, suffix: '', label: 'Données revendues' },
]

export function HeroSection() {
  const { segment, name, company } = usePersonalization()
  const content = getContent(segment)
  const headline = resolveHeadline(content, name, company)

  return (
    <section className="relative min-h-[100dvh] flex flex-col items-center justify-center overflow-hidden px-4 sm:px-6 py-24 sm:py-28 md:py-32 bg-bg-primary">
      {/* Subtle gradient background */}
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0" style={{ background: 'radial-gradient(ellipse 80% 60% at 50% 40%, rgba(0, 60, 28, 0.06) 0%, transparent 70%)' }} />
      </div>

      <div className="relative z-10 w-full max-w-4xl mx-auto text-center">
        <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
          <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-xs sm:text-sm font-medium text-green-500 border border-green-500/30 bg-green-500/10 mb-6 sm:mb-8">
            <span className="relative w-2 h-2 rounded-full bg-green-500 pulse-dot" />
            Votre espace est pret -- Souverain -- Securise
          </span>
        </motion.div>

        <motion.h1
          className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight leading-[1.1] mb-5 sm:mb-6 text-text-primary"
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, delay: 0.1 }}
        >
          {headline.split('\n').map((line, i) => (
            <span key={i} className="block">
              {line.split(' ').map((word, j) => {
                const lower = word.toLowerCase().replace(/['']/g, '')
                const isGreen = lower.includes('ia') || lower.includes('confidentielle') || lower.includes('prête.') || lower.includes('l\'action.') || lower.includes('prêt') || lower.includes('cloisonnée')
                return <span key={j} className={isGreen ? 'text-gradient' : ''}>{word} </span>
              })}
            </span>
          ))}
        </motion.h1>

        <motion.p
          className="text-base sm:text-lg md:text-xl text-text-secondary max-w-2xl mx-auto mb-8 sm:mb-10 leading-relaxed"
          initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3, duration: 0.5 }}
        >
          {content.hero.subheadline}
        </motion.p>

        {/* CTA centré */}
        <motion.div
          className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-10 sm:mb-14"
          initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4, duration: 0.5 }}
        >
          <Button variant="primary" size="lg" href="#pricing">
            {content.hero.ctaPrimary}
          </Button>
          <Button variant="secondary" size="lg" href="https://cal.com/paul-lm">
            Prendre rendez-vous
          </Button>
        </motion.div>

        {/* Stats */}
        <motion.div
          className="grid grid-cols-3 glass rounded-2xl py-5 sm:py-6 px-3 sm:px-6"
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6, duration: 0.5 }}
        >
          {STATS.map((stat, idx) => (
            <div key={stat.label} className="text-center relative px-1 sm:px-4">
              {idx > 0 && <div className="absolute left-0 top-1/2 -translate-y-1/2 w-px h-10 bg-border-subtle" />}
              <div className="text-2xl sm:text-3xl md:text-4xl font-black text-text-primary tracking-tight">
                {stat.label === 'Donnees revendues' ? '0' : <AnimatedCounter target={stat.value} suffix={stat.suffix} />}
              </div>
              <div className="text-green-500 font-semibold mt-1 uppercase tracking-wider text-[9px] sm:text-[11px]">{stat.label}</div>
            </div>
          ))}
        </motion.div>
      </div>

      {/* Scroll indicator */}
      <motion.div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-10" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.5 }}>
        <motion.div className="w-5 h-8 border-2 border-border-card rounded-full flex justify-center pt-1.5" animate={{ y: [0, 5, 0] }} transition={{ repeat: Infinity, duration: 2, ease: 'easeInOut' }}>
          <div className="w-1 h-2 bg-green-500 rounded-full" />
        </motion.div>
      </motion.div>
    </section>
  )
}
