// Copyright 2018-2024 the Deno authors. All rights reserved. MIT license.

import { createExtractor, type Extractor, Parser } from "./create_extractor.ts";
import { parse } from "@std/toml/parse";

export const extract: Extractor = createExtractor({
  ["toml"]: parse as Parser,
});
