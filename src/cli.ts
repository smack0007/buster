import { logError } from "./lib/log.ts";
import { exit } from "./lib/os.ts";
import * as add from "./add.ts";
import * as check from "./check.ts";
import * as gc from "./gc.ts";
import * as init from "./init.ts";
import * as install from "./install.ts";
import * as lint from "./lint.ts";
import * as remove from "./remove.ts";
import * as run from "./run.ts";
import * as script from "./script.ts";
import * as serve from "./serve.ts";
import * as test from "./test.ts";
import { printVersionInformation } from "./version.ts";

const args = process.argv.slice(2);

type CLICommandArgs = any;

interface CLICommand {
  parse: (args: string[]) => CLICommandArgs;
  run: (args: CLICommandArgs) => Promise<number | undefined>;
}

const commands: Record<string, CLICommand> = {
  add,
  check,
  gc,
  init,
  install,
  lint,
  remove,
  run,
  script,
  serve,
  test,
};

if (args[0] !== undefined) {
  if (args[0] === "--version") {
    await printVersionInformation();
    exit(0);
  }

  const command = commands[args[0]];

  if (!command) {
    logError("Unknown command.");
    exit(1);
  }

  try {
    const result = await command.run(command.parse(args.slice(1)));

    if (result !== undefined) {
      exit(result);
    }
  } catch (err) {
    logError("An unexpected error occured.", err);
    exit(1);
  }
} else {
  logError("Please provide a command.");
  exit(1);
}
