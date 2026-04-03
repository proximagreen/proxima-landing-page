import { motion } from 'framer-motion'
import { Icon, type IconName } from '../ui/Icon'

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
      { value: '\u221E', label: 'dossiers possibles' },
    ],
    visual: 'folder',
  },
  {
    icon: 'video',
    badge: 'Proxima Meet',
    title: 'Réunion IA chiffrée.\nTranscription automatique.',
    description: 'Visioconférence avec transcription en temps réel, résumé auto et plan d\'action. Le tout chiffré de bout en bout.',
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
    description: 'Veille réglementaire, extraction de données, relecture de documents. Vos agents IA travaillent 24/7 pour vous.',
    metrics: [
      { value: '24/7', label: 'disponibilité' },
      { value: '50x', label: 'plus rapide' },
    ],
    visual: 'agents',
  },
]

function VisualBlock({ type }: { type: string }) {
  const mockups: Record<string, React.ReactNode> = {
    chat: (
      <div className="space-y-3">
        <div className="flex justify-end"><div className="bg-green-500/15 border border-green-500/30 rounded-2xl rounded-tr-sm px-4 py-2.5 max-w-[80%] text-xs text-text-primary">"Analyse les clauses de non-concurrence de ce contrat de 200 pages"</div></div>
        <div className="flex gap-2 items-start">
          <div className="w-7 h-7 rounded-full bg-green-500/20 flex items-center justify-center shrink-0 border border-green-500/30"><Icon name="sparkles" size={14} className="text-green-500" /></div>
          <div className="bg-bg-card border border-border-card rounded-2xl rounded-tl-sm px-4 py-2.5 max-w-[85%]">
            <p className="text-xs text-text-primary font-medium mb-1.5">3 clauses identifiées :</p>
            <div className="space-y-1">
              <div className="flex items-center gap-2"><div className="w-1.5 h-1.5 rounded-full bg-red-400" /><span className="text-[11px] text-text-secondary">Art. 12 : Non-concurrence 24 mois (risque élevé)</span></div>
              <div className="flex items-center gap-2"><div className="w-1.5 h-1.5 rounded-full bg-amber-400" /><span className="text-[11px] text-text-secondary">Art. 8 : Exclusivité territoriale</span></div>
              <div className="flex items-center gap-2"><div className="w-1.5 h-1.5 rounded-full bg-green-400" /><span className="text-[11px] text-text-secondary">Art. 15 : Clause standard conforme</span></div>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2 bg-bg-card border border-border-card rounded-full px-3 py-2 mt-2">
          <span className="text-[10px] text-text-muted flex-1">Posez votre question...</span>
          <div className="w-6 h-6 rounded-full bg-green-500 flex items-center justify-center"><svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg></div>
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
          { name: 'Cabinet Laurent, M&A', docs: 47, color: 'border-l-blue-400' },
          { name: 'SCI Montparnasse, Bail', docs: 23, color: 'border-l-amber-400' },
          { name: 'TechCorp, Brevets', docs: 112, color: 'border-l-purple-400' },
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
    <div className="relative group">
      <div className="absolute -inset-3 bg-green-500/[0.07] blur-2xl rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none" />
      <div className="relative w-full rounded-xl bg-bg-inset border border-border-card overflow-hidden p-4 sm:p-5 shadow-[0_0_40px_rgba(34,197,94,0.05)]">
        {mockups[type] || mockups.chat}
      </div>
    </div>
  )
}

/* ─── Mobile : cards classiques avec animation fade-in ─── */

function MobileUseCases() {
  return (
    <section className="md:hidden py-[var(--section-padding)] px-4 sm:px-6">
      <div className="max-w-2xl mx-auto">
        <div className="text-center mb-10">
          <span className="inline-block px-3 py-1 rounded-full text-[10px] sm:text-xs font-medium tracking-wider uppercase bg-green-500/10 text-green-500 border border-green-500/20 shadow-[0_0_20px_rgba(34,197,94,0.15)]">
            Ce que Proxima fait pour vous
          </span>
        </div>

        <div className="space-y-8">
          {USE_CASES.map((uc, i) => (
            <motion.div
              key={i}
              className="glass rounded-2xl p-5 sm:p-6"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-50px' }}
              transition={{ duration: 0.5, delay: 0.05 }}
            >
              <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-[11px] font-medium tracking-wider uppercase bg-green-500/10 text-green-500 border border-green-500/20 mb-4">
                <Icon name={uc.icon} size={14} className="text-green-500" />
                {uc.badge}
              </span>

              <h3 className="text-xl sm:text-2xl font-bold text-text-primary leading-tight mb-3 whitespace-pre-line">
                {uc.title}
              </h3>

              <p className="text-sm text-text-secondary leading-relaxed mb-5">
                {uc.description}
              </p>

              <div className="flex gap-4 mb-5">
                {uc.metrics.map((m, j) => (
                  <div key={j} className="px-3 py-2 rounded-lg bg-green-500/[0.05] border border-green-500/10">
                    <div className="text-xl font-black text-green-500 tracking-tight">{m.value}</div>
                    <div className="text-[10px] text-text-muted uppercase tracking-wider mt-0.5">{m.label}</div>
                  </div>
                ))}
              </div>

              <VisualBlock type={uc.visual} />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}

/* ─── Desktop : simple whileInView sections ─── */

function DesktopScrollSection() {
  return (
    <section className="hidden md:block py-[var(--section-padding)]">
      <div className="max-w-5xl mx-auto px-6">
        <motion.div
          className="text-center mb-20"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-50px' }}
          transition={{ duration: 0.5 }}
        >
          <span className="inline-block px-3 py-1 rounded-full text-xs font-medium tracking-wider uppercase bg-green-500/10 text-green-500 border border-green-500/20 shadow-[0_0_20px_rgba(34,197,94,0.15)]">
            Ce que Proxima fait pour vous
          </span>
        </motion.div>

        <div className="space-y-32">
          {USE_CASES.map((uc, i) => (
            <motion.div
              key={i}
              className="grid grid-cols-2 gap-12 items-center"
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-100px' }}
              transition={{ duration: 0.6, ease: 'easeOut' }}
            >
              <div className={i % 2 === 0 ? 'order-1' : 'order-2'}>
                <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium tracking-wider uppercase bg-green-500/10 text-green-500 border border-green-500/20 mb-5">
                  <Icon name={uc.icon} size={14} className="text-green-500" />
                  {uc.badge}
                </span>

                <h3 className="text-3xl md:text-4xl font-bold text-text-primary leading-tight mb-4 whitespace-pre-line">
                  {uc.title}
                </h3>

                <p className="text-base text-text-secondary leading-relaxed mb-6">
                  {uc.description}
                </p>

                <div className="flex gap-8">
                  {uc.metrics.map((m, j) => (
                    <div key={j} className="relative px-4 py-3 rounded-xl bg-green-500/[0.05] border border-green-500/10">
                      <div className="text-3xl font-black text-green-500 tracking-tight">{m.value}</div>
                      <div className="text-xs text-text-muted uppercase tracking-wider mt-1">{m.label}</div>
                    </div>
                  ))}
                </div>
              </div>

              <div className={i % 2 === 0 ? 'order-2' : 'order-1'}>
                <VisualBlock type={uc.visual} />
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}

/* ─── Export : mobile cards + desktop scroll ─── */

export function FrameScrollSection() {
  return (
    <>
      <MobileUseCases />
      <DesktopScrollSection />
    </>
  )
}
