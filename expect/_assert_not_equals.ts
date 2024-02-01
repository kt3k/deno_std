// Copyright 2018-2024 the Deno authors. All rights reserved. MIT license.

// This file is copied from `std/assert`.

import { AssertionError } from "@std/assert/assertion_error";
import { CAN_NOT_DISPLAY } from "./_constants.ts";
import { equal } from "./_equal.ts";
import { AssertEqualsOptions } from "./_types.ts";

type AssertNotEqualsOptions = Omit<AssertEqualsOptions, "formatter">;

/**
 * Make an assertion that `actual` and `expected` are not equal, deeply.
 * If not then throw.
 *
 * Type parameter can be specified to ensure values under comparison have the same type.
 *
 * @example
 * ```ts
 * import { assertNotEquals } from "@std/assert/assert_not_equals";
 *
 * assertNotEquals(1, 2); // Doesn't throw
 * assertNotEquals(1, 1); // Throws
 * ```
 */
export function assertNotEquals<T>(
  actual: T,
  expected: T,
  options: AssertNotEqualsOptions = {},
) {
  const { msg, strictCheck } = options;
  if (!equal(actual, expected, strictCheck)) {
    return;
  }
  let actualString: string;
  let expectedString: string;
  try {
    actualString = String(actual);
  } catch {
    actualString = CAN_NOT_DISPLAY;
  }
  try {
    expectedString = String(expected);
  } catch {
    expectedString = CAN_NOT_DISPLAY;
  }
  const msgSuffix = msg ? `: ${msg}` : ".";
  throw new AssertionError(
    `Expected actual: ${actualString} not to be: ${expectedString}${msgSuffix}`,
  );
}
