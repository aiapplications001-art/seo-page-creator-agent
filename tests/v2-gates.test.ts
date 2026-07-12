import assert from "node:assert/strict";
import { test } from "node:test";
import {
  allMandatoryGatesPassed,
  validateAudienceDefinitionGate,
  validateCitationSetGate,
  validateContentBriefGate,
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

test("content brief gate passes only when Step 8 compiler contract is complete", () => {
  const result = validateContentBriefGate({
    upstreamHashes: {
      step0AHash: "0a",
      step0BHash: "0b",
      pageJobHash: "job",
      searchIntentHash: "intent",
      pageFormatHash: "format",
      nextActionHash: "next",
      serpCompetitorHash: "serp",
      topicResearchHash: "research",
      uniqueAngleHash: "angle"
    },
    contentBriefSummaryStatement: "Create a researched India-focused guide with a hard floor, safety boundaries, and unique decision support.",
    readerOutcomePromise: "After reading, the reader can make the intended decision without product-roundup drift.",
    targetWordCountContract: {
      minimumWordCount: 1800,
      targetWordCountRange: { min: 1800, max: 2400 },
      rangeBasis: "Step 2 depth, Step 5 competitor depth, Step 6 evidence, and Step 7 assets.",
      rangeFlexibility: "Go longer only for evidence-backed completeness."
    },
    depthRequirements: {
      highDepthRequirements: ["primary task", "safety boundary", "decision support"],
      supportingDepthRequirements: ["examples", "mistakes"],
      keepBriefOrExclude: ["product prices", "full ingredient encyclopedia"]
    },
    instructionRegistry: [
      {
        instructionId: "I1",
        priority: "mandatory",
        writerInstruction: "Answer the primary intent plainly near the top.",
        sourceRefs: ["searchIntentContract.satisfactionCondition"],
        deliveryTest: "Step 9 and Step 10 prove the answer is visible."
      },
      {
        instructionId: "I2",
        priority: "prohibited",
        writerInstruction: "Do not turn this into a product roundup.",
        sourceRefs: ["step0B.mustNotCover"],
        deliveryTest: "Final QA confirms no roundup drift."
      }
    ],
    upstreamCoverageMatrix: ["step0A-7 carry-forward mapped"],
    sourceUseGuidance: ["Audience-language sources cannot support medical truth claims."],
    assetBriefingContract: ["Primary asset purpose, inputs, output, fallback, and delivery test."],
    voiceAndQualityContract: { voice: "category-manager-with-editorial-empathy" },
    readabilityAndScanabilityRequirements: ["Use short paragraphs and scannable answer blocks."],
    antiGenericContract: {
      genericFailureRisks: ["Could become reusable cleansing advice."],
      pageSpecificityRequirements: ["Preserve India-market acne routine context."],
      genericPhrasesOrMovesToAvoid: ["choose the right product"]
    },
    synthesisRequirement: "Combine competitor gaps and topic research into reader decisions, not source-by-source summary.",
    brandFitBoundaries: { allowed: "soft brand bridge", prohibited: "diagnosis or aggressive sales framing" },
    recencySensitivityCheck: {
      recencySensitive: true,
      freshnessRequirements: ["Use recent support for safety and local product-context claims."]
    },
    marketLocalizationRequirements: {
      marketSensitive: true,
      requirements: ["Preserve India-specific availability and climate assumptions."]
    },
    readerObjectionHandling: {
      required: true,
      objections: ["Will this worsen acne?"]
    },
    practicalDeviceRequirements: {
      sharedBaselineConfigVersion: "step8-practical-device-baselines.v1",
      pageSpecificMinimums: ["one decision table", "two examples"]
    },
    minimumCompletenessStandard: ["Every mandatory instruction must be planned, drafted, and verified."],
    draftRepairGuidance: ["Repair under-depth with evidence-backed substance, not filler."],
    batchBriefIsolationCheck: {
      pageSpecificBrief: true,
      reusedPriorBrief: false,
      similarityToCurrentBatch: "low"
    },
    semanticBriefUniquenessCheck: {
      currentBatchUnique: true,
      historicalUniquenessChecked: true
    },
    contentBriefDeliveryProofRequirements: {
      step9Required: true,
      step10Required: true,
      finalQaRequired: true
    },
    mustCarryForward: ["contentBriefHash", "hard floor", "required asset"],
    step8OutputMustNotContain: ["final H1/H2/H3", "final copy", "image prompts"],
    step8CompletenessChecklist: {
      allUpstreamHashesPresent: true,
      instructionRegistryComplete: true,
      noStep8BoundaryViolation: true
    },
    markdownParityChecked: true,
    judgmentChecks: {
      passed: true
    }
  });

  assert.equal(result.status, "passed");
  assert.equal(result.machineChecksPassed, true);
});

test("content brief gate fails on missing hashes, failed checklist, and missing parity", () => {
  const result = validateContentBriefGate({
    upstreamHashes: {
      step0BHash: "0b"
    },
    contentBriefSummaryStatement: "Thin brief.",
    targetWordCountContract: {
      minimumWordCount: 0
    },
    depthRequirements: {
      highDepthRequirements: [],
      supportingDepthRequirements: [],
      keepBriefOrExclude: []
    },
    instructionRegistry: [],
    practicalDeviceRequirements: {},
    batchBriefIsolationCheck: {
      pageSpecificBrief: false,
      reusedPriorBrief: true,
      similarityToCurrentBatch: "high"
    },
    semanticBriefUniquenessCheck: {
      currentBatchUnique: false
    },
    contentBriefDeliveryProofRequirements: {
      step9Required: true
    },
    step8CompletenessChecklist: {
      allUpstreamHashesPresent: false
    },
    markdownParityChecked: false,
    judgmentChecks: {
      passed: true
    }
  });

  assert.equal(result.status, "failed");
  assert.ok(result.blockingIssues.some((issue) => issue.includes("Content brief requires all upstream hashes")));
  assert.ok(result.blockingIssues.includes("Content brief completeness checklist failed: allUpstreamHashesPresent."));
  assert.ok(result.blockingIssues.includes("Content brief Markdown parity must be checked."));
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
