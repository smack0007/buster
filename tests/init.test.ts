import { describe, it } from "node:test";
import { expect } from "expect";
import { BUSTER_TMP_PATH, setupIntegrationTest, testCode0, testExpectedCode } from "./integrationTest.ts";
import { exec } from "../src/lib/os.ts";

describe("init", async () => {
  setupIntegrationTest();

  describe("--list", () => {
    it("contains builtin templates", async () => {
      const result = await exec(["buster", "init", "--list"]);

      expect(result.code).toEqual(0);
      expect(result.stdout).toContain("'cli'");
    });
  });

  describe("path", () => {
    testExpectedCode([["invalid project type", ["buster", "init", "--type", "foobar"], 1]]);
    testCode0([
      ["default project type", ["buster", "init", BUSTER_TMP_PATH]],
      ["project type 'cli'", ["buster", "init", "--type", "cli", BUSTER_TMP_PATH]],
    ]);
  });
});
