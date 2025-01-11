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

// ../../src/lib/colors.ts
import { styleText } from "node:util";
function red(text) {
  return styleText("red", text);
}

// ../../src/lib/fs.ts
import { mkdir, readdir, readFile, stat, symlink as nodeSymlink, writeFile } from "node:fs/promises";
async function exists(path) {
  try {
    await stat(path);
    return true;
  } catch {
  }
  return false;
}
async function readTextFile(path) {
  return await readFile(path, { encoding: "utf-8" });
}

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

// ../../src/lib/utils.ts
async function findPackageJson(directory = cwd()) {
  const packageJsonPath2 = join([directory, "package.json"]);
  if (await exists(packageJsonPath2)) {
    return packageJsonPath2;
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

// ../../src/lib/log.ts
function logError(message, error) {
  console.error(`${red("error")}: ${message}`);
  if (hasToStringMethod(error)) {
    console.error(error);
  }
}

// ../../src/script.ts
function escapeShellArg(arg) {
  return `'${arg.replace(/'/g, `'\\''`)}'`;
}
var args = parseArgs(process.argv.slice(2), {
  positional: {
    key: "script"
  },
  options: {}
});
if (args.script[0] === void 0) {
  logError("Please provide a script name to run.");
  exit(1);
}
var scriptName = args.script[0];
var scriptArgs = args.script.slice(1);
var packageJsonPath = await findPackageJson();
if (packageJsonPath === null) {
  logError("package.json not found.");
  exit(1);
}
var packageJson = await loadPackageJson(packageJsonPath);
if (!packageJson.scripts || packageJson.scripts[scriptName] === void 0) {
  logError(`Unknown script "${scriptName}".`);
  exit(1);
}
var command = packageJson.scripts[scriptName];
if (scriptArgs.length) {
  command += " " + scriptArgs.map(escapeShellArg).join(" ");
}
await exec(["/bin/bash", "-c", command], {
  stdout: ExecIOMode.inherit,
  stderr: ExecIOMode.inherit
});
