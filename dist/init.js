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
function resolve(path2) {
  return nodeResolve(path2);
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

// ../../src/lib/fs.ts
async function ensureDirectory(path2) {
  try {
    await mkdir(path2, { recursive: true });
  } catch (err) {
    assertError(err);
    if (isNodeError(err) && err.code !== "EEXIST") {
      throw err;
    }
  }
}
async function exists(path2) {
  try {
    await stat(path2);
    return true;
  } catch {
  }
  return false;
}
async function writeTextFile(path2, data) {
  await writeFile(path2, data, { encoding: "utf-8" });
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

// ../../src/lib/json.ts
function toJson(value) {
  return JSON.stringify(value, null, 2);
}

// ../../src/init.ts
var args = parseArgs(process.argv.slice(2), {
  positional: {
    key: "directory",
    single: true
  },
  options: {
    type: {
      keys: ["--type", "-t"],
      type: "string",
      default: ProjectType.cli
    }
  }
});
var path = resolve(args.directory ?? process.cwd());
var projectType = ensureProjectType(args.type);
console.info(`Initializing buster "${projectType}" project at "${path}"...`);
await ensureDirectory(path);
var projectName = path.split("/").reverse()[0];
console.info(`Project name infered to be '${projectName}'.`);
async function writeGitIgnore() {
  const gitIgnore = `
dist/
node_modules/
tmp/
`.trimStart();
  const gitIgnorePath = join([path, ".gitignore"]);
  if (!await exists(gitIgnorePath)) {
    console.info(`Writing '${gitIgnorePath}'.`);
    await writeTextFile(gitIgnorePath, gitIgnore);
  } else {
  }
}
async function writePackageJson() {
  const packageJson = {
    name: "",
    description: "",
    version: "0.0.1",
    type: "module",
    main: "./src/main.ts"
  };
  const packageJsonPath = join([path, "package.json"]);
  if (!await exists(packageJsonPath)) {
    console.info(`Writing '${packageJsonPath}'.`);
    await writeTextFile(
      packageJsonPath,
      toJson({
        ...packageJson,
        name: projectName
      })
    );
  } else {
  }
}
async function writeTSConfig() {
  const tsconfig = {
    extends: "@buster/configs/tsconfig.json",
    include: ["**/*.ts"]
  };
  const tsconfigPath = join([path, "tsconfig.json"]);
  if (!await exists(tsconfigPath)) {
    console.info(`Writing '${tsconfigPath}'.`);
    await writeTextFile(tsconfigPath, toJson(tsconfig));
  } else {
  }
}
async function writeOxlintRC() {
  const oxlintrc = {
    plugins: ["typescript"],
    rules: {
      "@typescript-eslint/explicit-function-return-type": "error"
    }
  };
  const oxlintrcPath = join([path, ".oxlintrc.json"]);
  if (!await exists(oxlintrcPath)) {
    console.info(`Writing '${oxlintrcPath}'.`);
    await writeTextFile(oxlintrcPath, toJson(oxlintrc));
  } else {
  }
}
async function writeVSCodeSettings() {
  const vscodeSettings = {
    "typescript.preferences.importModuleSpecifierEnding": "js"
  };
  const vscodeSettingsPath = join([path, ".vscode", "settings.json"]);
  if (!await exists(vscodeSettingsPath)) {
    console.info(`Writing '${vscodeSettingsPath}'.`);
    await ensureDirectory(join([path, ".vscode"]));
    await writeTextFile(vscodeSettingsPath, toJson(vscodeSettings));
  } else {
  }
}
async function writeVSCodeTasks() {
  const baseTask = {
    presentation: {
      echo: true,
      reveal: "always",
      focus: false,
      panel: "shared",
      showReuseMessage: false,
      clear: true
    },
    type: "process",
    options: {
      cwd: "${workspaceFolder}"
    },
    problemMatcher: ["$tsc"]
  };
  const vscodeTasks = {
    version: "2.0.0",
    tasks: [
      {
        ...baseTask,
        label: "Lint",
        group: {
          kind: "none",
          isDefault: false
        },
        command: "buster",
        args: ["lint"]
      },
      {
        ...baseTask,
        label: "Run",
        group: {
          kind: "none",
          isDefault: true
        },
        command: "buster",
        args: ["run", "./src/main.ts"]
      }
    ]
  };
  const vscodeTasksPath = join([path, ".vscode", "tasks.json"]);
  if (!await exists(vscodeTasksPath)) {
    console.info(`Writing '${vscodeTasksPath}'.`);
    await ensureDirectory(join([path, ".vscode"]));
    await writeTextFile(vscodeTasksPath, toJson(vscodeTasks));
  } else {
  }
}
async function writeCliMain() {
  const mainSourceFile = `console.info("Hello World!");`;
  const mainSourceFilePath = join([path, "src", "main.ts"]);
  if (!await exists(mainSourceFilePath)) {
    console.info(`Writing '${mainSourceFilePath}'.`);
    await ensureDirectory(join([path, "src"]));
    await writeTextFile(mainSourceFilePath, mainSourceFile);
  } else {
  }
}
await writeGitIgnore();
await writePackageJson();
await writeTSConfig();
await writeOxlintRC();
await writeVSCodeSettings();
await writeVSCodeTasks();
if (projectType === ProjectType.cli) {
  await writeCliMain();
}
