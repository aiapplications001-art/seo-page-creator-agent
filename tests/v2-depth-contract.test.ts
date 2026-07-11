import assert from "node:assert/strict";
import { test } from "node:test";
import { validatePageDepthContract } from "../src/lib/v2/depth.js";

test("page depth contract passes complete research and usefulness artifacts", () => {
  const result = validatePageDepthContract(completeDepthContract());

  assert.equal(result.status, "passed");
  assert.equal(result.score, 88);
  assert.deepEqual(result.blockingIssues, []);
});

test("page depth contract fails missing SERP superiority proof", () => {
  const contract = completeDepthContract();
  delete contract.preDraftQualityBrief.intentDimensions;
  delete contract.preDraftQualityBrief.superiorityComponents;
  delete contract.preDraftQualityBrief.differentiatedImprovements;
  delete contract.preDraftQualityBrief.extractableAnswerBlocks;

  const result = validatePageDepthContract(contract);

  assert.equal(result.status, "failed");
  assert.match(result.blockingIssues.join("\n"), /SERP superiority requires 4-7 intent dimensions/);
  assert.match(result.blockingIssues.join("\n"), /SERP superiority requires at least 1 major superiority component/);
  assert.match(result.blockingIssues.join("\n"), /SERP superiority requires at least 5 differentiated improvements/);
  assert.match(result.blockingIssues.join("\n"), /SERP superiority requires at least 3 extractable answer blocks/);
});

test("page depth contract fails when artifacts use stale generated section IDs", () => {
  const contract = completeDepthContract();

  const result = validatePageDepthContract({
    ...contract,
    expectedSectionIds: ["S1_actual_generated_section"]
  });

  assert.equal(result.status, "failed");
  assert.match(result.blockingIssues.join("\n"), /does not match a generated page section/);
  assert.match(result.blockingIssues.join("\n"), /generated page section must be covered/);
});

test("page depth contract fails missing required depth dimensions", () => {
  const contract = completeDepthContract();
  contract.pageDepthScore.dimensions = {};

  const result = validatePageDepthContract(contract);

  assert.equal(result.status, "failed");
  assert.match(result.blockingIssues.join("\n"), /searchIntentCoverage: depth dimension must be at least 4\/5/);
});

test("page depth contract fails secondary SERP pages without useful gap details", () => {
  const contract = completeDepthContract();
  contract.competitorDepthDelta.secondaryKeywordSerps = [
    {
      keyword: "oily acne routine India",
      topPages: [{}, {}, {}]
    }
  ];

  const result = validatePageDepthContract(contract);

  assert.equal(result.status, "failed");
  assert.match(result.blockingIssues.join("\n"), /Every secondary keyword SERP top page requires URL/);
});

test("page depth contract fails shallow research extraction", () => {
  const contract = completeDepthContract();
  contract.researchExtractionMatrix.extractedFacts = contract.researchExtractionMatrix.extractedFacts.slice(0, 12);

  const result = validatePageDepthContract(contract);

  assert.equal(result.status, "failed");
  assert.match(result.blockingIssues.join("\n"), /Research extraction matrix requires at least 40 extracted facts/);
});

test("page depth contract fails missing competitor specificity improvements", () => {
  const contract = completeDepthContract();
  contract.competitorDepthDelta.specificityImprovements = contract.competitorDepthDelta.specificityImprovements.slice(0, 3);

  const result = validatePageDepthContract(contract);

  assert.equal(result.status, "failed");
  assert.match(result.blockingIssues.join("\n"), /Competitor depth delta requires at least 10 specificity improvements/);
});

test("page depth contract fails missing audience signals", () => {
  const contract = completeDepthContract();
  contract.audiencePainPointLedger.signals = contract.audiencePainPointLedger.signals.slice(0, 8);

  const result = validatePageDepthContract(contract);

  assert.equal(result.status, "failed");
  assert.match(result.blockingIssues.join("\n"), /Audience pain-point ledger requires at least 20 audience signals/);
});

test("page depth contract fails section without evidence budget", () => {
  const contract = completeDepthContract();
  contract.pageDepthScore.sectionEvidenceBudgets[0] = {
    sectionId: "S3_context",
    facts: ["Acne patterns can vary by location."],
    citedClaims: [],
    usefulnessItems: []
  };

  const result = validatePageDepthContract(contract);

  assert.equal(result.status, "failed");
  assert.match(
    result.blockingIssues.join("\n"),
    /S3_context: section evidence budget requires 2 facts, 1 cited claim, and 1 concrete usefulness item/
  );
});

test("page depth contract fails low score", () => {
  const contract = completeDepthContract();
  contract.pageDepthScore.overallScore = 78;

  const result = validatePageDepthContract(contract);

  assert.equal(result.status, "failed");
  assert.match(result.blockingIssues.join("\n"), /Depth score must be at least 85/);
});

test("page depth contract fails missing pre-draft quality brief", () => {
  const contract = completeDepthContract();
  delete contract.preDraftQualityBrief;

  const result = validatePageDepthContract(contract);

  assert.equal(result.status, "failed");
  assert.match(result.blockingIssues.join("\n"), /Pre-draft quality brief is required before final copy/);
});

test("page depth contract fails missing research-derived structure plan", () => {
  const contract = completeDepthContract();
  delete contract.preDraftQualityBrief.researchDerivedStructurePlan;

  const result = validatePageDepthContract(contract);

  assert.equal(result.status, "failed");
  assert.match(result.blockingIssues.join("\n"), /research-derived structure plan is required before final copy/);
});

test("page depth contract fails when primary concern is buried below the scan-priority window", () => {
  const contract = completeDepthContract();
  contract.preDraftQualityBrief.researchDerivedStructurePlan.primaryConcernVisibleBySectionIndex = 4;

  const result = validatePageDepthContract(contract);

  assert.equal(result.status, "failed");
  assert.match(result.blockingIssues.join("\n"), /primary user concern must be visible within the first 3 visible sections/);
});

test("page depth contract fails when primary concern section is not actually in the first 3 generated sections", () => {
  const contract = completeDepthContract();

  const result = validatePageDepthContract({
    ...contract,
    expectedSectionIds: ["S1_hero", "S2_quick_answer", "S5_background", "S3_context", "S4_decision"]
  });

  assert.equal(result.status, "failed");
  assert.match(result.blockingIssues.join("\n"), /primary user concern section must match the first 3 generated sections/);
});

test("page depth contract fails stale research-derived structure section IDs", () => {
  const contract = completeDepthContract();
  contract.preDraftQualityBrief.researchDerivedStructurePlan.highImpactComponents[0].mappedSectionId = "S9_old_template";

  const result = validatePageDepthContract({
    ...contract,
    expectedSectionIds: ["S3_context", "S4_decision"]
  });

  assert.equal(result.status, "failed");
  assert.match(result.blockingIssues.join("\n"), /Research-derived structure component mapped section: S9_old_template does not match a generated page section/);
});

test("page depth contract fails generic research-derived structure rationale", () => {
  const contract = completeDepthContract();
  contract.preDraftQualityBrief.researchDerivedStructurePlan.sections[0].whyThisSectionExists = "This helps users understand and improves SEO.";

  const result = validatePageDepthContract(contract);

  assert.equal(result.status, "failed");
  assert.match(result.blockingIssues.join("\n"), /Research-derived structure rationales must be specific/);
});

test("page depth contract fails research-derived structure refs with wrong source roles", () => {
  const contract = completeDepthContract();
  contract.preDraftQualityBrief.researchDerivedStructurePlan.sections[0].trustCitationRefs = ["A1"];
  contract.preDraftQualityBrief.researchDerivedStructurePlan.highImpactComponents[0].competitorGapRefs = ["F1"];

  const result = validatePageDepthContract(contract);

  assert.equal(result.status, "failed");
  assert.match(result.blockingIssues.join("\n"), /trustCitationRefs must use trust\/citation evidence/);
  assert.match(result.blockingIssues.join("\n"), /competitorGapRefs must use primary or secondary SERP competitor evidence/);
});

test("page depth contract fails when required research-derived typed refs are omitted", () => {
  const contract = completeDepthContract();
  contract.preDraftQualityBrief.researchDerivedStructurePlan.sections[1].audienceLanguageRefs = [];
  contract.preDraftQualityBrief.researchDerivedStructurePlan.sections[1].competitorGapRefs = [];
  contract.preDraftQualityBrief.researchDerivedStructurePlan.sections[1].trustCitationRefs = [];

  const result = validatePageDepthContract(contract);

  assert.equal(result.status, "failed");
  assert.match(result.blockingIssues.join("\n"), /requires audienceLanguageRefs from audience-language evidence/);
  assert.match(result.blockingIssues.join("\n"), /requires competitorGapRefs from SERP competitor evidence/);
  assert.match(result.blockingIssues.join("\n"), /requires trustCitationRefs from trust\/citation evidence/);
});

test("page depth contract fails weak high-impact structure components", () => {
  const contract = completeDepthContract();
  contract.preDraftQualityBrief.researchDerivedStructurePlan.highImpactComponents[0].sourceRefs = ["F1", "A1"];
  contract.preDraftQualityBrief.researchDerivedStructurePlan.highImpactComponents[0].columnsOrSteps = ["Feature", "Benefit", "Notes"];

  const result = validatePageDepthContract(contract);

  assert.equal(result.status, "failed");
  assert.match(result.blockingIssues.join("\n"), /high-impact structure components require at least 3 known sourceRefs/);
  assert.match(result.blockingIssues.join("\n"), /generic table or matrix columns are not allowed/);
});

test("page depth contract fails thin pre-draft quality brief", () => {
  const contract = completeDepthContract();
  contract.preDraftQualityBrief = {
    schemaVersion: "pre-draft-quality-brief.v2",
    status: "complete",
    searchIntent: "Write an AM PM skincare routine.",
    subIntents: ["routine"],
    diagnosticPlan: [],
    indiaSpecificity: ["India"],
    safetyTrustPlan: ["reviewed"],
    standoutElement: { type: "", title: "", whyCompetitorsMissIt: "" },
    brandConnection: "",
    aiOverviewTargets: [],
    internalLinkPlan: []
  };

  const result = validatePageDepthContract(contract);

  assert.equal(result.status, "failed");
  assert.match(result.blockingIssues.join("\n"), /Pre-draft quality brief requires at least 6 sub-intents/);
  assert.match(result.blockingIssues.join("\n"), /diagnostic depth items/);
  assert.match(result.blockingIssues.join("\n"), /India-specific angles/);
  assert.match(result.blockingIssues.join("\n"), /safety and trust requirements/);
  assert.match(result.blockingIssues.join("\n"), /standout element/);
  assert.match(result.blockingIssues.join("\n"), /brand connection/);
});

test("page depth contract fails missing publish-worthiness proof", () => {
  const contract = completeDepthContract();
  contract.preDraftQualityBrief.readerQuestionCoverage = [];
  contract.preDraftQualityBrief.recommendationSanityPlan = [];
  contract.preDraftQualityBrief.claimRiskPlan = [];
  contract.preDraftQualityBrief.troubleshootingPlan = [];
  contract.preDraftQualityBrief.brandCtaFit = {
    readerProblem: "",
    supportedCtaPromise: "",
    unsupportedClaimsToAvoid: []
  };

  const result = validatePageDepthContract(contract);

  assert.equal(result.status, "failed");
  assert.match(result.blockingIssues.join("\n"), /reader questions/);
  assert.match(result.blockingIssues.join("\n"), /recommendation sanity checks/);
  assert.match(result.blockingIssues.join("\n"), /claim risk plan/);
  assert.match(result.blockingIssues.join("\n"), /troubleshooting plan/);
  assert.match(result.blockingIssues.join("\n"), /brand CTA fit/);
});

test("page depth contract fails publish-worthiness items without evidence links", () => {
  const contract = completeDepthContract();
  contract.preDraftQualityBrief.readerQuestionCoverage = [
    {
      item: "Can cleansing oil cause closed comedones on oily acne-prone skin?",
      sourceRefs: [],
      mappedSectionId: "",
      whyThisMatters: "",
      finalCopyUse: ""
    },
    ...contract.preDraftQualityBrief.readerQuestionCoverage.slice(1)
  ];

  const result = validatePageDepthContract(contract);

  assert.equal(result.status, "failed");
  assert.match(result.blockingIssues.join("\n"), /reader question coverage items require item, sourceRefs, mappedSectionId, whyThisMatters, and finalCopyUse/);
});

test("page depth contract fails publish-worthiness items with unknown source refs", () => {
  const contract = completeDepthContract();
  contract.preDraftQualityBrief.claimRiskPlan = [
    {
      item: "Rewrite clinically proven unless the exact claim has source support.",
      sourceRefs: ["UNKNOWN_SOURCE"],
      mappedSectionId: "S4_decision",
      whyThisMatters: "Unsupported efficacy language can overstate what the page can prove.",
      finalCopyUse: "Use cautious claim language in the active comparison section."
    },
    ...contract.preDraftQualityBrief.claimRiskPlan.slice(1)
  ];

  const result = validatePageDepthContract(contract);

  assert.equal(result.status, "failed");
  assert.match(result.blockingIssues.join("\n"), /sourceRefs must reference extracted fact ids, audience signal ids, or analyzed source URLs/);
});

test("page depth contract fails generic publish-worthiness filler", () => {
  const contract = completeDepthContract();
  contract.preDraftQualityBrief.readerQuestionCoverage = [
    evidenceLinkedItem("What is this?", "S3_context", ["F1", "A1"]),
    evidenceLinkedItem("How does it work?", "S3_context", ["F2", "A2"]),
    evidenceLinkedItem("Is it good?", "S3_context", ["F3", "A3"]),
    evidenceLinkedItem("What is best?", "S3_context", ["F4", "A4"]),
    evidenceLinkedItem("Is it safe?", "S4_decision", ["F5", "A5"]),
    evidenceLinkedItem("How long?", "S4_decision", ["F6", "A6"]),
    evidenceLinkedItem("What next?", "S4_decision", ["F7", "A7"]),
    evidenceLinkedItem("Should I use it?", "S4_decision", ["F8", "A8"])
  ];
  contract.preDraftQualityBrief.recommendationSanityPlan = [
    evidenceLinkedItem("Recommend good products.", "S3_context", ["F9", "A9"]),
    evidenceLinkedItem("Check if it is useful.", "S4_decision", ["F10", "A10"]),
    evidenceLinkedItem("Make sure it is safe.", "S4_decision", ["F11", "A11"])
  ];
  contract.preDraftQualityBrief.claimRiskPlan = [
    evidenceLinkedItem("Cite claims.", "S3_context", ["F12", "A12"]),
    evidenceLinkedItem("Be careful.", "S3_context", ["F13", "A13"]),
    evidenceLinkedItem("Avoid risky claims.", "S4_decision", ["F14", "A14"]),
    evidenceLinkedItem("Use sources.", "S4_decision", ["F15", "A15"]),
    evidenceLinkedItem("Do not overclaim.", "S4_decision", ["F16", "A16"])
  ];
  contract.preDraftQualityBrief.troubleshootingPlan = [
    evidenceLinkedItem("Help if it gets worse.", "S3_context", ["F17", "A17"]),
    evidenceLinkedItem("Fix side effects.", "S3_context", ["F18", "A18"]),
    evidenceLinkedItem("Tell users what to do.", "S4_decision", ["F19", "A19"]),
    evidenceLinkedItem("See a doctor.", "S4_decision", ["F20", "A20"])
  ];

  const result = validatePageDepthContract(contract);

  assert.equal(result.status, "failed");
  assert.match(result.blockingIssues.join("\n"), /reader questions must be specific/);
  assert.match(result.blockingIssues.join("\n"), /recommendation sanity checks must name/);
  assert.match(result.blockingIssues.join("\n"), /claim risk items must name/);
  assert.match(result.blockingIssues.join("\n"), /troubleshooting items must include/);
});

function evidenceLinkedItem(item: string, mappedSectionId: string, sourceRefs: string[]): Record<string, unknown> {
  return {
    item,
    sourceRefs,
    mappedSectionId,
    whyThisMatters: `${item} matters because it changes the reader decision.`,
    finalCopyUse: `Use this in ${mappedSectionId} to make the final copy more specific.`
  };
}

function completeDepthContract(): Record<string, any> {
  return {
    researchExtractionMatrix: {
      schemaVersion: "research-extraction-matrix.v2",
      extractedFacts: Array.from({ length: 40 }, (_, index) => ({
        id: `F${index + 1}`,
        claim: `Specific extracted fact ${index + 1}`,
        sourceUrl: `https://example.com/source-${Math.floor(index / 4) + 1}`,
        sourceRole: sourceRoleForFact(index),
        sectionRelevance: index % 2 === 0 ? "S3_context" : "S4_decision",
        evidenceType: "clinical_guidance",
        confidence: "medium",
        freshness: "current",
        contradictionNotes: ""
      }))
    },
    competitorDepthDelta: {
      schemaVersion: "competitor-depth-delta.v2",
      primaryKeyword: "texture smoothing skincare routine India",
      primarySerpTop5: Array.from({ length: 5 }, (_, index) => ({
        url: `https://competitor.example/page-${index + 1}`,
        rankingPosition: index + 1,
        strengthLabel: index < 2 ? "strong" : "moderate",
        scores: fullCompetitorScores(index < 2 ? 4 : 3),
        evidenceNotes: [
          "Strong intent match with routine guidance.",
          "Useful structure but incomplete India-specific troubleshooting.",
          "Reader can act, though safety boundaries are thinner than needed."
        ],
        standoutAssets: index < 2 ? ["routine comparison table"] : [],
        whyUsersMightStopSearching: index < 2 ? "It gives a clear enough routine for many readers." : undefined
      })),
      secondaryKeywordSerps: [
        {
          keyword: "closed comedones skincare routine India",
          topPages: Array.from({ length: 3 }, (_, index) => ({
            url: `https://secondary.example/page-${index + 1}`,
            rankingPosition: index + 1,
            intentContribution: "Adds clogged-pore sub-intent for the primary page.",
            usefulGap: "Does not connect closed comedones to stop/switch routine rules."
          }))
        }
      ],
      competitors: Array.from({ length: 5 }, (_, index) => ({
        url: `https://competitor.example/page-${index + 1}`,
        coverageGaps: [`Gap ${index + 1}`],
        overdoneOrWeakAreas: [`Weak area ${index + 1}`]
      })),
      specificityImprovements: Array.from({ length: 10 }, (_, index) => ({
        sectionId: index % 2 === 0 ? "S3_context" : "S4_decision",
        improvement: `More specific improvement ${index + 1}`,
        competitorGapAddressed: `Gap ${index + 1}`
      }))
    },
    audiencePainPointLedger: {
      schemaVersion: "audience-pain-point-ledger.v2",
      signals: Array.from({ length: 20 }, (_, index) => ({
        id: `A${index + 1}`,
        sourceType: index % 2 === 0 ? "video" : "forum",
        audienceLanguage: `Real user concern ${index + 1}`,
        concernType: "objection",
        mappedSectionId: index % 2 === 0 ? "S3_context" : "S4_decision"
      }))
    },
    preDraftSynthesisBrief: {
      schemaVersion: "pre-draft-synthesis-brief.v2",
      wordCount: 650,
      searchIntent: "Readers want to choose acne treatment without worsening irritation.",
      audienceAnxieties: ["Choosing the wrong ingredient", "Making marks worse"],
      competitorGaps: ["Competitors skip decision rules for recurring acne."],
      recommendedAngle: "Diagnosis-first acne treatment decisions.",
      sectionPromises: [
        { sectionId: "S3_context", promise: "Explain why acne pattern changes the right treatment." },
        { sectionId: "S4_decision", promise: "Give a decision rule for next step selection." }
      ],
      evidenceInventory: ["F1", "F2", "F3"]
    },
    preDraftQualityBrief: {
      schemaVersion: "pre-draft-quality-brief.v2",
      status: "complete",
      searchIntent: "Readers want to identify face texture type, choose a safe India-specific routine, and know when skincare is not enough.",
      subIntents: [
        "causes of uneven texture",
        "identify texture type",
        "AM PM routine",
        "ingredient comparison",
        "safety and actives",
        "timeline expectations"
      ],
      diagnosticPlan: [
        "Texture type identification table",
        "Cause to first-step mapping",
        "Not-right-for-you guidance",
        "When to see a dermatologist"
      ],
      indiaSpecificity: [
        "humid climate routine",
        "pollution and sunscreen buildup",
        "melanin-rich PIH caution",
        "SPF 50 PA++++ availability"
      ],
      safetyTrustPlan: [
        "dermatologist reviewer credentials",
        "active ingredient stop rules",
        "pregnancy and irritation caution",
        "source-backed references"
      ],
      standoutElement: {
        type: "diagnostic_matrix",
        title: "Texture type to first-step matrix",
        whyCompetitorsMissIt: "Competing pages give routine steps but do not help readers identify whether bumps are clogged pores, scars, PIH, or barrier damage."
      },
      brandConnection: "MyMirror helps readers track whether texture, redness, and dark marks change over time instead of guessing in the mirror.",
      readerQuestionCoverage: [
        evidenceLinkedItem("What type of texture do I have?", "S3_context", ["F1", "A1"]),
        evidenceLinkedItem("Can closed comedones look like acne?", "S3_context", ["F2", "A2"]),
        evidenceLinkedItem("Which active should I start with?", "S4_decision", ["F3", "A3"]),
        evidenceLinkedItem("How often should I exfoliate?", "S4_decision", ["F4", "A4"]),
        evidenceLinkedItem("What if my skin burns after using an active?", "S4_decision", ["F5", "A5"]),
        evidenceLinkedItem("When should I see a dermatologist for painful acne?", "S4_decision", ["F6", "A6"]),
        evidenceLinkedItem("Can sunscreen worsen texture in humid Indian weather?", "S3_context", ["F7", "A7"]),
        evidenceLinkedItem("How long before I see results from a texture routine?", "S4_decision", ["F8", "A8"])
      ],
      recommendationSanityPlan: [
        evidenceLinkedItem("Every product or active recommendation must name the role it plays in the routine.", "S4_decision", ["F9", "A9"]),
        evidenceLinkedItem("Every recommendation needs an avoid-if condition for sensitive, irritated, or acne-medicated skin.", "S4_decision", ["F10", "A10"]),
        evidenceLinkedItem("Face-use suitability and evidence requirement must be checked before inclusion.", "S4_decision", ["F11", "A11"])
      ],
      claimRiskPlan: [
        evidenceLinkedItem("Rewrite clinically proven unless the exact claim has source support.", "S4_decision", ["F12", "A12"]),
        evidenceLinkedItem("Rewrite dermatologist-approved unless the reviewer approval is specific to the page.", "S4_decision", ["F13", "A13"]),
        evidenceLinkedItem("Avoid safest 10/10 style scoring claims unless methodology and evidence source are included.", "S4_decision", ["F14", "A14"]),
        evidenceLinkedItem("Cite non-comedogenic and active ingredient claims with product label or source evidence.", "S4_decision", ["F15", "A15"]),
        evidenceLinkedItem("Keep AI scan claims limited to supported tracking language.", "S4_decision", ["F16", "A16"])
      ],
      troubleshootingPlan: [
        evidenceLinkedItem("If new bumps appear, stop the new active and switch to a basic cleanser while monitoring.", "S4_decision", ["F17", "A17"]),
        evidenceLinkedItem("If skin feels tight, reduce cleansing frequency and repair the barrier before adding actives.", "S4_decision", ["F18", "A18"]),
        evidenceLinkedItem("If redness increases, pause exfoliating products and seek guidance if irritation persists.", "S4_decision", ["F19", "A19"]),
        evidenceLinkedItem("When acne becomes painful or cystic, stop experimenting and seek medical advice.", "S4_decision", ["F20", "A20"])
      ],
      brandCtaFit: {
        readerProblem: "The reader needs a way to track whether texture, redness, and dark marks are improving after routine changes.",
        supportedCtaPromise: "MyMirror can help compare visible acne, redness, and texture changes over time.",
        unsupportedClaimsToAvoid: ["Detecting sunscreen residue", "Diagnosing acne subtype without clinician review"]
      },
      researchDerivedStructurePlan: researchDerivedStructurePlan(),
      intentDimensions: [
        intentDimension("D1", "diagnosis", 1, ["https://competitor.example/page-1", "F1", "A1"]),
        intentDimension("D2", "India product fit", 2, ["https://competitor.example/page-2", "https://secondary.example/page-1", "F2"]),
        intentDimension("D3", "troubleshooting", 3, ["https://competitor.example/page-3", "A2", "F3"]),
        intentDimension("D4", "safe recommendation boundaries", 4, ["https://competitor.example/page-4", "F4", "A3"]),
        intentDimension("D5", "timeline expectations", 5, ["https://competitor.example/page-5", "F5", "A4"])
      ],
      superiorityComponents: [
        {
          id: "texture-stop-switch-matrix",
          componentType: "symptom_to_action_matrix",
          title: "Texture stop/switch matrix for Indian acne-prone skin",
          researchBasis: "Primary competitors explain routine steps but do not map irritation, closed comedones, humidity residue, and painful acne to concrete next actions.",
          sourceRefs: ["https://competitor.example/page-1", "https://secondary.example/page-1", "A1", "F1"],
          mappedSectionId: "S4_decision",
          intentDimensionSupported: "D3",
          competitorGapAddressed: "Top pages lack stop/switch troubleshooting for oily acne-prone readers.",
          whyThisIsInformationGain: "It changes the reader action instead of only listing ingredients.",
          competitorComponentComparison: {
            comparisonPath: "beat_existing_component",
            competitorsReviewed: ["https://competitor.example/page-1"],
            whyOursIsBetterOrNeeded: "The competitor table lists products; our matrix maps symptoms to actions and escalation."
          },
          finalCopyBlock: "Markdown matrix with symptoms, likely issue, action, and when to seek help.",
          imageOrInteractiveNeed: "Can be rendered as a table or visual flow.",
          fallbackContent: "Static markdown table with stop/switch/monitor/escalate columns.",
          primaryReaderJob: "Decide whether to continue, stop, or adjust the routine when texture worsens.",
          brandFit: "MyMirror can support tracking visible changes over time without diagnosing acne.",
          naturalCtaConnection: "soft",
          unsupportedBrandClaimsToAvoid: ["diagnosing acne", "detecting cleanser residue"]
        }
      ],
      differentiatedImprovements: Array.from({ length: 5 }, (_, index) => ({
        improvement: `Differentiated improvement ${index + 1} adds a visible reader-useful decision detail.`,
        sourceRefs: [
          `https://competitor.example/page-${index + 1}`,
          index === 0 ? "https://secondary.example/page-1" : `F${index + 1}`,
          `A${index + 1}`
        ],
        intentDimension: `D${Math.min(index + 1, 4)}`,
        competitorOrUserGapAddressed: `Competitor or user gap ${index + 1}`,
        mappedSectionId: index < 3 ? "S3_context" : "S4_decision",
        visibleOutputType: index === 0 ? "table" : "copy",
        finalOutputLocation: index < 3 ? "S3_context paragraph/table" : "S4_decision checklist",
        finalCopyEvidence: `Visible final copy evidence ${index + 1}`,
        whyDifferentiated: `This goes beyond restating the SERP by adding specific action ${index + 1}.`
      })),
      extractableAnswerBlocks: [
        extractableAnswer("quick_answer", "S3_context", ["https://competitor.example/page-1", "F6", "A6"]),
        extractableAnswer("decision_action", "S4_decision", ["https://secondary.example/page-2", "F7", "A7"]),
        extractableAnswer("troubleshooting_safety", "S4_decision", ["F8", "A8", "https://competitor.example/page-2"])
      ],
      aiOverviewTargets: [
        "60-90 word direct answer",
        "ingredient comparison table",
        "FAQ answers for People Also Ask"
      ],
      internalLinkPlan: [
        "closed comedones guide",
        "salicylic acid guide",
        "niacinamide guide",
        "sunscreen for acne-prone Indian skin",
        "skin barrier repair guide"
      ]
    },
    pageDepthScore: {
      schemaVersion: "page-depth-score.v2",
      overallScore: 88,
      dimensions: {
        searchIntentCoverage: 5,
        serpGapCoverage: 4,
        socialPainPointCoverage: 4,
        topicalEntityCompleteness: 5,
        brandProductSpecificity: 4,
        evidenceCitationQuality: 5,
        originalInsightUsefulness: 4,
        structureReadability: 5,
        conversionUsefulness: 4,
        technicalSeoCompleteness: 4
      },
      informationGainItems: Array.from({ length: 8 }, (_, index) => `Information gain item ${index + 1}`),
      sectionEvidenceBudgets: [
        {
          sectionId: "S3_context",
          facts: ["Fact 1", "Fact 2"],
          citedClaims: ["Claim 1"],
          usefulnessItems: ["Decision rule 1"]
        },
        {
          sectionId: "S4_decision",
          facts: ["Fact 3", "Fact 4"],
          citedClaims: ["Claim 2"],
          usefulnessItems: ["Mistake table"]
        }
      ]
    }
  };
}

function researchDerivedStructurePlan(): Record<string, unknown> {
  return {
    primaryUserConcern: "How can texture treatment harm or irritate acne-prone skin?",
    primaryConcernVisibleBySectionId: "S3_context",
    primaryConcernVisibleBySectionIndex: 2,
    importantInformationNotBuried: true,
    scanPriorityRationale: "Audience signals mention burning and worsening bumps, so irritation risk appears before routine detail.",
    sectionOrderRationale: "The structure starts with risk and diagnosis, then moves to decision support and troubleshooting.",
    sections: [
      {
        sectionId: "S3_context",
        sectionRole: "quick answer",
        sectionAction: "reorder",
        targetSectionTitle: "Can texture routines irritate acne-prone skin?",
        whyThisSectionExists: "Readers report burning and worsening bumps, while competitors explain routines before risk boundaries.",
        sourceRefs: ["F1", "F2", "A1", "https://competitor.example/page-1"],
        intentDimensionRefs: ["D1"],
        competitorOrUserGap: "Competitor pages explain routine steps before helping readers identify irritation risk.",
        expectedVisibleOutput: "Near-top answer separating expected adjustment from stop-and-repair signs.",
        competitorGapRefs: ["https://competitor.example/page-1"],
        audienceLanguageRefs: ["A1"],
        trustCitationRefs: ["F1"],
        finalCopyUse: "Open the section with risk boundaries before routine background.",
        finalCopyAcceptanceCheck: "Final copy includes a near-top risk answer with stop/switch actions.",
        scanPriority: "top",
        readerQuestionAnswered: "Can this routine make my skin worse?",
        differentiatesFromPageIds: ["historical-texture-routine"]
      },
      {
        sectionId: "S4_decision",
        sectionRole: "decision support",
        sectionAction: "add",
        targetSectionTitle: "Stop, switch, or continue: texture routine decision matrix",
        whyThisSectionExists: "User concerns and SERP gaps show readers need action rules when irritation or bumps appear.",
        sourceRefs: ["F1", "F3", "A2", "https://competitor.example/page-2"],
        intentDimensionRefs: ["D3"],
        competitorOrUserGap: "Competitors list ingredients without stop/switch rules for acne-prone skin.",
        expectedVisibleOutput: "Decision matrix mapping symptom, likely issue, and next action.",
        competitorGapRefs: ["https://competitor.example/page-2"],
        audienceLanguageRefs: ["A2"],
        trustCitationRefs: ["F1"],
        finalCopyUse: "Add a visible matrix with action boundaries.",
        finalCopyAcceptanceCheck: "Final copy contains a stop/switch/continue table.",
        scanPriority: "top",
        readerQuestionAnswered: "Should I stop or switch products if bumps appear?",
        differentiatesFromPageIds: ["historical-texture-routine"]
      }
    ],
    highImpactComponents: [
      {
        componentType: "decision_matrix",
        mappedSectionId: "S4_decision",
        readerJob: "Decide whether to stop, switch, repair, or continue when irritation appears.",
        whyThisComponentExists: "Audience signals mention burning after actives and competitors lack action boundaries.",
        sourceRefs: ["F1", "F3", "A2", "https://competitor.example/page-2"],
        intentDimensionRefs: ["D3"],
        competitorOrAudienceGapAddressed: "Top competitors list ingredients but do not map worsening symptoms to actions.",
        competitorGapRefs: ["https://competitor.example/page-2"],
        audienceLanguageRefs: ["A2"],
        trustCitationRefs: ["F1"],
        visibleReaderBenefit: "Readers can scan symptom, likely issue, and next step without reading the whole page.",
        notGenericReason: "The component exists because acne-prone readers mention burning and bumps after actives.",
        columnsOrSteps: ["symptom", "likely issue", "stop/switch/continue action", "when to seek help"],
        whyThisShape: "The columns mirror the user's triage decision and safety boundary.",
        expectedVisibleOutput: "Markdown decision matrix with symptom, likely issue, action, and escalation.",
        finalCopyAcceptanceCheck: "Final copy includes the decision matrix with stop/switch/continue actions."
      }
    ],
    structureDecisions: [
      {
        sectionId: "S4_decision",
        sectionAction: "add",
        targetSectionTitle: "Stop, switch, or continue matrix",
        sourceRefs: ["F1", "F3", "A2", "https://competitor.example/page-2"],
        competitorOrUserGap: "Competitors do not turn irritation symptoms into action rules.",
        whyThisStructureIsNeeded: "Readers need an action path when texture worsens after actives.",
        expectedVisibleOutput: "A decision matrix with symptom, action, and escalation columns.",
        finalCopyAcceptanceCheck: "Final copy includes a visible decision matrix."
      }
    ],
    structureComparison: {
      comparedCurrentBatchPageIds: ["P0"],
      comparedHistoricalPageIds: ["historical-texture-routine"],
      reusedStructureRisk: "low",
      materialDifferences: [
        "Risk answer appears before background.",
        "Decision matrix uses stop/switch/continue actions rather than a generic product table."
      ]
    }
  };
}

function sourceRoleForFact(index: number): string {
  if (index === 0) return "trust_citation_source";
  if (index === 1) return "long_tail_source";
  if (index === 2) return "paa_source";
  if (index === 3) return "ai_overview_source";
  return "trust_citation_source";
}

function fullCompetitorScores(baseScore: number): Record<string, { score: number; evidence: string }> {
  const dimensions = [
    "intentMatch",
    "topIntentCoverage",
    "depthAndSpecificity",
    "decisionUsefulness",
    "informationArchitecture",
    "evidenceAndTrust",
    "originalityInformationGain",
    "audienceSpecificity",
    "riskHandling",
    "practicalCompleteness",
    "uxPageExperience"
  ];
  return Object.fromEntries(dimensions.map((dimension) => [
    dimension,
    {
      score: dimension === "intentMatch" || dimension === "topIntentCoverage" ? Math.max(baseScore, 4) : baseScore,
      evidence: `${dimension} evidence note from reviewed competitor page.`
    }
  ]));
}

function intentDimension(id: string, label: string, priority: number, sourceRefs: string[]): Record<string, unknown> {
  return {
    id,
    label,
    priority,
    sourceRefs,
    plannedWin: `${label} will beat competitors with specific, visible decision support.`,
    competitorBenchmark: `${label} is only partially handled in the current SERP.`
  };
}

function extractableAnswer(blockType: string, mappedSectionId: string, sourceRefs: string[]): Record<string, unknown> {
  return {
    blockType,
    answer: `${blockType} answer gives a concise, safer, reader-friendly response with keyword context.`,
    sourceRefs,
    mappedSectionId,
    keywordUse: ["texture smoothing skincare routine India"],
    aiOverviewDelta: "Adds safety boundaries and human troubleshooting that AI Overview oversimplifies."
  };
}
