import { parseArgs } from "./lib/args.ts";
import { logError } from "./lib/log.ts";
import { exec, ExecIOMode, exit } from "./lib/os.ts";
import { findPackageJson, loadPackageJson } from "./lib/utils.ts";

const args = parseArgs(process.argv.slice(2), {});

if (args._.length === 0) {
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

await exec(["/bin/bash", "-c", packageJson.scripts[scriptName]], {
  stdout: ExecIOMode.inherit,
  stderr: ExecIOMode.inherit,
});
