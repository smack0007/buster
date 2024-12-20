import { getNodeModulesPath } from "./lib/common.ts";
import { join } from "node:path";
import { exec, ExecResult } from "./lib/os.ts";

const NODE_MODULES_PATH = getNodeModulesPath();

const extensionsRegex = /\.(ts|tsx)$/;

export async function load(
  url: string,
  context: Record<string, unknown>,
  nextLoad: (url: string, context: Record<string, unknown>) => Promise<{ source: string }>,
): Promise<{ source: string; format?: "module"; shortCircuit?: true }> {
  if (extensionsRegex.test(url)) {
    const { source } = await nextLoad(url, {
      ...context,
      format: "module",
    });

    const result = await esbuild(url, source.toString());

    if (result.code != 0) {
      throw new Error(`Failed to transpile TypeScript (${result.code}): ` + result.stderr);
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
  return await exec(
    [join(NODE_MODULES_PATH, ".bin", "esbuild"), `--sourcefile=${url}`, "--loader=ts", "--sourcemap=inline"],
    {
      stdin: source,
    },
  );
}
