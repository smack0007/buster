import { dirname, join } from "./path.ts";

export function getNodeExecutablePath(): string {
  return process.execPath;
}

export function getNPMExecutablePath(): string {
  return join([dirname(getNodeExecutablePath()), "npm"]);
}
