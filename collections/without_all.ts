// Copyright 2018-2024 the Deno authors. All rights reserved. MIT license.
// This module is browser compatible.

/**
 * Returns an array excluding all given values.
 *
 * @example
 * ```ts
 * import { withoutAll } from "@std/collections/without_all";
 * import { assertEquals } from "@std/assert/assert_equals";
 *
 * const withoutList = withoutAll([2, 1, 2, 3], [1, 2]);
 *
 * assertEquals(withoutList, [3]);
 * ```
 */
export function withoutAll<T>(array: readonly T[], values: readonly T[]): T[] {
  const toExclude = new Set(values);
  return array.filter((it) => !toExclude.has(it));
}
