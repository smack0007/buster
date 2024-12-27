import { createServer, IncomingMessage, ServerResponse } from "node:http";
import { parseArgs } from "./lib/args.ts";
import { logError } from "./lib/log.ts";
import { exit } from "./lib/os.ts";
import { join, resolve } from "./lib/path.ts";
import { isFile, readTextFile } from "./lib/fs.ts";
import { extname } from "node:path";

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

if (args._.length === 0) {
  logError("Please provide a directory to serve.");
  exit(1);
}

if (args._.length > 1) {
  logError("Only one directory should be provided.");
  exit(1);
}

const CONTENT_TYPE_MAP: Record<string, string> = {
  ".css": "text/css; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".htm": "text/html; charset=utf-8",
  ".html": "text/html; charset=utf-8",
  ".png": "image/png",
  ".txt": "text/plain; charset=utf-8",
} as const;

const servePath = resolve(args._[0]);

const server = createServer(async (req: IncomingMessage, res: ServerResponse<IncomingMessage>) => {
  const url = req.url ?? "index.html";
  const filePath = join([servePath, url]);

  if (await isFile(filePath)) {
    const contentType = CONTENT_TYPE_MAP[extname(filePath)] ?? CONTENT_TYPE_MAP[".txt"];
    res.writeHead(200, {
      "Content-Type": contentType,
    });
    res.end(await readTextFile(filePath));
    console.info(`200 ${url}`);
  } else {
    res.writeHead(404);
    res.end();
    console.info(`404 ${url}`);
  }
});

server.listen(args.port, args.host, () => {
  console.log(`Server is running on http://${args.host}:${args.port}`);
});
