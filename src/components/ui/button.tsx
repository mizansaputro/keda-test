import { cva, type VariantProps } from 'class-variance-authority'
import type { ComponentProps } from 'react'
import { cn } from '@/lib/utils'

/**
 * Every variant below resolves to design tokens — no literal colours. The
 * `gradient` variant is the one place the brand gradient appears as a control.
 */
const buttonVariants = cva(
  'inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-full font-medium ' +
    'transition-[background,color,box-shadow,transform,border-color,filter] ' +
    'duration-(--duration-hover) ease-(--ease-hover) ' +
    'focus-visible:outline-ring focus-visible:outline-2 focus-visible:outline-offset-2 ' +
    'disabled:pointer-events-none disabled:opacity-50 ' +
    '[&_svg]:size-4 [&_svg]:shrink-0 active:scale-[0.985]',
  {
    variants: {
      variant: {
        primary: 'bg-primary text-primary-foreground shadow-sm hover:shadow-md hover:brightness-110',
        gradient: 'bg-gradient-brand text-white shadow-md hover:shadow-glow',
        outline:
          'border border-border-strong bg-transparent text-foreground hover:border-primary hover:text-primary',
        secondary: 'bg-secondary text-secondary-foreground hover:bg-muted',
        ghost: 'bg-transparent text-muted-foreground hover:bg-muted hover:text-foreground',
        link: 'h-auto rounded-none p-0 text-primary underline-offset-4 hover:underline',
      },
      size: {
        sm: 'h-9 px-4 text-sm',
        md: 'h-11 px-6 text-sm',
        lg: 'h-13 px-8 text-base',
        icon: 'size-10 rounded-full',
      },
    },
    defaultVariants: { variant: 'primary', size: 'md' },
  },
)

export type ButtonProps = ComponentProps<'button'> & VariantProps<typeof buttonVariants>

export function Button({ className, variant, size, ...props }: ButtonProps) {
  return <button className={cn(buttonVariants({ variant, size }), className)} {...props} />
}

export { buttonVariants }
