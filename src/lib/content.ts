import type { Segment } from '../context/PersonalizationContext'
import type { IconName } from '../components/ui/Icon'

interface HeroContent {
  headline: string
  headlinePersonalized: string
  subheadline: string
  ctaPrimary: string
  ctaSecondary: string
}

interface ValueProp {
  icon: IconName
  title: string
  description: string
}

interface Feature {
  icon: IconName
  title: string
  description: string
}

interface Testimonial {
  name: string
  role: string
  company: string
  quote: string
  avatar: string
  photo?: string
}

interface WhyPoint {
  text: string
}

interface PricingContent {
  headline: string
  subheadline: string
}

interface ProblemPoint {
  stat: string
  text: string
  icon: 'clock' | 'leak' | 'warning'
  color: string
  gauge: number // 0-100, visual fill percentage
}

interface SolutionStep {
  step: number
  title: string
  description: string
  icon: IconName
}

interface FAQ {
  question: string
  answer: string
}

interface SegmentContent {
  hero: HeroContent
  problems: ProblemPoint[]
  solutionSteps: SolutionStep[]
  valueProps: ValueProp[]
  features: Feature[]
  whyGreen: WhyPoint[]
  whyPrivate: WhyPoint[]
  testimonials: Testimonial[]
  pricing: PricingContent
  faqs: FAQ[]
}

const SHARED_FEATURES: Feature[] = [
  { icon: 'chat', title: 'Chat IA confidentiel', description: 'Analysez des contrats, rédigez des rapports, synthétisez des dossiers. Sans jamais exposer les données de vos clients.' },
  { icon: 'search', title: 'Recherche Web IA', description: 'Veille concurrentielle, recherche réglementaire, benchmarks. L\'IA cherche pour vous, sans tracking ni fuite.' },
  { icon: 'folder', title: 'Dossiers cloisonnés', description: 'Un dossier par client, par mission, par projet. Cloisonnement total. Aucune contamination croisée.' },
  { icon: 'document', title: 'RAG documentaire', description: 'Interrogez vos documents internes en langage naturel. L\'IA trouve la réponse dans vos fichiers en secondes.' },
  { icon: 'video', title: 'Proxima Meet', description: 'Visioconférence IA intégrée. Transcription, résumé et actions, dans un environnement chiffré de bout en bout.' },
]

const SHARED_WHY_GREEN: WhyPoint[] = [
  { text: 'Serveurs parmi les plus verts disponibles en Europe' },
  { text: 'Réutilisation de la chaleur des centres de données' },
  { text: 'Modèles optimisés pour un impact environnemental réduit' },
  { text: 'Un argument RSE concret pour vos appels d\'offres' },
]

const SHARED_WHY_PRIVATE: WhyPoint[] = [
  { text: 'Conforme au RGPD et aux réglementations européennes' },
  { text: 'Contrôle total : vos données ne quittent jamais l\'Europe' },
  { text: 'Aucun prompt ni conversation utilisé pour l\'entraînement IA' },
  { text: 'Vie privée par défaut, pas en option payante' },
]

const SHARED_SOLUTION_STEPS: SolutionStep[] = [
  { step: 1, title: 'On configure votre espace', description: 'Votre instance Proxima est déployée sur un cloud souverain dédié. Vos équipes sont invitées en quelques clics.', icon: 'sparkles' },
  { step: 2, title: 'Votre équipe est opérationnelle', description: 'Chat IA, analyse de documents, visio chiffrée. Tout fonctionne dans un environnement cloisonné par client.', icon: 'shield' },
  { step: 3, title: 'On vous accompagne', description: 'Support prioritaire, formations, optimisation continue. Votre succès est notre métrique.', icon: 'chart-bar' },
]

const SHARED_FAQS: FAQ[] = [
  {
    question: 'Où sont stockées nos données ?',
    answer: 'Exclusivement en Europe, dans des data centers certifiés. Vos données ne transitent jamais par des serveurs américains ou soumis au Cloud Act.',
  },
  {
    question: 'Est-ce que nos données servent à entraîner l\'IA ?',
    answer: 'Non. Jamais. Vos conversations, documents et données clients ne sont jamais utilisés pour l\'entraînement des modèles. C\'est contractuel.',
  },
  {
    question: 'Est-ce conforme au RGPD ?',
    answer: 'Oui. Proxima est conçu dès l\'origine pour la conformité RGPD. Nous sommes hébergés en Europe, avec chiffrement de bout en bout et DPA disponible sur demande.',
  },
  {
    question: 'Combien de temps faut-il pour démarrer ?',
    answer: '30 secondes. Créez un compte, invitez votre équipe, commencez à travailler. Aucune installation, aucune configuration technique requise.',
  },
  {
    question: 'Puis-je tester avant de m\'engager ?',
    answer: 'Oui. Le plan Découverte est gratuit, sans carte bancaire. Vous pouvez tester Proxima en conditions réelles avant de passer au plan Entreprise.',
  },
]

export const CONTENT: Record<Segment, SegmentContent> = {
  legal: {
    hero: {
      headline: 'Votre IA confidentielle\nest prête.\nPassez à l\'action.',
      headlinePersonalized: '{name}, l\'espace IA\nde {company} est prêt',
      subheadline: 'Chat IA, recherche juridique, visio chiffrée, cloisonnement par dossier. Tout est déployé, souverain, et prêt pour votre équipe.',
      ctaPrimary: 'Accéder à mon espace',
      ctaSecondary: '',
    },
    problems: [
      { stat: '3-4h/jour', text: 'récupérées grâce à l\'IA sur la recherche jurisprudentielle', icon: 'clock', color: 'var(--color-green-500)', gauge: 45 },
      { stat: '100%', text: 'de vos données restent en Europe, hors Cloud Act', icon: 'leak', color: 'var(--color-green-500)', gauge: 100 },
      { stat: '30s', text: 'pour déployer votre espace et connecter votre équipe', icon: 'warning', color: 'var(--color-green-500)', gauge: 30 },
    ],
    solutionSteps: SHARED_SOLUTION_STEPS,
    valueProps: [
      { icon: 'shield', title: 'Secret professionnel garanti', description: 'Vos données clients restent cloisonnées. Aucune fuite, aucun entraînement. Conforme aux exigences du CNB.' },
      { icon: 'globe', title: 'Souveraine & Européenne', description: 'Hébergée en France, conforme RGPD. Hors de portée du Cloud Act américain.' },
      { icon: 'leaf', title: 'Un argument RSE concret', description: 'Infrastructure verte. Un avantage différenciant dans vos réponses aux appels d\'offres.' },
    ],
    features: SHARED_FEATURES,
    whyGreen: SHARED_WHY_GREEN,
    whyPrivate: [
      ...SHARED_WHY_PRIVATE,
      { text: 'Conforme aux exigences du secret professionnel des avocats (art. 66-5)' },
    ],
    testimonials: [
      { name: 'Me Sophie Laurent', role: 'Avocate PI, Associée', company: 'Laurent & Associés', quote: 'On analysait un portefeuille de brevets en 2 jours. Avec Proxima, c\'est fait en 3 heures, et mes clients n\'ont jamais été aussi bien protégés.', avatar: 'SL', photo: '/images/testimonial-2.jpg' },
      { name: 'Me Pierre Dubois', role: 'Avocat Droit des Affaires', company: 'Cabinet Dubois', quote: 'Enfin une IA que je peux utiliser devant mes clients sans rougir. Le cloisonnement des dossiers, c\'est ce qui a tout changé.', avatar: 'PD', photo: '/images/testimonial-1.jpg' },
    ],
    pricing: {
      headline: 'Un accès tout inclus, sans surprise',
      subheadline: 'Déploiement, support, mises à jour. Tout est compris.',
    },
    faqs: [
      ...SHARED_FAQS,
      { question: 'Est-ce conforme aux règles déontologiques du barreau ?', answer: 'Oui. Proxima respecte les exigences de l\'article 66-5 sur le secret professionnel et les recommandations du CNB sur l\'utilisation de l\'IA.' },
    ],
  },
  health: {
    hero: {
      headline: 'Votre IA souveraine\nest prête.\nAccélérez votre pratique.',
      headlinePersonalized: '{name}, l\'espace IA\nde {company} est prêt',
      subheadline: 'Chat IA confidentiel, analyse documentaire, visio chiffrée. Compatible HDS, déployé en Europe, prêt pour votre équipe.',
      ctaPrimary: 'Accéder à mon espace',
      ctaSecondary: '',
    },
    problems: [
      { stat: '10h/sem', text: 'récupérées sur les tâches administratives répétitives', icon: 'clock', color: 'var(--color-green-500)', gauge: 55 },
      { stat: '100%', text: 'compatible HDS, données hébergées en Europe', icon: 'leak', color: 'var(--color-green-500)', gauge: 100 },
      { stat: '30s', text: 'pour déployer et connecter votre équipe', icon: 'warning', color: 'var(--color-green-500)', gauge: 30 },
    ],
    solutionSteps: SHARED_SOLUTION_STEPS,
    valueProps: [
      { icon: 'shield', title: 'Secret médical garanti', description: 'Vos données patients ne quittent jamais l\'environnement sécurisé. Aucun entraînement sur vos données.' },
      { icon: 'globe', title: 'Compatible HDS', description: 'Infrastructure européenne conforme aux exigences d\'hébergement de données de santé.' },
      { icon: 'leaf', title: 'Responsable', description: 'Une IA qui soigne aussi la planète. Infrastructure verte et optimisée.' },
    ],
    features: SHARED_FEATURES,
    whyGreen: SHARED_WHY_GREEN,
    whyPrivate: [
      ...SHARED_WHY_PRIVATE,
      { text: 'Compatible avec les exigences HDS (Hébergement Données de Santé)' },
    ],
    testimonials: [
      { name: 'Dr. Marie Chen', role: 'Médecin généraliste', company: 'Cabinet médical Bastille', quote: 'Proxima m\'aide à synthétiser les dernières études en minutes. Mes patients bénéficient d\'un meilleur suivi, et leurs données restent protégées.', avatar: 'MC', photo: '/images/testimonial-2.jpg' },
    ],
    pricing: {
      headline: 'Un accès adapté à votre établissement',
      subheadline: 'Déploiement, support, conformité HDS. Tout est inclus.',
    },
    faqs: [
      ...SHARED_FAQS,
      { question: 'Proxima est-il compatible HDS ?', answer: 'Oui. Notre infrastructure est conçue pour être compatible avec les exigences d\'Hébergement de Données de Santé.' },
    ],
  },
  audit: {
    hero: {
      headline: 'Votre IA cloisonnée\nest prête.\nLivrez plus vite.',
      headlinePersonalized: '{name}, l\'espace IA\nde {company} est prêt',
      subheadline: 'Chat IA, analyse de documents, visio chiffrée. Chaque mission cloisonnée, chaque donnée souveraine. Prêt pour votre équipe.',
      ctaPrimary: 'Accéder à mon espace',
      ctaSecondary: '',
    },
    problems: [
      { stat: '2x', text: 'plus rapide sur la production de livrables et rapports', icon: 'clock', color: 'var(--color-green-500)', gauge: 60 },
      { stat: '100%', text: 'cloisonnement par mission, aucune contamination croisée', icon: 'leak', color: 'var(--color-green-500)', gauge: 100 },
      { stat: '30s', text: 'pour déployer et connecter votre équipe', icon: 'warning', color: 'var(--color-green-500)', gauge: 30 },
    ],
    solutionSteps: SHARED_SOLUTION_STEPS,
    valueProps: [
      { icon: 'shield', title: 'Cloisonnement par mission', description: 'Chaque audit, chaque analyse reste strictement confidentielle. Aucune contamination croisée entre mandats.' },
      { icon: 'globe', title: 'Conformité européenne', description: 'Hébergée en Europe, alignée avec les normes d\'audit, de conformité et les exigences RGPD.' },
      { icon: 'chart-bar', title: 'Un levier de croissance', description: 'Livrez vos rapports 2x plus vite. Prenez plus de mandats. Démontrez votre avance technologique.' },
    ],
    features: SHARED_FEATURES,
    whyGreen: SHARED_WHY_GREEN,
    whyPrivate: SHARED_WHY_PRIVATE,
    testimonials: [
      { name: 'Thomas Renard', role: 'Directeur Audit', company: 'Conseil & Audit SA', quote: 'On a réduit le temps de production de nos rapports de 40%. Et nos clients savent que leurs données ne sortent jamais de notre environnement.', avatar: 'TR', photo: '/images/testimonial-3.jpg' },
      { name: 'Camille Moreau', role: 'Associée CGP', company: 'Patrimoine & Stratégie', quote: 'Mes analyses patrimoniales sont plus rapides et plus complètes. Proxima me permet de prendre plus de clients sans sacrifier la qualité.', avatar: 'CM', photo: '/images/testimonial-2.jpg' },
    ],
    pricing: {
      headline: 'Un accès clé en main pour votre équipe',
      subheadline: 'Déploiement, cloisonnement, support. Tout est inclus.',
    },
    faqs: [
      ...SHARED_FAQS,
      { question: 'Les données d\'un client peuvent-elles être vues par un autre ?', answer: 'Jamais. Chaque dossier est cloisonné de manière étanche. L\'IA n\'a accès qu\'aux documents du dossier dans lequel vous travaillez.' },
    ],
  },
  general: {
    hero: {
      headline: 'Votre IA confidentielle\nest prête.\nPassez à l\'action.',
      headlinePersonalized: '{name}, bienvenue.\nVotre espace Proxima\nest prêt',
      subheadline: 'Chat IA, recherche web, visio chiffrée, cloisonnement par client. Tout est déployé sur un cloud souverain européen, prêt pour votre équipe.',
      ctaPrimary: 'Accéder à mon espace',
      ctaSecondary: '',
    },
    problems: [
      { stat: '3h/jour', text: 'récupérées sur les tâches répétitives grâce à l\'IA', icon: 'clock', color: 'var(--color-green-500)', gauge: 40 },
      { stat: '100%', text: 'souverain, européen, conforme RGPD', icon: 'leak', color: 'var(--color-green-500)', gauge: 100 },
      { stat: '30s', text: 'pour déployer et connecter votre équipe', icon: 'warning', color: 'var(--color-green-500)', gauge: 30 },
    ],
    solutionSteps: SHARED_SOLUTION_STEPS,
    valueProps: [
      { icon: 'shield', title: 'Confidentielle par conception', description: 'Vos données clients restent les vôtres. Cloisonnement total. Aucun entraînement. Aucune fuite.' },
      { icon: 'globe', title: 'Souveraine & Européenne', description: 'Hébergée en Europe, hors Cloud Act. Conforme RGPD. Idéale pour les professions réglementées.' },
      { icon: 'chart-bar', title: 'Un avantage concurrentiel', description: 'Délivrez plus vite, avec plus de qualité. Prenez plus de clients. Augmentez votre rentabilité.' },
    ],
    features: SHARED_FEATURES,
    whyGreen: SHARED_WHY_GREEN,
    whyPrivate: SHARED_WHY_PRIVATE,
    testimonials: [
      { name: 'Julie Martin', role: 'Fondatrice', company: 'GreenTech Conseil', quote: 'On a doublé notre capacité de production de rapports sans recruter. Et nos clients nous choisissent pour notre engagement confidentialité.', avatar: 'JM', photo: '/images/testimonial-2.jpg' },
      { name: 'Marc Lefèvre', role: 'DPO & CTO', company: 'DataPriv', quote: 'La seule IA que notre DPO a validée sans réserve. On l\'utilise sur tous nos audits de conformité.', avatar: 'ML', photo: '/images/testimonial-1.jpg' },
    ],
    pricing: {
      headline: 'Un accès complet, un prix simple',
      subheadline: 'Déploiement, support prioritaire, mises à jour. Tout est inclus.',
    },
    faqs: SHARED_FAQS,
  },
}

export function getContent(segment: Segment) {
  return CONTENT[segment]
}

export function resolveHeadline(
  content: SegmentContent,
  name: string | null,
  company: string | null
): string {
  if (name || company) {
    return content.hero.headlinePersonalized
      .replace('{name}', name || 'vous')
      .replace('{company}', company || 'votre entreprise')
  }
  return content.hero.headline
}
