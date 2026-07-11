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
  assert.ok(result.createdFiles.some((file) => file.endsWith("research-extraction-matrix.json")));
  assert.ok(result.createdFiles.some((file) => file.endsWith("research-extraction-matrix.md")));
  assert.ok(result.createdFiles.some((file) => file.endsWith("competitor-depth-delta.json")));
  assert.ok(result.createdFiles.some((file) => file.endsWith("competitor-depth-delta.md")));
  assert.ok(result.createdFiles.some((file) => file.endsWith("audience-pain-point-ledger.json")));
  assert.ok(result.createdFiles.some((file) => file.endsWith("audience-pain-point-ledger.md")));
  assert.ok(result.createdFiles.some((file) => file.endsWith("pre-draft-synthesis-brief.json")));
  assert.ok(result.createdFiles.some((file) => file.endsWith("pre-draft-synthesis-brief.md")));
  assert.ok(result.createdFiles.some((file) => file.endsWith("pre-draft-quality-brief.json")));
  assert.ok(result.createdFiles.some((file) => file.endsWith("pre-draft-quality-brief.md")));
  assert.ok(result.createdFiles.some((file) => file.endsWith("depth-score.json")));
  assert.ok(result.createdFiles.some((file) => file.endsWith("depth-score.md")));
  assert.ok(result.createdFiles.some((file) => file.endsWith("final-copy-draft.json")));
  assert.ok(result.createdFiles.some((file) => file.endsWith("final-copy-draft.md")));

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

  const depthScore = JSON.parse(
    await readFile(path.join(cwd, ".seo-agent-workspace", "v2", "page-packets", "acne-treatment", "P1", "depth-score.json"), "utf8")
  );
  assert.equal(depthScore.schemaVersion, "page-depth-score.v2");
  assert.equal(depthScore.thresholds.minimumOverallScore, 85);
  assert.equal(depthScore.thresholds.minimumDimensionScore, 4);

  const qualityBrief = JSON.parse(
    await readFile(path.join(cwd, ".seo-agent-workspace", "v2", "page-packets", "acne-treatment", "P1", "pre-draft-quality-brief.json"), "utf8")
  );
  assert.equal(qualityBrief.schemaVersion, "pre-draft-quality-brief.v2");
  assert.equal(qualityBrief.status, "missing");
  assert.equal(qualityBrief.thresholds.minimumSubIntents, 6);
  assert.equal(qualityBrief.thresholds.minimumReaderQuestions, 8);
  assert.equal(qualityBrief.thresholds.minimumRecommendationSanityChecks, 3);
  assert.equal(qualityBrief.thresholds.minimumClaimRiskItems, 5);
  assert.equal(qualityBrief.thresholds.minimumTroubleshootingItems, 4);
  assert.ok(qualityBrief.requiredDimensions.includes("diagnostic_depth"));
  assert.ok(qualityBrief.requiredDimensions.includes("india_specificity"));
  assert.ok(qualityBrief.requiredDimensions.includes("standout_element"));
  assert.ok(qualityBrief.requiredDimensions.includes("publish_worthiness"));
  assert.deepEqual(qualityBrief.readerQuestionCoverage, []);
  assert.deepEqual(qualityBrief.recommendationSanityPlan, []);
  assert.deepEqual(qualityBrief.claimRiskPlan, []);
  assert.deepEqual(qualityBrief.troubleshootingPlan, []);
  assert.equal(qualityBrief.brandCtaFit.supportedCtaPromise, "");
  assert.equal(qualityBrief.researchDerivedStructurePlan.primaryUserConcern, "");
  assert.deepEqual(qualityBrief.researchDerivedStructurePlan.sections, []);
  assert.deepEqual(qualityBrief.researchDerivedStructurePlan.highImpactComponents, []);

  const finalCopyDraft = JSON.parse(
    await readFile(path.join(cwd, ".seo-agent-workspace", "v2", "page-packets", "acne-treatment", "P1", "final-copy-draft.json"), "utf8")
  );
  assert.equal(finalCopyDraft.schemaVersion, "final-copy-draft.v2");
  assert.equal(finalCopyDraft.status, "missing");
  assert.deepEqual(finalCopyDraft.sections, []);
  assert.deepEqual(finalCopyDraft.structurePlanDeliveryProof.highImpactComponentsDelivered, []);
});
