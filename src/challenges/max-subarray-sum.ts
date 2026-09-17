/**
 * Soal 2 — largest sum of a contiguous subarray of exactly `length` items.
 *
 * Sliding window, so it is O(n) with one pass and no extra allocation: the
 * first window is summed, then each step adds the entering value and removes
 * the leaving one.
 *
 * The running best is seeded with the first window rather than 0. Seeding with
 * 0 is the usual bug here — it silently returns 0 for all-negative input
 * instead of the least-negative window.
 *
 * @throws RangeError when `length` is not a positive integer, or is longer
 * than the array. There is no meaningful answer in either case, and returning
 * 0 or -Infinity would hide the mistake at the call site.
 */
export function maxSubarraySum(numbers: readonly number[], length: number): number {
  if (!Number.isInteger(length) || length <= 0) {
    throw new RangeError(`length must be a positive integer, received ${length}`)
  }

  if (length > numbers.length) {
    throw new RangeError(
      `length ${length} exceeds the array size ${numbers.length}`,
    )
  }

  let windowSum = 0
  for (let i = 0; i < length; i += 1) {
    windowSum += numbers[i]
  }

  let best = windowSum
  for (let i = length; i < numbers.length; i += 1) {
    windowSum += numbers[i] - numbers[i - length]
    if (windowSum > best) {
      best = windowSum
    }
  }

  return best
}
