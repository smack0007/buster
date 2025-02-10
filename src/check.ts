import { parseArgs } from "./lib/args.ts";
import { getTSCExe } from "./lib/common.ts";
import { exists, isDirectory } from "./lib/fs.ts";
import { cwd, exec, ExecIOMode } from "./lib/os.ts";
import { join, resolve } from "./lib/path.ts";

export interface CheckArgs {
  path?: string;
}

export function parse(args: string[]): CheckArgs {
  return parseArgs(args, {
    positional: {
      key: "path",
      single: true,
    },
    options: {},
  });
}

export async function run(args: CheckArgs): Promise<number> {
  const tscExe = getTSCExe();

  let path = resolve(args.path ?? cwd());
  if (await isDirectory(path)) {
    if (await exists(join([path, "tsconfig.json"]))) {
      path = join([path, "tsconfig.json"]);
    }
  }

  const result = await exec([tscExe, "--noEmit", "-p", path], {
    stdout: ExecIOMode.inherit,
    stderr: ExecIOMode.inherit,
  });

  return result.code;
}
