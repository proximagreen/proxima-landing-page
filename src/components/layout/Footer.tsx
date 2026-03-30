import { Button } from '../ui/Button'

const FOOTER_LINKS = {
  produit: [
    { label: 'Chat IA', href: '#' },
    { label: 'Proxima Meet', href: '#' },
    { label: 'Agents IA', href: '#' },
    { label: 'RAG documentaire', href: '#' },
    { label: 'Tarifs', href: '#pricing' },
  ],
  securite: [
    { label: 'Souverainete', href: '#' },
    { label: 'RGPD', href: '#' },
    { label: 'Cloisonnement', href: '#' },
    { label: 'Hebergement Europe', href: '#' },
  ],
  entreprise: [
    { label: 'A propos', href: '#' },
    { label: 'Contact', href: 'mailto:contact@proxima.green' },
    { label: 'LinkedIn', href: 'https://www.linkedin.com/company/proximagreen/' },
    { label: 'Console', href: 'https://console.proxima.green' },
  ],
  legal: [
    { label: 'Mentions legales', href: '#' },
    { label: 'Politique de confidentialite', href: '#' },
    { label: 'CGV', href: '#' },
  ],
}

export function Footer() {
  return (
    <footer className="relative border-t border-border-subtle bg-bg-secondary">
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-green-500/20 to-transparent" />

      <div className="max-w-[var(--container-max)] mx-auto px-4 sm:px-6">
        {/* Main grid */}
        <div className="py-12 sm:py-16 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-8 lg:gap-12">
          {/* Brand column */}
          <div className="col-span-2 sm:col-span-3 lg:col-span-1 mb-4 lg:mb-0">
            <a href="/" className="flex items-center gap-2.5 mb-4">
              <img src="/favicon-proxima.png" alt="Proxima" width={28} height={28} className="w-7 h-7" />
              <span className="text-lg font-bold text-text-primary">Proxima</span>
            </a>
            <p className="text-sm text-text-muted leading-relaxed mb-6 max-w-xs">
              L'IA confidentielle, souveraine et responsable pour les professionnels qui gerent des donnees sensibles.
            </p>
            <Button variant="primary" size="sm" href="#pricing">
              Souscrire
            </Button>
          </div>

          {/* Link columns */}
          <div>
            <h4 className="text-sm font-semibold text-text-primary mb-4">Produit</h4>
            <ul className="space-y-2.5">
              {FOOTER_LINKS.produit.map((link) => (
                <li key={link.label}>
                  <a href={link.href} className="text-sm text-text-muted hover:text-green-400 transition-colors duration-200">{link.label}</a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-sm font-semibold text-text-primary mb-4">Securite</h4>
            <ul className="space-y-2.5">
              {FOOTER_LINKS.securite.map((link) => (
                <li key={link.label}>
                  <a href={link.href} className="text-sm text-text-muted hover:text-green-400 transition-colors duration-200">{link.label}</a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-sm font-semibold text-text-primary mb-4">Entreprise</h4>
            <ul className="space-y-2.5">
              {FOOTER_LINKS.entreprise.map((link) => (
                <li key={link.label}>
                  <a
                    href={link.href}
                    className="text-sm text-text-muted hover:text-green-400 transition-colors duration-200"
                    target={link.href.startsWith('http') ? '_blank' : undefined}
                    rel={link.href.startsWith('http') ? 'noopener noreferrer' : undefined}
                  >{link.label}</a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-sm font-semibold text-text-primary mb-4">Legal</h4>
            <ul className="space-y-2.5">
              {FOOTER_LINKS.legal.map((link) => (
                <li key={link.label}>
                  <a href={link.href} className="text-sm text-text-muted hover:text-green-400 transition-colors duration-200">{link.label}</a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="border-t border-border-subtle py-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <p className="text-xs text-text-muted/60">
              &copy; {new Date().getFullYear()} Proxima. Tous droits reserves.
            </p>
            <span className="text-xs text-text-muted/40">Construit a Paris</span>
          </div>

          {/* Certifications */}
          <div className="flex items-center gap-3">
            {['RGPD', 'ISO 27001', 'HDS', 'SOC 2'].map((cert) => (
              <span key={cert} className="text-[9px] font-bold text-text-muted/40 tracking-[0.1em] uppercase border border-border-subtle/50 rounded-full px-2.5 py-1">
                {cert}
              </span>
            ))}
          </div>

          {/* Social */}
          <div className="flex items-center gap-3">
            <a href="https://www.linkedin.com/company/proximagreen/" target="_blank" rel="noopener noreferrer" className="text-text-muted hover:text-green-400 transition-colors" aria-label="LinkedIn">
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>
            </a>
            <a href="mailto:contact@proxima.green" className="text-text-muted hover:text-green-400 transition-colors" aria-label="Email">
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" /></svg>
            </a>
          </div>
        </div>
      </div>
    </footer>
  )
}
