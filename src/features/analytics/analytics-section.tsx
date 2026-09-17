import { Suspense, lazy, useRef } from 'react'
import { useInView } from 'motion/react'
import { TrendingDown, TrendingUp } from 'lucide-react'
import { Card } from '@/components/ui/card'
import { Reveal } from '@/components/layout/reveal'
import { Section, SectionHeading } from '@/components/layout/section'
import { HEADLINE_METRICS, MONTHLY_PERFORMANCE } from '@/data/analytics'
import { CHART_HEIGHT } from './revenue-chart-frame'
import { RevenueTable } from './revenue-table'

const CHART_SUMMARY =
  'Revenue rose from Rp 182 million in January to Rp 408 million in December, while cost of goods grew more slowly from Rp 126 million to Rp 226 million.'

// ECharts is by far the heaviest dependency in the project and this section
// sits well below the fold, so the renderer is split into its own chunk and
// fetched as the reader approaches it.
const RevenueChart = lazy(() =>
  import('./revenue-chart').then((module) => ({ default: module.RevenueChart })),
)

function LazyChart() {
  const frameRef = useRef<HTMLDivElement>(null)
  // Start fetching before the section is actually visible.
  const nearViewport = useInView(frameRef, { once: true, margin: '400px' })

  return (
    <div ref={frameRef} style={{ minHeight: CHART_HEIGHT }}>
      {nearViewport && (
        <Suspense fallback={<ChartPlaceholder />}>
          <RevenueChart data={MONTHLY_PERFORMANCE} />
        </Suspense>
      )}
    </div>
  )
}

/** Holds the chart's exact height so nothing shifts when it arrives. */
function ChartPlaceholder() {
  return (
    <div
      aria-hidden="true"
      className="w-full animate-pulse rounded-xl bg-muted/40"
      style={{ height: CHART_HEIGHT }}
    />
  )
}

export function AnalyticsSection() {
  return (
    <Section id="analytics">
      <SectionHeading
        eyebrow="Sales analysis"
        title="The chart your accountant asks for, already drawn."
        description="Available on Business and Entrepreneur. Revenue against true cost of goods, updated as movements are recorded — no export, no pivot table."
      />

      <Reveal delay={0.08} className="mt-14">
        <Card className="p-6 sm:p-8">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <h3 className="text-title font-bold text-foreground">Revenue vs. cost of goods</h3>
              <p className="mt-1 text-sm text-muted-foreground">
                Rolling twelve months, in IDR millions
              </p>
            </div>
            <ul className="flex flex-wrap items-center gap-5 text-sm">
              <li className="flex items-center gap-2">
                <span className="h-0.5 w-5 rounded-full bg-brand-blue" aria-hidden="true" />
                <span className="text-muted-foreground">Revenue</span>
              </li>
              <li className="flex items-center gap-2">
                <span
                  className="h-0.5 w-5 rounded-full border-t-2 border-dashed border-muted-foreground"
                  aria-hidden="true"
                />
                <span className="text-muted-foreground">Cost of goods</span>
              </li>
            </ul>
          </div>

          <figure className="m-0 mt-8">
            <LazyChart />
            {/* Always rendered, never deferred: the figures must be available
                to assistive technology regardless of the chart bundle. */}
            <RevenueTable data={MONTHLY_PERFORMANCE} label={CHART_SUMMARY} />
          </figure>
        </Card>
      </Reveal>

      <dl className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {HEADLINE_METRICS.map((metric, index) => {
          const positive = metric.change >= 0
          const Icon = positive ? TrendingUp : TrendingDown
          return (
            <Reveal key={metric.label} delay={index * 0.06}>
              <Card className="h-full p-6">
                <dt className="text-sm text-muted-foreground">{metric.label}</dt>
                <dd>
                  <span className="mt-2 block font-display text-2xl font-extrabold tracking-tight tabular-nums text-foreground">
                    {metric.value}
                  </span>
                  <span className="mt-2 flex items-center gap-1.5 text-sm">
                    <Icon
                      className={
                        positive
                          ? 'size-4 text-emerald-600 dark:text-emerald-400'
                          : 'size-4 text-muted-foreground'
                      }
                      aria-hidden="true"
                    />
                    <span
                      className={
                        positive
                          ? 'font-medium text-emerald-600 dark:text-emerald-400'
                          : 'font-medium text-muted-foreground'
                      }
                    >
                      {positive ? '+' : ''}
                      <span className="tabular-nums">{metric.change}%</span>
                    </span>
                    <span className="text-muted-foreground">{metric.hint}</span>
                  </span>
                </dd>
              </Card>
            </Reveal>
          )
        })}
      </dl>
    </Section>
  )
}
