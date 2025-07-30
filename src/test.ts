import { parseArgs } from "./lib/args.ts";
import { getNodeExe, getNodeOptions, signalReplaceProcessAndExit } from "./lib/common.ts";

export interface TestArgs {
  testArgs: string[];
  concurrency?: number;
}

export function parse(args: string[]): TestArgs {
  return parseArgs(args, {
    positional: {
      key: "testArgs",
    },
    options: {
      concurrency: {
        keys: ["--concurrency"],
        type: "number",
      },
    },
  });
}

export async function run(args: TestArgs): Promise<number> {
  const nodeExe = getNodeExe();

  if (args.testArgs[0] === undefined) {
    args.testArgs[0] = "**/*.test.ts";
  }

  const testOptions = ["--test"];

  if (args.concurrency) {
    testOptions.unshift("--test-concurrency", args.concurrency.toString());
  }

  await signalReplaceProcessAndExit([nodeExe, ...getNodeOptions(), ...testOptions, ...args.testArgs]);

  return 0;
}
