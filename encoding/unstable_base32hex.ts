// Copyright 2018-2025 the Deno authors. MIT license.
// Copyright (c) 2014 Jameson Little. MIT License.
// This module is browser compatible.

/**
 * Utilities for
 * {@link https://www.rfc-editor.org/rfc/rfc4648.html#section-7 | base32hex}
 * encoding and decoding.
 *
 * Modified from {@link [base32]}.
 *
 * This module is browser compatible.
 *
 * ```ts
 * import { encodeBase32Hex, decodeBase32Hex } from "@std/encoding/unstable-base32hex";
 * import { assertEquals } from "@std/assert";
 *
 * assertEquals(encodeBase32Hex("foobar"), "CPNMUOJ1E8======");
 *
 * assertEquals(
 *   decodeBase32Hex("CPNMUOJ1E8======"),
 *   new TextEncoder().encode("foobar")
 * );
 * ```
 *
 * @experimental **UNSTABLE**: New API, yet to be vetted.
 *
 * @module
 */
import { decode, encode } from "./_base32_common.ts";
import type { Uint8Array_ } from "./_types.ts";
export type { Uint8Array_ };

const lookup: string[] = "0123456789ABCDEFGHIJKLMNOPQRSTUV".split("");
const revLookup: number[] = [];
lookup.forEach((c, i) => revLookup[c.charCodeAt(0)] = i);

/**
 * Decodes a base32hex-encoded string.
 *
 * @experimental **UNSTABLE**: New API, yet to be vetted.
 *
 * @see {@link https://www.rfc-editor.org/rfc/rfc4648.html#section-7}
 *
 * @param b32 The base32hex-encoded string to decode.
 * @returns The decoded data.
 *
 * @example Usage
 * ```ts
 * import { decodeBase32Hex } from "@std/encoding/unstable-base32hex";
 * import { assertEquals } from "@std/assert";
 *
 * assertEquals(
 *   decodeBase32Hex("6PHJCC3360======"),
 *   new TextEncoder().encode("6c60c0"),
 * );
 * ```
 */
export function decodeBase32Hex(b32: string): Uint8Array_ {
  return decode(b32, lookup);
}

/**
 * Converts data into a base32hex-encoded string.
 *
 * @experimental **UNSTABLE**: New API, yet to be vetted.
 *
 * @see {@link https://www.rfc-editor.org/rfc/rfc4648.html#section-7}
 *
 * @param data The data to encode.
 * @returns The base32hex-encoded string.
 *
 * @example Usage
 * ```ts
 * import { encodeBase32Hex } from "@std/encoding/unstable-base32hex";
 * import { assertEquals } from "@std/assert";
 *
 * assertEquals(encodeBase32Hex("6c60c0"), "6PHJCC3360======");
 * ```
 */
export function encodeBase32Hex(
  data: ArrayBuffer | Uint8Array | string,
): string {
  return encode(data, lookup);
}
