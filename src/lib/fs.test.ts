import { beforeEach, describe, it } from "node:test";
import { expect } from "expect";
import { getBusterPath } from "./common.ts";
import { listDirectories, listFiles } from "./fs.ts";
import { join } from "./path.ts";

describe("fs.ts", () => {
  beforeEach(() => {
    process.chdir(getBusterPath());
  });

  describe("listDirectories", () => {
    it("recursive is false", async () => {
      expect(await listDirectories(".")).toContain("bin");
      expect(await listDirectories(".")).toContain("src");
      expect(await listDirectories(".")).toContain("templates");
      expect(await listDirectories(".")).toContain("tests");
    });
  });

  describe("listFiles", () => {
    it("recursive is false", async () => {
      const files = await listFiles(".");
      expect(files).toContain("buster.env");
    });

    it("recursive is true", async () => {
      const files = await listFiles("./src", { recursive: true });
      expect(files).toContain("cli.ts");
      expect(files).toContain(join(["lib", "fs.ts"]));
    });
  });
});
