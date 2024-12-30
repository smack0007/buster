import { exists, readTextFile } from "./fs.ts";
import { cwd } from "./os.ts";
import { dirname, join } from "./path.ts";
import { PackageJson } from "./types.ts";

export function assertError(error: unknown): asserts error is Error {
  if (!(error instanceof Error)) {
    throw new Error(`Unexpected error type: ${typeof error}`);
  }
}

export async function findPackageJson(directory: string = cwd()): Promise<string | null> {
  const packageJsonPath = join([directory, "package.json"]);
  if (await exists(packageJsonPath)) {
    return packageJsonPath;
  }

  if (directory === "/") {
    return null;
  }

  return await findPackageJson(dirname(directory));
}

export async function findTSConfig(directory: string): Promise<string | null> {
  const tsConfigPath = join([directory, "tsconfig.json"]);
  if (await exists(tsConfigPath)) {
    return tsConfigPath;
  }

  if (directory === "/") {
    return null;
  }

  return await findTSConfig(dirname(directory));
}

export function isObject(obj: unknown): obj is {} {
  return typeof obj === "object" && obj !== null && !Array.isArray(obj);
}

export function isNodeError(error: Error): error is Error & { code: string } {
  return typeof (error as unknown as { code: string }).code === "string";
}

export async function loadPackageJson(path: string): Promise<PackageJson> {
  return JSON.parse(await readTextFile(path));
}

export function throwError(message?: string): never {
  throw new Error(message);
}
