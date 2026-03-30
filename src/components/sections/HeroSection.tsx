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
    <section className="relative min-h-[100dvh] flex flex-col items-center justify-center overflow-hidden px-4 sm:px-6 py-24 sm:py-28 md:py-32">
      {/* Video background */}
      <div className="absolute inset-0 z-0">
        <video
          autoPlay muted loop playsInline
          className="absolute inset-0 w-full h-full object-cover opacity-50"
          poster="/images/tech-abstract.jpg"
        >
          <source src="/videos/Dark_Office_Data_Dashboard_Video.mp4" type="video/mp4" />
        </video>
        <div className="absolute inset-0 bg-bg-primary/75" />
        <div className="absolute inset-0" style={{ background: 'radial-gradient(ellipse 70% 60% at 50% 50%, transparent 0%, var(--color-bg-primary) 100%)' }} />
        <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-bg-primary to-transparent" />
      </div>

      {/* Content — taille réduite pour laptop */}
      <div className="relative z-10 w-full max-w-4xl mx-auto text-center">
        {/* Badge */}
        <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
          <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-xs sm:text-sm font-medium text-green-400 border border-green-500/20 bg-green-500/10 mb-6 sm:mb-8">
            <span className="relative w-2 h-2 rounded-full bg-green-400 pulse-dot" />
            IA Confidentielle &bull; Souveraine &bull; Compétitive
          </span>
        </motion.div>

        {/* Headline — tailles réduites */}
        <motion.h1
          className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight leading-[1.1] mb-5 sm:mb-6 text-white"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.1 }}
        >
          {headline.split('\n').map((line, i) => {
            return (
              <span key={i} className="block">
                {line.split(' ').map((word, j) => {
                  const lower = word.toLowerCase().replace(/['']/g, '')
                  const isGreen = lower.includes('ia') || lower.includes('confidentielle') || lower.includes('compétitif') || lower.includes('secrets') || lower.includes('protégez-les')
                  return <span key={j} className={isGreen ? 'text-gradient' : ''}>{word} </span>
                })}
              </span>
            )
          })}
        </motion.h1>

        {/* Subheadline */}
        <motion.p
          className="text-base sm:text-lg md:text-xl text-white/85 max-w-2xl mx-auto mb-8 sm:mb-10 leading-relaxed"
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.5 }}
        >
          {content.hero.subheadline}
        </motion.p>

        {/* CTA */}
        <motion.div
          className="flex flex-col items-center gap-3 mb-10 sm:mb-14"
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.5 }}
        >
          <Button variant="primary" size="lg" href="#pricing">
            Commencer maintenant — Gratuit
          </Button>
          <span className="text-xs sm:text-sm text-white/60">Démarrage immédiat, aucune carte requise</span>
        </motion.div>

        {/* Stats */}
        <motion.div
          className="grid grid-cols-3 bg-black/40 backdrop-blur-xl rounded-2xl py-5 sm:py-6 px-3 sm:px-6 border border-white/10"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.5 }}
        >
          {STATS.map((stat, idx) => (
            <div key={stat.label} className="text-center relative px-1 sm:px-4">
              {idx > 0 && (
                <div className="absolute left-0 top-1/2 -translate-y-1/2 w-px h-10 bg-white/10" />
              )}
              <div className="text-2xl sm:text-3xl md:text-4xl font-black text-white tracking-tight">
                {stat.label === 'Données revendues' ? '0' : <AnimatedCounter target={stat.value} suffix={stat.suffix} />}
              </div>
              <div className="text-green-400 font-semibold mt-1 uppercase tracking-wider text-[9px] sm:text-[11px]">{stat.label}</div>
            </div>
          ))}
        </motion.div>
      </div>

      {/* Scroll indicator */}
      <motion.div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-10" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.5 }}>
        <motion.div className="w-5 h-8 border-2 border-white/20 rounded-full flex justify-center pt-1.5" animate={{ y: [0, 5, 0] }} transition={{ repeat: Infinity, duration: 2, ease: 'easeInOut' }}>
          <div className="w-1 h-2 bg-green-500 rounded-full" />
        </motion.div>
      </motion.div>
    </section>
  )
}
