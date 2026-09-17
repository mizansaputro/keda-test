import { describe, expect, it } from 'vitest'
import { MONTHLY_PERFORMANCE, type MonthlyPoint } from '@/data/analytics'
import type { ChartColors } from './chart-theme'
import { buildRevenueChartOption, marginFor } from './revenue-chart-option'

const COLORS: ChartColors = {
  line: 'rgb(1, 2, 3)',
  areaTop: 'rgb(4, 5, 6)',
  areaBottom: 'rgb(7, 8, 9)',
  cost: 'rgb(10, 11, 12)',
  grid: 'rgb(13, 14, 15)',
  axisLabel: 'rgb(16, 17, 18)',
  markerRing: 'rgb(19, 20, 21)',
}

function build(overrides: Partial<Parameters<typeof buildRevenueChartOption>[0]> = {}) {
  return buildRevenueChartOption({
    data: MONTHLY_PERFORMANCE,
    colors: COLORS,
    animate: true,
    ...overrides,
  })
}

/** ECharts' option types are broad unions; narrow for assertions. */
function seriesById(option: ReturnType<typeof build>, id: string) {
  const series = Array.isArray(option.series) ? option.series : [option.series]
  const found = series.find((entry) => entry && 'id' in entry && entry.id === id)
  if (!found) throw new Error(`series ${id} not found`)
  return found
}

describe('marginFor', () => {
  it('reports gross margin to one decimal place', () => {
    expect(marginFor({ month: 'Jan', revenue: 200, cost: 150 })).toBe(25)
    expect(marginFor({ month: 'Feb', revenue: 279, cost: 172 })).toBe(38.4)
  })

  it('matches the ratio for every month in the dataset', () => {
    for (const point of MONTHLY_PERFORMANCE) {
      const expected = Math.round(((point.revenue - point.cost) / point.revenue) * 1000) / 10
      expect(marginFor(point)).toBe(expected)
    }
  })
})

describe('buildRevenueChartOption', () => {
  it('plots both series straight from the data, in order', () => {
    const option = build()
    expect(seriesById(option, 'revenue').data).toEqual(MONTHLY_PERFORMANCE.map((p) => p.revenue))
    expect(seriesById(option, 'cost').data).toEqual(MONTHLY_PERFORMANCE.map((p) => p.cost))
  })

  it('labels the category axis with every month', () => {
    const option = build()
    const xAxis = Array.isArray(option.xAxis) ? option.xAxis[0] : option.xAxis
    expect(xAxis && 'data' in xAxis ? xAxis.data : undefined).toEqual(
      MONTHLY_PERFORMANCE.map((p) => p.month),
    )
  })

  it('anchors the value axis at zero, since an area fill implies proportion', () => {
    const option = build()
    const yAxis = Array.isArray(option.yAxis) ? option.yAxis[0] : option.yAxis
    expect(yAxis && 'min' in yAxis ? yAxis.min : undefined).toBe(0)
    // Headroom keeps the peak off the top edge.
    expect(yAxis && 'boundaryGap' in yAxis ? yAxis.boundaryGap : undefined).toEqual([0, '14%'])
  })

  it('takes every colour from the palette it is given, hard-coding none', () => {
    const option = build()
    const serialised = JSON.stringify(option)
    for (const colour of Object.values(COLORS)) {
      expect(serialised).toContain(colour)
    }
    // A stray hex or oklch literal would mean a token was bypassed.
    expect(serialised).not.toMatch(/#[0-9a-f]{6}/i)
    expect(serialised).not.toContain('oklch')
  })

  it('draws the cost series dashed and behind revenue', () => {
    const option = build()
    const cost = seriesById(option, 'cost')
    const revenue = seriesById(option, 'revenue')
    expect(cost.lineStyle?.type).toEqual([5, 6])
    expect(Number(cost.z)).toBeLessThan(Number(revenue.z))
  })

  it('disables animation when the reader has asked for reduced motion', () => {
    expect(build({ animate: true }).animation).toBe(true)
    expect(build({ animate: false }).animation).toBe(false)
  })

  describe('tooltip', () => {
    function formatAt(index: number, data: MonthlyPoint[] = MONTHLY_PERFORMANCE) {
      const option = build({ data })
      const formatter = option.tooltip && 'formatter' in option.tooltip
        ? option.tooltip.formatter
        : undefined
      if (typeof formatter !== 'function') throw new Error('expected a formatter function')
      return formatter([{ dataIndex: index }] as never, '', () => {}) as string
    }

    it('reports the month, both figures and the derived margin', () => {
      const html = formatAt(6)
      const july = MONTHLY_PERFORMANCE[6]
      expect(july.month).toBe('Jul')
      expect(html).toContain('Jul')
      expect(html).toContain(`Rp ${july.revenue}M`)
      expect(html).toContain(`Rp ${july.cost}M`)
      expect(html).toContain(`${marginFor(july)}%`)
    })

    it('styles itself with design tokens rather than inline colours', () => {
      const html = formatAt(0)
      expect(html).toContain('bg-popover')
      expect(html).toContain('text-muted-foreground')
      expect(html).toContain('tabular-nums')
      expect(html).not.toContain('style=')
    })

    it('returns nothing rather than throwing for an out-of-range index', () => {
      expect(formatAt(99)).toBe('')
    })

    it('returns nothing when the payload carries no index', () => {
      const option = build()
      const formatter = option.tooltip && 'formatter' in option.tooltip
        ? option.tooltip.formatter
        : undefined
      if (typeof formatter !== 'function') throw new Error('expected a formatter function')
      expect(formatter([] as never, '', () => {})).toBe('')
    })
  })
})
