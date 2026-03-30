import { useRef, useEffect, useState } from 'react'
import { useInView } from 'framer-motion'
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement,
} from 'chart.js'
import { Doughnut, Bar } from 'react-chartjs-2'

ChartJS.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement)

/* ─── Donut Chart (Chart.js) ─── */

interface DonutChartProps {
  value: number       // 0-100
  size?: number
  color?: string
  label: string
  sublabel?: string
}

export function DonutChart({ value, size = 120, color = '#22c55e', label, sublabel }: DonutChartProps) {
  const ref = useRef<HTMLDivElement>(null)
  const isInView = useInView(ref, { once: true })
  const [animated, setAnimated] = useState(false)

  useEffect(() => {
    if (isInView && !animated) setAnimated(true)
  }, [isInView, animated])

  const displayValue = animated ? value : 0

  return (
    <div ref={ref} className="flex flex-col items-center">
      <div style={{ width: size, height: size }} className="relative">
        <Doughnut
          data={{
            datasets: [{
              data: [displayValue, 100 - displayValue],
              backgroundColor: [color, 'rgba(255,255,255,0.05)'],
              borderWidth: 0,
              borderRadius: 6,
            }],
          }}
          options={{
            cutout: '75%',
            responsive: true,
            maintainAspectRatio: true,
            animation: { duration: 1200, easing: 'easeOutQuart' },
            plugins: { tooltip: { enabled: false }, legend: { display: false } },
          }}
        />
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-xl sm:text-2xl font-bold text-text-primary">{value}%</span>
        </div>
      </div>
      <span className="text-xs sm:text-sm font-medium text-text-primary mt-3 text-center">{label}</span>
      {sublabel && <span className="text-[10px] sm:text-xs text-text-muted mt-0.5 text-center">{sublabel}</span>}
    </div>
  )
}

/* ─── Horizontal Bar Chart (Chart.js) ─── */

interface BarChartItem {
  label: string
  value: number
  color: string
  suffix?: string
}

interface HBarChartProps {
  items: BarChartItem[]
  title?: string
}

export function HBarChart({ items, title }: HBarChartProps) {
  const ref = useRef<HTMLDivElement>(null)
  const isInView = useInView(ref, { once: true })
  const [animated, setAnimated] = useState(false)

  useEffect(() => {
    if (isInView && !animated) setAnimated(true)
  }, [isInView, animated])

  return (
    <div ref={ref}>
      {title && <h4 className="text-sm font-bold text-text-primary mb-4">{title}</h4>}
      <div style={{ height: items.length * 52 + 20 }}>
        <Bar
          data={{
            labels: items.map(i => i.label),
            datasets: [{
              data: animated ? items.map(i => i.value) : items.map(() => 0),
              backgroundColor: items.map(i => i.color),
              borderRadius: 6,
              borderSkipped: false,
              barThickness: 28,
            }],
          }}
          options={{
            indexAxis: 'y',
            responsive: true,
            maintainAspectRatio: false,
            animation: { duration: 1200, easing: 'easeOutQuart' },
            scales: {
              x: {
                display: false,
                max: Math.max(...items.map(i => i.value)) * 1.15,
              },
              y: {
                display: true,
                grid: { display: false },
                ticks: {
                  color: 'rgba(255,255,255,0.5)',
                  font: { size: 11 },
                },
                border: { display: false },
              },
            },
            plugins: {
              legend: { display: false },
              tooltip: {
                backgroundColor: 'rgba(0,0,0,0.8)',
                titleFont: { size: 12 },
                bodyFont: { size: 12 },
                padding: 10,
                cornerRadius: 8,
                callbacks: {
                  label: (ctx) => {
                    const item = items[ctx.dataIndex]
                    return ` ${ctx.parsed.x.toLocaleString('fr-FR')}${item.suffix || ''}`
                  },
                },
              },
            },
          }}
        />
      </div>
    </div>
  )
}

/* ─── Radar / Score Gauge (Chart.js Doughnut variant) ─── */

interface ScoreGaugeProps {
  score: number
  maxScore: number
  riskColor: string
  riskLabel: string
}

export function ScoreGauge({ score, maxScore, riskColor, riskLabel }: ScoreGaugeProps) {
  const ref = useRef<HTMLDivElement>(null)
  const isInView = useInView(ref, { once: true })
  const [animated, setAnimated] = useState(false)
  const percent = Math.round((score / maxScore) * 100)

  useEffect(() => {
    if (isInView && !animated) setAnimated(true)
  }, [isInView, animated])

  return (
    <div ref={ref} className="inline-flex flex-col items-center">
      <div className="relative w-36 h-36 sm:w-40 sm:h-40 mb-4">
        <Doughnut
          data={{
            datasets: [{
              data: animated ? [percent, 100 - percent] : [0, 100],
              backgroundColor: [riskColor, 'rgba(255,255,255,0.05)'],
              borderWidth: 0,
              borderRadius: 8,
            }],
          }}
          options={{
            cutout: '78%',
            rotation: -90,
            circumference: 360,
            responsive: true,
            maintainAspectRatio: true,
            animation: { duration: 1800, easing: 'easeOutQuart' },
            plugins: { tooltip: { enabled: false }, legend: { display: false } },
          }}
        />
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-4xl font-bold" style={{ color: riskColor }}>{score}</span>
          <span className="text-[10px] text-text-muted uppercase tracking-wider">/{maxScore}</span>
        </div>
      </div>
      <span className="text-sm font-bold uppercase tracking-wider" style={{ color: riskColor }}>
        Risque {riskLabel}
      </span>
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
