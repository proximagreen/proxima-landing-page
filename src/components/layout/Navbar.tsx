import { useEffect, useState } from 'react'
import { Button } from '../ui/Button'

export function Navbar() {
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 50)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 px-6 py-4 transition-all duration-500 backdrop-blur-xl ${
        scrolled
          ? 'bg-white/90 backdrop-blur-xl border-b border-black/8 shadow-sm'
          : 'bg-white/60 border-b border-black/5'
      }`}
    >
      <div className="max-w-[var(--container-max)] mx-auto flex items-center justify-between">
        {/* Logo */}
        <a href="/" className="flex items-center z-50">
          <img src="/logo-proxima.svg" alt="Proxima" className="h-9 sm:h-11 logo-adaptive" />
        </a>

        {/* Desktop CTA */}
        <div className="flex items-center gap-3 z-50">
          <div className="hidden sm:block">
            <Button variant="primary" size="sm" href="#pricing" className="whitespace-nowrap">
              Accéder à mon espace
            </Button>
          </div>

        </div>
      </div>

    </nav>
  )
}
