import { join } from "node:path";
import { exec, ExecResult } from "./lib/os.ts";
import { throwError } from "./lib/utils.ts";

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

    const result = await esbuild(url, source.toString());

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

async function esbuild(url: string, source: string): Promise<ExecResult> {
  console.info(url);
  return await exec(
    [
      join(BUSTER_NODE_MODULES_PATH, ".bin", "esbuild"),
      `--sourcefile=${url}`,
      "--loader=ts",
      "--sourcemap=inline",
    ],
    {
      stdin: source,
    }
  );
}
