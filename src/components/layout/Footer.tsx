export function Footer() {
  return (
    <footer className="relative border-t border-border-subtle">
      {/* Top gradient line accent */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-green-500/20 to-transparent" />

      <div className="max-w-[var(--container-max)] mx-auto px-6 py-14">
        <div className="flex flex-col md:flex-row items-center justify-between gap-8">
          {/* Brand */}
          <div className="flex items-center gap-3">
            <img src="/favicon-proxima.png" alt="Proxima" width={22} height={22} className="w-[22px] h-[22px]" />
            <span className="text-sm text-text-secondary font-medium">
              Construit à Paris
            </span>
          </div>

          {/* Links */}
          <nav className="flex items-center gap-6 md:gap-8 text-sm text-text-muted">
            <a href="#" className="hover:text-green-400 transition-colors duration-300">Confidentialité</a>
            <a href="mailto:contact@proxima.green" className="hover:text-green-400 transition-colors duration-300">Contact</a>
            <a href="https://www.linkedin.com/company/proximagreen/" target="_blank" rel="noopener noreferrer" className="hover:text-green-400 transition-colors duration-300" aria-label="LinkedIn">
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>
            </a>
          </nav>

          {/* Copyright */}
          <p className="text-xs text-text-muted/60">
            &copy; {new Date().getFullYear()} Proxima. Tous droits réservés.
          </p>
        </div>
      </div>
    </footer>
  )
}
