import assert from "node:assert/strict";
import { test } from "node:test";
import {
  allMandatoryGatesPassed,
  validateAudienceDefinitionGate,
  validateCitationSetGate,
  validateContentBriefGate,
  validateFirstDraftGate,
  validateNarrativeBriefGate,
  validatePageOutlineGate,
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

const completeOutlineSections = Array.from({ length: 8 }, (_, index) => ({
  sectionId: `section-${String(index + 1).padStart(2, "0")}`,
  headingText: index === 0 ? "Quick answer: when this routine helps or hurts" : `Evidence-backed section ${index + 1}`,
  sectionRole: index === 0 ? "quick_answer" : index === 6 ? "faq" : "core_explanation",
  mappedStep8Refs: [`instruction-${index + 1}`],
  purpose: "Move the reader through the promised outline step with page-specific reasoning.",
  depthLevel: index < 3 ? "high" as const : "medium" as const,
  depthReason: "Depth follows Step 8 obligations and the reader's decision need.",
  expectedTreatment: "Answer, explain, support with evidence, and keep the section scoped.",
  mappedDepthRequirementRefs: [`depth-${index + 1}`],
  contentObligations: ["answer", "evidence use", "scope boundary"],
  h3s: index < 3 ? ["What to know", "What to do"] : [],
  h3Rationale: index < 3 ? undefined : "This section is concise enough without substructure.",
  assetPlacements: index === 3 ? ["primary matrix placeholder"] : [],
  examplePlacements: ["one page-specific example"],
  internalLinkNotes: ["Use broad section-level link guidance only."],
  ctaNotes: index === 7 ? ["Soft next action near section end."] : [],
  claimEvidenceNotes: "Use Step 6/8 source guidance and soften high-risk claims.",
  scopeBoundaryRisk: index === 4,
  scopeBoundaryNotes: index === 4 ? ["Do not turn this into a product roundup."] : [],
  transitionFromPrevious: index === 0 ? undefined : "Continue from the prior reader question into the next needed decision."
}));

test("page outline gate passes a complete Step 9 blueprint", () => {
  const result = validatePageOutlineGate({
    upstreamHashes: {
      step0AHash: "0a",
      step0BHash: "0b",
      pageJobHash: "job",
      searchIntentHash: "intent",
      pageFormatHash: "format",
      nextActionHash: "next",
      serpCompetitorHash: "serp",
      topicResearchHash: "research",
      uniqueAngleHash: "angle",
      contentBriefHash: "brief"
    },
    pageOutlineHash: "outline",
    workingH1: "How to Build a Safe, Evidence-Backed Routine",
    pageFlowType: "problem_to_solution",
    pageFlowReason: "The reader needs the concern answered early, then needs context, decision support, troubleshooting, and next action.",
    pageFlowStep8Refs: ["contentBriefSummaryStatement", "readerOutcomePromise"],
    readerJourneySummaryStatement: "This outline answers the concern early, then guides fit, risks, troubleshooting, and a safer next step.",
    sectionSequenceRationale: "The order follows the search problem before context so the primary concern is not buried.",
    mainIntentVisibilityCheck: {
      visibleInFirstTwoH2s: true,
      evidenceRefs: ["searchIntentContract.satisfactionCondition"]
    },
    outlineSections: completeOutlineSections,
    queryCoveragePlan: {
      targetKeywordMapped: true,
      supportingQueriesMapped: true,
      doNotForceTerms: ["best product", "cheap price"]
    },
    assetPlacementPlan: ["Place the primary decision matrix in section-04; Step 10 writes rows."],
    internalLinkPlacementPlan: ["Use one contextual internal link in section-03."],
    ctaPlacementPlan: ["Use a soft next action after the checklist/summary."],
    faqPlan: {
      decision: "short",
      routedQuestions: ["Will this make acne worse?", "When should I stop?"]
    },
    contentBriefDeliveryProof: {
      allMandatoryInstructionsCovered: true,
      missingMandatoryInstructions: [],
      returnedToStep8: false
    },
    step8RefinementPatch: [
      {
        refinementType: "clarify_writer_instruction",
        reason: "Merged duplicate brief instructions into one outline obligation.",
        strategicChange: false
      }
    ],
    outlineOriginalityCheck: {
      noCopiedCompetitorHeadings: true,
      noCopiedCompetitorStructure: true,
      noCopiedTableLogic: true
    },
    outlineScanabilityCheck: {
      importantAnswerEarly: true,
      noOverloadedH2s: true,
      noBuriedSafetyOrDecisionInfo: true,
      headingsScannable: true
    },
    headingHierarchyCheck: {
      singleH1: true,
      h2sNonOverlapping: true,
      h3sUsefulOnly: true,
      headingsScannable: true
    },
    batchOutlineIsolationCheck: {
      pageSpecificOutline: true,
      reusedPriorOutline: false,
      currentBatchUnique: true,
      similarityToCurrentBatch: "low"
    },
    outlineDeliveryProofRequirements: {
      step10Required: true,
      finalQaRequired: true
    },
    mustCarryForward: ["pageOutlineHash", "section IDs", "asset placement", "FAQ plan"],
    step9OutputMustNotContain: ["final page copy", "metadata", "image prompts", "exact asset rows"],
    step9CompletenessChecklist: {
      allUpstreamHashesPresent: true,
      contentBriefDeliveryProofComplete: true,
      mainIntentVisibleEarly: true,
      allH2sMappedToStep8: true,
      noStep9BoundaryViolation: true
    },
    markdownParityChecked: true,
    pageOutlineVerdict: {
      status: "pass",
      action: "continue_to_step10"
    },
    judgmentChecks: {
      passed: true
    }
  });

  assert.equal(result.status, "passed");
  assert.equal(result.machineChecksPassed, true);
});

test("page outline gate fails missing hashes, hidden intent, duplicate outline, and boundary issues", () => {
  const result = validatePageOutlineGate({
    upstreamHashes: {
      contentBriefHash: "brief"
    },
    pageOutlineHash: "",
    workingH1: "",
    pageFlowType: "problem_to_solution",
    pageFlowReason: "Thin reason.",
    pageFlowStep8Refs: [],
    readerJourneySummaryStatement: "",
    sectionSequenceRationale: "",
    mainIntentVisibilityCheck: {
      visibleInFirstTwoH2s: false
    },
    outlineSections: [
      {
        sectionId: "section-01",
        headingText: "Background",
        sectionRole: "context",
        mappedStep8Refs: [],
        purpose: "Too generic.",
        depthLevel: "high",
        contentObligations: []
      }
    ],
    queryCoveragePlan: {
      targetKeywordMapped: false,
      supportingQueriesMapped: false,
      doNotForceTerms: []
    },
    faqPlan: {
      decision: "none"
    },
    contentBriefDeliveryProof: {
      allMandatoryInstructionsCovered: false,
      missingMandatoryInstructions: ["I1"],
      returnedToStep8: false
    },
    step8RefinementPatch: [
      {
        refinementType: "change_unique_angle",
        reason: "Strategic rewrite.",
        strategicChange: true
      }
    ],
    outlineOriginalityCheck: {
      noCopiedCompetitorHeadings: false,
      noCopiedCompetitorStructure: false,
      noCopiedTableLogic: false
    },
    outlineScanabilityCheck: {
      importantAnswerEarly: false,
      noOverloadedH2s: true,
      noBuriedSafetyOrDecisionInfo: false,
      headingsScannable: true
    },
    headingHierarchyCheck: {
      singleH1: false,
      h2sNonOverlapping: false,
      h3sUsefulOnly: false,
      headingsScannable: false
    },
    batchOutlineIsolationCheck: {
      pageSpecificOutline: false,
      reusedPriorOutline: true,
      currentBatchUnique: false,
      similarityToCurrentBatch: "high"
    },
    outlineDeliveryProofRequirements: {
      step10Required: false,
      finalQaRequired: false
    },
    step9CompletenessChecklist: {
      mainIntentVisibleEarly: false
    },
    markdownParityChecked: false,
    pageOutlineVerdict: {
      status: "fail",
      action: "repair_step9"
    },
    judgmentChecks: {
      passed: true
    }
  });

  assert.equal(result.status, "failed");
  assert.ok(result.blockingIssues.some((issue) => issue.includes("Page outline requires all upstream hashes")));
  assert.ok(result.blockingIssues.includes("Page outline must address the main search intent within the first 1-2 H2 sections."));
  assert.ok(result.blockingIssues.includes("Page outline must pass batchOutlineIsolationCheck."));
  assert.ok(result.blockingIssues.includes("Page outline Markdown parity must be checked."));
});

const completeDraftSections = Array.from({ length: 8 }, (_, index) => ({
  sectionId: `section-${String(index + 1).padStart(2, "0")}`,
  heading: index === 0 ? "Quick answer: when this routine helps or hurts" : `Drafted section ${index + 1}`,
  draftCopy: "This is page-specific drafted prose that answers the mapped section obligation with concrete evidence, practical guidance, and no placeholder instructions.",
  outlineRefs: [`outline-section-${index + 1}`],
  evidenceRefs: index < 4 ? [`source-${index + 1}`] : [],
  evidenceRequirementLevel: index < 4 ? "evidence_required" as const : "brief_or_outline_only" as const,
  noNewFactualClaims: true,
  newFactualClaimsRouted: false,
  depthProof: {
    depthLevel: index < 3 ? "high" as const : "medium" as const,
    complete: true,
    includesDefinitionOrExplanation: true,
    includesWhyItMatters: true,
    includesHowToOrDecisionRule: true,
    includesExampleOrScenario: true,
    includesCautionMistakeOrCaveat: true,
    includesTransition: true
  },
  examplesUsed: [
    {
      example: "A page-specific illustrative scenario grounded in the outline.",
      illustrativeOnly: index >= 4,
      derivedFromEvidence: index < 4,
      sourceRefs: index < 4 ? [`source-${index + 1}`] : []
    }
  ],
  contentObligationsFulfilled: ["answer", "evidence", "scope boundary"],
  requiredAssetDelivered: index === 3,
  claimSafetyNotes: "Risky claims are softened or evidence-backed.",
  ctaOrInternalLinkDelivered: index === 7,
  openIssues: [],
  genericProseDetected: false,
  placeholderDetected: false
}));

test("first draft gate passes a complete Step 10 structured draft", () => {
  const result = validateFirstDraftGate({
    upstreamHashes: {
      step0AHash: "0a",
      step0BHash: "0b",
      pageJobHash: "job",
      searchIntentHash: "intent",
      pageFormatHash: "format",
      nextActionHash: "next",
      serpCompetitorHash: "serp",
      topicResearchHash: "research",
      uniqueAngleHash: "angle",
      contentBriefHash: "brief",
      pageOutlineHash: "outline"
    },
    firstDraftHash: "draft",
    draftSummaryStatement: "The draft answers the main concern early, follows the outline, includes the required matrix and FAQ, and leaves SEO polishing for Step 11.",
    h1: "How to Build a Safe, Evidence-Backed Routine",
    wordCountContract: {
      minimumWordCount: 1800,
      actualWordCount: 2100,
      targetWordCountRange: { min: 1800, max: 2400 },
      noPaddingOrRepetition: true
    },
    draftSections: completeDraftSections,
    introductionQualityGate: {
      startsWithReaderProblem: true,
      confirmsIntent: true,
      statesPagePromise: true,
      setsScope: true,
      avoidsGenericFiller: true,
      leadsIntoPage: true
    },
    sectionExpansionGate: {
      highDepthCoreSectionsPassed: true,
      weakSectionIds: []
    },
    draftCompletenessProof: {
      pageJobSatisfied: true,
      searchIntentSatisfied: true,
      contentBriefSatisfied: true,
      pageOutlineSatisfied: true,
      satisfactionConditionMet: true,
      wrongPageRisksAvoided: true,
      exclusionsRespected: true
    },
    requiredAssetDelivery: {
      allRequiredAssetsDelivered: true,
      placeholderOnlyAssets: []
    },
    draftClaimSafetyCheck: {
      riskyClaimsHandled: true,
      audienceLanguageNotUsedAsFactualProof: true,
      sensitiveBoundariesRespected: true,
      newFactualClaimsRoutedToStep6: true,
      unsupportedRiskyClaims: []
    },
    naturalQueryCoverageCheck: {
      targetKeywordMeaningCovered: true,
      supportingQueryNeedsCovered: true,
      noKeywordStuffing: true,
      noDensityTargets: true,
      scopeBoundariesRespected: true
    },
    draftReadabilityScanabilityGate: {
      shortParagraphs: true,
      noWallsOfText: true,
      usefulListsOrTables: true,
      clearTransitions: true,
      visibleWarningsDecisionsNextActions: true,
      noBuriedPrimaryAnswer: true,
      sectionFlowMatchesStep9: true
    },
    faqDraftDelivery: {
      requiredByStep9: true,
      draftedWhenPlanned: true,
      placeholderOnly: false
    },
    ctaInternalLinkDelivery: {
      draftedWherePlanned: true,
      nonFinalWordingMarked: true,
      placeholdersOnly: false,
      followsBoundaries: true
    },
    voiceAndBrandFitCheck: {
      followsVoiceAndQualityContract: true,
      avoidsGenericAiProse: true,
      readerFirst: true,
      naturalBrandConnection: true,
      respectsBrandFitBoundaries: true
    },
    draftUniquenessCheck: {
      currentBatchUnique: true,
      historicalCheckedOrWarning: true,
      repeatedIntro: false,
      repeatedSectionBodyPattern: false,
      repeatedExamples: false,
      repeatedAssetsOrFaqOrCta: false
    },
    antiGenericDraftGate: {
      passed: true,
      bannedPhrasesFound: [],
      placeholdersFound: []
    },
    firstDraftDeliveryProofRequirements: {
      step11Required: true,
      finalQaRequired: true
    },
    mustCarryForward: ["firstDraftHash", "section IDs", "required assets", "claims needing citation"],
    step10OutputMustNotContain: ["final metadata", "new research", "image prompts", "placeholders"],
    step10CompletenessChecklist: {
      upstreamHashesPresent: true,
      outlineFollowed: true,
      allSectionsDrafted: true,
      introGatePassed: true,
      highDepthExpansionPassed: true,
      assetsDelivered: true,
      faqDrafted: true,
      claimSafetyChecked: true,
      wordCountFloorMet: true,
      antiGenericGatePassed: true,
      markdownParityPassed: true
    },
    markdownParityChecked: true,
    firstDraftVerdict: {
      status: "pass",
      action: "continue_to_step11",
      confidence: "high"
    },
    repairAttemptsUsed: 1,
    judgmentChecks: {
      passed: true
    }
  });

  assert.equal(result.status, "passed");
  assert.equal(result.machineChecksPassed, true);
});

test("first draft gate fails generic prose, weak intro, unsupported claims, and missing asset delivery", () => {
  const result = validateFirstDraftGate({
    upstreamHashes: {
      pageOutlineHash: "outline"
    },
    firstDraftHash: "",
    draftSummaryStatement: "",
    h1: "",
    wordCountContract: {
      minimumWordCount: 1800,
      actualWordCount: 1200,
      noPaddingOrRepetition: false
    },
    draftSections: [
      {
        sectionId: "section-01",
        heading: "Background",
        draftCopy: "This section should explain why the topic is important.",
        outlineRefs: [],
        evidenceRequirementLevel: "evidence_required",
        noNewFactualClaims: false,
        newFactualClaimsRouted: false,
        depthProof: {
          depthLevel: "high",
          complete: false
        },
        examplesUsed: [
          {
            example: "Generic example"
          }
        ],
        contentObligationsFulfilled: [],
        genericProseDetected: true,
        placeholderDetected: true
      }
    ],
    introductionQualityGate: {
      startsWithReaderProblem: false
    },
    sectionExpansionGate: {
      highDepthCoreSectionsPassed: false,
      weakSectionIds: ["section-01"]
    },
    draftCompletenessProof: {
      pageJobSatisfied: false
    },
    requiredAssetDelivery: {
      allRequiredAssetsDelivered: false,
      placeholderOnlyAssets: ["matrix"]
    },
    draftClaimSafetyCheck: {
      riskyClaimsHandled: false,
      audienceLanguageNotUsedAsFactualProof: false,
      sensitiveBoundariesRespected: false,
      newFactualClaimsRoutedToStep6: false,
      unsupportedRiskyClaims: ["cures acne"]
    },
    naturalQueryCoverageCheck: {
      targetKeywordMeaningCovered: false
    },
    draftReadabilityScanabilityGate: {
      shortParagraphs: false
    },
    faqDraftDelivery: {
      requiredByStep9: true,
      draftedWhenPlanned: false,
      placeholderOnly: true
    },
    ctaInternalLinkDelivery: {
      draftedWherePlanned: false,
      placeholdersOnly: true,
      followsBoundaries: false
    },
    voiceAndBrandFitCheck: {
      followsVoiceAndQualityContract: false
    },
    draftUniquenessCheck: {
      currentBatchUnique: false,
      historicalCheckedOrWarning: false,
      repeatedIntro: true,
      repeatedSectionBodyPattern: true,
      repeatedExamples: true,
      repeatedAssetsOrFaqOrCta: true
    },
    antiGenericDraftGate: {
      passed: false,
      bannedPhrasesFound: ["This section should explain"],
      placeholdersFound: ["Use this section to"]
    },
    firstDraftDeliveryProofRequirements: {
      step11Required: false,
      finalQaRequired: false
    },
    step10CompletenessChecklist: {
      introGatePassed: false
    },
    markdownParityChecked: false,
    firstDraftVerdict: {
      status: "fail",
      action: "repair_step10"
    },
    repairAttemptsUsed: 4,
    judgmentChecks: {
      passed: true
    }
  });

  assert.equal(result.status, "failed");
  assert.ok(result.blockingIssues.some((issue) => issue.includes("First draft requires all upstream hashes")));
  assert.ok(result.blockingIssues.includes("First draft introductionQualityGate must pass."));
  assert.ok(result.blockingIssues.includes("First draft must deliver all required assets as usable text/table/checklist/flow content."));
  assert.ok(result.blockingIssues.includes("First draft must pass antiGenericDraftGate."));
  assert.ok(result.blockingIssues.includes("Step 10 repairs are limited to 3 attempts."));
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
