import assert from "node:assert/strict";
import { mkdtemp, readFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import path from "node:path";
import { test } from "node:test";
import { prepareV2PageWorkspace } from "../src/lib/v2/templates.js";

test("prepareV2PageWorkspace creates required V2 artifacts", async () => {
  const cwd = await mkdtemp(path.join(tmpdir(), "seo-v2-"));

  const result = await prepareV2PageWorkspace({
    cwd,
    clusterSlug: "acne-treatment",
    pageId: "P1",
    pageType: "product_category"
  });

  assert.equal(result.state.status, "in_progress");
  assert.equal(result.state.gates.serpResearch.status, "missing");
  assert.ok(result.createdFiles.some((file) => file.endsWith("page-state.json")));
  assert.ok(result.createdFiles.some((file) => file.endsWith("serp-research-ledger.json")));
  assert.ok(result.createdFiles.some((file) => file.endsWith("social-video-research.md")));
  assert.ok(result.createdFiles.some((file) => file.endsWith("human-editorial-brief.json")));
  assert.ok(result.createdFiles.some((file) => file.endsWith("claim-first-section-plan.md")));
  assert.ok(result.createdFiles.some((file) => file.endsWith("section-version-history.json")));

  const stateJson = JSON.parse(
    await readFile(path.join(cwd, ".seo-agent-workspace", "v2", "page-packets", "acne-treatment", "P1", "page-state.json"), "utf8")
  );
  assert.equal(stateJson.schemaVersion, "page-state.v2");
  assert.equal(stateJson.status, "in_progress");

  const humanBrief = JSON.parse(
    await readFile(path.join(cwd, ".seo-agent-workspace", "v2", "page-packets", "acne-treatment", "P1", "human-editorial-brief.json"), "utf8")
  );
  assert.equal(humanBrief.schemaVersion, "human-editorial-brief.v2");
  assert.equal(humanBrief.voiceModel, "category_manager_with_editorial_empathy");
  assert.equal(humanBrief.visibility.default, "internal_only");
  assert.equal(humanBrief.exampleRequirement.minimumExamplesPerPage, 2);
  assert.equal(humanBrief.depthStrategy.pageType, "product_category");
  assert.equal(humanBrief.depthStrategy.depth, "medium");

  const claimPlan = JSON.parse(
    await readFile(path.join(cwd, ".seo-agent-workspace", "v2", "page-packets", "acne-treatment", "P1", "claim-first-section-plan.json"), "utf8")
  );
  assert.equal(claimPlan.schemaVersion, "claim-first-section-plan.v2");
  assert.equal(claimPlan.status, "missing");
  assert.ok(claimPlan.sectionPlanTemplate.requiredFields.includes("sectionClaim"));
});
