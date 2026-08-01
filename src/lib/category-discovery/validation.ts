import { readFile, writeFile } from "node:fs/promises";
import type { CategoryDiscoveryPaths } from "./paths.js";
import { getCategoryDiscoveryPaths } from "./paths.js";
import { hashCategoryArtifact } from "./hash.js";
import type { CategoryDiscoveryVerdict } from "./types.js";

export interface CategoryDiscoveryArtifacts {
  seedUniverse: Record<string, any>;
  clusterPortfolio: Record<string, any>;
  clusterBoundary: Record<string, any>;
}

export interface CategoryDiscoveryValidationResult {
  schemaVersion: "category-discovery-validation.v1";
  runId: string;
  validatedAt: string;
  artifactHashes: {
    seedUniverseHash: string;
    clusterPortfolioHash: string;
    clusterBoundaryHash: string;
  };
  artifactVerdicts: {
    seedUniverse: CategoryDiscoveryVerdict;
    clusterPortfolio: CategoryDiscoveryVerdict;
    clusterBoundary: CategoryDiscoveryVerdict;
  };
  combinedVerdict: CategoryDiscoveryVerdict;
}

export async function readCategoryDiscoveryArtifacts(paths: CategoryDiscoveryPaths): Promise<CategoryDiscoveryArtifacts> {
  return {
    seedUniverse: JSON.parse(await readFile(paths.seedUniverse, "utf8")),
    clusterPortfolio: JSON.parse(await readFile(paths.clusterPortfolio, "utf8")),
    clusterBoundary: JSON.parse(await readFile(paths.clusterBoundary, "utf8"))
  };
}

export async function validateCategoryDiscoveryRun(options: {
  workspaceRoot: string;
  runId: string;
  writeReport?: boolean;
  now?: string;
}): Promise<CategoryDiscoveryValidationResult> {
  const paths = getCategoryDiscoveryPaths(options.workspaceRoot, options.runId);
  const artifacts = await readCategoryDiscoveryArtifacts(paths);
  const blockers = collectBlockers(artifacts);
  const warnings = collectWarnings(artifacts);
  const artifactHashes = {
    seedUniverseHash: hashCategoryArtifact(artifacts.seedUniverse),
    clusterPortfolioHash: hashCategoryArtifact(artifacts.clusterPortfolio),
    clusterBoundaryHash: hashCategoryArtifact(artifacts.clusterBoundary)
  };
  const status = blockers.length > 0
    ? "fail"
    : artifacts.clusterBoundary.selectionConfidence === "low"
      ? "pass_with_warnings"
      : "pass";
  const combinedVerdict: CategoryDiscoveryVerdict = {
    status,
    action: status === "pass" || status === "pass_with_warnings"
      ? "continue_to_cluster_strategy"
      : "repair_category_discovery",
    warnings: status === "pass_with_warnings"
      ? unique([...warnings, "Low selection confidence must carry forward."])
      : warnings,
    blockers,
    repairAttemptsUsed: Math.max(
      artifacts.seedUniverse.verdict?.repairAttemptsUsed ?? 0,
      artifacts.clusterPortfolio.verdict?.repairAttemptsUsed ?? 0,
      artifacts.clusterBoundary.verdict?.repairAttemptsUsed ?? 0
    ),
    reason: status === "fail"
      ? "Category discovery has blocking validation issues."
      : "Category discovery artifacts passed deterministic validation."
  };
  const result: CategoryDiscoveryValidationResult = {
    schemaVersion: "category-discovery-validation.v1",
    runId: options.runId,
    validatedAt: options.now ?? new Date().toISOString(),
    artifactHashes,
    artifactVerdicts: {
      seedUniverse: artifacts.seedUniverse.verdict,
      clusterPortfolio: artifacts.clusterPortfolio.verdict,
      clusterBoundary: artifacts.clusterBoundary.verdict
    },
    combinedVerdict
  };

  if (options.writeReport) {
    await writeFile(paths.validation, `${JSON.stringify(result, null, 2)}\n`, "utf8");
    if (status === "pass" || status === "pass_with_warnings") {
      await writeFile(paths.lock, `${JSON.stringify({
        schemaVersion: "category-discovery-lock.v1",
        runId: options.runId,
        lockedAt: result.validatedAt,
        selectedSeedUniverse: artifacts.seedUniverse.selectedSeedUniverse,
        selectedClusterCategory: artifacts.clusterBoundary.selectedClusterCategory,
        artifactPaths: {
          seedUniverse: paths.seedUniverse,
          clusterPortfolio: paths.clusterPortfolio,
          clusterBoundary: paths.clusterBoundary
        },
        artifactHashes,
        verdict: combinedVerdict
      }, null, 2)}\n`, "utf8");
    }
  }

  return result;
}

function collectBlockers(artifacts: CategoryDiscoveryArtifacts): string[] {
  const blockers: string[] = [];

  for (const [name, artifact] of [
    ["seed-universe-contract.json", artifacts.seedUniverse],
    ["cluster-portfolio-discovery.json", artifacts.clusterPortfolio],
    ["cluster-boundary-contract.json", artifacts.clusterBoundary]
  ] as const) {
    if (!artifact.verdict || artifact.verdict.status === "fail") blockers.push(`${name} verdict is fail`);
    if (artifact.verdict?.status === "ask_user") blockers.push(`${name} asks user`);
  }

  const seed = artifacts.seedUniverse;
  const boundary = artifacts.clusterBoundary;
  if (!seed.selectedSeedUniverse) blockers.push("selectedSeedUniverse is required");
  if (!boundary.selectedClusterCategory) blockers.push("selectedClusterCategory is required");
  if (!boundary.clusterSearchProblem) blockers.push("clusterSearchProblem is required");
  if (!boundary.sharedAudience) blockers.push("sharedAudience is required");
  if (!boundary.clusterPositioningStatement) blockers.push("clusterPositioningStatement is required");
  if (!boundary.clusterViabilityStatement) blockers.push("clusterViabilityStatement is required");
  if ((boundary.includedSubareas ?? []).length < 5) blockers.push("includedSubareas requires at least 5 items");
  if ((boundary.excludedSubareas ?? []).length < 2) blockers.push("excludedSubareas requires at least 2 items");
  if ((boundary.clusterContentPromises ?? []).length < 3) blockers.push("clusterContentPromises requires at least 3 items");
  if (!boundary.batchSuitability || typeof boundary.batchSuitability.maxConfidentPageCount !== "number") blockers.push("batchSuitability is required");
  if (!boundary.mustCarryForward || Object.keys(boundary.mustCarryForward).length === 0) blockers.push("mustCarryForward is required");
  if (boundary.originalityCheck?.copiedCompetitorArchitecture === true) blockers.push("copied competitor architecture is not allowed");
  if (boundary.selectionConfidence === "low" && boundary.verdict?.status === "pass") blockers.push("low selectionConfidence cannot pass without warnings");

  const mode = seed.mode;
  const opportunities = boundary.pageOpportunitySignals ?? [];
  const readyProofs = opportunities.filter((item: any) => item.route === "ready_for_step0B");
  if (mode === "batch_growth" && readyProofs.length < 5) blockers.push("batch_growth requires at least 5 ready opportunity proofs");
  if (opportunities.length < 3) blockers.push("at least 3 opportunity proofs are required");
  for (const opportunity of opportunities) {
    if (!opportunity.distinctSearchProblem || !opportunity.distinctnessReason) {
      blockers.push(`opportunity proof ${opportunity.opportunityName ?? "unknown"} requires distinct search problem and reason`);
    }
  }

  return unique(blockers);
}

function collectWarnings(artifacts: CategoryDiscoveryArtifacts): string[] {
  const warnings: string[] = [];
  const attempts = [
    ...(artifacts.seedUniverse.sourceAttemptLog ?? []),
    ...(artifacts.clusterPortfolio.sourceAttemptLog ?? []),
    ...(artifacts.clusterBoundary.sourceAttemptLog ?? [])
  ];
  if (attempts.some((attempt: any) => attempt.sourceRole === "audience_language" && attempt.accessStatus === "unavailable")) {
    warnings.push("Audience-language evidence unavailable after attempts.");
  }
  if (artifacts.clusterBoundary.selectionConfidence === "low") warnings.push("Selection confidence is low.");
  return unique(warnings);
}

function unique(values: string[]): string[] {
  return [...new Set(values)];
}
