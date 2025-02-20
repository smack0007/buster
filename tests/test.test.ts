import { beforeEach, describe } from "@buster/test";
import { HELLO_WORLD_PATH, setupIntegrationTest, testCode0 } from "./integrationTest.ts";
import { chdir, exec } from "../src/lib/os.ts";

describe("test", async () => {
  setupIntegrationTest();

  describe("cwd", () => {
    beforeEach(async () => {
      chdir(HELLO_WORLD_PATH);
      await exec(["buster", "install"]);
    });

    testCode0([["without args", ["buster", "test"]]]);
  });
});
