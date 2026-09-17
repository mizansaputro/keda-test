import { Link } from '@tanstack/react-router'
import { ArrowRight } from 'lucide-react'
import { buttonVariants } from '@/components/ui/button'
import { Container } from '@/components/layout/container'
import { Reveal } from '@/components/layout/reveal'
import { cn } from '@/lib/utils'

export function CtaSection() {
  return (
    <section className="pb-20 sm:pb-24 lg:pb-28">
      <Container>
        <Reveal>
          <div className="relative overflow-hidden rounded-3xl bg-gradient-brand px-7 py-14 text-center shadow-xl sm:px-12 sm:py-20">
            {/* Soft light shapes, echoing the hero artwork's circles. */}
            <div
              aria-hidden="true"
              className="pointer-events-none absolute -left-16 -top-24 size-72 rounded-full bg-white/15 blur-2xl"
            />
            <div
              aria-hidden="true"
              className="pointer-events-none absolute -bottom-28 -right-10 size-80 rounded-full bg-white/10 blur-2xl"
            />

            <div className="relative mx-auto max-w-2xl">
              <h2 className="text-headline font-extrabold text-white">
                Start recording today, and know tonight.
              </h2>
              <p className="mt-5 text-lead text-white/85 text-pretty">
                Fourteen days, every feature unlocked, no card required. Import your current stock
                list and Aliran will have your first profit figure ready by closing time.
              </p>
              <div className="mt-9 flex flex-col items-stretch justify-center gap-3 sm:flex-row sm:items-center">
                <Link
                  to="/login"
                  className={cn(
                    buttonVariants({ size: 'lg' }),
                    'bg-white text-primary hover:bg-white/90 hover:brightness-100',
                  )}
                >
                  Start free trial
                  <ArrowRight aria-hidden="true" />
                </Link>
                <a
                  href="#contact"
                  className={cn(
                    buttonVariants({ variant: 'outline', size: 'lg' }),
                    'border-white/40 text-white hover:border-white hover:text-white',
                  )}
                >
                  Talk to the team
                </a>
              </div>
            </div>
          </div>
        </Reveal>
      </Container>
    </section>
  )
}
