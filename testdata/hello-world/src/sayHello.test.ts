import { describe, it } from "node:test";
import { expect } from "expect";
import { sayHello } from "./sayHello.ts";

describe("sayHello", () => {
  it("says hello", () => {
    expect(sayHello("foobar")).toEqual("Hello foobar!");
  });
});
