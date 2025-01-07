import { getBusterPath, getPNPMPath, trySymlink } from "./lib/common.ts";
import { ensureDirectory } from "./lib/fs.ts";
import { logError } from "./lib/log.ts";
import { exec, ExecIOMode } from "./lib/os.ts";
import { join } from "./lib/path.ts";

export interface InstallArgs {}

export function parse(_args: string[]): InstallArgs {
  return {};
}

export async function run(_args: InstallArgs): Promise<number> {
  const pnpmExePath = join([getPNPMPath(), "pnpm"]);

  const result = await exec([pnpmExePath, "install"], {
    stdout: ExecIOMode.inherit,
    stderr: ExecIOMode.inherit,
  });

  if (result.code === 0) {
    try {
      const busterPath = getBusterPath();
      await ensureDirectory(join(["node_modules", "@buster"]));
      await trySymlink(join([busterPath, "configs"]), join(["node_modules", "@buster", "configs"]));
    } catch (err) {
      logError("Failed while linking in buster.", err);
    }
  }

  return result.code;
}
