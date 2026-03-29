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

  describe("includes", () => {
    describe("does not throw", () => {
      const testCases: Array<[string, string]> = [
        ["foobar", "oba"],
      ];

      for (const [value, expected] of testCases) {
        it(`expect(${value}).includes(${expected})`, () => {
          expect(value).includes(expected);
        });
      }
    });

    describe("throws", () => {
      const testCases: Array<[string, string]> = [
        ["foobar", "baz"],
      ];

      for (const [value, expected] of testCases) {
        it(`expect(${value}).toEqual(${expected})`, () => {
          assert.throws(() => expect(value).includes(expected));
        });
      }
    });
  });
});
