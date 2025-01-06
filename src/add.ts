import { parseArgs } from "./lib/args.ts";
import { getPNPMPath } from "./lib/common.ts";
import { exec, ExecIOMode } from "./lib/os.ts";
import { join } from "./lib/path.ts";

export interface AddArgs {
  dependencies: string[];
}

export function parse(args: string[]): AddArgs {
  return parseArgs(args, {
    positional: {
      key: "dependencies",
    },
    options: {},
  });
}

export async function run(args: AddArgs): Promise<number> {
  const pnpmExePath = join([getPNPMPath(), "pnpm"]);

  const result = await exec([pnpmExePath, "add", ...args.dependencies], {
    stdout: ExecIOMode.inherit,
    stderr: ExecIOMode.inherit,
  });

  return result.code;
}
