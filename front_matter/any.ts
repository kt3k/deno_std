// Copyright 2018-2024 the Deno authors. All rights reserved. MIT license.

import { createExtractor, type Extractor, Parser } from "./create_extractor.ts";
import { parse as parseYAML } from "@std/yaml/parse";
import { parse as parseTOML } from "@std/toml/parse";

export const extract: Extractor = createExtractor({
  yaml: parseYAML as Parser,
  toml: parseTOML as Parser,
  json: JSON.parse as Parser,
});
