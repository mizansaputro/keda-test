import { cva, type VariantProps } from 'class-variance-authority'
import type { ComponentProps } from 'react'
import { cn } from '@/lib/utils'

const badgeVariants = cva(
  'inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold [&_svg]:size-3.5',
  {
    variants: {
      variant: {
        soft: 'bg-primary/10 text-primary',
        gradient: 'bg-gradient-brand text-white shadow-sm',
        outline: 'border border-border-strong text-muted-foreground',
      },
    },
    defaultVariants: { variant: 'soft' },
  },
)

export type BadgeProps = ComponentProps<'span'> & VariantProps<typeof badgeVariants>

export function Badge({ className, variant, ...props }: BadgeProps) {
  return <span className={cn(badgeVariants({ variant }), className)} {...props} />
}
