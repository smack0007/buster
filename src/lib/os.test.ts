import { strictEqual } from "node:assert";
import { describe, it } from "node:test";
import { exec } from "./os.ts";

describe("os.ts", () => {
  describe("exec", () => {
    it("can capture stdout", async () => {
      const result = await exec(["echo", "foo"]);
      strictEqual(result.stdout, "foo\n");
    });

    it("can capture stderr", async () => {
      const result = await exec(["awk", ' BEGIN { print "foo" > "/dev/fd/2" }']);
      strictEqual(result.stderr, "foo\n");
    });
  });
});
