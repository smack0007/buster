import {
  basename as nodeBasename,
  dirname as nodeDirname,
  extname as nodeExtname,
  join as nodeJoin,
  resolve as nodeResolve,
} from "node:path";

export function basename(path: string): string {
  return nodeBasename(path);
}

export function dirname(path: string): string {
  return nodeDirname(path);
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
