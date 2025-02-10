import { parseArgs } from "./lib/args.ts";
import { getOxlintExe } from "./lib/common.ts";
import { cwd, exec, ExecIOMode } from "./lib/os.ts";
import { resolve } from "./lib/path.ts";

export interface LintArgs {
  path?: string;
}

export function parse(args: string[]): LintArgs {
  return parseArgs(args, {
    positional: {
      key: "path",
      single: true,
    },
    options: {},
  });
}

export async function run(args: LintArgs): Promise<number> {
  const oxlintExe = getOxlintExe();

  let path = resolve(args.path ?? cwd());

  const result = await exec([oxlintExe, path], {
    stdout: ExecIOMode.inherit,
    stderr: ExecIOMode.inherit,
  });

  return result.code;
}
