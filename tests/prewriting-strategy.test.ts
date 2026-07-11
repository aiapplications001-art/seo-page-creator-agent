import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { generatePreWritingStrategy } from "../src/lib/prewriting-strategy.js";
import type { ClusterStrategy, PageOpportunity } from "../src/lib/cluster-strategy.js";

const clusterStrategy: ClusterStrategy = {
  companyName: "ClearNest",
  market: "India",
  category: {
    name: "Acne Treatment",
    slug: "acne-treatment"
  },
  sourceMetadata: {
    urlsConsidered: 10,
    urlsMatched: 3,
    seedKeywords: ["acne treatment", "acne marks treatment"]
  },
  existingUrlCandidates: [
    {
      url: "https://example.com/skin-care/acne-treatment/",
      pageType: "product_category",
      title: "Acne Treatment Products | ClearNest",
      h1: "Acne Treatment",
      evidenceStrength: "high",
      matchReason: "fixture"
    }
  ],
  pageOpportunities: [
    {
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
    {
      id: "P3",
      title: "Acne Treatment Comparison Page",
      pageType: "comparison",
      strategyCategory: "competitor_category",
      targetIntent: "Support users comparing alternatives before they choose a solution.",
      primaryCtaGoal: "Route high-intent comparison traffic to the best internal product/category destination.",
      suggestedUrlSlug: "acne-treatment-comparison",
      evidenceStrength: "medium"
    }
  ],
  internalLinkSuggestions: [
    {
      sourceUrl: "https://example.com/blog/acne-marks-vs-acne-scars/",
      destinationUrl: "https://example.com/skin-care/acne-treatment/",
      placement: "header",
      anchorText: "Acne Treatment",
      reason: "fixture"
    }
  ],
  qualityScore: {
    score: 82,
    advisoryOnly: true,
    topIssues: []
  },
  assumptions: [
    {
      statement: "Acne Treatment has enough site-inventory evidence to draft a cluster strategy.",
      evidenceStrength: "high",
      source: "metadata"
    }
  ],
  nextPageSelection: {
    instruction: "User should select one page opportunity to generate next.",
    recommendedPageId: "P1"
  }
};

test("generates a pre-writing strategy for one selected product category page", () => {
  const strategy = generatePreWritingStrategy({
    clusterStrategy,
    selectedPageId: "P1",
    audienceCohort: "Indian adults with visible acne who want a practical treatment path",
    selectedTone: "professional compact",
    contentDepthTarget: "1800-2400 words",
    primaryKeyword: "acne treatment",
    secondaryKeywords: ["acne marks treatment", "acne treatment for oily skin"]
  });

  assert.equal(strategy.companyName, "ClearNest");
  assert.equal(strategy.selectedPage.id, "P1");
  assert.equal(strategy.selectedPage.pageType, "product_category");
  assert.equal(strategy.audience.cohort, "Indian adults with visible acne who want a practical treatment path");
  assert.equal(strategy.tone.selected, "professional compact");
  assert.equal(strategy.tone.requiresUserSelection, false);
  assert.deepEqual(strategy.keywords.secondary, ["acne marks treatment", "acne treatment for oily skin"]);
  assert.equal(strategy.contentDepth.targetRange, "1800-2400 words");
  assert.equal(strategy.contentDepth.strict, false);
  assert.equal(strategy.cta.primaryGoal, "Route users to the category's primary product or action destination.");
  assert.equal(strategy.cta.mobileSticky.recommended, true);
  assert.equal(strategy.pageStructure.intentPattern, "product_category");
  assert.equal(strategy.pageStructure.structureVariant, "category_solution");
  assert.ok(strategy.pageStructure.researchBasis.length >= 1);
  assert.match(strategy.pageStructure.structureUniquenessRationale, /must not reuse a structure from another page, batch, or historical run/);
  assert.deepEqual(strategy.pageStructure.mustDifferFromPages, []);
  assert.equal(strategy.pageStructure.sections[0].id, "S1_hero");
  assert.equal(strategy.pageStructure.sections.at(-1)?.id, "S10_references");
  assert.ok(strategy.pageStructure.sections.some((section) => section.id === "S8_faq"));
  assert.ok(strategy.pageStructure.sections.every((section) => section.sectionIntent.length > 0));
  assert.ok(strategy.pageStructure.sections.every((section) => section.evidenceNeeded.length > 0));
  assert.ok(strategy.pageStructure.sections.every((section) => section.requiredDevices.length > 0));
  assert.ok(strategy.pageStructure.sections.every((section) => section.evidenceBudget.minimumFacts >= 0));
  assert.equal(strategy.referenceRequirements.liveSerpReviewRequired, true);
  assert.equal(strategy.imageRequirements.defaultGeneratedImageCount, "3-5");
  assert.equal(strategy.approvalQueues.critical.length, 0);
  assert.equal(strategy.machineMetadata.schemaVersion, "prewriting-strategy.v1");
});

test("does not choose a default tone when user has not selected one", () => {
  const strategy = generatePreWritingStrategy({
    clusterStrategy,
    selectedPageId: "P3",
    audienceCohort: "Comparison shoppers evaluating acne treatment formats",
    primaryKeyword: "acne cream vs gel"
  });

  assert.equal(strategy.tone.selected, undefined);
  assert.equal(strategy.tone.requiresUserSelection, true);
  assert.equal(strategy.tone.options.length, 3);
  assert.equal(strategy.approvalQueues.critical[0].item, "Competitor or external brand mentions");
  assert.equal(strategy.approvalQueues.critical[0].reason, "Comparison pages may mention competitors or external products and require explicit approval before inclusion.");
  assert.equal(strategy.contentDepth.targetRange, "1200-1800 words");
});

test("adapts comparison pages to a methodology and decision-matrix structure", () => {
  const strategy = generatePreWritingStrategy({
    clusterStrategy,
    selectedPageId: "P3",
    audienceCohort: "Comparison shoppers evaluating acne treatment formats",
    selectedTone: "balanced evaluator"
  });

  assert.equal(strategy.pageStructure.intentPattern, "comparison");
  assert.equal(strategy.pageStructure.structureVariant, "comparison_matrix");
  assert.deepEqual(
    strategy.pageStructure.sections.map((section) => section.id),
    [
      "S1_hero",
      "S2_quick_verdict",
      "S3_comparison_methodology",
      "S4_decision_criteria",
      "S5_side_by_side_matrix",
      "S6_reader_fit_tradeoffs",
      "S7_trust_proof",
      "S8_faq",
      "S9_final_cta",
      "S10_references"
    ]
  );
  assert.equal(new Set(strategy.pageStructure.sections.map((section) => section.id)).size, strategy.pageStructure.sections.length);
  assert.match(strategy.pageStructure.sections[2].notes, /methodology/i);
  assert.ok(strategy.pageStructure.sections[4].requiredDevices.includes("side-by-side comparison matrix"));
});

test("infers pricing structure before guide or comparison signals", () => {
  const pricingPage: PageOpportunity = {
    id: "P4",
    title: "Acne Treatment Pricing and Cost Guide",
    pageType: "guide_blog",
    strategyCategory: "high_competition",
    targetIntent: "Help readers understand prices, fees, package cost drivers, and whether acne treatment is worth it.",
    primaryCtaGoal: "Route readers to the pricing or consultation path.",
    suggestedUrlSlug: "acne-treatment-pricing-cost",
    evidenceStrength: "medium"
  };
  const strategy = generatePreWritingStrategy({
    clusterStrategy: withPage(pricingPage),
    selectedPageId: "P4",
    audienceCohort: "Cost-conscious acne treatment shoppers",
    selectedTone: "professional compact"
  });

  assert.equal(strategy.pageStructure.intentPattern, "pricing");
  assert.equal(strategy.pageStructure.structureVariant, "pricing_decision");
  assert.ok(strategy.pageStructure.sections.some((section) => section.id === "S3_cost_drivers"));
  assert.ok(strategy.pageStructure.sections.some((section) => section.id === "S4_pricing_ranges"));
  assert.ok(strategy.pageStructure.sections.some((section) => section.id === "S5_value_tradeoffs"));
  assert.ok(!strategy.pageStructure.sections.some((section) => section.id === "S4_main_content"));
  assert.match(strategy.pageStructure.sections.find((section) => section.id === "S4_pricing_ranges")?.notes ?? "", /cost transparency/i);
});

test("infers how-to structure for step-by-step guide intent", () => {
  const howToPage: PageOpportunity = {
    id: "P5",
    title: "How To Use Acne Treatment Serum",
    pageType: "guide_blog",
    strategyCategory: "low_competition",
    targetIntent: "Show readers the steps, routine order, mistakes, and expected outcomes for using treatment serum safely.",
    primaryCtaGoal: "Route readers to the acne treatment serum page.",
    suggestedUrlSlug: "how-to-use-acne-treatment-serum",
    evidenceStrength: "medium"
  };
  const strategy = generatePreWritingStrategy({
    clusterStrategy: withPage(howToPage),
    selectedPageId: "P5",
    audienceCohort: "First-time serum users",
    selectedTone: "empathetic educational"
  });

  assert.equal(strategy.pageStructure.intentPattern, "how_to");
  assert.equal(strategy.pageStructure.structureVariant, "step_by_step_guide");
  assert.deepEqual(
    strategy.pageStructure.sections.slice(2, 6).map((section) => section.id),
    ["S3_prerequisites_safety", "S4_step_by_step_process", "S5_mistakes_troubleshooting", "S6_expected_outcome"]
  );
  assert.ok(strategy.pageStructure.sections.find((section) => section.id === "S4_step_by_step_process")?.requiredDevices.includes("numbered steps"));
});

test("prewriting schema declares structure variant and section content contract fields", () => {
  const schema = JSON.parse(readFileSync("schemas/prewriting-strategy.schema.json", "utf8"));
  assert.ok(schema.properties.pageStructure.required.includes("intentPattern"));
  assert.ok(schema.properties.pageStructure.required.includes("structureVariant"));
  assert.ok(schema.properties.pageStructure.required.includes("researchBasis"));
  assert.ok(schema.properties.pageStructure.required.includes("structureUniquenessRationale"));
  assert.ok(schema.properties.pageStructure.required.includes("mustDifferFromPages"));
  const sectionRequired = schema.properties.pageStructure.properties.sections.items.required;
  assert.ok(sectionRequired.includes("sectionIntent"));
  assert.ok(sectionRequired.includes("evidenceNeeded"));
  assert.ok(sectionRequired.includes("requiredDevices"));
  assert.ok(sectionRequired.includes("evidenceBudget"));
});

test("throws when selected page is not in the cluster strategy", () => {
  assert.throws(
    () => generatePreWritingStrategy({
      clusterStrategy,
      selectedPageId: "P9",
      audienceCohort: "Unknown audience"
    }),
    /Selected page P9 was not found/
  );
});

function withPage(page: PageOpportunity): ClusterStrategy {
  return {
    ...clusterStrategy,
    pageOpportunities: [...clusterStrategy.pageOpportunities, page]
  };
}
