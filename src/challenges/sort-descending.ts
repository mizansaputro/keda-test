/**
 * Soal 1 — sort an array of numbers from largest to smallest, by hand.
 *
 * "tanpa fungsi bawaan javascript": no `Array.prototype.sort`, `reverse`,
 * `push` or similar. Elements are copied and placed by index only.
 *
 * Insertion sort rather than bubble sort: same O(n^2) worst case, but it makes
 * one pass over already-ordered input, shifts instead of repeatedly swapping,
 * and is stable — equal values keep their original relative order.
 *
 * The input is never mutated; a new array is returned.
 */
export function sortDescending(numbers: readonly number[]): number[] {
  const result: number[] = []
  for (let i = 0; i < numbers.length; i += 1) {
    result[i] = numbers[i]
  }

  for (let i = 1; i < result.length; i += 1) {
    const current = result[i]
    let j = i - 1

    // Shift anything smaller than `current` one slot to the right, opening a
    // gap for it. Strict `<` is what keeps the sort stable.
    while (j >= 0 && result[j] < current) {
      result[j + 1] = result[j]
      j -= 1
    }

    result[j + 1] = current
  }

  return result
}
