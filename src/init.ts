import { ensureDirectory, exists, writeTextFile } from "./lib/fs.ts";
import { toJson } from "./lib/json.ts";
import { join, resolve } from "./lib/path.ts";

const args = process.argv.slice(2);
const path = resolve(args[0] ?? process.cwd());

console.info(`Initializing buster project at '${path}'...`);

const projectName = path.split("/").reverse()[0];
console.info(`Project name infered to be '${projectName}'.`);

const packageJson = {
  name: "",
  description: "",
  version: "0.0.1",
  type: "module",
};

const packageJsonPath = join([path, "package.json"]);
if (!(await exists(packageJsonPath))) {
  console.info(`Writing '${packageJsonPath}'.`);

  await writeTextFile(
    packageJsonPath,
    toJson({
      ...packageJson,
      name: projectName,
    })
  );
} else {
}

const tsconfig = {
  compilerOptions: {
    noEmit: true,

    target: "ESNext",
    module: "NodeNext",
    moduleResolution: "nodenext",

    strict: true,
    allowImportingTsExtensions: true,
  },
  include: ["**/*.ts"],
};

const tsconfigPath = join([path, "tsconfig.json"]);
if (!(await exists(tsconfigPath))) {
  console.info(`Writing '${tsconfigPath}'.`);
  await writeTextFile(tsconfigPath, toJson(tsconfig));
} else {
}

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