// ../../src/lib/fs.ts
import { mkdir, readdir, readFile, stat, symlink as nodeSymlink, writeFile } from "node:fs/promises";

// ../../src/lib/os.ts
function cwd() {
  return process.cwd();
}

// ../../src/lib/path.ts
import {
  basename as nodeBasename,
  dirname as nodeDirname,
  extname as nodeExtname,
  join as nodeJoin,
  resolve as nodeResolve
} from "node:path";
function dirname(path) {
  return nodeDirname(path);
}
function join(parts) {
  return nodeJoin(...parts);
}
function resolve(path) {
  return nodeResolve(path);
}

// ../../src/lib/utils.ts
function assertError(error) {
  if (!(error instanceof Error)) {
    throw new Error(`Unexpected error type: ${typeof error}`);
  }
}
async function findPackageJson(directory = cwd()) {
  const packageJsonPath = join([directory, "package.json"]);
  if (await exists(packageJsonPath)) {
    return packageJsonPath;
  }
  if (directory === "/") {
    return null;
  }
  return await findPackageJson(dirname(directory));
}
function isNodeError(error) {
  return typeof error.code === "string";
}
function hasToStringMethod(value) {
  return typeof value["toString"] === "function";
}
function throwError(message) {
  throw new Error(message);
}

// ../../src/lib/fs.ts
async function ensureDirectory(path) {
  try {
    await mkdir(path, { recursive: true });
  } catch (err) {
    assertError(err);
    if (isNodeError(err) && err.code !== "EEXIST") {
      throw err;
    }
  }
}
async function exists(path) {
  try {
    await stat(path);
    return true;
  } catch {
  }
  return false;
}
async function symlink(target, path) {
  return await nodeSymlink(target, path);
}

// ../../src/lib/colors.ts
import { styleText } from "node:util";
function red(text) {
  return styleText("red", text);
}

// ../../src/lib/log.ts
function logError(message, error) {
  console.error(`${red("error")}: ${message}`);
  if (hasToStringMethod(error)) {
    console.error(error);
  }
}

// ../../src/lib/common.ts
function getNodeModulesPath() {
  return process.env["BUSTER_NODE_MODULES_PATH"] ?? throwError("BUSTER_NODE_MODULES_PATH was not defined.");
}

// ../../src/symlinkModules.ts
var NODE_MODULES_PATH = getNodeModulesPath();
var args = process.argv.slice(2);
var scriptDirectory = resolve(args[0] ?? process.cwd());
var packageJson = await findPackageJson(scriptDirectory);
var nodeModulesPath = join([packageJson ? dirname(packageJson) : scriptDirectory, "node_modules"]);
await ensureDirectory(nodeModulesPath);
await ensureDirectory(join([nodeModulesPath, "@types"]));
async function trySymlink(target, path) {
  if (!await exists(path)) {
    try {
      await symlink(target, path);
    } catch (err) {
      logError(`Failed to create symlink "${path}" => "${target}".
${err}`);
    }
  }
}
trySymlink(join([NODE_MODULES_PATH, "@types", "node"]), join([nodeModulesPath, "@types", "node"]));
trySymlink(join([NODE_MODULES_PATH, "undici-types"]), join([nodeModulesPath, "undici-types"]));
