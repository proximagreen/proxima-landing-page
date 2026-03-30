import { motion } from 'framer-motion'

/**
 * 2 rangées de logos comme proxima.green — marquee infini
 * Rangée 1 : grands logos (partenaires principaux)
 * Rangée 2 : petits logos (écoles, réseaux)
 */

const ROW1 = [
  { name: 'La French Tech', src: '/logos/french-tech.png' },
  { name: 'Station F', src: '/logos/station-f.png' },
  { name: 'Telecom Paris', src: '/logos/telecom-incubateur.png' },
  { name: 'NVIDIA Inception', src: '/logos/nvidia-inception.png' },
  { name: 'Magis', src: '/logos/magis.png' },
  { name: 'The Shift Project', src: '/logos/shift-project.png' },
  { name: 'Telecom Paris', src: '/logos/telecom-paris.png' },
]

const ROW2 = [
  { name: 'University of Southampton', src: '/logos/southampton.png' },
  { name: 'Arts et Métiers', src: '/logos/arts-metiers.png' },
  { name: 'INSA Rennes', src: '/logos/insa.png' },
  { name: 'Région Ile-de-France', src: '/logos/ile-de-france.png' },
  { name: 'Réseau Synapse', src: '/logos/synapse.png' },
  { name: 'CIV 5.0', src: '/logos/civ5.png' },
]

function MarqueeRow({ logos, height, speed, reverse }: { logos: typeof ROW1; height: string; speed: number; reverse?: boolean }) {
  const tripled = [...logos, ...logos, ...logos]
  const totalWidth = logos.length * 180

  return (
    <div className="relative overflow-hidden">
      <motion.div
        className="flex items-center w-max"
        animate={{ x: reverse ? [-totalWidth, 0] : [0, -totalWidth] }}
        transition={{ duration: speed, repeat: Infinity, ease: 'linear' }}
      >
        {tripled.map((logo, i) => (
          <div
            key={`${logo.name}-${i}`}
            className="flex-shrink-0 mx-6 sm:mx-8 lg:mx-12 flex items-center"
          >
            <img
              src={logo.src}
              alt={logo.name}
              className={`w-auto object-contain logo-monochrome opacity-50 hover:opacity-90 transition-opacity duration-300 ${height}`}
              loading="lazy"
            />
          </div>
        ))}
      </motion.div>

      {/* Fade edges */}
      <div className="absolute inset-y-0 left-0 w-12 sm:w-20 bg-gradient-to-r from-bg-secondary to-transparent pointer-events-none z-10" />
      <div className="absolute inset-y-0 right-0 w-12 sm:w-20 bg-gradient-to-l from-bg-secondary to-transparent pointer-events-none z-10" />
    </div>
  )
}

export function LogoBanner() {
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

      {/* Row 1 — grands logos */}
      <MarqueeRow logos={ROW1} height="h-8 sm:h-10 md:h-12" speed={30} />

      {/* Row 2 — petits logos, direction inversée */}
      <div className="mt-3 sm:mt-4">
        <MarqueeRow logos={ROW2} height="h-4 sm:h-5 md:h-6" speed={25} reverse />
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
