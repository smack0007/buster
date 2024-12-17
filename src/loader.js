import { register } from "node:module";
import { join } from "node:path";

register("./register.js", import.meta.url);

// const BUSTER_NODE_MODULES_PATH = process.env.BUSTER_NODE_MODULES_PATH;

// if (BUSTER_NODE_MODULES_PATH === undefined) {
//   throw new Error("BUSTER_NODE_MODULES_PATH was not defined.");
// }

// await import(join(BUSTER_NODE_MODULES_PATH, "tsx", "dist", "loader.mjs"));
