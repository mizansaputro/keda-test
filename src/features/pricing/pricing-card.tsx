import { AnimatePresence, motion } from 'motion/react'
import { Check, Sparkles } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { buttonVariants } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Reveal } from '@/components/layout/reveal'
import { formatPrice, type BillingPeriod, type PricingTier } from '@/data/pricing'
import { cn } from '@/lib/utils'

export interface PricingCardProps {
  tier: PricingTier
  period: BillingPeriod
  delay?: number
  className?: string
}

/**
 * One component renders all three tiers. The only visual difference for the
 * popular tier is a stronger border, a ribbon and a filled CTA — driven by the
 * `popular` flag in the data, not by a separate component.
 */
export function PricingCard({ tier, period, delay = 0, className }: PricingCardProps) {
  const popular = Boolean(tier.popular)

  return (
    <Reveal delay={delay} className={cn('h-full', popular && 'lg:-mt-4 lg:mb-4', className)}>
      <Card
        interactive
        className={cn(
          'relative flex h-full flex-col p-7 sm:p-8',
          popular && 'border-primary/40 shadow-lg ring-1 ring-primary/20',
        )}
      >
        {popular && (
          <Badge variant="gradient" className="absolute -top-3 left-7">
            <Sparkles aria-hidden="true" />
            Most popular
          </Badge>
        )}

        <h3 className="text-title font-bold text-foreground">{tier.name}</h3>
        <p className="mt-2 min-h-10 text-sm text-muted-foreground text-pretty">{tier.summary}</p>

        {/* The figure and its caption cross-fade together when the billing
            period changes, so the switch does not snap a new number into place.
            `mode="wait"` keeps the row from doubling in height mid-swap. */}
        <div className="mt-6">
          <AnimatePresence mode="wait" initial={false}>
            <motion.div
              key={period}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              transition={{ duration: 0.2, ease: [0.25, 0.46, 0.45, 0.94] }}
            >
              <p className="flex items-baseline gap-1.5">
                <span className="font-display text-4xl font-extrabold tracking-tight tabular-nums text-foreground">
                  {formatPrice(tier.price[period])}
                </span>
                <span className="text-sm text-muted-foreground">/ month</span>
              </p>
              <p className="mt-1.5 text-xs text-muted-foreground">
                {period === 'annual'
                  ? 'Billed annually, 20% saved'
                  : 'Billed monthly, cancel anytime'}
              </p>
            </motion.div>
          </AnimatePresence>
        </div>

        <a
          href="#contact"
          className={cn(
            buttonVariants({ variant: popular ? 'gradient' : 'outline', size: 'md' }),
            'mt-7 w-full',
          )}
        >
          {tier.cta}
        </a>

        <div className="mt-7 border-t border-border pt-6">
          {tier.inheritsFrom && (
            <p className="mb-4 text-sm font-semibold text-foreground">
              Everything in {tier.inheritsFrom}, plus:
            </p>
          )}
          <ul className="space-y-3">
            {tier.features.map((feature) => (
              <li key={feature} className="flex items-start gap-3 text-sm text-muted-foreground">
                <Check className="mt-0.5 size-4 shrink-0 text-primary" aria-hidden="true" />
                <span className="text-foreground">{feature}</span>
              </li>
            ))}
          </ul>
        </div>
      </Card>
    </Reveal>
  )
}
