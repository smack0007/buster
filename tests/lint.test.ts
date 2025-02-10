import { beforeEach, describe } from "../src/lib/test.ts";
import { HELLO_WORLD_PATH, setupIntegrationTest, testCode0 } from "./integrationTest.ts";
import { chdir } from "../src/lib/os.ts";

describe("lint", async () => {
  setupIntegrationTest();

  describe("cwd", () => {
    beforeEach(() => {
      chdir(HELLO_WORLD_PATH);
    });

    testCode0([["without path", ["buster", "lint"]]]);
  });
});
