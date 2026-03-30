import { motion } from 'framer-motion'
import { usePersonalization } from '../../context/PersonalizationContext'
import { getContent } from '../../lib/content'
import { SectionHeading } from '../ui/SectionHeading'
import { GlassCard } from '../ui/GlassCard'
import { Icon, type IconName } from '../ui/Icon'

const FeatureVisual = ({ type, isLarge }: { type: IconName, isLarge: boolean }) => {
  return (
    <div className={`w-full bg-bg-inset rounded-xl border border-border-card overflow-hidden flex items-center justify-center relative group-hover:bg-bg-card-hover transition-colors duration-500 ${isLarge ? 'h-48' : 'h-32'}`}>
      
      {/* Background ambient glow */}
      <div className="absolute inset-0 bg-green-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
      
      {/* Central icon container */}
      <motion.div 
        className={`relative z-10 flex items-center justify-center rounded-2xl border border-border-card shadow-lg bg-bg-primary group-hover:border-green-500/50 group-hover:shadow-[0_0_30px_rgba(34,197,94,0.2)] transition-all duration-500 ${isLarge ? 'w-24 h-24' : 'w-16 h-16'}`}
        whileHover={{ scale: 1.05, y: -5 }}
      >
        <Icon name={type} className="text-green-500" size={isLarge ? 48 : 32} />
      </motion.div>

      {/* Subtle decorative elements layout */}
      <div className="absolute right-4 bottom-4 flex gap-1.5 opacity-30">
        <div className="w-1.5 h-1.5 rounded-full bg-border-card" />
        <div className="w-1.5 h-1.5 rounded-full bg-border-card" />
        <div className="w-1.5 h-1.5 rounded-full bg-green-500" />
      </div>
      
      {/* Clean grid pattern behind */}
      <div className="absolute inset-0 opacity-[0.02] group-hover:opacity-[0.04] transition-opacity duration-500" style={{ backgroundImage: 'radial-gradient(circle at 1px 1px, white 1px, transparent 0)', backgroundSize: '12px 12px' }} />
    </div>
  )
}

export function FeaturesSection() {
  const { segment } = usePersonalization()
  const content = getContent(segment)

  return (
    <section className="py-[var(--section-padding)] px-6 relative overflow-x-clip">

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
