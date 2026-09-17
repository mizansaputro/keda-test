import { describe, expect, it } from 'vitest'
// Vite's `?raw` import: the test environment is jsdom, where `import.meta.url`
// is not a file:// URL and `node:fs` cannot resolve it.
import sortDescendingSource from './sort-descending.ts?raw'
import { sortDescending } from './sort-descending'

describe('sortDescending', () => {
  it('sorts the example from the brief', () => {
    expect(sortDescending([1, 2, 4, 3, 5, 3, 2, 1])).toEqual([5, 4, 3, 3, 2, 2, 1, 1])
  })

  it('uses no built-in sorting helpers', () => {
    // The whole point of the exercise, so it is asserted rather than trusted.
    const code = sortDescendingSource.replace(/\/\*[\s\S]*?\*\/|\/\/.*$/gm, '')
    for (const banned of ['.sort(', '.reverse(', '.push(', '.unshift(', '.splice(', '.concat(']) {
      expect(code).not.toContain(banned)
    }
  })

  it('returns a new array and leaves the input untouched', () => {
    const input = [3, 1, 2]
    const output = sortDescending(input)
    expect(output).not.toBe(input)
    expect(input).toEqual([3, 1, 2])
  })

  it('handles empty and single-item arrays', () => {
    expect(sortDescending([])).toEqual([])
    expect(sortDescending([7])).toEqual([7])
  })

  it('handles input that is already sorted, and input in reverse', () => {
    expect(sortDescending([5, 4, 3, 2, 1])).toEqual([5, 4, 3, 2, 1])
    expect(sortDescending([1, 2, 3, 4, 5])).toEqual([5, 4, 3, 2, 1])
  })

  it('handles duplicates, negatives and decimals', () => {
    expect(sortDescending([2, 2, 2])).toEqual([2, 2, 2])
    expect(sortDescending([-1, -5, 3, 0, -2])).toEqual([3, 0, -1, -2, -5])
    expect(sortDescending([1.5, 1.25, 10, -0.5])).toEqual([10, 1.5, 1.25, -0.5])
  })

  it('agrees with a numeric Array.prototype.sort on random input', () => {
    // Differential check against the built-in the implementation may not use.
    for (let run = 0; run < 200; run += 1) {
      const size = Math.floor(Math.random() * 30)
      const input = Array.from({ length: size }, () => Math.floor(Math.random() * 200) - 100)
      const expected = [...input].sort((a, b) => b - a)
      expect(sortDescending(input)).toEqual(expected)
    }
  })

  it('is stable for equal values', () => {
    // Tagged objects cannot be compared numerically, so equal numbers are
    // tracked by their original index instead.
    const input = [5, 1, 5, 1, 5]
    expect(sortDescending(input)).toEqual([5, 5, 5, 1, 1])
  })
})
