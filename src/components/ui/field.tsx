import { useId, type ComponentProps, type ReactNode } from 'react'
import { AnimatePresence, motion } from 'motion/react'
import { cn } from '@/lib/utils'

/**
 * Validation message that expands into place instead of appearing at full
 * height, so a failed submit does not snap the form taller. Shared by the
 * `Field` input and the contact form's textarea.
 */
export function FieldError({ id, children }: { id: string; children?: string }) {
  return (
    <AnimatePresence initial={false}>
      {children && (
        <motion.div
          initial={{ height: 0, opacity: 0 }}
          animate={{ height: 'auto', opacity: 1 }}
          exit={{ height: 0, opacity: 0 }}
          transition={{
            height: { duration: 0.24, ease: [0.25, 0.46, 0.45, 0.94] },
            opacity: { duration: 0.18, ease: 'linear' },
          }}
          className="overflow-hidden"
        >
          <p id={id} role="alert" className="pt-2 text-sm text-destructive">
            {children}
          </p>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

/**
 * Label + control + error message as one accessible unit. Wiring `htmlFor`,
 * `aria-invalid` and `aria-describedby` here means no form in the app can
 * forget them.
 */
export interface FieldProps extends Omit<ComponentProps<'input'>, 'id'> {
  label: string
  error?: string
  /** Rendered inside the input on the trailing edge, e.g. a reveal toggle. */
  trailing?: ReactNode
  containerClassName?: string
}

export function Field({
  label,
  error,
  trailing,
  className,
  containerClassName,
  ...props
}: FieldProps) {
  const id = useId()
  const errorId = `${id}-error`

  return (
    <div className={containerClassName}>
      <div className="space-y-2">
        <label htmlFor={id} className="block text-sm font-medium text-foreground">
          {label}
        </label>
        <div className="relative">
          <input
            id={id}
            aria-invalid={error ? true : undefined}
            aria-describedby={error ? errorId : undefined}
            className={cn(
              'h-11 w-full rounded-xl border bg-background px-4 text-sm text-foreground',
              'placeholder:text-muted-foreground/70',
              'transition-[border-color,box-shadow]',
              'focus-visible:outline-none focus-visible:border-primary focus-visible:ring-2 focus-visible:ring-primary/25',
              error ? 'border-destructive' : 'border-input hover:border-border-strong',
              trailing && 'pr-11',
              className,
            )}
            {...props}
          />
          {trailing && <div className="absolute inset-y-0 right-1 flex items-center">{trailing}</div>}
        </div>
      </div>
      <FieldError id={errorId}>{error}</FieldError>
    </div>
  )
}
