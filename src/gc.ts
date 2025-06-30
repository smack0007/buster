import { parseArgs } from "./lib/args.ts";
import { getBusterExtPath, getNodePath, getPNPMPath } from "./lib/common.ts";
import { listDirectories, removeDirectory } from "./lib/fs.ts";
import { basename, join } from "./lib/path.ts";

export interface GCArgs {}

export function parse(args: string[]): GCArgs {
  return parseArgs(args, {
    positional: {
      key: "_",
      single: true,
    },
    options: {},
  });
}

export async function run(_args: GCArgs): Promise<number> {
  const busterExtPath = getBusterExtPath();

  for (const dir of await listDirectories(busterExtPath)) {
    if (dir.startsWith("node")) {
      if (dir !== basename(getNodePath())) {
        console.info(`Removing "${dir}"...`);
        await removeDirectory(join([busterExtPath, dir]));
      }
    } else if (dir.startsWith("pnpm")) {
      if (dir !== basename(getPNPMPath())) {
        console.info(`Removing "${dir}"...`);
        await removeDirectory(join([busterExtPath, dir]));
      }
    }
  }

  return 0;
}
