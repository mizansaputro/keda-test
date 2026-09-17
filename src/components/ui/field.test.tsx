import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it } from 'vitest'
import { Field } from './field'

describe('Field', () => {
  it('associates its label with the input', async () => {
    render(<Field label="Email" />)
    const input = screen.getByLabelText('Email')
    await userEvent.type(input, 'owner@aliran.id')
    expect(input).toHaveValue('owner@aliran.id')
  })

  it('generates a unique id per instance so two fields do not collide', () => {
    render(
      <>
        <Field label="Name" />
        <Field label="Email" />
      </>,
    )
    const name = screen.getByLabelText('Name')
    const email = screen.getByLabelText('Email')
    expect(name.id).not.toBe(email.id)
  })

  it('stays clean until an error is passed', () => {
    render(<Field label="Email" />)
    expect(screen.getByLabelText('Email')).not.toHaveAttribute('aria-invalid')
    expect(screen.queryByRole('alert')).not.toBeInTheDocument()
  })

  it('wires the error message up for assistive technology', () => {
    render(<Field label="Email" error="Enter a valid email address." />)
    const input = screen.getByLabelText('Email')
    const alert = screen.getByRole('alert')

    expect(input).toHaveAttribute('aria-invalid', 'true')
    expect(input).toHaveAttribute('aria-describedby', alert.id)
    expect(alert).toHaveTextContent('Enter a valid email address.')
  })

  it('renders trailing content, such as a password reveal toggle', () => {
    render(<Field label="Password" trailing={<button type="button">Show</button>} />)
    expect(screen.getByRole('button', { name: 'Show' })).toBeInTheDocument()
  })

  it('forwards native input attributes', () => {
    render(<Field label="Email" type="email" name="email" autoComplete="email" />)
    const input = screen.getByLabelText('Email')
    expect(input).toHaveAttribute('type', 'email')
    expect(input).toHaveAttribute('name', 'email')
    expect(input).toHaveAttribute('autocomplete', 'email')
  })
})
