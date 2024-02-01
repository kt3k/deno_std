// Copyright 2018-2024 the Deno authors. All rights reserved. MIT license.

import { MAP_FORMAT_TO_EXTRACTOR_RX } from "./_formats.ts";

type Format = "yaml" | "toml" | "json" | "unknown";

/**
 * Tests if a string has valid front matter. Supports YAML, TOML and JSON.
 *
 * @param str String to test.
 * @param formats A list of formats to test for. Defaults to all supported formats.
 *
 * ```ts
 * import { test } from "@std/front_matter";
 * import { assert } from "@std/assert/assert";
 *
 * assert(test("---\ntitle: Three dashes marks the spot\n---\n"));
 * assert(test("---toml\ntitle = 'Three dashes followed by format marks the spot'\n---\n"));
 * assert(test("---json\n{\"title\": \"Three dashes followed by format marks the spot\"}\n---\n"));
 *
 * assert(!test("---json\n{\"title\": \"Three dashes followed by format marks the spot\"}\n---\n", ["yaml"]));
 * ```
 */
export function test(
  str: string,
  formats?: ("yaml" | "toml" | "json" | "unknown")[],
): boolean {
  if (!formats) {
    formats = Object.keys(MAP_FORMAT_TO_EXTRACTOR_RX) as Format[];
  }

  for (const format of formats) {
    if (format === "unknown") {
      throw new TypeError("Unable to test for unknown front matter format");
    }

    const match = MAP_FORMAT_TO_EXTRACTOR_RX[format].exec(str);
    if (match?.index === 0) {
      return true;
    }
  }

  return false;
}
