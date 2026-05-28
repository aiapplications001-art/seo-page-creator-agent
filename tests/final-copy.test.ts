import test from "node:test";
import assert from "node:assert/strict";
import { expandPagePacketCopy } from "../src/lib/final-copy.js";
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
    description: "Acne Treatment Category Page for Indian adults with visible acne.",
    slug: "acne-treatment",
    h1: "Acne Treatment Category Page",
    primaryKeyword: "acne treatment",
    secondaryKeywords: ["acne marks treatment"],
    ogTitle: "Acne Treatment Category Page | ClearNest",
    ogDescription: "Acne Treatment Category Page for Indian adults with visible acne.",
    twitterTitle: "Acne Treatment Category Page | ClearNest",
    twitterDescription: "Acne Treatment Category Page for Indian adults with visible acne."
  },
  authorship: {
    author: { name: "ClearNest Editorial Team", descriptor: "Skin care editorial team" },
    reviewedByVisible: false
  },
  cta: {
    primary: {
      label: "Start your free skin analysis now",
      microcopy: "Scan your face to understand visible acne, oiliness, marks, texture, and skin signals in about 60 seconds.",
      destination: "https://example.com/skin-care/acne-treatment/"
    },
    mobileSticky: {
      label: "Start analysis",
      destination: "https://example.com/skin-care/acne-treatment/"
    }
  },
  rendering: {
    mobileFirst: true,
    desktopNotes: ["Keep CTA first-fold."],
    mobileNotes: ["Use sticky CTA."]
  },
  sections: [
    {
      id: "S1_hero",
      heading: "Hero",
      role: "conversion",
      markdown: "Editable section scaffold for Hero."
    },
    {
      id: "S2_quick_answer",
      heading: "Quick Answer",
      role: "seo",
      markdown: "Editable section scaffold for Quick Answer."
    },
    {
      id: "S10_references",
      heading: "References",
      role: "reference",
      markdown: "Add reference URLs after live search."
    }
  ],
  links: {
    internal: [
      {
        url: "https://example.com/skin-care/acne-treatment/",
        anchorText: "Acne Treatment",
        placement: "primary CTA and contextual body link"
      }
    ],
    external: []
  },
  images: [
    {
      id: "IMG_OG",
      purpose: "Open Graph image.",
      aspectRatio: "1.91:1",
      altText: "Acne Treatment preview image",
      status: "reserved"
    }
  ],
  schemaDrafts: [
    {
      type: "WebPage",
      jsonLd: { "@type": "WebPage" }
    }
  ],
  machineReadable: {
    sections: [],
    images: [],
    links: { internal: [], external: [] }
  }
};

test("expands page packet section scaffolds while preserving packet structure", () => {
  const expanded = expandPagePacketCopy(packet);

  assert.equal(expanded.metadata.schemaVersion, "page-packet.v1");
  assert.equal(expanded.metadata.copyStatus, "expanded_review_ready");
  assert.deepEqual(expanded.sections.map((section) => section.id), ["S1_hero", "S2_quick_answer", "S10_references"]);
  assert.notEqual(expanded.sections[0].markdown, packet.sections[0].markdown);
  assert.match(expanded.sections[0].markdown, /Start your free skin analysis now/);
  assert.match(expanded.sections[1].markdown, /acne treatment/);
  assert.match(expanded.sections[2].markdown, /Reference URLs still need live source review/);
  assert.deepEqual(expanded.images, packet.images);
  assert.deepEqual(expanded.links, packet.links);
  assert.equal(expanded.machineReadable.sections[0].markdown, expanded.sections[0].markdown);
});
