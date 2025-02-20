import { register } from "node:module";
import { throwError } from "./lib/utils.ts";
import { join } from "./lib/path.ts";

const BUSTER_PATH = process.env["BUSTER_PATH"] ?? throwError("BUSTER_PATH was not defined.");

// TODO: Starting in Node 24 we can just call registerHooks here and spare loading a seperate file.
register(join([BUSTER_PATH, "src", "node-hooks.ts"]), import.meta.url);
