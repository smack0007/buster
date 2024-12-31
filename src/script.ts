import { parseArgs } from "./lib/args.ts";
import { logError } from "./lib/log.ts";
import { exec, ExecIOMode, exit } from "./lib/os.ts";
import { findPackageJson, loadPackageJson } from "./lib/utils.ts";

function escapeShellArg(arg: string): string {
  return `'${arg.replace(/'/g, `'\\''`)}'`;
}

const args = parseArgs(process.argv.slice(2), {});

if (args._[0] === undefined) {
  logError("Please provide a script name to run.");
  exit(1);
}

const scriptName = args._[0];
const scriptArgs = args._.slice(1);

const packageJsonPath = await findPackageJson();

if (packageJsonPath === null) {
  logError("package.json not found.");
  exit(1);
}

const packageJson = await loadPackageJson(packageJsonPath);

if (!packageJson.scripts || packageJson.scripts[scriptName] === undefined) {
  logError(`Unknown script "${scriptName}".`);
  exit(1);
}

let command = packageJson.scripts[scriptName];

if (scriptArgs.length) {
  command += " " + scriptArgs.map(escapeShellArg).join(" ");
}

await exec(["/bin/bash", "-c", command], {
  stdout: ExecIOMode.inherit,
  stderr: ExecIOMode.inherit,
});
