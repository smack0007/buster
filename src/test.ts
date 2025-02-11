import { parseArgs } from "./lib/args.ts";
import { getNodeExe, getNodeOptions } from "./lib/common.ts";
import { exec, ExecIOMode } from "./lib/os.ts";

export interface TestArgs {
  testArgs: string[];
}

export function parse(args: string[]): TestArgs {
  return parseArgs(args, {
    positional: {
      key: "testArgs",
    },
    options: {},
  });
}

const BUSTER_TEST_OPTIONS = [
  // TODO: Implement this as an argument to the test command.
  "--test-concurrency",
  "1",
  "--test",
] as const;

export async function run(args: TestArgs): Promise<number> {
  const nodeExe = getNodeExe();

  if (args.testArgs[0] === undefined) {
    args.testArgs[0] = "**/*.test.ts";
  }

  const result = await exec([nodeExe, ...getNodeOptions(), ...BUSTER_TEST_OPTIONS, ...args.testArgs], {
    stdout: ExecIOMode.inherit,
    stderr: ExecIOMode.inherit,
  });

  return result.code;
}
