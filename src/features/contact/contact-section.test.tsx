import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it } from 'vitest'
import { SITE } from '@/data/site'
import { ContactSection } from './contact-section'

describe('ContactSection', () => {
  it('lists the direct contact channels from site data', () => {
    render(<ContactSection />)
    expect(screen.getByRole('link', { name: new RegExp(SITE.email, 'i') })).toHaveAttribute(
      'href',
      `mailto:${SITE.email}`,
    )
    expect(screen.getByText(SITE.address)).toBeInTheDocument()
  })

  it('validates all three fields on an empty submit', async () => {
    render(<ContactSection />)
    await userEvent.click(screen.getByRole('button', { name: 'Send message' }))

    expect(await screen.findByText('Name is required.')).toBeInTheDocument()
    expect(screen.getByText('Email is required.')).toBeInTheDocument()
    expect(screen.getByText('Message is required.')).toBeInTheDocument()
    expect(screen.queryByRole('status')).not.toBeInTheDocument()
  })

  it('rejects a malformed email while keeping the other values', async () => {
    render(<ContactSection />)
    await userEvent.type(screen.getByLabelText('Name'), 'Rina')
    await userEvent.type(screen.getByLabelText('Email'), 'rina@@example')
    await userEvent.type(screen.getByLabelText('Message'), 'Three outlets, one spreadsheet.')
    await userEvent.click(screen.getByRole('button', { name: 'Send message' }))

    expect(await screen.findByText('Enter a valid email address.')).toBeInTheDocument()
    expect(screen.getByLabelText('Name')).toHaveValue('Rina')
  })

  it('acknowledges a valid submission and clears the form', async () => {
    render(<ContactSection />)
    await userEvent.type(screen.getByLabelText('Name'), 'Rina Prasetyo')
    await userEvent.type(screen.getByLabelText('Email'), 'rina@berkahjaya.id')
    await userEvent.type(screen.getByLabelText('Message'), 'We run three outlets.')
    await userEvent.click(screen.getByRole('button', { name: 'Send message' }))

    expect(await screen.findByRole('status')).toHaveTextContent(/in touch/i)
    await waitFor(() => expect(screen.getByLabelText('Name')).toHaveValue(''))
  })

  it('associates the message error with its textarea', async () => {
    render(<ContactSection />)
    await userEvent.click(screen.getByRole('button', { name: 'Send message' }))

    const textarea = screen.getByLabelText('Message')
    await waitFor(() => expect(textarea).toHaveAttribute('aria-invalid', 'true'))
    expect(textarea).toHaveAttribute('aria-describedby', 'contact-message-error')
    expect(document.getElementById('contact-message-error')).toBeInTheDocument()
  })
})
