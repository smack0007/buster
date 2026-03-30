import { isBuiltin } from "node:module";
import { join } from "node:path";
import { pathToFileURL } from "node:url";
import { throwError } from "./utils.ts";

const BUSTER_PATH = process.env.BUSTER_PATH ??
  throwError("BUSTER_PATH was not defined.");

export async function resolve(
  specifier: string,
  context: Record<string, unknown>,
  next: (
    specifier: string,
    context: Record<string, unknown>,
  ) => Promise<{ source: string }>,
) {
  if (isBuiltin(specifier)) {
    return next(specifier, context);
  }

  let url = specifier;
  if (specifier.startsWith("buster:")) {
    const libName = url.substring("buster:".length);
    url = pathToFileURL(join(BUSTER_PATH, "lib", libName, "index.ts")).href;
  } else if (specifier == "koffi") {
    url = pathToFileURL(join(BUSTER_PATH, "ext", "koffi", "index.js")).href;
  }

  return next(url, context);
}
