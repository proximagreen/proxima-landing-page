import { motion } from 'framer-motion'

/**
 * Logos clients / partenaires en style monochrome.
 * Affichés en blanc/gris sur fond sombre, comme Linear, Vercel, etc.
 */

function LogoVinci() {
  return (
    <svg viewBox="0 0 120 32" fill="currentColor" className="h-6 md:h-7">
      <text x="0" y="24" fontFamily="'Outfit', sans-serif" fontWeight="900" fontSize="26" letterSpacing="4">VINCI</text>
    </svg>
  )
}

function LogoLouisVuitton() {
  return (
    <svg viewBox="0 0 160 32" fill="currentColor" className="h-5 md:h-6">
      <text x="0" y="23" fontFamily="'Outfit', sans-serif" fontWeight="600" fontSize="18" letterSpacing="5">LOUIS VUITTON</text>
    </svg>
  )
}

function LogoESSEC() {
  return (
    <svg viewBox="0 0 110 32" fill="currentColor" className="h-6 md:h-7">
      <text x="0" y="24" fontFamily="'Outfit', sans-serif" fontWeight="800" fontSize="26" letterSpacing="3">ESSEC</text>
    </svg>
  )
}

function LogoProxima() {
  return (
    <div className="flex items-center gap-2">
      <img src="/favicon-proxima.png" alt="" width={20} height={20} className="w-5 h-5 opacity-60" />
      <svg viewBox="0 0 110 28" fill="currentColor" className="h-5 md:h-6">
        <text x="0" y="22" fontFamily="'Outfit', sans-serif" fontWeight="700" fontSize="22" letterSpacing="1">Proxima</text>
      </svg>
    </div>
  )
}

const LOGOS = [
  { name: 'VINCI', component: LogoVinci },
  { name: 'Louis Vuitton', component: LogoLouisVuitton },
  { name: 'ESSEC', component: LogoESSEC },
  { name: 'Proxima', component: LogoProxima },
]

export function LogoBanner() {
  return (
    <motion.div
      className="mt-16 pt-12 border-t border-border-subtle"
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 0.8 }}
    >
      <p className="text-center text-xs text-text-muted uppercase tracking-[0.2em] mb-8 font-medium">
        Ils travaillent avec nous
      </p>
      <div className="flex flex-wrap items-center justify-center gap-8 md:gap-14 text-text-muted/40 hover:[&>div]:text-text-muted/70 [&>div]:transition-colors [&>div]:duration-500">
        {LOGOS.map(({ name, component: Logo }) => (
          <div key={name} className="shrink-0" title={name}>
            <Logo />
          </div>
        ))}
      </div>

      {/* Trust badges */}
      <div className="flex flex-wrap items-center justify-center gap-6 md:gap-10 mt-10 text-text-muted/30">
        {['RGPD', 'ISO 27001', 'HDS', 'SOC 2'].map((cert) => (
          <span key={cert} className="text-[10px] md:text-xs font-bold tracking-[0.15em] uppercase border border-border-subtle rounded-full px-3 py-1">
            {cert}
          </span>
        ))}
      </div>
    </motion.div>
  )
}
