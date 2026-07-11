import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import type { ClusterStrategy } from "../lib/cluster-strategy.js";
import { readConfig } from "../lib/config.js";
import {
  generatePreWritingStrategy,
  type PreWritingStrategy
} from "../lib/prewriting-strategy.js";

export interface BuildPreWritingStrategyOptions {
  clusterSlug: string;
  selectedPageId: string;
  audienceCohort: string;
  selectedTone?: string;
  contentDepthTarget?: string;
  primaryKeyword?: string;
  secondaryKeywords?: string[];
  cwd?: string;
}

export interface PreWritingStrategyOutputs {
  clusterSlug: string;
  pageId: string;
  jsonPath: string;
  markdownPath: string;
}

export async function buildPreWritingStrategyFromWorkspace(
  options: BuildPreWritingStrategyOptions
): Promise<PreWritingStrategyOutputs> {
  const cwd = options.cwd ?? process.cwd();
  const config = await readConfig(cwd);
  const workspaceRoot = path.resolve(cwd, config.workspace_path);
  const clusterRoot = path.join(workspaceRoot, "clusters", options.clusterSlug);
  const clusterStrategy = JSON.parse(await readFile(path.join(clusterRoot, "strategy.json"), "utf8")) as ClusterStrategy;
  const strategy = generatePreWritingStrategy({
    clusterStrategy,
    selectedPageId: options.selectedPageId,
    audienceCohort: options.audienceCohort,
    selectedTone: options.selectedTone,
    contentDepthTarget: options.contentDepthTarget,
    primaryKeyword: options.primaryKeyword,
    secondaryKeywords: options.secondaryKeywords ?? []
  });
  const outputRoot = path.join(clusterRoot, "prewriting", options.selectedPageId);
  const jsonPath = path.join(outputRoot, "strategy.json");
  const markdownPath = path.join(outputRoot, "strategy.md");

  await mkdir(outputRoot, { recursive: true });
  await writeFile(jsonPath, `${JSON.stringify(strategy, null, 2)}\n`, "utf8");
  await writeFile(markdownPath, renderPreWritingStrategyMarkdown(strategy), "utf8");

  return {
    clusterSlug: options.clusterSlug,
    pageId: options.selectedPageId,
    jsonPath,
    markdownPath
  };
}

export async function runPreWritingCommand(args: string[]): Promise<void> {
  const [subcommand, ...rest] = args;
  if (subcommand !== "plan") {
    console.error("Usage: seo-agent prewriting plan --cluster <slug> --page-id <P1> --audience <cohort> [--tone <tone>] [--depth <range>] [--primary-keyword <keyword>] [--secondary-keywords <comma-separated>]");
    process.exitCode = 1;
    return;
  }

  const clusterSlug = readFlag(rest, "--cluster");
  const selectedPageId = readFlag(rest, "--page-id");
  const audienceCohort = readFlag(rest, "--audience");

  if (!clusterSlug || !selectedPageId || !audienceCohort) {
    console.error("--cluster, --page-id, and --audience are required.");
    process.exitCode = 1;
    return;
  }

  const secondaryKeywords = readFlag(rest, "--secondary-keywords");
  const outputs = await buildPreWritingStrategyFromWorkspace({
    clusterSlug,
    selectedPageId,
    audienceCohort,
    selectedTone: readFlag(rest, "--tone"),
    contentDepthTarget: readFlag(rest, "--depth"),
    primaryKeyword: readFlag(rest, "--primary-keyword"),
    secondaryKeywords: secondaryKeywords ? secondaryKeywords.split(",").map((keyword) => keyword.trim()).filter(Boolean) : []
  });

  console.log(`Stored pre-writing strategy JSON: ${outputs.jsonPath}`);
  console.log(`Stored pre-writing strategy Markdown: ${outputs.markdownPath}`);
}

export function renderPreWritingStrategyMarkdown(strategy: PreWritingStrategy): string {
  const sections = strategy.pageStructure.sections.map((section) => (
    `| ${section.id} | ${section.contentRole} | ${section.sectionIntent} | ${section.evidenceBudget.minimumFacts}/${section.evidenceBudget.minimumCitedClaims}/${section.evidenceBudget.minimumConcreteExamples} | ${section.requiredDevices.join(", ")} | ${section.notes} |`
  )).join("\n");
  const approvalRows = [
    ...strategy.approvalQueues.critical,
    ...strategy.approvalQueues.content,
    ...strategy.approvalQueues.images,
    ...strategy.approvalQueues.structure
  ].map((approval) => (
    `| ${approval.risk} | ${approval.item} | ${approval.reason} |`
  )).join("\n");
  const evidence = strategy.evidenceNotes.map((note) => (
    `- ${note.pointer} Evidence strength: ${note.evidenceStrength}. Source: ${note.source}.`
  )).join("\n");

  return `# Pre-Writing Strategy: ${strategy.selectedPage.title}

Company: ${strategy.companyName}
Market: ${strategy.market}
Cluster: ${strategy.category.name}
Selected page: ${strategy.selectedPage.id}

## Audience And Tone

- Audience cohort: ${strategy.audience.cohort}
- Tone selected: ${strategy.tone.selected ?? "Not selected yet"}
- Tone options: ${strategy.tone.options.join(", ")}
- User tone selection required: ${strategy.tone.requiresUserSelection ? "yes" : "no"}

## Keywords And Depth

- Primary keyword: ${strategy.keywords.primary ?? "Not provided"}
- Secondary keywords: ${strategy.keywords.secondary.length > 0 ? strategy.keywords.secondary.join(", ") : "None provided"}
- Cluster seed keywords: ${strategy.keywords.clusterSeeds.length > 0 ? strategy.keywords.clusterSeeds.join(", ") : "None"}
- Content depth target: ${strategy.contentDepth.targetRange}
- Strict range: ${strategy.contentDepth.strict ? "yes" : "no"}

## CTA Strategy

- Primary CTA goal: ${strategy.cta.primaryGoal}
- Recommended destination: ${strategy.cta.recommendedDestination ?? "Not found"}
- First-fold CTA required: yes
- Mobile sticky CTA recommended: ${strategy.cta.mobileSticky.recommended ? "yes" : "no"}

## Section Plan

Intent pattern: ${strategy.pageStructure.intentPattern}
Structure variant: ${strategy.pageStructure.structureVariant}
Inference confidence: ${strategy.pageStructure.inference.confidence}
Inference signals: ${strategy.pageStructure.inference.signals.join(", ") || "None"}
Inference notes: ${strategy.pageStructure.inference.notes}

| Section ID | Role | Section Intent | Evidence Budget (facts/cited claims/examples) | Required Devices | Notes |
| --- | --- | --- | --- | --- | --- |
${sections}

## Reference Requirements

- Live SERP review required: yes
- Quote/reference URLs required: yes
- External links open in new tab: yes
- Notes: ${strategy.referenceRequirements.notes.join(" ")}

## Image Requirements

- Default generated image count: ${strategy.imageRequirements.defaultGeneratedImageCount}
- OG image required: ${strategy.imageRequirements.ogImageRequired ? "yes" : "no"}
- Brand guideline required: ${strategy.imageRequirements.brandGuidelineRequired ? "yes" : "no"}
- Notes: ${strategy.imageRequirements.notes.join(" ")}

## Approval Queues

| Risk | Item | Reason |
| --- | --- | --- |
${approvalRows || "| none | none | none |"}

## Source-Backed Inference Notes

${evidence}

## Machine-Readable JSON

\`\`\`json
${JSON.stringify(strategy, null, 2)}
\`\`\`
`;
}

function readFlag(args: string[], flag: string): string | undefined {
  const index = args.indexOf(flag);
  if (index < 0) return undefined;
  return args[index + 1];
}
