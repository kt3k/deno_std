// Copyright 2018-2024 the Deno authors. All rights reserved. MIT license.
import { assert, assertEquals, assertExists } from "@std/assert";
import { resolve } from "@std/path";
import { Tar, type TarMeta } from "./tar.ts";
import {
  TarEntry,
  type TarHeader,
  TarMetaWithLinkName,
  Untar,
} from "./untar.ts";
import { Buffer } from "@std/io/buffer";
import { copy } from "@std/io/copy";
import { readAll } from "@std/io/read_all";
import { filePath, testdataDir } from "./_test_common.ts";

interface TestEntry {
  name: string;
  content?: Uint8Array;
  filePath?: string;
}

async function createTar(entries: TestEntry[]): Promise<Tar> {
  const tar = new Tar();
  // put data on memory
  for (const file of entries) {
    let options;

    if (file.content) {
      options = {
        reader: new Buffer(file.content),
        contentSize: file.content.byteLength,
      };
    } else {
      options = { filePath: file.filePath };
    }

    await tar.append(file.name, options);
  }

  return tar;
}

Deno.test("Untar() works as an async iterator", async () => {
  const entries: TestEntry[] = [
    {
      name: "output.txt",
      content: new TextEncoder().encode("hello tar world!"),
    },
    {
      name: "dir/tar.ts",
      filePath,
    },
  ];

  const tar = await createTar(entries);

  // read data from a tar archive
  const untar = new Untar(tar.getReader());

  let lastEntry;
  for await (const entry of untar) {
    const expected = entries.shift();
    assert(expected);

    let content = expected.content;
    if (expected.filePath) {
      content = await Deno.readFile(expected.filePath);
    }
    assertEquals(content, await readAll(entry));
    assertEquals(expected.name, entry.fileName);

    if (lastEntry) assert(lastEntry.consumed);
    lastEntry = entry;
  }
  assert(lastEntry);
  assert(lastEntry.consumed);
  assertEquals(entries.length, 0);
});

Deno.test("Untar() reads without body", async () => {
  const entries: TestEntry[] = [
    {
      name: "output.txt",
      content: new TextEncoder().encode("hello tar world!"),
    },
    {
      name: "dir/tar.ts",
      filePath,
    },
  ];

  const tar = await createTar(entries);

  // read data from a tar archive
  const untar = new Untar(tar.getReader());

  for await (const entry of untar) {
    const expected = entries.shift();
    assert(expected);
    assertEquals(expected.name, entry.fileName);
  }

  assertEquals(entries.length, 0);
});

Deno.test(
  "Untar() reads without body from FileReader",
  async () => {
    const entries: TestEntry[] = [
      {
        name: "output.txt",
        content: new TextEncoder().encode("hello tar world!"),
      },
      {
        name: "dir/tar.ts",
        filePath,
      },
    ];

    const outputFile = resolve(testdataDir, "test.tar");

    const tar = await createTar(entries);
    using file = await Deno.open(outputFile, { create: true, write: true });
    await copy(tar.getReader(), file);

    using reader = await Deno.open(outputFile, { read: true });
    // read data from a tar archive
    const untar = new Untar(reader);

    for await (const entry of untar) {
      const expected = entries.shift();
      assert(expected);
      assertEquals(expected.name, entry.fileName);
    }

    await Deno.remove(outputFile);
    assertEquals(entries.length, 0);
  },
);

Deno.test("Untar() reads from FileReader", async () => {
  const entries: TestEntry[] = [
    {
      name: "output.txt",
      content: new TextEncoder().encode("hello tar world!"),
    },
    {
      name: "dir/tar.ts",
      filePath,
    },
  ];

  const outputFile = resolve(testdataDir, "test.tar");

  const tar = await createTar(entries);
  using file = await Deno.open(outputFile, { create: true, write: true });
  await copy(tar.getReader(), file);

  using reader = await Deno.open(outputFile, { read: true });
  // read data from a tar archive
  const untar = new Untar(reader);

  for await (const entry of untar) {
    const expected = entries.shift();
    assert(expected);

    let content = expected.content;
    if (expected.filePath) {
      content = await Deno.readFile(expected.filePath);
    }

    assertEquals(content, await readAll(entry));
    assertEquals(expected.name, entry.fileName);
  }

  await Deno.remove(outputFile);
  assertEquals(entries.length, 0);
});

Deno.test(
  "Untar() reads less than record size",
  async () => {
    // record size is 512
    const bufSizes = [1, 53, 256, 511];

    for (const bufSize of bufSizes) {
      const entries: TestEntry[] = [
        {
          name: "output.txt",
          content: new TextEncoder().encode("hello tar world!".repeat(100)),
        },
        // Need to test at least two files, to make sure the first entry doesn't over-read
        // Causing the next to fail with: checksum error
        {
          name: "deni.txt",
          content: new TextEncoder().encode("deno!".repeat(250)),
        },
      ];

      const tar = await createTar(entries);

      // read data from a tar archive
      const untar = new Untar(tar.getReader());

      for await (const entry of untar) {
        const expected = entries.shift();
        assert(expected);
        assertEquals(expected.name, entry.fileName);

        const writer = new Buffer();
        while (true) {
          const buf = new Uint8Array(bufSize);
          const n = await entry.read(buf);
          if (n === null) break;

          await writer.write(buf.subarray(0, n));
        }
        assertEquals(writer.bytes(), expected!.content);
      }

      assertEquals(entries.length, 0);
    }
  },
);

Deno.test("Untar() works with Linux generated tar", async () => {
  const filePath = resolve(testdataDir, "deno.tar");
  using file = await Deno.open(filePath, { read: true });

  type ExpectedEntry = TarMeta & { content?: Uint8Array };

  const expectedEntries: ExpectedEntry[] = [
    {
      fileName: "archive/",
      fileSize: 0,
      fileMode: 509,
      mtime: 1591800767,
      uid: 1001,
      gid: 1001,
      owner: "deno",
      group: "deno",
      type: "directory",
    },
    {
      fileName: "archive/deno/",
      fileSize: 0,
      fileMode: 509,
      mtime: 1591799635,
      uid: 1001,
      gid: 1001,
      owner: "deno",
      group: "deno",
      type: "directory",
    },
    {
      fileName: "archive/deno/land/",
      fileSize: 0,
      fileMode: 509,
      mtime: 1591799660,
      uid: 1001,
      gid: 1001,
      owner: "deno",
      group: "deno",
      type: "directory",
    },
    {
      fileName: "archive/deno/land/land.txt",
      fileMode: 436,
      fileSize: 5,
      mtime: 1591799660,
      uid: 1001,
      gid: 1001,
      owner: "deno",
      group: "deno",
      type: "file",
      content: new TextEncoder().encode("land\n"),
    },
    {
      fileName: "archive/file.txt",
      fileMode: 436,
      fileSize: 5,
      mtime: 1591799626,
      uid: 1001,
      gid: 1001,
      owner: "deno",
      group: "deno",
      type: "file",
      content: new TextEncoder().encode("file\n"),
    },
    {
      fileName: "archive/deno.txt",
      fileMode: 436,
      fileSize: 5,
      mtime: 1591799642,
      uid: 1001,
      gid: 1001,
      owner: "deno",
      group: "deno",
      type: "file",
      content: new TextEncoder().encode("deno\n"),
    },
  ];

  const untar = new Untar(file);

  for await (const entry of untar) {
    const expected = expectedEntries.shift();
    assert(expected);
    const content = expected.content;
    delete expected.content;

    assertEquals({ ...entry }, expected);

    if (content) {
      assertEquals(content, await readAll(entry));
    }
  }
});

Deno.test({
  name: "TarEntry() handles meta",
  // only: true,
  fn() {
    // test TarEntry class
    assertExists(TarEntry);
    // Test TarEntry type
    const bufSizes = [1, 53, 256, 511];
    const header: TarHeader = {
      fileName: new Uint8Array(bufSizes),
      fileMode: new Uint8Array(bufSizes),
      uid: new Uint8Array(bufSizes),
      gid: new Uint8Array(bufSizes),
      fileSize: new Uint8Array(bufSizes),
      mtime: new Uint8Array(bufSizes),
      checksum: new Uint8Array(bufSizes),
      type: new Uint8Array(bufSizes),
      linkName: new Uint8Array(bufSizes),
      ustar: new Uint8Array(bufSizes),
      owner: new Uint8Array(bufSizes),
      group: new Uint8Array(bufSizes),
      majorNumber: new Uint8Array(bufSizes),
      minorNumber: new Uint8Array(bufSizes),
      fileNamePrefix: new Uint8Array(bufSizes),
      padding: new Uint8Array(bufSizes),
    };
    const content = new TextEncoder().encode("hello tar world!");
    const reader = new Buffer(content);
    const tarMeta = {
      fileName: "archive/",
      fileSize: 0,
      fileMode: 509,
      mtime: 1591800767,
      uid: 1001,
      gid: 1001,
      owner: "deno",
      group: "deno",
      type: "directory",
    };
    const tarEntry: TarEntry = new TarEntry(tarMeta, header, reader);
    assertExists(tarEntry);
  },
});

Deno.test("Untar() handles archive with link", async function () {
  const filePath = resolve(testdataDir, "with_link.tar");
  using file = await Deno.open(filePath, { read: true });

  type ExpectedEntry = TarMetaWithLinkName & { content?: Uint8Array };

  const expectedEntries: ExpectedEntry[] = [
    {
      fileName: "hello.txt",
      fileMode: 436,
      fileSize: 14,
      mtime: 1696384910,
      uid: 1000,
      gid: 1000,
      owner: "user",
      group: "user",
      type: "file",
      content: new TextEncoder().encode("Hello World!\n\n"),
    },
    {
      fileName: "link_to_hello.txt",
      linkName: "./hello.txt",
      fileMode: 511,
      fileSize: 0,
      mtime: 1696384945,
      uid: 1000,
      gid: 1000,
      owner: "user",
      group: "user",
      type: "symlink",
    },
  ];

  const untar = new Untar(file);

  for await (const entry of untar) {
    const expected = expectedEntries.shift();
    assert(expected);
    const content = expected.content;
    delete expected.content;

    assertEquals({ ...entry }, expected);

    if (content) {
      assertEquals(content, await readAll(entry));
    }
  }
});
