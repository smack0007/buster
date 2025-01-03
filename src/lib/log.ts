import { red } from "./colors.ts";
import { hasToStringMethod } from "./utils.ts";

export function logError(message: string, error?: unknown): void {
  console.error(`${red("error")}: ${message}`);
  if (hasToStringMethod(error)) {
    console.error(error);
  }
}
