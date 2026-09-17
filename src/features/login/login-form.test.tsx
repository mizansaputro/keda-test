import { screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it } from 'vitest'
import { renderWithTheme } from '@/test/render-with-router'
import { LoginForm } from './login-form'

const VALID_EMAIL = 'owner@aliran.id'
const VALID_PASSWORD = 'gudang-2019'

function fields() {
  return {
    email: screen.getByLabelText('Email'),
    password: screen.getByLabelText('Password'),
    submit: screen.getByRole('button', { name: 'Sign in' }),
  }
}

describe('LoginForm', () => {
  it('shows no errors before the first submit', () => {
    renderWithTheme(<LoginForm />)
    expect(screen.queryAllByRole('alert')).toHaveLength(0)
  })

  it('reports both fields when an empty form is submitted', async () => {
    renderWithTheme(<LoginForm />)
    await userEvent.click(fields().submit)

    expect(await screen.findByText('Email is required.')).toBeInTheDocument()
    expect(screen.getByText('Password is required.')).toBeInTheDocument()
  })

  it('rejects a malformed email', async () => {
    renderWithTheme(<LoginForm />)
    const { email, password, submit } = fields()

    await userEvent.type(email, 'owner@aliran')
    await userEvent.type(password, VALID_PASSWORD)
    await userEvent.click(submit)

    expect(await screen.findByText('Enter a valid email address.')).toBeInTheDocument()
    // Only the offending field should be reported.
    expect(screen.getAllByRole('alert')).toHaveLength(1)
    expect(password).not.toHaveAttribute('aria-invalid')
  })

  it('rejects a password below the minimum length', async () => {
    renderWithTheme(<LoginForm />)
    const { email, password, submit } = fields()

    await userEvent.type(email, VALID_EMAIL)
    await userEvent.type(password, 'short')
    await userEvent.click(submit)

    expect(await screen.findByText(/at least 8 characters/i)).toBeInTheDocument()
  })

  it('marks invalid inputs with aria-invalid', async () => {
    renderWithTheme(<LoginForm />)
    await userEvent.click(fields().submit)

    await waitFor(() => {
      expect(fields().email).toHaveAttribute('aria-invalid', 'true')
    })
    expect(fields().password).toHaveAttribute('aria-invalid', 'true')
  })

  it('clears an error once the input is corrected and resubmitted', async () => {
    renderWithTheme(<LoginForm />)
    await userEvent.click(fields().submit)
    expect(await screen.findByText('Email is required.')).toBeInTheDocument()

    await userEvent.type(fields().email, VALID_EMAIL)
    await userEvent.type(fields().password, VALID_PASSWORD)
    await userEvent.click(fields().submit)

    await waitFor(() => {
      expect(screen.queryByText('Email is required.')).not.toBeInTheDocument()
    })
  })

  it('confirms success for a valid submission', async () => {
    renderWithTheme(<LoginForm />)
    const { email, password, submit } = fields()

    await userEvent.type(email, VALID_EMAIL)
    await userEvent.type(password, VALID_PASSWORD)
    await userEvent.click(submit)

    // The simulated round trip disables the control while it resolves.
    expect(screen.getByRole('button', { name: /signing in/i })).toBeDisabled()
    expect(await screen.findByRole('status')).toHaveTextContent(/signed in/i)
  })

  it('hides the password by default and reveals it on request', async () => {
    renderWithTheme(<LoginForm />)
    expect(fields().password).toHaveAttribute('type', 'password')

    await userEvent.click(screen.getByRole('button', { name: 'Show password' }))
    expect(fields().password).toHaveAttribute('type', 'text')

    await userEvent.click(screen.getByRole('button', { name: 'Hide password' }))
    expect(fields().password).toHaveAttribute('type', 'password')
  })

  it('offers remember-me and forgot-password affordances', () => {
    renderWithTheme(<LoginForm />)
    expect(screen.getByRole('checkbox', { name: /remember me/i })).toBeChecked()
    expect(screen.getByRole('link', { name: /forgot password/i })).toBeInTheDocument()
  })
})
