import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
  type ReactNode,
} from 'react'

export type Theme = 'light' | 'dark'

/** Also referenced by the bootstrap script in index.html. */
const STORAGE_KEY = 'aliran-theme'

interface ThemeContextValue {
  theme: Theme
  toggleTheme: () => void
}

const ThemeContext = createContext<ThemeContextValue | null>(null)

/** Stored preference first, system preference second, light as the fallback. */
function resolveInitialTheme(): Theme {
  if (typeof window === 'undefined') return 'light'
  const stored = window.localStorage.getItem(STORAGE_KEY)
  if (stored === 'light' || stored === 'dark') return stored
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
}

function applyTheme(theme: Theme) {
  const root = document.documentElement
  root.classList.toggle('dark', theme === 'dark')
  root.style.colorScheme = theme
}

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setTheme] = useState(resolveInitialTheme)
  const themeRef = useRef(theme)

  useEffect(() => {
    themeRef.current = theme
    applyTheme(theme)
    window.localStorage.setItem(STORAGE_KEY, theme)
  }, [theme])

  const toggleTheme = useCallback(() => {
    const next: Theme = themeRef.current === 'dark' ? 'light' : 'dark'
    themeRef.current = next

    // Applied here, synchronously, rather than left to the effect above.
    // React flushes child effects before parent effects, so a consumer that
    // reads computed token values in its own effect — the ECharts colour
    // bridge does exactly that — would otherwise sample the previous theme.
    applyTheme(next)
    setTheme(next)
  }, [])

  return <ThemeContext value={{ theme, toggleTheme }}>{children}</ThemeContext>
}

export function useTheme(): ThemeContextValue {
  const context = useContext(ThemeContext)
  if (!context) throw new Error('useTheme must be used within a ThemeProvider')
  return context
}
