import { exists } from "./fs.ts";
import { dirname, join } from "./path.ts";

export function assertError(error: unknown): asserts error is Error {
  if (!(error instanceof Error)) {
    throw new Error(`Unexpected error type: ${typeof error}`);
  }
}

export async function findPackageJson(
  directory: string
): Promise<string | null> {
  const packageJsonPath = join([directory, "package.json"]);
  if (await exists(packageJsonPath)) {
    return packageJsonPath;
  }

  if (directory === "/") {
    return null;
  }

  return await findPackageJson(dirname(directory));
}

export function isNodeError(error: Error): error is Error & { code: string } {
  return typeof (error as unknown as { code: string }).code === "string";
}

export function throwError(message?: string): never {
  throw new Error(message);
}
