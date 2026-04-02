import koffi from "../../ext/koffi/index.js";
import {
  FFIError,
  type FFILibrary,
  type FFILibraryDefinition,
  FFIType,
} from "./ffi.ts";

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

  return "" as never;
}

export function dlopen<T extends FFILibraryDefinition>(
  path: string,
  definition: Readonly<T>,
): FFILibrary<T> {
  const functions: Record<string, Function> = {};

  const koffiLib = koffi.load(path);

  for (const [funcName, func] of Object.entries(definition.functions)) {
    if (func.returnType === FFIType.varadic) {
      throw new FFIError(
        `Function "${funcName}" returnType cannot be varadic.`,
      );
    }

    const varadicIndex = func.parameters.indexOf(FFIType.varadic);
    if (varadicIndex !== -1 && varadicIndex !== func.parameters.length - 1) {
      throw new FFIError(
        `Function "${funcName}" may only have varadic as the last parameter.`,
      );
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
