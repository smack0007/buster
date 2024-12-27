import { parseArgs } from "./lib/args.ts";
import { getNodeModulesPath } from "./lib/common.ts";
import { exec, exit } from "./lib/os.ts";
import { dirname, join, resolve } from "./lib/path.ts";
import { isDirectory } from "./lib/fs.ts";
import { logError } from "./lib/log.ts";
import { findPackageJson, loadPackageJson } from "./lib/utils.ts";

const NODE_MODULES_PATH = getNodeModulesPath();

const args = parseArgs(process.argv.slice(2), {
  output: {
    keys: ["--output", "-o"],
    type: "string",
  },
});

if (args._.length === 0) {
  logError("Please provide an input file.");
  exit(1);
}

if (args._.length > 1) {
  logError("Multiple input files currently not supported.");
  exit(1);
}

if (args.output === undefined) {
  logError("Please provide an output path via --output (-o).");
  exit(1);
}

let inputFile = resolve(args._[0]);
const outputFile = resolve(args.output as string);

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
  `--outfile=${outputFile}`,
]);
