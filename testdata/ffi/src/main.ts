import { ffiLoad, FFIType } from "@buster/ffi";

const result = ffiLoad('libc.so.6', {
	functions: {
		"printf": {
			returnType: FFIType.int32,
			parameters: [
				FFIType.string,
				FFIType.varadic
			]
		}
	}
} as const);
result.functions.printf("Hello %s, you are %d years old!\n", FFIType.string, "Bob", FFIType.int32, 42);