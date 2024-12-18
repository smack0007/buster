import { mkdir, readdir, stat } from "node:fs/promises";
import { assertError, isNodeError } from "./utils.ts";

export async function ensureDirectory(
  path: string,
  options?: Parameters<typeof mkdir>[1]
): Promise<void> {
  try {
    await mkdir(path, options);
  } catch (err) {
    assertError(err);
    if (isNodeError(err) && err.code !== "EEXIST") {
      throw err;
    }
  }
}

export async function exists(path: string): Promise<boolean> {
  try {
    await stat(path);
    return true;
  } catch {}

  return false;
}

export async function listDirectories(path: string): Promise<string[]> {
  return (await readdir(path, { withFileTypes: true }))
    .filter((entry) => entry.isDirectory())
    .map((entry) => entry.name);
}
