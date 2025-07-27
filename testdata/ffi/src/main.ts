import { dlopen, FFIType } from "@buster/ffi";
import { osname, OperatingSystemName } from "@buster/os";

let extension = "so.6";

if (osname() === OperatingSystemName.macOS) {
  extension = "dylib";
}

const result = dlopen(`libc.${extension}`, {
  functions: {
    printf: {
      returnType: FFIType.int32,
      parameters: [FFIType.string, FFIType.varadic],
    },
  },
} as const);
result.functions.printf("Hello %s, you are %d years old!\n", FFIType.string, "Bob", FFIType.int32, 42);
