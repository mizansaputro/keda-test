import { describe, expect, it } from 'vitest'
import { maxSubarraySum } from './max-subarray-sum'

/** Straightforward O(n*k) reference, used to cross-check the sliding window. */
function bruteForce(numbers: readonly number[], length: number): number {
  let best = Number.NEGATIVE_INFINITY
  for (let start = 0; start + length <= numbers.length; start += 1) {
    let sum = 0
    for (let i = start; i < start + length; i += 1) sum += numbers[i]
    if (sum > best) best = sum
  }
  return best
}

describe('maxSubarraySum', () => {
  it.each([
    { numbers: [100, 200, 300, 400], length: 2, expected: 700 },
    { numbers: [1, 4, 2, 10, 23, 3, 1, 0, 20], length: 4, expected: 39 },
    { numbers: [-3, 4, 0, -2, 6, -1], length: 2, expected: 5 },
  ])('returns $expected for $numbers with length $length', ({ numbers, length, expected }) => {
    expect(maxSubarraySum(numbers, length)).toBe(expected)
  })

  it('handles a window of one, which is just the maximum value', () => {
    expect(maxSubarraySum([3, 9, 2], 1)).toBe(9)
    expect(maxSubarraySum([-5, -2, -9], 1)).toBe(-2)
  })

  it('handles a window covering the whole array', () => {
    expect(maxSubarraySum([1, 2, 3], 3)).toBe(6)
  })

  it('returns the least-negative window for all-negative input', () => {
    // Seeding the running best with 0 instead of the first window is the
    // classic bug here; it would wrongly return 0.
    expect(maxSubarraySum([-8, -3, -6, -2, -5], 2)).toBe(-7)
    expect(maxSubarraySum([-1, -1, -1], 3)).toBe(-3)
  })

  it('finds a maximum that sits at the start or the end', () => {
    expect(maxSubarraySum([9, 9, 1, 1, 1], 2)).toBe(18)
    expect(maxSubarraySum([1, 1, 1, 9, 9], 2)).toBe(18)
  })

  it('does not mutate the input', () => {
    const input = [4, 5, 6]
    maxSubarraySum(input, 2)
    expect(input).toEqual([4, 5, 6])
  })

  it.each([0, -1, 1.5, Number.NaN])('rejects an invalid length of %s', (length) => {
    expect(() => maxSubarraySum([1, 2, 3], length)).toThrow(RangeError)
  })

  it('rejects a window longer than the array', () => {
    expect(() => maxSubarraySum([1, 2], 3)).toThrow(RangeError)
    expect(() => maxSubarraySum([], 1)).toThrow(RangeError)
  })

  it('agrees with a brute-force reference on random input', () => {
    for (let run = 0; run < 300; run += 1) {
      const size = 1 + Math.floor(Math.random() * 25)
      const numbers = Array.from({ length: size }, () => Math.floor(Math.random() * 60) - 30)
      const length = 1 + Math.floor(Math.random() * size)
      expect(maxSubarraySum(numbers, length)).toBe(bruteForce(numbers, length))
    }
  })
})
