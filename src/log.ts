import { red } from "./colors.ts";
import { hasToStringMethod } from "./utils.ts";

export function logError(message: string, error?: unknown): void {
  console.error(`${red("error")}: ${message}`);
  if (error && hasToStringMethod(error)) {
    console.error(error);
  }
}

export function logMessage(message: string): void {
  console.info(message);
}
