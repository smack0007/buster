import * as assert from "node:assert";

function isObject(value: unknown): value is {} {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

interface Expect<T> {
  toEqual(other: T, message?: string): void;
}

interface ExpectNullish<T extends null | undefined> extends Expect<T> {
  toBeDefined(message?: string): void;
}

interface ExpectBoolean<T extends boolean> extends Expect<T> {
  toBeTrue(message?: string): void;
  toBeFalse(message?: string): void;
}

interface ExpectFunction<T extends Function> extends Expect<T> {
  toThrow(message?: string): void;
}

interface ExpectString<T extends string> extends Expect<T> {
  toInclude(message?: string): void;
}

class ExpectWrapper<T> {
  readonly value: T;

  constructor(value: T) {
    this.value = value;
  }

  toBeDefined(message?: string): void {
    assert.notStrictEqual(this.value, null, message);
    assert.notStrictEqual(this.value, undefined, message);
  }

  toEqual(other: T, message?: string): void {
    if (isObject(this.value)) {
      assert.deepStrictEqual(this.value, other, message);
    } else {
      assert.strictEqual(this.value, other, message);
    }
  }

  toBeTrue(message?: string): void {
    assert.strictEqual(
      this.value,
      true,
      message ?? `Expected ${this.value} to be true.`,
    );
  }

  toBeFalse(message?: string): void {
    assert.strictEqual(
      this.value,
      false,
      message ?? `Expected ${this.value} to be false.`,
    );
  }

  toInclude(
    searchString: string,
    position?: number,
    message?: string,
  ): void {
    assert.strictEqual(
      (this.value as string).includes(searchString, position),
      true,
      message,
    );
  }

  toThrow(message?: string): void {
    assert.throws(() => (this.value as Function)(), message);
  }
}

export function expect<T extends boolean>(value: T): ExpectBoolean<T>;
export function expect<T extends boolean | null | undefined>(
  value: T,
): ExpectBoolean<NonNullable<T>> & ExpectNullish<null | undefined>;
export function expect<T extends Function>(value: T): ExpectFunction<T>;
export function expect<T extends string>(value: T): ExpectString<T>;
export function expect<T>(value: T): Expect<T>;
export function expect<T>(value: T): Expect<T> {
  return new ExpectWrapper<T>(value);
}
