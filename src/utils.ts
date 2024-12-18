export function assertError(error: unknown): asserts error is Error {
  if (!(error instanceof Error)) {
    throw new Error(`Unexpected error type: ${typeof error}`);
  }
}

export function isNodeError(error: Error): error is Error & { code: string } {
  return typeof (error as unknown as { code: string }).code === "string";
}

export function throwError(message?: string): never {
  throw new Error(message);
}
