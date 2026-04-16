import { createContext, useContext, useEffect, useMemo, useState } from 'react'

const DarkModeContext = createContext(null)

export function DarkModeProvider({ children }) {
  const [darkMode, setDarkMode] = useState(
    () => typeof localStorage !== 'undefined' && localStorage.getItem('darkMode') === 'true',
  )

  useEffect(() => {
    document.documentElement.classList.toggle('dark', darkMode)
    localStorage.setItem('darkMode', darkMode ? 'true' : 'false')
  }, [darkMode])

  const value = useMemo(() => ({ darkMode, setDarkMode }), [darkMode])

  return <DarkModeContext.Provider value={value}>{children}</DarkModeContext.Provider>
}

export function useDarkMode() {
  const ctx = useContext(DarkModeContext)
  if (!ctx) {
    throw new Error('useDarkMode must be used within DarkModeProvider')
  }
  return ctx
}
