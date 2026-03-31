import { PersonalizationProvider } from './context/PersonalizationContext'
import { ThemeProvider } from './context/ThemeContext'
import { useLenis } from './hooks/useLenis'
import { Navbar } from './components/layout/Navbar'
import { Footer } from './components/layout/Footer'
import { ChatBot } from './components/ui/ChatBot'
import { HeroSection } from './components/sections/HeroSection'
import { ProblemSection } from './components/sections/ProblemSection'
import { SolutionStepsSection } from './components/sections/SolutionStepsSection'
import { FrameScrollSection } from './components/sections/FrameScrollSection'
import { SocialProofSection } from './components/sections/SocialProofSection'
import { QuizSection } from './components/sections/QuizSection'
import { PricingSection } from './components/sections/PricingSection'
import { FinalCTASection } from './components/sections/FinalCTASection'

/**
 * Structure optimale 2026 (data-backed) :
 *
 * Relevance → Mechanism → Confidence → Action
 *
 * 1. Hero         — Dream outcome + vidéo background
 * 2. Pain         — Agiter le problème (PAS)
 * 3. Solution     — 3 étapes + démo produit
 * 4. Social proof — Témoignages + certifs
 * 5. Quiz         — Qualifier + engager (40% conv vs 6.6% static)
 * 6. Pricing      — Hormozi value stack + Stripe checkout
 * 7. CTA Final    — Risk reversal + future pacing
 *
 * Single-focus CTA = +371% conversion
 * Short pages with clear CTAs = +13.5% performance
 * Quiz funnels = 40.1% average conversion
 */

function App() {
  useLenis()

  return (
    <ThemeProvider>
    <PersonalizationProvider>
      <div className="scroll-progress" />
      <Navbar />
      <main>
        <HeroSection />
        <ProblemSection />
        <SolutionStepsSection />
        <FrameScrollSection />
        <SocialProofSection />
        <QuizSection />
        <PricingSection />
        <FinalCTASection />
      </main>
      <Footer />
      <ChatBot />
    </PersonalizationProvider>
    </ThemeProvider>
  )
}

export default App
