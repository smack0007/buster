import {
  AssertionError,
  deepStrictEqual,
  strictEqual,
  throws,
} from "node:assert";

export { afterEach, beforeEach, describe, it } from "node:test";

function isObject(value: unknown): value is {} {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

class Expect<T> {
  private readonly isObject;
  protected readonly value: T;

  public constructor(value: T) {
    this.value = value;
    this.isObject = isObject(value);
  }

  public toEqual(other: T, message?: string): void {
    if (this.isObject) {
      deepStrictEqual(this.value, other, message);
    } else {
      strictEqual(this.value, other, message);
    }
  }

  public toBeTrue(message?: string): void {
    strictEqual(
      this.value,
      true,
      message ?? `Expected ${this.value} to be true.`,
    );
  }

  public toBeFalse(message?: string): void {
    strictEqual(
      this.value,
      false,
      message ?? `Expected ${this.value} to be false.`,
    );
  }
}

class ExpectFunction<T extends Function> extends Expect<T> {
  public constructor(func: T) {
    super(func);
  }

  public toThrow(): void {
    throws(() => this.value(), "Expected function to throw.");
  }
}

export function expect<T extends Function>(func: T): ExpectFunction<T>;
export function expect<T>(value: T): Expect<T>;
export function expect<T>(value: T): Expect<T> {
  if (value instanceof Function) {
    return new ExpectFunction(value);
  } else {
    return new Expect(value);
  }
}

export function fail(message?: string): never {
  throw new AssertionError({
    message: message ?? "Test failed.",
  });
}
