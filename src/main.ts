import { argv, exit } from "node:process";
import * as run from "./commands/run.ts";
import * as test from "./commands/test.ts";
import { logError } from "./log.ts";

const args = argv.slice(2);

type CommandArgs = any;

interface Command {
  parse: (args: string[]) => CommandArgs;
  run: (args: CommandArgs) => Promise<number | undefined>;
}

const commands: Record<string, Command> = {
  run,
  test,
};

if (args[0] !== undefined) {
  // if (args[0] === "--version") {
  //   await printVersionInformation();
  //   exit(0);
  // }

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
