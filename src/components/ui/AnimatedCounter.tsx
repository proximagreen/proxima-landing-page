import { useEffect, useRef, useState } from 'react'
import { useInView, useSpring, useMotionValue } from 'framer-motion'

interface AnimatedCounterProps {
  target: number
  suffix?: string
  prefix?: string
  duration?: number
}

export function AnimatedCounter({ target, suffix = '', prefix = '', duration = 2 }: AnimatedCounterProps) {
  const ref = useRef<HTMLSpanElement>(null)
  const isInView = useInView(ref, { once: true })
  const motionValue = useMotionValue(0)
  const spring = useSpring(motionValue, { duration: duration * 1000, bounce: 0 })
  const [display, setDisplay] = useState('0')

  useEffect(() => {
    if (isInView) {
      motionValue.set(target)
    }
  }, [isInView, target, motionValue])

  useEffect(() => {
    const hasDecimal = target % 1 !== 0
    return spring.on('change', (v) => {
      if (hasDecimal) {
        setDisplay(v.toFixed(1).replace('.', ','))
      } else {
        setDisplay(Math.round(v).toLocaleString('fr-FR'))
      }
    })
  }, [spring, target])

  return (
    <span ref={ref} className="tabular-nums">
      {prefix}{display}{suffix}
    </span>
  )
}
