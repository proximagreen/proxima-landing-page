import { useScroll, useTransform, type MotionValue } from 'framer-motion'
import { useRef } from 'react'

export function useScrollProgress(offset: [string, string] = ['start end', 'end start']) {
  const ref = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: offset as unknown as [string, string],
  })

  return { ref, progress: scrollYProgress }
}

export function useParallax(value: MotionValue<number>, distance: number) {
  return useTransform(value, [0, 1], [-distance, distance])
}
