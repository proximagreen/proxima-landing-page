import { motion } from 'framer-motion'
import { usePersonalization } from '../../context/PersonalizationContext'
import { getContent } from '../../lib/content'
import { SectionHeading } from '../ui/SectionHeading'
import { GlassCard } from '../ui/GlassCard'
import type { IconName } from '../ui/Icon'

const FeatureVisual = ({ type, isLarge }: { type: IconName, isLarge: boolean }) => {
  if (type === 'chat') {
    return (
      <div className={`w-full bg-bg-inset rounded-xl border border-border-card overflow-hidden flex flex-col justify-end relative ${isLarge ? 'h-48' : 'h-32'}`}>
        <div className="absolute inset-x-0 bottom-0 p-4 flex flex-col gap-3">
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
            className="w-3/4 bg-bg-card-hover rounded-2xl rounded-bl-sm p-3 border border-border-card"
          >
            <div className="h-2 bg-text-muted/20 rounded w-full mb-2" />
            <div className="h-2 bg-text-muted/20 rounded w-4/5" />
          </motion.div>
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            viewport={{ once: true }}
            className="w-3/4 bg-green-500/10 rounded-2xl rounded-br-sm p-3 border border-green-500/20 self-end"
          >
            <div className="h-2 bg-green-500/40 rounded w-full mb-2" />
            <div className="h-2 bg-green-500/40 rounded w-2/3" />
          </motion.div>
        </div>
        {/* Glow */}
        <div className="absolute top-0 right-0 w-32 h-32 bg-green-500/10 blur-[50px] rounded-full" />
      </div>
    )
  }

  if (type === 'search') {
    return (
      <div className="w-full h-32 bg-bg-inset rounded-xl border border-border-card overflow-hidden relative flex items-center justify-center p-4">
        {/* Radar circle */}
        <motion.div 
          animate={{ scale: [1, 2, 2], opacity: [0.5, 0, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="absolute w-16 h-16 rounded-full border border-green-500/50"
        />
        <motion.div 
          animate={{ scale: [0, 1.5, 2], opacity: [0, 0.5, 0] }}
          transition={{ duration: 2, repeat: Infinity, delay: 0.5 }}
          className="absolute w-16 h-16 rounded-full border border-green-400/30"
        />
        {/* Central hub */}
        <div className="w-10 h-10 rounded-xl bg-bg-card-hover border border-border-card flex items-center justify-center z-10 backdrop-blur-md">
          <svg className="w-5 h-5 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>
      </div>
    )
  }

  if (type === 'folder') {
    return (
      <div className="w-full h-32 bg-bg-inset rounded-xl border border-border-card overflow-hidden relative flex items-center justify-center">
        <div className="flex gap-4">
          {[1, 2, 3].map((_, i) => (
            <motion.div 
              key={i}
              initial={{ y: 20, opacity: 0 }}
              whileInView={{ y: 0, opacity: 1 }}
              transition={{ delay: i * 0.15 }}
              viewport={{ once: true }}
              className={`w-12 h-16 rounded-lg border ${i === 1 ? 'border-green-500/40 bg-green-500/5 z-10 scale-110 shadow-[0_0_15px_rgba(34,197,94,0.15)]' : 'border-border-card bg-bg-card-hover opacity-80'} flex items-center justify-center`}
            >
              <div className={`w-4 h-1 rounded-full ${i === 1 ? 'bg-green-500' : 'bg-bg-card'} absolute top-3 border border-border-subtle`} />
            </motion.div>
          ))}
        </div>
      </div>
    )
  }

  if (type === 'document') {
    return (
      <div className="w-full h-32 bg-bg-inset rounded-xl border border-border-card overflow-hidden relative flex items-center justify-center px-6">
        {/* Abstract RAG nodes */}
        <div className="w-1/3 flex flex-col gap-3">
          <div className="h-1.5 w-full bg-bg-card-hover border border-border-subtle rounded-full" />
          <motion.div 
            animate={{ width: ['20%', '80%', '40%'] }}
            transition={{ duration: 3, repeat: Infinity }}
            className="h-1.5 bg-green-500/50 rounded-full" 
          />
          <div className="h-1.5 w-4/5 bg-bg-card-hover border border-border-subtle rounded-full" />
        </div>
        <div className="w-px h-16 bg-gradient-to-b from-transparent via-green-500/30 to-transparent mx-6 relative">
          <motion.div 
            animate={{ top: ['0%', '100%', '0%'] }}
            transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
            className="absolute w-3 h-3 left-1/2 -translate-x-1/2 bg-green-400 rounded-full shadow-[0_0_10px_rgba(34,197,94,1)]"
          />
        </div>
        <div className="w-10 h-10 rounded-full border border-green-500/40 flex items-center justify-center bg-green-500/10">
          <div className="w-4 h-4 bg-green-400 rounded-sm rotate-45" />
        </div>
      </div>
    )
  }

  if (type === 'video') {
    return (
      <div className="w-full h-32 bg-bg-inset rounded-xl border border-border-card overflow-hidden relative flex items-center gap-2 p-3">
        <div className="flex-1 h-full bg-bg-card-hover rounded-lg border border-border-card relative overflow-hidden">
           <motion.div 
             animate={{ opacity: [0.3, 0.6, 0.3] }}
             transition={{ duration: 2, repeat: Infinity }}
             className="absolute bottom-2 left-2 w-16 h-2 bg-green-500/20 rounded-full"
           />
        </div>
        <div className="w-1/3 h-full flex flex-col gap-2">
          <div className="flex-1 bg-bg-card-hover rounded-lg border border-border-card" />
          <div className="flex-1 bg-green-500/10 rounded-lg border border-green-500/30 shadow-[0_0_10px_rgba(34,197,94,0.1)] relative">
             <div className="absolute top-1 right-1 w-1.5 h-1.5 bg-green-400 rounded-full animate-pulse" />
          </div>
        </div>
      </div>
    )
  }

  return <div className="h-32 bg-bg-card-hover rounded-xl border border-border-card" />
}

export function FeaturesSection() {
  const { segment } = usePersonalization()
  const content = getContent(segment)

  return (
    <section className="py-[var(--section-padding)] px-6 relative">
      {/* Background glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-green-500/5 blur-[150px] rounded-full pointer-events-none" />

      <div className="max-w-[var(--container-max)] mx-auto relative z-10">
        <SectionHeading
          badge="Fonctionnalités"
          title={'Tout ce dont vous avez besoin.\nRien de superflu.'}
          subtitle="Une suite complète d'outils IA, intégrés dans une interface unique."
        />

        {/* Bento grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {content.features.map((feature, i) => {
            const isLarge = i === 0
            return (
              <GlassCard
                key={i}
                delay={i * 0.1}
                className={`group cursor-default flex flex-col overflow-hidden p-0 ${
                  isLarge ? 'sm:col-span-2 lg:col-span-2' : ''
                }`}
              >
                {/* Visual Area */}
                <div className="p-6 pb-0">
                  <FeatureVisual type={feature.icon as IconName} isLarge={isLarge} />
                </div>
                
                {/* Content Area */}
                <div className="p-6 md:p-8 flex-1 flex flex-col">
                  <h3 className="text-xl font-bold text-text-primary mb-3">{feature.title}</h3>
                  <p className="text-text-secondary text-sm md:text-base leading-relaxed flex-1">{feature.description}</p>
                </div>

                {/* Hover glow line */}
                <div className="h-px w-full bg-gradient-to-r from-transparent via-green-500/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 absolute bottom-0 left-0" />
              </GlassCard>
            )
          })}
        </div>
      </div>
    </section>
  )
}
