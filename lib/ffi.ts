import koffi from "koffi";
import type { ArrayLength, Enum } from "./core.ts";

export class FFIError extends Error {}

export const FFIType = {
  void: 0,
  bool: 1,
  int32: 2,
  string: 3,
  varadic: 4,
} as const;

export type FFIType = Enum<typeof FFIType>;

type MapFFIType<T extends FFIType> = T extends typeof FFIType.void
  ? void
  : T extends typeof FFIType.bool
    ? boolean
    : T extends typeof FFIType.int32
      ? number
      : T extends typeof FFIType.string
        ? string
        : unknown;

export interface FFIFunctionDefinition {
  returnType: FFIType;
  parameters: ReadonlyArray<FFIType>;
}

export interface FFILibraryDefinition {
  functions: Readonly<Record<string, FFIFunctionDefinition>>;
}

type LastFunctionParameterIsVaradic<T extends FFIFunctionDefinition> =
  ArrayLength<T["parameters"]> extends 0
    ? false
    : ArrayLength<T["parameters"]> extends 1
      ? T["parameters"][0] extends typeof FFIType.varadic
        ? true
        : false
      : ArrayLength<T["parameters"]> extends 2
        ? T["parameters"][1] extends typeof FFIType.varadic
          ? true
          : false
        : ArrayLength<T["parameters"]> extends 3
          ? T["parameters"][2] extends typeof FFIType.varadic
            ? true
            : false
          : ArrayLength<T["parameters"]> extends 4
            ? T["parameters"][3] extends typeof FFIType.varadic
              ? true
              : false
            : never;

export type FFIFunction<T extends FFIFunctionDefinition> =
  ArrayLength<T["parameters"]> extends 0
    ? () => MapFFIType<T["returnType"]>
    : ArrayLength<T["parameters"]> extends 1
      ? LastFunctionParameterIsVaradic<T> extends false
        ? (arg0: MapFFIType<T["parameters"][0]>) => MapFFIType<T["returnType"]>
        : (...args: unknown[]) => MapFFIType<T["returnType"]>
      : ArrayLength<T["parameters"]> extends 2
        ? LastFunctionParameterIsVaradic<T> extends false
          ? (arg0: MapFFIType<T["parameters"][0]>, arg1: MapFFIType<T["parameters"][1]>) => MapFFIType<T["returnType"]>
          : (arg0: MapFFIType<T["parameters"][0]>, ...args: unknown[]) => MapFFIType<T["returnType"]>
        : ArrayLength<T["parameters"]> extends 3
          ? LastFunctionParameterIsVaradic<T> extends false
            ? (
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
            ? LastFunctionParameterIsVaradic<T> extends false
              ? (
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

function ffiTypeToKoffiType(type: FFIType): string {
  switch (type) {
    case FFIType.void:
      return "void";
    case FFIType.bool:
      return "bool";
    case FFIType.int32:
      return "int";
    case FFIType.string:
      return "str";
    case FFIType.varadic:
      return "...";
  }
}

export function dlopen<T extends FFILibraryDefinition>(path: string, definition: Readonly<T>): FFILibrary<T> {
  const functions: Record<string, Function> = {};

  const koffiLib = koffi.load(path);

  for (const [funcName, func] of Object.entries(definition.functions)) {
    if (func.returnType === FFIType.varadic) {
      throw new FFIError(`Function "${funcName}" returnType cannot be varadic.`);
    }

    const varadicIndex = func.parameters.indexOf(FFIType.varadic);
    if (varadicIndex !== -1 && varadicIndex !== func.parameters.length - 1) {
      throw new FFIError(`Function "${funcName}" may only have varadic as the last parameter.`);
    }

    const koffiFunc = koffiLib.func(
      funcName,
      ffiTypeToKoffiType(func.returnType),
      func.parameters.map(ffiTypeToKoffiType),
    );
    functions[funcName] = koffiFunc;

    if (varadicIndex !== -1) {
      // If there are varadic arguments then convert the FFIType arguments to koffi types.
      functions[funcName] = (...args: unknown[]) => {
        if (args.length >= func.parameters.length - 1) {
          for (let i = func.parameters.length - 1; i < args.length; i += 2) {
            args[i] = ffiTypeToKoffiType(args[i] as FFIType);
          }
        }

        koffiFunc(...args);
      };
    }
  }

  return {
    functions: functions as unknown as FFILibrary<T>["functions"],
  };
}
