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
    <section className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden pt-32 pb-20">
      {/* Video background + overlays restored */}
      <div className="absolute inset-0 z-0">
        <video
          autoPlay
          muted
          loop
          playsInline
          className="absolute inset-0 w-full h-full object-cover opacity-60"
          poster="/images/tech-abstract.jpg"
        >
          <source src="/videos/Dark_Office_Data_Dashboard_Video.mp4" type="video/mp4" />
        </video>

        <div className="absolute inset-0 bg-bg-primary/70 backdrop-blur-[2px]" />

        {/* Dynamic vignette */}
        <div
          className="absolute inset-0"
          style={{
            background: 'radial-gradient(ellipse 70% 60% at 50% 50%, transparent 0%, var(--color-bg-primary) 100%)',
          }}
        />
        
        {/* Bottom gradient fade into next section */}
        <div className="absolute bottom-0 left-0 right-0 h-40 bg-gradient-to-t from-bg-primary via-bg-primary/80 to-transparent" />
      </div>

      {/* Content */}
      <div className="relative z-10 w-full max-w-[var(--container-max)] mx-auto px-6 text-center">
        {/* Badge */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
        >
          <span className="inline-flex items-center gap-2.5 px-5 py-2.5 rounded-full text-sm font-medium text-green-700 bg-green-100 border border-green-200 dark:text-green-400 dark:border-green-500/20 dark:bg-green-500/10 mb-8 shadow-sm">
            <span className="relative w-2 h-2 rounded-full bg-green-500 dark:bg-green-400 pulse-dot" />
            IA Confidentielle &bull; Souveraine &bull; Compétitive
          </span>
        </motion.div>

        {/* Headline with powerful entrance */}
        <motion.h1 
          className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-bold tracking-tight leading-[1.05] mb-8 drop-shadow-xl max-w-6xl mx-auto text-white"
          initial={{ opacity: 0, scale: 0.95, y: 30 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
        >
          {headline.split('\n').map((line, lineIdx) => (
            <span key={lineIdx} className="block">
              {line.split(' ').map((word, wordIdx) => {
                const lower = word.toLowerCase().replace(/['']/g, '')
                const isGreen = lower.includes('ia') ||
                  lower.includes('confidentielle') ||
                  lower.includes('compétitif') ||
                  lower.includes('secrets') ||
                  lower.includes('protégez-les')
                return (
                  <span
                    key={wordIdx}
                    className={`inline-block ${isGreen ? 'text-gradient' : ''}`}
                  >
                    {word}&nbsp;
                  </span>
                )
              })}
            </span>
          ))}
        </motion.h1>

        {/* Subheadline */}
        <motion.p
          className="text-lg md:text-2xl font-medium text-white/90 max-w-3xl mx-auto mb-12 leading-relaxed opacity-90 text-shadow"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.6 }}
        >
          {content.hero.subheadline}
        </motion.p>

        {/* Single dominant CTA + Trust Signals */}
        <motion.div
          className="flex flex-col items-center gap-4 mb-20"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.6 }}
        >
          <Button variant="primary" size="lg" className="text-lg px-8 py-4 shadow-[0_0_40px_rgba(34,197,94,0.3)] hover:shadow-[0_0_60px_rgba(34,197,94,0.5)] transition-shadow" href="#pricing">
            Commencer maintenant — Gratuit
          </Button>
          <span className="text-sm font-medium text-white/70 mt-2">Démarrage immédiat, aucune carte requise</span>
          
          {/* Trust badges directly supporting the decision */}
          <div className="flex flex-wrap items-center justify-center gap-6 mt-6 opacity-90 bg-black/40 backdrop-blur-md border border-white/10 rounded-2xl px-6 py-4 shadow-sm">
            <span className="text-xs font-semibold text-white/90 mr-2 uppercase tracking-wide">Certifié :</span>
            {['RGPD', 'ISO 27001', 'HDS', 'SOC 2'].map((cert) => (
              <span key={cert} className="flex items-center gap-1.5 text-sm font-bold text-white/80">
                <svg className="w-4 h-4 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                {cert}
              </span>
            ))}
          </div>
        </motion.div>

        {/* Stats - with vertical dividers */}
        <motion.div
          className="grid grid-cols-3 mt-12 bg-black/50 backdrop-blur-xl rounded-2xl md:rounded-3xl py-6 md:py-8 px-4 border border-white/10 shadow-2xl"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7, duration: 0.6 }}
        >
          {STATS.map((stat, idx) => (
            <div key={stat.label} className="text-center relative px-2 md:px-8">
              {idx > 0 && (
                <div className="absolute left-0 top-1/2 -translate-y-1/2 w-px h-16 bg-gradient-to-b from-transparent via-white/10 to-transparent" />
              )}
              <div className="text-4xl md:text-6xl font-black text-white tracking-tighter mb-2">
                {stat.label === 'Données revendues' ? (
                  <span>0</span>
                ) : (
                  <AnimatedCounter target={stat.value} suffix={stat.suffix} />
                )}
              </div>
              <div className="text-green-400 font-semibold mt-1 uppercase tracking-widest text-[11px] md:text-[13px]">{stat.label}</div>
            </div>
          ))}
        </motion.div>

      </div>

      {/* Scroll indicator - direct child of section for correct positioning */}
      <motion.div
        className="absolute bottom-10 left-1/2 -translate-x-1/2 z-10"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2 }}
      >
        <motion.div
          className="w-6 h-10 border-2 border-border-card rounded-full flex justify-center pt-2"
          animate={{ y: [0, 6, 0] }}
          transition={{ repeat: Infinity, duration: 2, ease: 'easeInOut' }}
        >
          <div className="w-1 h-2.5 bg-green-500 rounded-full" />
        </motion.div>
      </motion.div>
    </section>
  )
}
