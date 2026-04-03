import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from 'react'

export type Segment = 'legal' | 'health' | 'audit' | 'general'

interface PersonalizationData {
  segment: Segment
  name: string | null
  company: string | null
  plan: 'free' | 'pro'
  seats: number
  slug: string | null
  appUrl: string | null
  headline: string | null
  subheadline: string | null
  logoUrl: string | null
  ready: boolean
}

const defaults: PersonalizationData = {
  segment: 'general',
  name: null,
  company: null,
  plan: 'pro',
  seats: 1,
  slug: null,
  appUrl: null,
  headline: null,
  subheadline: null,
  logoUrl: null,
  ready: false,
}

const PersonalizationContext = createContext<PersonalizationData>(defaults)

const validSegments: Segment[] = ['legal', 'health', 'audit', 'general']

function parseParams(): Partial<PersonalizationData> {
  const params = new URLSearchParams(window.location.search)
  const segment = (params.get('segment') as Segment) || 'general'

  return {
    segment: validSegments.includes(segment) ? segment : 'general',
    name: params.get('name'),
    company: params.get('company'),
    plan: params.get('plan') === 'free' ? 'free' : 'pro',
    seats: Math.max(1, parseInt(params.get('seats') || '1', 10) || 1),
  }
}

export function PersonalizationProvider({ children }: { children: ReactNode }) {
  const urlParams = useMemo(parseParams, [])
  const [data, setData] = useState<PersonalizationData>({ ...defaults, ...urlParams })

  useEffect(() => {
    const apiUrl = import.meta.env.VITE_API_URL || ''
    const clientParam = new URLSearchParams(window.location.search).get('client')
    const configUrl = clientParam
      ? `${apiUrl}/api/client-config?client=${encodeURIComponent(clientParam)}`
      : `${apiUrl}/api/client-config`
    fetch(configUrl)
      .then(r => r.ok ? r.json() : null)
      .then(config => {
        if (config) {
          setData(prev => ({
            ...prev,
            slug: config.slug,
            company: prev.company || config.name,
            segment: prev.segment !== 'general' ? prev.segment : (validSegments.includes(config.segment) ? config.segment : 'general'),
            name: prev.name || config.contact_name,
            appUrl: config.app_url,
            headline: config.headline,
            subheadline: config.subheadline,
            logoUrl: config.logo_url,
            ready: true,
          }))
        } else {
          setData(prev => ({ ...prev, ready: true }))
        }
      })
      .catch(() => {
        setData(prev => ({ ...prev, ready: true }))
      })
  }, [])

  return (
    <PersonalizationContext.Provider value={data}>
      {children}
    </PersonalizationContext.Provider>
  )
}

export function usePersonalization() {
  return useContext(PersonalizationContext)
}
