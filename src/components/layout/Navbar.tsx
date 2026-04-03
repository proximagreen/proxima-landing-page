import { useEffect, useState } from 'react'
import { useTheme } from '../../context/ThemeContext'
import { Button } from '../ui/Button'

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
  const { theme } = useTheme()
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 50)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const navBg = theme === 'dark'
    ? 'bg-bg-primary/90 backdrop-blur-xl border-b border-white/10'
    : 'bg-white/90 backdrop-blur-xl border-b border-black/8 shadow-sm'

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 px-6 py-4 transition-all duration-500 backdrop-blur-xl ${
        scrolled
          ? navBg
          : theme === 'dark'
            ? 'bg-bg-primary/60 border-b border-white/5'
            : 'bg-white/60 border-b border-black/5'
      }`}
    >
      <div className="max-w-[var(--container-max)] mx-auto flex items-center justify-between">
        {/* Logo */}
        <a href="/" className="flex items-center z-50">
          <img src="/logo-proxima.svg" alt="Proxima" className="h-9 sm:h-11 logo-adaptive" />
        </a>

        {/* Desktop CTA + Theme toggle + Hamburger */}
        <div className="flex items-center gap-3 z-50">
          <ThemeToggle />
          <div className="hidden sm:block">
            <Button variant="primary" size="sm" href="#pricing" className="whitespace-nowrap">
              Acceder a mon espace
            </Button>
          </div>

        </div>
      </div>

    </nav>
  )
}
