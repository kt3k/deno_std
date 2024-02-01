// Copyright 2018-2024 the Deno authors. All rights reserved. MIT license.
import { assertEquals } from "@std/assert";
import {
  getLevelByName,
  getLevelName,
  LogLevel,
  LogLevelNames,
  LogLevels,
} from "./levels.ts";
import { BaseHandler } from "./base_handler.ts";
import { LogRecord } from "./logger.ts";

class TestHandler extends BaseHandler {
  public messages: string[] = [];

  public override log(str: string) {
    this.messages.push(str);
  }
}

Deno.test("simpleHandler", function () {
  const cases = new Map<LogLevel, string[]>([
    [
      LogLevels.DEBUG,
      [
        "DEBUG debug-test",
        "INFO info-test",
        "WARNING warning-test",
        "ERROR error-test",
        "CRITICAL critical-test",
      ],
    ],
    [
      LogLevels.INFO,
      [
        "INFO info-test",
        "WARNING warning-test",
        "ERROR error-test",
        "CRITICAL critical-test",
      ],
    ],
    [
      LogLevels.WARNING,
      ["WARNING warning-test", "ERROR error-test", "CRITICAL critical-test"],
    ],
    [LogLevels.ERROR, ["ERROR error-test", "CRITICAL critical-test"]],
    [LogLevels.CRITICAL, ["CRITICAL critical-test"]],
  ]);

  for (const [testCase, messages] of cases.entries()) {
    const testLevel = getLevelName(testCase);
    const handler = new TestHandler(testLevel);

    for (const levelName of LogLevelNames) {
      const level = getLevelByName(levelName);
      handler.handle(
        new LogRecord({
          msg: `${levelName.toLowerCase()}-test`,
          args: [],
          level: level,
          loggerName: "default",
        }),
      );
    }

    assertEquals(handler.level, testCase);
    assertEquals(handler.levelName, testLevel);
    assertEquals(handler.messages, messages);
  }
});

Deno.test("testFormatterWithEmptyMsg", function () {
  const handler = new TestHandler("DEBUG", {
    formatter: ({ levelName, msg }) => `test ${levelName} ${msg}`,
  });

  handler.handle(
    new LogRecord({
      msg: "",
      args: [],
      level: LogLevels.DEBUG,
      loggerName: "default",
    }),
  );

  assertEquals(handler.messages, ["test DEBUG "]);
});

Deno.test("testFormatterAsFunction", function () {
  const handler = new TestHandler("DEBUG", {
    formatter: (logRecord): string =>
      `fn formatter ${logRecord.levelName} ${logRecord.msg}`,
  });

  handler.handle(
    new LogRecord({
      msg: "Hello, world!",
      args: [],
      level: LogLevels.ERROR,
      loggerName: "default",
    }),
  );

  assertEquals(handler.messages, ["fn formatter ERROR Hello, world!"]);
});
