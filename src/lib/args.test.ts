import { describe, it } from "node:test";
import { deepStrictEqual } from "assert";
import { parseArgs, ParseArgsConfig } from "./args.ts";

const FOO_BAR_CONFIG: ParseArgsConfig<"foo" | "bar"> = {
  foo: {
    keys: ["--foo", "-f"],
    type: "string",
    default: "foo",
  },
  bar: {
    keys: ["--bar", "-b"],
    type: "number",
    default: 42,
  },
};

describe("parseArgs", () => {
  it("basic test", () => {
    const args: string[] = ["--foo", "abc", "-b", "42"];
    deepStrictEqual(parseArgs(args, FOO_BAR_CONFIG), { _: [], foo: "abc", bar: 42 });
  });

  it("default args", () => {
    const args: string[] = [];
    deepStrictEqual(parseArgs(args, FOO_BAR_CONFIG), { _: [], foo: "foo", bar: 42 });
  });
});
