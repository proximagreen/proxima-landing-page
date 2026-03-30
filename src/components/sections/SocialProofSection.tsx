import { usePersonalization } from '../../context/PersonalizationContext'
import { getContent } from '../../lib/content'
import { SectionHeading } from '../ui/SectionHeading'
import { GlassCard } from '../ui/GlassCard'
import { LogoBanner } from '../ui/LogoBanner'

export function SocialProofSection() {
  const { segment } = usePersonalization()
  const content = getContent(segment)

  if (content.testimonials.length === 0) return null

  return (
    <section className="py-[var(--section-padding)] px-6 bg-bg-secondary overflow-hidden">
      <div className="max-w-[var(--container-max)] mx-auto">
        <SectionHeading
          badge="Témoignages"
          title="Ils nous font confiance"
        />

        <div className={`grid gap-8 max-w-4xl mx-auto items-stretch ${content.testimonials.length > 1 ? 'md:grid-cols-2' : 'max-w-2xl'}`}>
          {content.testimonials.map((testimonial, i) => (
            <GlassCard key={i} delay={i * 0.15} className="flex flex-col h-full">
              {/* Quote */}
              <div className="relative flex-1">
                <svg className="absolute -top-2 -left-3 w-8 h-8 text-green-500/20" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z" />
                </svg>
                <p className="text-text-secondary leading-relaxed pl-6 italic mb-6">
                  "{testimonial.quote}"
                </p>
              </div>

              {/* Author */}
              <div className="flex items-center gap-4 pt-4 border-t border-border-subtle mt-auto w-full">
                {testimonial.photo ? (
                  <img
                    src={testimonial.photo}
                    alt={testimonial.name}
                    className="w-12 h-12 rounded-full object-cover border border-white/10 shrink-0"
                  />
                ) : (
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-green-500/30 to-green-500/10 flex items-center justify-center text-green-400 text-base font-bold border border-green-500/20 shrink-0">
                    {testimonial.avatar}
                  </div>
                )}
                <div className="flex-1">
                  <p className="text-sm font-semibold text-text-primary truncate">{testimonial.name}</p>
                  <p className="text-xs text-text-muted truncate">{testimonial.role}, {testimonial.company}</p>
                </div>
              </div>
            </GlassCard>
          ))}
        </div>

        {/* Logo banner + certifications */}
        <LogoBanner />
      </div>
    </section>
  )
}
