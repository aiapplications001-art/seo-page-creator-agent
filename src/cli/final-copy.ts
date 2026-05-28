import { readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { readConfig } from "../lib/config.js";
import { expandPagePacketCopy } from "../lib/final-copy.js";
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
  const config = await readConfig(cwd);
  const packetRoot = path.resolve(cwd, config.workspace_path, "page-packets", options.clusterSlug, options.pageId);
  const packet = JSON.parse(await readFile(path.join(packetRoot, "page-packet.json"), "utf8")) as PagePacket;
  const expanded = expandPagePacketCopy(packet);
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
