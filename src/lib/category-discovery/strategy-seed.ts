import { copyFile, mkdir, stat } from "node:fs/promises";
import path from "node:path";
import type { CategoryDiscoveryStrategySeed } from "../cluster-strategy.js";
import type { CategoryDiscoveryArtifacts, CategoryDiscoveryValidationResult } from "./validation.js";

export function buildStrategySeedFromDiscovery(
  artifacts: CategoryDiscoveryArtifacts,
  validation: CategoryDiscoveryValidationResult
): CategoryDiscoveryStrategySeed {
  const boundary = artifacts.clusterBoundary;
  const opportunities = boundary.pageOpportunitySignals ?? [];
  return {
    categoryDiscovery: {
      runId: validation.runId,
      seedUniverseHash: validation.artifactHashes.seedUniverseHash,
      clusterPortfolioHash: validation.artifactHashes.clusterPortfolioHash,
      clusterBoundaryHash: validation.artifactHashes.clusterBoundaryHash,
      selectedSeedUniverse: artifacts.seedUniverse.selectedSeedUniverse,
      selectedClusterCategory: boundary.selectedClusterCategory,
      clusterSearchProblem: boundary.clusterSearchProblem,
      clusterPositioningStatement: boundary.clusterPositioningStatement,
      clusterViabilityStatement: boundary.clusterViabilityStatement,
      boundarySummary: boundary.categoryDiscoverySummaryStatement,
      warnings: validation.combinedVerdict.warnings
    },
    pageOpportunities: opportunities.filter((item: any) => item.route === "ready_for_step0B"),
    needsMoreDiscoveryBeforeStep0B: opportunities.filter((item: any) => item.route === "needs_more_discovery_before_step0B"),
    needsStep0BDecision: boundary.needsStep0BDecision ?? [],
    siteEvidenceSummary: boundary.siteEvidenceSummary,
    batchSuitability: boundary.batchSuitability
  };
}

export async function archiveStrategyVersion(clusterRoot: string, timestamp: string): Promise<void> {
  const versionRoot = path.join(clusterRoot, "strategy-versions");
  await mkdir(versionRoot, { recursive: true });
  const safeTimestamp = timestamp.replace(/[-:.]/g, "").slice(0, 15) + "Z";
  await copyIfExists(path.join(clusterRoot, "strategy.json"), path.join(versionRoot, `${safeTimestamp}-strategy.json`));
  await copyIfExists(path.join(clusterRoot, "strategy.md"), path.join(versionRoot, `${safeTimestamp}-strategy.md`));
}

async function copyIfExists(source: string, destination: string): Promise<void> {
  try {
    await stat(source);
    await copyFile(source, destination);
  } catch {
    // No previous strategy exists on first run.
  }
}
