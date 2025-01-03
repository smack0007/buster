import { register } from "node:module";
import { throwError } from "./lib/utils.ts";

const NODE_HOOKS_PATH = process.env["BUSTER_NODE_HOOKS_PATH"] ?? throwError("BUSTER_NODE_HOOKS_PATH was not defined.");

register(NODE_HOOKS_PATH, import.meta.url);
