import { motion } from 'motion/react'
import { cn } from '@/lib/utils'

/**
 * The signature artwork from the reference design: an organic blue-to-violet
 * wave with floating circles. Drawn as inline SVG rather than an image so it
 * inherits the brand gradient tokens and stays sharp at any size.
 */
export interface GradientWaveProps {
  className?: string
  preserveAspectRatio?: string
  /**
   * The floating circles are decorative. The hero turns them off: they are the
   * one opaque part of the artwork, and at hero scale the largest of them lands
   * on the headline, which the gradient wash behind it does not.
   */
  showCircles?: boolean
}

export function GradientWave({
  className,
  preserveAspectRatio = 'xMidYMid slice',
  showCircles = true,
}: GradientWaveProps) {
  return (
    <svg
      viewBox="0 0 520 480"
      className={cn('h-full w-full', className)}
      preserveAspectRatio={preserveAspectRatio}
      aria-hidden="true"
    >
      <defs>
        <linearGradient id="wave-fill" x1="0%" y1="100%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="var(--brand-blue)" />
          <stop offset="55%" stopColor="oklch(0.6 0.226 288)" />
          <stop offset="100%" stopColor="var(--brand-violet)" />
        </linearGradient>
        <linearGradient id="wave-fill-soft" x1="0%" y1="100%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="var(--brand-blue)" stopOpacity="0.35" />
          <stop offset="100%" stopColor="var(--brand-violet)" stopOpacity="0.2" />
        </linearGradient>
      </defs>

      {/* Trailing echo of the main wave, offset to add depth. */}
      <motion.path
        d="M0 340 C 90 300, 150 210, 250 205 S 400 120, 520 44 L520 480 L0 480 Z"
        fill="url(#wave-fill-soft)"
        initial={{ y: 26, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 1, ease: [0.22, 1, 0.36, 1], delay: 0.1 }}
      />

      <motion.path
        d="M0 392 C 96 366, 158 262, 262 258 S 408 168, 520 92 L520 480 L0 480 Z"
        fill="url(#wave-fill)"
        initial={{ y: 40, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 1.1, ease: [0.22, 1, 0.36, 1], delay: 0.2 }}
      />

      {showCircles && (
        <>
        {/* Floating circles, echoing the reference. Motion is a slow drift. */}
        <motion.circle
          cx="176"
          cy="176"
          r="30"
          fill="var(--brand-blue)"
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1, y: [0, -12, 0] }}
          transition={{
            scale: { duration: 0.6, delay: 0.55, ease: [0.22, 1, 0.36, 1] },
            opacity: { duration: 0.6, delay: 0.55 },
            y: { duration: 7, repeat: Infinity, ease: 'easeInOut' },
          }}
        />
        <motion.circle
          cx="410"
          cy="112"
          r="12"
          fill="var(--brand-violet)"
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 0.75, y: [0, 10, 0] }}
          transition={{
            scale: { duration: 0.5, delay: 0.7 },
            opacity: { duration: 0.5, delay: 0.7 },
            y: { duration: 6, repeat: Infinity, ease: 'easeInOut', delay: 0.4 },
          }}
        />
        <motion.circle
          cx="332"
          cy="60"
          r="6"
          fill="var(--brand-cyan)"
          initial={{ scale: 0 }}
          animate={{ scale: 1, y: [0, -8, 0] }}
          transition={{
            scale: { duration: 0.5, delay: 0.85 },
            y: { duration: 5.5, repeat: Infinity, ease: 'easeInOut', delay: 0.8 },
          }}
        />
        </>
      )}
    </svg>
  )
}
