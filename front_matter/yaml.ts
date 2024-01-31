// Copyright 2018-2024 the Deno authors. All rights reserved. MIT license.

import { createExtractor, type Extractor, Parser } from "./create_extractor.ts";
import { parse } from "@std/yaml/parse";

export const extract: Extractor = createExtractor({
  ["yaml"]: parse as Parser,
});
