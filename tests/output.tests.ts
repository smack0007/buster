import { equal } from "node:assert";
import { exec } from "node:child_process";
import { readdir, readFile } from "node:fs/promises";
import { join } from "node:path";
import { chdir } from "node:process";
import { describe, it } from "node:test";

const dirname = import.meta.dirname ?? "";
chdir(dirname);

async function runCommand(command: string): Promise<[string, string]> {
  return new Promise((resolve, reject) => {
    exec(command, (error, stdout, stderr) => {
      if (error) {
        reject(error);
      }
      resolve([stdout, stderr]);
    });
  });
}

const testFiles = (await readdir(dirname, { recursive: true }))
  .filter((x) => x.endsWith(".test.json"))
  .sort();

interface TestCase {
  command: string;
  stdout?: string;
  stderr?: string;
}

describe("Buster Tests", () => {
  for (const file of testFiles) {
    it(`${file}`, async () => {
      const filePath = join(dirname, file);

      const testCase = JSON.parse(
        await readFile(filePath, "utf-8"),
      ) as TestCase;

      const [stdout, stderr] = await runCommand(testCase.command);

      if (testCase.stdout) {
        equal(stdout.trim(), (testCase.stdout ?? "").trim());
      }

      if (testCase.stderr) {
        equal(stderr.trim(), (testCase.stderr ?? "").trim());
      }
    });
  }
});
