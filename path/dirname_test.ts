// Copyright 2018-2024 the Deno authors. All rights reserved. MIT license.
// Copyright the Browserify authors. MIT License.
// Ported from https://github.com/browserify/path-browserify/
import { assertEquals } from "@std/assert";
import { dirname } from "./dirname.ts";
import * as posix from "./posix/mod.ts";
import * as windows from "./windows/mod.ts";

// Test suite from "GNU core utilities"
// https://github.com/coreutils/coreutils/blob/master/tests/misc/dirname.pl
const COREUTILS_TESTSUITE = [
  ["d/f", "d"],
  ["/d/f", "/d"],
  ["d/f/", "d"],
  ["d/f//", "d"],
  ["f", "."],
  ["/", "/"],
  ["//", "/"],
  ["///", "/"],
  ["//a//", "/"],
  ["///a///", "/"],
  ["///a///b", "///a"],
  ["///a//b/", "///a"],
  ["", "."],
];

const POSIX_TESTSUITE = [
  ["/a/b/", "/a"],
  ["/a/b", "/a"],
  ["/a", "/"],
  ["", "."],
  ["/", "/"],
  ["////", "/"],
  ["//a", "/"],
  ["foo", "."],
];

const WINDOWS_TESTSUITE = [
  ["c:\\", "c:\\"],
  ["c:\\foo", "c:\\"],
  ["c:\\foo\\", "c:\\"],
  ["c:\\foo\\bar", "c:\\foo"],
  ["c:\\foo\\bar\\", "c:\\foo"],
  ["c:\\foo\\bar\\baz", "c:\\foo\\bar"],
  ["\\", "\\"],
  ["\\foo", "\\"],
  ["\\foo\\", "\\"],
  ["\\foo\\bar", "\\foo"],
  ["\\foo\\bar\\", "\\foo"],
  ["\\foo\\bar\\baz", "\\foo\\bar"],
  ["c:", "c:"],
  ["c:foo", "c:"],
  ["c:foo\\", "c:"],
  ["c:foo\\bar", "c:foo"],
  ["c:foo\\bar\\", "c:foo"],
  ["c:foo\\bar\\baz", "c:foo\\bar"],
  ["file:stream", "."],
  ["dir\\file:stream", "dir"],
  ["\\\\unc\\share", "\\\\unc\\share"],
  ["\\\\unc\\share\\foo", "\\\\unc\\share\\"],
  ["\\\\unc\\share\\foo\\", "\\\\unc\\share\\"],
  ["\\\\unc\\share\\foo\\bar", "\\\\unc\\share\\foo"],
  ["\\\\unc\\share\\foo\\bar\\", "\\\\unc\\share\\foo"],
  ["\\\\unc\\share\\foo\\bar\\baz", "\\\\unc\\share\\foo\\bar"],
  ["/a/b/", "/a"],
  ["/a/b", "/a"],
  ["/a", "/"],
  ["", "."],
  ["/", "/"],
  ["////", "/"],
  ["foo", "."],
];

Deno.test("posix.dirname()", function () {
  for (const [name, expected] of COREUTILS_TESTSUITE) {
    assertEquals(dirname(name), expected);
  }

  for (const [name, expected] of POSIX_TESTSUITE) {
    assertEquals(posix.dirname(name), expected);
  }

  // POSIX treats backslash as any other character.
  assertEquals(posix.dirname("\\foo/bar"), "\\foo");
  assertEquals(posix.dirname("\\/foo/bar"), "\\/foo");
  assertEquals(posix.dirname("/foo/bar\\baz/qux"), "/foo/bar\\baz");
  assertEquals(posix.dirname("/foo/bar/baz\\"), "/foo/bar");
});

Deno.test("windows.dirname()", function () {
  for (const [name, expected] of WINDOWS_TESTSUITE) {
    assertEquals(windows.dirname(name), expected);
  }

  // windows should pass all "forward slash" posix tests as well.
  for (const [name, expected] of COREUTILS_TESTSUITE) {
    assertEquals(windows.dirname(name), expected);
  }

  for (const [name, expected] of POSIX_TESTSUITE) {
    assertEquals(windows.dirname(name), expected);
  }
});
