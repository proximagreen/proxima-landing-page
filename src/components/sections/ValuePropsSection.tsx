import { motion } from 'framer-motion'
import { usePersonalization } from '../../context/PersonalizationContext'
import { getContent } from '../../lib/content'
import { GlassCard } from '../ui/GlassCard'
import { SectionHeading } from '../ui/SectionHeading'
import type { IconName } from '../ui/Icon'

const AnimatedVisual = ({ type }: { type: IconName }) => {
  if (type === 'shield') {
    return (
      <div className="relative w-full h-40 bg-bg-inset rounded-xl border border-border-card overflow-hidden flex items-center justify-center">
        {/* Background grid */}
        <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: 'linear-gradient(rgba(255,255,255,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.5) 1px, transparent 1px)', backgroundSize: '16px 16px' }} />
        {/* Animated shield/lock */}
        <motion.div 
          animate={{ boxShadow: ['0 0 20px rgba(34,197,94,0.1)', '0 0 40px rgba(34,197,94,0.4)', '0 0 20px rgba(34,197,94,0.1)'] }}
          transition={{ duration: 3, repeat: Infinity }}
          className="relative z-10 w-16 h-16 bg-gradient-to-br from-bg-card-hover to-bg-card rounded-2xl border border-border-glow flex items-center justify-center"
        >
          <svg className="w-8 h-8 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
          </svg>
        </motion.div>
        {/* Data lines bouncing off */}
        <motion.div 
          animate={{ x: [100, 20, 100], opacity: [0, 1, 0] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          className="absolute right-0 h-px w-24 bg-gradient-to-l from-transparent to-red-500"
        />
        <motion.div 
          animate={{ x: [-100, -20, -100], opacity: [0, 1, 0] }}
          transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
          className="absolute left-0 h-px w-24 bg-gradient-to-r from-transparent to-red-500 top-1/3"
        />
      </div>
    )
  }

  if (type === 'globe') {
    return (
      <div className="relative w-full h-40 bg-bg-inset rounded-xl border border-border-card overflow-hidden flex items-center justify-center">
        <motion.div 
          animate={{ rotate: 360 }}
          transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
          className="relative w-28 h-28 rounded-full border border-green-500/20 flex items-center justify-center"
        >
          <div className="absolute w-full h-full border border-green-500/20 rounded-full" style={{ transform: 'rotateX(60deg)' }} />
          <div className="absolute w-full h-full border border-border-card rounded-full" style={{ transform: 'rotateY(60deg)' }} />
          <div className="w-2 h-2 rounded-full bg-green-500 absolute top-0 shadow-[0_0_10px_rgba(34,197,94,1)]" />
          <div className="w-1.5 h-1.5 rounded-full bg-green-400 absolute bottom-4 left-4" />
          <div className="w-1.5 h-1.5 rounded-full bg-green-400 absolute top-8 right-2" />
        </motion.div>
      </div>
    )
  }

  if (type === 'leaf') {
    return (
      <div className="relative w-full h-40 bg-bg-inset rounded-xl border border-border-card overflow-hidden flex items-end justify-center px-6 pb-4">
        <div className="absolute top-4 left-4 text-[10px] text-green-500/50 font-mono tracking-widest uppercase">Éco-Score</div>
        <div className="flex items-end justify-between w-full h-24 gap-2">
          {[40, 25, 45, 15, 60].map((height, i) => (
            <div key={i} className="w-full flex flex-col justify-end items-center gap-2 h-full">
              <motion.div
                initial={{ height: 0 }}
                whileInView={{ height: `${height}%` }}
                transition={{ duration: 1, delay: i * 0.1 }}
                viewport={{ once: true }}
                className="w-full bg-gradient-to-t from-green-600/20 to-green-500/80 rounded-t-sm"
              />
            </div>
          ))}
        </div>
      </div>
    )
  }

  if (type === 'chart-bar') {
    return (
      <div className="relative w-full h-40 bg-bg-inset rounded-xl border border-border-card overflow-hidden flex items-center justify-center p-6">
        <svg className="w-full h-full overflow-visible" viewBox="0 0 100 50">
          <motion.path
            d="M0 45 Q 20 40, 40 30 T 70 15 T 100 5"
            fill="none"
            stroke="rgba(34,197,94,0.8)"
            strokeWidth="3"
            strokeLinecap="round"
            initial={{ pathLength: 0 }}
            whileInView={{ pathLength: 1 }}
            transition={{ duration: 1.5, ease: "easeOut" }}
            viewport={{ once: true }}
          />
          <motion.path
            d="M0 45 Q 20 40, 40 30 T 70 15 T 100 5 L 100 50 L 0 50 Z"
            fill="url(#grad)"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 1, delay: 0.5 }}
            viewport={{ once: true }}
          />
          <defs>
            <linearGradient id="grad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="rgba(34,197,94,0.2)" />
              <stop offset="100%" stopColor="transparent" />
            </linearGradient>
          </defs>
        </svg>
        <motion.div 
          initial={{ scale: 0 }}
          whileInView={{ scale: 1 }}
          transition={{ delay: 1.5, type: 'spring' }}
          className="absolute top-6 right-6 w-3 h-3 rounded-full bg-green-400 shadow-[0_0_15px_rgba(34,197,94,1)]"
        />
      </div>
    )
  }

  return (
    <div className="relative w-full h-40 bg-bg-inset rounded-xl border border-border-card flex items-center justify-center">
        <svg className="w-10 h-10 text-green-500/50" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 10V3L4 14h7v7l9-11h-7z" />
        </svg>
    </div>
  )
}

export function ValuePropsSection() {
  const { segment } = usePersonalization()
  const content = getContent(segment)

  return (
    <section className="py-[var(--section-padding)] px-6 relative">
      <div className="absolute top-1/2 left-0 w-[500px] h-[500px] bg-green-500/[0.03] blur-[150px] rounded-full pointer-events-none -translate-y-1/2" />
      
      <div className="max-w-[var(--container-max)] mx-auto relative z-10">
        <SectionHeading
          badge="Nos engagements"
          title={'Des valeurs fortes,\nvisuellement prouvées'}
          subtitle="Vos données sont critiques. Découvrez concrètement nos piliers techniques non négociables."
        />

        <div className="grid lg:grid-cols-3 gap-8">
          {content.valueProps.map((prop, i) => (
            <GlassCard key={i} delay={i * 0.15} className="flex flex-col group p-2">
              <AnimatedVisual type={prop.icon} />
              <div className="p-6 pb-2 text-center lg:text-left">
                <h3 className="text-xl font-bold text-text-primary mb-2">{prop.title}</h3>
                <p className="text-text-secondary text-sm leading-relaxed">{prop.description}</p>
              </div>
            </GlassCard>
          ))}
        </div>
      </div>
    </section>
  )
}
