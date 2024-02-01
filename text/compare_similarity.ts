// Copyright 2018-2024 the Deno authors. All rights reserved. MIT license.
import { levenshteinDistance } from "./levenshtein_distance.ts";

// NOTE: this metric may change in future versions (e.g. better than levenshteinDistance)
const getWordDistance = levenshteinDistance;

/**
 * Sort based on word similarity
 *
 * @example
 * ```ts
 * import { compareSimilarity } from "@std/text/compare_similarity";
 * const words = ["hi", "hello", "help"];
 *
 * // words most-similar to "hep" will be at the front
 * words.sort(compareSimilarity("hep"));
 * ```
 * @note
 * the ordering of words may change with version-updates
 * e.g. word-distance metric may change (improve)
 * use a named-distance (e.g. levenshteinDistance) to
 * guarantee a particular ordering
 */
export function compareSimilarity(
  givenWord: string,
  options?: { caseSensitive?: boolean },
): (a: string, b: string) => number {
  const { caseSensitive } = { ...options };
  if (caseSensitive) {
    return (a: string, b: string) =>
      getWordDistance(givenWord, a) - getWordDistance(givenWord, b);
  }
  givenWord = givenWord.toLowerCase();
  return (a: string, b: string) =>
    getWordDistance(givenWord, a.toLowerCase()) -
    getWordDistance(givenWord, b.toLowerCase());
}
