# Soal Test 1 — JavaScript function challenges

Three standalone functions, written in TypeScript and covered by unit tests.
Self-contained: nothing here is imported by the landing page, and no file
outside this folder was changed.

| Problem | Implementation | Tests |
| --- | --- | --- |
| 1. Sort descending, by hand | [`sort-descending.ts`](sort-descending.ts) | [`sort-descending.test.ts`](sort-descending.test.ts) |
| 2. Max sum of a fixed-length subarray | [`max-subarray-sum.ts`](max-subarray-sum.ts) | [`max-subarray-sum.test.ts`](max-subarray-sum.test.ts) |
| 3. Sum even numbers in nested objects | [`sum-even-nested.ts`](sum-even-nested.ts) | [`sum-even-nested.test.ts`](sum-even-nested.test.ts) |

## Running the tests

They run with the project's existing Vitest setup:

```bash
npm test -- src/challenges
```

Or the whole suite with `npm test`.

---

## 1. `sortDescending(numbers)`

`[1, 2, 4, 3, 5, 3, 2, 1]` → `[5, 4, 3, 3, 2, 2, 1, 1]`

**Insertion sort**, not the bubble sort the brief's own solution uses. Same
O(n²) worst case, but it makes a single pass over already-ordered input, shifts
elements instead of repeatedly swapping them, and is stable — equal values keep
their original relative order.

No built-in helpers: no `sort`, `reverse`, `push`, `splice` or `concat`. The
input array is copied by index and never mutated. **A test asserts this by
reading the module's own source** and checking those calls are absent — the
constraint is the entire point of the exercise, so it is verified rather than
trusted.

A second test compares the output against `[...input].sort((a, b) => b - a)`
across 200 random arrays, using the built-in as a reference oracle in the test
where it is not allowed in the implementation.

## 2. `maxSubarraySum(numbers, length)`

| Input | Result |
| --- | --- |
| `([100, 200, 300, 400], 2)` | `700` |
| `([1, 4, 2, 10, 23, 3, 1, 0, 20], 4)` | `39` |
| `([-3, 4, 0, -2, 6, -1], 2)` | `5` |

**Sliding window**, O(n) with one pass and no extra allocation: the first window
is summed, then each step adds the value entering and subtracts the one leaving.
A nested-loop version would be O(n·k) for no benefit.

The running maximum is seeded with the **first window, not `0`**. Seeding with
zero is the usual bug here — it silently returns `0` for all-negative input
instead of the least-negative window. There is a test for exactly that.

Invalid input throws `RangeError`: a `length` that is not a positive integer, or
one longer than the array. Neither has a meaningful answer, and returning `0` or
`-Infinity` would hide the mistake at the call site.

Correctness is also checked against a brute-force reference over 300 random
array/length combinations.

## 3. `sumEvenNumbers(value)`

Recursively totals every even number, at any depth, through both objects and
arrays.

The brief leaves several cases open, so the choices are:

- **Strings and booleans are ignored** via `typeof value === 'number'`. This is
  the crux of the problem: `true % 2 === 0` is `false`, but `Number(true) % 2`
  is `1` and `Number(false) % 2` is `0`, so coercing values would make `true`
  count as odd and `false` count as even. A test covers `'4'` and `'2'` too,
  which would be picked up by any implementation that coerces.
- **Non-integers are neither even nor odd**, so `2.5` contributes nothing.
  `Number.isInteger` also filters out `NaN` and `Infinity`, which would
  otherwise turn the whole total into `NaN`.
- **`null` is skipped explicitly**, because `typeof null === 'object'`.
- **Negative evens count** — `-4` is even, and the task is a sum, not a count.
- **Arrays are traversed** as well as plain objects.

### Cycle handling

Recursion guards against infinite descent by tracking **the objects on the
current path**, not every object it has seen. The distinction is deliberate: a
single visited-set would also collapse two separate properties that happen to
reference the same object, understating the sum. Path tracking stops a cycle
while still counting a shared reference once per place it appears.

```ts
const shared = { value: 10 }
sumEvenNumbers({ first: shared, second: shared }) // 20, not 10
```

### A note on the fixtures

The brief states two nested fixtures totalling **6** and **12** but does not
show their shape, and the source paste did not return the object literals
verbatim. The test file uses reconstructions that hit those totals and exercise
the traits the brief does describe — arbitrary depth, with strings and booleans
mixed in among the numbers. They are labelled as reconstructions in the test.
