import { describe, it } from "node:test";
import { deepStrictEqual } from "assert";
import { parseArgs, ParseArgsConfig } from "./args.ts";

const FOO_BAR_CONFIG: ParseArgsConfig = {
  foo: {
    keys: ["--foo", "-f"],
    type: "string",
  },
  bar: {
    keys: ["--bar", "-b"],
    type: "number",
  },
};

describe("parseArgs", () => {
  it("should work", () => {
    const args = ["--foo", "abc", "-b", "42"];
    deepStrictEqual(parseArgs(args, FOO_BAR_CONFIG), { _: [], foo: "abc", bar: 42 });
  });
});
