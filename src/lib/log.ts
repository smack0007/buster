import { red } from "./colors.ts";

export function logError(message: string): string {
  return `${red("error")}: ${message}`;
}
