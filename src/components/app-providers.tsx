import type { ReactNode } from 'react'
import { MotionConfig } from 'motion/react'
import { ThemeProvider } from '@/hooks/use-theme'

/**
 * The app's provider stack, in one place so the router root and the test
 * helpers cannot drift apart.
 *
 * `reducedMotion="user"` matters: the stylesheet's `prefers-reduced-motion`
 * block only reaches CSS transitions, while Motion animates through inline
 * styles. Without this, every JS animation ignored the setting. It drops
 * transform and layout animation but keeps opacity cross-fades, which is the
 * accessible behaviour rather than no feedback at all.
 */
export function AppProviders({ children }: { children: ReactNode }) {
  return (
    <ThemeProvider>
      <MotionConfig reducedMotion="user">{children}</MotionConfig>
    </ThemeProvider>
  )
}
