/**
 * Bridges the OKLCH design tokens into ECharts.
 *
 * Two problems make this less trivial than reading a variable:
 *
 * 1. ECharts' colour utilities parse hex/rgb/hsl only, while the browser hands
 *    back `oklch(...)` from both `getPropertyValue` and `getComputedStyle`.
 * 2. Several dark-theme tokens are translucent (`oklch(1 0 0 / 10%)`), and
 *    ECharts discards the alpha channel when it writes SVG attributes.
 *
 * Both are solved by painting each token over the card surface on a 1×1 canvas
 * and reading the composited pixel: the browser does the colour-space maths,
 * and the result is the exact opaque colour the translucent token would have
 * produced anyway. Reading a translucent token back directly is not an option —
 * canvas stores premultiplied alpha, so a 10%-opacity white returns as
 * `rgb(245, 255, 255)` rather than white.
 *
 * This assumes the chart is rendered on `--card`, which is where the analytics
 * section puts it.
 */

export interface ChartColors {
  line: string
  areaTop: string
  areaBottom: string
  cost: string
  grid: string
  axisLabel: string
  markerRing: string
}

/** Light-theme values, for environments without a 2D canvas (jsdom, SSR). */
const FALLBACK: ChartColors = {
  line: 'rgb(56, 95, 241)',
  areaTop: 'rgb(200, 211, 252)',
  areaBottom: 'rgb(255, 255, 255)',
  cost: 'rgb(150, 155, 170)',
  grid: 'rgb(227, 229, 234)',
  axisLabel: 'rgb(122, 127, 145)',
  markerRing: 'rgb(255, 255, 255)',
}

/** Alpha applied to the cost-of-goods line so it reads as secondary. */
const COST_OPACITY = 0.7
/** Alpha at the top of the revenue area fill. */
const AREA_OPACITY = 0.28

export function resolveChartColors(): ChartColors {
  if (typeof document === 'undefined') return FALLBACK

  const canvas = document.createElement('canvas')
  canvas.width = 1
  canvas.height = 1
  const context = canvas.getContext('2d', { willReadFrequently: true })
  if (!context) return FALLBACK

  const root = getComputedStyle(document.documentElement)
  const token = (name: string) => root.getPropertyValue(name).trim()
  const surface = token('--card')

  const flatten = (color: string, alpha = 1): string => {
    context.clearRect(0, 0, 1, 1)
    context.globalAlpha = 1
    context.fillStyle = surface
    context.fillRect(0, 0, 1, 1)
    context.globalAlpha = alpha
    context.fillStyle = color
    context.fillRect(0, 0, 1, 1)
    context.globalAlpha = 1
    const [r, g, b] = context.getImageData(0, 0, 1, 1).data
    return `rgb(${r}, ${g}, ${b})`
  }

  const brandBlue = token('--brand-blue')
  const muted = token('--muted-foreground')

  return {
    line: flatten(brandBlue),
    areaTop: flatten(brandBlue, AREA_OPACITY),
    // The fill fades into the card rather than to transparent, which looks the
    // same and keeps every colour opaque.
    areaBottom: flatten(surface),
    cost: flatten(muted, COST_OPACITY),
    grid: flatten(token('--border')),
    axisLabel: flatten(muted),
    markerRing: flatten(token('--card')),
  }
}
