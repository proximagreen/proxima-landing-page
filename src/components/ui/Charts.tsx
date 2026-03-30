import { motion, useInView } from 'framer-motion'
import { useRef } from 'react'

/* ─── Donut Chart ─── */

interface DonutChartProps {
  value: number       // 0-100
  size?: number
  strokeWidth?: number
  color?: string
  label: string
  sublabel?: string
  delay?: number
}

export function DonutChart({ value, size = 120, strokeWidth = 8, color = 'var(--color-green-500)', label, sublabel, delay = 0 }: DonutChartProps) {
  const ref = useRef<HTMLDivElement>(null)
  const isInView = useInView(ref, { once: true })
  const radius = (size - strokeWidth) / 2
  const circumference = radius * 2 * Math.PI
  const offset = circumference - (value / 100) * circumference

  return (
    <div ref={ref} className="flex flex-col items-center">
      <div className="relative" style={{ width: size, height: size }}>
        <svg width={size} height={size} className="-rotate-90">
          {/* Background circle */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="none"
            stroke="currentColor"
            strokeWidth={strokeWidth}
            className="text-border-subtle"
          />
          {/* Value arc */}
          <motion.circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="none"
            stroke={color}
            strokeWidth={strokeWidth}
            strokeLinecap="round"
            strokeDasharray={circumference}
            initial={{ strokeDashoffset: circumference }}
            animate={isInView ? { strokeDashoffset: offset } : {}}
            transition={{ duration: 1.5, delay, ease: [0.16, 1, 0.3, 1] }}
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-2xl font-bold text-text-primary">{value}%</span>
        </div>
      </div>
      <span className="text-sm font-medium text-text-primary mt-3">{label}</span>
      {sublabel && <span className="text-xs text-text-muted mt-0.5">{sublabel}</span>}
    </div>
  )
}

/* ─── Horizontal Bar Chart ─── */

interface BarItem {
  label: string
  value: number
  maxValue: number
  color: string
  suffix?: string
}

interface HBarChartProps {
  items: BarItem[]
  delay?: number
}

export function HBarChart({ items, delay = 0 }: HBarChartProps) {
  const ref = useRef<HTMLDivElement>(null)
  const isInView = useInView(ref, { once: true })

  return (
    <div ref={ref} className="space-y-4">
      {items.map((item, i) => {
        const percent = Math.min((item.value / item.maxValue) * 100, 100)
        return (
          <div key={i} className="space-y-1.5">
            <div className="flex justify-between items-baseline">
              <span className="text-sm text-text-secondary">{item.label}</span>
              <span className="text-sm font-bold text-text-primary">
                {item.value.toLocaleString('fr-FR')}{item.suffix || ''}
              </span>
            </div>
            <div className="h-3 rounded-full bg-bg-card overflow-hidden">
              <motion.div
                className={`h-full rounded-full ${item.color}`}
                initial={{ width: 0 }}
                animate={isInView ? { width: `${percent}%` } : {}}
                transition={{ duration: 1.2, delay: delay + i * 0.15, ease: [0.16, 1, 0.3, 1] }}
              />
            </div>
          </div>
        )
      })}
    </div>
  )
}

/* ─── Mini Stat Card with Spark ─── */

interface SparkStatProps {
  value: string
  label: string
  trend?: 'up' | 'down'
  trendValue?: string
  icon: React.ReactNode
}

export function SparkStat({ value, label, trend, trendValue, icon }: SparkStatProps) {
  return (
    <div className="glass rounded-xl p-4 flex items-center gap-4">
      <div className="w-11 h-11 rounded-xl bg-green-500/[0.08] border border-green-500/20 flex items-center justify-center shrink-0">
        {icon}
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-baseline gap-2">
          <span className="text-xl font-bold text-text-primary">{value}</span>
          {trend && trendValue && (
            <span className={`text-xs font-bold ${trend === 'up' ? 'text-green-400' : 'text-red-400'}`}>
              {trend === 'up' ? '+' : ''}{trendValue}
            </span>
          )}
        </div>
        <span className="text-xs text-text-muted">{label}</span>
      </div>
    </div>
  )
}
