import test from "node:test";
import assert from "node:assert/strict";
import { mkdtemp, mkdir, readFile, writeFile } from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import { buildPagePacketFromWorkspace } from "../src/cli/page-packet.js";
import { writeConfig } from "../src/lib/config.js";
import type { PreWritingStrategy } from "../src/lib/prewriting-strategy.js";

test("builds page packet markdown and json from prewriting strategy", async () => {
  const cwd = await mkdtemp(path.join(os.tmpdir(), "seo-page-packet-"));
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

  const prewritingRoot = path.join(cwd, ".seo-agent-workspace", "clusters", "acne-treatment", "prewriting", "P1");
  await mkdir(prewritingRoot, { recursive: true });
  const strategy: PreWritingStrategy = {
    companyName: "ClearNest",
    market: "India",
    category: { name: "Acne Treatment", slug: "acne-treatment" },
    selectedPage: {
      id: "P1",
      title: "Acne Treatment Category Page",
      pageType: "product_category",
      strategyCategory: "highest_conversion",
      targetIntent: "Help users understand acne treatment.",
      primaryCtaGoal: "Route users to the acne treatment category.",
      suggestedUrlSlug: "acne-treatment",
      evidenceStrength: "high"
    },
    audience: { cohort: "Indian adults with visible acne", market: "India" },
    tone: { selected: "professional compact", requiresUserSelection: false, options: ["professional compact", "clear advisory"] },
    keywords: { primary: "acne treatment", secondary: [], clusterSeeds: ["acne treatment"] },
    contentDepth: { targetRange: "1800-2400 words", strict: false },
    cta: {
      primaryGoal: "Route users to the acne treatment category.",
      firstFoldRequired: true,
      mobileSticky: { recommended: true, shortenedLabelRequired: true }
    },
    pageStructure: {
      h1Rule: "exactly_one",
      sections: [
        { id: "S1_hero", purpose: "Hero", contentRole: "conversion", notes: "First fold CTA." },
        { id: "S10_references", purpose: "References", contentRole: "reference", notes: "Sources." }
      ]
    },
    referenceRequirements: {
      liveSerpReviewRequired: true,
      quoteReferenceUrlsRequired: true,
      externalLinksOpenInNewTab: true,
      notes: []
    },
    imageRequirements: {
      defaultGeneratedImageCount: "3-5",
      ogImageRequired: true,
      brandGuidelineRequired: true,
      notes: []
    },
    approvalQueues: { structure: [], content: [], images: [], critical: [] },
    evidenceNotes: [],
    machineMetadata: {
      schemaVersion: "prewriting-strategy.v1",
      generatedFrom: "cluster-strategy.v1",
      selectedPageId: "P1"
    }
  };
  await writeFile(path.join(prewritingRoot, "strategy.json"), `${JSON.stringify(strategy, null, 2)}\n`, "utf8");

  const outputs = await buildPagePacketFromWorkspace({
    clusterSlug: "acne-treatment",
    pageId: "P1",
    authorName: "ClearNest Editorial Team",
    cwd
  });

  assert.equal(outputs.clusterSlug, "acne-treatment");
  assert.equal(outputs.pageId, "P1");
  assert.equal(outputs.jsonPath.endsWith("page-packets/acne-treatment/P1/page-packet.json"), true);
  assert.equal(outputs.markdownPath.endsWith("page-packets/acne-treatment/P1/page-packet.md"), true);

  const json = JSON.parse(await readFile(outputs.jsonPath, "utf8"));
  assert.equal(json.metadata.schemaVersion, "page-packet.v1");
  assert.equal(json.metadata.sourcePrewritingPageId, "P1");

  const markdown = await readFile(outputs.markdownPath, "utf8");
  assert.match(markdown, /# Page Packet: Acne Treatment Category Page/);
  assert.match(markdown, /## Machine-Readable JSON/);
});
