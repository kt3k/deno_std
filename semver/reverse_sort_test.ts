// Copyright Isaac Z. Schlueter and Contributors. All rights reserved. ISC license.
// Copyright 2018-2024 the Deno authors. All rights reserved. MIT license.
import { assertEquals } from "@std/assert";
import { reverseSort } from "./reverse_sort.ts";
import { parse } from "./parse.ts";

Deno.test("reverseSort()", function () {
  const list = ["1.2.3+1", "1.2.3+0", "1.2.3", "5.9.6", "0.1.2"];
  const rsorted = ["5.9.6", "1.2.3+1", "1.2.3+0", "1.2.3", "0.1.2"];
  assertEquals(
    reverseSort(list.map((v) => parse(v))),
    rsorted.map((v) => parse(v)),
  );
});
