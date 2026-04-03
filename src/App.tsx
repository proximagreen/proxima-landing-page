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
import { SuccessSection } from './components/sections/SuccessSection'

function LandingPage() {
  useLenis()

  return (
    <>
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
    </>
  )
}

function App() {
  const path = window.location.pathname

  return (
    <ThemeProvider>
      <PersonalizationProvider>
        <div className="scroll-progress" />
        {path === '/success' ? (
          <>
            <Navbar />
            <SuccessSection />
          </>
        ) : (
          <LandingPage />
        )}
      </PersonalizationProvider>
    </ThemeProvider>
  )
}

export default App
