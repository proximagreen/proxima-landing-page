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

const wordVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: 0.3 + i * 0.08, duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] as [number, number, number, number] },
  }),
}

export function HeroSection() {
  const { segment, name, company } = usePersonalization()
  const content = getContent(segment)
  const headline = resolveHeadline(content, name, company)

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Video background + overlays */}
      <div className="absolute inset-0 z-0">
        {/* Video */}
        <video
          autoPlay
          muted
          loop
          playsInline
          className="absolute inset-0 w-full h-full object-cover"
          poster="/images/tech-abstract.jpg"
        >
          <source src="/videos/Dark_Office_Data_Dashboard_Video.mp4" type="video/mp4" />
        </video>

        {/* Dark overlay to ensure text readability */}
        <div className="absolute inset-0 bg-bg-primary/70" />

        {/* Gradient orbs on top of video for brand color */}
        <div className="absolute top-[15%] left-[20%] w-[700px] h-[700px] rounded-full bg-green-500/[0.07] blur-[140px] float-orb" />
        <div className="absolute bottom-[20%] right-[15%] w-[500px] h-[500px] rounded-full bg-green-500/[0.08] blur-[120px] float-orb-reverse" />

        {/* Radial vignette - draws focus to center */}
        <div
          className="absolute inset-0"
          style={{
            background: 'radial-gradient(ellipse 70% 60% at 50% 45%, transparent 0%, var(--color-bg-primary) 100%)',
          }}
        />

        {/* Bottom gradient fade into next section */}
        <div className="absolute bottom-0 left-0 right-0 h-60 bg-gradient-to-t from-bg-primary via-bg-primary/80 to-transparent" />
      </div>

      {/* Content */}
      <div className="relative z-10 max-w-[var(--container-max)] mx-auto px-6 text-center pt-32 pb-20">
        {/* Badge */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
        >
          <span className="inline-flex items-center gap-2.5 px-5 py-2.5 rounded-full text-sm font-medium text-green-400 border border-green-500/20 bg-green-500/[0.08] mb-8 backdrop-blur-sm">
            <span className="relative w-2 h-2 rounded-full bg-green-500 pulse-dot" />
            IA Confidentielle &bull; Souveraine &bull; Compétitive
          </span>
        </motion.div>

        {/* Headline with word-by-word reveal */}
        <h1 className="text-3xl sm:text-4xl md:text-6xl lg:text-7xl font-bold tracking-[-0.03em] leading-[1.1] mb-8">
          {headline.split('\n').map((line, lineIdx) => (
            <span key={lineIdx} className="block">
              {line.split(' ').map((word, wordIdx) => {
                const globalIdx = lineIdx * 10 + wordIdx
                const lower = word.toLowerCase().replace(/['']/g, '')
                const isGreen = lower.includes('ia') ||
                  lower.includes('confidentielle') ||
                  lower.includes('compétitif') ||
                  lower.includes('secrets') ||
                  lower.includes('protégez-les')
                return (
                  <motion.span
                    key={globalIdx}
                    className={`inline-block ${isGreen ? 'text-gradient' : ''}`}
                    variants={wordVariants}
                    initial="hidden"
                    animate="visible"
                    custom={globalIdx}
                  >
                    {word}&nbsp;
                  </motion.span>
                )
              })}
            </span>
          ))}
        </h1>

        {/* Subheadline */}
        <motion.p
          className="text-lg md:text-xl text-text-secondary max-w-2xl mx-auto mb-12 leading-relaxed"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1, duration: 0.6 }}
        >
          {content.hero.subheadline}
        </motion.p>

        {/* Single dominant CTA (+371% vs multiple CTAs) */}
        <motion.div
          className="flex flex-col items-center gap-3 mb-16"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.2, duration: 0.6 }}
        >
          <Button variant="primary" size="lg" href="#pricing">
            {content.hero.ctaPrimary}
          </Button>
          <span className="text-sm text-text-muted">Gratuit, sans carte bancaire</span>
        </motion.div>

        {/* Stats - with vertical dividers */}
        <motion.div
          className="grid grid-cols-3 mt-12 bg-bg-card backdrop-blur-md rounded-2xl md:rounded-3xl py-5 md:py-6 px-2 md:px-4 border border-border-card"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5, duration: 0.8 }}
        >
          {STATS.map((stat, idx) => (
            <div key={stat.label} className="text-center relative px-2 md:px-8">
              {idx > 0 && (
                <div className="absolute left-0 top-1/2 -translate-y-1/2 w-px h-10 bg-gradient-to-b from-transparent via-border-card to-transparent" />
              )}
              <div className="text-2xl md:text-4xl font-bold text-text-primary tracking-tight">
                {stat.label === 'Données revendues' ? (
                  <span>0</span>
                ) : (
                  <AnimatedCounter target={stat.value} suffix={stat.suffix} />
                )}
              </div>
              <div className="text-text-muted mt-1.5 uppercase tracking-wider text-[10px] md:text-[11px]">{stat.label}</div>
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
