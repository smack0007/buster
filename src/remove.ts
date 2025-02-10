import { parseArgs } from "./lib/args.ts";
import { getPNPMExe } from "./lib/common.ts";
import { exec, ExecIOMode } from "./lib/os.ts";
import { symlinkBusterModule } from "./packageManager.ts";

export interface RemoveArgs {
  dependencies: string[];
  directory?: string;
}

export function parse(args: string[]): RemoveArgs {
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

export async function run(args: RemoveArgs): Promise<number> {
  const pnpmExe = getPNPMExe();

  let options: string[] = [];
  if (args.directory) {
    options.push("--dir", args.directory);
  }

  const result = await exec([pnpmExe, "remove", ...options, ...args.dependencies], {
    stdout: ExecIOMode.inherit,
    stderr: ExecIOMode.inherit,
  });

  if (result.code === 0) {
    await symlinkBusterModule(args.directory ?? ".");
  }

  return result.code;
}
