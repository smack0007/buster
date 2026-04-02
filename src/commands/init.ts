import { stat, writeFile } from "node:fs/promises";
import { join, resolve } from "node:path";
import { cwd } from "node:process";
import { parseArgs } from "node:util";
import { getBusterPath } from "../common.ts";
import { BusterError } from "../error.ts";
import { logInfo } from "../log.ts";

export interface InitArgs {
  directory: string;
}

export function parse(args: string[]): InitArgs {
  const { values, positionals } = parseArgs({
    args,
    allowPositionals: true,
    options: {},
  });

  let directory = cwd();

  if (positionals.length > 1) {
    throw new BusterError("Only one directory can be specified to initialize.");
  }

  if (positionals[0] !== undefined) {
    directory = positionals[0];
  }

  return {
    ...values,
    directory: resolve(directory),
  };
}

export async function run(args: InitArgs): Promise<number> {
  const busterPath = getBusterPath();

  const tsconfigPath = join(args.directory, "tsconfig.json");
  await logAndWriteFile(tsconfigPath, generateTsconfig(busterPath));

  return 0;
}

async function logAndWriteFile(path: string, data: string): Promise<void> {
  logInfo(`Writing ${path}...`);
  await writeFile(path, data, "utf-8");
}

function generateTsconfig(busterPath: string): string {
  return `// NOTICE: This file has been created by buster and should not be modified by hand.
{
  "extends": "${join(busterPath, "tsconfig.json")}",
  "include": ["./**/*.ts"]
}`;
}
