import { parseArgs } from "./lib/args.ts";
import { getNodeModulesPath } from "./lib/common.ts";
import { red } from "./lib/colors.ts";
import { exec, exit } from "./lib/os.ts";
import { join, resolve } from "./lib/path.ts";

const NODE_MODULES_PATH = getNodeModulesPath();

const args = parseArgs(process.argv.slice(2), {
  output: {
    keys: ["--output", "-o"],
    type: "string",
  },
});

if (args._.length === 0) {
  console.error(red("Please provide an input file."));
  exit(1);
}

if (args._.length > 1) {
  console.error(red("Multiple input files currently not supported."));
  exit(1);
}

if (args.output === undefined) {
  console.error(red("Please provide an output path via --output (-o)."));
  exit(1);
}

const inputFile = resolve(args._[0]);
const outputFile = resolve(args.output as string);

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
