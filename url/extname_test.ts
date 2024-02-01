// Copyright 2018-2024 the Deno authors. All rights reserved. MIT license.

import { assertEquals } from "@std/assert";
import * as url from "./mod.ts";

const TESTSUITE = [
  ["https://deno.land/std/assert/mod.ts", ".ts"],
  [new URL("https://deno.land/std/assert/mod.ts"), ".ts"],
  [new URL("https://deno.land/std/assert/mod.ts?foo=bar"), ".ts"],
  [new URL("https://deno.land/std/assert/mod.ts#header"), ".ts"],
  [new URL("https://deno.land/std/assert/mod."), "."],
  [new URL("https://deno.land/std/assert/mod"), ""],
] as const;

Deno.test("extname()", function () {
  for (const [test_url, expected] of TESTSUITE) {
    assertEquals(url.extname(test_url), expected);
  }
});
