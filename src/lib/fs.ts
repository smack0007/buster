import { mkdir, readdir, readFile, rm, stat, symlink as nodeSymlink, writeFile } from "node:fs/promises";
import { assertError, isNodeError } from "../lib/utils.ts";
import { ensurePathIsString, join, type PathLike } from "./path.ts";

export async function ensureDirectory(path: PathLike): Promise<void> {
  try {
    await mkdir(ensurePathIsString(path), { recursive: true });
  } catch (err) {
    assertError(err);
    if (isNodeError(err) && err.code !== "EEXIST") {
      throw err;
    }
  }
}

export async function exists(path: PathLike): Promise<boolean> {
  try {
    await stat(ensurePathIsString(path));
    return true;
  } catch {}

  return false;
}

export async function isDirectory(path: PathLike): Promise<boolean> {
  try {
    return (await stat(ensurePathIsString(path))).isDirectory();
  } catch {}

  return false;
}

export async function isFile(path: PathLike): Promise<boolean> {
  try {
    return (await stat(ensurePathIsString(path))).isFile();
  } catch {}

  return false;
}

export async function listDirectories(path: PathLike): Promise<string[]> {
  return (await readdir(ensurePathIsString(path), { withFileTypes: true }))
    .filter((entry) => entry.isDirectory())
    .map((entry) => join([entry.parentPath, entry.name]));
}

export interface ListFilesOptions {
  recursive?: boolean;
}

export async function listFiles(path: PathLike, options: ListFilesOptions = {}, basePath = ""): Promise<string[]> {
  const entries = await readdir(ensurePathIsString(path), { withFileTypes: true });

  if (!options.recursive) {
    return entries.filter((entry) => !entry.isDirectory()).map((entry) => entry.name);
  }

  const results: string[] = [];
  for (const entry of entries) {
    const entryFileName = join([basePath, entry.name]);

    if (entry.isDirectory()) {
      results.push(...(await listFiles([ensurePathIsString(path), entry.name], options, entryFileName)));
    } else {
      results.push(entryFileName);
    }
  }

  return results;
}

export async function readTextFile(path: PathLike): Promise<string> {
  return await readFile(ensurePathIsString(path), { encoding: "utf-8" });
}

export async function removeDirectory(path: PathLike): Promise<void> {
  await rm(ensurePathIsString(path), { recursive: true });
}

export async function removeFile(path: PathLike): Promise<void> {
  await rm(ensurePathIsString(path));
}

export async function symlink(target: PathLike, path: PathLike): Promise<void> {
  return await nodeSymlink(ensurePathIsString(target), ensurePathIsString(path));
}

export async function tryRemoveDirectory(path: PathLike): Promise<boolean> {
  try {
    await removeDirectory(ensurePathIsString(path));
  } catch {
    return false;
  }
  return true;
}

export async function tryRemoveFile(path: PathLike): Promise<boolean> {
  try {
    await removeFile(ensurePathIsString(path));
  } catch {
    return false;
  }
  return true;
}

export async function writeTextFile(path: PathLike, data: string): Promise<void> {
  await writeFile(ensurePathIsString(path), data, { encoding: "utf-8" });
}
