import { parseArgs } from "./lib/args.ts";
import { logError } from "./lib/log.ts";
import { exit } from "./lib/os.ts";
import { resolve } from "./lib/path.ts";
import { findTSConfig } from "./lib/utils.ts";

const args = parseArgs(process.argv.slice(2), {
  positional: {
    key: "directory",
    single: true,
  },
  options: {},
});

if (args.directory === "") {
  logError("Please provide a directory from which to start the search.");
  exit(1);
}

const result = await findTSConfig(resolve(args.directory));

if (result !== null) {
  console.info(result);
}
