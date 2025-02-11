import { loadPackageJson } from "./lib/utils.ts";
import { getBusterPath } from "./lib/common.ts";
import { join } from "./lib/path.ts";

export async function printVersionInformation(): Promise<void> {
  const packageJson = await loadPackageJson(join([getBusterPath(), "package.json"]));

  console.info(`Buster ${packageJson.version} (pew pew pew)`);
  console.info(`  node ${process.env["BUSTER_NODE_VERSION"]}`);
  console.info(`  pnpm ${process.env["BUSTER_PNPM_VERSION"]}`);
}
