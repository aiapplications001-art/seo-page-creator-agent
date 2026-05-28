import test from "node:test";
import assert from "node:assert/strict";
import { generateClusterStrategy } from "../src/lib/cluster-strategy.js";
import type { PageMetadata } from "../src/lib/metadata.js";

const metadata: PageMetadata[] = [
  {
    url: "https://example.com/skin-care/acne-treatment/",
    title: "Acne Treatment Products | ClearNest",
    metaDescription: "Explore acne treatment products for Indian skin.",
    canonical: "https://example.com/skin-care/acne-treatment/",
    h1: "Acne Treatment",
    h2s: ["Personalized acne care", "Start your skin analysis"],
    schemaTypes: ["CollectionPage"],
    pageType: "product_category",
    classificationReason: "fixture"
  },
  {
    url: "https://example.com/blog/acne-marks-vs-acne-scars/",
    title: "Acne Marks vs Acne Scars | ClearNest Guide",
    metaDescription: "Understand acne marks, scars, and when to choose treatment.",
    canonical: "https://example.com/blog/acne-marks-vs-acne-scars/",
    h1: "Acne Marks vs Acne Scars",
    h2s: ["Visible differences", "Treatment options"],
    schemaTypes: ["Article", "FAQPage"],
    pageType: "guide_blog",
    classificationReason: "fixture"
  },
  {
    url: "https://example.com/compare/acne-cream-vs-gel/",
    title: "Acne Cream vs Gel | ClearNest",
    metaDescription: "Compare acne cream and gel formats.",
    canonical: "https://example.com/compare/acne-cream-vs-gel/",
    h1: "Acne Cream vs Gel",
    h2s: ["Best for oily skin", "Best for active acne"],
    schemaTypes: [],
    pageType: "comparison",
    classificationReason: "fixture"
  },
  {
    url: "https://example.com/hair-care/hair-fall/",
    title: "Hair Fall Products | ClearNest",
    metaDescription: "Hair fall care.",
    canonical: "https://example.com/hair-care/hair-fall/",
    h1: "Hair Fall",
    h2s: [],
    schemaTypes: [],
    pageType: "product_category",
    classificationReason: "fixture"
  }
];

test("generates a product category cluster strategy from matching metadata", () => {
  const strategy = generateClusterStrategy({
    companyName: "ClearNest",
    categoryName: "Acne Treatment",
    market: "India",
    metadata,
    seedKeywords: ["acne treatment", "acne marks treatment"]
  });

  assert.equal(strategy.companyName, "ClearNest");
  assert.equal(strategy.category.name, "Acne Treatment");
  assert.equal(strategy.market, "India");
  assert.equal(strategy.sourceMetadata.urlsConsidered, 4);
  assert.equal(strategy.sourceMetadata.urlsMatched, 3);
  assert.deepEqual(
    strategy.existingUrlCandidates.map((candidate) => candidate.url),
    [
      "https://example.com/skin-care/acne-treatment/",
      "https://example.com/blog/acne-marks-vs-acne-scars/",
      "https://example.com/compare/acne-cream-vs-gel/"
    ]
  );
  assert.equal(strategy.pageOpportunities.length, 3);
  assert.deepEqual(
    strategy.pageOpportunities.map((opportunity) => opportunity.pageType),
    ["product_category", "guide_blog", "comparison"]
  );
  assert.equal(strategy.pageOpportunities[0].strategyCategory, "highest_conversion");
  assert.equal(strategy.pageOpportunities[1].strategyCategory, "first_organic_wins");
  assert.equal(strategy.pageOpportunities[2].strategyCategory, "competitor_category");
  assert.equal(strategy.internalLinkSuggestions[0].sourceUrl, "https://example.com/blog/acne-marks-vs-acne-scars/");
  assert.equal(strategy.internalLinkSuggestions[0].destinationUrl, "https://example.com/skin-care/acne-treatment/");
  assert.equal(strategy.qualityScore.score, 82);
  assert.ok(strategy.qualityScore.topIssues.some((issue) => issue.area === "FAQ schema"));
  assert.ok(strategy.assumptions.some((assumption) => assumption.evidenceStrength === "high"));
  assert.equal(strategy.nextPageSelection.recommendedPageId, "P1");
});

test("uses low confidence assumptions when no matching metadata exists", () => {
  const strategy = generateClusterStrategy({
    companyName: "ClearNest",
    categoryName: "Pigmentation",
    market: "India",
    metadata,
    seedKeywords: []
  });

  assert.equal(strategy.sourceMetadata.urlsMatched, 0);
  assert.equal(strategy.existingUrlCandidates.length, 0);
  assert.equal(strategy.pageOpportunities[0].pageType, "product_category");
  assert.equal(strategy.pageOpportunities[0].strategyCategory, "startup_conversion");
  assert.ok(strategy.assumptions.every((assumption) => assumption.evidenceStrength === "low"));
});
