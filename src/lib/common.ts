import { exists, symlink, writeTextFile } from "./fs.ts";
import { logError } from "./log.ts";
import { exit } from "./os.ts";
import { join } from "./path.ts";
import type { ArrayMinLength, Enum } from "./types.ts";
import { throwError } from "./utils.ts";

export const BUSTER_NODE_OPTIONS = ["--disable-warning=ExperimentalWarning", "--experimental-transform-types"] as const;

export function getBusterPath(): string {
  return process.env["BUSTER_PATH"] ?? throwError("BUSTER_PATH was not defined.");
}

export function getBusterTmpPath(): string {
  return join([getBusterPath(), "tmp"]);
}

export function getNodePath(): string {
  return process.env["BUSTER_NODE_PATH"] ?? throwError("BUSTER_NODE_PATH was not defined.");
}

export function getNodeExe(): string {
  return join([getNodePath(), "bin", "node"]);
}

export function getNodeOptions(): string[] {
  return process.env["BUSTER_NODE_OPTIONS"]?.split(" ") ?? throwError("BUSTER_NODE_OPTIONS was not defined.");
}

export function getPNPMPath(): string {
  return process.env["BUSTER_PNPM_PATH"] ?? throwError("BUSTER_PNPM_PATH was not defined.");
}

export function getPNPMExe(): string {
  return join([getPNPMPath(), "pnpm"]);
}

export function getNodeModulesPath(): string {
  return process.env["BUSTER_NODE_MODULES_PATH"] ?? throwError("BUSTER_NODE_MODULES_PATH was not defined.");
}

export function getOxlintExe(): string {
  return join([getNodeModulesPath(), ".bin", "oxlint"]);
}

export function getTSCExe(): string {
  return join([getNodeModulesPath(), ".bin", "tsc"]);
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

export async function signalReplaceProcessAndExit(args: ArrayMinLength<string, 1>): Promise<never> {
  const replacementSignal =
    process.env["BUSTER_REPLACE_SIGNAL"] ?? throwError("BUSTER_REPLACE_SIGNAL was not defined.");
  await writeTextFile(replacementSignal, args.join(" "));
  exit(0);
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
