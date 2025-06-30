import { describe, expect, it } from "@buster/test";
import { sayHello } from "./sayHello.ts";

describe("sayHello", () => {
  it("says hello", () => {
    expect(sayHello("foobar")).toEqual("Hello foobar!");
  });
});
