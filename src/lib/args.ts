type ParseArgsPositionalTypeMap<T extends boolean | undefined> = T extends true ? string : string[];

type ParseArgsOptionsType = "boolean" | "number" | "string";
type ParseArgsOptionsTypeMap<T extends ParseArgsOptionsType, D extends unknown | undefined> = T extends "boolean"
  ? D extends undefined
    ? boolean | undefined
    : boolean
  : T extends "number"
    ? D extends undefined
      ? number | undefined
      : number
    : D extends undefined
      ? string | undefined
      : string;

export type ParseArgsDescription = {
  keys: string[];
  type: ParseArgsOptionsType;
  default?: unknown;
};

export type ParseArgsConfig<KPositional extends string, KOptions extends string> = {
  positional: {
    key: KPositional;
    single?: boolean;
  };
  options: Record<KOptions, ParseArgsDescription>;
};

export type ParseArgsResult<T> =
  T extends ParseArgsConfig<infer KPositional, infer KOptions>
    ? { [K in KPositional]: ParseArgsPositionalTypeMap<T["positional"]["single"]> } & {
        [K in KOptions]: ParseArgsOptionsTypeMap<T["options"][K]["type"], T["options"][K]["default"]>;
      }
    : never;

/**
 * Parses args into an object.
 * @param args The program args to be parsed.
 * @param config A configuraiton object which describes how the arguments should be parsed.
 */
export function parseArgs<
  KPositional extends string,
  KOptions extends string,
  T extends ParseArgsConfig<KPositional, KOptions>,
>(args: string[], config: T): ParseArgsResult<T> {
  let parseNextArgAsOptionName: KOptions | null = null;
  const values = { [config.positional.key]: config.positional.single ? "" : [] } as Record<
    KPositional | KOptions,
    unknown
  >;

  for (const arg of args) {
    if (parseNextArgAsOptionName !== null) {
      const optionDesc = config.options[parseNextArgAsOptionName];

      switch (optionDesc.type) {
        case "number":
          values[parseNextArgAsOptionName as KOptions] = +arg;
          break;

        case "string":
          values[parseNextArgAsOptionName as KOptions] = arg;
          break;
      }

      parseNextArgAsOptionName = null;
    } else {
      let isBoolean = false;
      for (const [optionName, optionDesc] of Object.entries(config.options) as [KOptions, ParseArgsDescription][]) {
        if (optionDesc.keys.includes(arg)) {
          if (optionDesc.type === "boolean") {
            isBoolean = true;
            values[optionName as KOptions] = true;
          } else {
            parseNextArgAsOptionName = optionName as KOptions;
          }
          break;
        }
      }

      if (parseNextArgAsOptionName === null && !isBoolean) {
        if (config.positional.single) {
          (values[config.positional.key as KPositional] as string) = arg;
        } else {
          (values[config.positional.key as KPositional] as string[]).push(arg);
        }
      }
    }
  }

  for (const configKey of Object.keys(config.options) as KOptions[]) {
    if (values[configKey] === undefined && config.options[configKey].default !== undefined) {
      (values[configKey] as unknown) = config.options[configKey].default;
    }
  }

  return values as ParseArgsResult<T>;
}
