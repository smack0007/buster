import { exists, symlink } from "./fs.ts";
import { logError } from "./log.ts";
import { exit } from "./os.ts";
import type { Enum } from "./types.ts";
import { throwError } from "./utils.ts";

export function getBusterPath(): string {
  return process.env["BUSTER_PATH"] ?? throwError("BUSTER_PATH was not defined.");
}

export function getPNPMPath(): string {
  return process.env["BUSTER_PNPM_PATH"] ?? throwError("BUSTER_PNPM_PATH was not defined.");
}

export function getNodeModulesPath(): string {
  return process.env["BUSTER_NODE_MODULES_PATH"] ?? throwError("BUSTER_NODE_MODULES_PATH was not defined.");
}

export const ProjectType = {
  cli: "cli",
  web: "web",
} as const;
export type ProjectType = Enum<typeof ProjectType>;

export function ensureProjectType(type: string | undefined): ProjectType {
  if (type === undefined) {
    logError("Please provide a project type.");
    exit(1);
  }

  const projectTypes = Object.values(ProjectType);
  if (!projectTypes.includes(type as ProjectType)) {
    logError(
      `Project type "${type}" is invalid. Valid project types are ${projectTypes.map((x) => `"${x}"`).join(", ")}.`,
    );
    exit(1);
  }

  return type as ProjectType;
}

export async function trySymlink(target: string, path: string): Promise<void> {
  if (!(await exists(path))) {
    try {
      await symlink(target, path);
    } catch (err) {
      logError(`Failed to create symlink "${path}" => "${target}".`, err);
    }
  }
}
