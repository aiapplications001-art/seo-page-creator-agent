import test from "node:test";
import assert from "node:assert/strict";
import {
  buildImageManifest,
  renderImagePromptBriefs
} from "../src/lib/image-manifest.js";
import type { PagePacket } from "../src/lib/page-packet.js";

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
    primaryKeyword: "acne treatment",
    secondaryKeywords: [],
    ogTitle: "Acne Treatment Category Page | ClearNest",
    ogDescription: "A page about acne treatment.",
    twitterTitle: "Acne Treatment Category Page | ClearNest",
    twitterDescription: "A page about acne treatment."
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
    mobileSticky: { label: "Start analysis" }
  },
  rendering: {
    mobileFirst: true,
    desktopNotes: [],
    mobileNotes: []
  },
  sections: [],
  links: { internal: [], external: [] },
  images: [
    {
      id: "IMG_OG",
      purpose: "Open Graph image for social and search previews.",
      aspectRatio: "1.91:1",
      altText: "Acne Treatment preview image",
      status: "reserved"
    },
    {
      id: "IMG_01",
      sectionId: "S1_hero",
      purpose: "High-impact visual support for S1_hero.",
      aspectRatio: "16:9",
      altText: "Acne treatment hero visual",
      status: "brief_needed"
    }
  ],
  schemaDrafts: [],
  machineReadable: {
    sections: [],
    images: [],
    links: { internal: [], external: [] }
  }
};

test("builds image manifest records from page packet image slots", () => {
  const manifest = buildImageManifest(packet);

  assert.equal(manifest.schemaVersion, "image-manifest.v1");
  assert.equal(manifest.page.slug, "acne-treatment");
  assert.equal(manifest.assets.length, 2);
  assert.equal(manifest.assets[0].id, "IMG_OG");
  assert.equal(manifest.assets[0].recommendedFilename, "acne-treatment-open-graph-image-for-social-and-search-previews.webp");
  assert.equal(manifest.assets[0].preferredFormat, "webp");
  assert.equal(manifest.assets[0].licensing.status, "pending_review");
  assert.equal(manifest.assets[1].promptBrief?.sectionId, "S1_hero");
  assert.equal(manifest.promptCompanionRequired, true);
});

test("renders prompt briefs only for ungenerated images", () => {
  const manifest = buildImageManifest(packet);
  const markdown = renderImagePromptBriefs(manifest);

  assert.match(markdown, /# Image Prompt Briefs/);
  assert.match(markdown, /IMG_PROMPT_01/);
  assert.match(markdown, /image_id: IMG_OG/);
  assert.match(markdown, /preferred_format: webp/);
  assert.match(markdown, /Acne Treatment preview image/);
});

test("does not require prompt companion when all images are generated", () => {
  const manifest = buildImageManifest({
    ...packet,
    images: packet.images.map((image) => ({
      ...image,
      status: "generated" as const
    }))
  });

  assert.equal(manifest.promptCompanionRequired, false);
  assert.equal(renderImagePromptBriefs(manifest), "");
});
