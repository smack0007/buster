import { beforeEach, describe } from "node:test";
import { HELLO_WORLD_PATH, setupIntegrationTest, testCode0AndExpectedOutput } from "./integrationTest.ts";
import { chdir } from "../src/lib/os.ts";

describe("script", async () => {
  setupIntegrationTest();

  describe("cwd", () => {
    beforeEach(() => {
      chdir(HELLO_WORLD_PATH);
    });

    testCode0AndExpectedOutput([
      ["with colon", ["buster", "script", "run:bob"], "Hello Bob!\n"],
      ["with passed argument", ["buster", "script", "run", "bob"], "Hello bob!\n"],
      ["with colon and passed argument", ["buster", "script", "run:bob", "joe"], "Hello Bob joe!\n"],
    ]);
  });
});
