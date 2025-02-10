import { parseArgs } from "./lib/args.ts";
import { logError } from "./lib/log.ts";
import { exec, ExecIOMode, exit } from "./lib/os.ts";
import { findPackageJson, loadPackageJson } from "./lib/utils.ts";

export interface ScriptArgs {
  script: string[];
}

export function parse(args: string[]): ScriptArgs {
  return parseArgs(args, {
    positional: {
      key: "script",
    },
    options: {},
  });
}

function escapeShellArg(arg: string): string {
  return `'${arg.replace(/'/g, `'\\''`)}'`;
}

export async function run(args: ScriptArgs): Promise<number> {
  if (args.script[0] === undefined) {
    logError("Please provide a script name to run.");
    exit(1);
  }

  const scriptName = args.script[0];
  const scriptArgs = args.script.slice(1);

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

  const result = await exec(["/bin/bash", "-c", command], {
    stdout: ExecIOMode.inherit,
    stderr: ExecIOMode.inherit,
  });

  return result.code;
}
