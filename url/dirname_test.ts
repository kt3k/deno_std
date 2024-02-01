// Copyright 2018-2024 the Deno authors. All rights reserved. MIT license.

import { assertEquals } from "@std/assert";
import * as url from "./mod.ts";

const TESTSUITE = [
  [
    "https://deno.land/std/assert/mod.ts",
    new URL("https://deno.land/std/assert"),
  ],
  [
    new URL("https://deno.land/std/assert/mod.ts"),
    new URL("https://deno.land/std/assert"),
  ],
  [
    new URL("https://deno.land/std/assert/mod.ts?foo=bar"),
    new URL("https://deno.land/std/assert"),
  ],
  [
    new URL("https://deno.land/std/assert/mod.ts#header"),
    new URL("https://deno.land/std/assert"),
  ],
  [
    new URL("https://deno.land///"),
    new URL("https://deno.land"),
  ],
] as const;

Deno.test("dirname()", function () {
  for (const [test_url, expected] of TESTSUITE) {
    assertEquals(url.dirname(test_url), expected);
  }
});
