import { motion } from 'framer-motion'

/**
 * 2 rangées de logos — marquee infini
 * PNG logos: filtre monochrome CSS (pas de fond noir car on utilise mix-blend-mode)
 * Texte logos: pour les marques sans PNG propre
 */

interface LogoItem {
  name: string
  src?: string
  text?: string // render as styled text
}

const ROW1: LogoItem[] = [
  { name: 'La French Tech', src: '/logos/french-tech.png' },
  { name: 'Station F', src: '/logos/station-f.png' },
  { name: 'Telecom Paris', src: '/logos/telecom-incubateur.png' },
  { name: 'NVIDIA Inception', src: '/logos/nvidia-inception.png' },
  { name: 'VINCI', text: 'VINCI' },
  { name: 'The Shift Project', src: '/logos/shift-project.png' },
  { name: 'LOUIS VUITTON', text: 'LOUIS VUITTON' },
  { name: 'Telecom Paris', src: '/logos/telecom-paris.png' },
  { name: 'ESSEC', text: 'ESSEC' },
  { name: 'Magis', src: '/logos/magis.png' },
]

const ROW2: LogoItem[] = [
  { name: 'University of Southampton', src: '/logos/southampton.png' },
  { name: 'Arts et Métiers', src: '/logos/arts-metiers.png' },
  { name: 'INSA Rennes', src: '/logos/insa.png' },
  { name: 'Région Ile-de-France', src: '/logos/ile-de-france.png' },
  { name: 'Réseau Synapse', src: '/logos/synapse.png' },
  { name: 'CIV 5.0', src: '/logos/civ5.png' },
]

function LogoSlot({ logo, height }: { logo: LogoItem; height: string }) {
  if (logo.text) {
    return (
      <span className="text-text-muted font-bold tracking-[0.15em] uppercase whitespace-nowrap text-sm sm:text-base md:text-lg" style={{ fontFamily: "'Outfit', sans-serif" }}>
        {logo.text}
      </span>
    )
  }
  return (
    <img
      src={logo.src}
      alt={logo.name}
      className={`w-auto object-contain ${height}`}
      style={{ filter: 'grayscale(100%) contrast(0) brightness(1.5)', opacity: 0.45 }}
      loading="lazy"
      onMouseEnter={e => { e.currentTarget.style.opacity = '0.8' }}
      onMouseLeave={e => { e.currentTarget.style.opacity = '0.45' }}
    />
  )
}

function MarqueeRow({ logos, height, speed, reverse }: { logos: LogoItem[]; height: string; speed: number; reverse?: boolean }) {
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
          <div key={`${logo.name}-${i}`} className="flex-shrink-0 mx-6 sm:mx-8 lg:mx-12 flex items-center h-12 sm:h-14">
            <LogoSlot logo={logo} height={height} />
          </div>
        ))}
      </motion.div>

      {/* Fade edges — use inline style for theme compat */}
      <div className="absolute inset-y-0 left-0 w-12 sm:w-20 pointer-events-none z-10" style={{ background: 'linear-gradient(to right, var(--color-bg-secondary), transparent)' }} />
      <div className="absolute inset-y-0 right-0 w-12 sm:w-20 pointer-events-none z-10" style={{ background: 'linear-gradient(to left, var(--color-bg-secondary), transparent)' }} />
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

      <MarqueeRow logos={ROW1} height="h-8 sm:h-10 md:h-12" speed={35} />

      <div className="mt-3 sm:mt-4">
        <MarqueeRow logos={ROW2} height="h-4 sm:h-5 md:h-6" speed={25} reverse />
      </div>

      <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-4 mt-8">
        {['RGPD', 'ISO 27001', 'HDS', 'SOC 2'].map((cert) => (
          <span key={cert} className="text-[9px] sm:text-[10px] font-bold text-text-muted/50 tracking-[0.12em] uppercase border border-border-subtle rounded-full px-2.5 sm:px-3 py-1">
            {cert}
          </span>
        ))}
      </div>
    </motion.div>
  )
}
