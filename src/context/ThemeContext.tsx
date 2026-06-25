import { createContext, useContext, useEffect, type ReactNode } from 'react'

type Theme = 'light'

interface ThemeContextType {
  theme: Theme
  toggleTheme: () => void
}

const ThemeContext = createContext<ThemeContextType>({ theme: 'light', toggleTheme: () => {} })

export function ThemeProvider({ children }: { children: ReactNode }) {
  const theme: Theme = 'light'

  useEffect(() => {
    const root = document.documentElement
    root.setAttribute('data-theme', 'light')
    localStorage.setItem('proxima-theme', 'light')
  }, [])

  const toggleTheme = () => {}

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  )
}

export function useTheme() {
  return useContext(ThemeContext)
}
