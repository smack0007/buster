import { platform } from "node:os";

export const OperatingSystemName = {
  linux: "linux",
  macOS: "darwin",
  win32: "win32",
} as const;

export function osname(): "linux" | "darwin" | "win32" | string {
  return platform();
}
