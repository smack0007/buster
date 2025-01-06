import { logError } from "./lib/log.ts";
import { exit } from "./lib/os.ts";
import * as add from "./add.ts";
import * as install from "./install.ts";

const args = process.argv.slice(2);

type CLICommandArgs = any;

interface CLICommand {
  parse: (args: string[]) => CLICommandArgs;
  run: (args: CLICommandArgs) => Promise<number>;
}

const commands: Record<string, CLICommand> = {
  add,
  install,
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
