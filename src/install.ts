import { getNodeModulesPath } from "./lib/common.ts";
import { exec, ExecIOMode } from "./lib/os.ts";
import { join } from "./lib/path.ts";

export interface InstallArgs {}

export function parseInstallArgs(_args: string[]): InstallArgs {
  return {};
}

export async function install(_args: InstallArgs): Promise<void> {
  const pnpmExePath = join([getNodeModulesPath(), ".bin", "pnpm"]);

  await exec([pnpmExePath, "install"], {
    stdout: ExecIOMode.inherit,
    stderr: ExecIOMode.inherit,
  });
}
