import { useEffect, useState } from 'react'
import { Button } from '../ui/Button'

export function SuccessSection() {
  const [sessionId, setSessionId] = useState<string | null>(null)

  useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    setSessionId(params.get('session_id'))
  }, [])

  // URL de l'app = meme sous-domaine sans /welcome
  const appUrl = window.location.origin + '/'

  return (
    <section className="min-h-screen flex items-center justify-center px-4">
      <div className="max-w-lg mx-auto text-center">
        <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-green-500/15 border border-green-500/30 mb-8">
          <svg className="w-10 h-10 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
          </svg>
        </div>

        <h1 className="text-3xl sm:text-4xl font-bold text-text-primary mb-4">
          Paiement confirme
        </h1>
        <p className="text-lg text-text-secondary mb-8">
          Votre espace Proxima est pret. Connectez-vous pour commencer.
        </p>

        <Button variant="primary" size="lg" href={appUrl}>
          Acceder a mon espace Proxima
        </Button>

        {sessionId && (
          <p className="text-xs text-text-muted mt-6">
            Reference : {sessionId.slice(0, 20)}...
          </p>
        )}
      </div>
    </section>
  )
}
