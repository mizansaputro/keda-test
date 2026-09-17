import type { ComponentProps } from 'react'
import { cn } from '@/lib/utils'

/**
 * Base surface for every boxed element on the page.
 *
 * `interactive` is reserved for cards that actually respond to a click — a
 * card that lifts under the cursor but does nothing when pressed reads as a
 * broken affordance, so purely informational cards stay still.
 */
export function Card({
  className,
  interactive = false,
  ...props
}: ComponentProps<'div'> & { interactive?: boolean }) {
  return (
    <div
      className={cn(
        'rounded-2xl border border-border bg-card text-card-foreground shadow-sm',
        interactive &&
          'transition-[transform,box-shadow,border-color] duration-(--duration-hover) ' +
            'ease-(--ease-hover) hover:-translate-y-0.5 hover:border-border-strong hover:shadow-md',
        className,
      )}
      {...props}
    />
  )
}
