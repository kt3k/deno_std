// Copyright 2018-2024 the Deno authors. All rights reserved. MIT license.
import { assertEquals } from "@std/assert/assert_equals";
import { warnOnDeprecatedApi } from "./warn_on_deprecated_api.ts";

Deno.test("warnDeprecatedApi()", async () => {
  const command = new Deno.Command(Deno.execPath(), {
    args: ["run", "--quiet", "--no-lock", import.meta.url],
    stderr: "inherit",
  });
  const { success, stdout } = await command.output();
  const output = new TextDecoder().decode(stdout);

  assertEquals(success, true);
  assertEquals(
    output,
    `Warning
├ Use of deprecated "fn()" API.
│
├ This API will be removed in version 1.0.0 of the Deno Standard Library.
│
├ Suggestion: Do something else instead.
│
└ Stack trace:
  ├─ at fn (${import.meta.url}:37:12)
  └─ at ${import.meta.url}:45:31

Hello, world!
Hello, world!
END
`,
  );
});

function fn() {
  warnOnDeprecatedApi({
    apiName: "fn()",
    stack: new Error().stack!,
    removalVersion: "1.0.0",
    suggestion: "Do something else instead.",
  });
  console.log("Hello, world!");
}

if (import.meta.main) {
  for (let i = 0; i < 2; i++) fn();
  console.log("END");
}
