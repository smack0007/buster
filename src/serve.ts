import { createServer as viteCreateServer } from "vite";
import { parseArgs } from "./lib/args.ts";
import { logError } from "./lib/log.ts";
import { exit } from "./lib/os.ts";
import { resolve } from "./lib/path.ts";

const args = parseArgs(process.argv.slice(2), {
  host: {
    keys: ["--host", "-h"],
    type: "string",
    default: "127.0.0.1",
  },
  port: {
    keys: ["--port", "-p"],
    type: "number",
    default: 8080,
  },
});

if (args._[0] === undefined) {
  logError("Please provide a directory to serve.");
  exit(1);
}

if (args._.length > 1) {
  logError("Only one directory should be provided.");
  exit(1);
}

const servePath = resolve(args._[0]);

const server = await viteCreateServer({
  configFile: false,
  root: servePath,
  server: {
    host: args.host,
    port: args.port,
  },
});
await server.listen();

server.printUrls();
server.bindCLIShortcuts({ print: true });
