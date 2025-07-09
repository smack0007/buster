export type ArrayLength<T extends ReadonlyArray<unknown>> = T["length"];
export type Enum<T extends Readonly<Record<string, number>>> = T[keyof T];