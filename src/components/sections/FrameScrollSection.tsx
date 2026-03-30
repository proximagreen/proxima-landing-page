import { useRef } from 'react'
import { motion, useScroll, useTransform } from 'framer-motion'

const SCROLL_TEXTS = [
  { progress: 0.1, text: 'Votre espace de travail IA, prêt en 30 secondes' },
  { progress: 0.3, text: 'Chat intelligent, recherche documentaire, visioconférence' },
  { progress: 0.5, text: 'Vos données ne quittent jamais votre cloud souverain' },
  { progress: 0.7, text: 'Une interface pensée pour la productivité' },
  { progress: 0.9, text: 'Proxima Chat + Meet + Agents — tout en un' },
]

function ScrollText({ progress, item }: { progress: ReturnType<typeof useScroll>['scrollYProgress']; item: typeof SCROLL_TEXTS[0] }) {
  const opacity = useTransform(
    progress,
    [
      Math.max(0, item.progress - 0.08),
      item.progress,
      Math.min(1, item.progress + 0.08),
      Math.min(1, item.progress + 0.16),
    ],
    [0, 1, 1, 0]
  )

  const y = useTransform(
    progress,
    [
      Math.max(0, item.progress - 0.08),
      item.progress,
      Math.min(1, item.progress + 0.08),
    ],
    [20, 0, -20]
  )

  return (
    <motion.div
      className="absolute left-0 right-0 bottom-[-80px] md:bottom-[-90px] text-center px-4"
      style={{ opacity, y }}
    >
      <p className="text-lg md:text-2xl lg:text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-text-primary via-green-400 to-text-secondary tracking-tight">
        {item.text}
      </p>
    </motion.div>
  )
}

export function FrameScrollSection() {
  const containerRef = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start start', 'end end'],
  })

  // Frame entrance animation
  const frameOpacity = useTransform(scrollYProgress, [0, 0.05], [0, 1])
  const frameScale = useTransform(scrollYProgress, [0, 0.1], [0.95, 1])

  // UI state animations inside the mockup
  const chatBubble1Opacity = useTransform(scrollYProgress, [0.15, 0.25], [0, 1])
  const chatBubble1Y = useTransform(scrollYProgress, [0.15, 0.25], [20, 0])

  const chatBubble2Opacity = useTransform(scrollYProgress, [0.25, 0.35], [0, 1])
  const chatBubble2Y = useTransform(scrollYProgress, [0.25, 0.35], [20, 0])

  const agentPanelX = useTransform(scrollYProgress, [0.4, 0.5], [100, 0])
  const agentPanelOpacity = useTransform(scrollYProgress, [0.4, 0.5], [0, 1])

  return (
    <section ref={containerRef} className="relative h-[250vh] md:h-[400vh] bg-bg-primary">
      <div className="sticky top-0 h-screen flex items-center justify-center">
        <div className="relative w-full max-w-6xl mx-auto px-4 md:px-8">

          {/* Multi-layered glow behind the frame */}
          <div className="absolute inset-0 -m-20 md:-m-32 bg-green-500/[0.06] blur-[100px] md:blur-[120px] rounded-full float-orb pointer-events-none" />
          <div className="absolute inset-0 -m-10 md:-m-16 bg-emerald-500/[0.03] blur-[60px] md:blur-[80px] rounded-full float-orb-reverse pointer-events-none" />

          {/* Browser frame */}
          <motion.div
            className="relative rounded-xl md:rounded-2xl overflow-hidden border border-border-card bg-[#0a0a0a] aspect-[16/10] md:aspect-video flex flex-col"
            style={{
              opacity: frameOpacity,
              scale: frameScale,
              boxShadow: '0 25px 80px -12px rgba(0, 0, 0, 0.6), 0 0 60px rgba(34, 197, 94, 0.06)',
            }}
          >
            {/* Browser top navigation bar */}
            <div className="flex items-center gap-2 md:gap-3 px-3 md:px-4 py-2 md:py-3 bg-[#111] border-b border-white/5 backdrop-blur-md">
              <div className="flex gap-1.5 md:gap-2 shrink-0">
                <div className="w-2.5 h-2.5 md:w-3 md:h-3 rounded-full bg-white/20" />
                <div className="w-2.5 h-2.5 md:w-3 md:h-3 rounded-full bg-white/20" />
                <div className="w-2.5 h-2.5 md:w-3 md:h-3 rounded-full bg-white/20" />
              </div>
              <div className="flex-1 max-w-2xl mx-auto flex justify-center">
                <div className="w-full max-w-xs md:max-w-sm flex items-center gap-2 px-3 md:px-4 py-1 md:py-1.5 rounded-md bg-[#1a1a1a] border border-white/5 text-[10px] md:text-xs text-white/40">
                  <svg className="w-2.5 h-2.5 md:w-3 md:h-3 text-green-500/60 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                  workspace.proxima.green
                </div>
              </div>
            </div>

            {/* Dashboard Mockup Content */}
            <div className="flex flex-1 overflow-hidden relative">
              {/* Sidebar */}
              <div className="hidden md:flex flex-col w-64 border-r border-white/5 bg-[#0d0d0d] p-4">
                <div className="flex items-center gap-2.5 mb-8 px-2">
                  <img src="/favicon-proxima.png" alt="Proxima" width={20} height={20} className="w-5 h-5" />
                  <span className="font-semibold text-white/90 text-sm tracking-tight">Proxima Space</span>
                </div>

                <div className="space-y-1">
                  <div className="px-3 py-2 rounded-lg bg-green-500/10 text-green-400 text-sm font-medium border border-green-500/20 flex items-center gap-2">
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" /></svg>
                    Chat IA
                  </div>
                  <div className="px-3 py-2 rounded-lg text-white/40 hover:text-white hover:bg-white/5 text-sm font-medium transition-colors flex items-center gap-2">
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
                    Documents
                  </div>
                  <div className="px-3 py-2 rounded-lg text-white/40 hover:text-white hover:bg-white/5 text-sm font-medium transition-colors flex items-center gap-2">
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" /></svg>
                    Proxima Meet
                  </div>
                </div>
              </div>

              {/* Main Chat Area */}
              <div className="flex-1 flex flex-col relative bg-[#0a0a0ae6]">
                {/* Background dots */}
                <div className="absolute inset-0 opacity-[0.02]" style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)', backgroundSize: '24px 24px' }} />

                <div className="flex-1 p-4 md:p-6 flex flex-col gap-4 md:gap-6 justify-end pb-20 md:pb-24 z-10 w-full max-w-3xl mx-auto">
                  {/* User Message */}
                  <motion.div
                    className="self-end max-w-[85%] md:max-w-md bg-green-500/15 border border-green-500/30 text-green-50 text-xs md:text-sm p-3 md:p-4 rounded-2xl rounded-tr-sm shadow-sm"
                    style={{ opacity: chatBubble1Opacity, y: chatBubble1Y }}
                  >
                    Analyse ce document et identifie les 3 risques principaux avant la réunion de 14h.
                  </motion.div>

                  {/* AI Response */}
                  <motion.div
                    className="self-start max-w-[90%] md:max-w-xl bg-white/5 border border-white/10 text-white text-xs md:text-sm p-4 md:p-5 rounded-2xl rounded-tl-sm shadow-sm flex gap-3 md:gap-4"
                    style={{ opacity: chatBubble2Opacity, y: chatBubble2Y }}
                  >
                    <div className="w-7 h-7 md:w-8 md:h-8 rounded-full bg-green-500/20 flex items-center justify-center shrink-0 border border-green-500/30">
                      <svg className="w-3.5 h-3.5 md:w-4 md:h-4 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
                    </div>
                    <div>
                      <p className="mb-2 md:mb-3 font-medium text-white/90">Voici les risques majeurs identifiés :</p>
                      <div className="space-y-2 md:space-y-3">
                        <div className="bg-black/30 rounded-lg p-2 md:p-3 border border-white/5">
                          <span className="text-rose-400 font-medium">1. Faille d'authentification</span>
                          <div className="w-3/4 h-1.5 md:h-2 bg-white/10 rounded mt-1.5 md:mt-2" />
                        </div>
                        <div className="bg-black/30 rounded-lg p-2 md:p-3 border border-white/5">
                          <span className="text-amber-400 font-medium">2. Données non chiffrées au repos</span>
                          <div className="w-4/5 h-1.5 md:h-2 bg-white/10 rounded mt-1.5 md:mt-2" />
                        </div>
                      </div>
                    </div>
                  </motion.div>
                </div>

                {/* Input Bar */}
                <div className="absolute bottom-4 md:bottom-6 left-1/2 -translate-x-1/2 w-[92%] md:w-[90%] max-w-2xl bg-[#151515] border border-white/10 rounded-full p-1.5 md:p-2 flex items-center shadow-lg z-20">
                  <div className="w-7 h-7 md:w-8 md:h-8 rounded-full bg-white/5 flex items-center justify-center text-white/30 ml-1">
                    <svg className="w-3.5 h-3.5 md:w-4 md:h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13" /></svg>
                  </div>
                  <div className="flex-1 mx-3 md:mx-4 text-xs md:text-sm text-white/25">
                    Tapez un message...
                  </div>
                  <div className="w-8 h-8 md:w-10 md:h-10 rounded-full bg-green-500 text-black flex items-center justify-center shadow-[0_0_15px_rgba(34,197,94,0.4)]">
                    <svg className="w-3.5 h-3.5 md:w-4 md:h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg>
                  </div>
                </div>
              </div>

              {/* Slide-in Agent Panel */}
              <motion.div
                className="hidden lg:block w-72 bg-[#0d0d0d] border-l border-white/5 absolute right-0 top-0 bottom-0 shadow-2xl z-30"
                style={{ x: agentPanelX, opacity: agentPanelOpacity }}
              >
                <div className="p-4 border-b border-white/5 bg-[#111]">
                  <h4 className="text-sm font-semibold text-white">Agents Actifs</h4>
                </div>
                <div className="p-4 space-y-3">
                  <div className="p-3 rounded-lg border border-green-500/30 bg-green-500/5 relative overflow-hidden">
                    <div className="absolute top-0 left-0 w-1 h-full bg-green-500" />
                    <div className="flex justify-between items-start mb-1">
                      <span className="text-xs font-bold text-green-400">Agent Sécurité</span>
                      <span className="flex h-2 w-2 rounded-full bg-green-500" />
                    </div>
                    <p className="text-[11px] text-white/50">Analyse en cours...</p>
                  </div>
                  <div className="p-3 rounded-lg border border-white/10 bg-white/5">
                    <div className="flex justify-between items-start mb-1">
                      <span className="text-xs font-bold text-white/80">Agent Juridique</span>
                    </div>
                    <p className="text-[11px] text-white/30">En veille</p>
                  </div>
                </div>
              </motion.div>
            </div>
          </motion.div>

          {/* Scroll texts overlaid at bottom */}
          {SCROLL_TEXTS.map((item, i) => (
            <ScrollText key={i} progress={scrollYProgress} item={item} />
          ))}
        </div>

        {/* Scroll progress indicator */}
        <motion.div
          className="absolute right-4 md:right-8 top-1/2 -translate-y-1/2 w-[3px] h-24 rounded-full bg-border-subtle overflow-hidden"
          style={{ opacity: useTransform(scrollYProgress, [0, 0.05, 0.95, 1], [0, 1, 1, 0]) }}
        >
          <motion.div
            className="w-full bg-green-500 rounded-full origin-top"
            style={{ height: useTransform(scrollYProgress, [0, 1], ['0%', '100%']) }}
          />
        </motion.div>
      </div>
    </section>
  )
}
