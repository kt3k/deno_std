// Copyright 2018-2024 the Deno authors. All rights reserved. MIT license.

import { assertEquals } from "@std/assert";
import { extensionsByType } from "./mod.ts";

Deno.test({
  name: "media_types - extensionsByType()",
  fn() {
    const fixtures: [string, string[] | undefined][] = [
      ["image/gif", ["gif"]],
      ["application/javascript", ["js", "mjs"]],
      ["text/html; charset=UTF-8", ["html", "htm", "shtml"]],
      ["application/foo", undefined],
    ];
    for (const [fixture, expected] of fixtures) {
      assertEquals(extensionsByType(fixture), expected);
    }
  },
});
