import { motion } from 'framer-motion'
import clsx from 'clsx'

interface ButtonProps {
  children: React.ReactNode
  variant?: 'primary' | 'secondary' | 'ghost'
  size?: 'sm' | 'md' | 'lg'
  href?: string
  onClick?: () => void
  className?: string
}

export function Button({ children, variant = 'primary', size = 'md', href, onClick, className }: ButtonProps) {
  const classes = clsx(
    'inline-flex items-center justify-center font-semibold rounded-full transition-all duration-300 cursor-pointer relative overflow-hidden group',
    {
      'bg-green-500 text-white shadow-[0_4px_14px_0_rgba(34,197,94,0.39)] hover:shadow-[0_6px_20px_rgba(34,197,94,0.23),0_0_80px_rgba(34,197,94,0.2)] hover:-translate-y-[1px] font-heading': variant === 'primary',
      'border border-border-card text-text-primary hover:border-green-500/40 hover:text-green-500 hover:shadow-[0_0_20px_rgba(34,197,94,0.1)] backdrop-blur-sm bg-bg-card/30': variant === 'secondary',
      'text-text-secondary hover:text-green-400': variant === 'ghost',
      'px-5 py-2.5 text-sm': size === 'sm',
      'px-7 py-3.5 text-base': size === 'md',
      'px-9 py-4 text-lg tracking-tight': size === 'lg',
    },
    className,
  )

  const MotionComponent = href ? motion.a : motion.button

  return (
    <MotionComponent
      className={classes}
      href={href}
      onClick={onClick}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      target={href?.startsWith('http') ? '_blank' : undefined}
      rel={href?.startsWith('http') ? 'noopener noreferrer' : undefined}
    >
      {/* Sweeping light effect for primary button */}
      {variant === 'primary' && (
        <span className="absolute inset-0 w-full h-full -ml-[-100%] bg-gradient-to-r from-transparent via-white/30 to-transparent transition-all duration-1000 ease-in-out group-hover:left-[200%]" />
      )}
      <span className="relative z-10 flex items-center gap-2">{children}</span>
    </MotionComponent>
  )
}
