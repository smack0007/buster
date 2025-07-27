import { describe, it } from "node:test";
import { expect } from "expect";
import { exec } from "./os.ts";

describe("os.ts", () => {
  describe("exec", () => {
    it("can capture stdout", async () => {
      const result = await exec(["echo", "foo"]);
      expect(result.stdout).toEqual("foo\n");
    });

    it("can capture stderr", async () => {
      const result = await exec(["awk", ' BEGIN { print "foo" > "/dev/stderr" }']);
      expect(result.stderr).toEqual("foo\n");
    });
  });
});
