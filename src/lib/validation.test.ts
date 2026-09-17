import { describe, expect, it } from 'vitest'
import {
  MIN_PASSWORD_LENGTH,
  collectErrors,
  validateEmail,
  validatePassword,
  validateRequired,
} from './validation'

describe('validateEmail', () => {
  it('requires a value', () => {
    expect(validateEmail('')).toBe('Email is required.')
    expect(validateEmail('   ')).toBe('Email is required.')
  })

  it.each(['plainstring', 'missing@domain', 'no-at.example.com', 'spaces in@mail.com'])(
    'rejects %s',
    (value) => {
      expect(validateEmail(value)).toBe('Enter a valid email address.')
    },
  )

  it.each(['owner@aliran.id', 'rina.p+stock@company.co.id'])('accepts %s', (value) => {
    expect(validateEmail(value)).toBeUndefined()
  })

  it('ignores surrounding whitespace', () => {
    expect(validateEmail('  owner@aliran.id  ')).toBeUndefined()
  })
})

describe('validatePassword', () => {
  it('requires a value', () => {
    expect(validatePassword('')).toBe('Password is required.')
  })

  it('enforces the minimum length', () => {
    expect(validatePassword('a'.repeat(MIN_PASSWORD_LENGTH - 1))).toContain(
      String(MIN_PASSWORD_LENGTH),
    )
    expect(validatePassword('a'.repeat(MIN_PASSWORD_LENGTH))).toBeUndefined()
  })

  it('does not trim, since spaces are valid password characters', () => {
    expect(validatePassword('   a    ')).toBeUndefined()
  })
})

describe('validateRequired', () => {
  it('names the field in the message', () => {
    expect(validateRequired('', 'Message')).toBe('Message is required.')
  })

  it('treats whitespace as empty', () => {
    expect(validateRequired('  \n ', 'Name')).toBe('Name is required.')
  })
})

describe('collectErrors', () => {
  it('drops undefined entries so callers can check emptiness', () => {
    expect(collectErrors({ email: 'bad', password: undefined })).toEqual({ email: 'bad' })
    expect(Object.keys(collectErrors({ a: undefined, b: undefined }))).toHaveLength(0)
  })
})
