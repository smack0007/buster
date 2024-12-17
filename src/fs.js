import { mkdir, readdir, stat } from "node:fs/promises";

export async function ensureDirectory(path, options) {
  try {
    return await mkdir(path, options);
  } catch (err) {
    if (err.code !== "EEXIST") {
      throw err;
    }
  }
}

export async function exists(path) {
  try {
    await stat(path);
    return true;
  } catch {}

  return false;
}

export async function listDirectories(path) {
  return (await readdir(path, { withFileTypes: true }))
    .filter((entry) => entry.isDirectory())
    .map((entry) => entry.name);
}
