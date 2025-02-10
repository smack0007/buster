import {
  BUSTER_TESTDATA_PATH,
  HELLO_WORLD_PATH,
  setupIntegrationTest,
  testCode0AndExpectedOutput,
} from "./integrationTest.ts";
import { join } from "../src/lib/path.ts";
import { describe } from "../src/lib/test.ts";

describe("run", async () => {
  setupIntegrationTest();

  testCode0AndExpectedOutput([
    ["with directory path", ["buster", "run", HELLO_WORLD_PATH], "Hello World!\n"],
    [
      "with file path",
      ["buster", "run", join([BUSTER_TESTDATA_PATH, "hello-world", "src", "main.ts"])],
      "Hello World!\n",
    ],
  ]);
});
