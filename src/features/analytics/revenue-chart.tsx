import { useEffect, useMemo, useState } from 'react'
import { useReducedMotion } from 'motion/react'
import * as echarts from 'echarts/core'
import { LineChart } from 'echarts/charts'
import { GridComponent, TooltipComponent } from 'echarts/components'
import { SVGRenderer } from 'echarts/renderers'
import ReactECharts from 'echarts-for-react/esm/core'
import type { MonthlyPoint } from '@/data/analytics'
import { useTheme } from '@/hooks/use-theme'
import { resolveChartColors } from './chart-theme'
import { CHART_HEIGHT } from './revenue-chart-frame'
import { buildRevenueChartOption } from './revenue-chart-option'

// Registering only what this chart uses keeps the chunk to the line chart,
// grid, tooltip and SVG renderer rather than all of ECharts.
echarts.use([LineChart, GridComponent, TooltipComponent, SVGRenderer])

/**
 * Revenue against cost of goods, rendered with ECharts.
 *
 * The SVG renderer is chosen over canvas: text stays crisp at any device pixel
 * ratio and there is no bitmap to re-raster on resize. Container resizing is
 * already handled by echarts-for-react (it binds size-sensor to the element).
 *
 * Hidden from assistive technology — `RevenueTable` is the accessible
 * representation, and it is rendered separately so it does not depend on this
 * module loading.
 */
export function RevenueChart({ data }: { data: MonthlyPoint[] }) {
  const { theme } = useTheme()
  const prefersReducedMotion = useReducedMotion()

  // ECharts needs concrete colour values, so the tokens are re-read whenever
  // the theme flips.
  const [colors, setColors] = useState(resolveChartColors)
  useEffect(() => {
    setColors(resolveChartColors())
  }, [theme])

  const option = useMemo(
    () => buildRevenueChartOption({ data, colors, animate: !prefersReducedMotion }),
    [data, colors, prefersReducedMotion],
  )

  return (
    <div aria-hidden="true">
      <ReactECharts
        echarts={echarts}
        option={option}
        opts={{ renderer: 'svg' }}
        style={{ height: CHART_HEIGHT, width: '100%' }}
        // Colours and the animation flag replace wholesale rather than merging.
        notMerge
      />
    </div>
  )
}
