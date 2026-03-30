import { motion } from 'framer-motion'
import clsx from 'clsx'

interface SectionHeadingProps {
  badge?: string
  title: string
  subtitle?: string
  className?: string
  align?: 'left' | 'center'
}

export function SectionHeading({ badge, title, subtitle, className, align = 'center' }: SectionHeadingProps) {
  return (
    <motion.div
      className={clsx(
        'mb-16',
        align === 'center' && 'text-center',
        className,
      )}
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6 }}
    >
      {badge && (
        <span className="inline-block mb-4 px-4 py-1.5 rounded-full text-sm font-medium text-green-400 border border-green-500/30 bg-green-500/10">
          {badge}
        </span>
      )}
      <h2 className="text-3xl md:text-5xl font-bold tracking-tight text-text-primary whitespace-pre-line leading-tight">
        {title}
      </h2>
      {subtitle && (
        <p className="mt-4 text-lg text-text-secondary max-w-2xl mx-auto">
          {subtitle}
        </p>
      )}
    </motion.div>
  )
}
