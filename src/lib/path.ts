import {
  basename as nodeBasename,
  dirname as nodeDirname,
  extname as nodeExtname,
  join as nodeJoin,
  resolve as nodeResolve,
} from "node:path";
import { IS_WINDOWS } from "./os.ts";

export type PathLike = string | string[];

export const SEPERATOR = IS_WINDOWS ? "\\" : "/";
export const SEPERATOR_PATTERN = IS_WINDOWS ? /[\\/]+/ : /\/+/;

export function basename(path: string): string {
  return nodeBasename(path);
}

export function dirname(path: string): string {
  return nodeDirname(path);
}

export function ensurePathIsString(path: PathLike): string {
  if (Array.isArray(path)) {
    return join(path);
  }
  return path;
}

export function extname(path: string): string {
  return nodeExtname(path);
}

export function join(parts: string[]): string {
  return nodeJoin(...parts);
}

export function resolve(path: string): string {
  return nodeResolve(path);
}

export function split(path: string): string[] {
  return path.split(SEPERATOR);
}
