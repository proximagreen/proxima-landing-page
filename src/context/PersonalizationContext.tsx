import { createContext, useContext, useMemo, type ReactNode } from 'react'

export type Segment = 'legal' | 'health' | 'audit' | 'general'

interface PersonalizationData {
  segment: Segment
  name: string | null
  company: string | null
  plan: 'free' | 'pro'
  seats: number
}

const PersonalizationContext = createContext<PersonalizationData>({
  segment: 'general',
  name: null,
  company: null,
  plan: 'pro',
  seats: 1,
})

function parseParams(): PersonalizationData {
  const params = new URLSearchParams(window.location.search)
  const segment = (params.get('segment') as Segment) || 'general'
  const validSegments: Segment[] = ['legal', 'health', 'audit', 'general']

  return {
    segment: validSegments.includes(segment) ? segment : 'general',
    name: params.get('name'),
    company: params.get('company'),
    plan: params.get('plan') === 'free' ? 'free' : 'pro',
    seats: Math.max(1, parseInt(params.get('seats') || '1', 10) || 1),
  }
}

export function PersonalizationProvider({ children }: { children: ReactNode }) {
  const data = useMemo(parseParams, [])
  return (
    <PersonalizationContext.Provider value={data}>
      {children}
    </PersonalizationContext.Provider>
  )
}

export function usePersonalization() {
  return useContext(PersonalizationContext)
}
