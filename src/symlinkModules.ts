import { ensureDirectory, exists, symlink } from "./lib/fs.ts";
import { findPackageJson } from "./lib/utils.ts";
import { dirname, join, resolve } from "./lib/path.ts";
import { getNodeModulesPath } from "./lib/common.ts";
import { logError } from "./lib/log.ts";

const NODE_MODULES_PATH = getNodeModulesPath();

const args = process.argv.slice(2);
const scriptDirectory = resolve(args[0] ?? process.cwd());

const packageJson = await findPackageJson(scriptDirectory);
const nodeModulesPath = join([packageJson ? dirname(packageJson) : scriptDirectory, "node_modules"]);

await ensureDirectory(nodeModulesPath);
await ensureDirectory(join([nodeModulesPath, "@types"]));

async function trySymlink(target: string, path: string): Promise<void> {
  if (!(await exists(path))) {
    try {
      await symlink(target, path);
    } catch (err) {
      logError(`Failed to create symlink "${path}" => "${target}".\n${err}`);
    }
  }
}

trySymlink(join([NODE_MODULES_PATH, "@types", "node"]), join([nodeModulesPath, "@types", "node"]));
trySymlink(join([NODE_MODULES_PATH, "undici-types"]), join([nodeModulesPath, "undici-types"]));
