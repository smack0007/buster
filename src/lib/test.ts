import { deepStrictEqual, strictEqual } from "node:assert";
import { isObject } from "./utils.ts";

export { describe, it } from "node:test";

class Expect<T> {
  private readonly isObject;

  constructor(private readonly value: T) {
    this.isObject = isObject(value);
  }

  public toEqual(other: T, message?: string): void {
    if (this.isObject) {
      deepStrictEqual(this.value, other, message);
    } else {
      strictEqual(this.value, other, message);
    }
  }
}

export function expect<T>(value: T): Expect<T> {
  return new Expect<T>(value);
}
