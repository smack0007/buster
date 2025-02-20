import { describe } from "@buster/test";
import { BUSTER_TMP_PATH, setupIntegrationTest, testCode0 } from "./integrationTest.ts";

describe("init", async () => {
  setupIntegrationTest();

  describe("path", () => {
    testCode0([["tmp", ["buster", "init", BUSTER_TMP_PATH]]]);
  });
});
