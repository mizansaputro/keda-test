import { cn } from '@/lib/utils'
import { SITE } from '@/data/site'

/**
 * Brand mark. The glyph is two arrows circulating through a container — goods
 * in, goods out — and sits on the cyan-to-blue gradient carried over from the
 * reference artwork's curved header shape.
 */
export function Logo({ className, wordmark = true }: { className?: string; wordmark?: boolean }) {
  return (
    <span className={cn('inline-flex items-center gap-2.5', className)}>
      <span className="grid size-9 place-items-center rounded-xl bg-gradient-aqua shadow-sm">
        <svg viewBox="0 0 24 24" className="size-5" fill="none" aria-hidden="true">
          <path
            d="M7 9h10l-2.5-2.5M17 15H7l2.5 2.5"
            stroke="white"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </span>
      {wordmark && (
        <span className="font-display text-lg font-extrabold tracking-tight text-foreground">
          {SITE.name}
        </span>
      )}
    </span>
  )
}
