export function toJson(value: unknown): string {
  return JSON.stringify(value, null, 2);
}
