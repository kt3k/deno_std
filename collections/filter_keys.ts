// Copyright 2018-2024 the Deno authors. All rights reserved. MIT license.
// This module is browser compatible.

/**
 * Returns a new record with all entries of the given record except the ones that
 * have a key that does not match the given predicate.
 *
 * @example
 * ```ts
 * import { filterKeys } from "@std/collections/filter_keys";
 * import { assertEquals } from "@std/assert/assert_equals";
 *
 * const menu = {
 *   "Salad": 11,
 *   "Soup": 8,
 *   "Pasta": 13,
 * };
 * const menuWithoutSalad = filterKeys(menu, (it) => it !== "Salad");
 *
 * assertEquals(
 *   menuWithoutSalad,
 *   {
 *     "Soup": 8,
 *     "Pasta": 13,
 *   },
 * );
 * ```
 */
export function filterKeys<T>(
  record: Readonly<Record<string, T>>,
  predicate: (key: string) => boolean,
): Record<string, T> {
  const ret: Record<string, T> = {};
  const keys = Object.keys(record);

  for (const key of keys) {
    if (predicate(key)) {
      ret[key] = record[key];
    }
  }

  return ret;
}
