import test from "node:test";
import assert from "node:assert/strict";
import { mkdtemp, mkdir, readFile, writeFile } from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import { buildPreWritingStrategyFromWorkspace } from "../src/cli/prewriting.js";
import { writeConfig } from "../src/lib/config.js";
import type { ClusterStrategy } from "../src/lib/cluster-strategy.js";

test("builds pre-writing strategy markdown and json from a cluster strategy", async () => {
  const cwd = await mkdtemp(path.join(os.tmpdir(), "seo-prewriting-"));
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

  const clusterRoot = path.join(cwd, ".seo-agent-workspace", "clusters", "acne-treatment");
  await mkdir(clusterRoot, { recursive: true });
  const clusterStrategy: ClusterStrategy = {
    companyName: "ClearNest",
    market: "India",
    category: { name: "Acne Treatment", slug: "acne-treatment" },
    sourceMetadata: { urlsConsidered: 1, urlsMatched: 1, seedKeywords: ["acne treatment"] },
    existingUrlCandidates: [],
    pageOpportunities: [
      {
        id: "P1",
        title: "Acne Treatment Category Page",
        pageType: "product_category",
        strategyCategory: "highest_conversion",
        targetIntent: "Help users understand the category.",
        primaryCtaGoal: "Route users to the category product page.",
        suggestedUrlSlug: "acne-treatment",
        evidenceStrength: "high"
      }
    ],
    internalLinkSuggestions: [],
    qualityScore: { score: 80, advisoryOnly: true, topIssues: [] },
    assumptions: [],
    nextPageSelection: { instruction: "Select one page.", recommendedPageId: "P1" }
  };
  await writeFile(path.join(clusterRoot, "strategy.json"), `${JSON.stringify(clusterStrategy, null, 2)}\n`, "utf8");

  const outputs = await buildPreWritingStrategyFromWorkspace({
    clusterSlug: "acne-treatment",
    selectedPageId: "P1",
    audienceCohort: "Indian skincare buyers comparing acne treatment options",
    selectedTone: "professional compact",
    cwd
  });

  assert.equal(outputs.clusterSlug, "acne-treatment");
  assert.equal(outputs.pageId, "P1");
  assert.equal(outputs.jsonPath.endsWith("clusters/acne-treatment/prewriting/P1/strategy.json"), true);
  assert.equal(outputs.markdownPath.endsWith("clusters/acne-treatment/prewriting/P1/strategy.md"), true);

  const json = JSON.parse(await readFile(outputs.jsonPath, "utf8"));
  assert.equal(json.machineMetadata.schemaVersion, "prewriting-strategy.v1");
  assert.equal(json.selectedPage.id, "P1");

  const markdown = await readFile(outputs.markdownPath, "utf8");
  assert.match(markdown, /# Pre-Writing Strategy: Acne Treatment Category Page/);
  assert.match(markdown, /## Section Plan/);
  assert.match(markdown, /## Machine-Readable JSON/);
});
