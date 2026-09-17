/**
 * Copy and figures for the hero mosaic. Kept here rather than in
 * `analytics.ts` so the hero's own content lives in one place.
 */

export interface HeroStat {
  value: string
  label: string
}

/** Left tile: who is already using it. */
export const HERO_AUDIENCE = {
  value: '2,400+',
  label: 'Businesses tracking daily',
  /** Initials only — this is a coding assignment, not a real customer list. */
  avatars: ['RP', 'BJ', 'TS'],
} as const

/**
 * The supporting facts under the audience figure. These used to sit in a
 * separate strip that repeated the figure above it.
 */
export const HERO_PROOF: HeroStat[] = [
  { value: '1.8M', label: 'movements monthly' },
  { value: '99.95%', label: 'uptime last year' },
]

/** The single figure called out on the solid dark tile. */
export const HERO_HIGHLIGHT = {
  value: '41.8%',
  label: 'Average margin, blended across every channel',
} as const

/** Bottom card: the product walkthrough. */
export const HERO_WALKTHROUGH = {
  title: 'See how a trading day closes.',
  duration: '2 min',
  badge: '6 warehouses live',
  profit: 'Rp 18.4M',
  profitLabel: 'Profit recorded today',
  change: '+12.4%',
} as const

/** Uppercase block set over the gradient artwork. */
export const HERO_OVERLAY = ['Built for', 'multi-outlet', 'operators'] as const
