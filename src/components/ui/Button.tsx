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
    'inline-flex items-center justify-center font-semibold rounded-full transition-all duration-300 cursor-pointer relative',
    {
      'bg-green-500 text-black hover:bg-green-400 green-glow hover:shadow-[0_0_30px_rgba(34,197,94,0.4),0_0_80px_rgba(34,197,94,0.2)]': variant === 'primary',
      'border border-border-card text-text-primary hover:border-green-500/40 hover:text-green-500 hover:shadow-[0_0_20px_rgba(34,197,94,0.1)] backdrop-blur-sm': variant === 'secondary',
      'text-text-secondary hover:text-green-400': variant === 'ghost',
      'px-4 py-2 text-sm': size === 'sm',
      'px-6 py-3 text-base': size === 'md',
      'px-8 py-4 text-lg tracking-[-0.01em]': size === 'lg',
    },
    className,
  )

  const MotionComponent = href ? motion.a : motion.button

  return (
    <MotionComponent
      className={classes}
      href={href}
      onClick={onClick}
      whileHover={{ scale: 1.04 }}
      whileTap={{ scale: 0.97 }}
      target={href?.startsWith('http') ? '_blank' : undefined}
      rel={href?.startsWith('http') ? 'noopener noreferrer' : undefined}
    >
      {children}
    </MotionComponent>
  )
}
