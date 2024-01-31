// Copyright 2018-2024 the Deno authors. All rights reserved. MIT license.

import { expect } from "./expect.ts";
import { AssertionError, assertThrows } from "@std/assert";

Deno.test("expect().toBeNaN()", () => {
  expect(NaN).toBeNaN();

  expect(1).not.toBeNaN();

  assertThrows(() => {
    expect(1).toBeNaN();
  }, AssertionError);

  assertThrows(() => {
    expect(NaN).not.toBeNaN();
  }, AssertionError);
});
