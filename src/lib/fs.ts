import { mkdir, readdir, readFile, rm, stat, symlink as nodeSymlink, writeFile } from "node:fs/promises";
import { assertError, isNodeError } from "../lib/utils.ts";

export async function ensureDirectory(path: string): Promise<void> {
  try {
    await mkdir(path, { recursive: true });
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

export async function isDirectory(path: string): Promise<boolean> {
  try {
    return (await stat(path)).isDirectory();
  } catch {}

  return false;
}

export async function isFile(path: string): Promise<boolean> {
  try {
    return (await stat(path)).isFile();
  } catch {}

  return false;
}

export async function listDirectories(path: string): Promise<string[]> {
  return (await readdir(path, { withFileTypes: true }))
    .filter((entry) => entry.isDirectory())
    .map((entry) => entry.name);
}

export async function readTextFile(path: string): Promise<string> {
  return await readFile(path, { encoding: "utf-8" });
}

export async function removeDirectory(path: string): Promise<void> {
  await rm(path, { recursive: true });
}

export async function removeFile(path: string): Promise<void> {
  await rm(path);
}

export async function symlink(target: string, path: string): Promise<void> {
  return await nodeSymlink(target, path);
}

export async function tryRemoveDirectory(path: string): Promise<boolean> {
  try {
    await removeDirectory(path);
  } catch {
    return false;
  }
  return true;
}

export async function tryRemoveFile(path: string): Promise<boolean> {
  try {
    await removeFile(path);
  } catch {
    return false;
  }
  return true;
}

export async function writeTextFile(path: string, data: string): Promise<void> {
  await writeFile(path, data, { encoding: "utf-8" });
}
