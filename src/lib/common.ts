import { throwError } from "./utils.ts";

export function getNodeModulesPath(): string {
  return process.env.BUSTER_NODE_MODULES_PATH ?? throwError("BUSTER_NODE_MODULES_PATH was not defined.");
}
