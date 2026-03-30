type ArrayLength<T extends ReadonlyArray<unknown>> = T["length"];
type Enum<T extends Readonly<Record<string, number>>> = T[keyof T];

export class FFIError extends Error {}

export const FFIType = {
  void: 0,
  bool: 1,
  int32: 2,
  string: 3,
  varadic: 4,
} as const;

export type FFIType = Enum<typeof FFIType>;

type MapFFIType<T extends FFIType> = T extends typeof FFIType.void ? void
  : T extends typeof FFIType.bool ? boolean
  : T extends typeof FFIType.int32 ? number
  : T extends typeof FFIType.string ? string
  : unknown;

export interface FFIFunctionDefinition {
  returnType: FFIType;
  parameters: ReadonlyArray<FFIType>;
}

export interface FFILibraryDefinition {
  functions: Readonly<Record<string, FFIFunctionDefinition>>;
}

type LastFunctionParameterIsVaradic<T extends FFIFunctionDefinition> =
  ArrayLength<T["parameters"]> extends 0 ? false
    : ArrayLength<T["parameters"]> extends 1
      ? T["parameters"][0] extends typeof FFIType.varadic ? true
      : false
    : ArrayLength<T["parameters"]> extends 2
      ? T["parameters"][1] extends typeof FFIType.varadic ? true
      : false
    : ArrayLength<T["parameters"]> extends 3
      ? T["parameters"][2] extends typeof FFIType.varadic ? true
      : false
    : ArrayLength<T["parameters"]> extends 4
      ? T["parameters"][3] extends typeof FFIType.varadic ? true
      : false
    : never;

export type FFIFunction<T extends FFIFunctionDefinition> =
  ArrayLength<T["parameters"]> extends 0 ? () => MapFFIType<T["returnType"]>
    : ArrayLength<T["parameters"]> extends 1
      ? LastFunctionParameterIsVaradic<T> extends false
        ? (arg0: MapFFIType<T["parameters"][0]>) => MapFFIType<T["returnType"]>
      : (...args: unknown[]) => MapFFIType<T["returnType"]>
    : ArrayLength<T["parameters"]> extends 2
      ? LastFunctionParameterIsVaradic<T> extends false ? (
          arg0: MapFFIType<T["parameters"][0]>,
          arg1: MapFFIType<T["parameters"][1]>,
        ) => MapFFIType<T["returnType"]>
      : (
        arg0: MapFFIType<T["parameters"][0]>,
        ...args: unknown[]
      ) => MapFFIType<T["returnType"]>
    : ArrayLength<T["parameters"]> extends 3
      ? LastFunctionParameterIsVaradic<T> extends false ? (
          arg0: MapFFIType<T["parameters"][0]>,
          arg1: MapFFIType<T["parameters"][1]>,
          arg2: MapFFIType<T["parameters"][2]>,
        ) => MapFFIType<T["returnType"]>
      : (
        arg0: MapFFIType<T["parameters"][0]>,
        arg1: MapFFIType<T["parameters"][1]>,
        ...args: unknown[]
      ) => MapFFIType<T["returnType"]>
    : ArrayLength<T["parameters"]> extends 4
      ? LastFunctionParameterIsVaradic<T> extends false ? (
          arg0: MapFFIType<T["parameters"][0]>,
          arg1: MapFFIType<T["parameters"][1]>,
          arg2: MapFFIType<T["parameters"][2]>,
          arg3: MapFFIType<T["parameters"][3]>,
        ) => MapFFIType<T["returnType"]>
      : (
        arg0: MapFFIType<T["parameters"][0]>,
        arg1: MapFFIType<T["parameters"][1]>,
        arg2: MapFFIType<T["parameters"][2]>,
        ...args: unknown[]
      ) => MapFFIType<T["returnType"]>
    : (...args: unknown[]) => MapFFIType<T["returnType"]>;

export interface FFILibrary<T extends FFILibraryDefinition> {
  functions: {
    [K in keyof T["functions"]]: FFIFunction<T["functions"][K]>;
  };
}
