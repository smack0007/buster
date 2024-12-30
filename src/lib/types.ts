//
// Util Types
//

export type ArrayValues<T extends readonly unknown[]> = T[number];

export type Enum<T extends Record<string, unknown>> = T[keyof T];

export type RecordKeys<T extends Record<string | number | symbol, unknown>> = keyof T;

export type RecordValues<T extends Record<string | number | symbol, unknown>> = T[keyof T];

//
// Interfaces
//

export interface PackageJson {
  name?: string;

  description?: string;

  verstion?: string;

  type?: "module" | "commonjs";

  main?: string;

  scripts?: Record<string, string>;
}

export type ToString = { toString: () => string };
