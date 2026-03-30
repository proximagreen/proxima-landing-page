import { motion } from 'framer-motion'

/**
 * Logos partenaires Proxima — marquee infini
 * PNGs: filtre monochrome CSS
 * SVGs complexes (VINCI, LV, ESSEC): texte stylisé (plus fiable)
 */

interface LogoItem {
  name: string
  src?: string       // PNG logo path
  textOnly?: boolean // render as styled text instead
  tall?: boolean     // taller logo (h-10/h-14 vs h-5/h-6)
}

const LOGOS: LogoItem[] = [
  { name: 'La French Tech', src: '/logos/french-tech.png', tall: true },
  { name: 'Station F', src: '/logos/station-f.png', tall: true },
  { name: 'Telecom Paris', src: '/logos/telecom-incubateur.png', tall: true },
  { name: 'NVIDIA Inception', src: '/logos/nvidia-inception.png', tall: true },
  { name: 'VINCI', textOnly: true, tall: true },
  { name: 'The Shift Project', src: '/logos/shift-project.png', tall: true },
  { name: 'Telecom Paris', src: '/logos/telecom-paris.png', tall: true },
  { name: 'LOUIS VUITTON', textOnly: true, tall: true },
  { name: 'ESSEC', textOnly: true, tall: true },
  { name: 'Magis', src: '/logos/magis.png', tall: true },
  { name: 'University of Southampton', src: '/logos/southampton.png' },
  { name: 'Arts et Métiers', src: '/logos/arts-metiers.png' },
  { name: 'INSA Rennes', src: '/logos/insa.png' },
  { name: 'Région Ile-de-France', src: '/logos/ile-de-france.png' },
  { name: 'Réseau Synapse', src: '/logos/synapse.png' },
  { name: 'CIV 5.0', src: '/logos/civ5.png' },
]

function LogoSlot({ logo }: { logo: LogoItem }) {
  if (logo.textOnly) {
    return (
      <span
        className={`font-bold tracking-[0.15em] uppercase text-text-muted whitespace-nowrap ${
          logo.tall ? 'text-base sm:text-lg md:text-xl' : 'text-xs sm:text-sm'
        }`}
        style={{ fontFamily: "'Outfit', sans-serif" }}
      >
        {logo.name}
      </span>
    )
  }

  return (
    <img
      src={logo.src}
      alt={logo.name}
      className={`w-auto object-contain logo-monochrome ${
        logo.tall ? 'h-8 sm:h-10 md:h-12' : 'h-5 sm:h-6'
      }`}
      loading="lazy"
    />
  )
}

export function LogoBanner() {
  // Triple for seamless loop
  const tripled = [...LOGOS, ...LOGOS, ...LOGOS]
  const totalWidth = LOGOS.length * 180

  return (
    <motion.div
      className="mt-12 pt-10 border-t border-border-subtle"
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 0.8 }}
    >
      <p className="text-center text-[11px] text-text-muted uppercase tracking-[0.2em] mb-6 font-medium">
        Ils nous font confiance
      </p>

      {/* Marquee */}
      <div className="relative overflow-hidden">
        <motion.div
          className="flex items-center w-max"
          animate={{ x: [0, -totalWidth] }}
          transition={{ duration: 40, repeat: Infinity, ease: 'linear' }}
        >
          {tripled.map((logo, i) => (
            <div
              key={`${logo.name}-${i}`}
              className="flex-shrink-0 mx-6 sm:mx-8 lg:mx-10 flex items-center opacity-40 hover:opacity-80 transition-opacity duration-300"
            >
              <LogoSlot logo={logo} />
            </div>
          ))}
        </motion.div>

        {/* Fade edges */}
        <div className="absolute inset-y-0 left-0 w-12 sm:w-20 bg-gradient-to-r from-bg-primary to-transparent pointer-events-none z-10" />
        <div className="absolute inset-y-0 right-0 w-12 sm:w-20 bg-gradient-to-l from-bg-primary to-transparent pointer-events-none z-10" />
      </div>

      {/* Certifications */}
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
