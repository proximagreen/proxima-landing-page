import { useState, useRef, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

/* ─── Types ─── */

interface Message {
  role: 'user' | 'assistant'
  content: string
  audioUrl?: string
}

type Mode = 'text' | 'voice'

/* ─── Config ─── */

const OPENROUTER_KEY = import.meta.env.VITE_OPENROUTER_API_KEY || ''
const OPENROUTER_MODEL = import.meta.env.VITE_OPENROUTER_MODEL || 'mistralai/voxtral-small-24b-2507'
const MISTRAL_KEY = import.meta.env.VITE_MISTRAL_API_KEY || ''

const SYSTEM_PROMPT = `Tu es l'assistant IA de Proxima (proxima.green), la plateforme d'IA confidentielle et souveraine pour les professionnels.
Fonctionnalites : Chat IA illimite, Proxima Meet (visio chiffree E2E avec transcription), Agents IA automatises, RAG documentaire, cloisonnement total par dossier/client, hebergement 100% europeen conforme RGPD.
Prix : 9 euros par poste par mois, tout inclus (deploiement, support prioritaire, mises a jour). Essai gratuit disponible.
Tu reponds en francais, de maniere concise (3 phrases max), professionnelle et chaleureuse. Tu orientes vers la souscription quand c'est pertinent.`

/* ─── OpenRouter Chat API ─── */

async function chatCompletion(messages: Message[]): Promise<string> {
  if (!OPENROUTER_KEY) return 'Le service de chat est temporairement indisponible. Contactez-nous a contact@proxima.green.'

  const res = await fetch('https://openrouter.ai/api/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${OPENROUTER_KEY}`,
      'Content-Type': 'application/json',
      'HTTP-Referer': 'https://proxima.green',
      'X-Title': 'Proxima Chat',
    },
    body: JSON.stringify({
      model: OPENROUTER_MODEL,
      messages: [
        { role: 'system', content: SYSTEM_PROMPT },
        ...messages.map(m => ({ role: m.role, content: m.content })),
      ],
      max_tokens: 300,
      temperature: 0.7,
    }),
  })

  if (!res.ok) throw new Error(`Chat API error: ${res.status}`)
  const data = await res.json()
  return data.choices?.[0]?.message?.content || 'Desole, je n\'ai pas pu repondre.'
}

/* ─── Mistral Voxtral TTS API ─── */

async function voxtralTTS(text: string): Promise<string | null> {
  if (!MISTRAL_KEY) return null

  try {
    const res = await fetch('https://api.mistral.ai/v1/audio/speech', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${MISTRAL_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'voxtral-mini-tts-2603',
        input: text,
        voice_id: '49d024dd-981b-4462-bb17-74d381eb8fd7',
        response_format: 'mp3',
      }),
    })

    if (!res.ok) return null

    const data = await res.json()
    if (!data.audio_data) return null

    const audioBytes = atob(data.audio_data)
    const audioArray = new Uint8Array(audioBytes.length)
    for (let i = 0; i < audioBytes.length; i++) {
      audioArray[i] = audioBytes.charCodeAt(i)
    }
    const blob = new Blob([audioArray], { type: 'audio/mp3' })
    return URL.createObjectURL(blob)
  } catch {
    return null
  }
}

/* ─── Browser TTS fallback ─── */

function browserTTS(text: string) {
  if (!window.speechSynthesis) return
  window.speechSynthesis.cancel()
  const utterance = new SpeechSynthesisUtterance(text)
  utterance.lang = 'fr-FR'
  utterance.rate = 1.05
  const voices = window.speechSynthesis.getVoices()
  const frVoice = voices.find(v => v.lang.startsWith('fr'))
  if (frVoice) utterance.voice = frVoice
  window.speechSynthesis.speak(utterance)
}

/* ─── Voice Recognition Hook ─── */

function useVoiceRecognition(onResult: (text: string) => void) {
  const recognitionRef = useRef<SpeechRecognition | null>(null)
  const [isListening, setIsListening] = useState(false)
  const [isSupported, setIsSupported] = useState(true)

  useEffect(() => {
    setIsSupported(!!(window.SpeechRecognition || window.webkitSpeechRecognition))
  }, [])

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

  return { isListening, isSupported, start, stop }
}

/* ─── Audio Player (inline mini player) ─── */

function AudioPlayer({ src }: { src: string }) {
  const audioRef = useRef<HTMLAudioElement>(null)
  const [playing, setPlaying] = useState(false)
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    const audio = audioRef.current
    if (!audio) return
    const onTime = () => setProgress(audio.duration ? (audio.currentTime / audio.duration) * 100 : 0)
    const onEnd = () => { setPlaying(false); setProgress(0) }
    audio.addEventListener('timeupdate', onTime)
    audio.addEventListener('ended', onEnd)
    return () => { audio.removeEventListener('timeupdate', onTime); audio.removeEventListener('ended', onEnd) }
  }, [])

  const toggle = () => {
    if (!audioRef.current) return
    if (playing) { audioRef.current.pause(); setPlaying(false) }
    else { audioRef.current.play(); setPlaying(true) }
  }

  return (
    <div className="flex items-center gap-2 mt-2">
      <audio ref={audioRef} src={src} preload="auto" />
      <button onClick={toggle} className="w-7 h-7 rounded-full bg-green-500/15 border border-green-500/30 flex items-center justify-center shrink-0 cursor-pointer hover:bg-green-500/25 transition-colors">
        {playing ? (
          <svg className="w-3 h-3 text-green-500" fill="currentColor" viewBox="0 0 24 24"><rect x="6" y="4" width="4" height="16" /><rect x="14" y="4" width="4" height="16" /></svg>
        ) : (
          <svg className="w-3 h-3 text-green-500 ml-0.5" fill="currentColor" viewBox="0 0 24 24"><path d="M8 5v14l11-7z" /></svg>
        )}
      </button>
      <div className="flex-1 h-1 rounded-full bg-border-subtle overflow-hidden">
        <div className="h-full bg-green-500 rounded-full transition-all duration-200" style={{ width: `${progress}%` }} />
      </div>
    </div>
  )
}

/* ─── Voice Pulse ─── */

function VoicePulse({ isListening }: { isListening: boolean }) {
  return (
    <div className="relative flex items-center justify-center w-24 h-24">
      {isListening && (
        <>
          <motion.div className="absolute inset-0 rounded-full bg-green-500/20"
            animate={{ scale: [1, 1.8, 1], opacity: [0.4, 0, 0.4] }}
            transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }} />
          <motion.div className="absolute inset-2 rounded-full bg-green-500/30"
            animate={{ scale: [1, 1.5, 1], opacity: [0.6, 0, 0.6] }}
            transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut', delay: 0.3 }} />
        </>
      )}
      <div className={`relative z-10 w-16 h-16 rounded-full flex items-center justify-center transition-colors duration-300 ${isListening ? 'bg-green-500 shadow-[0_0_30px_rgba(34,197,94,0.4)]' : 'bg-bg-card border border-border-card'}`}>
        <svg className={`w-7 h-7 transition-colors ${isListening ? 'text-white' : 'text-green-500'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 18.75a6 6 0 006-6v-1.5m-6 7.5a6 6 0 01-6-6v-1.5m6 7.5v3.75m-3.75 0h7.5M12 15.75a3 3 0 01-3-3V4.5a3 3 0 116 0v8.25a3 3 0 01-3 3z" />
        </svg>
      </div>
    </div>
  )
}

/* ─── Main ChatBot ─── */

export function ChatBot() {
  const [isOpen, setIsOpen] = useState(false)
  const [mode, setMode] = useState<Mode>('text')
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [isSpeaking, setIsSpeaking] = useState(false)
  const scrollRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  const sendMessage = useCallback(async (text: string) => {
    if (!text.trim() || isLoading) return

    const userMsg: Message = { role: 'user', content: text.trim() }
    setMessages(prev => [...prev, userMsg])
    setInput('')
    setIsLoading(true)

    try {
      const reply = await chatCompletion([...messages, userMsg])
      const assistantMsg: Message = { role: 'assistant', content: reply }

      // In voice mode, generate TTS
      if (mode === 'voice') {
        setIsSpeaking(true)
        const audioUrl = await voxtralTTS(reply)
        if (audioUrl) {
          assistantMsg.audioUrl = audioUrl
          // Auto-play
          const audio = new Audio(audioUrl)
          audio.onended = () => setIsSpeaking(false)
          audio.onerror = () => setIsSpeaking(false)
          audio.play().catch(() => setIsSpeaking(false))
        } else {
          // Fallback to browser TTS
          browserTTS(reply)
          setIsSpeaking(false)
        }
      }

      setMessages(prev => [...prev, assistantMsg])
    } catch {
      setMessages(prev => [...prev, { role: 'assistant', content: 'Erreur de connexion. Reessayez dans un instant.' }])
      setIsSpeaking(false)
    } finally {
      setIsLoading(false)
    }
  }, [messages, isLoading, mode])

  const { isListening, isSupported: voiceSupported, start: startVoice, stop: stopVoice } = useVoiceRecognition(sendMessage)

  useEffect(() => {
    if (scrollRef.current) scrollRef.current.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' })
  }, [messages, isLoading])

  useEffect(() => {
    if (isOpen && mode === 'text') setTimeout(() => inputRef.current?.focus(), 100)
  }, [isOpen, mode])

  useEffect(() => {
    const handler = (e: KeyboardEvent) => { if (e.key === 'Escape') setIsOpen(false) }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [])

  useEffect(() => {
    if (!voiceSupported && mode === 'voice') setMode('text')
  }, [voiceSupported, mode])

  return (
    <>
      {/* FAB */}
      <AnimatePresence>
        {!isOpen && (
          <motion.button
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            transition={{ type: 'spring', stiffness: 400, damping: 25 }}
            onClick={() => setIsOpen(true)}
            className="fixed bottom-6 right-5 sm:bottom-8 sm:right-6 z-[9999] w-14 h-14 sm:w-[60px] sm:h-[60px] rounded-full bg-green-500 text-white shadow-[0_4px_24px_rgba(34,197,94,0.45)] flex items-center justify-center cursor-pointer hover:shadow-[0_6px_32px_rgba(34,197,94,0.55)] hover:-translate-y-0.5 active:scale-95 transition-all duration-300"
            aria-label="Ouvrir le chat Proxima"
          >
            <svg className="w-6 h-6 sm:w-7 sm:h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
            </svg>
          </motion.button>
        )}
      </AnimatePresence>

      {/* Chat */}
      <AnimatePresence>
        {isOpen && (
          <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/40 z-[9998] sm:hidden" onClick={() => setIsOpen(false)} />

            <motion.div
              initial={{ opacity: 0, y: 24, scale: 0.96 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 24, scale: 0.96 }}
              transition={{ type: 'spring', stiffness: 420, damping: 32 }}
              className="fixed z-[9999] overflow-hidden flex flex-col shadow-[0_8px_60px_rgba(0,0,0,0.5)] border border-border-card rounded-2xl
                bottom-0 left-0 right-0 h-[85dvh] rounded-b-none
                sm:bottom-5 sm:right-5 sm:left-auto sm:w-[380px] sm:h-[560px] sm:rounded-2xl"
              style={{ background: 'var(--color-bg-primary)' }}
            >
              {/* Header */}
              <div className="flex items-center justify-between px-4 py-3 border-b border-border-card bg-bg-card/50 backdrop-blur-xl shrink-0">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full bg-green-500/15 border border-green-500/30 flex items-center justify-center">
                    <img src="/favicon-proxima.png" alt="Proxima" className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-sm font-semibold text-text-primary leading-tight">Proxima IA</h3>
                    <span className="text-[10px] text-green-500 flex items-center gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
                      {isSpeaking ? 'Parle...' : 'En ligne'}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <div className="flex items-center bg-bg-card rounded-lg border border-border-card p-0.5">
                    <button onClick={() => setMode('text')} aria-label="Mode texte"
                      className={`px-2.5 py-1.5 rounded-md transition-all cursor-pointer ${mode === 'text' ? 'bg-green-500 text-white shadow-sm' : 'text-text-muted hover:text-text-primary'}`}>
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M7.5 8.25h9m-9 3H12m-9.75 1.51c0 1.6 1.123 2.994 2.707 3.227 1.129.166 2.27.293 3.423.379.35.026.67.21.865.501L12 21l2.755-4.133a1.14 1.14 0 01.865-.501 48.172 48.172 0 003.423-.379c1.584-.233 2.707-1.626 2.707-3.228V6.741c0-1.602-1.123-2.995-2.707-3.228A48.394 48.394 0 0012 3c-2.392 0-4.744.175-7.043.513C3.373 3.746 2.25 5.14 2.25 6.741v6.018z" /></svg>
                    </button>
                    {voiceSupported && (
                      <button onClick={() => setMode('voice')} aria-label="Mode vocal"
                        className={`px-2.5 py-1.5 rounded-md transition-all cursor-pointer ${mode === 'voice' ? 'bg-green-500 text-white shadow-sm' : 'text-text-muted hover:text-text-primary'}`}>
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M12 18.75a6 6 0 006-6v-1.5m-6 7.5a6 6 0 01-6-6v-1.5m6 7.5v3.75m-3.75 0h7.5M12 15.75a3 3 0 01-3-3V4.5a3 3 0 116 0v8.25a3 3 0 01-3 3z" /></svg>
                      </button>
                    )}
                  </div>

                  <button onClick={() => setIsOpen(false)} aria-label="Fermer"
                    className="w-8 h-8 rounded-lg flex items-center justify-center text-text-muted hover:text-text-primary hover:bg-bg-card transition-colors cursor-pointer">
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>
                  </button>
                </div>
              </div>

              {/* Messages */}
              <div ref={scrollRef} className="flex-1 overflow-y-auto px-4 py-4 space-y-3 overscroll-contain">
                {messages.length === 0 && (
                  <div className="text-center py-8">
                    <div className="w-14 h-14 rounded-2xl bg-green-500/10 border border-green-500/20 flex items-center justify-center mx-auto mb-5">
                      <img src="/favicon-proxima.png" alt="Proxima" className="w-8 h-8" />
                    </div>
                    <p className="text-base text-text-primary font-semibold mb-1">Bonjour !</p>
                    <p className="text-sm text-text-muted max-w-[260px] mx-auto leading-relaxed">
                      Je suis l'assistant Proxima. Comment puis-je vous aider ?
                    </p>
                    <div className="flex flex-col gap-2 mt-6 max-w-[280px] mx-auto">
                      {['Quels sont vos tarifs ?', 'Comment fonctionne le cloisonnement ?', 'Est-ce conforme RGPD ?'].map((q) => (
                        <button key={q} onClick={() => sendMessage(q)}
                          className="w-full px-4 py-2.5 rounded-xl text-xs text-left text-text-secondary border border-border-card bg-bg-card hover:border-green-500/30 hover:text-green-500 transition-all cursor-pointer">
                          {q}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {messages.map((msg, i) => (
                  <motion.div key={i} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.25 }}
                    className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start gap-2'}`}>
                    {msg.role === 'assistant' && (
                      <div className="w-6 h-6 rounded-full bg-green-500/15 border border-green-500/30 flex items-center justify-center shrink-0 mt-1">
                        <img src="/favicon-proxima.png" alt="" className="w-3.5 h-3.5" />
                      </div>
                    )}
                    <div className={`max-w-[78%] ${msg.role === 'user' ? 'bg-green-500 text-white rounded-2xl rounded-br-md px-3.5 py-2.5' : 'rounded-2xl rounded-bl-md'}`}>
                      {msg.role === 'assistant' ? (
                        <div className="bg-bg-card border border-border-card rounded-2xl rounded-bl-md px-3.5 py-2.5">
                          <p className="text-[13px] leading-relaxed text-text-primary">{msg.content}</p>
                          {msg.audioUrl && <AudioPlayer src={msg.audioUrl} />}
                        </div>
                      ) : (
                        <p className="text-[13px] leading-relaxed">{msg.content}</p>
                      )}
                    </div>
                  </motion.div>
                ))}

                {isLoading && (
                  <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="flex justify-start gap-2">
                    <div className="w-6 h-6 rounded-full bg-green-500/15 border border-green-500/30 flex items-center justify-center shrink-0 mt-1">
                      <img src="/favicon-proxima.png" alt="" className="w-3.5 h-3.5" />
                    </div>
                    <div className="bg-bg-card border border-border-card rounded-2xl rounded-bl-md px-4 py-3 flex items-center gap-1.5">
                      <motion.div className="w-1.5 h-1.5 rounded-full bg-green-500" animate={{ scale: [1, 1.4, 1] }} transition={{ duration: 0.6, repeat: Infinity, delay: 0 }} />
                      <motion.div className="w-1.5 h-1.5 rounded-full bg-green-500" animate={{ scale: [1, 1.4, 1] }} transition={{ duration: 0.6, repeat: Infinity, delay: 0.15 }} />
                      <motion.div className="w-1.5 h-1.5 rounded-full bg-green-500" animate={{ scale: [1, 1.4, 1] }} transition={{ duration: 0.6, repeat: Infinity, delay: 0.3 }} />
                    </div>
                  </motion.div>
                )}
              </div>

              {/* Input */}
              <div className="shrink-0 border-t border-border-card px-3 py-3 bg-bg-card/30 backdrop-blur-xl pb-[calc(0.75rem+env(safe-area-inset-bottom,0px))]">
                {mode === 'text' ? (
                  <form onSubmit={(e) => { e.preventDefault(); sendMessage(input) }} className="flex items-center gap-2">
                    <input ref={inputRef} type="text" value={input} onChange={(e) => setInput(e.target.value)}
                      placeholder="Posez votre question..."
                      className="flex-1 bg-bg-card border border-border-card rounded-xl px-4 py-2.5 text-sm text-text-primary placeholder:text-text-muted focus:outline-none focus:border-green-500/40 focus:ring-1 focus:ring-green-500/20 transition-all"
                      disabled={isLoading} autoComplete="off" />
                    <button type="submit" disabled={!input.trim() || isLoading} aria-label="Envoyer"
                      className="w-10 h-10 rounded-xl bg-green-500 text-white flex items-center justify-center shrink-0 disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer hover:bg-green-600 active:scale-95 transition-all">
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M6 12L3.269 3.126A59.768 59.768 0 0121.485 12 59.77 59.77 0 013.27 20.876L5.999 12zm0 0h7.5" /></svg>
                    </button>
                  </form>
                ) : (
                  <div className="flex flex-col items-center py-3">
                    <button onClick={isListening ? stopVoice : startVoice} disabled={isLoading || isSpeaking}
                      className="cursor-pointer disabled:opacity-30"
                      aria-label={isListening ? 'Arreter' : 'Parler'}>
                      <VoicePulse isListening={isListening} />
                    </button>
                    <p className="text-xs text-text-muted mt-2 font-medium">
                      {isListening ? 'Je vous ecoute...' : isSpeaking ? 'Proxima parle...' : isLoading ? 'Reflexion...' : 'Appuyez pour parler'}
                    </p>
                    {MISTRAL_KEY && (
                      <span className="text-[9px] text-green-500/50 mt-1">Voxtral TTS</span>
                    )}
                  </div>
                )}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  )
}
