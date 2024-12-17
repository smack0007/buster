import { join } from "node:path";
import { exec } from "./os.js";

const BUSTER_NODE_MODULES_PATH = process.env.BUSTER_NODE_MODULES_PATH;

if (BUSTER_NODE_MODULES_PATH === undefined) {
  throw new Error("BUSTER_NODE_MODULES_PATH was not defined.");
}

const extensionsRegex = /\.(ts|tsx)$/;

export async function load(url, context, nextLoad) {
  if (extensionsRegex.test(url)) {
    const { source } = await nextLoad(url, {
      ...context,
      format: "module",
    });

    const result = await esbuild(source.toString());

    if (result.code != 0) {
      throw new Error(
        `Failed to transpile TypeScript (${result.code}): ` + result.stderr
      );
    }

    return {
      format: "module",
      shortCircuit: true,
      source: result.stdout,
    };
  }

  return nextLoad(url);
}

async function esbuild(source) {
  return await exec(
    [join(BUSTER_NODE_MODULES_PATH, ".bin", "esbuild"), "--loader=ts"],
    {
      stdin: source,
    }
  );
}
