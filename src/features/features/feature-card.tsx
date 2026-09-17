import { Check } from 'lucide-react'
import { Card } from '@/components/ui/card'
import { Reveal } from '@/components/layout/reveal'
import type { Feature } from '@/data/features'
import { cn } from '@/lib/utils'

/** Renders one entry from FEATURES. The bento span comes from the data. */
export function FeatureCard({ feature, delay = 0 }: { feature: Feature; delay?: number }) {
  const Icon = feature.icon
  const isWide = feature.span === 'full'

  return (
    <Reveal delay={delay} className={cn(isWide && 'lg:col-span-2')}>
      <Card
        className={cn('h-full p-7 sm:p-8', isWide && 'lg:flex lg:items-start lg:gap-10')}
      >
        <div className={cn(isWide && 'lg:max-w-md')}>
          <span className="grid size-12 place-items-center rounded-xl bg-gradient-aqua text-white shadow-sm">
            <Icon className="size-5" aria-hidden="true" />
          </span>
          <h3 className="mt-5 text-title font-bold text-foreground">{feature.title}</h3>
          <p className="mt-3 text-muted-foreground text-pretty">{feature.description}</p>
        </div>

        <ul className={cn('mt-6 space-y-3', isWide && 'lg:mt-1 lg:flex-1')}>
          {feature.points.map((point) => (
            <li key={point} className="flex items-start gap-3 text-sm text-foreground">
              <Check className="mt-0.5 size-4 shrink-0 text-primary" aria-hidden="true" />
              {point}
            </li>
          ))}
        </ul>
      </Card>
    </Reveal>
  )
}
