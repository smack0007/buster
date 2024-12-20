import { ensureDirectory, exists, symlink } from "./lib/fs.ts";
import { findPackageJson, throwError } from "./lib/utils.ts";
import { dirname, join, resolve } from "./lib/path.ts";
import { getNodeModulesPath } from "./lib/common.ts";

const NODE_MODULES_PATH = getNodeModulesPath();

const args = process.argv.slice(2);
const scriptDirectory = resolve(args[0] ?? process.cwd());

const packageJson = await findPackageJson(scriptDirectory);
const nodeModulesPath = join([packageJson ? dirname(packageJson) : scriptDirectory, "node_modules"]);

await ensureDirectory(nodeModulesPath);
await ensureDirectory(join([nodeModulesPath, "@types"]));

if (!(await exists(join([nodeModulesPath, "@types", "node"])))) {
  await symlink(join([NODE_MODULES_PATH, "@types", "node"]), join([nodeModulesPath, "@types", "node"]));
}

if (!(await exists(join([nodeModulesPath, "undici-types"])))) {
  await symlink(join([NODE_MODULES_PATH, "undici-types"]), join([nodeModulesPath, "undici-types"]));
}
