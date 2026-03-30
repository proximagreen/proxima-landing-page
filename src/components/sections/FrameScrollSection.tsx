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

// Interface mockup pour chaque cas d'usage
function VisualBlock({ type }: { type: string }) {
  const mockups: Record<string, React.ReactNode> = {
    chat: (
      <div className="space-y-3">
        {/* User message */}
        <div className="flex justify-end"><div className="bg-green-500/15 border border-green-500/30 rounded-2xl rounded-tr-sm px-4 py-2.5 max-w-[80%] text-xs text-text-primary">"Analyse les clauses de non-concurrence de ce contrat de 200 pages"</div></div>
        {/* AI response */}
        <div className="flex gap-2 items-start">
          <div className="w-7 h-7 rounded-full bg-green-500/20 flex items-center justify-center shrink-0 border border-green-500/30"><Icon name="sparkles" size={14} className="text-green-500" /></div>
          <div className="bg-bg-card border border-border-card rounded-2xl rounded-tl-sm px-4 py-2.5 max-w-[85%]">
            <p className="text-xs text-text-primary font-medium mb-1.5">3 clauses identifiées :</p>
            <div className="space-y-1">
              <div className="flex items-center gap-2"><div className="w-1.5 h-1.5 rounded-full bg-red-400" /><span className="text-[11px] text-text-secondary">Art. 12 — Non-concurrence 24 mois (risque élevé)</span></div>
              <div className="flex items-center gap-2"><div className="w-1.5 h-1.5 rounded-full bg-amber-400" /><span className="text-[11px] text-text-secondary">Art. 8 — Exclusivité territoriale</span></div>
              <div className="flex items-center gap-2"><div className="w-1.5 h-1.5 rounded-full bg-green-400" /><span className="text-[11px] text-text-secondary">Art. 15 — Clause standard conforme</span></div>
            </div>
          </div>
        </div>
        {/* Input bar */}
        <div className="flex items-center gap-2 bg-bg-card border border-border-card rounded-full px-3 py-2 mt-2">
          <span className="text-[10px] text-text-muted flex-1">Posez votre question...</span>
          <div className="w-6 h-6 rounded-full bg-green-500 flex items-center justify-center"><svg className="w-3 h-3 text-black" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg></div>
        </div>
      </div>
    ),
    search: (
      <div className="space-y-3">
        <div className="flex items-center gap-2 bg-bg-card border border-border-card rounded-lg px-3 py-2"><Icon name="search" size={14} className="text-text-muted" /><span className="text-xs text-text-muted">jurisprudence résiliation bail commercial 2024</span></div>
        <div className="space-y-2">
          {[
            { title: 'Cass. com. 15 mars 2024', desc: 'Résiliation anticipée pour manquement grave...', tag: 'Pertinence 98%' },
            { title: 'CA Paris, 12 janv. 2024', desc: 'Obligation de délivrance et état des lieux...', tag: 'Pertinence 94%' },
            { title: 'Cass. civ. 3e, 8 nov. 2023', desc: 'Clause résolutoire et mise en demeure...', tag: 'Pertinence 89%' },
          ].map((r, i) => (
            <div key={i} className="bg-bg-card border border-border-card rounded-lg p-3 hover:border-green-500/30 transition-colors">
              <div className="flex justify-between items-start mb-1"><span className="text-xs font-semibold text-text-primary">{r.title}</span><span className="text-[9px] text-green-500 font-bold bg-green-500/10 px-1.5 py-0.5 rounded">{r.tag}</span></div>
              <p className="text-[10px] text-text-secondary">{r.desc}</p>
            </div>
          ))}
        </div>
      </div>
    ),
    folder: (
      <div className="space-y-2">
        <div className="flex items-center gap-2 mb-3"><Icon name="folder" size={16} className="text-green-500" /><span className="text-xs font-semibold text-text-primary">Dossiers clients</span></div>
        {[
          { name: 'Cabinet Laurent — M&A', docs: 47, color: 'border-l-blue-400' },
          { name: 'SCI Montparnasse — Bail', docs: 23, color: 'border-l-amber-400' },
          { name: 'TechCorp — Brevets', docs: 112, color: 'border-l-purple-400' },
        ].map((f, i) => (
          <div key={i} className={`bg-bg-card border border-border-card border-l-2 ${f.color} rounded-lg p-3 flex justify-between items-center`}>
            <div><span className="text-xs font-medium text-text-primary block">{f.name}</span><span className="text-[10px] text-text-muted">{f.docs} documents</span></div>
            <Icon name="shield" size={14} className="text-green-500" />
          </div>
        ))}
        <div className="bg-green-500/5 border border-green-500/20 rounded-lg p-2 mt-1 flex items-center gap-2"><Icon name="lock" size={12} className="text-green-500" /><span className="text-[10px] text-green-500 font-medium">Isolation stricte entre dossiers</span></div>
      </div>
    ),
    meet: (
      <div className="space-y-3">
        <div className="bg-bg-inset rounded-lg aspect-video flex items-center justify-center relative border border-border-card">
          <div className="grid grid-cols-2 gap-1 p-2 w-full h-full">
            {[1, 2, 3, 4].map(i => (<div key={i} className="bg-bg-card rounded border border-border-card flex items-center justify-center"><div className="w-6 h-6 rounded-full bg-text-muted/20" /></div>))}
          </div>
          <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-2">
            <div className="w-6 h-6 rounded-full bg-bg-card border border-border-card flex items-center justify-center"><Icon name="video" size={10} className="text-green-500" /></div>
            <div className="w-6 h-6 rounded-full bg-red-500/80 flex items-center justify-center"><svg className="w-2.5 h-2.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg></div>
          </div>
          <div className="absolute top-2 right-2 bg-green-500/15 border border-green-500/30 rounded px-1.5 py-0.5 flex items-center gap-1"><div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" /><span className="text-[8px] text-green-400 font-bold">E2E</span></div>
        </div>
        <div className="bg-bg-card border border-border-card rounded-lg p-2.5"><span className="text-[10px] font-semibold text-text-primary block mb-1">Transcription en direct</span><span className="text-[10px] text-text-secondary">"...concernant la clause de non-concurrence, je propose de réduire la durée à 12 mois conformément à..."</span></div>
      </div>
    ),
    agents: (
      <div className="space-y-2">
        {[
          { name: 'Agent Veille Réglementaire', status: 'Actif', statusColor: 'bg-green-500', desc: 'Scan des nouvelles réglementations RGPD...', progress: 78 },
          { name: 'Agent Extraction', status: 'En cours', statusColor: 'bg-amber-400', desc: 'Extraction des clauses de 3 contrats...', progress: 45 },
          { name: 'Agent Relecture', status: 'Terminé', statusColor: 'bg-blue-400', desc: '12 documents relus, 3 alertes signalées', progress: 100 },
        ].map((a, i) => (
          <div key={i} className="bg-bg-card border border-border-card rounded-lg p-3">
            <div className="flex justify-between items-center mb-1.5"><span className="text-xs font-semibold text-text-primary">{a.name}</span><span className="flex items-center gap-1"><div className={`w-1.5 h-1.5 rounded-full ${a.statusColor}`} /><span className="text-[9px] text-text-muted">{a.status}</span></span></div>
            <p className="text-[10px] text-text-secondary mb-2">{a.desc}</p>
            <div className="h-1 rounded-full bg-border-subtle overflow-hidden"><div className="h-full rounded-full bg-green-500 transition-all duration-1000" style={{ width: `${a.progress}%` }} /></div>
          </div>
        ))}
      </div>
    ),
  }

  return (
    <div className="w-full rounded-xl bg-bg-inset border border-border-card overflow-hidden p-4 sm:p-5">
      {mockups[type] || mockups.chat}
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
            <VisualBlock type={useCase.visual} />
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
    <section ref={containerRef} style={{ height: `${USE_CASES.length * 150 + 80}vh` }} className="relative">
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
