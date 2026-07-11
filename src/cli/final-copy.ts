import { existsSync } from "node:fs";
import { readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { readConfig } from "../lib/config.js";
import { expandPagePacketCopy } from "../lib/final-copy.js";
import { mergeFinalCopyDraft, type FinalCopyDraft } from "../lib/v2/final-copy-draft.js";
import type { PreDraftQualityBrief } from "../lib/v2/depth.js";
import { getV2PageDir } from "../lib/v2/paths.js";
import { assertV2PageCanAdvance } from "../lib/v2/transaction-guard.js";
import {
  renderPagePacketMarkdown,
  type PagePacket
} from "../lib/page-packet.js";

export interface ExpandPagePacketOptions {
  clusterSlug: string;
  pageId: string;
  cwd?: string;
}

export interface ExpandedPagePacketOutputs {
  clusterSlug: string;
  pageId: string;
  jsonPath: string;
  markdownPath: string;
}

export async function expandPagePacketFromWorkspace(options: ExpandPagePacketOptions): Promise<ExpandedPagePacketOutputs> {
  const cwd = options.cwd ?? process.cwd();
  const v2PageDir = await getV2PageDir(cwd, options.clusterSlug, options.pageId);
  const hasV2Workspace = existsSync(v2PageDir);
  await assertV2PageCanAdvance({
    cwd,
    clusterSlug: options.clusterSlug,
    pageId: options.pageId,
    stage: "final-copy"
  });
  const config = await readConfig(cwd);
  const packetRoot = path.resolve(cwd, config.workspace_path, "page-packets", options.clusterSlug, options.pageId);
  const packet = JSON.parse(await readFile(path.join(packetRoot, "page-packet.json"), "utf8")) as PagePacket;
  const expanded = hasV2Workspace
    ? mergeFinalCopyDraft(packet, await readFinalCopyDraft(v2PageDir), {
      expectedQualityBrief: await readPreDraftQualityBrief(v2PageDir)
    })
    : expandPagePacketCopy(packet);
  const jsonPath = path.join(packetRoot, "page-packet.expanded.json");
  const markdownPath = path.join(packetRoot, "page-packet.expanded.md");

  await writeFile(jsonPath, `${JSON.stringify(expanded, null, 2)}\n`, "utf8");
  await writeFile(markdownPath, renderPagePacketMarkdown(expanded), "utf8");

  return {
    clusterSlug: options.clusterSlug,
    pageId: options.pageId,
    jsonPath,
    markdownPath
  };
}

async function readFinalCopyDraft(v2PageDir: string): Promise<FinalCopyDraft> {
  const draftPath = path.join(v2PageDir, "final-copy-draft.json");
  if (!existsSync(draftPath)) {
    throw new Error(`final-copy-draft.json is required before V2 final copy expansion: ${draftPath}`);
  }
  return JSON.parse(await readFile(draftPath, "utf8")) as FinalCopyDraft;
}

async function readPreDraftQualityBrief(v2PageDir: string): Promise<PreDraftQualityBrief | undefined> {
  const briefPath = path.join(v2PageDir, "pre-draft-quality-brief.json");
  if (!existsSync(briefPath)) return undefined;
  return JSON.parse(await readFile(briefPath, "utf8")) as PreDraftQualityBrief;
}

export async function runFinalCopyCommand(args: string[]): Promise<void> {
  const [subcommand, ...rest] = args;
  if (subcommand !== "expand") {
    console.error("Usage: seo-agent final-copy expand --cluster <slug> --page-id <P1>");
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

  const outputs = await expandPagePacketFromWorkspace({ clusterSlug, pageId });
  console.log(`Stored expanded page packet JSON: ${outputs.jsonPath}`);
  console.log(`Stored expanded page packet Markdown: ${outputs.markdownPath}`);
}

function readFlag(args: string[], flag: string): string | undefined {
  const index = args.indexOf(flag);
  if (index < 0) return undefined;
  return args[index + 1];
}
