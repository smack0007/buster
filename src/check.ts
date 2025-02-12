import { parseArgs } from "./lib/args.ts";
import { getTSCExe, signalReplaceProcessAndExit } from "./lib/common.ts";
import { exists, isDirectory } from "./lib/fs.ts";
import { cwd } from "./lib/os.ts";
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

  await signalReplaceProcessAndExit([tscExe, "--noEmit", "-p", path]);

  return 0;
}
