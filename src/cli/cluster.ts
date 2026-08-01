import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { initCategoryDiscoveryFromWorkspace } from "./category.js";
import { getCategoryDiscoveryPaths } from "../lib/category-discovery/paths.js";
import { archiveStrategyVersion, buildStrategySeedFromDiscovery } from "../lib/category-discovery/strategy-seed.js";
import { readCategoryDiscoveryArtifacts, validateCategoryDiscoveryRun } from "../lib/category-discovery/validation.js";
import {
  generateClusterStrategy,
  slugify,
  type ClusterStrategy
} from "../lib/cluster-strategy.js";
import { readConfig } from "../lib/config.js";
import type { PageMetadata } from "../lib/metadata.js";

export interface BuildClusterStrategyOptions {
  categoryName: string;
  companyName: string;
  market?: string;
  seedKeywords?: string[];
  cwd?: string;
}

export interface ClusterStrategyOutputs {
  clusterSlug: string;
  jsonPath: string;
  markdownPath: string;
}

export async function buildClusterStrategyFromWorkspace(options: BuildClusterStrategyOptions): Promise<ClusterStrategyOutputs> {
  const cwd = options.cwd ?? process.cwd();
  const config = await readConfig(cwd);
  const workspaceRoot = path.resolve(cwd, config.workspace_path);
  const metadata = await readMetadataIfPresent(workspaceRoot);
  const strategy = generateClusterStrategy({
    companyName: options.companyName,
    categoryName: options.categoryName,
    market: options.market ?? config.default_market,
    metadata,
    seedKeywords: options.seedKeywords ?? []
  });
  return writeClusterStrategy({ workspaceRoot, strategy, archiveExisting: false });
}

export async function buildClusterStrategyFromDiscoveryRun(options: {
  runId: string;
  companyName: string;
  cwd?: string;
  now?: string;
}): Promise<ClusterStrategyOutputs> {
  const cwd = options.cwd ?? process.cwd();
  const config = await readConfig(cwd);
  const workspaceRoot = path.resolve(cwd, config.workspace_path);
  const validation = await validateCategoryDiscoveryRun({
    workspaceRoot,
    runId: options.runId,
    writeReport: true,
    now: options.now
  });
  if (validation.combinedVerdict.status !== "pass" && validation.combinedVerdict.status !== "pass_with_warnings") {
    throw new Error(`Category discovery did not pass: ${validation.combinedVerdict.blockers.join("; ")}`);
  }
  const paths = getCategoryDiscoveryPaths(workspaceRoot, options.runId);
  const artifacts = await readCategoryDiscoveryArtifacts(paths);
  const discoverySeed = buildStrategySeedFromDiscovery(artifacts, validation);
  const metadata = await readMetadataIfPresent(workspaceRoot);
  const strategy = generateClusterStrategy({
    companyName: options.companyName,
    categoryName: discoverySeed.categoryDiscovery.selectedClusterCategory,
    market: config.default_market,
    metadata,
    seedKeywords: [],
    discoverySeed
  });

  return writeClusterStrategy({
    workspaceRoot,
    strategy,
    archiveExisting: true,
    now: options.now
  });
}

export async function runClusterCommand(args: string[]): Promise<void> {
  const [subcommand, ...rest] = args;
  if (subcommand !== "plan") {
    console.error("Usage: seo-agent cluster plan --category <name> --company <name> [--market India] [--keywords <comma-separated>]");
    process.exitCode = 1;
    return;
  }

  const categoryName = readFlag(rest, "--category");
  const companyName = readFlag(rest, "--company");
  const market = readFlag(rest, "--market");
  const keywords = readFlag(rest, "--keywords");
  const autoDiscover = rest.includes("--auto-discover");
  const runId = readFlag(rest, "--run-id");

  if (autoDiscover) {
    if (!companyName) {
      console.error("--company is required with --auto-discover.");
      process.exitCode = 1;
      return;
    }
    if (!runId) {
      const outputs = await initCategoryDiscoveryFromWorkspace({
        business: readFlag(rest, "--business"),
        company: companyName,
        market,
        seeds: keywords ? keywords.split(",").map((keyword) => keyword.trim()).filter(Boolean) : [],
        sites: [],
        competitors: [],
        references: [],
        imports: { searchConsole: [], keywords: [], siteInventory: [] }
      });
      console.log(`Initialized category discovery run: ${outputs.runId}`);
      console.log(`Fill artifacts in: ${outputs.runRoot}`);
      console.log("Then run: seo-agent category validate --run-id <run-id>");
      return;
    }
    const outputs = await buildClusterStrategyFromDiscoveryRun({ runId, companyName });
    console.log(`Stored cluster strategy JSON: ${outputs.jsonPath}`);
    console.log(`Stored cluster strategy Markdown: ${outputs.markdownPath}`);
    return;
  }

  if (!categoryName || !companyName) {
    console.error("--category and --company are required.");
    process.exitCode = 1;
    return;
  }

  const outputs = await buildClusterStrategyFromWorkspace({
    categoryName,
    companyName,
    market,
    seedKeywords: keywords ? keywords.split(",").map((keyword) => keyword.trim()).filter(Boolean) : []
  });

  console.log(`Stored cluster strategy JSON: ${outputs.jsonPath}`);
  console.log(`Stored cluster strategy Markdown: ${outputs.markdownPath}`);
}

export function renderClusterStrategyMarkdown(strategy: ClusterStrategy): string {
  const categoryDiscovery = strategy.categoryDiscovery
    ? `## Category Discovery

- Run ID: ${strategy.categoryDiscovery.runId}
- Selected seed universe: ${strategy.categoryDiscovery.selectedSeedUniverse}
- Selected cluster category: ${strategy.categoryDiscovery.selectedClusterCategory}
- Cluster boundary hash: ${strategy.categoryDiscovery.clusterBoundaryHash}
- Seed universe hash: ${strategy.categoryDiscovery.seedUniverseHash}
- Cluster portfolio hash: ${strategy.categoryDiscovery.clusterPortfolioHash}
- Viability: ${strategy.categoryDiscovery.clusterViabilityStatement}
- Boundary summary: ${strategy.categoryDiscovery.boundarySummary}
- Warnings: ${strategy.categoryDiscovery.warnings.length > 0 ? strategy.categoryDiscovery.warnings.join("; ") : "None"}

`
    : "";
  const candidates = strategy.existingUrlCandidates.length > 0
    ? strategy.existingUrlCandidates.map((candidate) => (
      `| ${candidate.pageType} | ${candidate.url} | ${candidate.evidenceStrength} | ${candidate.matchReason} |`
    )).join("\n")
    : "| none | No existing matching URL found. | low | Create or map a destination before page packet generation. |";

  const opportunities = strategy.pageOpportunities.map((opportunity) => (
    `| ${opportunity.id} | ${opportunity.title} | ${opportunity.pageType} | ${opportunity.strategyCategory} | ${opportunity.suggestedUrlSlug} | ${opportunity.evidenceStrength} |`
  )).join("\n");

  const links = strategy.internalLinkSuggestions.length > 0
    ? strategy.internalLinkSuggestions.map((link) => (
      `| ${link.sourceUrl} | ${link.destinationUrl} | ${link.placement} | ${link.anchorText} |`
    )).join("\n")
    : "| none | none | none | No internal link destination found yet. |";

  const issues = strategy.qualityScore.topIssues.map((issue) => (
    `| ${issue.priority} | ${issue.area} | ${issue.issue} | ${issue.likelyImpact} |`
  )).join("\n");

  const assumptions = strategy.assumptions.map((assumption) => (
    `- ${assumption.statement} Evidence strength: ${assumption.evidenceStrength}. Source: ${assumption.source}.`
  )).join("\n");

  return `# Cluster Strategy: ${strategy.category.name}

Company: ${strategy.companyName}
Market: ${strategy.market}
Cluster slug: ${strategy.category.slug}

${categoryDiscovery}## Source Metadata

- URLs considered: ${strategy.sourceMetadata.urlsConsidered}
- URLs matched: ${strategy.sourceMetadata.urlsMatched}
- Seed keywords: ${strategy.sourceMetadata.seedKeywords.length > 0 ? strategy.sourceMetadata.seedKeywords.join(", ") : "None provided"}

## Existing URL Candidates

| Page type | URL | Evidence | Match reason |
| --- | --- | --- | --- |
${candidates}

## Page Opportunities

| ID | Page | Type | Strategy category | Recommended slug | Evidence |
| --- | --- | --- | --- | --- | --- |
${opportunities}

## Internal Link Suggestions

| Source URL | Destination URL | Placement | Anchor text |
| --- | --- | --- | --- |
${links}

## Advisory Quality Score

Score: ${strategy.qualityScore.score}/100

| Priority | Area | Issue | Likely impact |
| --- | --- | --- | --- |
${issues}

## Source-Backed Inference Notes

${assumptions}

## Next Page Selection

Recommended next page: ${strategy.nextPageSelection.recommendedPageId}

${strategy.nextPageSelection.instruction}

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

async function readMetadataIfPresent(workspaceRoot: string): Promise<PageMetadata[]> {
  try {
    const metadataPath = path.join(workspaceRoot, "site-inventory", "metadata.json");
    return JSON.parse(await readFile(metadataPath, "utf8")) as PageMetadata[];
  } catch {
    return [];
  }
}

async function writeClusterStrategy(options: {
  workspaceRoot: string;
  strategy: ClusterStrategy;
  archiveExisting: boolean;
  now?: string;
}): Promise<ClusterStrategyOutputs> {
  const clusterSlug = slugify(options.strategy.category.name);
  const clusterRoot = path.join(options.workspaceRoot, "clusters", clusterSlug);
  const jsonPath = path.join(clusterRoot, "strategy.json");
  const markdownPath = path.join(clusterRoot, "strategy.md");

  await mkdir(clusterRoot, { recursive: true });
  if (options.archiveExisting) {
    await archiveStrategyVersion(clusterRoot, options.now ?? new Date().toISOString());
  }
  await writeFile(jsonPath, `${JSON.stringify(options.strategy, null, 2)}\n`, "utf8");
  await writeFile(markdownPath, renderClusterStrategyMarkdown(options.strategy), "utf8");

  return { clusterSlug, jsonPath, markdownPath };
}
