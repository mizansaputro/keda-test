/**
 * Pricing tiers exactly as specified in the brief: Basic, Business and
 * Entrepreneur. The three cards are rendered from this array by a single
 * `PricingCard` component — adding a fourth tier requires no JSX changes.
 */

export type BillingPeriod = 'monthly' | 'annual'

export interface PricingTier {
  id: string
  name: string
  /** One-line positioning statement shown under the tier name. */
  summary: string
  /** Price in IDR thousands per month for each billing period. */
  price: Record<BillingPeriod, number>
  features: string[]
  /** Features listed to show what the next tier up adds. */
  inheritsFrom?: string
  cta: string
  /** Exactly one tier should be flagged; it gets the raised, bordered treatment. */
  popular?: boolean
}

/** Annual billing bills 12 months at a 20% discount. */
export const ANNUAL_DISCOUNT = 0.2

export const PRICING_TIERS: PricingTier[] = [
  {
    id: 'basic',
    name: 'Basic',
    summary: 'For a single shop that wants the books to finally balance.',
    price: { monthly: 149, annual: 119 },
    features: ['Record incoming goods', 'Record outgoing goods', 'Daily profit tracking'],
    cta: 'Start with Basic',
  },
  {
    id: 'business',
    name: 'Business',
    summary: 'For growing teams that need to see where margin comes from.',
    price: { monthly: 389, annual: 311 },
    inheritsFrom: 'Basic',
    features: ['Sales analysis with charts', '24/7 priority support', 'Up to 10 team members'],
    cta: 'Choose Business',
    popular: true,
  },
  {
    id: 'entrepreneur',
    name: 'Entrepreneur',
    summary: 'For multi-outlet operators planning the next quarter.',
    price: { monthly: 749, annual: 599 },
    inheritsFrom: 'Business',
    features: ['Export to Excel', 'AI income prediction', 'Unlimited outlets and members'],
    cta: 'Choose Entrepreneur',
  },
]

/** Formats an IDR-thousands figure as `Rp 389k`. */
export function formatPrice(thousands: number): string {
  return `Rp ${thousands}k`
}
