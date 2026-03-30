import { useEffect, useRef, useCallback } from 'react'
import { useScroll, useTransform, useMotionValueEvent, motion } from 'framer-motion'

const FRAME_COUNT = 120
const FRAME_PATH = (i: number) => `/frames/frame_${String(i + 1).padStart(4, '0')}.webp`

const SCROLL_TEXTS = [
  { progress: 0.1, text: 'Votre espace de travail IA, prêt en 30 secondes' },
  { progress: 0.3, text: 'Chat intelligent, recherche documentaire, visioconférence' },
  { progress: 0.5, text: 'Vos données ne quittent jamais votre cloud souverain' },
  { progress: 0.7, text: 'Une interface pensée pour la productivité extrême' },
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
      className="absolute left-0 right-0 bottom-8 text-center px-4"
      style={{ opacity, y }}
    >
      <p className="text-xl md:text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-text-primary via-green-500 to-text-secondary tracking-tight">
        {item.text}
      </p>
    </motion.div>
  )
}

/**
 * Scroll-driven frame-by-frame video animation.
 *
 * Place your extracted frames in /public/frames/ as:
 *   frame_0001.webp, frame_0002.webp, ..., frame_0120.webp
 *
 * Extract frames from video with:
 *   ffmpeg -i video.mp4 -vf "fps=24,scale=1920:1080:flags=lanczos" -quality 82 public/frames/frame_%04d.webp
 */
export function FrameScrollVideo() {
  const containerRef = useRef<HTMLDivElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const imagesRef = useRef<HTMLImageElement[]>([])
  const currentFrameRef = useRef(0)

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start start', 'end end'],
  })

  const frameIndex = useTransform(scrollYProgress, [0, 1], [0, FRAME_COUNT - 1])

  // Preload all frames progressively
  useEffect(() => {
    const images: HTMLImageElement[] = new Array(FRAME_COUNT)

    // Load keyframes first (every 10th), then fill gaps
    const loadOrder = Array.from({ length: FRAME_COUNT }, (_, i) => i).sort((a, b) => {
      const pa = a === 0 ? 0 : a % 10 === 0 ? 1 : a % 5 === 0 ? 2 : 3
      const pb = b === 0 ? 0 : b % 10 === 0 ? 1 : b % 5 === 0 ? 2 : 3
      return pa - pb || a - b
    })

    let loaded = 0
    const BATCH_SIZE = 10

    function loadBatch(startIdx: number) {
      const batch = loadOrder.slice(startIdx, startIdx + BATCH_SIZE)
      let batchDone = 0

      batch.forEach((frameIdx) => {
        const img = new Image()
        img.onload = () => {
          loaded++
          batchDone++
          // Draw first frame as soon as it's ready
          if (frameIdx === 0) drawFrame(0)
          // Load next batch
          if (batchDone === batch.length && startIdx + BATCH_SIZE < FRAME_COUNT) {
            loadBatch(startIdx + BATCH_SIZE)
          }
        }
        img.onerror = () => {
          batchDone++
          if (batchDone === batch.length && startIdx + BATCH_SIZE < FRAME_COUNT) {
            loadBatch(startIdx + BATCH_SIZE)
          }
        }
        img.src = FRAME_PATH(frameIdx)
        images[frameIdx] = img
      })
    }

    loadBatch(0)
    imagesRef.current = images
  }, [])

  const drawFrame = useCallback((index: number) => {
    const canvas = canvasRef.current
    const ctx = canvas?.getContext('2d')
    const roundedIndex = Math.round(index)
    const img = imagesRef.current[roundedIndex]

    if (ctx && img?.complete && img.naturalWidth > 0) {
      // Scale to fill canvas maintaining aspect ratio
      const canvasW = canvas!.width
      const canvasH = canvas!.height
      const imgRatio = img.naturalWidth / img.naturalHeight
      const canvasRatio = canvasW / canvasH

      let drawW: number, drawH: number, drawX: number, drawY: number
      if (imgRatio > canvasRatio) {
        drawH = canvasH
        drawW = canvasH * imgRatio
        drawX = (canvasW - drawW) / 2
        drawY = 0
      } else {
        drawW = canvasW
        drawH = canvasW / imgRatio
        drawX = 0
        drawY = (canvasH - drawH) / 2
      }

      ctx.clearRect(0, 0, canvasW, canvasH)
      ctx.drawImage(img, drawX, drawY, drawW, drawH)
      currentFrameRef.current = roundedIndex
    }
  }, [])

  useMotionValueEvent(frameIndex, 'change', (latest) => {
    const rounded = Math.round(latest)
    if (rounded !== currentFrameRef.current) {
      drawFrame(rounded)
    }
  })

  return (
    <section ref={containerRef} className="relative h-[250vh] md:h-[400vh] section-fade-top bg-bg-primary">
      <div className="sticky top-0 h-screen flex items-center justify-center">
        <div className="relative w-full max-w-6xl mx-auto px-4 md:px-8">
          {/* Glow behind canvas */}
          <div className="absolute inset-0 -m-32 bg-green-500/[0.06] blur-[120px] rounded-full float-orb pointer-events-none" />

          {/* Canvas in browser frame */}
          <div className="relative rounded-2xl overflow-hidden border border-border-card shadow-2xl bg-bg-primary">
            {/* Browser chrome */}
            <div className="flex items-center gap-3 px-4 py-3 bg-bg-secondary border-b border-border-subtle">
              <div className="flex gap-2 shrink-0">
                <div className="w-3 h-3 rounded-full bg-text-muted/30" />
                <div className="w-3 h-3 rounded-full bg-text-muted/30" />
                <div className="w-3 h-3 rounded-full bg-text-muted/30" />
              </div>
              <div className="flex-1 max-w-2xl mx-auto flex justify-center">
                <div className="w-full max-w-sm flex items-center gap-2 px-4 py-1.5 rounded-md bg-bg-tertiary border border-border-subtle text-xs text-text-muted">
                  <svg className="w-3 h-3 text-green-500/60 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                  workspace.proxima.green
                </div>
              </div>
            </div>

            {/* Video canvas */}
            <canvas
              ref={canvasRef}
              width={1920}
              height={1080}
              className="w-full aspect-video bg-bg-primary"
            />
          </div>

          {/* Scroll texts */}
          {SCROLL_TEXTS.map((item, i) => (
            <ScrollText key={i} progress={scrollYProgress} item={item} />
          ))}
        </div>
      </div>
    </section>
  )
}
