import { motion } from 'framer-motion'

/**
 * Logos clients / partenaires — vrais SVGs depuis /public/logos/
 * Rendus en monochrome via CSS filter pour s'adapter au thème.
 */

const LOGOS = [
  { name: 'VINCI', src: '/logos/vinci.svg' },
  { name: 'Louis Vuitton', src: '/logos/louis-vuitton.svg' },
  { name: 'ESSEC', src: '/logos/essec.svg' },
]

export function LogoBanner() {
  return (
    <motion.div
      className="mt-14 pt-10 border-t border-border-subtle"
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 0.8 }}
    >
      <p className="text-center text-[11px] text-text-muted uppercase tracking-[0.2em] mb-8 font-medium">
        Ils nous font confiance
      </p>

      {/* Logos — grille responsive, monochrome */}
      <div className="flex flex-wrap items-center justify-center gap-8 sm:gap-12 md:gap-16 px-4">
        {/* Proxima logo */}
        <div className="flex items-center gap-2 opacity-40 hover:opacity-70 transition-opacity duration-500 shrink-0">
          <img src="/favicon-proxima.png" alt="Proxima" width={22} height={22} className="w-5 h-5 sm:w-6 sm:h-6" />
          <span className="text-text-muted text-base sm:text-lg font-bold tracking-tight">Proxima</span>
        </div>

        {/* External logos — rendered monochrome white via CSS */}
        {LOGOS.map(({ name, src }) => (
          <div key={name} className="shrink-0 opacity-40 hover:opacity-70 transition-opacity duration-500" title={name}>
            <img
              src={src}
              alt={name}
              className="h-6 sm:h-7 md:h-8 w-auto max-w-[120px] sm:max-w-[140px] object-contain logo-monochrome"
            />
          </div>
        ))}
      </div>

      {/* Certifications badges */}
      <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-4 mt-8">
        {['RGPD', 'ISO 27001', 'HDS', 'SOC 2'].map((cert) => (
          <span
            key={cert}
            className="text-[9px] sm:text-[10px] font-bold text-text-muted/50 tracking-[0.12em] uppercase border border-border-subtle rounded-full px-2.5 sm:px-3 py-1"
          >
            {cert}
          </span>
        ))}
      </div>
    </motion.div>
  )
}
