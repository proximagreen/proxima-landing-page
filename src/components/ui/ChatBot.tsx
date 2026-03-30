import { useState, useRef, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

/* ─── Types ─── */

interface Message {
  role: 'user' | 'assistant'
  content: string
}

type Mode = 'text' | 'voice'

/* ─── OpenRouter config ─── */

const API_KEY = import.meta.env.VITE_OPENROUTER_API_KEY || ''
const MODEL = import.meta.env.VITE_OPENROUTER_MODEL || 'mistralai/voxtral-small-24b-2507'

const SYSTEM_PROMPT = `Tu es l'assistant IA de Proxima (proxima.green), une plateforme d'IA confidentielle, souveraine et europeenne pour les professionnels (avocats, consultants, auditeurs, sante).
Tu reponds de maniere concise, professionnelle et chaleureuse. Tu connais les fonctionnalites : Chat IA, Proxima Meet (visio chiffree), Agents IA, RAG documentaire, cloisonnement par dossier, hebergement europeen conforme RGPD.
Prix : 9€/poste/mois tout inclus. Reponds en francais. 3 phrases max par reponse.`

/* ─── API Call ─── */

async function chatCompletion(messages: Message[]): Promise<string> {
  const res = await fetch('https://openrouter.ai/api/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${API_KEY}`,
      'Content-Type': 'application/json',
      'HTTP-Referer': 'https://proxima.green',
      'X-Title': 'Proxima Chat',
    },
    body: JSON.stringify({
      model: MODEL,
      messages: [
        { role: 'system', content: SYSTEM_PROMPT },
        ...messages.map(m => ({ role: m.role, content: m.content })),
      ],
      max_tokens: 300,
      temperature: 0.7,
    }),
  })

  if (!res.ok) throw new Error(`API error: ${res.status}`)

  const data = await res.json()
  return data.choices?.[0]?.message?.content || 'Desolee, je n\'ai pas pu repondre.'
}

/* ─── Voice Recognition Hook ─── */

function useVoiceRecognition(onResult: (text: string) => void) {
  const recognitionRef = useRef<SpeechRecognition | null>(null)
  const [isListening, setIsListening] = useState(false)

  const start = useCallback(() => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition
    if (!SpeechRecognition) return

    const recognition = new SpeechRecognition()
    recognition.lang = 'fr-FR'
    recognition.continuous = false
    recognition.interimResults = false

    recognition.onresult = (event: SpeechRecognitionEvent) => {
      const text = event.results[0][0].transcript
      onResult(text)
      setIsListening(false)
    }

    recognition.onerror = () => setIsListening(false)
    recognition.onend = () => setIsListening(false)

    recognitionRef.current = recognition
    recognition.start()
    setIsListening(true)
  }, [onResult])

  const stop = useCallback(() => {
    recognitionRef.current?.stop()
    setIsListening(false)
  }, [])

  return { isListening, start, stop }
}

/* ─── Voice Synthesis ─── */

function speak(text: string) {
  if (!window.speechSynthesis) return
  window.speechSynthesis.cancel()
  const utterance = new SpeechSynthesisUtterance(text)
  utterance.lang = 'fr-FR'
  utterance.rate = 1.05
  utterance.pitch = 1
  const voices = window.speechSynthesis.getVoices()
  const frVoice = voices.find(v => v.lang.startsWith('fr'))
  if (frVoice) utterance.voice = frVoice
  window.speechSynthesis.speak(utterance)
}

/* ─── Pulse animation for voice ─── */

function VoicePulse({ isListening }: { isListening: boolean }) {
  return (
    <div className="relative flex items-center justify-center w-24 h-24">
      {isListening && (
        <>
          <motion.div
            className="absolute inset-0 rounded-full bg-green-500/20"
            animate={{ scale: [1, 1.8, 1], opacity: [0.4, 0, 0.4] }}
            transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
          />
          <motion.div
            className="absolute inset-2 rounded-full bg-green-500/30"
            animate={{ scale: [1, 1.5, 1], opacity: [0.6, 0, 0.6] }}
            transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut', delay: 0.3 }}
          />
        </>
      )}
      <div className={`relative z-10 w-16 h-16 rounded-full flex items-center justify-center transition-colors duration-300 ${isListening ? 'bg-green-500' : 'bg-bg-card border border-border-card'}`}>
        <svg className={`w-7 h-7 transition-colors ${isListening ? 'text-white' : 'text-green-500'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 18.75a6 6 0 006-6v-1.5m-6 7.5a6 6 0 01-6-6v-1.5m6 7.5v3.75m-3.75 0h7.5M12 15.75a3 3 0 01-3-3V4.5a3 3 0 116 0v8.25a3 3 0 01-3 3z" />
        </svg>
      </div>
    </div>
  )
}

/* ─── Main ChatBot Component ─── */

export function ChatBot() {
  const [isOpen, setIsOpen] = useState(false)
  const [mode, setMode] = useState<Mode>('text')
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const scrollRef = useRef<HTMLDivElement>(null)

  const sendMessage = useCallback(async (text: string) => {
    if (!text.trim() || isLoading) return

    const userMsg: Message = { role: 'user', content: text.trim() }
    setMessages(prev => [...prev, userMsg])
    setInput('')
    setIsLoading(true)

    try {
      const reply = await chatCompletion([...messages, userMsg])
      const assistantMsg: Message = { role: 'assistant', content: reply }
      setMessages(prev => [...prev, assistantMsg])

      if (mode === 'voice') speak(reply)
    } catch {
      setMessages(prev => [...prev, { role: 'assistant', content: 'Erreur de connexion. Reessayez.' }])
    } finally {
      setIsLoading(false)
    }
  }, [messages, isLoading, mode])

  const { isListening, start: startVoice, stop: stopVoice } = useVoiceRecognition(sendMessage)

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight
    }
  }, [messages, isLoading])

  return (
    <>
      {/* FAB Button */}
      <AnimatePresence>
        {!isOpen && (
          <motion.button
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            transition={{ type: 'spring', stiffness: 400, damping: 25 }}
            onClick={() => setIsOpen(true)}
            className="fixed bottom-5 right-5 z-50 w-14 h-14 rounded-full bg-green-500 text-white shadow-[0_4px_20px_rgba(34,197,94,0.4)] flex items-center justify-center cursor-pointer hover:shadow-[0_6px_30px_rgba(34,197,94,0.5)] hover:-translate-y-0.5 transition-all duration-300"
            aria-label="Ouvrir le chat Proxima"
          >
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
            </svg>
          </motion.button>
        )}
      </AnimatePresence>

      {/* Chat Window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ type: 'spring', stiffness: 400, damping: 30 }}
            className="fixed bottom-4 right-4 z-50 w-[calc(100vw-2rem)] sm:w-[380px] h-[min(75vh,580px)] rounded-2xl overflow-hidden flex flex-col shadow-[0_8px_60px_rgba(0,0,0,0.4)] border border-border-card"
            style={{ background: 'var(--color-bg-primary)' }}
          >
            {/* Header */}
            <div className="flex items-center justify-between px-4 py-3 border-b border-border-card bg-bg-card/50 backdrop-blur-xl shrink-0">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-green-500/15 border border-green-500/30 flex items-center justify-center">
                  <img src="/favicon-proxima.png" alt="Proxima" className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-text-primary leading-tight">Proxima</h3>
                  <span className="text-[10px] text-green-500 flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
                    En ligne
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-2">
                {/* Mode toggle */}
                <div className="flex items-center bg-bg-card rounded-lg border border-border-card p-0.5">
                  <button
                    onClick={() => setMode('text')}
                    className={`px-2.5 py-1.5 rounded-md text-[11px] font-medium transition-all cursor-pointer ${mode === 'text' ? 'bg-green-500 text-white' : 'text-text-muted hover:text-text-primary'}`}
                  >
                    <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M7.5 8.25h9m-9 3H12m-9.75 1.51c0 1.6 1.123 2.994 2.707 3.227 1.129.166 2.27.293 3.423.379.35.026.67.21.865.501L12 21l2.755-4.133a1.14 1.14 0 01.865-.501 48.172 48.172 0 003.423-.379c1.584-.233 2.707-1.626 2.707-3.228V6.741c0-1.602-1.123-2.995-2.707-3.228A48.394 48.394 0 0012 3c-2.392 0-4.744.175-7.043.513C3.373 3.746 2.25 5.14 2.25 6.741v6.018z" /></svg>
                  </button>
                  <button
                    onClick={() => setMode('voice')}
                    className={`px-2.5 py-1.5 rounded-md text-[11px] font-medium transition-all cursor-pointer ${mode === 'voice' ? 'bg-green-500 text-white' : 'text-text-muted hover:text-text-primary'}`}
                  >
                    <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M12 18.75a6 6 0 006-6v-1.5m-6 7.5a6 6 0 01-6-6v-1.5m6 7.5v3.75m-3.75 0h7.5M12 15.75a3 3 0 01-3-3V4.5a3 3 0 116 0v8.25a3 3 0 01-3 3z" /></svg>
                  </button>
                </div>

                {/* Close */}
                <button
                  onClick={() => setIsOpen(false)}
                  className="w-7 h-7 rounded-lg flex items-center justify-center text-text-muted hover:text-text-primary hover:bg-bg-card transition-colors cursor-pointer"
                  aria-label="Fermer"
                >
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>
                </button>
              </div>
            </div>

            {/* Messages area */}
            <div ref={scrollRef} className="flex-1 overflow-y-auto px-4 py-4 space-y-3 scrollbar-thin">
              {/* Welcome message */}
              {messages.length === 0 && (
                <div className="text-center py-6">
                  <div className="w-12 h-12 rounded-full bg-green-500/10 border border-green-500/20 flex items-center justify-center mx-auto mb-4">
                    <img src="/favicon-proxima.png" alt="Proxima" className="w-7 h-7" />
                  </div>
                  <p className="text-sm text-text-primary font-medium mb-1">Bonjour !</p>
                  <p className="text-xs text-text-muted max-w-[240px] mx-auto">
                    Je suis l'assistant Proxima. Posez-moi vos questions sur notre service d'IA confidentielle.
                  </p>
                  <div className="flex flex-wrap justify-center gap-2 mt-4">
                    {['Quels sont vos tarifs ?', 'Comment fonctionne le cloisonnement ?', 'Est-ce conforme RGPD ?'].map((q) => (
                      <button
                        key={q}
                        onClick={() => sendMessage(q)}
                        className="px-3 py-1.5 rounded-full text-[11px] text-green-500 border border-green-500/20 bg-green-500/5 hover:bg-green-500/10 transition-colors cursor-pointer"
                      >
                        {q}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {messages.map((msg, i) => (
                <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-[80%] px-3.5 py-2.5 rounded-2xl text-sm leading-relaxed ${
                    msg.role === 'user'
                      ? 'bg-green-500 text-white rounded-br-sm'
                      : 'bg-bg-card border border-border-card text-text-primary rounded-bl-sm'
                  }`}>
                    {msg.content}
                  </div>
                </div>
              ))}

              {isLoading && (
                <div className="flex justify-start">
                  <div className="bg-bg-card border border-border-card rounded-2xl rounded-bl-sm px-4 py-3 flex items-center gap-1.5">
                    <motion.div className="w-2 h-2 rounded-full bg-green-500" animate={{ opacity: [0.3, 1, 0.3] }} transition={{ duration: 1, repeat: Infinity, delay: 0 }} />
                    <motion.div className="w-2 h-2 rounded-full bg-green-500" animate={{ opacity: [0.3, 1, 0.3] }} transition={{ duration: 1, repeat: Infinity, delay: 0.2 }} />
                    <motion.div className="w-2 h-2 rounded-full bg-green-500" animate={{ opacity: [0.3, 1, 0.3] }} transition={{ duration: 1, repeat: Infinity, delay: 0.4 }} />
                  </div>
                </div>
              )}
            </div>

            {/* Input area */}
            <div className="shrink-0 border-t border-border-card px-3 py-3 bg-bg-card/30 backdrop-blur-xl">
              {mode === 'text' ? (
                <form
                  onSubmit={(e) => { e.preventDefault(); sendMessage(input) }}
                  className="flex items-center gap-2"
                >
                  <input
                    type="text"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder="Posez votre question..."
                    className="flex-1 bg-bg-card border border-border-card rounded-xl px-4 py-2.5 text-sm text-text-primary placeholder:text-text-muted focus:outline-none focus:border-green-500/40 transition-colors"
                    disabled={isLoading}
                  />
                  <button
                    type="submit"
                    disabled={!input.trim() || isLoading}
                    className="w-10 h-10 rounded-xl bg-green-500 text-white flex items-center justify-center shrink-0 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer hover:bg-green-600 transition-colors"
                  >
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M6 12L3.269 3.126A59.768 59.768 0 0121.485 12 59.77 59.77 0 013.27 20.876L5.999 12zm0 0h7.5" /></svg>
                  </button>
                </form>
              ) : (
                <div className="flex flex-col items-center py-2">
                  <button
                    onClick={isListening ? stopVoice : startVoice}
                    disabled={isLoading}
                    className="cursor-pointer disabled:opacity-40"
                  >
                    <VoicePulse isListening={isListening} />
                  </button>
                  <p className="text-[11px] text-text-muted mt-2">
                    {isListening ? 'Ecoute en cours...' : isLoading ? 'Reflexion...' : 'Appuyez pour parler'}
                  </p>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
