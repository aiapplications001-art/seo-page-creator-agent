import assert from "node:assert/strict";
import { test } from "node:test";
import { createCategoryDiscoveryTemplates } from "../src/lib/category-discovery/templates.js";

test("category discovery templates use failing verdicts and guidance without realistic examples", () => {
  const templates = createCategoryDiscoveryTemplates({
    runId: "cat-20260801-101500",
    createdAt: "2026-08-01T10:15:00.000Z",
    business: "Skincare guidance and product education",
    company: "MyMirror",
    market: "India",
    mode: "batch_growth",
    seeds: ["acne", "acne scars"],
    sites: ["https://mymirror.fit"],
    competitors: ["https://example-competitor.com"],
    references: [],
    imports: {
      searchConsole: ["./gsc.csv"],
      keywords: [],
      siteInventory: []
    }
  });

  assert.equal(templates.seedUniverse.verdict.status, "fail");
  assert.equal(templates.clusterPortfolio.verdict.status, "fail");
  assert.equal(templates.clusterBoundary.verdict.status, "fail");
  assert.equal(templates.seedUniverse.inputProvenance.originalUserInput, null);
  assert.equal(templates.seedUniverse.inputProvenance.business, "Skincare guidance and product education");
  assert.equal(templates.seedUniverse.fieldGuidance.selectedSeedUniverse.includes("broad"), true);
  assert.deepEqual(templates.clusterPortfolio.candidateClusters, []);
  assert.deepEqual(templates.clusterBoundary.includedSubareas, []);
});
