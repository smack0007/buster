import { beforeEach, describe } from "@buster/test";
import {
  BUSTER_TESTDATA_PATH,
  HELLO_WORLD_PATH,
  setupIntegrationTest,
  testCode0,
  testExpectedCode,
} from "./integrationTest.ts";
import { chdir } from "../src/lib/os.ts";
import { join } from "../src/lib/path.ts";

describe("check", async () => {
  setupIntegrationTest();

  describe("directory", () => {
    testCode0([["hello-world directory", ["buster", "check", HELLO_WORLD_PATH]]]);

    testExpectedCode([["testdata directory", ["buster", "check", BUSTER_TESTDATA_PATH], 1]]);
  });

  describe("file", () => {
    testCode0([["tsconfig.json", ["buster", "check", join([HELLO_WORLD_PATH, "tsconfig.json"])]]]);

    testExpectedCode([["project.json", ["buster", "check", join([HELLO_WORLD_PATH, "project.json"])], 1]]);
  });

  describe("cwd", () => {
    beforeEach(() => {
      chdir(HELLO_WORLD_PATH);
    });

    testCode0([
      ["without path", ["buster", "check"]],
      ["path is '.'", ["buster", "check", "."]],
    ]);
  });
});
