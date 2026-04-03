import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Button } from '../ui/Button'
import { DonutChart, HBarChart, ScoreGauge } from '../ui/Charts'
import { PLANS } from '../../lib/stripe'

/* ─── Quiz Data ─── */

interface QuizOption {
  label: string
  value: number // 0-3 severity
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
  score: number          // 0-12
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

  if (score >= 9) {
    return {
      score, riskLevel: 'critical', riskLabel: 'Maximal', riskColor: 'text-green-400',
      headline: 'Proxima est fait pour vous.',
      description: `Votre équipe peut récupérer environ ${monthlySavingsHours} heures/mois. Avec vos données sensibles, le cloisonnement souverain de Proxima est exactement ce qu'il vous faut.`,
      savings: `${monthlySavingsHours}h/mois récupérables`,
      recommendedSeats,
    }
  }
  if (score >= 6) {
    return {
      score, riskLevel: 'high', riskLabel: 'Élevé', riskColor: 'text-green-400',
      headline: 'Un impact immédiat pour votre équipe.',
      description: `Environ ${monthlySavingsHours} heures/mois récupérables. Proxima sécurise vos données et accélère vos livrables dès le premier jour.`,
      savings: `${monthlySavingsHours}h/mois récupérables`,
      recommendedSeats,
    }
  }
  if (score >= 3) {
    return {
      score, riskLevel: 'medium', riskLabel: 'Modéré', riskColor: 'text-green-400',
      headline: 'Proxima va amplifier votre productivité.',
      description: `Votre équipe gagnerait environ ${monthlySavingsHours} heures/mois avec l'IA souveraine. Le déploiement prend 30 secondes.`,
      savings: `${monthlySavingsHours}h/mois récupérables`,
      recommendedSeats,
    }
  }
  return {
    score, riskLevel: 'low', riskLabel: 'Optimisé', riskColor: 'text-green-400',
    headline: 'Vous êtes déjà bien équipé.',
    description: `Proxima peut quand même vous faire gagner ${monthlySavingsHours} heures/mois et renforcer votre conformité.`,
    savings: `${monthlySavingsHours}h/mois récupérables`,
    recommendedSeats,
  }
}

/* ─── Components ─── */

function ProgressBar({ current, total }: { current: number; total: number }) {
  return (
    <div className="flex gap-1.5">
      {Array.from({ length: total }, (_, i) => (
        <div
          key={i}
          className={`h-1 rounded-full flex-1 transition-all duration-500 ${
            i < current ? 'bg-green-500' : i === current ? 'bg-green-500/50' : 'bg-border-subtle'
          }`}
        />
      ))}
    </div>
  )
}

function QuestionCard({ question, onAnswer }: { question: QuizQuestion; onAnswer: (value: number) => void }) {
  return (
    <motion.div
      initial={{ opacity: 0, x: 40 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -40 }}
      transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
    >
      <h3 className="text-2xl md:text-3xl font-bold text-text-primary mb-2">
        {question.question}
      </h3>
      <p className="text-text-secondary mb-8">{question.subtext}</p>

      <div className="space-y-3">
        {question.options.map((option, i) => (
          <motion.button
            key={i}
            className="w-full text-left p-4 md:p-5 rounded-xl border border-border-card bg-bg-card hover:border-green-500/40 hover:bg-green-500/[0.04] transition-all duration-300 cursor-pointer group"
            onClick={() => onAnswer(option.value)}
            whileHover={{ x: 4 }}
            whileTap={{ scale: 0.98 }}
          >
            <div className="flex items-center justify-between">
              <span className="text-text-primary font-medium group-hover:text-green-400 transition-colors">
                {option.label}
              </span>
              <svg className="w-5 h-5 text-text-muted group-hover:text-green-400 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
              </svg>
            </div>
          </motion.button>
        ))}
      </div>
    </motion.div>
  )
}

function ResultCard({ result }: { result: QuizResult }) {
  const proPrice = PLANS.pro.price
  const totalPrice = proPrice * result.recommendedSeats

  const scorePercent = Math.round((result.score / 12) * 100)

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
    >
      {/* Score gauge (Chart.js Doughnut) */}
      <div className="text-center mb-8">
        <ScoreGauge
          score={result.score}
          maxScore={12}
          riskColor={result.riskLevel === 'critical' ? '#ef4444' : result.riskLevel === 'high' ? '#f97316' : result.riskLevel === 'medium' ? '#f59e0b' : '#22c55e'}
          riskLabel={result.riskLabel}
        />
      </div>

      {/* Headline */}
      <h3 className="text-2xl md:text-3xl font-bold text-text-primary text-center mb-4">
        {result.headline}
      </h3>
      <p className="text-text-secondary text-center max-w-lg mx-auto mb-8 leading-relaxed">
        {result.description}
      </p>

      {/* Visual donut charts (Chart.js) */}
      <div className="grid grid-cols-3 gap-4 mb-8">
        <DonutChart
          value={scorePercent}
          label="Risque données"
          sublabel={result.riskLabel}
          color={result.riskLevel === 'critical' ? '#ef4444' : result.riskLevel === 'high' ? '#f97316' : result.riskLevel === 'medium' ? '#f59e0b' : '#22c55e'}
          size={100}
        />
        <DonutChart
          value={60}
          label="Temps récupérable"
          sublabel={result.savings}
          color="#22c55e"
          size={100}
        />
        <DonutChart
          value={Math.round((totalPrice / 3500) * 100)}
          label="Coût vs recrutement"
          sublabel={`${totalPrice}€ vs 3 500€`}
          color="#22c55e"
          size={100}
        />
      </div>

      {/* Bar chart — valeur comparée */}
      <div className="glass rounded-xl p-5 md:p-6 mb-8">
        <HBarChart
          title="Comparatif de valeur mensuelle"
          items={[
            { label: `Proxima (${result.recommendedSeats} poste${result.recommendedSeats > 1 ? 's' : ''})`, value: totalPrice, color: '#22c55e', suffix: '€' },
            { label: 'ChatGPT Team', value: result.recommendedSeats * 25, color: 'rgba(255,255,255,0.2)', suffix: '€' },
            { label: 'Recrutement', value: 3500, color: '#ef4444', suffix: '€' },
          ]}
        />
      </div>

      {/* Hormozi Value Stack */}
      <div className="glass rounded-xl p-5 md:p-6 mb-8">
        <h4 className="text-sm font-bold text-text-primary mb-4 uppercase tracking-wider">Ce que vous obtenez</h4>
        <div className="space-y-3">
          {[
            { item: 'Chat IA illimité + RAG documentaire', value: '~500€/mois' },
            { item: 'Visioconférence IA chiffrée', value: '~200€/mois' },
            { item: 'VM dédiée en Europe', value: '~300€/mois' },
            { item: `${result.savings} récupérées`, value: 'Inestimable' },
            { item: 'Conformité RGPD garantie', value: '~4% du CA' },
          ].map((line, i) => (
            <div key={i} className="flex justify-between items-center">
              <span className="text-sm text-text-secondary flex items-center gap-2">
                <svg className="w-4 h-4 text-green-500 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                </svg>
                {line.item}
              </span>
              <span className="text-xs text-text-muted line-through">{line.value}</span>
            </div>
          ))}
          <div className="border-t border-border-subtle pt-3 mt-3">
            <div className="flex justify-between items-center mb-1">
              <span className="text-sm font-bold text-text-primary">Valeur totale</span>
              <span className="text-sm text-text-muted line-through">1 000€+/mois</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm font-bold text-green-400">Votre prix</span>
              <span className="text-xl font-bold text-green-400">{totalPrice}€/mois</span>
            </div>
          </div>
        </div>
      </div>

      {/* CTA */}
      <div className="flex justify-center">
        <Button variant="primary" size="lg" className="justify-center" href="#configurateur">
          Configurer mon accès ({totalPrice}€/mois)
        </Button>
      </div>

      <p className="text-center text-xs text-text-muted mt-4">
        Sans engagement. Annulation en 1 clic.
      </p>
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

  if (!started) {
    return (
      <section id="quiz" className="py-[var(--section-padding)] px-4 sm:px-6 relative overflow-hidden">
        {/* Background full-width */}
        <div className="absolute inset-0 bg-green-500/[0.03] pointer-events-none" />
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-green-500/[0.08] rounded-full blur-[150px]" />
        </div>

        <div className="max-w-3xl mx-auto relative z-10">
          <motion.div
            className="rounded-3xl p-10 sm:p-14 text-center relative overflow-hidden border-2 border-green-500/30 bg-gradient-to-b from-green-500/[0.08] to-transparent"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            {/* Glow behind */}
            <div className="absolute -top-20 left-1/2 -translate-x-1/2 w-80 h-80 bg-green-500/15 blur-[100px] rounded-full pointer-events-none" />

            {/* Icon */}
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-green-500/15 border border-green-500/30 mb-6">
              <svg className="w-8 h-8 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 13.5l10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75z" />
              </svg>
            </div>

            <span className="inline-block px-4 py-1.5 rounded-full text-xs font-bold tracking-wider uppercase bg-green-500/20 text-green-500 border border-green-500/30 mb-6">
              30 secondes -- 4 questions
            </span>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-text-primary mb-5 tracking-tight leading-tight">
              Combien de temps votre equipe<br /><span className="text-green-500">peut-elle recuperer</span> ?
            </h2>
            <p className="text-lg sm:text-xl text-text-secondary mb-10 max-w-lg mx-auto leading-relaxed">
              Estimez votre gain de productivite et le dimensionnement ideal de votre espace Proxima.
            </p>
            <Button variant="primary" size="lg" onClick={() => setStarted(true)}>
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M14 5l7 7m0 0l-7 7m7-7H3" />
              </svg>
              Estimer mon gain gratuitement
            </Button>
            <p className="text-sm text-text-muted mt-5">Resultat instantane, sans inscription ni email</p>
          </motion.div>
        </div>
      </section>
    )
  }

  return (
    <section id="quiz" className="py-[var(--section-padding)] px-4 sm:px-6 relative">
      <div className="absolute inset-0 bg-green-500/[0.02] pointer-events-none" />
      <div className="max-w-2xl mx-auto relative z-10">
        {/* Progress */}
        {!isComplete && (
          <div className="mb-10">
            <div className="flex justify-between items-center mb-3">
              <span className="text-sm font-medium text-text-secondary">Question {currentStep + 1}/{QUESTIONS.length}</span>
              <span className="text-sm font-bold text-green-500">{Math.round(((currentStep) / QUESTIONS.length) * 100)}%</span>
            </div>
            <ProgressBar current={currentStep} total={QUESTIONS.length} />
          </div>
        )}

        {/* Question or Result */}
        <AnimatePresence mode="wait">
          {isComplete && result ? (
            <ResultCard key="result" result={result} />
          ) : (
            <QuestionCard
              key={QUESTIONS[currentStep].id}
              question={QUESTIONS[currentStep]}
              onAnswer={handleAnswer}
            />
          )}
        </AnimatePresence>
      </div>
    </section>
  )
}
