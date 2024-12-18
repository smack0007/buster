import { join } from "node:path";
import { exec, ExecResult } from "./os.ts";
import { throwError } from "./utils.ts";

const BUSTER_NODE_MODULES_PATH =
  process.env.BUSTER_NODE_MODULES_PATH ??
  throwError("BUSTER_NODE_MODULES_PATH was not defined.");

const extensionsRegex = /\.(ts|tsx)$/;

export async function load(
  url: string,
  context: Record<string, unknown>,
  nextLoad: (
    url: string,
    context: Record<string, unknown>
  ) => Promise<{ source: string }>
) {
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

  return nextLoad(url, context);
}

async function esbuild(source: string): Promise<ExecResult> {
  return await exec(
    [join(BUSTER_NODE_MODULES_PATH, ".bin", "esbuild"), "--loader=ts"],
    {
      stdin: source,
    }
  );
}
