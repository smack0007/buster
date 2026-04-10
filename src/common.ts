import { writeFile } from "node:fs/promises";
import { env, exit } from "node:process";
import { join } from "node:path";
import { throwError } from "./utils.ts";

export function getBusterPath(): string {
  return env["BUSTER_PATH"] ??
    throwError("BUSTER_PATH was not defined.");
}

export function getBusterExtPath(): string {
  return join(getBusterPath(), "ext");
}

export function getNodePath(): string {
  return join(getBusterExtPath(), "node");
}

export function getNodeExe(): string {
  return join(getNodePath(), "bin", "node");
}

export function getNodeOptions(): string {
  return env["BUSTER_NODE_OPTIONS"] ??
    throwError("BUSTER_NODE_OPTIONS was not defined.");
}

export async function signalReplaceProcessAndExit(
  args: string[],
): Promise<never> {
  const replacementSignal = env["BUSTER_REPLACE_SIGNAL"] ??
    throwError("BUSTER_REPLACE_SIGNAL was not defined.");
  await writeFile(replacementSignal, args.join(" "), { encoding: "utf-8" });
  exit(0);
}
