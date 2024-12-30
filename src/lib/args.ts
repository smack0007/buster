export type ParseArgsType = "number" | "string";

type ParseArgsTypeMap<T extends ParseArgsType> = T extends "number" ? number : string;

export type ParseArgsDescription = {
  readonly keys: string[];
  type: ParseArgsType;
  default?: unknown;
};

export type ParseArgsConfig<K extends string> = Record<K, ParseArgsDescription>;

export type ParseArgsResult<T> =
  T extends ParseArgsConfig<infer Keys>
    ? { [K in Keys]?: ParseArgsTypeMap<T[K]["type"]> } & {
        _: string[];
      }
    : never;

/**
 * Parses args into an object.
 * @param args The program args to be parsed.
 * @param config A configuraiton object which describes how the arguments should be parsed.
 */
export function parseArgs<K extends string, T extends ParseArgsConfig<K>>(
  args: string[],
  config: T,
): ParseArgsResult<T> {
  let parseNextArgAsFlagName: K | null = null;
  const values = { _: [] } as Record<K | "_", unknown>;

  for (const arg of args) {
    if (parseNextArgAsFlagName !== null) {
      const flagDescription = config[parseNextArgAsFlagName];

      switch (flagDescription.type) {
        case "number":
          values[parseNextArgAsFlagName as K] = +arg;
          break;

        case "string":
          values[parseNextArgAsFlagName as K] = arg;
          break;
      }

      parseNextArgAsFlagName = null;
    } else {
      for (const [flagName, flagDesc] of Object.entries(config) as [K, ParseArgsDescription][]) {
        if (flagDesc.keys.includes(arg)) {
          parseNextArgAsFlagName = flagName as K;
          break;
        }
      }

      if (parseNextArgAsFlagName === null) {
        (values["_"] as string[]).push(arg);
      }
    }
  }

  for (const configKey of Object.keys(config) as K[]) {
    if (values[configKey] === undefined && config[configKey].default !== undefined) {
      (values[configKey] as unknown) = config[configKey].default;
    }
  }

  return values as ParseArgsResult<T>;
}
