import { parseArgs } from "./lib/args.ts";
import { signalReplaceProcessAndExit, getNodeExe, getNodeOptions } from "./lib/common.ts";

export interface RunArgs {
  scriptArgs: string[];
}

export function parse(args: string[]): RunArgs {
  return parseArgs(args, {
    positional: {
      key: "scriptArgs",
    },
    options: {},
  });
}

export async function run(args: RunArgs): Promise<number> {
  const nodeExe = getNodeExe();

  await signalReplaceProcessAndExit([nodeExe, ...getNodeOptions(), ...args.scriptArgs]);

  return 0;
}
