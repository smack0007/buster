import { type FFITypes } from "./core.ts";
import { dlopen, opaquePointer, TypeIdentifiers } from "./koffi.ts";

const FFITypes: FFITypes = TypeIdentifiers;

export { dlopen, FFITypes, opaquePointer };
