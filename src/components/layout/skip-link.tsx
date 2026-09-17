/**
 * Visible only once focused. Lets keyboard users jump past the fixed navbar
 * instead of tabbing through it on every visit.
 *
 * Uses `focus:` rather than `focus-visible:` — this control is unreachable
 * without a keyboard, and `focus:` also shows it for programmatic focus.
 */
export function SkipLink({ targetId }: { targetId: string }) {
  return (
    <a
      href={`#${targetId}`}
      className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-100 focus:rounded-full focus:bg-primary focus:px-5 focus:py-2.5 focus:text-sm focus:font-medium focus:text-primary-foreground focus:shadow-lg"
    >
      Skip to main content
    </a>
  )
}
