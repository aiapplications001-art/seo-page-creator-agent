import { readdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import type { V2PageState } from "./types.js";

export interface DebugBundleInput {
  pageDir: string;
  state: V2PageState;
  editorArtifactPaths: string[];
  internalArtifactPaths: string[];
  imageManifestPaths: string[];
  omittedBinaryCount: number;
}

export interface CreateDebugBundleInput {
  pageDir: string;
}

export interface CreateDebugBundleResult {
  markdownPath: string;
  includedArtifactPaths: string[];
  omittedBinaryCount: number;
}

const EDITOR_ARTIFACT_NAMES = new Set([
  "final-page-packet.md",
  "final-page-packet.json",
  "editorial-qa-report.md",
  "editorial-qa-report.json",
  "image-manifest.md",
  "image-manifest.json",
  "image-prompts.md",
  "refresh-packet.md",
  "refresh-packet.json"
]);
const IMAGE_MANIFEST_NAMES = new Set(["image-manifest.md", "image-manifest.json"]);
const BINARY_IMAGE_EXTENSIONS = new Set([".png", ".jpg", ".jpeg", ".webp", ".gif", ".avif"]);

export async function createDebugBundle(input: CreateDebugBundleInput): Promise<CreateDebugBundleResult> {
  const artifactPaths = await listArtifactPaths(input.pageDir);
  const includedArtifactPaths = artifactPaths.filter((artifactPath) => !isImageBinary(artifactPath));
  const omittedBinaryCount = artifactPaths.length - includedArtifactPaths.length;
  const state = JSON.parse(await readFile(path.join(input.pageDir, "page-state.json"), "utf8")) as V2PageState;
  const editorArtifactPaths = includedArtifactPaths.filter((artifactPath) => EDITOR_ARTIFACT_NAMES.has(path.basename(artifactPath)));
  const imageManifestPaths = includedArtifactPaths.filter((artifactPath) => IMAGE_MANIFEST_NAMES.has(path.basename(artifactPath)));
  const internalArtifactPaths = includedArtifactPaths.filter((artifactPath) => !EDITOR_ARTIFACT_NAMES.has(path.basename(artifactPath)));
  const markdown = renderDebugBundleMarkdown({
    pageDir: input.pageDir,
    state,
    editorArtifactPaths,
    internalArtifactPaths,
    imageManifestPaths,
    omittedBinaryCount
  });
  const markdownPath = path.join(input.pageDir, "debug-bundle.md");

  await writeFile(markdownPath, markdown, "utf8");

  return {
    markdownPath,
    includedArtifactPaths,
    omittedBinaryCount
  };
}

export function renderDebugBundleMarkdown(input: DebugBundleInput): string {
  const gates = [
    ["SERP Research", input.state.gates.serpResearch.status],
    ["Social/Video Research", input.state.gates.socialVideoResearch.status],
    ["Audience Definition", input.state.gates.audienceDefinition.status],
    ["Narrative Brief", input.state.gates.narrativeBrief.status],
    ["Citation Set", input.state.gates.citationSet.status]
  ].map(([gate, status]) => `- ${gate}: ${status}`).join("\n");

  return `# V2 Debug Bundle

## Status

- Page directory: ${input.pageDir}
- Status: ${input.state.status}
- Publish ready: ${input.state.publishReady}
- Next action: ${input.state.nextRecommendedAction}

## Gates

${gates}

## Editor Artifacts

${renderList(input.editorArtifactPaths)}

## Image Manifests

${renderList(input.imageManifestPaths)}

## Internal Artifacts

${renderList(input.internalArtifactPaths)}

## Omitted Files

- Omitted binary artifacts: ${input.omittedBinaryCount}
`;
}

async function listArtifactPaths(dir: string): Promise<string[]> {
  const entries = await readdir(dir, { withFileTypes: true });
  const paths = await Promise.all(entries.map(async (entry) => {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) return listArtifactPaths(fullPath);
    if (entry.isFile()) return [fullPath];
    return [];
  }));

  return paths.flat().sort();
}

function isImageBinary(artifactPath: string): boolean {
  return BINARY_IMAGE_EXTENSIONS.has(path.extname(artifactPath).toLowerCase());
}

function renderList(values: string[]): string {
  return values.length > 0 ? values.map((value) => `- ${value}`).join("\n") : "- None";
}
