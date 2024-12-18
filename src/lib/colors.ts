import { styleText } from "node:util";

export function green(text: string): string {
  return styleText("green", text);
}

export function red(text: string): string {
  return styleText("red", text);
}
