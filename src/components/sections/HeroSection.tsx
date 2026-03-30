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
  hidden: { opacity: 0, y: 15 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: 0.1 + i * 0.03, duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] as [number, number, number, number] },
  }),
}

export function HeroSection() {
  const { segment, name, company } = usePersonalization()
  const content = getContent(segment)
  const headline = resolveHeadline(content, name, company)

  return (
    <section className="relative min-h-[100vh] flex flex-col items-center justify-start overflow-hidden pt-32 pb-20">
      {/* Background gradients instead of video */}
      <div className="absolute inset-0 z-0">
        <div className="absolute top-[15%] left-[50%] -translate-x-1/2 w-[800px] h-[600px] bg-green-500/[0.04] blur-[120px] rounded-full pointer-events-none" />
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background: 'radial-gradient(ellipse 80% 80% at 50% -20%, rgba(34,197,94,0.03) 0%, var(--color-bg-primary) 100%)',
          }}
        />
      </div>

      {/* Content */}
      <div className="relative z-10 w-full max-w-[var(--container-max)] mx-auto px-6 text-center">
        {/* Badge */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.4 }}
        >
          <span className="inline-flex items-center gap-2.5 px-5 py-2.5 rounded-full text-sm font-medium text-green-400 border border-green-500/20 bg-green-500/10 mb-8 backdrop-blur-md">
            <span className="relative w-2 h-2 rounded-full bg-green-400 pulse-dot" />
            IA Confidentielle &bull; Souveraine &bull; Compétitive
          </span>
        </motion.div>

        {/* Headline with word-by-word reveal */}
        <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight leading-[1.1] mb-8 drop-shadow-lg max-w-5xl mx-auto">
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
                    className={`inline-block ${isGreen ? 'text-gradient' : 'text-text-primary'}`}
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
          className="text-lg md:text-xl text-text-secondary max-w-2xl mx-auto mb-10 leading-relaxed opacity-90 drop-shadow-md"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.5 }}
        >
          {content.hero.subheadline}
        </motion.p>

        {/* Single dominant CTA + Trust Signals */}
        <motion.div
          className="flex flex-col items-center gap-4 mb-16"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.5 }}
        >
          <Button variant="primary" size="lg" href="#pricing">
            {content.hero.ctaPrimary}
          </Button>
          <span className="text-sm text-text-muted font-medium tracking-wide">Gratuit, sans carte bancaire</span>
          
          <div className="flex flex-wrap items-center justify-center gap-6 mt-4 opacity-70">
            {['RGPD', 'ISO 27001', 'HDS', 'SOC 2'].map((cert) => (
              <span key={cert} className="text-[10px] md:text-sm font-bold text-text-muted tracking-[0.15em] uppercase">
                {cert}
              </span>
            ))}
          </div>
        </motion.div>
        
        {/* Interactive Mockup Replacement */}
        <motion.div 
          className="w-full max-w-4xl mx-auto mt-8 mb-16 relative"
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.8 }}
        >
          {/* Subtle multi-layered glow behind the mockup */}
          <div className="absolute inset-0 -m-10 bg-green-500/[0.03] blur-[60px] rounded-full pointer-events-none" />
          
          <div className="relative rounded-xl overflow-hidden border border-border-card bg-bg-secondary flex flex-col shadow-[0_20px_60px_-15px_rgba(0,0,0,0.5),0_0_40px_rgba(34,197,94,0.05)] aspect-[16/10] md:aspect-video text-left hover:border-border-glow transition-colors duration-500">
            {/* Browser top navigation bar */}
            <div className="flex items-center gap-2 px-3 py-2 bg-[#111] border-b border-white/5 backdrop-blur-md">
              <div className="flex gap-1.5 shrink-0">
                <div className="w-2.5 h-2.5 rounded-full bg-white/20 hover:bg-red-500/80 transition-colors" />
                <div className="w-2.5 h-2.5 rounded-full bg-white/20 hover:bg-amber-400/80 transition-colors" />
                <div className="w-2.5 h-2.5 rounded-full bg-white/20 hover:bg-green-500/80 transition-colors" />
              </div>
              <div className="flex-1 flex justify-center">
                <div className="w-full max-w-sm flex items-center gap-2 px-3 py-1 rounded-md bg-[#1a1a1a] border border-white/5 text-[10px] text-white/40 shadow-inner">
                  <svg className="w-2.5 h-2.5 text-green-500/60" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                  workspace.proxima.green
                </div>
              </div>
            </div>

            {/* Dashboard Mockup Content */}
            <div className="flex flex-1 overflow-hidden relative bg-[#0a0a0ae6]">
              {/* Background dots */}
              <div className="absolute inset-0 opacity-[0.02]" style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)', backgroundSize: '24px 24px' }} />

              <div className="flex-1 p-4 flex flex-col gap-4 justify-end pb-16 z-10 w-full max-w-2xl mx-auto">
                <div className="self-end max-w-[85%] bg-green-500/15 border border-green-500/30 text-green-50 text-xs p-3 rounded-2xl rounded-tr-sm shadow-sm hover:bg-green-500/20 transition-colors cursor-default">
                  Analyse ce document et identifie les 3 risques principaux avant la réunion de 14h.
                </div>

                <div className="self-start w-[90%] bg-white/5 border border-white/10 text-white text-xs p-4 rounded-2xl rounded-tl-sm shadow-sm flex gap-3 hover:bg-white/10 transition-colors cursor-default">
                  <div className="w-6 h-6 rounded-full bg-green-500/20 flex items-center justify-center shrink-0 border border-green-500/30">
                    <svg className="w-3 h-3 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
                  </div>
                  <div>
                    <p className="mb-2 font-medium text-white/90">Voici les risques majeurs identifiés :</p>
                    <div className="space-y-2">
                      <div className="bg-black/30 rounded-lg p-2 border border-white/5">
                        <span className="text-rose-400 font-medium">1. Faille d'authentification</span>
                        <div className="w-3/4 h-1 bg-white/10 rounded mt-1.5" />
                      </div>
                      <div className="bg-black/30 rounded-lg p-2 border border-white/5">
                        <span className="text-amber-400 font-medium">2. Données non chiffrées au repos</span>
                        <div className="w-4/5 h-1 bg-white/10 rounded mt-1.5" />
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Input Bar */}
              <div className="absolute bottom-3 left-1/2 -translate-x-1/2 w-[90%] bg-[#151515] border border-white/10 rounded-full p-1 flex items-center shadow-lg z-20 hover:border-green-500/30 transition-colors group">
                <div className="w-6 h-6 rounded-full bg-white/5 flex items-center justify-center text-white/30 ml-1">
                  <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13" /></svg>
                </div>
                <div className="flex-1 mx-3 text-[10px] text-white/25">
                  Tapez un message...
                </div>
                <div className="w-6 h-6 rounded-full bg-green-500 text-black flex items-center justify-center shadow-[0_0_10px_rgba(34,197,94,0.3)] group-hover:shadow-[0_0_15px_rgba(34,197,94,0.5)] transition-shadow">
                  <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Stats - with vertical dividers */}
        <motion.div
          className="grid grid-cols-3 mt-12 bg-bg-card/80 backdrop-blur-xl rounded-2xl md:rounded-3xl py-6 md:py-8 px-4 border border-border-card shadow-2xl"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7, duration: 0.6 }}
        >
          {STATS.map((stat, idx) => (
            <div key={stat.label} className="text-center relative px-2 md:px-8">
              {idx > 0 && (
                <div className="absolute left-0 top-1/2 -translate-y-1/2 w-px h-16 bg-gradient-to-b from-transparent via-border-card to-transparent" />
              )}
              <div className="text-4xl md:text-6xl font-black text-text-primary tracking-tighter mb-2">
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
