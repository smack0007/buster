import { parseArgs } from "./lib/args.ts";
import { red } from "./lib/colors.ts";
import { exit } from "./lib/os.ts";
import { resolve } from "./lib/path.ts";
import { findTSConfig } from "./lib/utils.ts";

const args = parseArgs(process.argv.slice(2), {
  output: {
    keys: ["--output", "-o"],
    type: "string",
  },
});

if (args._.length === 0) {
  console.error(red("Please provide a directory from which to start the search."));
  exit(1);
}

if (args._.length > 1) {
  console.error(red("Only one directory should be provided."));
  exit(1);
}

const result = await findTSConfig(resolve(args._[0]));

if (result !== null) {
  console.info(result);
}
