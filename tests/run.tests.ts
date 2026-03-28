import { equal } from "node:assert";
import { chdir } from "node:process";
import { describe, it } from "node:test";
import { runBusterCommand } from "./runBusterCommand.ts";

chdir(import.meta.dirname);

describe("run", () => {
  it("run ./assets/hello-world.ts", async () => {
    const [code, stdout, stderr] = await runBusterCommand([
      "run",
      "./assets/hello-world.ts",
    ]);
    equal(code, 0);
    equal(stdout.trim(), "Hello World!");
    equal(stderr.trim(), "");
  });
});
