import { createServer as viteCreateServer } from "vite";
import { parseArgs } from "./lib/args.ts";
import { logError } from "./lib/log.ts";
import { exit } from "./lib/os.ts";
import { resolve } from "./lib/path.ts";

const args = parseArgs(process.argv.slice(2), {
  positional: {
    key: "servePath",
    single: true,
  },
  options: {
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
  },
});

if (args.servePath === undefined) {
  logError("Please provide a directory to serve.");
  exit(1);
}

const servePath = resolve(args.servePath);

const server = await viteCreateServer({
  configFile: false,
  root: servePath,
  server: {
    host: args.host!,
    port: args.port!,
  },
});
await server.listen();

server.printUrls();
server.bindCLIShortcuts({ print: true });
