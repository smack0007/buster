import { logError } from "./lib/log.ts";
import { exit } from "./lib/os.ts";
import * as add from "./add.ts";
import * as check from "./check.ts";
import * as init from "./init.ts";
import * as install from "./install.ts";
import * as lint from "./lint.ts";
import * as remove from "./remove.ts";
import * as run from "./run.ts";
import * as script from "./script.ts";
import * as test from "./test.ts";

const args = process.argv.slice(2);

type CLICommandArgs = any;

interface CLICommand {
  parse: (args: string[]) => CLICommandArgs;
  run: (args: CLICommandArgs) => Promise<number>;
}

const commands: Record<string, CLICommand> = {
  add,
  check,
  init,
  install,
  lint,
  remove,
  run,
  script,
  test,
};

if (args[0] !== undefined) {
  const command = commands[args[0]];

  if (!command) {
    logError("Unknown command.");
    exit(1);
  }

  try {
    exit(await command.run(command.parse(args.slice(1))));
  } catch (err) {
    logError("An unexpected error occured.", err);
    exit(1);
  }
} else {
  logError("Please provide a command.");
  exit(1);
}
