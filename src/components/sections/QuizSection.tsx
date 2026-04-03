import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Button } from '../ui/Button'
import { PLANS } from '../../lib/stripe'

/* ─── Quiz Data ─── */

interface QuizOption {
  label: string
  value: number
  detail: string
}

interface QuizQuestion {
  id: string
  question: string
  subtext: string
  options: QuizOption[]
}

const QUESTIONS: QuizQuestion[] = [
  {
    id: 'tools',
    question: 'Quel est votre usage IA actuel ?',
    subtext: 'Pour adapter votre espace Proxima.',
    options: [
      { label: 'Pas encore d\'IA en place', value: 2, detail: 'Proxima sera votre premier outil. On vous accompagne.' },
      { label: 'ChatGPT / Copilot grand public', value: 3, detail: 'Proxima reprend le même usage, avec la souveraineté en plus.' },
      { label: 'Une solution IA interne ou européenne', value: 1, detail: 'Proxima peut compléter ou remplacer votre stack.' },
      { label: 'On limite l\'IA par précaution', value: 2, detail: 'Proxima lève les freins : vos données restent chez vous.' },
    ],
  },
  {
    id: 'data',
    question: 'Quel type de données traitez-vous ?',
    subtext: 'Pour configurer le bon niveau de cloisonnement.',
    options: [
      { label: 'Contrats, dossiers clients, PI', value: 3, detail: 'Cloisonnement par dossier activé par défaut.' },
      { label: 'Données financières, audits, rapports', value: 3, detail: 'Isolation par mission, conformité RGPD garantie.' },
      { label: 'Documents internes, process, knowledge base', value: 1, detail: 'RAG documentaire idéal pour ce cas d\'usage.' },
      { label: 'Données de santé ou réglementées', value: 3, detail: 'Hébergement compatible HDS disponible.' },
    ],
  },
  {
    id: 'time',
    question: 'Combien de temps sur les tâches répétitives ?',
    subtext: 'Pour estimer votre gain avec Proxima.',
    options: [
      { label: 'Moins d\'1 heure par jour', value: 0, detail: 'L\'IA vous fera gagner en qualité plus qu\'en temps.' },
      { label: '1 à 3 heures par jour', value: 2, detail: 'Proxima peut récupérer 60% de ce temps.' },
      { label: '3 à 5 heures par jour', value: 3, detail: 'Plus de 100h/mois récupérables. Impact structurel.' },
      { label: 'Toute la journée', value: 3, detail: 'L\'IA peut libérer 50% de votre journée.' },
    ],
  },
  {
    id: 'team',
    question: 'Combien de postes à configurer ?',
    subtext: 'Pour dimensionner votre espace.',
    options: [
      { label: 'Juste moi', value: 1, detail: '1 poste. Déploiement instantané.' },
      { label: '2 à 5 personnes', value: 2, detail: 'Configuration équipe en quelques minutes.' },
      { label: '6 à 20 personnes', value: 2, detail: 'VM dédiée recommandée pour cette taille.' },
      { label: 'Plus de 20 personnes', value: 3, detail: 'On configure un environnement sur mesure.' },
    ],
  },
]

/* ─── Score Calculation ─── */

interface QuizResult {
  score: number
  riskLevel: 'low' | 'medium' | 'high' | 'critical'
  riskLabel: string
  riskColor: string
  headline: string
  description: string
  savings: string
  recommendedSeats: number
}

function calculateResult(answers: Record<string, number>): QuizResult {
  const score = Object.values(answers).reduce((a, b) => a + b, 0)
  const teamAnswer = answers.team || 1
  const seatMap: Record<number, number> = { 1: 1, 2: 5, 3: 10 }
  const recommendedSeats = seatMap[teamAnswer] || 5
  const timeAnswer = answers.time || 1
  const hoursPerDay = timeAnswer === 0 ? 0.5 : timeAnswer === 2 ? 2 : timeAnswer === 3 ? 4 : 1
  const monthlySavingsHours = Math.round(hoursPerDay * 0.6 * 22 * recommendedSeats)

  if (score >= 9) return { score, riskLevel: 'critical', riskLabel: 'Maximal', riskColor: 'text-green-400', headline: 'Proxima est fait pour vous.', description: `Votre équipe peut récupérer environ ${monthlySavingsHours} heures/mois. Avec vos données sensibles, le cloisonnement souverain de Proxima est exactement ce qu'il vous faut.`, savings: `${monthlySavingsHours}h/mois récupérables`, recommendedSeats }
  if (score >= 6) return { score, riskLevel: 'high', riskLabel: 'Élevé', riskColor: 'text-green-400', headline: 'Un impact immédiat pour votre équipe.', description: `Environ ${monthlySavingsHours} heures/mois récupérables. Proxima sécurise vos données et accélère vos livrables dès le premier jour.`, savings: `${monthlySavingsHours}h/mois récupérables`, recommendedSeats }
  if (score >= 3) return { score, riskLevel: 'medium', riskLabel: 'Modéré', riskColor: 'text-green-400', headline: 'Proxima va amplifier votre productivité.', description: `Votre équipe gagnerait environ ${monthlySavingsHours} heures/mois avec l'IA souveraine. Le déploiement prend 30 secondes.`, savings: `${monthlySavingsHours}h/mois récupérables`, recommendedSeats }
  return { score, riskLevel: 'low', riskLabel: 'Optimisé', riskColor: 'text-green-400', headline: 'Vous êtes déjà bien équipé.', description: `Proxima peut quand même vous faire gagner ${monthlySavingsHours} heures/mois et renforcer votre conformité.`, savings: `${monthlySavingsHours}h/mois récupérables`, recommendedSeats }
}

/* ─── Mini Chart Components for Intro ─── */

function MiniBarChart() {
  const days = ['Lun', 'Mar', 'Mer', 'Jeu', 'Ven']
  const saved = [2.1, 3.2, 1.8, 3.5, 2.8]
  const maxVal = 4
  return (
    <div className="space-y-2.5">
      {days.map((d, i) => (
        <div key={i} className="flex items-center gap-3">
          <span className="text-[11px] text-text-secondary font-medium w-7 shrink-0">{d}</span>
          <div className="flex-1 h-5 rounded-full bg-border-subtle overflow-hidden">
            <motion.div
              className="h-full rounded-full bg-green-500"
              initial={{ width: '0%' }}
              whileInView={{ width: `${(saved[i] / maxVal) * 100}%` }}
              viewport={{ once: true }}
              transition={{ duration: 0.7, delay: 0.1 * i, ease: 'easeOut' }}
            />
          </div>
          <span className="text-[11px] font-bold text-green-500 w-10 text-right">{saved[i]}h</span>
        </div>
      ))}
    </div>
  )
}

function MiniDonut({ value, label }: { value: number; label: string }) {
  const circumference = 2 * Math.PI * 30
  const offset = circumference - (value / 100) * circumference
  return (
    <div className="flex flex-col items-center gap-2">
      <svg width="72" height="72" viewBox="0 0 72 72">
        <circle cx="36" cy="36" r="30" fill="none" stroke="currentColor" strokeWidth="6" className="text-border-subtle" />
        <motion.circle
          cx="36" cy="36" r="30" fill="none" stroke="currentColor" strokeWidth="6"
          className="text-green-500"
          strokeLinecap="round"
          strokeDasharray={circumference}
          initial={{ strokeDashoffset: circumference }}
          whileInView={{ strokeDashoffset: offset }}
          viewport={{ once: true }}
          transition={{ duration: 1, delay: 0.3, ease: 'easeOut' }}
          transform="rotate(-90 36 36)"
        />
        <text x="36" y="36" textAnchor="middle" dominantBaseline="central" className="fill-text-primary text-sm font-bold">{value}%</text>
      </svg>
      <span className="text-[11px] text-text-muted font-medium">{label}</span>
    </div>
  )
}

/* ─── Stat Card ─── */

function StatCard({ value, label, sublabel, icon, delay }: { value: string; label: string; sublabel: string; icon: React.ReactNode; delay: number }) {
  return (
    <motion.div
      className="quiz-card rounded-2xl p-4 sm:p-5 flex flex-col gap-2"
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay }}
    >
      <div className="flex items-center justify-between">
        <span className="text-xs font-semibold text-green-500 uppercase tracking-wider">{label}</span>
        <div className="w-8 h-8 rounded-lg bg-green-500/10 flex items-center justify-center">
          {icon}
        </div>
      </div>
      <span className="text-3xl sm:text-4xl font-bold text-text-primary tracking-tight">{value}</span>
      <span className="text-xs text-green-500 font-medium">{sublabel}</span>
    </motion.div>
  )
}

/* ─── Progress Bar ─── */

function ProgressBar({ current, total }: { current: number; total: number }) {
  return (
    <div className="flex gap-2">
      {Array.from({ length: total }, (_, i) => (
        <div key={i} className="h-1.5 rounded-full flex-1 transition-all duration-500 overflow-hidden bg-border-subtle">
          {i <= current && (
            <motion.div
              className="h-full rounded-full bg-green-500"
              initial={{ width: '0%' }}
              animate={{ width: i < current ? '100%' : '50%' }}
              transition={{ duration: 0.4 }}
            />
          )}
        </div>
      ))}
    </div>
  )
}

/* ─── Question Card ─── */

function QuestionCard({ question, onAnswer, stepIndex }: { question: QuizQuestion; onAnswer: (value: number) => void; stepIndex: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, x: 40 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -40 }}
      transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
    >
      <div className="text-center mb-10">
        <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-green-500/10 border border-green-500/20 mb-4">
          <span className="text-lg font-bold text-green-500">{stepIndex + 1}</span>
        </div>
        <h3 className="text-2xl md:text-3xl font-bold text-text-primary mb-2">
          {question.question}
        </h3>
        <p className="text-text-secondary">{question.subtext}</p>
      </div>

      <div className="space-y-3">
        {question.options.map((option, i) => (
          <motion.button
            key={i}
            className="w-full text-left p-4 md:p-5 rounded-2xl border-2 border-border-card bg-bg-card hover:border-green-500/50 hover:shadow-[0_0_20px_rgba(0,60,28,0.08)] transition-all duration-300 cursor-pointer group"
            onClick={() => onAnswer(option.value)}
            whileHover={{ x: 6, scale: 1.01 }}
            whileTap={{ scale: 0.98 }}
          >
            <div className="flex items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg border-2 border-border-card group-hover:border-green-500/50 group-hover:bg-green-500/10 flex items-center justify-center transition-all shrink-0">
                  <svg className="w-4 h-4 text-transparent group-hover:text-green-500 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <span className="text-text-primary font-medium group-hover:text-green-500 transition-colors">
                  {option.label}
                </span>
              </div>
              <svg className="w-5 h-5 text-text-muted group-hover:text-green-500 transition-colors shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
              </svg>
            </div>
          </motion.button>
        ))}
      </div>
    </motion.div>
  )
}

/* ─── Result Card ─── */

function ResultCard({ result }: { result: QuizResult }) {
  const proPrice = PLANS.pro.price
  const totalPrice = proPrice * result.recommendedSeats
  const dailyCost = (proPrice / 30).toFixed(1)
  const savingsHours = result.savings.replace(/[^0-9]/g, '')

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="max-w-xl mx-auto"
    >
      {/* ── 1. Le chiffre choc ── */}
      <div className="text-center mb-10">
        <p className="text-sm font-medium text-text-muted mb-3">Votre equipe pourrait recuperer</p>
        <div className="flex items-baseline justify-center gap-2">
          <motion.span
            className="text-6xl sm:text-7xl md:text-8xl font-black text-green-500 tracking-tight"
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.2, type: 'spring' }}
          >
            {savingsHours}h
          </motion.span>
          <span className="text-xl text-text-secondary font-medium">/mois</span>
        </div>
        <p className="text-lg text-text-primary font-semibold mt-2">{result.headline}</p>
      </div>

      {/* ── 2. Avant / Apres ── */}
      <div className="grid grid-cols-2 gap-4 mb-8">
        {/* AVANT */}
        <div className="quiz-card rounded-2xl p-5 border-2 border-red-500/20">
          <div className="flex items-center gap-2 mb-4">
            <div className="w-6 h-6 rounded-full bg-red-500/15 flex items-center justify-center">
              <svg className="w-3.5 h-3.5 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </div>
            <span className="text-sm font-bold text-red-500">Aujourd'hui</span>
          </div>
          <ul className="space-y-2.5">
            {[
              'Heures perdues sur les taches repetitives',
              'Donnees sensibles sur des IA americaines',
              'Pas de cloisonnement client',
              'Recherches manuelles chronophages',
            ].map((item, i) => (
              <li key={i} className="flex items-start gap-2 text-sm text-text-secondary">
                <span className="text-red-400 mt-0.5 shrink-0">--</span>
                {item}
              </li>
            ))}
          </ul>
        </div>

        {/* APRES */}
        <div className="quiz-card rounded-2xl p-5 border-2 border-green-500/30 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-green-500/[0.04] to-transparent pointer-events-none" />
          <div className="relative">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-6 h-6 rounded-full bg-green-500/15 flex items-center justify-center">
                <svg className="w-3.5 h-3.5 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <span className="text-sm font-bold text-green-500">Avec Proxima</span>
            </div>
            <ul className="space-y-2.5">
              {[
                `${savingsHours}h/mois recuperees par l'IA`,
                '100% souverain, RGPD, europeen',
                'Cloisonnement total par dossier',
                'Reponses en secondes, sourcees',
              ].map((item, i) => (
                <li key={i} className="flex items-start gap-2 text-sm text-text-primary font-medium">
                  <svg className="w-4 h-4 text-green-500 shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* ── 3. Le prix (simple, clair) ── */}
      <div className="quiz-card rounded-2xl p-6 sm:p-8 mb-8 text-center border-2 border-green-500/25 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-green-500/[0.05] to-transparent pointer-events-none" />
        <div className="relative">
          <p className="text-sm text-text-muted mb-1">Tout ca pour</p>
          <div className="flex items-baseline justify-center gap-1 mb-2">
            <span className="text-5xl sm:text-6xl font-black text-text-primary">{dailyCost}€</span>
            <span className="text-lg text-text-muted">/jour</span>
          </div>
          <p className="text-sm text-text-secondary mb-1">par collaborateur</p>
          <p className="text-xs text-text-muted mb-6">
            soit {proPrice}€/mois/poste -- {result.recommendedSeats} poste{result.recommendedSeats > 1 ? 's' : ''} = {totalPrice}€/mois
          </p>

          <Button variant="primary" size="lg" href="#pricing">
            Demarrer maintenant
          </Button>
        </div>
      </div>

      {/* ── 4. Objection killer ── */}
      <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2 mb-6">
        {[
          'Sans engagement',
          'Annulation en 1 clic',
          'Deploiement en 30 secondes',
          'Support inclus',
        ].map((item, i) => (
          <span key={i} className="flex items-center gap-1.5 text-sm text-text-secondary">
            <svg className="w-4 h-4 text-green-500 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            {item}
          </span>
        ))}
      </div>

      {/* Lien secondaire */}
      <div className="text-center">
        <a href="https://cal.com/paul-lm" target="_blank" rel="noopener noreferrer" className="text-sm text-green-500 hover:underline font-medium">
          Vous preferez en discuter ? Prenez rendez-vous
        </a>
      </div>
    </motion.div>
  )
}

/* ─── Main Quiz Section ─── */

export function QuizSection() {
  const [started, setStarted] = useState(false)
  const [currentStep, setCurrentStep] = useState(0)
  const [answers, setAnswers] = useState<Record<string, number>>({})

  const isComplete = currentStep >= QUESTIONS.length
  const result = isComplete ? calculateResult(answers) : null

  const handleAnswer = (value: number) => {
    const question = QUESTIONS[currentStep]
    setAnswers(prev => ({ ...prev, [question.id]: value }))
    setCurrentStep(prev => prev + 1)
  }

  /* ─── Intro : Dashboard-style preview ─── */
  if (!started) {
    return (
      <section id="quiz" className="py-[var(--section-padding)] px-4 sm:px-6 relative overflow-hidden">
        <div className="max-w-4xl mx-auto relative z-10">
          {/* Header */}
          <motion.div
            className="text-center mb-10"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <span className="inline-block px-4 py-1.5 rounded-full text-xs font-bold tracking-wider uppercase bg-green-500/15 text-green-500 border border-green-500/25 mb-5">
              Diagnostic gratuit -- 30 secondes
            </span>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-text-primary mb-4 tracking-tight leading-tight">
              Quel est le <span className="text-green-500">potentiel IA</span><br />de votre équipe ?
            </h2>
            <p className="text-lg text-text-secondary max-w-xl mx-auto">
              4 questions pour estimer vos gains de productivité et dimensionner votre espace.
            </p>
          </motion.div>

          {/* Dashboard Preview Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4 mb-8">
            <StatCard
              value="3-4h"
              label="Temps récupéré"
              sublabel="par collaborateur / jour"
              delay={0.1}
              icon={<svg className="w-4 h-4 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>}
            />
            <StatCard
              value="100%"
              label="Souveraineté"
              sublabel="données en Europe"
              delay={0.2}
              icon={<svg className="w-4 h-4 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" /></svg>}
            />
            <StatCard
              value="30s"
              label="Déploiement"
              sublabel="prêt en un clic"
              delay={0.3}
              icon={<svg className="w-4 h-4 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M3.75 13.5l10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75z" /></svg>}
            />
            <StatCard
              value="60%"
              label="Gain moyen"
              sublabel="sur les tâches répétitives"
              delay={0.4}
              icon={<svg className="w-4 h-4 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M2.25 18L9 11.25l4.306 4.307a11.95 11.95 0 015.814-5.519l2.74-1.22m0 0l-5.94-2.28m5.94 2.28l-2.28 5.941" /></svg>}
            />
          </div>

          {/* Charts Row */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 sm:gap-4 mb-10">
            {/* Mini bar chart card */}
            <motion.div
              className="quiz-card rounded-2xl p-5"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.5 }}
            >
              <p className="text-xs font-semibold text-text-primary mb-1">Productivité hebdo</p>
              <p className="text-[10px] text-text-muted mb-4">Gain moyen par jour</p>
              <MiniBarChart />
            </motion.div>

            {/* Donut card */}
            <motion.div
              className="quiz-card rounded-2xl p-5 flex flex-col items-center justify-center"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.6 }}
            >
              <MiniDonut value={87} label="Taux de conformité RGPD" />
            </motion.div>

            {/* Team progress card */}
            <motion.div
              className="quiz-card rounded-2xl p-5"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.7 }}
            >
              <p className="text-xs font-semibold text-text-primary mb-4">Adoption équipe</p>
              <div className="space-y-3">
                {[
                  { label: 'Chat IA', value: 92 },
                  { label: 'RAG docs', value: 78 },
                  { label: 'Meet IA', value: 65 },
                ].map((item, i) => (
                  <div key={i}>
                    <div className="flex justify-between text-[11px] mb-1">
                      <span className="text-text-secondary font-medium">{item.label}</span>
                      <span className="text-text-muted">{item.value}%</span>
                    </div>
                    <div className="h-2 rounded-full bg-border-subtle overflow-hidden">
                      <motion.div
                        className="h-full rounded-full bg-green-500"
                        initial={{ width: '0%' }}
                        whileInView={{ width: `${item.value}%` }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8, delay: 0.8 + i * 0.1 }}
                        style={{ opacity: 0.4 + (item.value / 100) * 0.6 }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>

          {/* CTA */}
          <motion.div
            className="text-center"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.8 }}
          >
            <Button variant="primary" size="lg" onClick={() => setStarted(true)}>
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M14 5l7 7m0 0l-7 7m7-7H3" />
              </svg>
              Lancer mon diagnostic gratuit
            </Button>
            <p className="text-sm text-text-muted mt-4">Résultat instantané, sans inscription ni email</p>
          </motion.div>
        </div>
      </section>
    )
  }

  /* ─── Questions / Result ─── */
  return (
    <section id="quiz" className="py-[var(--section-padding)] px-4 sm:px-6 relative">
      <div className="max-w-2xl mx-auto relative z-10">
        {!isComplete && (
          <div className="mb-10">
            <div className="flex justify-between items-center mb-3">
              <span className="text-sm font-medium text-text-secondary">Question {currentStep + 1} sur {QUESTIONS.length}</span>
              <span className="text-sm font-bold text-green-500">{Math.round(((currentStep) / QUESTIONS.length) * 100)}%</span>
            </div>
            <ProgressBar current={currentStep} total={QUESTIONS.length} />
          </div>
        )}

        <AnimatePresence mode="wait">
          {isComplete && result ? (
            <ResultCard key="result" result={result} />
          ) : (
            <QuestionCard
              key={QUESTIONS[currentStep].id}
              question={QUESTIONS[currentStep]}
              onAnswer={handleAnswer}
              stepIndex={currentStep}
            />
          )}
        </AnimatePresence>
      </div>
    </section>
  )
}
