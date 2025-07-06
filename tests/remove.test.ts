import { describe, expect, it } from "@buster/test";
import { CLICKER_PATH, HELLO_WORLD_PATH, setupIntegrationTest } from "./integrationTest.ts";
import { chdir, exec } from "../src/lib/os.ts";
import { exists, removeFile, writeTextFile } from "../src/lib/fs.ts";
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

describe("remove", async () => {
  setupIntegrationTest();

  describe("cwd", () => {
    const testdata: Array<[string, string, ArrayMinLength<string, 1>]> = [
      ["clicker", CLICKER_PATH, ["buster", "remove", "is-number"]],
      ["hello-world", HELLO_WORLD_PATH, ["buster", "remove", "is-number"]],
    ] as const;

    for (const [name, projectPath, command] of testdata) {
      it(name, async () => {
        if (await exists(join([projectPath, "pnpm-lock.yaml"]))) {
					await removeFile(join([projectPath, "pnpm-lock.yaml"]));
				}
				
				chdir(projectPath);

        try {
          await insertIsNumberIntoPackageJson(projectPath);
          let result = await exec(["buster", "install"]);
          expect(result.code).toEqual(0);

          result = await exec(command);
          expect(result.code).toEqual(0);

          expect(await exists("node_modules")).toBeTrue();
          expect(await exists("pnpm-lock.yaml")).toBeTrue();
          expect(await exists(join(["node_modules", "is-number"]))).toBeFalse();
          expect(await exists(join(["node_modules", "@buster"]))).toBeTrue();
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
        if (await exists(join([projectPath, "pnpm-lock.yaml"]))) {
					await removeFile(join([projectPath, "pnpm-lock.yaml"]));
				}
				
				try {
          await insertIsNumberIntoPackageJson(projectPath);
          let result = await exec(["buster", "install", "--dir", projectPath]);
          expect(result.code).toEqual(0, "buster install failed.");

          result = await exec(command);
          expect(result.code).toEqual(0, `${command.join(" ")} failed.`);

          expect(await exists(join([projectPath, "node_modules"]))).toBeTrue("node_modules does not exist.");
          expect(await exists(join([projectPath, "node_modules", "is-number"]))).toBeFalse("is-number still exists.");
          expect(await exists(join([projectPath, "node_modules", "@buster"]))).toBeTrue(
            "node_modules/@buster does not exist.",
          );
          expect(await exists(join([projectPath, "pnpm-lock.yaml"]))).toBeTrue("pnpm-lock.yaml does not exist.");
        } finally {
          await exec(["git", "restore", join([projectPath, "package.json"])]);
        }
      });
    }
  });
});
