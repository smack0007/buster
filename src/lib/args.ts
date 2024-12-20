import { RecordKeys } from "./types.ts";

export type ParseArgsConfig = Record<
  string,
  {
    keys: readonly string[];
    type: "number" | "string";
    default?: unknown;
  }
>;

export type ParseArgsResult<TConfig extends ParseArgsConfig> = Partial<Record<RecordKeys<TConfig>, unknown>> & {
  _: string[];
};

/**
 * Parses args into an object.
 * @param args The program args to be parsed.
 * @param config A configuraiton object which describes how the arguments should be parsed.
 */
export function parseArgs<TConfig extends ParseArgsConfig>(args: string[], config: TConfig): ParseArgsResult<TConfig> {
  let parseNextArgAsFlagName: RecordKeys<TConfig> | null = null;
  const values = { _: [] } as Record<RecordKeys<TConfig>, unknown>;

  for (const arg of args) {
    if (parseNextArgAsFlagName !== null) {
      const flagDescription = config[parseNextArgAsFlagName];

      switch (flagDescription.type) {
        case "number":
          values[parseNextArgAsFlagName as RecordKeys<TConfig>] = +arg;
          break;

        case "string":
          values[parseNextArgAsFlagName as RecordKeys<TConfig>] = arg;
          break;
      }

      parseNextArgAsFlagName = null;
    } else {
      for (const [flagName, flagKeys] of Object.entries(config)) {
        if (flagKeys.keys.includes(arg)) {
          parseNextArgAsFlagName = flagName as RecordKeys<TConfig>;
          break;
        }
      }

      if (parseNextArgAsFlagName === null) {
        (values["_"] as string[]).push(arg);
      }
    }
  }

  return values as ParseArgsResult<TConfig>;
}
