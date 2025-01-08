import { parseArgs } from "./lib/args.ts";
import { getPNPMPath } from "./lib/common.ts";
import { exec, ExecIOMode } from "./lib/os.ts";
import { join } from "./lib/path.ts";

export interface AddArgs {
  dependencies: string[];
  directory?: string;
}

export function parse(args: string[]): AddArgs {
  return parseArgs(args, {
    positional: {
      key: "dependencies",
    },
    options: {
      directory: {
        keys: ["--dir"],
        type: "string",
      },
    },
  });
}

export async function run(args: AddArgs): Promise<number> {
  const pnpmExePath = join([getPNPMPath(), "pnpm"]);

  let options: string[] = [];
  if (args.directory) {
    options.push("--dir", args.directory);
  }

  console.info([pnpmExePath, "add", ...options, ...args.dependencies]);

  const result = await exec([pnpmExePath, "add", ...options, ...args.dependencies], {
    stdout: ExecIOMode.inherit,
    stderr: ExecIOMode.inherit,
  });

  return result.code;
}
