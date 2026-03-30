import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { usePersonalization } from '../../context/PersonalizationContext'
import { useTheme } from '../../context/ThemeContext'
import { Button } from '../ui/Button'
import type { Segment } from '../../context/PersonalizationContext'

const SEGMENTS: { id: Segment; label: string; color: string }[] = [
  { id: 'general', label: 'Tous secteurs', color: 'bg-green-500' },
  { id: 'legal', label: 'Juridique', color: 'bg-blue-500' },
  { id: 'health', label: 'Santé', color: 'bg-emerald-500' },
  { id: 'audit', label: 'Conseil & Audit', color: 'bg-amber-500' },
]

function ThemeToggle() {
  const { theme, toggleTheme } = useTheme()

  return (
    <button
      onClick={toggleTheme}
      className="relative w-10 h-10 rounded-xl border border-border-card bg-bg-card hover:bg-bg-card-hover flex items-center justify-center transition-all duration-300 cursor-pointer group"
      aria-label={theme === 'dark' ? 'Passer en mode clair' : 'Passer en mode sombre'}
    >
      {/* Sun icon */}
      <svg
        className={`w-[18px] h-[18px] absolute transition-all duration-300 ${
          theme === 'light'
            ? 'opacity-100 rotate-0 scale-100 text-amber-500'
            : 'opacity-0 rotate-90 scale-50 text-amber-400'
        }`}
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        strokeWidth={2}
      >
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v2.25m6.364.386l-1.591 1.591M21 12h-2.25m-.386 6.364l-1.591-1.591M12 18.75V21m-4.773-4.227l-1.591 1.591M5.25 12H3m4.227-4.773L5.636 5.636M15.75 12a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0z" />
      </svg>
      {/* Moon icon */}
      <svg
        className={`w-[18px] h-[18px] absolute transition-all duration-300 ${
          theme === 'dark'
            ? 'opacity-100 rotate-0 scale-100 text-green-400'
            : 'opacity-0 -rotate-90 scale-50 text-slate-400'
        }`}
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        strokeWidth={2}
      >
        <path strokeLinecap="round" strokeLinejoin="round" d="M21.752 15.002A9.718 9.718 0 0118 15.75c-5.385 0-9.75-4.365-9.75-9.75 0-1.33.266-2.597.748-3.752A9.753 9.753 0 003 11.25C3 16.635 7.365 21 12.75 21a9.753 9.753 0 009.002-5.998z" />
      </svg>
    </button>
  )
}

export function Navbar() {
  const { segment } = usePersonalization()
  const { theme } = useTheme()
  const [scrolled, setScrolled] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 50)
      if (window.scrollY > 50 && mobileMenuOpen) {
        setMobileMenuOpen(false)
      }
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [mobileMenuOpen])

  const navBg = theme === 'dark'
    ? 'bg-bg-primary/90 backdrop-blur-xl border-b border-white/10'
    : 'bg-white/90 backdrop-blur-xl border-b border-black/8 shadow-sm'

  const mobileBg = theme === 'dark'
    ? 'bg-bg-primary/95 backdrop-blur-xl border-b border-white/10'
    : 'bg-white/95 backdrop-blur-xl border-b border-black/8 shadow-lg'

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 px-6 py-4 transition-all duration-500 ${
        scrolled || mobileMenuOpen
          ? navBg
          : 'bg-transparent border-b border-transparent'
      }`}
    >
      <div className="max-w-[var(--container-max)] mx-auto flex items-center justify-between">
        {/* Logo */}
        <a href="/" className="flex items-center gap-2.5 text-xl font-bold text-text-primary z-50">
          <img src="/favicon-proxima.png" alt="Proxima" width={28} height={28} className="w-7 h-7" />
          <span>Proxima</span>
        </a>

        {/* Segment pills - desktop */}
        <div className="hidden lg:flex items-center gap-2 absolute left-1/2 -translate-x-1/2">
          {SEGMENTS.map((seg) => (
            <a
              key={seg.id}
              href={`?segment=${seg.id}`}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium transition-all duration-300 ${
                segment === seg.id
                  ? 'bg-bg-card-hover text-text-primary border border-border-card'
                  : 'text-text-secondary hover:text-text-primary hover:bg-bg-card'
              }`}
            >
              <span className={`w-2 h-2 rounded-full ${seg.color} ${segment === seg.id ? 'pulse-dot' : ''}`} />
              {seg.label}
            </a>
          ))}
        </div>

        {/* Desktop CTA + Theme toggle + Hamburger */}
        <div className="flex items-center gap-3 z-50">
          <ThemeToggle />
          <div className="hidden sm:block">
            <Button variant="primary" size="sm" href="#pricing" className="whitespace-nowrap">
              Commencer
            </Button>
          </div>

          {/* Hamburger button */}
          <button
            className="lg:hidden p-2 text-text-primary hover:text-green-500 transition-colors cursor-pointer"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Menu"
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              {mobileMenuOpen ? (
                <path d="M18 6L6 18M6 6l12 12" />
              ) : (
                <path d="M3 12h18M3 6h18M3 18h18" />
              )}
            </svg>
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className={`absolute top-full left-0 right-0 overflow-hidden lg:hidden ${mobileBg}`}
          >
            <div className="p-6 flex flex-col gap-6">
              <div className="flex flex-col gap-3">
                <div className="text-xs text-text-muted uppercase tracking-wider mb-2">Secteurs &amp; Domaines</div>
                {SEGMENTS.map((seg) => (
                  <a
                    key={seg.id}
                    href={`?segment=${seg.id}`}
                    className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
                      segment === seg.id
                        ? 'bg-bg-card-hover text-text-primary border border-border-card'
                        : 'text-text-secondary hover:bg-bg-card hover:text-text-primary'
                    }`}
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    <span className={`w-3 h-3 rounded-full ${seg.color}`} />
                    <span className="font-medium text-lg">{seg.label}</span>
                  </a>
                ))}
              </div>

              <div className="pt-4 border-t border-border-subtle sm:hidden">
                <Button variant="primary" className="w-full justify-center" href="#pricing" onClick={() => setMobileMenuOpen(false)}>
                  Commencer
                </Button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  )
}
