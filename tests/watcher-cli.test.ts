import test from "node:test";
import assert from "node:assert/strict";
import { mkdtemp, readFile } from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import { runGoogleGuidanceWatcher } from "../src/cli/watcher.js";
import { writeConfig } from "../src/lib/config.js";

test("writes Google guidance watcher state and report files", async () => {
  const cwd = await mkdtemp(path.join(os.tmpdir(), "seo-watcher-"));
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

  const outputs = await runGoogleGuidanceWatcher({
    cwd,
    date: "2026-05-28",
    fetchText: async (url) => `official content from ${url}`
  });

  assert.equal(outputs.reportPath.endsWith("watcher-reports/google-guidance-2026-05-28.md"), true);
  assert.equal(outputs.statePath.endsWith("watcher-state/google-guidance-state.json"), true);

  const report = await readFile(outputs.reportPath, "utf8");
  assert.match(report, /Google Guidance Watcher Report/);
  assert.match(report, /Official sources checked/);

  const state = JSON.parse(await readFile(outputs.statePath, "utf8"));
  assert.equal(state.schemaVersion, "google-guidance-watcher-state.v1");
  assert.ok(state.snapshots.length > 0);
});
