import { describe, it } from "node:test";
import { expect } from "expect";
import { CLICKER_PATH, HELLO_WORLD_PATH, setupIntegrationTest } from "./integrationTest.ts";
import { chdir, exec } from "../src/lib/os.ts";
import { exists, tryRemoveDirectory, tryRemoveFile } from "../src/lib/fs.ts";
import { type ArrayMinLength } from "../src/lib/types.ts";
import { join } from "../src/lib/path.ts";

describe("install", async () => {
  setupIntegrationTest();

  describe("cwd", () => {
    const testdata: Array<[string, string, ArrayMinLength<string, 1>]> = [
      ["clicker", CLICKER_PATH, ["buster", "install"]],
      ["hello-world", HELLO_WORLD_PATH, ["buster", "install"]],
    ] as const;

    for (const [name, projectPath, command] of testdata) {
      it(name, async () => {
        chdir(projectPath);
        await tryRemoveDirectory("node_modules");
        await tryRemoveFile("pnpm-lock.yaml");

        const result = await exec(command);
        expect(result.code).toEqual(0);

        expect(await exists("node_modules")).toBe(true);
        expect(await exists("pnpm-lock.yaml")).toBe(true);
      });
    }
  });

  describe("--dir flag", () => {
    const testdata: Array<[string, string, ArrayMinLength<string, 1>]> = [
      ["clicker", CLICKER_PATH, ["buster", "install", "--dir", CLICKER_PATH]],
      ["hello-world", HELLO_WORLD_PATH, ["buster", "install", "--dir", HELLO_WORLD_PATH]],
    ] as const;

    for (const [name, projectPath, command] of testdata) {
      it(name, async () => {
        await tryRemoveDirectory(join([projectPath, "node_modules"]));
        await tryRemoveFile(join([projectPath, "pnpm-lock.yaml"]));

        const result = await exec(command);
        expect(result.code).toEqual(0);

        expect(await exists(join([projectPath, "node_modules"]))).toBe(true);
        expect(await exists(join([projectPath, "pnpm-lock.yaml"]))).toBe(true);
      });
    }
  });
});
