import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import { Button, buttonVariants } from './button'

describe('Button', () => {
  it('renders a native button so it is keyboard operable by default', () => {
    render(<Button>Send message</Button>)
    expect(screen.getByRole('button', { name: 'Send message' })).toBeInTheDocument()
  })

  it('applies the default variant when none is given', () => {
    render(<Button>Default</Button>)
    expect(screen.getByRole('button')).toHaveClass('bg-primary')
  })

  it('applies the requested variant and size', () => {
    render(
      <Button variant="outline" size="lg">
        Outline
      </Button>,
    )
    const button = screen.getByRole('button')
    expect(button).toHaveClass('border-border-strong')
    expect(button).toHaveClass('h-13')
    expect(button).not.toHaveClass('bg-primary')
  })

  it('lets a caller-supplied class override the variant class', () => {
    render(<Button className="bg-transparent">Override</Button>)
    const button = screen.getByRole('button')
    expect(button).toHaveClass('bg-transparent')
    expect(button).not.toHaveClass('bg-primary')
  })

  it('forwards click handlers', async () => {
    const onClick = vi.fn()
    render(<Button onClick={onClick}>Click</Button>)
    await userEvent.click(screen.getByRole('button'))
    expect(onClick).toHaveBeenCalledOnce()
  })

  it('does not fire when disabled', async () => {
    const onClick = vi.fn()
    render(
      <Button disabled onClick={onClick}>
        Disabled
      </Button>,
    )
    await userEvent.click(screen.getByRole('button'))
    expect(onClick).not.toHaveBeenCalled()
    expect(screen.getByRole('button')).toBeDisabled()
  })

  it('forwards the submit type so it can drive a form', () => {
    render(<Button type="submit">Submit</Button>)
    expect(screen.getByRole('button')).toHaveAttribute('type', 'submit')
  })

  it('exposes the same recipe to non-button elements via buttonVariants', () => {
    // The navbar and hero style <Link> elements with this instead of nesting a
    // button inside an anchor.
    expect(buttonVariants({ variant: 'outline', size: 'sm' })).toContain('border-border-strong')
  })
})
