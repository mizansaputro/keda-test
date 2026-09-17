import { motion } from 'motion/react'
import { ArrowUpRight, Play } from 'lucide-react'
import { HERO_AUDIENCE, HERO_HIGHLIGHT, HERO_PROOF, HERO_WALKTHROUGH } from '@/data/hero'
import { cn } from '@/lib/utils'

/**
 * The tiles that sit on the hero lattice. They are grouped in one file because
 * none of them is reusable outside the hero — splitting them further would add
 * files without adding clarity.
 */

/** Initials, not photographs: there is no real customer list behind this. */
export function AudienceTile({ className }: { className?: string }) {
  return (
    <div className={cn('flex flex-col justify-center gap-4', className)}>
      <div>
        <p className="font-display text-3xl font-extrabold tracking-tight tabular-nums text-foreground sm:text-4xl">
          {HERO_AUDIENCE.value}
        </p>
        <p className="mt-1 text-sm text-muted-foreground">{HERO_AUDIENCE.label}</p>
      </div>
      <ul className="flex items-center -space-x-2">
        {HERO_AUDIENCE.avatars.map((initials, index) => (
          <li
            key={initials}
            className={cn(
              'grid size-9 place-items-center rounded-full ring-2 ring-background',
              'text-[0.625rem] font-bold tracking-wide text-white',
              index % 2 === 0 ? 'bg-gradient-aqua' : 'bg-gradient-brand',
            )}
          >
            {initials}
          </li>
        ))}
      </ul>

      <dl className="flex gap-6 border-t border-border pt-4 sm:gap-8 lg:flex-col lg:gap-3">
        {HERO_PROOF.map((stat) => (
          <div key={stat.label}>
            <dt className="sr-only">{stat.label}</dt>
            <dd>
              <span className="block font-display text-base font-extrabold tracking-tight tabular-nums text-foreground">
                {stat.value}
              </span>
              <span className="block text-xs text-muted-foreground">{stat.label}</span>
            </dd>
          </div>
        ))}
      </dl>
    </div>
  )
}

/** Solid dark tile. The one high-contrast block in the mosaic. */
export function HighlightTile({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        'flex flex-col justify-between gap-6 bg-foreground p-6 text-background sm:p-7',
        className,
      )}
    >
      <p className="font-display text-4xl font-extrabold tracking-tight tabular-nums sm:text-5xl">
        {HERO_HIGHLIGHT.value}
      </p>
      <p className="eyebrow max-w-[24ch] leading-relaxed opacity-80 lg:max-w-[15ch]">{HERO_HIGHLIGHT.label}</p>
    </div>
  )
}

/**
 * Light card carrying the walkthrough prompt and today's figure. Stands in for
 * the reference layout's photo card, using product data instead of stock
 * photography.
 */
export function WalkthroughTile({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        'flex flex-col justify-between gap-6 bg-card p-6 shadow-lg sm:flex-row sm:items-end sm:p-7',
        className,
      )}
    >
      <div className="min-w-0">
        <p className="font-display text-title font-bold text-foreground">
          {HERO_WALKTHROUGH.title}
        </p>
        <p className="mt-3 flex items-center gap-2 text-sm text-muted-foreground">
          <span className="size-1.5 rounded-full bg-brand-cyan" aria-hidden="true" />
          {HERO_WALKTHROUGH.badge}
        </p>
      </div>

      <div className="flex shrink-0 items-end gap-5">
        <div className="hidden sm:block">
          <p className="flex items-baseline gap-1.5">
            <span className="font-display text-2xl font-extrabold tracking-tight tabular-nums text-foreground">
              {HERO_WALKTHROUGH.profit}
            </span>
            <span className="text-xs font-medium text-emerald-600 dark:text-emerald-400">
              {HERO_WALKTHROUGH.change}
            </span>
          </p>
          <p className="mt-0.5 text-xs text-muted-foreground">{HERO_WALKTHROUGH.profitLabel}</p>
        </div>

        <button
          type="button"
          className={cn(
            'group flex shrink-0 items-center gap-3 rounded-full text-sm font-medium text-foreground',
            'transition-colors hover:text-primary',
          )}
        >
          <span
            className={cn(
              'grid size-12 place-items-center rounded-full bg-foreground text-background shadow-md',
              'transition-transform duration-(--duration-hover) ease-(--ease-hover)',
              'group-hover:scale-105',
            )}
          >
            <Play className="size-4 translate-x-px fill-current" aria-hidden="true" />
          </span>
          Watch
          <span className="sr-only">the {HERO_WALKTHROUGH.duration} walkthrough</span>
        </button>
      </div>
    </div>
  )
}

/** Uppercase block set directly on the gradient artwork. */
export function OverlayTile({ lines, className }: { lines: readonly string[]; className?: string }) {
  return (
    <div className={cn('flex flex-col justify-end gap-4 p-6 sm:p-7', className)}>
      <ArrowUpRight className="size-6 text-white/70" aria-hidden="true" />
      <p className="font-display text-xl font-bold uppercase leading-tight tracking-tight text-white sm:text-2xl">
        {lines.map((line) => (
          <motion.span key={line} className="block">
            {line}
          </motion.span>
        ))}
      </p>
    </div>
  )
}
