/**
 * Soal 3 — sum every even number found anywhere inside a nested object.
 *
 * Decisions worth stating, since the brief leaves them open:
 *
 * - Values are matched with `typeof value === 'number'`. That excludes strings
 *   and booleans for free, which is the point: `true % 2 === 0` is false but
 *   `Number(true) % 2` is not, so coercing would have made `true` count as odd
 *   and `false` count as even.
 * - `Number.isInteger` gates the parity test, so `2.5` is neither even nor odd,
 *   and `NaN` / `Infinity` are ignored rather than poisoning the total.
 * - Arrays are traversed as well as plain objects — a nested structure usually
 *   has both.
 * - `null` is skipped explicitly, because `typeof null === 'object'`.
 * - Negative even numbers count: -4 is even, and the brief asks for a sum, not
 *   a count.
 */
export function sumEvenNumbers(value: unknown): number {
  return sumEvenIn(value, new Set<object>())
}

/**
 * `ancestors` holds only the objects on the current path, not every object
 * seen. That distinction matters: a single visited-set would also collapse two
 * separate properties that happen to point at the same object, understating
 * the sum. Tracking the path stops infinite recursion on a cycle while still
 * counting a shared reference once per place it appears.
 */
function sumEvenIn(value: unknown, ancestors: Set<object>): number {
  if (typeof value === 'number') {
    return Number.isInteger(value) && value % 2 === 0 ? value : 0
  }

  if (value === null || typeof value !== 'object') {
    return 0
  }

  // Reached an object that encloses this one: a cycle. Stop, or recurse forever.
  if (ancestors.has(value)) {
    return 0
  }

  ancestors.add(value)

  let total = 0
  const children = Array.isArray(value) ? value : Object.values(value)
  for (const child of children) {
    total += sumEvenIn(child, ancestors)
  }

  // Leaving this branch, so the object no longer encloses anything.
  ancestors.delete(value)

  return total
}
