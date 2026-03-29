import { chdir } from "node:process";
import { describe, expect, it } from "buster:test";
import { runBusterCommand } from "./runBusterCommand.ts";

chdir(import.meta.dirname);

describe("run", () => {
  it("run ./assets/hello-world.ts", async () => {
    const [code, stdout, stderr] = await runBusterCommand([
      "run",
      "./assets/hello-world.ts",
    ]);
    expect(code).toEqual(0);
    expect(stdout.trim()).toEqual("Hello World!");
    expect(stderr.trim()).toEqual("");
  });

  it("run ./assets/does-not-exist.ts", async () => {
    const [code, stdout, stderr] = await runBusterCommand([
      "run",
      "./assets/does-not-exist.ts",
    ]);
    expect(code).toEqual(1);
    expect(stdout.trim()).toEqual("");
    //expect(stderr).includes("Cannot find module");
  });

  it("run ./assets/exits-with-42.ts", async () => {
    const [code, stdout, stderr] = await runBusterCommand([
      "run",
      "./assets/exits-with-42.ts",
    ]);
    expect(code).toEqual(42);
    expect(stdout).toEqual("");
    expect(stderr).toEqual("");
  });
});
