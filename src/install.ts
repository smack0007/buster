import { parseArgs } from "./lib/args.ts";
import { getBusterPath, getPNPMPath, trySymlink } from "./lib/common.ts";
import { ensureDirectory } from "./lib/fs.ts";
import { logError } from "./lib/log.ts";
import { exec, ExecIOMode } from "./lib/os.ts";
import { join } from "./lib/path.ts";

export interface InstallArgs {
  directory?: string;
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
    },
  });
}

export async function run(args: InstallArgs): Promise<number> {
  const pnpmExePath = join([getPNPMPath(), "pnpm"]);

  let options: string[] = [];
  if (args.directory) {
    options.push("--dir", args.directory);
  }

  const result = await exec([pnpmExePath, "install", ...options], {
    stdout: ExecIOMode.inherit,
    stderr: ExecIOMode.inherit,
  });

  if (result.code === 0) {
    try {
      const busterPath = getBusterPath();
      await ensureDirectory(join([args.directory ?? ".", "node_modules", "@buster"]));
      await trySymlink(
        join([busterPath, "configs"]),
        join([args.directory ?? ".", "node_modules", "@buster", "configs"]),
      );
    } catch (err) {
      logError("Failed while linking in buster.", err);
    }
  }

  return result.code;
}
