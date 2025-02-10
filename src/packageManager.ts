import { getBusterPath, trySymlink } from "./lib/common.ts";
import { ensureDirectory } from "./lib/fs.ts";
import { join } from "./lib/path.ts";

export async function symlinkBusterModule(projectPath: string): Promise<void> {
  const busterPath = getBusterPath();
  await ensureDirectory(join([projectPath, "node_modules", "@buster"]));
  await trySymlink(join([busterPath, "configs"]), join([projectPath, "node_modules", "@buster", "configs"]));
}
