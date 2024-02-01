// Copyright 2018-2024 the Deno authors. All rights reserved. MIT license.

// This file is copied from `std/assert`.

import { AssertionError } from "@std/assert/assertion_error";
import { red } from "@std/fmt/colors";
import { CAN_NOT_DISPLAY } from "./_constants.ts";
import { buildMessage, diff, diffstr } from "./_diff.ts";
import { equal } from "./_equal.ts";
import { format } from "./_format.ts";
import { AssertEqualsOptions } from "./_types.ts";

/**
 * Make an assertion that `actual` and `expected` are equal, deeply. If not
 * deeply equal, then throw.
 *
 * Type parameter can be specified to ensure values under comparison have the
 * same type.
 *
 * @example
 * ```ts
 * import { assertEquals } from "@std/assert/assert_equals";
 *
 * assertEquals("world", "world"); // Doesn't throw
 * assertEquals("hello", "world"); // Throws
 * ```
 *
 * Note: formatter option is experimental and may be removed in the future.
 */
export function assertEquals<T>(
  actual: T,
  expected: T,
  options: AssertEqualsOptions = {},
) {
  const { formatter = format, msg, strictCheck } = options;

  if (equal(actual, expected, strictCheck)) {
    return;
  }
  const msgSuffix = msg ? `: ${msg}` : ".";
  let message = `Values are not equal${msgSuffix}`;

  const actualString = formatter(actual);
  const expectedString = formatter(expected);
  try {
    const stringDiff = (typeof actual === "string") &&
      (typeof expected === "string");
    const diffResult = stringDiff
      ? diffstr(actual as string, expected as string)
      : diff(actualString.split("\n"), expectedString.split("\n"));
    const diffMsg = buildMessage(diffResult, { stringDiff }).join("\n");
    message = `${message}\n${diffMsg}`;
  } catch {
    message = `${message}\n${red(CAN_NOT_DISPLAY)} + \n\n`;
  }
  throw new AssertionError(message);
}
