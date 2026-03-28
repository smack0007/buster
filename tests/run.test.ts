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
});
