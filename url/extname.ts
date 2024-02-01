// Copyright 2018-2024 the Deno authors. All rights reserved. MIT license.
// This module is browser compatible.

import { extname as posixExtname } from "@std/path/posix/extname";
import { strip } from "./_strip.ts";

/**
 * Return the extension of the `URL` with leading period. The extension is
 * sourced from the path portion of the `URL`.  If there is no extension,
 * an empty string is returned.
 *
 * @example
 * ```ts
 * import { extname } from "@std/url/extname";
 *
 * console.log(extname("https://deno.land/std/path/mod.ts")); // ".ts"
 * console.log(extname("https://deno.land/std/path/mod")); // ""
 * console.log(extname("https://deno.land/std/path/mod.ts?a=b")); // ".ts"
 * console.log(extname("https://deno.land/")); // ""
 * ```
 *
 * @param url with extension
 * @returns extension (e.g. for url ending with `index.html` returns `.html`)
 */
export function extname(url: string | URL): string {
  url = new URL(url);
  strip(url);
  return posixExtname(url.pathname);
}
