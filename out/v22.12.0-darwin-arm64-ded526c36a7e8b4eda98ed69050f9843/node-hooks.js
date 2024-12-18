// ../buster/src/node-hooks.ts
import { join } from "node:path";

// ../buster/src/os.js
import { spawn } from "node:child_process";
function exec(args, options) {
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
        stdio: "pipe"
      });
      let stdout = "";
      process2.stdout.on("data", (data) => {
        stdout += data.toString();
      });
      let stderr = "";
      process2.stderr.on("data", (data) => {
        stderr += data.toString();
      });
      process2.on("close", onCloseOrExit2);
      process2.on("exit", onCloseOrExit2);
      process2.on("error", (err) => {
        reject(err);
      });
      process2.stdin.write(options.stdin);
      process2.stdin.end();
    } catch (err) {
      reject(err);
    }
  });
}

// ../buster/src/utils.ts
function throwError(message) {
  throw new Error(message);
}

// ../buster/src/node-hooks.ts
var BUSTER_NODE_MODULES_PATH = process.env.BUSTER_NODE_MODULES_PATH ?? throwError("BUSTER_NODE_MODULES_PATH was not defined.");
var extensionsRegex = /\.(ts|tsx)$/;
async function load(url, context, nextLoad) {
  if (extensionsRegex.test(url)) {
    const { source } = await nextLoad(url, {
      ...context,
      format: "module"
    });
    const result = await esbuild(source.toString());
    if (result.code != 0) {
      throw new Error(
        `Failed to transpile TypeScript (${result.code}): ` + result.stderr
      );
    }
    return {
      format: "module",
      shortCircuit: true,
      source: result.stdout
    };
  }
  return nextLoad(url);
}
async function esbuild(source) {
  return await exec(
    [join(BUSTER_NODE_MODULES_PATH, ".bin", "esbuild"), "--loader=ts"],
    {
      stdin: source
    }
  );
}
export {
  load
};
