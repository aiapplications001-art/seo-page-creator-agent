import test from "node:test";
import assert from "node:assert/strict";
import {
  generatePagePacket,
  renderPagePacketMarkdown
} from "../src/lib/page-packet.js";
import type { PreWritingSection, PreWritingStrategy } from "../src/lib/prewriting-strategy.js";

const prewritingStrategy: PreWritingStrategy = {
  companyName: "ClearNest",
  market: "India",
  category: { name: "Acne Treatment", slug: "acne-treatment" },
  selectedPage: {
    id: "P1",
    title: "Acne Treatment Category Page",
    pageType: "product_category",
    strategyCategory: "highest_conversion",
    targetIntent: "Help users understand the category and route them toward the best product or diagnostic action.",
    primaryCtaGoal: "Route users to the category's primary product or action destination.",
    suggestedUrlSlug: "acne-treatment",
    sourceUrl: "https://example.com/skin-care/acne-treatment/",
    evidenceStrength: "high"
  },
  audience: {
    cohort: "Indian adults with visible acne who want a practical treatment path",
    market: "India"
  },
  tone: {
    selected: "professional compact",
    requiresUserSelection: false,
    options: ["professional compact", "clear advisory", "conversion-supportive"]
  },
  keywords: {
    primary: "acne treatment",
    secondary: ["acne marks treatment", "acne treatment for oily skin"],
    clusterSeeds: ["acne treatment"]
  },
  contentDepth: {
    targetRange: "1800-2400 words",
    strict: false
  },
  cta: {
    primaryGoal: "Route users to the category's primary product or action destination.",
    recommendedDestination: "https://example.com/skin-care/acne-treatment/",
    firstFoldRequired: true,
    mobileSticky: {
      recommended: true,
      shortenedLabelRequired: true
    }
  },
  pageStructure: {
    intentPattern: "product_category",
    structureVariant: "category_solution",
    inference: {
      confidence: "high",
      signals: ["pageType=product_category"],
      notes: "Fixture product/category strategy."
    },
    h1Rule: "exactly_one",
    sections: withSectionContract([
      { id: "S1_hero", purpose: "First-fold answer, H1, primary CTA, and surrounding CTA microcopy.", contentRole: "conversion", notes: "Primary actionable must be visible." },
      { id: "S2_quick_answer", purpose: "Short answer optimized for humans and AI overview style retrieval.", contentRole: "seo", notes: "Answer directly." },
      { id: "S3_context", purpose: "Explain the problem and audience context.", contentRole: "ux", notes: "Stay aligned to cohort." },
      { id: "S4_main_content", purpose: "Main educational or category explanation.", contentRole: "seo", notes: "Explain category." },
      { id: "S5_decision_support", purpose: "Comparison table, decision criteria, checklist, or user path.", contentRole: "ux", notes: "Use qualitative labels." },
      { id: "S6_product_or_solution_block", purpose: "Connect problem to internal destination.", contentRole: "conversion", notes: "Preserve CTA destination." },
      { id: "S7_trust_proof", purpose: "Author, reviewer, methodology, experience, proof, and brand trust signals.", contentRole: "trust", notes: "Include authored-by visibility." },
      { id: "S8_faq", purpose: "Answer likely questions and support FAQ JSON-LD.", contentRole: "seo", notes: "Include FAQ schema draft." },
      { id: "S9_final_cta", purpose: "Final primary CTA and closing copy.", contentRole: "conversion", notes: "Use one primary CTA variant." },
      { id: "S10_references", purpose: "Reference URLs and source metadata.", contentRole: "reference", notes: "Only URL/source metadata." }
    ])
  },
  referenceRequirements: {
    liveSerpReviewRequired: true,
    quoteReferenceUrlsRequired: true,
    externalLinksOpenInNewTab: true,
    notes: ["Review top live search results.", "Use cited source URLs."]
  },
  imageRequirements: {
    defaultGeneratedImageCount: "3-5",
    ogImageRequired: true,
    brandGuidelineRequired: true,
    notes: ["Generate top 3-5 high-impact in-page images.", "Include a separate OG image asset."]
  },
  approvalQueues: {
    structure: [],
    content: [],
    images: [],
    critical: []
  },
  evidenceNotes: [
    {
      pointer: "Selected page P1 came from cluster opportunity highest_conversion.",
      evidenceStrength: "high",
      source: "cluster_strategy"
    }
  ],
  machineMetadata: {
    schemaVersion: "prewriting-strategy.v1",
    generatedFrom: "cluster-strategy.v1",
    selectedPageId: "P1"
  }
};

test("generates a publish-ready page packet scaffold from pre-writing strategy", () => {
  const packet = generatePagePacket({
    prewritingStrategy,
    author: {
      name: "ClearNest Editorial Team",
      descriptor: "Skin care editorial team"
    },
    reviewer: {
      name: "Clinical Review Team",
      descriptor: "Dermatology review panel"
    },
    createdDate: "2026-05-28"
  });

  assert.equal(packet.metadata.schemaVersion, "page-packet.v1");
  assert.equal(packet.metadata.pageType, "product_category");
  assert.equal(packet.seo.title, "Acne Treatment Category Page | ClearNest");
  assert.equal(packet.seo.slug, "acne-treatment");
  assert.equal(packet.seo.h1, "Acne Treatment Category Page");
  assert.equal(packet.seo.primaryKeyword, "acne treatment");
  assert.equal(packet.cta.primary.label, "Start your free skin analysis now");
  assert.equal(packet.cta.mobileSticky.label, "Start analysis");
  assert.equal(packet.authorship.author.descriptor, "Skin care editorial team");
  assert.equal(packet.rendering.mobileFirst, true);
  assert.equal(packet.sections.length, 10);
  assert.equal(packet.sections[0].id, "S1_hero");
  assert.match(packet.sections[0].markdown, /Start your free skin analysis now/);
  assert.equal(packet.images[0].id, "IMG_OG");
  assert.equal(packet.images[1].id, "IMG_HERO");
  assert.equal(packet.images[1].sectionId, "S1_hero");
  assert.equal(packet.links.internal[0].url, "https://example.com/skin-care/acne-treatment/");
  assert.equal(packet.schemaDrafts.some((schema) => schema.type === "FAQPage"), true);
  assert.equal(packet.machineReadable.sections[0].id, "S1_hero");
});

test("renders page packet markdown with editable sections and JSON mirror", () => {
  const packet = generatePagePacket({ prewritingStrategy, createdDate: "2026-05-28" });
  const markdown = renderPagePacketMarkdown(packet);

  assert.match(markdown, /# Page Packet: Acne Treatment Category Page/);
  assert.match(markdown, /## Meta Requirements/);
  assert.match(markdown, /<!-- SECTION_ID: S1_hero -->/);
  assert.match(markdown, /## Machine-Readable JSON/);
  assert.match(markdown, /"schemaVersion": "page-packet.v1"/);
});

test("requires selected tone before generating a page packet", () => {
  assert.throws(
    () => generatePagePacket({
      prewritingStrategy: {
        ...prewritingStrategy,
        tone: {
          ...prewritingStrategy.tone,
          selected: undefined,
          requiresUserSelection: true
        }
      }
    }),
    /Selected tone is required/
  );
});

function withSectionContract(
  sections: Array<Pick<PreWritingSection, "id" | "purpose" | "contentRole" | "notes">>
): PreWritingSection[] {
  return sections.map((section) => ({
    ...section,
    sectionIntent: section.id.replace(/^S[0-9]+_/, "").replace(/_/g, " "),
    evidenceNeeded: section.contentRole === "reference" ? ["reference URL"] : ["source-backed fact"],
    requiredDevices: section.contentRole === "reference" ? ["reference list"] : ["editable section"],
    evidenceBudget: {
      minimumFacts: section.contentRole === "reference" ? 0 : 1,
      minimumCitedClaims: section.contentRole === "reference" ? 0 : 1,
      minimumConcreteExamples: 0
    }
  }));
}
