//
// Util Types
//

export type ArrayValues<T extends readonly unknown[]> = T[number];

export type RecordKeys<T extends Record<string | number | symbol, unknown>> =
  keyof T;

export type RecordValues<T extends Record<string | number | symbol, unknown>> =
  T[keyof T];

//
// Interfaces
//

export type ToString = { toString: () => string };
