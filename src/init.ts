import { parseArgs } from "./lib/args.ts";
import { jsonStringifyColor } from "./lib/colors.ts";
import { ensureProjectType, getBusterTemplatesPath } from "./lib/common.ts";
import { ensureDirectory, exists, listFiles, readTextFile, writeTextFile } from "./lib/fs.ts";
import { dirname, join, resolve, split } from "./lib/path.ts";

export interface InitArgs {
  directory?: string;
  type: string;
}

export function parse(args: string[]): InitArgs {
  return parseArgs(args, {
    positional: {
      key: "directory",
      single: true,
    },
    options: {
      type: {
        keys: ["--type", "-t"],
        type: "string",
        default: "cli",
      },
    },
  });
}

export async function run(args: InitArgs): Promise<number> {
  const path = resolve(args.directory ?? process.cwd());
  const projectType = ensureProjectType(args.type);

  console.info(`Initializing buster "${projectType}" project at "${path}"...`);
  await ensureDirectory(path);

  const projectName = path.split("/").reverse()[0];
  console.info(`Project name infered to be '${projectName}'.`);

  const templateVars: Record<string, string> = {
    projectType,
    projectName,
  };

  console.info(`Template variables: ${jsonStringifyColor(templateVars)}`);

  const baseFiles = await listFiles([getBusterTemplatesPath(), "base"], { recursive: true });
  const templateFiles = await listFiles([getBusterTemplatesPath(), projectType], { recursive: true });

  for (const baseFile of baseFiles) {
    if (!templateFiles.includes(baseFile)) {
      const srcPath = join([getBusterTemplatesPath(), "base", baseFile]);
      const destPath = join([path, baseFile]);
      console.info(`Writing "${destPath}" from "${srcPath}"...`);
      await writeTemplateFile(srcPath, destPath, templateVars);
    }
  }

  for (const templateFile of templateFiles) {
    const srcPath = join([getBusterTemplatesPath(), projectType, templateFile]);
    const destPath = join([path, templateFile]);
    console.info(`Writing "${destPath}" from "${srcPath}"...`);
    await writeTemplateFile(srcPath, destPath, templateVars);
  }

  return 0;
}

async function writeTemplateFile(srcPath: string, destPath: string, vars: Record<string, string>): Promise<void> {
  if (await exists(destPath)) {
    const isBusterFile = split(srcPath).includes(".buster");

    if (!isBusterFile) {
      console.info("  => File already exists. Skipping.");
      return;
    } else {
      console.info("  => File exists but is managed by buster. Overwriting.");
    }
  }

  await ensureDirectory(dirname(destPath));

  let contents = await readTextFile(srcPath);

  for (const [key, value] of Object.entries(vars)) {
    contents = contents.replaceAll("${{" + key + "}}", value);
  }

  await writeTextFile(destPath, contents);
}
