import { parseArgs } from "./lib/args.ts";
import { logError } from "./lib/log.ts";
import { exit } from "./lib/os.ts";
import { resolve } from "./lib/path.ts";
import { findTSConfig } from "./lib/utils.ts";

const args = parseArgs(process.argv.slice(2), {});

if (args._[0] === undefined) {
  logError("Please provide a directory from which to start the search.");
  exit(1);
}

if (args._.length > 1) {
  logError("Only one directory should be provided.");
  exit(1);
}

const result = await findTSConfig(resolve(args._[0]));

if (result !== null) {
  console.info(result);
}
