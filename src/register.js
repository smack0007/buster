import { join } from "node:path";
import { register } from "node:module";

const BUSTER_PATH = process.env.BUSTER_PATH;

if (BUSTER_PATH === undefined) {
  throw new Error("BUSTER_PATH was not defined.");
}

register(join(BUSTER_PATH, "src", "loader.js"));
