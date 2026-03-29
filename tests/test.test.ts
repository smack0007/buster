import { chdir } from "node:process";
import { describe, expect, it } from "buster:test";
import { runBusterCommand } from "./runBusterCommand.ts";

chdir(import.meta.dirname);

describe("test", () => {
  // NOTE: Unfortunately this doesn't work as node detects node:test is being
  // run recursively and errors out.
  // it("test ./assets/basic.test.ts", async () => {
  //   const [code, stdout, stderr] = await runBusterCommand([
  //     "test",
  //     "./assets/basic.test.ts",
  //   ]);
  //   expect(code).toEqual(0);
  //   expect(stdout.trim()).toEqual("");
  //   expect(stderr.trim()).toEqual("");
  // });
});
