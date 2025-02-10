import { parseArgs } from "./lib/args.ts";
import { BUSTER_NODE_OPTIONS, getNodeExe } from "./lib/common.ts";
import { exec, ExecIOMode } from "./lib/os.ts";

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

  const result = await exec([nodeExe, ...BUSTER_NODE_OPTIONS, ...args.scriptArgs], {
    stdout: ExecIOMode.inherit,
    stderr: ExecIOMode.inherit,
  });

  return result.code;
}
