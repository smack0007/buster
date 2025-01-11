// ../../src/lib/args.ts
function parseArgs(args2, config) {
  let parseNextArgAsOptionName = null;
  const values = { [config.positional.key]: config.positional.single ? "" : [] };
  for (const arg of args2) {
    if (parseNextArgAsOptionName !== null) {
      const optionDesc = config.options[parseNextArgAsOptionName];
      switch (optionDesc.type) {
        case "number":
          values[parseNextArgAsOptionName] = +arg;
          break;
        case "string":
          values[parseNextArgAsOptionName] = arg;
          break;
      }
      parseNextArgAsOptionName = null;
    } else {
      for (const [optionName, optionDesc] of Object.entries(config.options)) {
        if (optionDesc.keys.includes(arg)) {
          parseNextArgAsOptionName = optionName;
          break;
        }
      }
      if (parseNextArgAsOptionName === null) {
        if (config.positional.single) {
          values[config.positional.key] = arg;
        } else {
          values[config.positional.key].push(arg);
        }
      }
    }
  }
  for (const configKey of Object.keys(config.options)) {
    if (values[configKey] === void 0 && config.options[configKey].default !== void 0) {
      values[configKey] = config.options[configKey].default;
    }
  }
  return values;
}

// ../../src/lib/fs.ts
import { mkdir, readdir, readFile, stat, symlink as nodeSymlink, writeFile } from "node:fs/promises";

// ../../src/lib/os.ts
import { spawn } from "node:child_process";
function cwd() {
  return process.cwd();
}
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
function exec(args2, options = {}) {
  return new Promise((resolve2, reject) => {
    try {
      let onCloseOrExit2 = function(code) {
        resolve2({
          code,
          stdout,
          stderr
        });
      };
      var onCloseOrExit = onCloseOrExit2;
      const process2 = spawn(args2[0], args2.slice(1), {
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
function exit(code) {
  process.exit(code);
}

// ../../src/lib/path.ts
import {
  basename as nodeBasename,
  dirname as nodeDirname,
  extname as nodeExtname,
  join as nodeJoin,
  resolve as nodeResolve
} from "node:path";
function dirname(path) {
  return nodeDirname(path);
}
function join(parts) {
  return nodeJoin(...parts);
}
function resolve(path) {
  return nodeResolve(path);
}

// ../../src/lib/utils.ts
async function findPackageJson(directory = cwd()) {
  const packageJsonPath = join([directory, "package.json"]);
  if (await exists(packageJsonPath)) {
    return packageJsonPath;
  }
  if (directory === "/") {
    return null;
  }
  return await findPackageJson(dirname(directory));
}
function hasToStringMethod(value) {
  return typeof value["toString"] === "function";
}
async function loadPackageJson(path) {
  return JSON.parse(await readTextFile(path));
}
function throwError(message) {
  throw new Error(message);
}

// ../../src/lib/fs.ts
async function exists(path) {
  try {
    await stat(path);
    return true;
  } catch {
  }
  return false;
}
async function isDirectory(path) {
  try {
    return (await stat(path)).isDirectory();
  } catch {
  }
  return false;
}
async function readTextFile(path) {
  return await readFile(path, { encoding: "utf-8" });
}

// ../../src/lib/colors.ts
import { styleText } from "node:util";
function red(text) {
  return styleText("red", text);
}

// ../../src/lib/log.ts
function logError(message, error) {
  console.error(`${red("error")}: ${message}`);
  if (hasToStringMethod(error)) {
    console.error(error);
  }
}

// ../../src/lib/common.ts
function getNodeModulesPath() {
  return process.env["BUSTER_NODE_MODULES_PATH"] ?? throwError("BUSTER_NODE_MODULES_PATH was not defined.");
}

// ../../src/bundle.ts
var NODE_MODULES_PATH = getNodeModulesPath();
var args = parseArgs(process.argv.slice(2), {
  positional: {
    key: "inputFile",
    single: true
  },
  options: {
    output: {
      keys: ["--output", "-o"],
      type: "string"
    }
  }
});
if (args.inputFile === "") {
  logError("Please provide an input file.");
  exit(1);
}
if (args.output === void 0) {
  logError("Please provide an output path via --output (-o).");
  exit(1);
}
var inputFile = resolve(args.inputFile);
var outputFile = resolve(args.output);
if (await isDirectory(inputFile)) {
  const packageJsonPath = await findPackageJson(inputFile);
  if (packageJsonPath === null) {
    logError("A directory was provided as the input and no package.json could be found.");
    exit(1);
  }
  const packageJson = await loadPackageJson(packageJsonPath);
  if (!packageJson.main) {
    logError("A directory was provided as the input and main is not set in the package.json.");
    exit(1);
  }
  inputFile = join([dirname(packageJsonPath), packageJson.main]);
}
await exec([
  join([NODE_MODULES_PATH, ".bin", "esbuild"]),
  inputFile,
  "--log-level=error",
  "--format=esm",
  "--platform=node",
  "--bundle",
  "--sourcemap=inline",
  `--outfile=${outputFile}`
]);
