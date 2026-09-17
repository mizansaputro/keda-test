import type { LucideIcon } from 'lucide-react'
import { ArrowDownToLine, ArrowUpFromLine, TrendingUp } from 'lucide-react'

/**
 * The three capabilities named in the brief: incoming goods, outgoing goods and
 * daily profit. `span` drives the bento layout so the grid stays data-driven
 * rather than each card hard-coding its own column span.
 */
export interface Feature {
  id: string
  icon: LucideIcon
  title: string
  description: string
  /** Supporting detail lines shown inside the card. */
  points: string[]
  /** Whether the card takes the full width of the bento grid on large screens. */
  span: 'half' | 'full'
}

export const FEATURES: Feature[] = [
  {
    id: 'incoming',
    icon: ArrowDownToLine,
    title: 'Incoming goods',
    description:
      'Log every delivery as it arrives. Supplier, quantity, unit cost and batch date are captured in one pass, so stock levels are right the moment the truck leaves.',
    points: ['Purchase order matching', 'Batch and expiry tracking', 'Supplier cost history'],
    span: 'half',
  },
  {
    id: 'outgoing',
    icon: ArrowUpFromLine,
    title: 'Outgoing goods',
    description:
      'Record each sale or transfer against the batch it came from. Aliran keeps running stock accurate and flags items before they run short.',
    points: ['Per-batch cost of goods', 'Low-stock thresholds', 'Transfer between locations'],
    span: 'half',
  },
  {
    id: 'profit',
    icon: TrendingUp,
    title: 'Daily profit, calculated for you',
    description:
      'Because every movement carries its cost, profit is not a month-end spreadsheet exercise. Open Aliran and today’s margin is already there — per product, per channel, per outlet.',
    points: [
      'Revenue minus true cost of goods',
      'Margin broken down by product',
      'Yesterday, last week and last month side by side',
    ],
    span: 'full',
  },
]
