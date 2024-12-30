import { parseArgs, ParseArgsConfig } from "./args.ts";
import { describe, expect, it } from "./test.ts";

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

describe("args.ts", () => {
  describe("parseArgs", () => {
    it("basic test", () => {
      const args: string[] = ["--foo", "abc", "-b", "42"];
      expect(parseArgs(args, FOO_BAR_CONFIG)).toEqual({ _: [], foo: "abc", bar: 42 });
    });

    it("default args", () => {
      const args: string[] = [];
      expect(parseArgs(args, FOO_BAR_CONFIG)).toEqual({ _: [], foo: "foo", bar: 42 });
    });
  });
});
