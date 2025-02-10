import { describe, expect, fail, it } from "./test.ts";
import { hasToStringMethod } from "./utils.ts";

describe("utils.ts", () => {
  describe("hasToStringMethod", () => {
    const testcases: [unknown, string][] = [
      [42n, "42"],
      [true, "true"],
      [42, "42"],
      ["foo", "foo"],
      [() => "foo", `()=>"foo"`],
      [{ toString: () => "foo" }, "foo"],
      [new Error("foo"), "Error: foo"],
    ];

    for (const [input, expected] of testcases) {
      it(`can call toString on ${(input as { constructor: { name: string } }).constructor.name}`, () => {
        if (hasToStringMethod(input)) {
          expect(input.toString()).toEqual(expected);
        } else {
          fail("hasToStringMethod returned false.");
        }
      });
    }
  });
});
