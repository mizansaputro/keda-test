import { motion, type HTMLMotionProps } from 'motion/react'
import type { ReactNode } from 'react'

export interface RevealProps extends Omit<HTMLMotionProps<'div'>, 'children'> {
  children: ReactNode
  /** Seconds of delay, used to stagger siblings. */
  delay?: number
  /** Distance in px the element rises from. */
  y?: number
}

/**
 * The only scroll animation in the project. Every section reveal goes through
 * this component so timing and easing cannot drift between sections.
 * `once: true` means content never re-animates on scroll-back.
 */
export function Reveal({ children, delay = 0, y = 16, ...props }: RevealProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-80px' }}
      transition={{ duration: 0.5, delay, ease: [0.22, 1, 0.36, 1] }}
      {...props}
    >
      {children}
    </motion.div>
  )
}
