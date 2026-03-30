import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Button } from '../ui/Button'
import { DonutChart, HBarChart } from '../ui/Charts'
import { usePersonalization } from '../../context/PersonalizationContext'
import { getCheckoutUrl, getSignupUrl, PLANS } from '../../lib/stripe'

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
    question: 'Comment utilisez-vous l\'IA aujourd\'hui ?',
    subtext: 'Soyez honnête, pas de jugement.',
    options: [
      { label: 'On n\'utilise pas d\'IA', value: 2, detail: 'Vos concurrents ont probablement déjà commencé.' },
      { label: 'ChatGPT / Copilot grand public', value: 3, detail: 'Vos données clients transitent par des serveurs américains.' },
      { label: 'Une solution IA interne ou européenne', value: 1, detail: 'Bonne base. Voyons si elle est vraiment sécurisée.' },
      { label: 'On interdit l\'IA par précaution', value: 2, detail: 'Prudent, mais vos équipes perdent du temps chaque jour.' },
    ],
  },
  {
    id: 'data',
    question: 'Quel type de données manipulez-vous ?',
    subtext: 'Cochez ce qui se rapproche le plus.',
    options: [
      { label: 'Contrats, dossiers clients, propriété intellectuelle', value: 3, detail: 'Données ultra-sensibles. Une fuite = dommage irréparable.' },
      { label: 'Données financières, audits, rapports', value: 3, detail: 'Soumis au secret professionnel et aux réglementations.' },
      { label: 'Documents internes, process, knowledge base', value: 1, detail: 'Moins critique, mais toujours confidentiel.' },
      { label: 'Données de santé ou données réglementées', value: 3, detail: 'Obligations HDS et RGPD renforcées.' },
    ],
  },
  {
    id: 'time',
    question: 'Combien de temps passez-vous sur des tâches répétitives ?',
    subtext: 'Recherche, rédaction, synthèse, mise en forme...',
    options: [
      { label: 'Moins d\'1 heure par jour', value: 0, detail: 'Vous êtes efficace. L\'IA peut quand même vous aider.' },
      { label: '1 à 3 heures par jour', value: 2, detail: 'C\'est 25 à 75 heures par mois. L\'IA en récupère 60%.' },
      { label: '3 à 5 heures par jour', value: 3, detail: 'C\'est plus de 100 heures/mois. L\'IA change tout.' },
      { label: 'Toute la journée, c\'est mon quotidien', value: 3, detail: 'L\'IA pourrait vous libérer 50% de votre temps.' },
    ],
  },
  {
    id: 'team',
    question: 'Combien de personnes dans votre équipe ?',
    subtext: 'Pour estimer votre gain potentiel.',
    options: [
      { label: 'Juste moi', value: 1, detail: '1 poste. ROI immédiat.' },
      { label: '2 à 5 personnes', value: 2, detail: 'L\'effet multiplicateur commence ici.' },
      { label: '6 à 20 personnes', value: 2, detail: 'Le gain de productivité devient structurel.' },
      { label: 'Plus de 20 personnes', value: 3, detail: 'L\'IA à cette échelle = avantage concurrentiel massif.' },
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
      score, riskLevel: 'critical', riskLabel: 'Critique', riskColor: 'text-red-400',
      headline: 'Vos données sont exposées. Chaque jour compte.',
      description: `Votre équipe perd environ ${monthlySavingsHours} heures/mois sur des tâches automatisables, et vos données sensibles transitent probablement par des serveurs non souverains. Le risque est réel et immédiat.`,
      savings: `${monthlySavingsHours}h/mois récupérables`,
      recommendedSeats,
    }
  }
  if (score >= 6) {
    return {
      score, riskLevel: 'high', riskLabel: 'Élevé', riskColor: 'text-orange-400',
      headline: 'Vous prenez des risques inutiles.',
      description: `Votre équipe pourrait récupérer environ ${monthlySavingsHours} heures/mois. Et vos données méritent mieux qu'un outil grand public. La bonne nouvelle : la transition prend 30 secondes.`,
      savings: `${monthlySavingsHours}h/mois récupérables`,
      recommendedSeats,
    }
  }
  if (score >= 3) {
    return {
      score, riskLevel: 'medium', riskLabel: 'Modéré', riskColor: 'text-amber-400',
      headline: 'Vous êtes sur la bonne voie, mais vous pouvez faire mieux.',
      description: `Avec une IA souveraine, votre équipe gagnerait environ ${monthlySavingsHours} heures/mois tout en renforçant la confidentialité de vos données clients.`,
      savings: `${monthlySavingsHours}h/mois récupérables`,
      recommendedSeats,
    }
  }
  return {
    score, riskLevel: 'low', riskLabel: 'Faible', riskColor: 'text-green-400',
    headline: 'Bien joué, vous êtes en avance.',
    description: `Votre posture est solide. Proxima pourrait quand même vous faire gagner ${monthlySavingsHours} heures/mois et renforcer votre conformité.`,
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
  const { segment, company, name } = usePersonalization()
  const proPrice = PLANS.pro.price
  const totalPrice = proPrice * result.recommendedSeats

  const stripeUrl = getCheckoutUrl({ segment, company, name, seats: result.recommendedSeats })
  const signupUrl = getSignupUrl({ segment, company, name })

  const scorePercent = Math.round((result.score / 12) * 100)

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
    >
      {/* Score gauge */}
      <div className="text-center mb-8">
        <div className="inline-flex flex-col items-center">
          <div className="relative w-32 h-32 mb-4">
            <svg className="w-32 h-32 -rotate-90" viewBox="0 0 120 120">
              <circle cx="60" cy="60" r="50" fill="none" stroke="currentColor" strokeWidth="6" className="text-border-subtle" />
              <motion.circle
                cx="60" cy="60" r="50" fill="none" strokeWidth="6" strokeLinecap="round"
                className={result.riskLevel === 'critical' ? 'text-red-500' : result.riskLevel === 'high' ? 'text-orange-500' : result.riskLevel === 'medium' ? 'text-amber-500' : 'text-green-500'}
                strokeDasharray={`${scorePercent * 3.14} 314`}
                initial={{ strokeDasharray: '0 314' }}
                animate={{ strokeDasharray: `${scorePercent * 3.14} 314` }}
                transition={{ duration: 1.5, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
                stroke="currentColor"
              />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className={`text-3xl font-bold ${result.riskColor}`}>{result.score}</span>
              <span className="text-[10px] text-text-muted uppercase tracking-wider">/12</span>
            </div>
          </div>
          <span className={`text-sm font-bold ${result.riskColor} uppercase tracking-wider`}>
            Risque {result.riskLabel}
          </span>
        </div>
      </div>

      {/* Headline */}
      <h3 className="text-2xl md:text-3xl font-bold text-text-primary text-center mb-4">
        {result.headline}
      </h3>
      <p className="text-text-secondary text-center max-w-lg mx-auto mb-8 leading-relaxed">
        {result.description}
      </p>

      {/* Visual donut charts */}
      <div className="grid grid-cols-3 gap-4 mb-8">
        <DonutChart
          value={scorePercent}
          label="Risque données"
          sublabel={result.riskLabel}
          color={result.riskLevel === 'critical' ? '#ef4444' : result.riskLevel === 'high' ? '#f97316' : result.riskLevel === 'medium' ? '#f59e0b' : '#22c55e'}
          size={100}
          delay={0.2}
        />
        <DonutChart
          value={60}
          label="Temps récupérable"
          sublabel={result.savings}
          color="#22c55e"
          size={100}
          delay={0.4}
        />
        <DonutChart
          value={Math.round((totalPrice / 3500) * 100)}
          label="Coût vs recrutement"
          sublabel={`${totalPrice}€ vs 3 500€`}
          color="#22c55e"
          size={100}
          delay={0.6}
        />
      </div>

      {/* Bar chart — valeur comparée */}
      <div className="glass rounded-xl p-5 md:p-6 mb-8">
        <h4 className="text-sm font-bold text-text-primary mb-5">Comparatif de valeur mensuelle</h4>
        <HBarChart
          items={[
            { label: `Proxima (${result.recommendedSeats} poste${result.recommendedSeats > 1 ? 's' : ''})`, value: totalPrice, maxValue: 3500, color: 'bg-gradient-to-r from-green-500 to-green-400', suffix: '€' },
            { label: 'ChatGPT Team', value: result.recommendedSeats * 25, maxValue: 3500, color: 'bg-gradient-to-r from-text-muted/40 to-text-muted/20', suffix: '€' },
            { label: 'Recrutement', value: 3500, maxValue: 3500, color: 'bg-gradient-to-r from-red-500/60 to-red-400/40', suffix: '€' },
          ]}
          delay={0.3}
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

      {/* CTAs */}
      <div className="flex flex-col sm:flex-row gap-3">
        <Button variant="primary" size="lg" className="flex-1 justify-center" href={stripeUrl}>
          Démarrer maintenant — {totalPrice}€/mois
        </Button>
        <Button variant="secondary" size="lg" className="flex-1 justify-center" href={signupUrl}>
          Essai gratuit d'abord
        </Button>
      </div>

      <p className="text-center text-xs text-text-muted mt-4">
        Sans engagement. Annulation en 1 clic. Paiement sécurisé par Stripe.
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
      <section className="py-[var(--section-padding)] px-4 sm:px-6 relative overflow-hidden">
        <div className="absolute inset-0 spotlight pointer-events-none" />
        <div className="max-w-2xl mx-auto relative z-10">
          <motion.div
            className="glass rounded-2xl p-8 sm:p-12 text-center border-green-500/20"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            {/* Glow behind */}
            <div className="absolute -top-20 left-1/2 -translate-x-1/2 w-80 h-80 bg-green-500/10 blur-[100px] rounded-full pointer-events-none" />

            <span className="inline-block px-4 py-1.5 rounded-full text-xs font-medium tracking-wider uppercase bg-green-500/15 text-green-400 border border-green-500/30 mb-6">
              Diagnostic gratuit — 30 secondes
            </span>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-text-primary mb-4 tracking-tight">
              Vos données sont-elles<br /><span className="text-gradient">vraiment protégées ?</span>
            </h2>
            <p className="text-base sm:text-lg text-text-secondary mb-8 max-w-md mx-auto">
              4 questions. Résultat instantané. Découvrez votre niveau de risque et combien vous perdez chaque mois.
            </p>
            <Button variant="primary" size="lg" onClick={() => setStarted(true)}>
              Lancer le diagnostic
            </Button>
            <p className="text-xs text-text-muted mt-4">Gratuit, anonyme, sans inscription</p>
          </motion.div>
        </div>
      </section>
    )
  }

  return (
    <section className="py-[var(--section-padding)] px-6 relative">
      <div className="max-w-2xl mx-auto relative z-10">
        {/* Progress */}
        {!isComplete && (
          <div className="mb-8">
            <div className="flex justify-between items-center mb-3">
              <span className="text-sm text-text-muted">Question {currentStep + 1}/{QUESTIONS.length}</span>
              <span className="text-sm text-text-muted">{Math.round(((currentStep) / QUESTIONS.length) * 100)}%</span>
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
