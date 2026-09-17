import { Link } from '@tanstack/react-router'
import { motion } from 'motion/react'
import { ArrowRight, Sparkles } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { buttonVariants } from '@/components/ui/button'
import { Container } from '@/components/layout/container'
import { HERO_OVERLAY } from '@/data/hero'
import { cn } from '@/lib/utils'
import { GradientWave } from './gradient-wave'
import { AudienceTile, HighlightTile, OverlayTile, WalkthroughTile } from './hero-tiles'

const rise = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
}

const transition = { duration: 0.6, ease: [0.22, 1, 0.36, 1] as const }

/** Shared by every tile so they settle in one sequence. */
const tile = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0 },
}

/**
 * Editorial mosaic hero: the gradient artwork runs full-bleed behind a hairline
 * lattice, with content tiles placed asymmetrically on it.
 *
 * The wave stays anchored to the right, as in the KeDA reference, which also
 * gives the layout its two contrast zones — dark type on the pale left, white
 * type over the gradient on the right.
 */
export function HeroSection() {
  return (
    <section id="hero" className="relative isolate overflow-hidden">
      {/* --- Backdrop --- */}
      <div aria-hidden="true" className="absolute inset-0 -z-20">
        <div className="absolute -left-40 -top-40 size-[34rem] rounded-full bg-brand-cyan/20 blur-3xl dark:bg-brand-cyan/10" />
        {/* Anchored right on wide screens; a band across the foot on narrow
            ones, where a side panel would leave the copy nowhere to sit.
            The mask fades the artwork in rather than cutting it off, so the
            copy column can overlap its faint edge the way the reference layout
            sets type over the lighter part of its image. */}
        <div
          className={cn(
            'absolute inset-x-0 bottom-0 h-64 sm:h-80',
            'lg:inset-y-0 lg:left-auto lg:right-0 lg:h-full lg:w-[52%]',
            '[mask-image:linear-gradient(to_top,black_45%,transparent_100%)]',
            'lg:[mask-image:linear-gradient(to_right,transparent_0%,black_38%)]',
          )}
        >
          <GradientWave className="h-full w-full" showCircles={false} />
        </div>
      </div>

      <div aria-hidden="true" className="hero-lattice absolute inset-0 -z-10" />

      <Container className="relative pt-28 pb-0 sm:pt-30 lg:pt-32">
        {/* --- Row 1: headline, with the audience figure alongside --- */}
        <motion.div
          initial="hidden"
          animate="visible"
          transition={{ staggerChildren: 0.08 }}
          className="grid gap-10 pb-12 lg:grid-cols-12 lg:gap-8 lg:pb-16"
        >
          {/* Beside the headline on desktop, as in the reference; below it on
              narrow screens, where the headline should lead. */}
          <motion.div
            variants={tile}
            transition={transition}
            className="order-2 lg:order-1 lg:col-span-3"
          >
            <AudienceTile className="h-full" />
          </motion.div>

          <div className="order-1 lg:order-2 lg:col-span-5 lg:col-start-4">
            <motion.div variants={rise} transition={transition}>
              <Badge variant="soft">
                <Sparkles aria-hidden="true" />
                Now with AI income prediction
              </Badge>
            </motion.div>

            <motion.h1
              variants={rise}
              transition={transition}
              className="mt-6 text-display font-extrabold text-foreground"
            >
              Know what moves,{' '}
              <span className="text-gradient-brand">and what it earns.</span>
            </motion.h1>

            <motion.p
              variants={rise}
              transition={transition}
              className="mt-6 max-w-lg text-lead text-muted-foreground text-pretty"
            >
              Aliran records every item that enters and leaves your warehouse, then turns those
              movements into a daily profit figure you can trust — without a single spreadsheet.
            </motion.p>

            <motion.div
              variants={rise}
              transition={transition}
              className="mt-9 flex flex-col items-stretch gap-3 sm:flex-row sm:items-center"
            >
              <a href="#pricing" className={cn(buttonVariants({ variant: 'gradient', size: 'lg' }))}>
                See pricing
                <ArrowRight aria-hidden="true" />
              </a>
              <Link to="/login" className={cn(buttonVariants({ variant: 'outline', size: 'lg' }))}>
                Login to dashboard
              </Link>
            </motion.div>
          </div>
        </motion.div>

        {/* --- Row 2: the tile band --- */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-40px' }}
          transition={{ staggerChildren: 0.1 }}
          className="grid overflow-hidden rounded-t-3xl border border-b-0 border-border lg:grid-cols-12"
        >
          <motion.div variants={tile} transition={transition} className="lg:col-span-3">
            <HighlightTile className="h-full" />
          </motion.div>

          <motion.div variants={tile} transition={transition} className="lg:col-span-6">
            <WalkthroughTile className="h-full" />
          </motion.div>

          {/* Sits over the artwork, so its type is white in both themes. */}
          <motion.div
            variants={tile}
            transition={transition}
            className="relative min-h-40 lg:col-span-3"
          >
            <div aria-hidden="true" className="absolute inset-0 -z-10 bg-gradient-brand lg:hidden" />
            <div
              aria-hidden="true"
              className="absolute inset-0 -z-10 hidden bg-black/15 lg:block"
            />
            <OverlayTile lines={HERO_OVERLAY} className="h-full" />
          </motion.div>
        </motion.div>

      </Container>
    </section>
  )
}
