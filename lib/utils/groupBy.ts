// A type-safe implementation of lodash's `groupBy` in TypeScript

/**
 * Group elements of an array by a function or property name, returning a record
 * whose keys are the grouping criteria and values are arrays of items.
 */
export function groupBy<T>(
  collection: T[],
  iteratee: keyof T,
): Record<string, T[]>

export function groupBy<T>(
  collection: T[],
  iteratee: (item: T) => PropertyKey,
): Record<string, T[]>

export function groupBy<T>(
  collection: T[],
  iteratee: ((item: T) => PropertyKey) | keyof T,
): Record<string, T[]> {
  const result: Record<string, T[]> = {}

  // Determine if iteratee is a property key or a function
  const isKey = (val: any): val is keyof T =>
    typeof val === "string" ||
    typeof val === "number" ||
    typeof val === "symbol"

  for (const item of collection) {
    // Compute key
    const rawKey: PropertyKey = isKey(iteratee)
      ? (item[iteratee] as PropertyKey)
      : (iteratee as (item: T) => PropertyKey)(item)

    const key = String(rawKey)

    // Initialize the group if needed
    if (!Object.prototype.hasOwnProperty.call(result, key)) {
      result[key] = []
    }

    // Add the item to the group
    result[key]!.push(item)
  }

  return result
}
