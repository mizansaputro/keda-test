import { render, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'
import { MONTHLY_PERFORMANCE } from '@/data/analytics'
import { renderWithTheme } from '@/test/render-with-router'
import { RevenueChart } from './revenue-chart'
import { RevenueTable } from './revenue-table'

// ECharts measures its container to lay out and jsdom reports zero for every
// box, so the renderer is stubbed. What this module owns is the option it hands
// over; the option's contents are covered by the builder's own tests.
vi.mock('echarts-for-react/esm/core', () => ({
  default: ({ option }: { option: { series?: unknown[]; animation?: boolean } }) => (
    <div
      data-testid="echarts"
      data-series={Array.isArray(option.series) ? option.series.length : 0}
      data-animation={String(option.animation)}
    />
  ),
}))

const LABEL = 'Revenue grew faster than cost of goods across the year.'

describe('RevenueTable', () => {
  it('exposes the figures as a real table rather than a described picture', () => {
    render(<RevenueTable data={MONTHLY_PERFORMANCE} label={LABEL} />)
    expect(screen.getByRole('table')).toHaveAccessibleName(LABEL)
    // One row per month, plus the header row.
    expect(screen.getAllByRole('row')).toHaveLength(MONTHLY_PERFORMANCE.length + 1)
  })

  it('lists every month with its revenue and cost', () => {
    render(<RevenueTable data={MONTHLY_PERFORMANCE} label={LABEL} />)
    for (const point of MONTHLY_PERFORMANCE) {
      expect(
        screen.getByRole('row', { name: `${point.month} ${point.revenue} ${point.cost}` }),
      ).toBeInTheDocument()
    }
  })

  it('does not live inside the lazily loaded chart module', async () => {
    // Guards the split: if the table moves back into revenue-chart.tsx, a
    // screen reader loses the data until the ECharts chunk arrives.
    const chartModule = await import('./revenue-chart')
    expect('RevenueTable' in chartModule).toBe(false)
  })
})

describe('RevenueChart', () => {
  it('hides the drawing from assistive technology so the table is the one source', () => {
    renderWithTheme(<RevenueChart data={MONTHLY_PERFORMANCE} />)
    expect(screen.getByTestId('echarts').parentElement).toHaveAttribute('aria-hidden', 'true')
  })

  it('hands ECharts both series', () => {
    renderWithTheme(<RevenueChart data={MONTHLY_PERFORMANCE} />)
    expect(screen.getByTestId('echarts')).toHaveAttribute('data-series', '2')
  })

  it('leaves animation on when reduced motion is not requested', () => {
    renderWithTheme(<RevenueChart data={MONTHLY_PERFORMANCE} />)
    expect(screen.getByTestId('echarts')).toHaveAttribute('data-animation', 'true')
  })
})
