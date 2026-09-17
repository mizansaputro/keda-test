import type { ComponentProps, ReactNode } from 'react'
import { Container } from './container'
import { Reveal } from './reveal'
import { cn } from '@/lib/utils'

export interface SectionProps extends Omit<ComponentProps<'section'>, 'title'> {
  /** Anchor target used by the navbar, e.g. `about`. */
  id: string
  /** Alternating band colour. */
  tone?: 'base' | 'surface'
  children: ReactNode
}

/**
 * Owns vertical rhythm, band colour and the scroll anchor. Sections never set
 * their own padding, which is what keeps the page feeling like one document.
 */
export function Section({ id, tone = 'base', className, children, ...props }: SectionProps) {
  return (
    <section
      id={id}
      className={cn(
        'scroll-mt-24 py-20 sm:py-24 lg:py-32',
        tone === 'surface' && 'bg-surface',
        className,
      )}
      {...props}
    >
      <Container>{children}</Container>
    </section>
  )
}

export interface SectionHeadingProps {
  eyebrow: string
  title: ReactNode
  description?: ReactNode
  /** Centred headings are used for full-width sections, left for split ones. */
  align?: 'left' | 'center'
  className?: string
}

export function SectionHeading({
  eyebrow,
  title,
  description,
  align = 'center',
  className,
}: SectionHeadingProps) {
  return (
    <Reveal
      className={cn(
        'max-w-2xl',
        align === 'center' && 'mx-auto text-center',
        className,
      )}
    >
      <p className="eyebrow text-primary">{eyebrow}</p>
      <h2 className="mt-4 text-headline font-bold text-foreground">{title}</h2>
      {description && (
        <p className="mt-5 text-lead text-muted-foreground text-pretty">{description}</p>
      )}
    </Reveal>
  )
}
