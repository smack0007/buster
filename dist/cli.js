var __defProp = Object.defineProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};

// ../../src/lib/colors.ts
import { styleText } from "node:util";
function red(text) {
  return styleText("red", text);
}

// ../../src/lib/fs.ts
import { mkdir, readdir, readFile, stat, symlink as nodeSymlink, writeFile } from "node:fs/promises";
async function ensureDirectory(path) {
  try {
    await mkdir(path, { recursive: true });
  } catch (err) {
    assertError(err);
    if (isNodeError(err) && err.code !== "EEXIST") {
      throw err;
    }
  }
}
async function exists(path) {
  try {
    await stat(path);
    return true;
  } catch {
  }
  return false;
}
async function symlink(target, path) {
  return await nodeSymlink(target, path);
}

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
function join(parts) {
  return nodeJoin(...parts);
}

// ../../src/lib/utils.ts
function assertError(error) {
  if (!(error instanceof Error)) {
    throw new Error(`Unexpected error type: ${typeof error}`);
  }
}
function isNodeError(error) {
  return typeof error.code === "string";
}
function hasToStringMethod(value) {
  return typeof value["toString"] === "function";
}
function throwError(message) {
  throw new Error(message);
}

// ../../src/lib/log.ts
function logError(message, error) {
  console.error(`${red("error")}: ${message}`);
  if (hasToStringMethod(error)) {
    console.error(error);
  }
}

// ../../src/add.ts
var add_exports = {};
__export(add_exports, {
  parse: () => parse,
  run: () => run
});

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

// ../../src/lib/common.ts
function getBusterPath() {
  return process.env["BUSTER_PATH"] ?? throwError("BUSTER_PATH was not defined.");
}
function getPNPMPath() {
  return process.env["BUSTER_PNPM_PATH"] ?? throwError("BUSTER_PNPM_PATH was not defined.");
}
async function trySymlink(target, path) {
  if (!await exists(path)) {
    try {
      await symlink(target, path);
    } catch (err) {
      logError(`Failed to create symlink "${path}" => "${target}".`, err);
    }
  }
}

// ../../src/add.ts
function parse(args2) {
  return parseArgs(args2, {
    positional: {
      key: "dependencies"
    },
    options: {
      directory: {
        keys: ["--dir"],
        type: "string"
      }
    }
  });
}
async function run(args2) {
  const pnpmExePath = join([getPNPMPath(), "pnpm"]);
  let options = [];
  if (args2.directory) {
    options.push("--dir", args2.directory);
  }
  console.info([pnpmExePath, "add", ...options, ...args2.dependencies]);
  const result = await exec([pnpmExePath, "add", ...options, ...args2.dependencies], {
    stdout: ExecIOMode.inherit,
    stderr: ExecIOMode.inherit
  });
  return result.code;
}

// ../../src/install.ts
var install_exports = {};
__export(install_exports, {
  parse: () => parse2,
  run: () => run2
});
function parse2(args2) {
  return parseArgs(args2, {
    positional: {
      key: "_"
    },
    options: {
      directory: {
        keys: ["--dir"],
        type: "string"
      }
    }
  });
}
async function run2(args2) {
  const pnpmExePath = join([getPNPMPath(), "pnpm"]);
  let options = [];
  if (args2.directory) {
    options.push("--dir", args2.directory);
  }
  const result = await exec([pnpmExePath, "install", ...options], {
    stdout: ExecIOMode.inherit,
    stderr: ExecIOMode.inherit
  });
  if (result.code === 0) {
    try {
      const busterPath = getBusterPath();
      await ensureDirectory(join([args2.directory ?? ".", "node_modules", "@buster"]));
      await trySymlink(
        join([busterPath, "configs"]),
        join([args2.directory ?? ".", "node_modules", "@buster", "configs"])
      );
    } catch (err) {
      logError("Failed while linking in buster.", err);
    }
  }
  return result.code;
}

// ../../src/remove.ts
var remove_exports = {};
__export(remove_exports, {
  parse: () => parse3,
  run: () => run3
});
function parse3(args2) {
  return parseArgs(args2, {
    positional: {
      key: "dependencies"
    },
    options: {
      directory: {
        keys: ["--dir"],
        type: "string"
      }
    }
  });
}
async function run3(args2) {
  const pnpmExePath = join([getPNPMPath(), "pnpm"]);
  let options = [];
  if (args2.directory) {
    options.push("--dir", args2.directory);
  }
  const result = await exec([pnpmExePath, "remove", ...options, ...args2.dependencies], {
    stdout: ExecIOMode.inherit,
    stderr: ExecIOMode.inherit
  });
  return result.code;
}

// ../../src/cli.ts
var args = process.argv.slice(2);
var commands = {
  add: add_exports,
  install: install_exports,
  remove: remove_exports
};
if (args[0] !== void 0) {
  const command = commands[args[0]];
  if (!command) {
    logError("Unknown command.");
    exit(1);
  }
  try {
    exit(await command.run(command.parse(args.slice(1))));
  } catch (err) {
    logError("An unexpected error occured.", err);
    exit(1);
  }
} else {
  logError("Please provide a command.");
  exit(1);
}
