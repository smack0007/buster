import { writeFile } from "node:fs/promises";
import { env, exit } from "node:process";
import { join } from "node:path";
import { throwError } from "./utils.ts";

export function getNodePath(): string {
  return env["BUSTER_NODE_PATH"] ??
    throwError("BUSTER_NODE_PATH was not defined.");
}

export function getNodeExe(): string {
  return join(getNodePath(), "bin", "node");
}

export function getNodeOptions(): string[] {
  // TODO: Pull this from buster.env
  return ["--strip-types"];
}

export async function signalReplaceProcessAndExit(
  args: string[],
): Promise<never> {
  const replacementSignal = env["BUSTER_REPLACE_SIGNAL"] ??
    throwError("BUSTER_REPLACE_SIGNAL was not defined.");
  await writeFile(replacementSignal, args.join(" "), { encoding: "utf-8" });
  exit(0);
}
