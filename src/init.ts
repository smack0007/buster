import { parseArgs } from "./lib/args.ts";
import { ensureProjectType, ProjectType } from "./lib/common.ts";
import { ensureDirectory, exists, writeTextFile } from "./lib/fs.ts";
import { toJson } from "./lib/json.ts";
import { join, resolve } from "./lib/path.ts";

const args = parseArgs(process.argv.slice(2), {
  positional: {
    key: "directory",
    single: true,
  },
  options: {
    type: {
      keys: ["--type", "-t"],
      type: "string",
      default: ProjectType.cli,
    },
  },
});

const path = resolve(args.directory ?? process.cwd());
const projectType = ensureProjectType(args.type);

console.info(`Initializing buster "${projectType}" project at "${path}"...`);
await ensureDirectory(path);

const projectName = path.split("/").reverse()[0];
console.info(`Project name infered to be '${projectName}'.`);

async function writeGitIgnore(): Promise<void> {
  const gitIgnore = `
dist/
node_modules/
tmp/
`.trimStart();

  const gitIgnorePath = join([path, ".gitignore"]);
  if (!(await exists(gitIgnorePath))) {
    console.info(`Writing '${gitIgnorePath}'.`);
    await writeTextFile(gitIgnorePath, gitIgnore);
  } else {
  }
}

async function writePackageJson(): Promise<void> {
  const packageJson = {
    name: "",
    description: "",
    version: "0.0.1",
    type: "module",
    main: "./src/main.ts",
  };

  const packageJsonPath = join([path, "package.json"]);
  if (!(await exists(packageJsonPath))) {
    console.info(`Writing '${packageJsonPath}'.`);

    await writeTextFile(
      packageJsonPath,
      toJson({
        ...packageJson,
        name: projectName,
      }),
    );
  } else {
  }
}

async function writeTSConfig(): Promise<void> {
  const tsconfig = {
    extends: "@buster/configs/tsconfig.json",
    include: ["**/*.ts"],
  };

  const tsconfigPath = join([path, "tsconfig.json"]);
  if (!(await exists(tsconfigPath))) {
    console.info(`Writing '${tsconfigPath}'.`);
    await writeTextFile(tsconfigPath, toJson(tsconfig));
  } else {
  }
}

async function writeOxlintRC(): Promise<void> {
  const oxlintrc = {
    plugins: ["typescript"],
    rules: {
      "@typescript-eslint/explicit-function-return-type": "error",
    },
  };

  const oxlintrcPath = join([path, ".oxlintrc.json"]);
  if (!(await exists(oxlintrcPath))) {
    console.info(`Writing '${oxlintrcPath}'.`);
    await writeTextFile(oxlintrcPath, toJson(oxlintrc));
  } else {
  }
}

async function writeVSCodeSettings(): Promise<void> {
  const vscodeSettings = {
    "typescript.preferences.importModuleSpecifierEnding": "js",
  };

  const vscodeSettingsPath = join([path, ".vscode", "settings.json"]);
  if (!(await exists(vscodeSettingsPath))) {
    console.info(`Writing '${vscodeSettingsPath}'.`);
    await ensureDirectory(join([path, ".vscode"]));
    await writeTextFile(vscodeSettingsPath, toJson(vscodeSettings));
  } else {
  }
}

async function writeVSCodeTasks(): Promise<void> {
  const baseTask = {
    presentation: {
      echo: true,
      reveal: "always",
      focus: false,
      panel: "shared",
      showReuseMessage: false,
      clear: true,
    },
    type: "process",
    options: {
      cwd: "${workspaceFolder}",
    },
    problemMatcher: ["$tsc"],
  } as const;

  const vscodeTasks = {
    version: "2.0.0",
    tasks: [
      {
        ...baseTask,
        label: "Lint",
        group: {
          kind: "none",
          isDefault: false,
        },
        command: "buster",
        args: ["lint"],
      },
      {
        ...baseTask,
        label: "Run",
        group: {
          kind: "none",
          isDefault: true,
        },
        command: "buster",
        args: ["run", "./src/main.ts"],
      },
    ],
  };

  const vscodeTasksPath = join([path, ".vscode", "tasks.json"]);
  if (!(await exists(vscodeTasksPath))) {
    console.info(`Writing '${vscodeTasksPath}'.`);
    await ensureDirectory(join([path, ".vscode"]));
    await writeTextFile(vscodeTasksPath, toJson(vscodeTasks));
  } else {
  }
}

async function writeCliMain(): Promise<void> {
  const mainSourceFile = `console.info("Hello World!");`;

  const mainSourceFilePath = join([path, "src", "main.ts"]);
  if (!(await exists(mainSourceFilePath))) {
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
