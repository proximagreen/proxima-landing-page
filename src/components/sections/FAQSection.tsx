import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { usePersonalization } from '../../context/PersonalizationContext'
import { getContent } from '../../lib/content'
import { SectionHeading } from '../ui/SectionHeading'

function FAQItem({ question, answer, isOpen, onToggle }: { question: string; answer: string; isOpen: boolean; onToggle: () => void }) {
  return (
    <motion.div
      className="glass rounded-xl overflow-hidden"
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
    >
      <button
        className="w-full flex items-center justify-between p-6 text-left cursor-pointer"
        onClick={onToggle}
      >
        <span className="text-text-primary font-semibold pr-4">{question}</span>
        <svg
          className={`w-5 h-5 text-green-400 shrink-0 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`}
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2}
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
        </svg>
      </button>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="overflow-hidden"
          >
            <div className="px-6 pb-6 text-text-secondary leading-relaxed border-t border-border-subtle pt-4">
              {answer}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}

export function FAQSection() {
  const { segment } = usePersonalization()
  const content = getContent(segment)
  const [openIndex, setOpenIndex] = useState<number | null>(0)

  return (
    <section className="py-[var(--section-padding)] px-6">
      <div className="max-w-3xl mx-auto">
        <SectionHeading
          badge="Questions fréquentes"
          title="Vos données sont trop sensibles\npour rester sans réponse"
        />

        <div className="space-y-3">
          {content.faqs.map((faq, i) => (
            <FAQItem
              key={i}
              question={faq.question}
              answer={faq.answer}
              isOpen={openIndex === i}
              onToggle={() => setOpenIndex(openIndex === i ? null : i)}
            />
          ))}
        </div>
      </div>
    </section>
  )
}
