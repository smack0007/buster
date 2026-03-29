import * as assert from "node:assert";

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
      assert.deepStrictEqual(this.value, other, message);
    } else {
      assert.strictEqual(this.value, other, message);
    }
  }

  public toBeTrue(message?: string): void {
    assert.strictEqual(
      this.value,
      true,
      message ?? `Expected ${this.value} to be true.`,
    );
  }

  public toBeFalse(message?: string): void {
    assert.strictEqual(
      this.value,
      false,
      message ?? `Expected ${this.value} to be false.`,
    );
  }
}

class ExpectString<T extends string> extends Expect<T> {
  public includes(
    searchString: string,
    position?: number,
    message?: string,
  ): void {
    assert.strictEqual(
      this.value.includes(searchString, position),
      true,
      message,
    );
  }
}

class ExpectFunction<T extends Function> extends Expect<T> {
  public toThrow(): void {
    assert.throws(() => this.value(), "Expected function to throw.");
  }
}

export function expect<T extends string>(value: T): ExpectString<T>;
export function expect<T extends Function>(value: T): ExpectFunction<T>;
export function expect<T>(value: T): Expect<T>;
export function expect<T>(value: T): Expect<T> {
  if (typeof value === "string") {
    return new ExpectString(value);
  } else if (value instanceof Function) {
    return new ExpectFunction(value);
  } else {
    return new Expect(value);
  }
}
