/**
 * Small hand-rolled validators. The project has two short forms; a schema
 * library would be more dependency than the problem warrants.
 */

/** Deliberately permissive: catches typos, does not try to enforce RFC 5322. */
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/

export const MIN_PASSWORD_LENGTH = 8

export function validateEmail(value: string): string | undefined {
  const trimmed = value.trim()
  if (!trimmed) return 'Email is required.'
  if (!EMAIL_PATTERN.test(trimmed)) return 'Enter a valid email address.'
  return undefined
}

export function validatePassword(value: string): string | undefined {
  if (!value) return 'Password is required.'
  if (value.length < MIN_PASSWORD_LENGTH) {
    return `Password must be at least ${MIN_PASSWORD_LENGTH} characters.`
  }
  return undefined
}

export function validateRequired(value: string, field: string): string | undefined {
  return value.trim() ? undefined : `${field} is required.`
}

/** Drops undefined entries so callers can test emptiness with Object.keys. */
export function collectErrors<T extends string>(
  entries: Record<T, string | undefined>,
): Partial<Record<T, string>> {
  const errors: Partial<Record<T, string>> = {}
  for (const [key, message] of Object.entries(entries) as [T, string | undefined][]) {
    if (message) errors[key] = message
  }
  return errors
}
