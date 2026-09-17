import { describe, expect, it } from 'vitest'
import { sumEvenNumbers } from './sum-even-nested'

/**
 * The brief states two nested fixtures totalling 6 and 12, without showing
 * their shape. These are reconstructions that hit those totals and cover the
 * traits it does describe: arbitrary depth, plus strings and booleans mixed in
 * among the numbers.
 */
const FIXTURE_TOTAL_6 = {
  a: 1,
  b: 2,
  c: { d: 4, e: 'four', f: true },
}

const FIXTURE_TOTAL_12 = {
  a: 2,
  b: {
    c: 4,
    d: { e: 6, f: 'six', g: false },
    h: 3,
  },
  i: 7,
}

describe('sumEvenNumbers', () => {
  it('totals the reconstructed fixtures from the brief', () => {
    expect(sumEvenNumbers(FIXTURE_TOTAL_6)).toBe(6)
    expect(sumEvenNumbers(FIXTURE_TOTAL_12)).toBe(12)
  })

  it('ignores odd numbers', () => {
    expect(sumEvenNumbers({ a: 1, b: 3, c: 5 })).toBe(0)
  })

  it('ignores strings, including numeric-looking ones', () => {
    // '4' would count if the value were coerced with Number().
    expect(sumEvenNumbers({ a: '4', b: '2', c: 'two', d: 2 })).toBe(2)
  })

  it('ignores booleans rather than coercing them', () => {
    // Number(true) is 1 and Number(false) is 0, so coercion would make `false`
    // look even and add nothing while still being wrong in principle.
    expect(sumEvenNumbers({ a: true, b: false })).toBe(0)
    expect(sumEvenNumbers({ a: false, b: 4 })).toBe(4)
  })

  it('ignores null, undefined and empty structures', () => {
    expect(sumEvenNumbers({ a: null, b: undefined, c: {}, d: [] })).toBe(0)
    expect(sumEvenNumbers({})).toBe(0)
    expect(sumEvenNumbers(null)).toBe(0)
    expect(sumEvenNumbers(undefined)).toBe(0)
  })

  it('walks arrays as well as plain objects', () => {
    expect(sumEvenNumbers({ list: [2, 3, 4], nested: [{ a: 6 }] })).toBe(12)
    expect(sumEvenNumbers([2, [4, [6, 'x']]])).toBe(12)
  })

  it('reaches values at arbitrary depth', () => {
    const deep = { a: { b: { c: { d: { e: { f: 8 } } } } } }
    expect(sumEvenNumbers(deep)).toBe(8)
  })

  it('counts negative even numbers, and zero', () => {
    expect(sumEvenNumbers({ a: -4, b: -3, c: 0 })).toBe(-4)
  })

  it('treats non-integers as neither even nor odd', () => {
    expect(sumEvenNumbers({ a: 2.5, b: 4.0, c: -6.5 })).toBe(4)
  })

  it('ignores NaN and Infinity instead of poisoning the total', () => {
    expect(sumEvenNumbers({ a: Number.NaN, b: Number.POSITIVE_INFINITY, c: 2 })).toBe(2)
  })

  it('accepts a bare number', () => {
    expect(sumEvenNumbers(4)).toBe(4)
    expect(sumEvenNumbers(5)).toBe(0)
  })

  it('survives a circular reference', () => {
    const node: Record<string, unknown> = { value: 2 }
    node.self = node
    expect(() => sumEvenNumbers(node)).not.toThrow()
    expect(sumEvenNumbers(node)).toBe(2)
  })

  it('counts a shared object once per place it appears', () => {
    // Cycle detection tracks the current path rather than every object seen,
    // so two properties pointing at the same object are both counted — a
    // plain visited-set would collapse them and understate the sum.
    const shared = { value: 10 }
    expect(sumEvenNumbers({ first: shared, second: shared })).toBe(20)
  })

  it('still stops at a cycle that is nested several levels down', () => {
    const root: Record<string, unknown> = { value: 2 }
    root.branch = { value: 4, back: root }
    expect(() => sumEvenNumbers(root)).not.toThrow()
    expect(sumEvenNumbers(root)).toBe(6)
  })

  it('does not mutate the input', () => {
    const input = { a: 2, b: { c: 4 } }
    const snapshot = JSON.stringify(input)
    sumEvenNumbers(input)
    expect(JSON.stringify(input)).toBe(snapshot)
  })
})
