import { motion } from 'framer-motion'
import { usePersonalization } from '../../context/PersonalizationContext'
import { getContent } from '../../lib/content'
import { GlassCard } from '../ui/GlassCard'
import { SectionHeading } from '../ui/SectionHeading'
import { Icon, type IconName } from '../ui/Icon'

const AnimatedVisual = ({ type }: { type: IconName }) => {
  return (
    <div className="relative w-full h-40 bg-bg-inset rounded-xl border border-border-card overflow-hidden flex items-center justify-center group-hover:bg-bg-card-hover transition-colors duration-500">
      {/* Background ambient glow */}
      <div className="absolute inset-0 bg-green-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
      
      {/* Central Orb */}
      <motion.div 
        className="relative z-10 w-20 h-20 bg-bg-primary rounded-2xl border border-border-card shadow-lg flex items-center justify-center group-hover:border-green-500/50 group-hover:shadow-[0_0_30px_rgba(34,197,94,0.2)] transition-all duration-500"
        whileHover={{ scale: 1.05 }}
      >
        <Icon name={type} className="text-green-500" size={36} />
      </motion.div>

      {/* Decorative dots grid behind */}
      <div className="absolute inset-0 opacity-[0.03] group-hover:opacity-[0.05] transition-opacity duration-500" style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)', backgroundSize: '16px 16px' }} />
    </div>
  )
}

export function ValuePropsSection() {
  const { segment } = usePersonalization()
  const content = getContent(segment)

  return (
    <section className="py-[var(--section-padding)] px-6 relative overflow-x-clip">
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
