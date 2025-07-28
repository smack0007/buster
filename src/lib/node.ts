import { dirname, join } from "./path.ts";

export function getNodeExecutablePath(): string {
  return process.execPath;
}
