import test from "node:test";
import assert from "node:assert/strict";
import { mkdtemp, mkdir, readFile, writeFile } from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import { planImagesFromWorkspace } from "../src/cli/images.js";
import { writeConfig } from "../src/lib/config.js";
import type { PagePacket } from "../src/lib/page-packet.js";

test("writes image manifest and prompt companion for a page packet", async () => {
  const cwd = await mkdtemp(path.join(os.tmpdir(), "seo-images-"));
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
      description: "A page about acne treatment.",
      slug: "acne-treatment",
      h1: "Acne Treatment Category Page",
      secondaryKeywords: [],
      ogTitle: "Acne Treatment Category Page | ClearNest",
      ogDescription: "A page about acne treatment.",
      twitterTitle: "Acne Treatment Category Page | ClearNest",
      twitterDescription: "A page about acne treatment."
    },
    authorship: { author: { name: "ClearNest Editorial Team" }, reviewedByVisible: false },
    cta: { primary: { label: "Start", microcopy: "Scan." }, mobileSticky: { label: "Start" } },
    rendering: { mobileFirst: true, desktopNotes: [], mobileNotes: [] },
    sections: [],
    links: { internal: [], external: [] },
    images: [
      {
        id: "IMG_OG",
        purpose: "Open Graph image for social and search previews.",
        aspectRatio: "1.91:1",
        altText: "Acne Treatment preview image",
        status: "reserved"
      }
    ],
    schemaDrafts: [],
    machineReadable: { sections: [], images: [], links: { internal: [], external: [] } }
  };
  await writeFile(path.join(packetRoot, "page-packet.json"), `${JSON.stringify(packet, null, 2)}\n`, "utf8");

  const outputs = await planImagesFromWorkspace({
    clusterSlug: "acne-treatment",
    pageId: "P1",
    cwd
  });

  assert.equal(outputs.manifestPath.endsWith("image-manifest.json"), true);
  assert.equal(outputs.promptBriefsPath?.endsWith("image-prompts.md"), true);

  const manifest = JSON.parse(await readFile(outputs.manifestPath, "utf8"));
  assert.equal(manifest.schemaVersion, "image-manifest.v1");
  assert.equal(manifest.assets[0].id, "IMG_OG");

  const prompts = await readFile(outputs.promptBriefsPath!, "utf8");
  assert.match(prompts, /IMG_PROMPT_01/);
});
