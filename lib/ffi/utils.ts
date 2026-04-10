import { FFIError } from "./error.ts";

export function getSharedLibraryExtension(): string {
  switch (process.platform) {
    case "darwin":
      return ".dylib";

    case "linux":
      return ".so";
  }

  throw new FFIError(
    `Unable to get shared library extension for platform "${process.platform}"`,
  );
}
