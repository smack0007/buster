import {
  mkdir,
  readdir,
  stat,
  symlink as nodeSymlink,
  writeFile,
} from "node:fs/promises";
import { assertError, isNodeError } from "../lib/utils.ts";

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

export async function symlink(target: string, path: string): Promise<void> {
  return await nodeSymlink(target, path);
}

export async function writeTextFile(path: string, data: string): Promise<void> {
  await writeFile(path, data, { encoding: "utf-8" });
}
