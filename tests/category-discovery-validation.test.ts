import assert from "node:assert/strict";
import { mkdir, mkdtemp, readFile, writeFile } from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import { test } from "node:test";
import { hashCategoryArtifact, stripFieldGuidance } from "../src/lib/category-discovery/hash.js";
import { getCategoryDiscoveryPaths } from "../src/lib/category-discovery/paths.js";
import { createCategoryDiscoveryTemplates } from "../src/lib/category-discovery/templates.js";
import { validateCategoryDiscoveryRun } from "../src/lib/category-discovery/validation.js";

test("hashing ignores fieldGuidance", () => {
  const base = { value: "acne scar treatment", fieldGuidance: { value: "fill me" } };
  const changedGuidance = { value: "acne scar treatment", fieldGuidance: { value: "different" } };
  assert.deepEqual(stripFieldGuidance(base), { value: "acne scar treatment" });
  assert.equal(hashCategoryArtifact(base), hashCategoryArtifact(changedGuidance));
});

test("validation fails empty templates and writes report", async () => {
  const cwd = await mkdtemp(path.join(os.tmpdir(), "seo-category-validation-"));
  const workspaceRoot = path.join(cwd, ".seo-agent-workspace");
  const runId = "cat-20260801-101500";
  const paths = getCategoryDiscoveryPaths(workspaceRoot, runId);
  await mkdir(paths.runRoot, { recursive: true });
  const templates = createCategoryDiscoveryTemplates({
    runId,
    createdAt: "2026-08-01T10:15:00.000Z",
    business: "Skincare guidance",
    company: "MyMirror",
    market: "India",
    mode: "batch_growth",
    seeds: ["acne"],
    sites: ["https://mymirror.fit"],
    competitors: [],
    references: [],
    imports: { searchConsole: [], keywords: [], siteInventory: [] }
  });
  await writeFile(paths.seedUniverse, JSON.stringify(templates.seedUniverse, null, 2));
  await writeFile(paths.clusterPortfolio, JSON.stringify(templates.clusterPortfolio, null, 2));
  await writeFile(paths.clusterBoundary, JSON.stringify(templates.clusterBoundary, null, 2));

  const result = await validateCategoryDiscoveryRun({
    workspaceRoot,
    runId,
    writeReport: true,
    now: "2026-08-01T11:00:00.000Z"
  });

  assert.equal(result.combinedVerdict.status, "fail");
  assert.ok(result.combinedVerdict.blockers.includes("seed-universe-contract.json verdict is fail"));
  const report = JSON.parse(await readFile(paths.validation, "utf8"));
  assert.equal(report.schemaVersion, "category-discovery-validation.v1");
  assert.equal(report.combinedVerdict.status, "fail");
});
