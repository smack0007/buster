// ../../src/node-register.ts
import { register } from "node:module";

// ../../src/lib/utils.ts
function throwError(message) {
  throw new Error(message);
}

// ../../src/node-register.ts
var NODE_HOOKS_PATH = process.env["BUSTER_NODE_HOOKS_PATH"] ?? throwError("BUSTER_NODE_HOOKS_PATH was not defined.");
register(NODE_HOOKS_PATH, import.meta.url);
