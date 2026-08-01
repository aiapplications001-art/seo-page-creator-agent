import assert from "node:assert/strict";
import { mkdtemp, readFile } from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import test from "node:test";
import {
  initCategoryDiscoveryFromWorkspace,
  validateCategoryDiscoveryFromWorkspace
} from "../src/cli/category.js";
import { writeConfig, type SeoAgentConfig } from "../src/lib/config.js";

test("category init writes three failing discovery templates", async () => {
  const cwd = await mkdtemp(path.join(os.tmpdir(), "seo-category-cli-"));
  await writeConfig(baseConfig(), cwd);

  const outputs = await initCategoryDiscoveryFromWorkspace({
    cwd,
    runId: "cat-test",
    business: "Skincare guidance",
    company: "MyMirror",
    market: "India",
    mode: "batch_growth",
    seeds: ["acne", "acne scars"],
    sites: ["https://mymirror.fit"],
    competitors: ["https://competitor.example"],
    references: [],
    imports: { searchConsole: ["./gsc.csv"], keywords: [], siteInventory: [] },
    now: "2026-08-01T10:15:00.000Z"
  });

  assert.equal(outputs.runId, "cat-test");
  const seed = JSON.parse(await readFile(outputs.seedUniversePath, "utf8"));
  const portfolio = JSON.parse(await readFile(outputs.clusterPortfolioPath, "utf8"));
  const boundary = JSON.parse(await readFile(outputs.clusterBoundaryPath, "utf8"));
  assert.equal(seed.verdict.status, "fail");
  assert.equal(portfolio.verdict.status, "fail");
  assert.equal(boundary.verdict.status, "fail");
  assert.equal(seed.inputProvenance.imports.searchConsole[0], "./gsc.csv");
});

test("category validate writes validation report for a run", async () => {
  const cwd = await mkdtemp(path.join(os.tmpdir(), "seo-category-cli-validate-"));
  await writeConfig(baseConfig(), cwd);
  await initCategoryDiscoveryFromWorkspace({
    cwd,
    runId: "cat-test",
    business: "Skincare guidance",
    company: "MyMirror",
    market: "India",
    mode: "batch_growth",
    seeds: ["acne"],
    sites: [],
    competitors: [],
    references: [],
    imports: { searchConsole: [], keywords: [], siteInventory: [] },
    now: "2026-08-01T10:15:00.000Z"
  });

  const outputs = await validateCategoryDiscoveryFromWorkspace({
    cwd,
    runId: "cat-test",
    now: "2026-08-01T11:00:00.000Z"
  });

  assert.equal(outputs.result.combinedVerdict.status, "fail");
  assert.equal(outputs.validationPath.endsWith("category-discovery-validation.json"), true);
});

function baseConfig(): SeoAgentConfig {
  return {
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
  };
}
