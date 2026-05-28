import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { readConfig } from "../lib/config.js";
import {
  generatePagePacket,
  renderPagePacketMarkdown,
  type PagePacket
} from "../lib/page-packet.js";
import type { PreWritingStrategy } from "../lib/prewriting-strategy.js";

export interface BuildPagePacketOptions {
  clusterSlug: string;
  pageId: string;
  authorName?: string;
  authorDescriptor?: string;
  reviewerName?: string;
  reviewerDescriptor?: string;
  cwd?: string;
}

export interface PagePacketOutputs {
  clusterSlug: string;
  pageId: string;
  jsonPath: string;
  markdownPath: string;
}

export async function buildPagePacketFromWorkspace(options: BuildPagePacketOptions): Promise<PagePacketOutputs> {
  const cwd = options.cwd ?? process.cwd();
  const config = await readConfig(cwd);
  const workspaceRoot = path.resolve(cwd, config.workspace_path);
  const prewritingPath = path.join(
    workspaceRoot,
    "clusters",
    options.clusterSlug,
    "prewriting",
    options.pageId,
    "strategy.json"
  );
  const prewritingStrategy = JSON.parse(await readFile(prewritingPath, "utf8")) as PreWritingStrategy;
  const packet = generatePagePacket({
    prewritingStrategy,
    author: options.authorName ? {
      name: options.authorName,
      descriptor: options.authorDescriptor
    } : undefined,
    reviewer: options.reviewerName ? {
      name: options.reviewerName,
      descriptor: options.reviewerDescriptor
    } : undefined
  });
  return writePagePacket(workspaceRoot, options.clusterSlug, options.pageId, packet);
}

export async function runPagePacketCommand(args: string[]): Promise<void> {
  const [subcommand, ...rest] = args;
  if (subcommand !== "build") {
    console.error("Usage: seo-agent page-packet build --cluster <slug> --page-id <P1> [--author <name>] [--author-descriptor <text>] [--reviewer <name>] [--reviewer-descriptor <text>]");
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

  const outputs = await buildPagePacketFromWorkspace({
    clusterSlug,
    pageId,
    authorName: readFlag(rest, "--author"),
    authorDescriptor: readFlag(rest, "--author-descriptor"),
    reviewerName: readFlag(rest, "--reviewer"),
    reviewerDescriptor: readFlag(rest, "--reviewer-descriptor")
  });

  console.log(`Stored page packet JSON: ${outputs.jsonPath}`);
  console.log(`Stored page packet Markdown: ${outputs.markdownPath}`);
}

async function writePagePacket(
  workspaceRoot: string,
  clusterSlug: string,
  pageId: string,
  packet: PagePacket
): Promise<PagePacketOutputs> {
  const outputRoot = path.join(workspaceRoot, "page-packets", clusterSlug, pageId);
  const jsonPath = path.join(outputRoot, "page-packet.json");
  const markdownPath = path.join(outputRoot, "page-packet.md");
  await mkdir(outputRoot, { recursive: true });
  await writeFile(jsonPath, `${JSON.stringify(packet, null, 2)}\n`, "utf8");
  await writeFile(markdownPath, renderPagePacketMarkdown(packet), "utf8");

  return {
    clusterSlug,
    pageId,
    jsonPath,
    markdownPath
  };
}

function readFlag(args: string[], flag: string): string | undefined {
  const index = args.indexOf(flag);
  if (index < 0) return undefined;
  return args[index + 1];
}
