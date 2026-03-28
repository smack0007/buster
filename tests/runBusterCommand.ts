import { spawn } from "node:child_process";
import { join, resolve } from "node:path";

const BUSTER_EXE = resolve(
  join(import.meta.dirname, "..", "bin", "buster"),
);

export async function runBusterCommand(
  args: string[],
): Promise<[number, string, string]> {
  return new Promise((resolve, reject) => {
    const child = spawn(BUSTER_EXE, args);

    let stdoutData = "";
    let stderrData = "";

    child.stdout.on("data", (data) => {
      stdoutData += data.toString();
    });

    child.stderr.on("data", (data) => {
      stderrData += data.toString();
    });

    child.on("close", (code) => {
      if (code === null) {
        reject("Result code was null.");
        return;
      }

      resolve([code, stdoutData, stderrData]);
    });

    child.on("error", (err) => {
      reject(err);
    });
  });
}
