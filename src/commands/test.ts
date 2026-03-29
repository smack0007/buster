import { parseArgs } from "node:util";
import {
  getNodeExe,
  getNodeOptions,
  signalReplaceProcessAndExit,
} from "../common.ts";

export interface TestArgs {
  testArgs: string[];
  concurrency?: number;
}

export function parse(args: string[]): TestArgs {
  const { values, positionals } = parseArgs({
    args,
    allowPositionals: true,
    options: {
      concurrency: {
        keys: ["--concurrency"],
        type: "string",
      },
    },
  });

  return {
    ...values,
    testArgs: positionals,
    concurrency: values["concurrency"] ? +values["concurrency"] : undefined,
  };
}

export async function run(args: TestArgs): Promise<number> {
  const nodeExe = getNodeExe();

  const nodeTestOptions = ["--test"];

  if (args.concurrency) {
    nodeTestOptions.unshift("--test-concurrency", args.concurrency.toString());
  }

  if (args.testArgs[0] === undefined) {
    args.testArgs[0] = "**/*.test.ts";
  }

  await signalReplaceProcessAndExit([
    nodeExe,
    getNodeOptions(),
    ...nodeTestOptions,
    ...args.testArgs,
  ]);

  return 0;
}
