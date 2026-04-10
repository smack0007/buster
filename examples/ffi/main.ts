import { dlopen, FFITypes } from "buster:ffi";

const libc = dlopen(
  "libc.dylib",
  {
    functions: {
      printf: {
        returnType: FFITypes.int32,
        parameters: [FFITypes.string, FFITypes.varadic],
      },
    },
  } as const,
);

libc.functions.printf("Hello %s!\n", FFITypes.string, "Bob");
