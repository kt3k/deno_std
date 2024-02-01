// Copyright 2018-2024 the Deno authors. All rights reserved. MIT license.
// This module is browser compatible.

/**
 * Returns all distinct elements that appear in any of the given arrays.
 *
 * @example
 * ```ts
 * import { union } from "@std/collections/union";
 * import { assertEquals } from "@std/assert/assert_equals";
 *
 * const soupIngredients = ["Pepper", "Carrots", "Leek"];
 * const saladIngredients = ["Carrots", "Radicchio", "Pepper"];
 * const shoppingList = union(soupIngredients, saladIngredients);
 *
 * assertEquals(shoppingList, ["Pepper", "Carrots", "Leek", "Radicchio"]);
 * ```
 */
export function union<T>(...arrays: Iterable<T>[]): T[] {
  const set = new Set<T>();

  for (const array of arrays) {
    for (const element of array) {
      set.add(element);
    }
  }

  return Array.from(set);
}
