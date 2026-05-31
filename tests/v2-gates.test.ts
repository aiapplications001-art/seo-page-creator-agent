import assert from "node:assert/strict";
import { test } from "node:test";
import {
  allMandatoryGatesPassed,
  validateAudienceDefinitionGate,
  validateCitationSetGate,
  validateNarrativeBriefGate,
  validateSerpResearchGate,
  validateSocialVideoResearchGate
} from "../src/lib/v2/gates.js";

function meaningfulSources(count: number, sourceType = "competitor") {
  return Array.from({ length: count }, (_, index) => ({
    url: `https://example.com/result-${index + 1}`,
    sourceType,
    extractionStatus: "success",
    bodySummary: "This extracted page body summary is long enough to prove meaningful content review happened.",
    h2h3Outline: ["Overview", "Decision criteria"]
  }));
}

test("SERP research gate passes only with 10 meaningful extracted sources and judgment", () => {
  const result = validateSerpResearchGate({
    analyzedSources: meaningfulSources(10),
    contentGapSynthesis: {
      gaps: ["Top pages do not explain how to choose the next step."],
      differentiationOpportunities: ["Add a decision-support block tied to the primary CTA."]
    },
    judgmentChecks: {
      passed: true
    }
  });

  assert.equal(result.status, "passed");
  assert.equal(result.machineChecksPassed, true);
  assert.equal(result.judgmentChecksPassed, true);
});

test("SERP research gate fails with fewer than 10 meaningful extractions", () => {
  const result = validateSerpResearchGate({
    analyzedSources: meaningfulSources(9),
    contentGapSynthesis: {
      gaps: ["Gap"],
      differentiationOpportunities: ["Opportunity"]
    },
    judgmentChecks: {
      passed: true
    }
  });

  assert.equal(result.status, "failed");
  assert.ok(result.blockingIssues.includes("SERP research requires 10 meaningful webpage extractions."));
});

test("SERP research gate fails when capped source types exceed 2", () => {
  const result = validateSerpResearchGate({
    analyzedSources: [
      ...meaningfulSources(7),
      ...meaningfulSources(3, "forum")
    ],
    contentGapSynthesis: {
      gaps: ["Gap"],
      differentiationOpportunities: ["Opportunity"]
    },
    judgmentChecks: {
      passed: true
    }
  });

  assert.equal(result.status, "failed");
  assert.ok(result.blockingIssues.includes("At most 2 analyzed SERP sources can be capped source types."));
});

test("social/video research gate passes with 7 attempted and 5 reviewed assets", () => {
  const result = validateSocialVideoResearchGate({
    assets: [
      { id: "A1", accessStatus: "reviewed" },
      { id: "A2", accessStatus: "reviewed" },
      { id: "A3", accessStatus: "reviewed" },
      { id: "A4", accessStatus: "reviewed" },
      { id: "A5", accessStatus: "reviewed" },
      { id: "A6", accessStatus: "inaccessible", failureReason: "private account" },
      { id: "A7", accessStatus: "inaccessible", failureReason: "no transcript" }
    ],
    insights: ["Creators frame the problem around recurring confusion and low-trust product advice."],
    judgmentChecks: {
      passed: true
    }
  });

  assert.equal(result.status, "passed");
  assert.equal(result.machineChecksPassed, true);
});

test("social/video research gate passes with limited confidence when access failures are logged", () => {
  const result = validateSocialVideoResearchGate({
    assets: [
      { id: "A1", accessStatus: "reviewed" },
      { id: "A2", accessStatus: "reviewed" },
      { id: "A3", accessStatus: "inaccessible", failureReason: "blocked" },
      { id: "A4", accessStatus: "inaccessible", failureReason: "private account" },
      { id: "A5", accessStatus: "inaccessible", failureReason: "removed" },
      { id: "A6", accessStatus: "inaccessible", failureReason: "no transcript" },
      { id: "A7", accessStatus: "inaccessible", failureReason: "region unavailable" }
    ],
    insights: ["Accessible assets still show one useful reader objection."],
    judgmentChecks: {
      passed: true
    }
  });

  assert.equal(result.status, "passed_limited_confidence");
  assert.ok(result.advisoryIssues.includes("Social/video research passed with limited confidence."));
});

test("audience definition gate requires awareness, takeaway, objections, and CTA connection", () => {
  const passed = validateAudienceDefinitionGate({
    targetCohort: "Indian adults comparing acne analysis options",
    awarenessStage: "problem-aware",
    readerTakeaway: "Reassured and ready for a first step",
    objections: ["Is this just a sales page?", "Do I need a dermatologist instead?"],
    ctaConnection: "The CTA offers a low-friction skin analysis before product choice.",
    judgmentChecks: {
      passed: true
    }
  });

  assert.equal(passed.status, "passed");

  const failed = validateAudienceDefinitionGate({
    targetCohort: "Indian adults",
    awarenessStage: "problem-aware",
    readerTakeaway: "Educated",
    objections: [],
    ctaConnection: "",
    judgmentChecks: {
      passed: true
    }
  });

  assert.equal(failed.status, "failed");
  assert.ok(failed.blockingIssues.includes("Audience definition must include at least one objection or trust barrier."));
  assert.ok(failed.blockingIssues.includes("Audience definition must connect the reader to the CTA."));
});

test("narrative brief gate requires primary style, opening angle, brand POV, and section direction", () => {
  const result = validateNarrativeBriefGate({
    primaryStyle: "professional_compact_guide",
    openingAngle: "Start with recurring acne confusion and a low-pressure first step.",
    brandPov: "Clear guidance before product recommendation.",
    pagePromise: "Help readers decide their next acne-related action.",
    sectionDirections: [{ sectionId: "S1_hero", direction: "Lead with a concrete reader problem." }],
    judgmentChecks: {
      passed: true
    }
  });

  assert.equal(result.status, "passed");

  const failed = validateNarrativeBriefGate({
    primaryStyle: "",
    openingAngle: "",
    brandPov: "",
    pagePromise: "Helpful page",
    sectionDirections: [],
    judgmentChecks: {
      passed: true
    }
  });

  assert.equal(failed.status, "failed");
  assert.ok(failed.blockingIssues.includes("Narrative brief must include a selected primary style."));
  assert.ok(failed.blockingIssues.includes("Narrative brief must include section-level direction."));
});

test("citation set gate fails when high or critical claims lack source support", () => {
  const passed = validateCitationSetGate({
    claims: [
      {
        claim: "The analysis checks visible skin signals.",
        strength: "medium",
        sourceUrl: "https://brand.example/skin-analysis",
        approvalStatus: "not_required"
      },
      {
        claim: "This health-adjacent explanation follows an authority source.",
        strength: "high",
        sourceUrl: "https://authority.example/acne",
        approvalStatus: "not_required"
      },
      {
        claim: "Approved competitor superiority claim.",
        strength: "critical",
        sourceUrl: "https://source.example/comparison",
        approvalStatus: "approved"
      }
    ],
    judgmentChecks: {
      passed: true
    }
  });

  assert.equal(passed.status, "passed");

  const failed = validateCitationSetGate({
    claims: [
      {
        claim: "Unsupported outcome claim.",
        strength: "high"
      },
      {
        claim: "Unapproved critical claim.",
        strength: "critical",
        sourceUrl: "https://source.example"
      }
    ],
    judgmentChecks: {
      passed: true
    }
  });

  assert.equal(failed.status, "failed");
  assert.ok(failed.blockingIssues.includes("High-strength claims require source support."));
  assert.ok(failed.blockingIssues.includes("Critical claims require explicit approval and source support."));
});

test("allMandatoryGatesPassed requires every gate to pass", () => {
  assert.equal(allMandatoryGatesPassed([
    { status: "passed", machineChecksPassed: true, judgmentChecksPassed: true, blockingIssues: [], advisoryIssues: [] },
    { status: "passed_limited_confidence", machineChecksPassed: true, judgmentChecksPassed: true, blockingIssues: [], advisoryIssues: [] }
  ]), true);

  assert.equal(allMandatoryGatesPassed([
    { status: "passed", machineChecksPassed: true, judgmentChecksPassed: true, blockingIssues: [], advisoryIssues: [] },
    { status: "failed", machineChecksPassed: false, judgmentChecksPassed: true, blockingIssues: ["Missing"], advisoryIssues: [] }
  ]), false);
});
