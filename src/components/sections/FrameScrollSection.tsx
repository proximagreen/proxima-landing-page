import { useRef } from 'react'
import { motion, useScroll, useTransform } from 'framer-motion'
import { Icon, type IconName } from '../ui/Icon'

/**
 * Apple-style scroll demo — sticky pinned sections with cinematic reveals.
 *
 * Chaque cas d'usage a sa propre "scène" qui entre et sort au scroll.
 * La zone visuelle reste fixe (sticky) pendant que le contenu change.
 */

interface UseCase {
  icon: IconName
  badge: string
  title: string
  description: string
  metrics: { value: string; label: string }[]
  visual: 'chat' | 'search' | 'folder' | 'meet' | 'agents'
}

const USE_CASES: UseCase[] = [
  {
    icon: 'chat',
    badge: 'Chat IA',
    title: 'Analysez un contrat\nen 3 minutes',
    description: 'Votre client vous envoie 200 pages. Proxima les lit, identifie les risques, et rédige une synthèse. En toute confidentialité.',
    metrics: [
      { value: '3 min', label: 'au lieu de 4h' },
      { value: '0', label: 'données partagées' },
    ],
    visual: 'chat',
  },
  {
    icon: 'search',
    badge: 'Recherche IA',
    title: 'Trouvez la jurisprudence\nen 10 secondes',
    description: 'Plus besoin de fouiller Dalloz pendant des heures. Posez votre question, obtenez la réponse sourcée instantanément.',
    metrics: [
      { value: '10s', label: 'de recherche' },
      { value: '100%', label: 'sources vérifiables' },
    ],
    visual: 'search',
  },
  {
    icon: 'folder',
    badge: 'Cloisonnement',
    title: 'Un dossier par client.\nÉtanche.',
    description: 'Les données du client A ne croisent jamais celles du client B. Chaque dossier est un environnement isolé.',
    metrics: [
      { value: '0%', label: 'contamination croisée' },
      { value: '∞', label: 'dossiers possibles' },
    ],
    visual: 'folder',
  },
  {
    icon: 'video',
    badge: 'Proxima Meet',
    title: 'Réunion IA chiffrée.\nTranscription automatique.',
    description: 'Visioconférence avec transcription en temps réel, résumé auto et plan d\'action — le tout chiffré de bout en bout.',
    metrics: [
      { value: 'E2E', label: 'chiffrement' },
      { value: 'Auto', label: 'compte-rendu' },
    ],
    visual: 'meet',
  },
  {
    icon: 'sparkles',
    badge: 'Agents IA',
    title: 'Automatisez vos process\nles plus chronophages',
    description: 'Veille réglementaire, extraction de données, relecture de documents — vos agents IA travaillent 24/7 pour vous.',
    metrics: [
      { value: '24/7', label: 'disponibilité' },
      { value: '50x', label: 'plus rapide' },
    ],
    visual: 'agents',
  },
]

// Petite illustration abstraite pour chaque cas d'usage
function VisualBlock({ type, progress }: { type: string; progress: number }) {
  return (
    <div className="relative w-full aspect-[4/3] rounded-xl bg-bg-inset border border-border-card overflow-hidden">
      {/* Dot grid */}
      <div className="absolute inset-0 opacity-[0.04]" style={{ backgroundImage: 'radial-gradient(circle at 1px 1px, currentColor 1px, transparent 0)', backgroundSize: '16px 16px' }} />

      {/* Animated bars representing data */}
      <div className="absolute inset-0 flex items-end justify-center gap-2 p-6 pb-8">
        {[0.3, 0.6, 0.45, 0.8, 0.55, 0.7, 0.4, 0.9].map((h, i) => (
          <motion.div
            key={i}
            className="flex-1 rounded-t-md bg-gradient-to-t from-green-500/40 to-green-500/20"
            style={{
              height: `${h * progress * 100}%`,
              opacity: 0.3 + progress * 0.7,
              transition: 'height 0.6s cubic-bezier(0.16, 1, 0.3, 1)',
            }}
          />
        ))}
      </div>

      {/* Central icon */}
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-bg-primary/80 backdrop-blur-sm border border-border-card flex items-center justify-center shadow-lg">
          <Icon name={type as IconName} className="text-green-500" size={32} />
        </div>
      </div>

      {/* Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-32 h-32 bg-green-500/10 blur-[60px] rounded-full pointer-events-none" style={{ opacity: progress }} />
    </div>
  )
}

function UseCaseScene({ useCase, index, scrollYProgress }: { useCase: UseCase; index: number; scrollYProgress: ReturnType<typeof useScroll>['scrollYProgress'] }) {
  const total = USE_CASES.length
  const sectionSize = 0.85 / total
  const start = 0.08 + index * sectionSize
  const mid = start + sectionSize * 0.15
  const peak = start + sectionSize * 0.5
  const end = start + sectionSize * 0.85
  const out = start + sectionSize

  const opacity = useTransform(scrollYProgress, [start, mid, peak, end, out], [0, 1, 1, 1, 0])
  const y = useTransform(scrollYProgress, [start, mid, end, out], [60, 0, 0, -40])
  const scale = useTransform(scrollYProgress, [start, mid, end, out], [0.95, 1, 1, 0.98])
  const visualProgress = useTransform(scrollYProgress, [start, peak], [0, 1])

  return (
    <motion.div
      className="absolute inset-0 flex items-center justify-center px-4 sm:px-6"
      style={{ opacity, y, scale }}
    >
      <div className="w-full max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-12 items-center">
        {/* Text side */}
        <div className={`${index % 2 === 0 ? 'md:order-1' : 'md:order-2'}`}>
          <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-[11px] sm:text-xs font-medium tracking-wider uppercase bg-green-500/10 text-green-500 border border-green-500/20 mb-4 sm:mb-5">
            <Icon name={useCase.icon} size={14} className="text-green-500" />
            {useCase.badge}
          </span>

          <h3 className="text-2xl sm:text-3xl md:text-4xl font-bold text-text-primary leading-tight mb-4 whitespace-pre-line">
            {useCase.title}
          </h3>

          <p className="text-sm sm:text-base text-text-secondary leading-relaxed mb-6">
            {useCase.description}
          </p>

          {/* Metrics */}
          <div className="flex gap-6 sm:gap-8">
            {useCase.metrics.map((m, i) => (
              <div key={i}>
                <div className="text-2xl sm:text-3xl font-black text-green-500 tracking-tight">{m.value}</div>
                <div className="text-[11px] sm:text-xs text-text-muted uppercase tracking-wider mt-1">{m.label}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Visual side */}
        <div className={`${index % 2 === 0 ? 'md:order-2' : 'md:order-1'}`}>
          <motion.div style={{ opacity: useTransform(opacity, [0, 0.5], [0, 1]) }}>
            <VisualBlock type={useCase.visual} progress={visualProgress.get()} />
          </motion.div>
        </div>
      </div>
    </motion.div>
  )
}

export function FrameScrollSection() {
  const containerRef = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start start', 'end end'],
  })

  // Progress indicator
  const progressWidth = useTransform(scrollYProgress, [0.05, 0.9], ['0%', '100%'])
  const progressOpacity = useTransform(scrollYProgress, [0, 0.05, 0.9, 1], [0, 1, 1, 0])

  return (
    <section ref={containerRef} style={{ height: `${USE_CASES.length * 100 + 50}vh` }} className="relative">
      <div className="sticky top-0 h-screen flex flex-col">
        {/* Section header — visible au début */}
        <motion.div
          className="text-center pt-20 sm:pt-24 pb-4"
          style={{
            opacity: useTransform(scrollYProgress, [0, 0.04, 0.06], [0, 1, 1]),
          }}
        >
          <span className="inline-block px-3 py-1 rounded-full text-[10px] sm:text-xs font-medium tracking-wider uppercase bg-green-500/10 text-green-500 border border-green-500/20 mb-2">
            Ce que Proxima fait pour vous
          </span>
        </motion.div>

        {/* Scenes container */}
        <div className="flex-1 relative overflow-hidden">
          {USE_CASES.map((uc, i) => (
            <UseCaseScene
              key={i}
              useCase={uc}
              index={i}
              scrollYProgress={scrollYProgress}
            />
          ))}
        </div>

        {/* Progress bar bottom */}
        <motion.div
          className="h-1 mx-auto w-full max-w-md bg-border-subtle rounded-full mb-6 overflow-hidden"
          style={{ opacity: progressOpacity }}
        >
          <motion.div
            className="h-full bg-gradient-to-r from-green-500 to-green-400 rounded-full"
            style={{ width: progressWidth }}
          />
        </motion.div>

        {/* Dots navigation */}
        <motion.div
          className="flex items-center justify-center gap-2 pb-6"
          style={{ opacity: progressOpacity }}
        >
          {USE_CASES.map((_, i) => {
            const sectionSize = 0.85 / USE_CASES.length
            const start = 0.08 + i * sectionSize
            const mid = start + sectionSize * 0.5
            return (
              <motion.div
                key={i}
                className="w-2 h-2 rounded-full transition-colors duration-300"
                style={{
                  backgroundColor: useTransform(
                    scrollYProgress,
                    [start, mid, start + sectionSize],
                    ['var(--color-border-subtle)', 'var(--color-green-500)', 'var(--color-border-subtle)']
                  ),
                  scale: useTransform(
                    scrollYProgress,
                    [start, mid, start + sectionSize],
                    [1, 1.5, 1]
                  ),
                }}
              />
            )
          })}
        </motion.div>
      </div>
    </section>
  )
}
