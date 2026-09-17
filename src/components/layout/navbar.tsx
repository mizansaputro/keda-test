import { useEffect, useMemo, useRef, useState } from 'react'
import { Link } from '@tanstack/react-router'
import { AnimatePresence, motion } from 'motion/react'
import { Menu, X } from 'lucide-react'
import { buttonVariants } from '@/components/ui/button'
import { ThemeToggle } from '@/components/ui/theme-toggle'
import { Container } from './container'
import { Logo } from './logo'
import { NAV_LINKS } from '@/data/site'
import { useActiveSection } from '@/hooks/use-active-section'
import { useScrolled } from '@/hooks/use-scrolled'
import { cn } from '@/lib/utils'

export function Navbar() {
  const scrolled = useScrolled()
  const [menuOpen, setMenuOpen] = useState(false)
  const menuTriggerRef = useRef<HTMLButtonElement>(null)

  const sectionIds = useMemo(() => NAV_LINKS.map((link) => link.hash.slice(1)), [])
  const activeSection = useActiveSection(sectionIds)

  // A drawer that stays open behind a resized viewport is a common bug; close
  // it as soon as the desktop layout takes over.
  useEffect(() => {
    if (!menuOpen) return
    const mq = window.matchMedia('(min-width: 768px)')
    const close = () => setMenuOpen(false)
    mq.addEventListener('change', close)
    return () => mq.removeEventListener('change', close)
  }, [menuOpen])

  useEffect(() => {
    document.body.style.overflow = menuOpen ? 'hidden' : ''
    return () => {
      document.body.style.overflow = ''
    }
  }, [menuOpen])

  // Escape should dismiss an overlay, and focus belongs back on the trigger
  // rather than wherever it was before the menu opened.
  useEffect(() => {
    if (!menuOpen) return
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key !== 'Escape') return
      setMenuOpen(false)
      menuTriggerRef.current?.focus()
    }
    document.addEventListener('keydown', onKeyDown)
    return () => document.removeEventListener('keydown', onKeyDown)
  }, [menuOpen])

  return (
    <header
      className={cn(
        'fixed inset-x-0 top-0 z-50 transition-[background-color,border-color,box-shadow,backdrop-filter]',
        'duration-(--duration-slow) ease-(--ease-hover)',
        scrolled || menuOpen
          ? 'border-b border-border bg-background/80 shadow-sm backdrop-blur-xl'
          : 'border-b border-transparent bg-transparent',
      )}
    >
      <Container>
        <nav aria-label="Main" className="flex h-18 items-center justify-between gap-6">
          <a href="#hero" className="rounded-xl" aria-label={`${'Aliran'} home`}>
            <Logo />
          </a>

          {/* Desktop navigation. Uppercase and widely tracked, following the
              reference design's navigation styling. */}
          <ul className="hidden items-center gap-9 md:flex">
            {NAV_LINKS.map((link) => {
              const isActive = activeSection === link.hash.slice(1)
              return (
                <li key={link.hash}>
                  <a
                    href={link.hash}
                    aria-current={isActive ? 'true' : undefined}
                    className={cn(
                      'eyebrow relative py-2',
                      'transition-colors duration-(--duration-hover) ease-(--ease-hover) hover:text-foreground',
                      'after:absolute after:inset-x-0 after:-bottom-0.5 after:h-0.5 after:origin-left',
                      'after:rounded-full after:bg-gradient-brand after:transition-transform',
                      'after:duration-(--duration-hover) after:ease-(--ease-hover) hover:after:scale-x-100',
                      // The underline doubles as the you-are-here marker, so
                      // hover and current state share one visual language.
                      isActive
                        ? 'text-foreground after:scale-x-100'
                        : 'text-muted-foreground after:scale-x-0',
                    )}
                  >
                    {link.label}
                  </a>
                </li>
              )
            })}
          </ul>

          <div className="flex items-center gap-2 sm:gap-3">
            <ThemeToggle />
            {/* Reuses the Button recipe rather than restyling an anchor. */}
            <Link
              to="/login"
              className={cn(buttonVariants({ variant: 'outline', size: 'sm' }), 'hidden sm:inline-flex')}
            >
              Login
            </Link>
            <button
              ref={menuTriggerRef}
              type="button"
              onClick={() => setMenuOpen((open) => !open)}
              aria-expanded={menuOpen}
              aria-controls="mobile-menu"
              aria-label={menuOpen ? 'Close menu' : 'Open menu'}
              className="grid size-10 place-items-center rounded-full border border-border-strong text-foreground md:hidden"
            >
              {menuOpen ? <X className="size-5" /> : <Menu className="size-5" />}
            </button>
          </div>
        </nav>
      </Container>

      <AnimatePresence>
        {menuOpen && (
          <motion.div
            id="mobile-menu"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
            className="overflow-hidden border-t border-border bg-background md:hidden"
          >
            <Container className="py-6">
              <ul className="flex flex-col gap-1">
                {NAV_LINKS.map((link, index) => (
                  <motion.li
                    key={link.hash}
                    initial={{ opacity: 0, x: -12 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.06 * index + 0.05, duration: 0.3 }}
                  >
                    <a
                      href={link.hash}
                      onClick={() => setMenuOpen(false)}
                      aria-current={activeSection === link.hash.slice(1) ? 'true' : undefined}
                      className={cn(
                        'eyebrow block rounded-xl px-3 py-3.5 transition-colors hover:bg-muted',
                        activeSection === link.hash.slice(1)
                          ? 'bg-muted text-primary'
                          : 'text-foreground',
                      )}
                    >
                      {link.label}
                    </a>
                  </motion.li>
                ))}
              </ul>
              <Link
                to="/login"
                onClick={() => setMenuOpen(false)}
                className="mt-4 flex h-11 w-full items-center justify-center rounded-full bg-gradient-brand text-sm font-medium text-white shadow-md"
              >
                Login
              </Link>
            </Container>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  )
}
