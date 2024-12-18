import { basename, dirname, join, resolve } from "node:path";
import { symlink } from "node:fs/promises";
import { ensureDirectory, exists, listDirectories } from "./fs.ts";
import { throwError } from "./utils.ts";

const BUSTER_NODE_MODULES_PATH =
  process.env.BUSTER_NODE_MODULES_PATH ??
  throwError("BUSTER_NODE_MODULES_PATH is undefined.");

const args = process.argv.slice(2);
const scriptPath = args[0];
const scriptDirectory = resolve(dirname(scriptPath));
const scriptFile = basename(scriptPath);

async function findPackageJson(directory: string): Promise<string | null> {
  const packageJsonPath = join(directory, "package.json");
  if (await exists(packageJsonPath)) {
    return packageJsonPath;
  }

  if (directory === "/") {
    return null;
  }

  return await findPackageJson(dirname(directory));
}

const packageJson = await findPackageJson(scriptDirectory);
const nodeModulesPath = join(
  packageJson ? dirname(packageJson) : scriptDirectory,
  "node_modules"
);

await ensureDirectory(nodeModulesPath);

for (const module of await listDirectories(BUSTER_NODE_MODULES_PATH)) {
  if (module === ".bin") {
  } else {
    const modulePath = join(nodeModulesPath, module);
    if (!(await exists(modulePath))) {
      console.info(join(BUSTER_NODE_MODULES_PATH, module));
      await symlink(join(BUSTER_NODE_MODULES_PATH, module), modulePath);
    }
  }
}
