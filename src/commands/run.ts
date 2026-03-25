import { parseArgs } from "node:util";
import {
  getNodeExe,
  getNodeOptions,
  signalReplaceProcessAndExit,
} from "../common.ts";

export interface RunArgs {
  scriptArgs: string[];
}

export function parse(args: string[]): RunArgs {
  const { values, positionals } = parseArgs({
    args,
    allowPositionals: true,
    options: {},
  });

  return {
    ...values,
    scriptArgs: positionals,
  };
}

export async function run(args: RunArgs): Promise<number> {
  const nodeExe = getNodeExe();

  await signalReplaceProcessAndExit([
    nodeExe,
    ...getNodeOptions(),
    ...args.scriptArgs,
  ]);

  return 0;
}
