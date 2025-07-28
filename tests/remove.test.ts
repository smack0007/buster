import { describe, it } from "node:test";
import { expect } from "expect";
import { CLICKER_PATH, HELLO_WORLD_PATH, setupIntegrationTest } from "./integrationTest.ts";
import { chdir, exec } from "../src/lib/os.ts";
import { exists, writeTextFile } from "../src/lib/fs.ts";
import { type ArrayMinLength } from "../src/lib/types.ts";
import { join } from "../src/lib/path.ts";
import { loadPackageJson } from "../src/lib/utils.ts";

async function insertIsNumberIntoPackageJson(projectPath: string): Promise<void> {
  const packageJsonPath = join([projectPath, "package.json"]);
  const packageJson = await loadPackageJson(packageJsonPath);
  if (!packageJson.dependencies) {
    packageJson.dependencies = {};
  }
  packageJson.dependencies["is-number"] = "7.0.0";
  await writeTextFile(packageJsonPath, JSON.stringify(packageJson, undefined, 2));
}

describe("add", async () => {
  setupIntegrationTest();

  describe("cwd", () => {
    const testdata: Array<[string, string, ArrayMinLength<string, 1>]> = [
      ["clicker", CLICKER_PATH, ["buster", "remove", "is-number"]],
      ["hello-world", HELLO_WORLD_PATH, ["buster", "remove", "is-number"]],
    ] as const;

    for (const [name, projectPath, command] of testdata) {
      it(name, async () => {
        chdir(projectPath);

        try {
          await insertIsNumberIntoPackageJson(projectPath);
          let result = await exec(["buster", "install"]);
          expect(result.code).toEqual(0);

          result = await exec(command);
          expect(result.code).toEqual(0);

          expect(await exists("node_modules")).toBe(true);
          expect(await exists("pnpm-lock.yaml")).toBe(true);
          expect(await exists(join(["node_modules", "is-number"]))).toBe(false);
        } finally {
          await exec(["git", "restore", join([projectPath, "package.json"])]);
        }
      });
    }
  });

  describe("--dir flag", () => {
    const testdata: Array<[string, string, ArrayMinLength<string, 1>]> = [
      ["clicker", CLICKER_PATH, ["buster", "remove", "--dir", CLICKER_PATH, "is-number"]],
      ["hello-world", HELLO_WORLD_PATH, ["buster", "remove", "--dir", HELLO_WORLD_PATH, "is-number"]],
    ] as const;

    for (const [name, projectPath, command] of testdata) {
      it(name, async () => {
        try {
          await insertIsNumberIntoPackageJson(projectPath);
          let result = await exec(["buster", "install", "--dir", projectPath]);
          expect(result.code).toEqual(0);

          result = await exec(command);
          expect(result.code).toEqual(0);

          expect(await exists(join([projectPath, "node_modules"]))).toBe(true);
          expect(await exists(join([projectPath, "node_modules", "is-number"]))).toBe(false);
          expect(await exists(join([projectPath, "pnpm-lock.yaml"]))).toBe(true);
        } finally {
          await exec(["git", "restore", join([projectPath, "package.json"])]);
        }
      });
    }
  });
});
