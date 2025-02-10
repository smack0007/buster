import { getBusterPath, getBusterTmpPath } from "../src/lib/common.ts";
import { exists, removeDirectory } from "../src/lib/fs.ts";
import { chdir, exec } from "../src/lib/os.ts";
import { join } from "../src/lib/path.ts";
import { afterEach, beforeEach, expect, it } from "../src/lib/test.ts";
import { type ArrayMinLength } from "../src/lib/types.ts";

export const BUSTER_TMP_PATH = getBusterTmpPath();
export const BUSTER_TESTS_PATH = join([getBusterPath(), "tests"]);
export const BUSTER_TESTDATA_PATH = join([getBusterPath(), "testdata"]);

export const CLICKER_PATH = join([BUSTER_TESTDATA_PATH, "clicker"]);
export const HELLO_WORLD_PATH = join([BUSTER_TESTDATA_PATH, "hello-world"]);

export function setupIntegrationTest(): void {
  beforeEach(async () => {
    chdir(BUSTER_TESTS_PATH);

    if (await exists(BUSTER_TMP_PATH)) {
      await removeDirectory(BUSTER_TMP_PATH);
    }
  });

  afterEach(async () => {
    if (await exists(BUSTER_TMP_PATH)) {
      await removeDirectory(BUSTER_TMP_PATH);
    }
  });
}

export function testExpectedCode(testdata: Array<[string, ArrayMinLength<string, 1>, number]>): void {
  for (const [name, command, expected] of testdata) {
    it(name, async () => {
      const result = await exec(command);
      expect(result.code).toEqual(expected);
    });
  }
}

export function testCode0(testdata: Array<[string, ArrayMinLength<string, 1>]>): void {
  for (const [name, command] of testdata) {
    it(name, async () => {
      const result = await exec(command);
      expect(result.code).toEqual(0);
    });
  }
}

export function testCode0AndExpectedOutput(testdata: Array<[string, ArrayMinLength<string, 1>, string]>): void {
  for (const [name, command, expected] of testdata) {
    it(name, async () => {
      const result = await exec(command);

      expect(result.code).toEqual(0);
      expect(result.stdout).toEqual(expected);
    });
  }
}
