import { PersonalizationProvider } from './context/PersonalizationContext'
import { ThemeProvider } from './context/ThemeContext'
import { useLenis } from './hooks/useLenis'
import { Navbar } from './components/layout/Navbar'
import { Footer } from './components/layout/Footer'
import { HeroSection } from './components/sections/HeroSection'
import { SolutionStepsSection } from './components/sections/SolutionStepsSection'
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
        <PricingSection />
        <SolutionStepsSection />
        <FinalCTASection />
      </main>
      <Footer />
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
