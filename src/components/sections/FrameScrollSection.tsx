import { useRef } from 'react'
import { motion, useScroll, useTransform } from 'framer-motion'

/**
 * Product Demo — scroll-driven avec animations cinématiques
 * Inspiré des techniques Remotion : spring physics, interpolation, transitions en cascade
 * S'adapte au dark/light mode via les CSS variables
 */

export function FrameScrollSection() {
  const containerRef = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start start', 'end end'],
  })

  // ─── Orchestration des animations au scroll ───
  const frameOpacity = useTransform(scrollYProgress, [0, 0.06], [0, 1])
  const frameScale = useTransform(scrollYProgress, [0, 0.08], [0.9, 1])
  const frameY = useTransform(scrollYProgress, [0, 0.08], [60, 0])

  // Features qui apparaissent en cascade
  const feat1 = useTransform(scrollYProgress, [0.12, 0.22], [0, 1])
  const feat2 = useTransform(scrollYProgress, [0.25, 0.35], [0, 1])
  const feat3 = useTransform(scrollYProgress, [0.38, 0.48], [0, 1])
  const feat4 = useTransform(scrollYProgress, [0.52, 0.62], [0, 1])
  const feat5 = useTransform(scrollYProgress, [0.65, 0.75], [0, 1])

  // Textes synchronisés
  const texts = [
    { start: 0.10, text: 'Chat IA confidentiel' },
    { start: 0.25, text: 'Recherche documentaire instantanée' },
    { start: 0.38, text: 'Cloisonnement par client' },
    { start: 0.52, text: 'Agents IA personnalisés' },
    { start: 0.65, text: 'Visioconférence chiffrée' },
  ]

  // Barre de progression globale
  const progressWidth = useTransform(scrollYProgress, [0.1, 0.8], ['0%', '100%'])
  const progressOpacity = useTransform(scrollYProgress, [0, 0.08, 0.85, 0.95], [0, 1, 1, 0])

  return (
    <section ref={containerRef} className="relative h-[250vh] md:h-[350vh]">
      <div className="sticky top-0 h-screen flex items-center justify-center px-4 sm:px-6 overflow-hidden">
        <div className="relative w-full max-w-5xl mx-auto">

          {/* Glow subtil */}
          <div className="absolute inset-0 -m-16 bg-green-500/[0.04] blur-[100px] rounded-full pointer-events-none" />

          {/* Titre de section */}
          <motion.div
            className="text-center mb-6 md:mb-8"
            style={{ opacity: frameOpacity }}
          >
            <span className="inline-block px-3 py-1 rounded-full text-[10px] sm:text-xs font-medium tracking-wider uppercase bg-green-500/10 text-green-500 border border-green-500/20 mb-3">
              Démo produit
            </span>
            <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-text-primary">
              Tout ce dont vous avez besoin, en un seul endroit
            </h2>
          </motion.div>

          {/* Carte produit principale */}
          <motion.div
            className="glass rounded-xl md:rounded-2xl overflow-hidden border border-border-card"
            style={{ opacity: frameOpacity, scale: frameScale, y: frameY }}
          >
            {/* Feature cards grid */}
            <div className="grid grid-cols-1 md:grid-cols-5 min-h-[300px] md:min-h-[400px]">

              {/* Sidebar — liste des features */}
              <div className="md:col-span-2 border-b md:border-b-0 md:border-r border-border-subtle p-4 sm:p-6 flex flex-col gap-2 sm:gap-3">
                {[
                  { opacity: feat1, icon: 'M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z', label: 'Chat IA confidentiel', desc: 'Analysez, rédigez, synthétisez' },
                  { opacity: feat2, icon: 'M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z', label: 'Recherche documentaire', desc: 'Trouvez en secondes' },
                  { opacity: feat3, icon: 'M2.25 12.75V12A2.25 2.25 0 014.5 9.75h15A2.25 2.25 0 0121.75 12v.75m-8.69-6.44l-2.12-2.12a1.5 1.5 0 00-1.061-.44H4.5A2.25 2.25 0 002.25 6v12a2.25 2.25 0 002.25 2.25h15A2.25 2.25 0 0021.75 18V9a2.25 2.25 0 00-2.25-2.25h-5.379a1.5 1.5 0 01-1.06-.44z', label: 'Dossiers cloisonnés', desc: '1 dossier = 1 client' },
                  { opacity: feat4, icon: 'M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09z', label: 'Agents IA', desc: 'Automatisez vos process' },
                  { opacity: feat5, icon: 'm15.75 10.5 4.72-4.72a.75.75 0 0 1 1.28.53v11.38a.75.75 0 0 1-1.28.53l-4.72-4.72M4.5 18.75h9a2.25 2.25 0 0 0 2.25-2.25v-9a2.25 2.25 0 0 0-2.25-2.25h-9A2.25 2.25 0 0 0 2.25 7.5v9a2.25 2.25 0 0 0 2.25 2.25z', label: 'Proxima Meet', desc: 'Visio chiffrée bout en bout' },
                ].map((feat, i) => (
                  <motion.div
                    key={i}
                    className="flex items-center gap-3 p-2.5 sm:p-3 rounded-lg border border-transparent transition-colors"
                    style={{
                      opacity: feat.opacity,
                      borderColor: useTransform(feat.opacity, [0.5, 1], ['transparent', 'var(--color-border-glow)']),
                      backgroundColor: useTransform(feat.opacity, [0.5, 1], ['transparent', 'var(--color-bg-card)']),
                    }}
                  >
                    <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-lg bg-green-500/10 border border-green-500/20 flex items-center justify-center shrink-0">
                      <svg className="w-4 h-4 sm:w-5 sm:h-5 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                        <path strokeLinecap="round" strokeLinejoin="round" d={feat.icon} />
                      </svg>
                    </div>
                    <div className="min-w-0">
                      <div className="text-xs sm:text-sm font-semibold text-text-primary truncate">{feat.label}</div>
                      <div className="text-[10px] sm:text-xs text-text-muted truncate">{feat.desc}</div>
                    </div>
                  </motion.div>
                ))}
              </div>

              {/* Main area — preview dynamique */}
              <div className="md:col-span-3 p-4 sm:p-6 flex flex-col justify-center relative bg-bg-inset">
                {/* Dot grid background */}
                <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: 'radial-gradient(circle at 1px 1px, currentColor 1px, transparent 0)', backgroundSize: '20px 20px' }} />

                {/* Texte dynamique au centre */}
                <div className="relative z-10 text-center py-8 sm:py-12">
                  {texts.map((t, i) => (
                    <motion.div
                      key={i}
                      className="absolute inset-0 flex flex-col items-center justify-center px-4"
                      style={{
                        opacity: useTransform(
                          scrollYProgress,
                          [t.start - 0.02, t.start + 0.02, t.start + 0.10, t.start + 0.12],
                          [0, 1, 1, 0]
                        ),
                        y: useTransform(
                          scrollYProgress,
                          [t.start - 0.02, t.start + 0.02, t.start + 0.10, t.start + 0.12],
                          [20, 0, 0, -20]
                        ),
                      }}
                    >
                      <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-green-500/10 border border-green-500/20 flex items-center justify-center mb-4 sm:mb-5">
                        <svg className="w-7 h-7 sm:w-8 sm:h-8 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" />
                        </svg>
                      </div>
                      <p className="text-lg sm:text-xl md:text-2xl font-bold text-text-primary">{t.text}</p>
                      <p className="text-xs sm:text-sm text-text-muted mt-2">100% confidentiel. Aucune donnée partagée.</p>
                    </motion.div>
                  ))}

                  {/* Placeholder quand rien n'est visible */}
                  <motion.div
                    className="flex flex-col items-center justify-center py-4"
                    style={{ opacity: useTransform(scrollYProgress, [0, 0.08, 0.10], [1, 1, 0]) }}
                  >
                    <img src="/favicon-proxima.png" alt="" className="w-10 h-10 sm:w-12 sm:h-12 mb-3 opacity-30" />
                    <p className="text-sm text-text-muted">Scrollez pour découvrir</p>
                  </motion.div>
                </div>
              </div>
            </div>

            {/* Progress bar en bas */}
            <motion.div
              className="h-1 bg-bg-card"
              style={{ opacity: progressOpacity }}
            >
              <motion.div
                className="h-full bg-gradient-to-r from-green-500 to-green-400"
                style={{ width: progressWidth }}
              />
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
