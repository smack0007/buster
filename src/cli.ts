import { install, parseInstallArgs } from "./install.ts";
import { logError } from "./lib/log.ts";

const args = process.argv.slice(2);

try {
  switch (args[0]) {
    case "install":
      await install(parseInstallArgs(args.slice(1)));
      break;
  }
} catch (err) {
  logError("An unexpected error occured.", err);
}
