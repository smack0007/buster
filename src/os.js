import { spawn } from "node:child_process";

export function exec(args, options) {
  return new Promise((resolve, reject) => {
    try {
      const process = spawn(args[0], args.slice(1), {
        stdio: "pipe",
      });

      let stdout = "";
      process.stdout.on("data", (data) => {
        stdout += data.toString();
      });

      let stderr = "";
      process.stderr.on("data", (data) => {
        stderr += data.toString();
      });

      function onCloseOrExit(code) {
        resolve({
          code,
          stdout,
          stderr,
        });
      }

      process.on("close", onCloseOrExit);

      process.on("exit", onCloseOrExit);

      process.on("error", (err) => {
        reject(err);
      });

      process.stdin.write(options.stdin);
      process.stdin.end();
    } catch (err) {
      reject(err);
    }
  });
}
