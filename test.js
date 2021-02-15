import { createRequire } from "./node/module.ts";
const require = createRequire(import.meta.url);
require("chalk");
require("crypto");
//await import("https://raw.githubusercontent.com/webcarrot/proto-polyfill/1.7.0/index.js")
await import("./proto-polyfill.js");
//console.log(require('events'));
//console.log(require('events').EventEmitter);
try {
  require("tailwindcss/lib/cli.js");
} catch (e) {
  console.log(e);
  console.log(e.stack);
}
