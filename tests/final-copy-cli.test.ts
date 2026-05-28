import test from "node:test";
import assert from "node:assert/strict";
import { mkdtemp, mkdir, readFile, writeFile } from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import { expandPagePacketFromWorkspace } from "../src/cli/final-copy.js";
import { writeConfig } from "../src/lib/config.js";
import type { PagePacket } from "../src/lib/page-packet.js";

test("writes expanded page packet artifacts next to the original packet", async () => {
  const cwd = await mkdtemp(path.join(os.tmpdir(), "seo-final-copy-"));
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

  const packetRoot = path.join(cwd, ".seo-agent-workspace", "page-packets", "acne-treatment", "P1");
  await mkdir(packetRoot, { recursive: true });
  const packet: PagePacket = {
    metadata: {
      schemaVersion: "page-packet.v1",
      sourcePrewritingPageId: "P1",
      companyName: "ClearNest",
      market: "India",
      pageType: "product_category",
      createdDate: "2026-05-28",
      updatedDate: "2026-05-28"
    },
    seo: {
      title: "Acne Treatment Category Page | ClearNest",
      description: "Acne Treatment Category Page for Indian adults with visible acne.",
      slug: "acne-treatment",
      h1: "Acne Treatment Category Page",
      secondaryKeywords: [],
      ogTitle: "Acne Treatment Category Page | ClearNest",
      ogDescription: "Acne Treatment Category Page for Indian adults with visible acne.",
      twitterTitle: "Acne Treatment Category Page | ClearNest",
      twitterDescription: "Acne Treatment Category Page for Indian adults with visible acne."
    },
    authorship: {
      author: { name: "ClearNest Editorial Team" },
      reviewedByVisible: false
    },
    cta: {
      primary: {
        label: "Start your free skin analysis now",
        microcopy: "Scan your face in about 60 seconds."
      },
      mobileSticky: {
        label: "Start analysis"
      }
    },
    rendering: {
      mobileFirst: true,
      desktopNotes: [],
      mobileNotes: []
    },
    sections: [
      { id: "S1_hero", heading: "Hero", role: "conversion", markdown: "Editable section scaffold for Hero." }
    ],
    links: { internal: [], external: [] },
    images: [],
    schemaDrafts: [],
    machineReadable: {
      sections: [],
      images: [],
      links: { internal: [], external: [] }
    }
  };
  await writeFile(path.join(packetRoot, "page-packet.json"), `${JSON.stringify(packet, null, 2)}\n`, "utf8");

  const outputs = await expandPagePacketFromWorkspace({
    clusterSlug: "acne-treatment",
    pageId: "P1",
    cwd
  });

  assert.equal(outputs.jsonPath.endsWith("page-packet.expanded.json"), true);
  assert.equal(outputs.markdownPath.endsWith("page-packet.expanded.md"), true);

  const json = JSON.parse(await readFile(outputs.jsonPath, "utf8"));
  assert.equal(json.metadata.copyStatus, "expanded_review_ready");

  const markdown = await readFile(outputs.markdownPath, "utf8");
  assert.match(markdown, /# Page Packet: Acne Treatment Category Page/);
  assert.match(markdown, /expanded_review_ready/);
});
