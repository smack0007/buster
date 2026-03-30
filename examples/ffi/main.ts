import { dlopen, FFIType } from "buster:ffi";

const libc = dlopen(
  "libc.dylib",
  {
    functions: {
      printf: {
        returnType: FFIType.int32,
        parameters: [FFIType.string, FFIType.varadic],
      },
    },
  } as const,
);

libc.functions.printf("Hello World!\n");
