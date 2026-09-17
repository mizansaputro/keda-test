import { useState } from 'react'
import { Badge } from '@/components/ui/badge'
import { Switch } from '@/components/ui/switch'
import { Reveal } from '@/components/layout/reveal'
import { Section, SectionHeading } from '@/components/layout/section'
import { PRICING_TIERS, type BillingPeriod } from '@/data/pricing'
import { cn } from '@/lib/utils'
import { PricingCard } from './pricing-card'

export function PricingSection() {
  const [period, setPeriod] = useState<BillingPeriod>('monthly')
  const annual = period === 'annual'

  return (
    <Section id="pricing" tone="surface">
      <SectionHeading
        eyebrow="Pricing"
        title="Pay for the depth you need."
        description="Every plan records goods in, goods out and daily profit. The higher tiers add the analysis and automation that larger operations lean on."
      />

      <Reveal delay={0.08} className="mt-10 flex items-center justify-center gap-4">
        <span
          className={cn(
            'text-sm font-medium transition-colors',
            annual ? 'text-muted-foreground' : 'text-foreground',
          )}
        >
          Monthly
        </span>
        <Switch
          checked={annual}
          onCheckedChange={(checked) => setPeriod(checked ? 'annual' : 'monthly')}
          label="Bill annually and save 20%"
        />
        <span
          className={cn(
            'flex items-center gap-2 text-sm font-medium transition-colors',
            annual ? 'text-foreground' : 'text-muted-foreground',
          )}
        >
          Annual
          <Badge variant="soft">Save 20%</Badge>
        </span>
      </Reveal>

      <div className="mt-12 grid items-start gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {PRICING_TIERS.map((tier, index) => (
          <PricingCard
            key={tier.id}
            tier={tier}
            period={period}
            delay={index * 0.08}
            /* An odd final card would sit alone in the two-column layout;
               let it span the full width there instead. */
            className={
              index === PRICING_TIERS.length - 1 && PRICING_TIERS.length % 2 === 1
                ? 'sm:col-span-2 lg:col-span-1'
                : undefined
            }
          />
        ))}
      </div>

      <Reveal delay={0.1}>
        <p className="mt-10 text-center text-sm text-muted-foreground">
          All prices in Indonesian Rupiah, excluding VAT. Need more than one company?{' '}
          <a href="#contact" className="font-medium text-primary underline-offset-4 hover:underline">
            Talk to sales
          </a>
          .
        </p>
      </Reveal>
    </Section>
  )
}
