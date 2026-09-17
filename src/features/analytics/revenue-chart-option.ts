import type { LineSeriesOption } from 'echarts/charts'
import type { GridComponentOption, TooltipComponentOption } from 'echarts/components'
import type { ComposeOption } from 'echarts/core'
import type { MonthlyPoint } from '@/data/analytics'
import type { ChartColors } from './chart-theme'

/** Only the modules this chart registers, so the option stays honestly typed. */
export type RevenueChartOption = ComposeOption<
  LineSeriesOption | GridComponentOption | TooltipComponentOption
>

export interface BuildOptionArgs {
  data: MonthlyPoint[]
  colors: ChartColors
  /** False when the reader has asked for reduced motion. */
  animate: boolean
}

/** Gross margin for a month, to one decimal place. */
export function marginFor(point: MonthlyPoint): number {
  return Math.round(((point.revenue - point.cost) / point.revenue) * 1000) / 10
}

/**
 * Builds the ECharts option. Kept pure and separate from the React wrapper so
 * the series, axes and tooltip content can be unit tested without a canvas.
 */
export function buildRevenueChartOption({
  data,
  colors,
  animate,
}: BuildOptionArgs): RevenueChartOption {
  const axisLine = { show: false } as const

  return {
    animation: animate,
    animationDuration: 900,
    animationEasing: 'cubicOut',
    grid: { top: 16, right: 8, bottom: 24, left: 8, containLabel: true },
    xAxis: {
      type: 'category',
      data: data.map((point) => point.month),
      boundaryGap: false,
      axisLine,
      axisTick: { show: false },
      axisLabel: { color: colors.axisLabel, fontSize: 12, margin: 14 },
      // The vertical read-out line, styled to match the token palette.
      axisPointer: {
        type: 'line',
        lineStyle: { color: colors.line, width: 1, opacity: 0.4, type: 'solid' },
      },
    },
    yAxis: {
      type: 'value',
      // An area chart has to start at zero to be honest about proportion, and
      // the headroom keeps the December peak off the top edge.
      min: 0,
      boundaryGap: [0, '14%'],
      // The card already states the unit, so the axis stays quiet.
      axisLabel: { show: false },
      axisLine,
      axisTick: { show: false },
      splitLine: { lineStyle: { color: colors.grid, width: 1 } },
    },
    tooltip: {
      trigger: 'axis',
      // The panel below is our own markup; strip ECharts' chrome so the card
      // styling is not doubled up.
      backgroundColor: 'transparent',
      borderWidth: 0,
      padding: 0,
      extraCssText: 'box-shadow: none;',
      formatter: (params) => {
        const entries = Array.isArray(params) ? params : [params]
        const index = entries[0]?.dataIndex
        if (typeof index !== 'number') return ''
        const point = data[index]
        if (!point) return ''

        const row = (label: string, value: string, extra = '') =>
          `<div class="flex items-baseline justify-between gap-3${extra}">` +
          `<dt class="text-muted-foreground">${label}</dt>` +
          `<dd class="font-semibold tabular-nums text-foreground">${value}</dd>` +
          `</div>`

        // Static, in-repo data — no user input reaches this markup.
        return (
          `<div class="w-40 rounded-xl border border-border bg-popover p-3 text-left shadow-lg">` +
          `<p class="text-xs font-semibold uppercase tracking-wider text-muted-foreground">${point.month}</p>` +
          `<dl class="mt-2 space-y-1.5 text-sm">` +
          row('Revenue', `Rp ${point.revenue}M`) +
          row('Cost', `Rp ${point.cost}M`) +
          `<div class="flex items-baseline justify-between gap-3 border-t border-border pt-1.5">` +
          `<dt class="text-muted-foreground">Margin</dt>` +
          `<dd class="font-semibold tabular-nums text-primary">${marginFor(point)}%</dd>` +
          `</div>` +
          `</dl></div>`
        )
      },
    },
    series: [
      {
        id: 'cost',
        name: 'Cost of goods',
        type: 'line',
        smooth: 0.35,
        symbol: 'circle',
        symbolSize: 0,
        showSymbol: false,
        data: data.map((point) => point.cost),
        lineStyle: { color: colors.cost, width: 2, type: [5, 6] },
        emphasis: { itemStyle: { color: colors.cost } },
        z: 1,
      },
      {
        id: 'revenue',
        name: 'Revenue',
        type: 'line',
        smooth: 0.35,
        symbol: 'circle',
        symbolSize: 9,
        showSymbol: false,
        data: data.map((point) => point.revenue),
        lineStyle: { color: colors.line, width: 2.5 },
        itemStyle: { color: colors.line, borderColor: colors.markerRing, borderWidth: 2.5 },
        areaStyle: {
          color: {
            type: 'linear',
            x: 0,
            y: 0,
            x2: 0,
            y2: 1,
            colorStops: [
              { offset: 0, color: colors.areaTop },
              { offset: 1, color: colors.areaBottom },
            ],
          },
        },
        z: 2,
      },
    ],
  }
}
