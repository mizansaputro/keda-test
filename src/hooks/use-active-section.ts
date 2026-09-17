import { useEffect, useState } from 'react'

/**
 * Tracks which of the given section ids is currently the reader's focus, so the
 * navbar can show where they are rather than only where they have hovered.
 *
 * An IntersectionObserver callback receives only the entries that *changed*, so
 * the latest state for every section is accumulated in a map and the winner is
 * picked from that. Reading the callback argument alone leaves the indicator
 * stale whenever a section leaves the band in its own callback.
 *
 * Among the sections in view, the one nearest the top of the band wins — that
 * behaves better than "last one to cross" when a short section sits between two
 * tall ones. When nothing qualifies the previous choice is kept, so the
 * indicator does not flicker off in the gaps between tracked sections.
 */
export function useActiveSection(ids: string[], topOffset = 96): string | null {
  const [active, setActive] = useState<string | null>(null)

  useEffect(() => {
    const elements = ids
      .map((id) => document.getElementById(id))
      .filter((element): element is HTMLElement => element !== null)

    if (elements.length === 0) return

    const latest = new Map<string, IntersectionObserverEntry>()

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) latest.set(entry.target.id, entry)

        const visible = [...latest.values()].filter((entry) => entry.isIntersecting)
        if (visible.length === 0) return

        const nearest = visible.reduce((best, entry) =>
          Math.abs(entry.boundingClientRect.top) < Math.abs(best.boundingClientRect.top)
            ? entry
            : best,
        )
        setActive(nearest.target.id)
      },
      {
        // Discount the fixed navbar, and only count a section once it occupies
        // a meaningful slice of the viewport.
        rootMargin: `-${topOffset}px 0px -55% 0px`,
        threshold: [0, 0.25, 0.5],
      },
    )

    for (const element of elements) observer.observe(element)
    return () => observer.disconnect()
  }, [ids, topOffset])

  return active
}
