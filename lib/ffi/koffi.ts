import koffi from "../../ext/koffi/index.js";
import { type FFITypeIdentifier, type FFITypes } from "./core.ts";
import { type FFILibrary, type FFILibraryDefinition } from "./library.ts";
import { FFIError } from "./error.ts";

export const TypeIdentifiers = {
  bool: "bool" as unknown as FFITypeIdentifier<"bool">,
  int32: "int32" as unknown as FFITypeIdentifier<"int32">,
  string: "str" as unknown as FFITypeIdentifier<"str">,
  uint32: "uint32" as unknown as FFITypeIdentifier<"uint32">,
  varadic: "..." as unknown as FFITypeIdentifier<"...">,
  void: "void" as unknown as FFITypeIdentifier<"void">,
} as const satisfies FFITypes;

export function opaquePointer<T extends string>(
  name: T,
): FFITypeIdentifier<`${T}*`> {
  return koffi.pointer(name, koffi.opaque()) as unknown as FFITypeIdentifier<
    `${T}*`
  >;
}

export function dlopen<T extends FFILibraryDefinition>(
  path: string,
  definition: Readonly<T>,
): FFILibrary<T> {
  const functions: Record<string, Function> = {};

  const koffiLib = koffi.load(path);

  for (const [funcName, func] of Object.entries(definition.functions)) {
    if (func.returnType === TypeIdentifiers.varadic) {
      throw new FFIError(
        `Function "${funcName}" returnType cannot be varadic.`,
      );
    }

    const varadicIndex = func.parameters.indexOf(TypeIdentifiers.varadic);
    if (varadicIndex !== -1 && varadicIndex !== func.parameters.length - 1) {
      throw new FFIError(
        `Function "${funcName}" may only have varadic as the last parameter.`,
      );
    }

    const koffiFunc = koffiLib.func(
      funcName,
      func.returnType as unknown as koffi.TypeSpec,
      func.parameters as unknown as koffi.TypeSpec[],
    );
    functions[funcName] = koffiFunc;
  }

  return {
    functions: functions as unknown as FFILibrary<T>["functions"],
  };
}
