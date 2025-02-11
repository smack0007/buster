import { loadPackageJson } from "./lib/utils.ts";
import { getBusterPath } from "./lib/common.ts";
import { join } from "./lib/path.ts";

export async function printVersionInformation(): Promise<void> {
  const packageJson = await loadPackageJson(join([getBusterPath(), "package.json"]));

  console.info(`Buster ${packageJson.version} (pew pew pew)`);

  // TODO:
  // echo "  node ${BUSTER_NODE_VERSION} ${BUSTER_NODE_EXE}"
  // echo "  pnpm ${BUSTER_PNPM_VERSION} ${BUSTER_PNPM_EXE}"
}
