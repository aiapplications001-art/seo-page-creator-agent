import test from "node:test";
import assert from "node:assert/strict";
import { mkdtemp, mkdir, readFile, writeFile } from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import { buildClusterStrategyFromWorkspace } from "../src/cli/cluster.js";
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
