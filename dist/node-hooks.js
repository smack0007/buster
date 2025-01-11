// ../../src/lib/os.ts
import { spawn } from "node:child_process";
var ExecIOMode = {
  pipe: 0,
  inherit: 1
};
function mapExecIOMode(value) {
  if (value === void 0) {
    return "pipe";
  }
  switch (value) {
    case ExecIOMode.pipe:
      return "pipe";
    case ExecIOMode.inherit:
      return "inherit";
  }
}
function exec(args, options = {}) {
  return new Promise((resolve, reject) => {
    try {
      let onCloseOrExit2 = function(code) {
        resolve({
          code,
          stdout,
          stderr
        });
      };
      var onCloseOrExit = onCloseOrExit2;
      const process2 = spawn(args[0], args.slice(1), {
        stdio: [
          typeof options.stdin === "string" ? "pipe" : mapExecIOMode(options.stdin),
          mapExecIOMode(options.stdout),
          mapExecIOMode(options.stderr)
        ]
      });
      let stdout = "";
      if (process2.stdout) {
        process2.stdout.on("data", (data) => {
          stdout += data.toString();
        });
      }
      let stderr = "";
      if (process2.stderr) {
        process2.stderr.on("data", (data) => {
          stderr += data.toString();
        });
      }
      process2.on("close", onCloseOrExit2);
      process2.on("exit", onCloseOrExit2);
      process2.on("error", (err) => {
        reject(err);
      });
      if (typeof options.stdin === "string") {
        if (process2.stdin) {
          process2.stdin.write(options.stdin);
          process2.stdin.end();
        } else {
          throw new Error("options.stdin is a string but process.stdin is null.");
        }
      }
    } catch (err) {
      reject(err);
    }
  });
}

// ../../src/lib/utils.ts
function throwError(message) {
  throw new Error(message);
}

// ../../src/lib/common.ts
function getNodeModulesPath() {
  return process.env["BUSTER_NODE_MODULES_PATH"] ?? throwError("BUSTER_NODE_MODULES_PATH was not defined.");
}

// ../../src/node-hooks.ts
import { join as join2 } from "node:path";
var NODE_MODULES_PATH = getNodeModulesPath();
var extensionsRegex = /\.(ts|tsx)$/;
async function load(url, context, nextLoad) {
  if (extensionsRegex.test(url)) {
    const { source } = await nextLoad(url, {
      ...context,
      format: "module"
    });
    const result = await esbuild(url, source.toString());
    if (result.code != 0) {
      throw new Error(`Failed to transpile TypeScript (${result.code}): ` + result.stderr);
    }
    return {
      format: "module",
      shortCircuit: true,
      source: result.stdout
    };
  }
  return nextLoad(url, context);
}
async function esbuild(url, source) {
  return await exec(
    [join2(NODE_MODULES_PATH, ".bin", "esbuild"), `--sourcefile=${url}`, "--loader=ts", "--sourcemap=inline"],
    {
      stdin: source
    }
  );
}
export {
  load
};
