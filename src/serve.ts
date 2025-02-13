import { createServer as viteCreateServer } from "vite";
import { parseArgs } from "./lib/args.ts";
import { logError } from "./lib/log.ts";
import { resolve } from "./lib/path.ts";

export interface ServeArgs {
  servePath: string;
  host: string;
  port: number;
}

export function parse(args: string[]): ServeArgs {
  return parseArgs(args, {
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
}

export async function run(args: ServeArgs): Promise<number | undefined> {
  if (!args.servePath) {
    logError("Please provide a directory to serve.");
    return 1;
  }

  const servePath = resolve(args.servePath);

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

  return undefined;
}
