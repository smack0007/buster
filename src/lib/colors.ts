import util from "node:util";

export function green(text: string): string {
  return util.styleText("green", text);
}

export function jsonStringifyColor(obj: unknown): string {
  return util.inspect(obj, { compact: false, colors: true });
}

export function red(text: string): string {
  return util.styleText("red", text);
}
