import { describe, it } from "node:test";
import { expect } from "expect";
import { parseArgs, type ParseArgsConfig } from "./args.ts";

const FOO_BAR_CONFIG = {
  positional: {
    key: "values",
  },
  options: {
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
  },
} satisfies ParseArgsConfig<"values", "foo" | "bar">;

const SINGLE_POSITIONAL_CONFIG = {
  positional: {
    key: "values",
    single: true,
  },
  options: { ...FOO_BAR_CONFIG.options },
} satisfies ParseArgsConfig<"values", "foo">;

describe("args.ts", () => {
  describe("parseArgs", () => {
    it("basic test", () => {
      const args: string[] = ["--foo", "abc", "-b", "42"];
      expect(parseArgs(args, FOO_BAR_CONFIG)).toEqual({ values: [], foo: "abc", bar: 42 });
    });

    it("default args", () => {
      const args: string[] = [];
      expect(parseArgs(args, FOO_BAR_CONFIG)).toEqual({ values: [], foo: "foo", bar: 42 });
    });

    it("single positional", () => {
      const args: string[] = ["foo"];
      expect(parseArgs(args, SINGLE_POSITIONAL_CONFIG)).toEqual({ values: "foo", foo: "foo", bar: 42 });
    });
  });
});
