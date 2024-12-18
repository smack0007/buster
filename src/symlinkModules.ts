import { ensureDirectory, exists, symlink } from "./lib/fs.ts";
import { findPackageJson, throwError } from "./lib/utils.ts";
import { dirname, join, resolve } from "./lib/path.ts";
import { exit } from "./lib/os.ts";
import { red } from "./lib/colors.ts";

const BUSTER_NODE_MODULES_PATH =
  process.env.BUSTER_NODE_MODULES_PATH ??
  throwError("BUSTER_NODE_MODULES_PATH is undefined.");

const args = process.argv.slice(2);
const scriptPath = args[0];

if (scriptPath === undefined) {
  console.error(red("ERROR: No script path provided in symlinkModules.ts"));
  exit(1);
}

const scriptDirectory = resolve(dirname(scriptPath));

const packageJson = await findPackageJson(scriptDirectory);
const nodeModulesPath = join([
  packageJson ? dirname(packageJson) : scriptDirectory,
  "node_modules",
]);

await ensureDirectory(nodeModulesPath);
await ensureDirectory(join([nodeModulesPath, "@types"]));

if (!(await exists(join([nodeModulesPath, "@types", "node"])))) {
  await symlink(
    join([BUSTER_NODE_MODULES_PATH, "@types", "node"]),
    join([nodeModulesPath, "@types", "node"])
  );
}

if (!(await exists(join([nodeModulesPath, "undici-types"])))) {
  await symlink(
    join([BUSTER_NODE_MODULES_PATH, "undici-types"]),
    join([nodeModulesPath, "undici-types"])
  );
}
