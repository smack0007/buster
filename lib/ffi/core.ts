export type FFIType = { __brand: "__ffiType" };
export type FFITypeIdentifier<T extends string> = T & FFIType;

export interface FFITypes {
  bool: FFITypeIdentifier<"bool">;
  int32: FFITypeIdentifier<"int32">;
  string: FFITypeIdentifier<"str">;
  uint32: FFITypeIdentifier<"uint32">;
  varadic: FFITypeIdentifier<"...">;
  void: FFITypeIdentifier<"void">;
}
