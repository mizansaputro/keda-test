/**
 * Static figures behind the analytics section. This is a frontend-only
 * assignment, so the numbers are mock data shaped the way a real API response
 * would be.
 */

export interface MonthlyPoint {
  month: string
  /** Revenue in IDR millions. */
  revenue: number
  /** Cost of goods sold in IDR millions. */
  cost: number
}

export const MONTHLY_PERFORMANCE: MonthlyPoint[] = [
  { month: 'Jan', revenue: 182, cost: 126 },
  { month: 'Feb', revenue: 196, cost: 131 },
  { month: 'Mar', revenue: 174, cost: 122 },
  { month: 'Apr', revenue: 221, cost: 145 },
  { month: 'May', revenue: 248, cost: 159 },
  { month: 'Jun', revenue: 236, cost: 151 },
  { month: 'Jul', revenue: 279, cost: 172 },
  { month: 'Aug', revenue: 312, cost: 186 },
  { month: 'Sep', revenue: 298, cost: 179 },
  { month: 'Oct', revenue: 341, cost: 197 },
  { month: 'Nov', revenue: 376, cost: 212 },
  { month: 'Dec', revenue: 408, cost: 226 },
]

export interface Metric {
  label: string
  value: string
  /** Percentage change against the previous period; negative renders muted. */
  change: number
  hint: string
}

export const HEADLINE_METRICS: Metric[] = [
  { label: 'Gross profit', value: 'Rp 182M', change: 12.4, hint: 'vs. previous quarter' },
  { label: 'Items received', value: '48,210', change: 8.1, hint: 'across 6 warehouses' },
  { label: 'Items shipped', value: '46,884', change: 9.6, hint: 'fulfilment rate 97.2%' },
  { label: 'Average margin', value: '41.8%', change: 2.3, hint: 'blended, all channels' },
]

export const ABOUT_STATS: { value: string; label: string }[] = [
  { value: '2019', label: 'Founded in Jakarta' },
  { value: '6', label: 'Countries served' },
  { value: '52', label: 'People on the team' },
  { value: '4.8/5', label: 'Average customer rating' },
]
