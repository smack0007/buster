import { parseArgs } from "./lib/args.ts";
import { getPNPMExe } from "./lib/common.ts";
import { exec, ExecIOMode } from "./lib/os.ts";

export interface InstallArgs {
  directory?: string;
  global?: string;
}

export function parse(args: string[]): InstallArgs {
  return parseArgs(args, {
    positional: {
      key: "_",
    },
    options: {
      directory: {
        keys: ["--dir"],
        type: "string",
      },
      global: {
        keys: ["--global", "-g"],
        type: "string",
      },
    },
  });
}

export async function run(args: InstallArgs): Promise<number> {
  const pnpmExe = getPNPMExe();

  let options: string[] = [];
  if (args.directory) {
    options.push("--dir", args.directory);
  }

  if (args.global) {
    options.push("--global", args.global);
  }

  const result = await exec([pnpmExe, "install", ...options], {
    stdout: ExecIOMode.inherit,
    stderr: ExecIOMode.inherit,
  });

  return result.code;
}
