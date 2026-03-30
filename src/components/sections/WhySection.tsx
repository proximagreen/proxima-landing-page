import { motion } from 'framer-motion'
import { usePersonalization } from '../../context/PersonalizationContext'
import { getContent } from '../../lib/content'
import { SectionHeading } from '../ui/SectionHeading'
import { Icon } from '../ui/Icon'

function CheckItem({ text, delay }: { text: string; delay: number }) {
  return (
    <motion.li
      className="flex items-start gap-3 text-text-secondary"
      initial={{ opacity: 0, x: -20 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay }}
    >
      <svg className="w-5 h-5 text-green-500 mt-0.5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
      </svg>
      <span>{text}</span>
    </motion.li>
  )
}

export function WhySection() {
  const { segment } = usePersonalization()
  const content = getContent(segment)

  return (
    <section className="py-[var(--section-padding)] px-6 relative overflow-hidden">
      {/* Organic blob background */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] opacity-30">
        <div
          className="w-full h-full rounded-full"
          style={{
            background: 'radial-gradient(circle, rgba(34,197,94,0.15) 0%, transparent 70%)',
            animation: 'blob 20s ease-in-out infinite',
          }}
        />
      </div>
      <style>{`
        @keyframes blob {
          0%, 100% { border-radius: 60% 40% 30% 70% / 60% 30% 70% 40%; transform: translate(0, 0) scale(1); }
          33% { border-radius: 30% 60% 70% 40% / 50% 60% 30% 60%; transform: translate(30px, -20px) scale(1.1); }
          66% { border-radius: 40% 60% 50% 50% / 35% 45% 60% 55%; transform: translate(-20px, 20px) scale(0.95); }
        }
      `}</style>

      <div className="max-w-[var(--container-max)] mx-auto relative z-10">
        <SectionHeading
          badge="Pourquoi Proxima"
          title={'La transparence comme\nfondation technique'}
        />

        <div className="grid md:grid-cols-2 gap-12 md:gap-20">
          {/* Why Green */}
          <div>
            <h3 className="text-2xl font-bold text-text-primary mb-6 flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-green-500/10 border border-green-500/20 flex items-center justify-center shrink-0">
                <Icon name="leaf" className="text-green-400" size={20} />
              </div>
              Pourquoi l'IA la plus verte ?
            </h3>
            <ul className="space-y-4">
              {content.whyGreen.map((point, i) => (
                <CheckItem key={i} text={point.text} delay={i * 0.1} />
              ))}
            </ul>
          </div>

          {/* Why Private */}
          <div>
            <h3 className="text-2xl font-bold text-text-primary mb-6 flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-green-500/10 border border-green-500/20 flex items-center justify-center shrink-0">
                <Icon name="lock" className="text-green-400" size={20} />
              </div>
              Pourquoi l'IA la plus privée ?
            </h3>
            <ul className="space-y-4">
              {content.whyPrivate.map((point, i) => (
                <CheckItem key={i} text={point.text} delay={i * 0.1} />
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  )
}
