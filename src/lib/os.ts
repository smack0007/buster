import { type IOType, spawn } from "node:child_process";
import { type ArrayMinLength, type Enum } from "./types.ts";

export const IS_WINDOWS = false; // TODO: Implement this when we try to run on windows.

export function chdir(directory: string): void {
  return process.chdir(directory);
}

export function cwd(): string {
  return process.cwd();
}

export const ExecIOMode = {
  pipe: 0,
  inherit: 1,
} as const;
export type ExecIOMode = Enum<typeof ExecIOMode>;

export interface ExecOptions {
  stdin?: ExecIOMode | string;
  stdout?: ExecIOMode;
  stderr?: ExecIOMode;
}

export interface ExecResult {
  code: number;
  stdout: string;
  stderr: string;
}

function mapExecIOMode(value: ExecIOMode | undefined): IOType {
  if (value === undefined) {
    return "pipe";
  }

  switch (value) {
    case ExecIOMode.pipe:
      return "pipe";

    case ExecIOMode.inherit:
      return "inherit";
  }
}

export function exec(args: ArrayMinLength<string, 1>, options: ExecOptions = {}): Promise<ExecResult> {
  return new Promise((resolve, reject) => {
    try {
      const process = spawn(args[0], args.slice(1), {
        stdio: [
          typeof options.stdin === "string" ? "pipe" : mapExecIOMode(options.stdin),
          mapExecIOMode(options.stdout),
          mapExecIOMode(options.stderr),
        ],
      });

      let stdout = "";
      if (process.stdout) {
        process.stdout.on("data", (data) => {
          stdout += data.toString();
        });
      }

      let stderr = "";
      if (process.stderr) {
        process.stderr.on("data", (data) => {
          stderr += data.toString();
        });
      }

      function onCloseOrExit(code: number): void {
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

      if (typeof options.stdin === "string") {
        if (process.stdin) {
          process.stdin.write(options.stdin);
          process.stdin.end();
        } else {
          throw new Error("options.stdin is a string but process.stdin is null.");
        }
      }
    } catch (err) {
      reject(err);
    }
  });
}

export function exit(code?: number): never {
  process.exit(code);
}
