import { readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { readConfig } from "../lib/config.js";
import {
  buildImageManifest,
  renderImagePromptBriefs
} from "../lib/image-manifest.js";
import type { PagePacket } from "../lib/page-packet.js";

export interface PlanImagesOptions {
  clusterSlug: string;
  pageId: string;
  expanded?: boolean;
  cwd?: string;
}

export interface ImagePlanOutputs {
  clusterSlug: string;
  pageId: string;
  manifestPath: string;
  promptBriefsPath?: string;
}

export async function planImagesFromWorkspace(options: PlanImagesOptions): Promise<ImagePlanOutputs> {
  const cwd = options.cwd ?? process.cwd();
  const config = await readConfig(cwd);
  const packetRoot = path.resolve(cwd, config.workspace_path, "page-packets", options.clusterSlug, options.pageId);
  const packetFile = options.expanded ? "page-packet.expanded.json" : "page-packet.json";
  const packet = JSON.parse(await readFile(path.join(packetRoot, packetFile), "utf8")) as PagePacket;
  const manifest = buildImageManifest(packet);
  const manifestPath = path.join(packetRoot, "image-manifest.json");
  const promptBriefsPath = manifest.promptCompanionRequired ? path.join(packetRoot, "image-prompts.md") : undefined;

  await writeFile(manifestPath, `${JSON.stringify(manifest, null, 2)}\n`, "utf8");
  if (promptBriefsPath) {
    await writeFile(promptBriefsPath, renderImagePromptBriefs(manifest), "utf8");
  }

  return {
    clusterSlug: options.clusterSlug,
    pageId: options.pageId,
    manifestPath,
    promptBriefsPath
  };
}

export async function runImagesCommand(args: string[]): Promise<void> {
  const [subcommand, ...rest] = args;
  if (subcommand !== "plan") {
    console.error("Usage: seo-agent images plan --cluster <slug> --page-id <P1> [--expanded]");
    process.exitCode = 1;
    return;
  }

  const clusterSlug = readFlag(rest, "--cluster");
  const pageId = readFlag(rest, "--page-id");
  if (!clusterSlug || !pageId) {
    console.error("--cluster and --page-id are required.");
    process.exitCode = 1;
    return;
  }

  const outputs = await planImagesFromWorkspace({
    clusterSlug,
    pageId,
    expanded: rest.includes("--expanded")
  });

  console.log(`Stored image manifest: ${outputs.manifestPath}`);
  if (outputs.promptBriefsPath) {
    console.log(`Stored image prompt briefs: ${outputs.promptBriefsPath}`);
  }
}

function readFlag(args: string[], flag: string): string | undefined {
  const index = args.indexOf(flag);
  if (index < 0) return undefined;
  return args[index + 1];
}
