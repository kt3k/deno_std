// Copyright 2018-2024 the Deno authors. All rights reserved. MIT license.

import { expect } from "./expect.ts";
import { AssertionError, assertThrows } from "@std/assert";

Deno.test("expect().toBeLessThanOrEqual", () => {
  expect(10).toBeLessThanOrEqual(10);
  expect(9).toBeLessThanOrEqual(10);

  expect(11).not.toBeLessThanOrEqual(10);

  assertThrows(() => {
    expect(11).toBeLessThanOrEqual(10);
  }, AssertionError);

  assertThrows(() => {
    expect(10).not.toBeLessThanOrEqual(10);
  }, AssertionError);
  assertThrows(() => {
    expect(9).not.toBeLessThanOrEqual(10);
  }, AssertionError);
});
