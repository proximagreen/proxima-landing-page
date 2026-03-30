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
  { icon: 'chat', title: 'Chat IA confidentiel', description: 'Analysez des contrats, rédigez des rapports, synthétisez des dossiers — sans jamais exposer les données de vos clients.' },
  { icon: 'search', title: 'Recherche Web IA', description: 'Veille concurrentielle, recherche réglementaire, benchmarks — l\'IA cherche pour vous, sans tracking ni fuite.' },
  { icon: 'folder', title: 'Dossiers cloisonnés', description: 'Un dossier par client, par mission, par projet. Cloisonnement total. Aucune contamination croisée.' },
  { icon: 'document', title: 'RAG documentaire', description: 'Interrogez vos documents internes en langage naturel. L\'IA trouve la réponse dans vos fichiers en secondes.' },
  { icon: 'video', title: 'Proxima Meet', description: 'Visioconférence IA intégrée. Transcription, résumé et actions — dans un environnement chiffré de bout en bout.' },
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
  { step: 1, title: 'Connectez votre équipe', description: 'Créez votre espace en 30 secondes. Invitez vos collaborateurs. Aucune installation, aucune config serveur.', icon: 'sparkles' },
  { step: 2, title: 'Travaillez en confiance', description: 'Chat IA, analyse de documents, visio — dans un environnement où les données de vos clients restent les vôtres.', icon: 'shield' },
  { step: 3, title: 'Délivrez plus, plus vite', description: 'Réduisez vos temps de production, augmentez votre capacité et démarquez-vous par la qualité de vos livrables.', icon: 'chart-bar' },
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
      headline: 'Vos clients vous confient\nleurs secrets.\nProtégez-les avec l\'IA.',
      headlinePersonalized: '{name}, {company}\nmérite une IA à la hauteur\ndu secret professionnel',
      subheadline: 'L\'IA confidentielle qui accélère votre cabinet sans jamais compromettre la confiance de vos clients. Recherche, rédaction, analyse — en toute souveraineté.',
      ctaPrimary: 'Essayer gratuitement',
      ctaSecondary: 'Voir les tarifs',
    },
    problems: [
      { stat: '3-4h/jour', text: 'perdues en recherche jurisprudentielle répétitive', icon: 'clock', color: '#f59e0b', gauge: 45 },
      { stat: '4,45 M€', text: 'coût moyen d\'une fuite de données (IBM 2024)', icon: 'leak', color: '#ef4444', gauge: 85 },
      { stat: '72%', text: 'des avocats utilisent ChatGPT sans garantie de confidentialité', icon: 'warning', color: '#f97316', gauge: 72 },
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
      { name: 'Me Sophie Laurent', role: 'Avocate PI, Associée', company: 'Laurent & Associés', quote: 'On analysait un portefeuille de brevets en 2 jours. Avec Proxima, c\'est fait en 3 heures — et mes clients n\'ont jamais été aussi bien protégés.', avatar: 'SL', photo: '/images/testimonial-2.jpg' },
      { name: 'Me Pierre Dubois', role: 'Avocat Droit des Affaires', company: 'Cabinet Dubois', quote: 'Enfin une IA que je peux utiliser devant mes clients sans rougir. Le cloisonnement des dossiers, c\'est ce qui a tout changé.', avatar: 'PD', photo: '/images/testimonial-1.jpg' },
    ],
    pricing: {
      headline: 'Un investissement rentable dès le premier mois',
      subheadline: 'Comparez : 3h gagnées par jour × vos honoraires. Le calcul est vite fait.',
    },
    faqs: [
      ...SHARED_FAQS,
      { question: 'Est-ce conforme aux règles déontologiques du barreau ?', answer: 'Oui. Proxima respecte les exigences de l\'article 66-5 sur le secret professionnel et les recommandations du CNB sur l\'utilisation de l\'IA.' },
    ],
  },
  health: {
    hero: {
      headline: 'Vos patients comptent\nsur votre discrétion.\nVotre IA aussi.',
      headlinePersonalized: '{name}, {company}\nmérite une IA qui protège\nle secret médical',
      subheadline: 'IA souveraine, confidentielle, compatible HDS. Accélérez votre pratique sans jamais compromettre les données de vos patients.',
      ctaPrimary: 'Essayer gratuitement',
      ctaSecondary: 'Voir les tarifs',
    },
    problems: [
      { stat: '67%', text: 'des professionnels de santé veulent utiliser l\'IA mais craignent pour les données patients', icon: 'warning', color: '#f97316', gauge: 67 },
      { stat: '4,45 M€', text: 'coût moyen d\'une fuite de données de santé (IBM 2024)', icon: 'leak', color: '#ef4444', gauge: 85 },
      { stat: '10h/sem', text: 'passées en tâches administratives qui pourraient être automatisées', icon: 'clock', color: '#f59e0b', gauge: 55 },
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
      headline: 'Modernisez votre pratique en toute sérénité',
      subheadline: 'Choisissez le nombre de postes pour votre établissement',
    },
    faqs: [
      ...SHARED_FAQS,
      { question: 'Proxima est-il compatible HDS ?', answer: 'Oui. Notre infrastructure est conçue pour être compatible avec les exigences d\'Hébergement de Données de Santé.' },
    ],
  },
  audit: {
    hero: {
      headline: 'Vos mandats exigent\nla confidentialité absolue.\nVotre IA doit suivre.',
      headlinePersonalized: '{name}, {company}\nmérite une IA\nà la hauteur de ses engagements',
      subheadline: 'Analysez, auditez, conseillez — avec une IA qui cloisonne chaque mission et accélère vos livrables sans compromettre la confiance de vos clients.',
      ctaPrimary: 'Essayer gratuitement',
      ctaSecondary: 'Voir les tarifs',
    },
    problems: [
      { stat: '60%', text: 'du temps d\'un consultant passe en production de livrables, pas en conseil à valeur ajoutée', icon: 'clock', color: '#f59e0b', gauge: 60 },
      { stat: '4,45 M€', text: 'coût moyen d\'une fuite de données (IBM 2024)', icon: 'leak', color: '#ef4444', gauge: 85 },
      { stat: '0', text: 'outil IA grand public qui garantit le cloisonnement entre missions clients', icon: 'warning', color: '#f97316', gauge: 100 },
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
      headline: 'Plus de mandats, même équipe, meilleure marge',
      subheadline: 'Le ROI se mesure dès le premier mois d\'utilisation',
    },
    faqs: [
      ...SHARED_FAQS,
      { question: 'Les données d\'un client peuvent-elles être vues par un autre ?', answer: 'Jamais. Chaque dossier est cloisonné de manière étanche. L\'IA n\'a accès qu\'aux documents du dossier dans lequel vous travaillez.' },
    ],
  },
  general: {
    hero: {
      headline: 'L\'IA confidentielle\nqui vous rend\nplus compétitif',
      headlinePersonalized: '{name}, bienvenue.\nDécouvrez l\'IA souveraine\nqui change tout',
      subheadline: 'Avocats PI, CGP, cabinets de conseil, auditeurs — vous gérez des données sensibles. Proxima vous donne la puissance de l\'IA sans jamais compromettre la confiance de vos clients.',
      ctaPrimary: 'Essayer gratuitement',
      ctaSecondary: 'Voir les tarifs',
    },
    problems: [
      { stat: '87%', text: 'des professionnels veulent utiliser l\'IA mais ne font pas confiance aux outils grand public', icon: 'warning', color: '#f97316', gauge: 87 },
      { stat: '4,45 M€', text: 'coût moyen d\'une fuite de données client (IBM 2024)', icon: 'leak', color: '#ef4444', gauge: 85 },
      { stat: '3h/jour', text: 'perdues en tâches répétitives que l\'IA pourrait traiter en minutes', icon: 'clock', color: '#f59e0b', gauge: 40 },
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
      headline: 'Investissez dans votre avantage concurrentiel',
      subheadline: 'Le temps gagné × votre taux horaire = ROI dès le premier mois',
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
