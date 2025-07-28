import { describe, it } from "node:test";
import { expect } from "expect";
import { BUSTER_TMP_PATH, setupIntegrationTest, testCode0 } from "./integrationTest.ts";
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
    testCode0([["tmp", ["buster", "init", BUSTER_TMP_PATH]]]);
  });
});
