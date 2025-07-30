var __defProp = Object.defineProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};

// src/lib/colors.ts
import util from "node:util";
function toJsonColor(obj) {
  return util.inspect(obj, { compact: false, colors: true });
}
function red(text) {
  return util.styleText("red", text);
}

// src/lib/fs.ts
import { mkdir, readdir, readFile, rm, stat, symlink as nodeSymlink, writeFile } from "node:fs/promises";

// src/lib/path.ts
import {
  basename as nodeBasename,
  dirname as nodeDirname,
  extname as nodeExtname,
  join as nodeJoin,
  resolve as nodeResolve
} from "node:path";

// src/lib/os.ts
import { spawn } from "node:child_process";
var IS_WINDOWS = false;
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

// src/lib/path.ts
var SEPERATOR = IS_WINDOWS ? "\\" : "/";
function basename(path) {
  return nodeBasename(path);
}
function dirname(path) {
  return nodeDirname(path);
}
function ensurePathIsString(path) {
  if (Array.isArray(path)) {
    return join(path);
  }
  return path;
}
function join(parts) {
  return nodeJoin(...parts);
}
function resolve(path) {
  return nodeResolve(path);
}
function split(path) {
  return path.split(SEPERATOR);
}

// src/lib/fs.ts
async function ensureDirectory(path) {
  try {
    await mkdir(ensurePathIsString(path), { recursive: true });
  } catch (err) {
    assertError(err);
    if (isNodeError(err) && err.code !== "EEXIST") {
      throw err;
    }
  }
}
async function exists(path) {
  try {
    await stat(ensurePathIsString(path));
    return true;
  } catch {
  }
  return false;
}
async function isDirectory(path) {
  try {
    return (await stat(ensurePathIsString(path))).isDirectory();
  } catch {
  }
  return false;
}
async function listDirectories(path) {
  return (await readdir(ensurePathIsString(path), { withFileTypes: true })).filter((entry) => entry.isDirectory()).map((entry) => entry.name);
}
async function listFiles(path, options = {}, basePath = "") {
  const entries = await readdir(ensurePathIsString(path), { withFileTypes: true });
  if (!options.recursive) {
    return entries.filter((entry) => !entry.isDirectory()).map((entry) => entry.name);
  }
  const results = [];
  for (const entry of entries) {
    const entryFileName = join([basePath, entry.name]);
    if (entry.isDirectory()) {
      results.push(...await listFiles([ensurePathIsString(path), entry.name], options, entryFileName));
    } else {
      results.push(entryFileName);
    }
  }
  return results;
}
async function readTextFile(path) {
  return await readFile(ensurePathIsString(path), { encoding: "utf-8" });
}
async function removeDirectory(path) {
  await rm(ensurePathIsString(path), { recursive: true });
}
async function writeTextFile(path, data) {
  await writeFile(ensurePathIsString(path), data, { encoding: "utf-8" });
}

// src/lib/utils.ts
function assertError(error) {
  if (!(error instanceof Error)) {
    throw new Error(`Unexpected error type: ${typeof error}`);
  }
}
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
function isNodeError(error) {
  return typeof error.code === "string";
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

// src/lib/log.ts
function logError(message, error) {
  console.error(`${red("error")}: ${message}`);
  if (error && hasToStringMethod(error)) {
    console.error(error);
  }
}
function logMessage(message) {
  console.info(message);
}

// src/add.ts
var add_exports = {};
__export(add_exports, {
  parse: () => parse,
  run: () => run
});

// src/lib/args.ts
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
      let isBoolean = false;
      for (const [optionName, optionDesc] of Object.entries(config.options)) {
        if (optionDesc.keys.includes(arg)) {
          if (optionDesc.type === "boolean") {
            isBoolean = true;
            values[optionName] = true;
          } else {
            parseNextArgAsOptionName = optionName;
          }
          break;
        }
      }
      if (parseNextArgAsOptionName === null && !isBoolean) {
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

// src/lib/common.ts
function getBusterPath() {
  return process.env["BUSTER_PATH"] ?? throwError("BUSTER_PATH was not defined.");
}
function getBusterExtPath() {
  return join([getBusterPath(), "ext"]);
}
function getBusterTemplatesPath() {
  return join([getBusterPath(), "templates"]);
}
function getNodePath() {
  return process.env["BUSTER_NODE_PATH"] ?? throwError("BUSTER_NODE_PATH was not defined.");
}
function getNodeExe() {
  return join([getNodePath(), "bin", "node"]);
}
function getNodeOptions() {
  const busterPath = getBusterPath();
  const result = process.env["BUSTER_NODE_OPTIONS"]?.split(" ") ?? throwError("BUSTER_NODE_OPTIONS was not defined.");
  result.push(`--env-file=${busterPath}/buster.env`);
  return result;
}
function getPNPMPath() {
  return process.env["BUSTER_PNPM_PATH"] ?? throwError("BUSTER_PNPM_PATH was not defined.");
}
function getPNPMExe() {
  return join([getPNPMPath(), "pnpm"]);
}
function getNodeModulesPath() {
  return process.env["BUSTER_NODE_MODULES_PATH"] ?? throwError("BUSTER_NODE_MODULES_PATH was not defined.");
}
function getOxlintExe() {
  return join([getNodeModulesPath(), ".bin", "oxlint"]);
}
function getTSCExe() {
  return join([getNodeModulesPath(), ".bin", "tsc"]);
}
var ProjectType = {
  cli: "cli",
  web: "web"
};
function ensureProjectType(type) {
  if (type === void 0) {
    logError("Please provide a project type.");
    exit(1);
  }
  const projectTypes = Object.values(ProjectType);
  if (!projectTypes.includes(type)) {
    logError(
      `Project type "${type}" is invalid. Valid project types are ${projectTypes.map((x) => `"${x}"`).join(", ")}.`
    );
    exit(1);
  }
  return type;
}
async function signalReplaceProcessAndExit(args2) {
  const replacementSignal = process.env["BUSTER_REPLACE_SIGNAL"] ?? throwError("BUSTER_REPLACE_SIGNAL was not defined.");
  await writeTextFile(replacementSignal, args2.join(" "));
  exit(0);
}

// src/add.ts
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
  const pnpmExe = getPNPMExe();
  let options = [];
  if (args2.directory) {
    options.push("--dir", args2.directory);
  }
  const result = await exec([pnpmExe, "add", ...options, ...args2.dependencies], {
    stdout: ExecIOMode.inherit,
    stderr: ExecIOMode.inherit
  });
  return result.code;
}

// src/check.ts
var check_exports = {};
__export(check_exports, {
  parse: () => parse2,
  run: () => run2
});
function parse2(args2) {
  return parseArgs(args2, {
    positional: {
      key: "path",
      single: true
    },
    options: {}
  });
}
async function run2(args2) {
  const tscExe = getTSCExe();
  let path = resolve(args2.path ?? cwd());
  if (await isDirectory(path)) {
    if (await exists(join([path, "tsconfig.json"]))) {
      path = join([path, "tsconfig.json"]);
    }
  }
  await signalReplaceProcessAndExit([tscExe, "--noEmit", "-p", path]);
  return 0;
}

// src/gc.ts
var gc_exports = {};
__export(gc_exports, {
  parse: () => parse3,
  run: () => run3
});
function parse3(args2) {
  return parseArgs(args2, {
    positional: {
      key: "_",
      single: true
    },
    options: {}
  });
}
async function run3(_args) {
  const busterExtPath = getBusterExtPath();
  for (const dir of await listDirectories(busterExtPath)) {
    if (dir.startsWith("node")) {
      if (dir !== basename(getNodePath())) {
        console.info(`Removing "${dir}"...`);
        await removeDirectory(join([busterExtPath, dir]));
      }
    } else if (dir.startsWith("pnpm")) {
      if (dir !== basename(getPNPMPath())) {
        console.info(`Removing "${dir}"...`);
        await removeDirectory(join([busterExtPath, dir]));
      }
    }
  }
  return 0;
}

// src/init.ts
var init_exports = {};
__export(init_exports, {
  parse: () => parse4,
  run: () => run4
});
function parse4(args2) {
  return parseArgs(args2, {
    positional: {
      key: "directory",
      single: true
    },
    options: {
      list: {
        keys: ["--list", "-l"],
        type: "boolean",
        default: false
      },
      type: {
        keys: ["--type", "-t"],
        type: "string",
        default: "cli"
      }
    }
  });
}
async function run4(args2) {
  const projectTypes = await getProjectTypes();
  if (args2.list) {
    logMessage(`Project types: ${toJsonColor(projectTypes)}`);
    return 0;
  }
  if (!projectTypes.includes(args2.type)) {
    logError(`Invalid project type: "${args2.type}"`);
    return 1;
  }
  const path = resolve(args2.directory ?? process.cwd());
  const projectType = ensureProjectType(args2.type);
  logMessage(`Initializing buster "${projectType}" project at "${path}"...`);
  await ensureDirectory(path);
  const projectName = path.split("/").reverse()[0];
  logMessage(`Project name infered to be '${projectName}'.`);
  const templateVars = {
    projectType,
    projectName
  };
  logMessage(`Template variables: ${toJsonColor(templateVars)}`);
  const baseFiles = await listFiles([getBusterTemplatesPath(), "base"], { recursive: true });
  const templateFiles = await listFiles([getBusterTemplatesPath(), projectType], { recursive: true });
  for (const baseFile of baseFiles) {
    if (!templateFiles.includes(baseFile)) {
      const srcPath = join([getBusterTemplatesPath(), "base", baseFile]);
      const destPath = join([path, baseFile]);
      logMessage(`Writing "${destPath}" from "${srcPath}"...`);
      await writeTemplateFile(srcPath, destPath, templateVars);
    }
  }
  for (const templateFile of templateFiles) {
    const srcPath = join([getBusterTemplatesPath(), projectType, templateFile]);
    const destPath = join([path, templateFile]);
    logMessage(`Writing "${destPath}" from "${srcPath}"...`);
    await writeTemplateFile(srcPath, destPath, templateVars);
  }
  return 0;
}
async function getProjectTypes() {
  const builtinTemplates = (await listDirectories(getBusterTemplatesPath())).filter((x) => x !== "base");
  return builtinTemplates;
}
async function writeTemplateFile(srcPath, destPath, vars) {
  if (await exists(destPath)) {
    const isBusterFile = split(srcPath).includes(".buster");
    if (!isBusterFile) {
      logMessage("  => File already exists. Skipping.");
      return;
    } else {
      logMessage("  => File exists but is managed by buster. Overwriting.");
    }
  }
  await ensureDirectory(dirname(destPath));
  let contents = await readTextFile(srcPath);
  for (const [key, value] of Object.entries(vars)) {
    contents = contents.replaceAll("${{" + key + "}}", value);
  }
  await writeTextFile(destPath, contents);
}

// src/install.ts
var install_exports = {};
__export(install_exports, {
  parse: () => parse5,
  run: () => run5
});
function parse5(args2) {
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
async function run5(args2) {
  const pnpmExe = getPNPMExe();
  let options = [];
  if (args2.directory) {
    options.push("--dir", args2.directory);
  }
  const result = await exec([pnpmExe, "install", ...options], {
    stdout: ExecIOMode.inherit,
    stderr: ExecIOMode.inherit
  });
  return result.code;
}

// src/lint.ts
var lint_exports = {};
__export(lint_exports, {
  parse: () => parse6,
  run: () => run6
});
function parse6(args2) {
  return parseArgs(args2, {
    positional: {
      key: "path",
      single: true
    },
    options: {}
  });
}
async function run6(args2) {
  const oxlintExe = getOxlintExe();
  let path = resolve(args2.path ?? cwd());
  await signalReplaceProcessAndExit([oxlintExe, path]);
  return 0;
}

// src/remove.ts
var remove_exports = {};
__export(remove_exports, {
  parse: () => parse7,
  run: () => run7
});
function parse7(args2) {
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
async function run7(args2) {
  const pnpmExe = getPNPMExe();
  let options = [];
  if (args2.directory) {
    options.push("--dir", args2.directory);
  }
  const result = await exec([pnpmExe, "remove", ...options, ...args2.dependencies], {
    stdout: ExecIOMode.inherit,
    stderr: ExecIOMode.inherit
  });
  return result.code;
}

// src/run.ts
var run_exports = {};
__export(run_exports, {
  parse: () => parse8,
  run: () => run8
});
function parse8(args2) {
  return parseArgs(args2, {
    positional: {
      key: "scriptArgs"
    },
    options: {}
  });
}
async function run8(args2) {
  const nodeExe = getNodeExe();
  await signalReplaceProcessAndExit([nodeExe, ...getNodeOptions(), ...args2.scriptArgs]);
  return 0;
}

// src/script.ts
var script_exports = {};
__export(script_exports, {
  parse: () => parse9,
  run: () => run9
});
function parse9(args2) {
  return parseArgs(args2, {
    positional: {
      key: "script"
    },
    options: {}
  });
}
function escapeShellArg(arg) {
  return `'${arg.replace(/'/g, `'\\''`)}'`;
}
async function run9(args2) {
  if (args2.script[0] === void 0) {
    logError("Please provide a script name to run.");
    exit(1);
  }
  const scriptName = args2.script[0];
  const scriptArgs = args2.script.slice(1);
  const packageJsonPath = await findPackageJson();
  if (packageJsonPath === null) {
    logError("package.json not found.");
    exit(1);
  }
  const packageJson = await loadPackageJson(packageJsonPath);
  if (!packageJson.scripts || packageJson.scripts[scriptName] === void 0) {
    logError(`Unknown script "${scriptName}".`);
    exit(1);
  }
  let command = packageJson.scripts[scriptName];
  if (scriptArgs.length) {
    command += " " + scriptArgs.map(escapeShellArg).join(" ");
  }
  const result = await exec(["/bin/bash", "-c", command], {
    stdout: ExecIOMode.inherit,
    stderr: ExecIOMode.inherit
  });
  return result.code;
}

// src/serve.ts
var serve_exports = {};
__export(serve_exports, {
  parse: () => parse10,
  run: () => run10
});
import { createServer as viteCreateServer } from "vite";
function parse10(args2) {
  return parseArgs(args2, {
    positional: {
      key: "servePath",
      single: true
    },
    options: {
      host: {
        keys: ["--host", "-h"],
        type: "string",
        default: "127.0.0.1"
      },
      port: {
        keys: ["--port", "-p"],
        type: "number",
        default: 8080
      }
    }
  });
}
async function run10(args2) {
  if (!args2.servePath) {
    logError("Please provide a directory to serve.");
    return 1;
  }
  const servePath = resolve(args2.servePath);
  const server = await viteCreateServer({
    configFile: false,
    root: servePath,
    server: {
      host: args2.host,
      port: args2.port
    }
  });
  await server.listen();
  server.printUrls();
  server.bindCLIShortcuts({ print: true });
  return void 0;
}

// src/test.ts
var test_exports = {};
__export(test_exports, {
  parse: () => parse11,
  run: () => run11
});
function parse11(args2) {
  return parseArgs(args2, {
    positional: {
      key: "testArgs"
    },
    options: {
      concurrency: {
        keys: ["--concurrency"],
        type: "number"
      }
    }
  });
}
async function run11(args2) {
  const nodeExe = getNodeExe();
  if (args2.testArgs[0] === void 0) {
    args2.testArgs[0] = "**/*.test.ts";
  }
  const testOptions = ["--test"];
  if (args2.concurrency) {
    testOptions.unshift("--test-concurrency", args2.concurrency.toString());
  }
  await signalReplaceProcessAndExit([nodeExe, ...getNodeOptions(), ...testOptions, ...args2.testArgs]);
  return 0;
}

// src/version.ts
async function printVersionInformation() {
  const packageJson = await loadPackageJson(join([getBusterPath(), "package.json"]));
  console.info(`Buster ${packageJson.version} (pew pew pew)`);
  console.info(`  node ${process.env["BUSTER_NODE_VERSION"]}`);
  console.info(`  pnpm ${process.env["BUSTER_PNPM_VERSION"]}`);
}

// src/cli.ts
var args = process.argv.slice(2);
var commands = {
  add: add_exports,
  // TODO: bundle,
  check: check_exports,
  gc: gc_exports,
  init: init_exports,
  install: install_exports,
  lint: lint_exports,
  remove: remove_exports,
  run: run_exports,
  script: script_exports,
  serve: serve_exports,
  test: test_exports
};
if (args[0] !== void 0) {
  if (args[0] === "--version") {
    await printVersionInformation();
    exit(0);
  }
  const command = commands[args[0]];
  if (!command) {
    logError("Unknown command.");
    exit(1);
  }
  try {
    const result = await command.run(command.parse(args.slice(1)));
    if (result !== void 0) {
      exit(result);
    }
  } catch (err) {
    logError("An unexpected error occured.", err);
    exit(1);
  }
} else {
  logError("Please provide a command.");
  exit(1);
}
