// Copyright 2018-2024 the Deno authors. All rights reserved. MIT license.

import { assert } from "@std/assert";
import { endsWith } from "./ends_with.ts";

Deno.test("endsWith()", () => {
  const v = endsWith(new Uint8Array([0, 1, 2]), new Uint8Array([1, 2]));
  const v2 = endsWith(new Uint8Array([0, 1, 2]), new Uint8Array([0, 1]));
  const v3 = endsWith(new Uint8Array([0, 1, 2]), new Uint8Array([0, 1, 2, 3]));
  assert(v);
  assert(!v2);
  assert(!v3);
});
