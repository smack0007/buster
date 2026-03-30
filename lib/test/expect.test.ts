import * as assert from "node:assert";
import { describe, it } from "node:test";
import { expect } from "./expect.ts";

describe("expect", () => {
  describe("toEqual", () => {
    describe("does not throw", () => {
      const testCases: Array<[unknown, unknown]> = [
        [1, 1],
        ["foo", "foo"],
      ];

      for (const [value, expected] of testCases) {
        it(`expect(${value}).toEqual(${expected})`, () => {
          expect(value).toEqual(expected);
        });
      }
    });

    describe("throws", () => {
      const testCases: Array<[unknown, unknown]> = [
        [1, 2],
        ["foo", "bar"],
      ];

      for (const [value, expected] of testCases) {
        it(`expect(${value}).toEqual(${expected})`, () => {
          assert.throws(() => expect(value).toEqual(expected));
        });
      }
    });
  });

  describe("toBeTrue", () => {
    describe("does not throw", () => {
      const testCases: Array<[boolean]> = [
        [true],
      ];

      for (const [value] of testCases) {
        it(`expect(${value}).toBeTrue()`, () => {
          expect(value).toBeTrue();
        });
      }

      it(`expect(true as boolean | undefined).toBeTrue()`, () => {
        const value = true as boolean | undefined;
        expect(value).toBeDefined();
        expect(value).toBeTrue();
      });
    });

    describe("throws", () => {
      const testCases: Array<[boolean]> = [
        [false],
      ];

      for (const [value] of testCases) {
        it(`expect(${value}).toBeTrue()`, () => {
          assert.throws(() => expect(value).toBeTrue());
        });
      }
    });
  });

  describe("toBeFalse", () => {
    describe("does not throw", () => {
      const testCases: Array<[boolean]> = [
        [false],
      ];

      for (const [value] of testCases) {
        it(`expect(${value}).toBeFalse()`, () => {
          expect(value).toBeFalse();
        });
      }
    });

    describe("throws", () => {
      const testCases: Array<[boolean]> = [
        [true],
      ];

      for (const [value] of testCases) {
        it(`expect(${value}).toBeFalse()`, () => {
          assert.throws(() => expect(value).toBeFalse());
        });
      }
    });
  });

  describe("toInclude", () => {
    describe("does not throw", () => {
      const testCases: Array<[string, string]> = [
        ["foobar", "oba"],
      ];

      for (const [value, expected] of testCases) {
        it(`expect(${value}).toInclude(${expected})`, () => {
          expect(value).toInclude(expected);
        });
      }
    });

    describe("throws", () => {
      const testCases: Array<[string, string]> = [
        ["foobar", "baz"],
      ];

      for (const [value, expected] of testCases) {
        it(`expect(${value}).toInclude(${expected})`, () => {
          assert.throws(() => expect(value).toInclude(expected));
        });
      }
    });
  });
});
