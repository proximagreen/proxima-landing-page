import { useScroll, useTransform, type MotionValue, type ScrollOffset } from 'framer-motion'
import { useRef } from 'react'

export function useScrollProgress(offset: ScrollOffset = ['start end', 'end start']) {
  const ref = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({
    target: ref,
    offset,
  })

  return { ref, progress: scrollYProgress }
}

export function useParallax(value: MotionValue<number>, distance: number) {
  return useTransform(value, [0, 1], [-distance, distance])
}
