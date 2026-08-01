import test from "node:test";
import assert from "node:assert/strict";
import { mkdtemp, mkdir, readFile, readdir, writeFile } from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import { buildClusterStrategyFromDiscoveryRun, buildClusterStrategyFromWorkspace } from "../src/cli/cluster.js";
import { getCategoryDiscoveryPaths } from "../src/lib/category-discovery/paths.js";
import { writeConfig } from "../src/lib/config.js";

test("builds cluster strategy markdown and json files from workspace metadata", async () => {
  const cwd = await mkdtemp(path.join(os.tmpdir(), "seo-cluster-"));
  await writeConfig({
    workspace_path: ".seo-agent-workspace",
    default_market: "India",
    timezone: "Asia/Kolkata",
    site_inventory: {
      default_url_metadata_limit: 500,
      fetch_full_content_by_default: false,
      prioritize_url_types: ["product_category", "product", "guide_blog", "comparison", "faq_support", "pricing_trust"]
    },
    weekly_watcher: {
      enabled: true,
      schedule: "Tuesday morning",
      official_sources_only: true,
      custom_watch_urls: []
    },
    integrations: {
      google_search_console: { enabled: true, auth: "oauth_read_only" },
      google_ads_keyword_planner: { enabled: true, auth: "oauth_application_read_only" }
    },
    output: {
      write_markdown: true,
      write_json: true,
      include_json_mirror_in_markdown: true
    }
  }, cwd);

  const inventoryRoot = path.join(cwd, ".seo-agent-workspace", "site-inventory");
  await mkdir(inventoryRoot, { recursive: true });
  await writeFile(path.join(inventoryRoot, "metadata.json"), JSON.stringify([
    {
      url: "https://example.com/skin-care/acne-treatment/",
      title: "Acne Treatment Products | ClearNest",
      metaDescription: "Explore acne treatment products for Indian skin.",
      canonical: "https://example.com/skin-care/acne-treatment/",
      h1: "Acne Treatment",
      h2s: ["Personalized acne care"],
      schemaTypes: ["CollectionPage"],
      pageType: "product_category",
      classificationReason: "fixture"
    }
  ], null, 2), "utf8");

  const outputs = await buildClusterStrategyFromWorkspace({
    categoryName: "Acne Treatment",
    companyName: "ClearNest",
    market: "India",
    seedKeywords: ["acne treatment"],
    cwd
  });

  assert.equal(outputs.clusterSlug, "acne-treatment");
  assert.equal(outputs.jsonPath.endsWith("clusters/acne-treatment/strategy.json"), true);
  assert.equal(outputs.markdownPath.endsWith("clusters/acne-treatment/strategy.md"), true);

  const json = JSON.parse(await readFile(outputs.jsonPath, "utf8"));
  assert.equal(json.category.slug, "acne-treatment");
  assert.equal(json.pageOpportunities[0].id, "P1");

  const markdown = await readFile(outputs.markdownPath, "utf8");
  assert.match(markdown, /# Cluster Strategy: Acne Treatment/);
  assert.match(markdown, /## Page Opportunities/);
  assert.match(markdown, /Machine-Readable JSON/);
});

test("builds cluster strategy from validated category discovery run", async () => {
  const cwd = await mkdtemp(path.join(os.tmpdir(), "seo-cluster-discovery-"));
  await writeConfig({
    workspace_path: ".seo-agent-workspace",
    default_market: "India",
    timezone: "Asia/Kolkata",
    site_inventory: {
      default_url_metadata_limit: 500,
      fetch_full_content_by_default: false,
      prioritize_url_types: ["product_category", "product", "guide_blog", "comparison", "faq_support", "pricing_trust"]
    },
    weekly_watcher: {
      enabled: true,
      schedule: "Tuesday morning",
      official_sources_only: true,
      custom_watch_urls: []
    },
    integrations: {
      google_search_console: { enabled: true, auth: "oauth_read_only" },
      google_ads_keyword_planner: { enabled: true, auth: "oauth_application_read_only" }
    },
    output: {
      write_markdown: true,
      write_json: true,
      include_json_mirror_in_markdown: true
    }
  }, cwd);
  const workspaceRoot = path.join(cwd, ".seo-agent-workspace");
  const paths = getCategoryDiscoveryPaths(workspaceRoot, "cat-test");
  await mkdir(paths.runRoot, { recursive: true });
  await writeValidDiscoveryArtifacts(paths);

  const first = await buildClusterStrategyFromDiscoveryRun({
    cwd,
    runId: "cat-test",
    companyName: "MyMirror",
    now: "2026-08-01T10:15:00.000Z"
  });

  assert.equal(first.clusterSlug, "acne-scar-treatment");
  const strategy = JSON.parse(await readFile(first.jsonPath, "utf8"));
  assert.equal(strategy.categoryDiscovery.selectedClusterCategory, "acne scar treatment");
  assert.equal(typeof strategy.categoryDiscovery.clusterBoundaryHash, "string");
  assert.equal(strategy.pageOpportunities[0].title, "acne scar prevention");

  const second = await buildClusterStrategyFromDiscoveryRun({
    cwd,
    runId: "cat-test",
    companyName: "MyMirror",
    now: "2026-08-01T10:20:00.000Z"
  });
  assert.equal(second.clusterSlug, "acne-scar-treatment");
  const versions = await readdir(path.join(workspaceRoot, "clusters", "acne-scar-treatment", "strategy-versions"));
  assert.ok(versions.some((file) => file.endsWith("-strategy.json")));
});

async function writeValidDiscoveryArtifacts(paths: ReturnType<typeof getCategoryDiscoveryPaths>): Promise<void> {
  const passVerdict = {
    status: "pass",
    action: "continue_to_cluster_strategy",
    warnings: [],
    blockers: [],
    repairAttemptsUsed: 0,
    reason: "Fixture passes."
  };
  const sourceAttemptLog = [
    {
      sourceSurface: "https://mymirror.fit",
      sourceRole: "site_inventory",
      attemptedAt: "2026-08-01T10:00:00.000Z",
      accessStatus: "available",
      reason: "Fixture site source.",
      absenceImpact: "none"
    }
  ];
  const proofs = ["prevention", "tretinoin", "cream myth", "clinical vs home", "pitted scars"].map((name, index) => ({
    opportunityName: index === 0 ? "acne scar prevention" : `acne scar ${name}`,
    distinctSearchProblem: index === 0
      ? "User wants to stop active acne from becoming long-term scarring."
      : `User needs a distinct acne scar ${name} decision.`,
    distinctnessReason: `Fixture proof ${index + 1} has a distinct reader task.`,
    evidenceRefs: [`source-${index + 1}`],
    rawToNormalizedEvidence: [],
    route: "ready_for_step0B"
  }));
  await writeFile(paths.seedUniverse, JSON.stringify({
    schemaVersion: "category-seed-universe-contract.v1",
    artifactType: "seed_universe_contract",
    runId: "cat-test",
    createdAt: "2026-08-01T10:00:00.000Z",
    mode: "batch_growth",
    selectedSeedUniverse: "acne skincare",
    sourceAttemptLog,
    verdict: passVerdict
  }, null, 2), "utf8");
  await writeFile(paths.clusterPortfolio, JSON.stringify({
    schemaVersion: "category-cluster-portfolio-discovery.v1",
    artifactType: "cluster_portfolio_discovery",
    runId: "cat-test",
    createdAt: "2026-08-01T10:00:00.000Z",
    sourceAttemptLog,
    verdict: passVerdict
  }, null, 2), "utf8");
  await writeFile(paths.clusterBoundary, JSON.stringify({
    schemaVersion: "category-cluster-boundary-contract.v1",
    artifactType: "cluster_boundary_contract",
    runId: "cat-test",
    createdAt: "2026-08-01T10:00:00.000Z",
    selectedClusterCategory: "acne scar treatment",
    clusterSearchProblem: "People want realistic help improving acne scars.",
    sharedAudience: "Indian acne scar readers.",
    clusterPositioningStatement: "Realistic scar guidance without miracle claims.",
    includedSubareas: ["prevention", "tretinoin", "cream myths", "clinical care", "pitted scars"],
    excludedSubareas: ["general oily skin", "hair care"],
    clusterContentPromises: ["avoid miracle claims", "distinguish marks and scars", "keep safety visible"],
    clusterViabilityStatement: "The cluster has distinct prevention, myth, treatment, and scar-type opportunities.",
    pageOpportunitySignals: proofs,
    needsStep0BDecision: [],
    batchSuitability: { suitableForBatch: true, maxConfidentPageCount: 5, reason: "Five proofs." },
    siteEvidenceSummary: {
      evidenceRefs: ["site-1"],
      businessSiteFitReason: "Existing acne content supports the cluster.",
      cannibalizationRoute: "continue"
    },
    originalityCheck: { copiedCompetitorArchitecture: false },
    selectionConfidence: "high",
    categoryDiscoverySummaryStatement: "Acne scar treatment is selected as a specific expandable cluster.",
    mustCarryForward: { clusterBoundaryHash: "filled-by-validator" },
    verdict: passVerdict
  }, null, 2), "utf8");
}
