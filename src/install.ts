import { getPNPMPath } from "./lib/common.ts";
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

  return result.code;
}
