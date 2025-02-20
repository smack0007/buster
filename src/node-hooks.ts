import { getBusterPath } from "./lib/common.ts";
import { join } from "./lib/path.ts";

const BUSTER_PATH = getBusterPath();

export async function resolve(
  specifier: string,
  context: Record<string, unknown>,
  nextResolve: (specifier: string, context: Record<string, unknown>) => Promise<unknown>,
): Promise<unknown> {
  if (specifier.startsWith("@buster/")) {
    return nextResolve(join([BUSTER_PATH, "lib", specifier.substring("@buster/".length) + ".ts"]), context);
  }

  return await nextResolve(specifier, context);
}
