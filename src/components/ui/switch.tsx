import { motion } from 'motion/react'
import { cn } from '@/lib/utils'

export interface SwitchProps {
  checked: boolean
  onCheckedChange: (checked: boolean) => void
  /** Required: the control has no visible text of its own. */
  label: string
  className?: string
}

/**
 * Token-styled toggle built on a native button with `role="switch"`.
 *
 * The thumb travels on a spring rather than a timed ease — a switch is a
 * physical metaphor, and a slight settle at the end reads better than an
 * abrupt stop. The track colour still cross-fades on the shared hover curve.
 */
export function Switch({ checked, onCheckedChange, label, className }: SwitchProps) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      aria-label={label}
      onClick={() => onCheckedChange(!checked)}
      className={cn(
        'relative h-6 w-11 shrink-0 cursor-pointer rounded-full border border-transparent',
        'transition-colors duration-(--duration-hover) ease-(--ease-hover)',
        checked ? 'bg-primary' : 'bg-muted border-border-strong',
        className,
      )}
    >
      <motion.span
        aria-hidden="true"
        className="block size-5 rounded-full bg-white shadow-sm"
        animate={{ x: checked ? 20 : 2 }}
        transition={{ type: 'spring', stiffness: 420, damping: 32, mass: 0.7 }}
      />
    </button>
  )
}
