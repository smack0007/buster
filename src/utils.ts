import { type ToString } from "./types.ts";

export function hasToStringMethod(value: unknown): value is ToString {
  return typeof (value as ToString)["toString"] === "function";
}

export function throwError(message?: string): never {
  throw new Error(message);
}
