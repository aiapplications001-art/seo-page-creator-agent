import test from "node:test";
import assert from "node:assert/strict";
import { generatePreWritingStrategy } from "../src/lib/prewriting-strategy.js";
import type { ClusterStrategy } from "../src/lib/cluster-strategy.js";

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
  assert.equal(strategy.pageStructure.sections[0].id, "S1_hero");
  assert.equal(strategy.pageStructure.sections.at(-1)?.id, "S10_references");
  assert.ok(strategy.pageStructure.sections.some((section) => section.id === "S8_faq"));
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
