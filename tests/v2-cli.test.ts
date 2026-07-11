import assert from "node:assert/strict";
import { mkdtemp, readFile, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import path from "node:path";
import { test } from "node:test";
import { runV2Command } from "../src/cli/v2.js";

test("v2 prepare-page creates artifacts and status reports in_progress", async () => {
  const cwd = await mkdtemp(path.join(tmpdir(), "seo-v2-cli-"));

  const prepare = await captureCommand(cwd, () =>
    runV2Command(["prepare-page", "--cluster", "acne-treatment", "--page-id", "P1", "--page-type", "product_category"])
  );

  assert.equal(prepare.exitCode, undefined);
  assert.match(prepare.stdout, /Prepared V2 page workspace:/);
  assert.match(prepare.stdout, /Next: complete the SERP research ledger/);

  const statePath = path.join(cwd, ".seo-agent-workspace", "v2", "page-packets", "acne-treatment", "P1", "page-state.json");
  const state = JSON.parse(await readFile(statePath, "utf8"));
  assert.equal(state.schemaVersion, "page-state.v2");
  assert.equal(state.status, "in_progress");

  const status = await captureCommand(cwd, () =>
    runV2Command(["status", "--cluster", "acne-treatment", "--page-id", "P1"])
  );

  assert.equal(status.exitCode, undefined);
  assert.match(status.stdout, /Status: in_progress/);
  assert.match(status.stdout, /Publish ready: false/);
});

test("v2 validate-gates reports missing seeded gates and exits non-zero", async () => {
  const cwd = await mkdtemp(path.join(tmpdir(), "seo-v2-cli-"));
  await captureCommand(cwd, () =>
    runV2Command(["prepare-page", "--cluster", "acne-treatment", "--page-id", "P1", "--page-type", "product_category"])
  );

  const validation = await captureCommand(cwd, () =>
    runV2Command(["validate-gates", "--cluster", "acne-treatment", "--page-id", "P1"])
  );

  assert.equal(validation.exitCode, 1);
  assert.match(validation.stdout, /SERP Research Ledger: failed/);
  assert.match(validation.stdout, /Social\/Video Research: failed/);
  assert.match(validation.stdout, /Audience Definition: failed/);
  assert.match(validation.stdout, /Narrative Brief: failed/);
  assert.match(validation.stdout, /Citation Set: failed/);
});

test("v2 qa reports missing QA input when no report exists", async () => {
  const cwd = await mkdtemp(path.join(tmpdir(), "seo-v2-cli-"));
  await captureCommand(cwd, () =>
    runV2Command(["prepare-page", "--cluster", "acne-treatment", "--page-id", "P1", "--page-type", "product_category"])
  );

  const qa = await captureCommand(cwd, () =>
    runV2Command(["qa", "--cluster", "acne-treatment", "--page-id", "P1"])
  );

  assert.equal(qa.exitCode, 1);
  assert.match(qa.stderr, /No editorial QA report found/);
});

test("v2 validate-human reports missing human editorial artifacts and exits non-zero", async () => {
  const cwd = await mkdtemp(path.join(tmpdir(), "seo-v2-cli-"));
  await captureCommand(cwd, () =>
    runV2Command(["prepare-page", "--cluster", "acne-treatment", "--page-id", "P1", "--page-type", "product_category"])
  );

  const validation = await captureCommand(cwd, () =>
    runV2Command(["validate-human", "--cluster", "acne-treatment", "--page-id", "P1"])
  );

  assert.equal(validation.exitCode, 1);
  assert.match(validation.stdout, /Human Editorial Brief: failed/);
  assert.match(validation.stdout, /Claim-First Section Plan: failed/);
  assert.match(validation.stdout, /At least 2 useful examples/);
  assert.match(validation.stdout, /Claim-first section plan requires at least one planned visible section/);
});

test("v2 validate-human passes completed human editorial artifacts", async () => {
  const cwd = await mkdtemp(path.join(tmpdir(), "seo-v2-cli-"));
  await captureCommand(cwd, () =>
    runV2Command(["prepare-page", "--cluster", "acne-treatment", "--page-id", "P1", "--page-type", "product_category"])
  );
  const pageDir = path.join(cwd, ".seo-agent-workspace", "v2", "page-packets", "acne-treatment", "P1");

  await writeFile(path.join(pageDir, "human-editorial-brief.json"), `${JSON.stringify(completedHumanBrief(), null, 2)}\n`, "utf8");
  await writeFile(path.join(pageDir, "claim-first-section-plan.json"), `${JSON.stringify(completedClaimPlan(), null, 2)}\n`, "utf8");

  const validation = await captureCommand(cwd, () =>
    runV2Command(["validate-human", "--cluster", "acne-treatment", "--page-id", "P1"])
  );

  assert.equal(validation.exitCode, undefined);
  assert.match(validation.stdout, /Human Editorial Brief: passed/);
  assert.match(validation.stdout, /Claim-First Section Plan: passed/);
  assert.match(validation.stdout, /Voice model: category_manager_with_editorial_empathy/);
  assert.match(validation.stdout, /Examples planned: 2/);
});

test("v2 validate-depth reports missing seeded depth artifacts and exits non-zero", async () => {
  const cwd = await mkdtemp(path.join(tmpdir(), "seo-v2-cli-"));
  await captureCommand(cwd, () =>
    runV2Command(["prepare-page", "--cluster", "acne-treatment", "--page-id", "P1", "--page-type", "product_category"])
  );

  const validation = await captureCommand(cwd, () =>
    runV2Command(["validate-depth", "--cluster", "acne-treatment", "--page-id", "P1"])
  );

  assert.equal(validation.exitCode, 1);
  assert.match(validation.stdout, /Page Depth Contract: failed/);
  assert.match(validation.stdout, /Research extraction matrix requires at least 40 extracted facts/);
  assert.match(validation.stdout, /Depth score must be at least 85/);
});

test("v2 validate-depth passes completed depth artifacts", async () => {
  const cwd = await mkdtemp(path.join(tmpdir(), "seo-v2-cli-"));
  await captureCommand(cwd, () =>
    runV2Command(["prepare-page", "--cluster", "acne-treatment", "--page-id", "P1", "--page-type", "product_category"])
  );
  const pageDir = path.join(cwd, ".seo-agent-workspace", "v2", "page-packets", "acne-treatment", "P1");
  const depthContract = completedDepthContract();

  await writeFile(path.join(pageDir, "research-extraction-matrix.json"), `${JSON.stringify(depthContract.researchExtractionMatrix, null, 2)}\n`, "utf8");
  await writeFile(path.join(pageDir, "competitor-depth-delta.json"), `${JSON.stringify(depthContract.competitorDepthDelta, null, 2)}\n`, "utf8");
  await writeFile(path.join(pageDir, "audience-pain-point-ledger.json"), `${JSON.stringify(depthContract.audiencePainPointLedger, null, 2)}\n`, "utf8");
  await writeFile(path.join(pageDir, "pre-draft-synthesis-brief.json"), `${JSON.stringify(depthContract.preDraftSynthesisBrief, null, 2)}\n`, "utf8");
  await writeFile(path.join(pageDir, "pre-draft-quality-brief.json"), `${JSON.stringify(depthContract.preDraftQualityBrief, null, 2)}\n`, "utf8");
  await writeFile(path.join(pageDir, "depth-score.json"), `${JSON.stringify(depthContract.pageDepthScore, null, 2)}\n`, "utf8");

  const validation = await captureCommand(cwd, () =>
    runV2Command(["validate-depth", "--cluster", "acne-treatment", "--page-id", "P1"])
  );

  assert.equal(validation.exitCode, undefined);
  assert.match(validation.stdout, /Page Depth Contract: passed/);
  assert.match(validation.stdout, /Depth score: 88/);
});

async function captureCommand(cwd: string, run: () => Promise<void>): Promise<{ stdout: string; stderr: string; exitCode: string | number | undefined }> {
  const previousCwd = process.cwd();
  const previousExitCode = process.exitCode;
  const originalLog = console.log;
  const originalError = console.error;
  let stdout = "";
  let stderr = "";

  console.log = (...args: unknown[]) => {
    stdout += `${args.join(" ")}\n`;
  };
  console.error = (...args: unknown[]) => {
    stderr += `${args.join(" ")}\n`;
  };
  process.exitCode = undefined;
  process.chdir(cwd);

  try {
    await run();
    return { stdout, stderr, exitCode: process.exitCode };
  } finally {
    process.chdir(previousCwd);
    process.exitCode = previousExitCode;
    console.log = originalLog;
    console.error = originalError;
  }
}

function completedHumanBrief(): Record<string, unknown> {
  return {
    schemaVersion: "human-editorial-brief.v2",
    status: "draft",
    voiceModel: "category_manager_with_editorial_empathy",
    visibility: { default: "internal_only" },
    depthStrategy: { pageType: "product_category", depth: "medium", framework: "five_w_plus_causal_chain" },
    readerTension: {
      whatReaderIsConfusedAbout: "Why acne keeps returning.",
      whatReaderIsAnxiousAbout: "Choosing the wrong routine.",
      decisionReaderNeedsToMake: "Whether to start with diagnosis or another product."
    },
    categoryManagerPov: {
      whatToChoose: "Start with identifying the acne pattern.",
      whatToAvoid: "Do not treat every breakout as random.",
      whereBuyersGoWrong: "They compare treatment strength before understanding the trigger.",
      whatTheBrandBelieves: "ClearNest believes acne care should start with pattern recognition.",
      tradeoffsThatMatter: ["speed versus tolerability"]
    },
    exampleRequirement: {
      minimumExamplesPerPage: 2,
      plannedExamples: [
        { sectionId: "S3_context", contextType: "category", purpose: "Recurring jawline acne versus occasional forehead bumps." },
        { sectionId: "S5_decision_support", contextType: "india_market", purpose: "Humid-weather routine tradeoffs." }
      ]
    },
    humanDevices: {
      decisionFramework: { required: true, selectedFormat: "if_this_then_that" },
      commonMistakes: {
        required: true,
        mistakesToCover: [{ sectionId: "S4_main_content", mistake: "Using harsher cleansers.", betterWayToThink: "Identify the trigger first." }]
      },
      notRightForYou: {
        required: true,
        conditions: [{ condition: "Painful recurring acne", reason: "Needs expert attention.", saferAlternativeOrNextStep: "Consult a dermatologist." }]
      },
      brandPov: { mode: "clear_not_salesy", firstPerson: "occasional", statement: "Our view is that treatment should start with understanding the acne pattern." },
      finalClosingBeforeCta: { required: true, plannedClosing: "If you are unsure what is triggering your acne, start with a skin analysis before changing another product." }
    },
    qaSummary: { includeInEditorialQaReport: true }
  };
}

function completedClaimPlan(): Record<string, unknown> {
  return {
    schemaVersion: "claim-first-section-plan.v2",
    status: "draft",
    sectionPlanTemplate: { requiredFields: ["sectionId", "sectionClaim"] },
    sections: [
      {
        sectionId: "S3_context",
        sectionClaim: "Acne treatment works better when the reader first identifies the acne pattern.",
        readerQuestion: "Why did my previous acne products not work?",
        evidenceNeeded: ["Source-backed acne type or trigger guidance."],
        exampleOrTradeoff: "Recurring jawline acne may need a different path from occasional forehead bumps.",
        caveatOrNotRightForYou: "Do not treat painful or worsening acne casually.",
        decisionPurpose: "Help the reader choose diagnosis-first action.",
        transitionPurpose: "Move from background explanation to decision framework."
      }
    ]
  };
}

function completedDepthContract(): Record<string, any> {
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
        freshness: "current"
      }))
    },
    competitorDepthDelta: {
      schemaVersion: "competitor-depth-delta.v2",
      primaryKeyword: "acne treatment India",
      primarySerpTop5: Array.from({ length: 5 }, (_, index) => ({
        url: `https://competitor.example/page-${index + 1}`,
        rankingPosition: index + 1,
        strengthLabel: index < 2 ? "strong" : "moderate",
        scores: fullCompetitorScores(index < 2 ? 4 : 3),
        evidenceNotes: [
          "Strong intent match with acne treatment guidance.",
          "Useful structure but incomplete troubleshooting.",
          "Reader can act, though safety boundaries are thinner than needed."
        ],
        standoutAssets: index < 2 ? ["acne treatment comparison table"] : [],
        whyUsersMightStopSearching: index < 2 ? "It gives enough context for many acne treatment readers." : undefined
      })),
      secondaryKeywordSerps: [
        {
          keyword: "oily acne routine India",
          topPages: Array.from({ length: 3 }, (_, index) => ({
            url: `https://secondary.example/page-${index + 1}`,
            rankingPosition: index + 1,
            intentContribution: "Adds oily-acne sub-intent for the primary page.",
            usefulGap: "Does not connect routine changes to stop/switch rules."
          }))
        }
      ],
      competitors: Array.from({ length: 5 }, (_, index) => ({
        url: `https://competitor.example/page-${index + 1}`,
        coverageGaps: [`Gap ${index + 1}`]
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
      searchIntent: "Readers want to identify their acne pattern, choose a safe India-specific first step, and know when not to self-treat.",
      subIntents: [
        "identify acne pattern",
        "understand likely triggers",
        "compare active ingredients",
        "avoid irritation",
        "India climate routine changes",
        "when to see a dermatologist"
      ],
      diagnosticPlan: [
        "acne pattern decision table",
        "trigger to first-step map",
        "not-right-for-you guidance",
        "dermatologist escalation checklist"
      ],
      indiaSpecificity: [
        "humid weather routine",
        "pollution and sunscreen buildup",
        "melanin-rich PIH risk",
        "lightweight SPF availability"
      ],
      safetyTrustPlan: [
        "reviewer credentials",
        "active ingredient stop rules",
        "pregnancy and irritation caveats",
        "source-backed references"
      ],
      standoutElement: {
        type: "decision_matrix",
        title: "Acne pattern to first-step matrix",
        whyCompetitorsMissIt: "Competitors explain routines but do not help readers classify the pattern before choosing actives."
      },
      brandConnection: "The skin analysis helps readers track acne, redness, and marks instead of guessing after every product change.",
      readerQuestionCoverage: [
        evidenceLinkedItem("What acne pattern do I have?", "S3_context", ["F1", "A1"]),
        evidenceLinkedItem("Which trigger is most likely for recurring acne?", "S3_context", ["F2", "A2"]),
        evidenceLinkedItem("Which active should I start with for oily acne-prone skin?", "S4_decision", ["F3", "A3"]),
        evidenceLinkedItem("Can I combine acne actives without irritating my skin?", "S4_decision", ["F4", "A4"]),
        evidenceLinkedItem("What if my skin burns after starting an acne active?", "S4_decision", ["F5", "A5"]),
        evidenceLinkedItem("When should I see a dermatologist for painful acne?", "S4_decision", ["F6", "A6"]),
        evidenceLinkedItem("How should India humidity change my acne routine?", "S3_context", ["F7", "A7"]),
        evidenceLinkedItem("How long should I wait before switching acne products?", "S4_decision", ["F8", "A8"])
      ],
      recommendationSanityPlan: [
        evidenceLinkedItem("Every product or active recommendation must name its routine role.", "S4_decision", ["F9", "A9"]),
        evidenceLinkedItem("Every recommendation needs an avoid-if condition for irritation, pregnancy, or prescription acne care.", "S4_decision", ["F10", "A10"]),
        evidenceLinkedItem("Face-use suitability and source support must be checked before inclusion.", "S4_decision", ["F11", "A11"])
      ],
      claimRiskPlan: [
        evidenceLinkedItem("Cite clinically proven claims or rewrite them.", "S4_decision", ["F12", "A12"]),
        evidenceLinkedItem("Use dermatologist-reviewed only when reviewer proof exists.", "S4_decision", ["F13", "A13"]),
        evidenceLinkedItem("Avoid safest scoring claims unless methodology and evidence source are included.", "S4_decision", ["F14", "A14"]),
        evidenceLinkedItem("Cite non-comedogenic claims with product label or source evidence.", "S4_decision", ["F15", "A15"]),
        evidenceLinkedItem("Limit AI scan claims to supported tracking language.", "S4_decision", ["F16", "A16"])
      ],
      troubleshootingPlan: [
        evidenceLinkedItem("If new bumps appear, stop the new active and switch to a basic cleanser while monitoring.", "S4_decision", ["F17", "A17"]),
        evidenceLinkedItem("If skin feels tight, reduce cleansing frequency and repair the barrier before adding actives.", "S4_decision", ["F18", "A18"]),
        evidenceLinkedItem("If redness increases, pause exfoliating products and seek guidance if irritation persists.", "S4_decision", ["F19", "A19"]),
        evidenceLinkedItem("When acne becomes painful or cystic, stop experimenting and seek medical advice.", "S4_decision", ["F20", "A20"])
      ],
      brandCtaFit: {
        readerProblem: "The reader needs a way to track whether acne, redness, and marks are improving after routine changes.",
        supportedCtaPromise: "MyMirror can help compare visible acne, redness, and mark changes over time.",
        unsupportedClaimsToAvoid: ["Diagnosing acne subtype without clinician review", "Guaranteeing treatment outcome"]
      },
      researchDerivedStructurePlan: researchDerivedStructurePlan(),
      intentDimensions: [
        intentDimension("D1", "diagnosis", 1, ["https://competitor.example/page-1", "F1", "A1"]),
        intentDimension("D2", "India product fit", 2, ["https://competitor.example/page-2", "https://secondary.example/page-1", "F2"]),
        intentDimension("D3", "troubleshooting", 3, ["https://competitor.example/page-3", "A2", "F3"]),
        intentDimension("D4", "safe recommendation boundaries", 4, ["https://competitor.example/page-4", "F4", "A3"])
      ],
      superiorityComponents: [
        {
          id: "decision-tree-acne-patterns",
          componentType: "decision_tree",
          title: "Acne pattern decision tree",
          researchBasis: "Primary competitors explain treatments but do not map reader symptoms to safe next steps.",
          sourceRefs: ["https://competitor.example/page-1", "https://secondary.example/page-1", "A1", "F1"],
          mappedSectionId: "S4_decision",
          intentDimensionSupported: "D1",
          competitorGapAddressed: "Top pages lack a visible diagnosis-first decision component.",
          whyThisIsInformationGain: "It changes the reader's first action before picking actives.",
          competitorComponentComparison: {
            comparisonPath: "beat_existing_component",
            competitorsReviewed: ["https://competitor.example/page-1"],
            whyOursIsBetterOrNeeded: "The competitor table lists options; our tree maps patterns to next actions."
          },
          finalCopyBlock: "Markdown decision tree with pattern, likely next step, and stop rule.",
          imageOrInteractiveNeed: "Can be rendered as a table or visual flow.",
          fallbackContent: "Static markdown decision tree.",
          primaryReaderJob: "Decide whether to self-adjust or seek expert care.",
          brandFit: "MyMirror can support visual change tracking without diagnosing acne.",
          naturalCtaConnection: "soft",
          unsupportedBrandClaimsToAvoid: ["diagnosing acne", "guaranteeing treatment outcome"]
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
        finalOutputLocation: index < 3 ? "S3_context final copy" : "S4_decision final copy",
        finalCopyEvidence: `Visible differentiated improvement ${index + 1} is present.`,
        whyDifferentiated: `This goes beyond restating the SERP by adding action ${index + 1}.`
      })),
      extractableAnswerBlocks: [
        extractableAnswer("quick_answer", "S3_context", ["https://competitor.example/page-1", "F6", "A6"]),
        extractableAnswer("decision_action", "S4_decision", ["https://secondary.example/page-2", "F7", "A7"]),
        extractableAnswer("troubleshooting_safety", "S4_decision", ["F8", "A8", "https://competitor.example/page-2"])
      ],
      aiOverviewTargets: [
        "direct answer block",
        "ingredient comparison table",
        "when-to-see-dermatologist FAQ"
      ],
      internalLinkPlan: [
        "acne types guide",
        "salicylic acid guide",
        "niacinamide guide",
        "sunscreen guide",
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
    primaryUserConcern: "What acne pattern needs which safe next step?",
    primaryConcernVisibleBySectionId: "S3_context",
    primaryConcernVisibleBySectionIndex: 2,
    importantInformationNotBuried: true,
    scanPriorityRationale: "Audience-language sources ask how to classify recurring acne, so the structure surfaces the pattern question before product detail.",
    sectionOrderRationale: "The page moves from pattern recognition to decision support, then troubleshooting and safer recommendation boundaries.",
    sections: [
      {
        sectionId: "S3_context",
        sectionRole: "quick answer",
        sectionAction: "reorder",
        targetSectionTitle: "Identify the acne pattern before choosing treatment",
        whyThisSectionExists: "Readers ask which breakout pattern they have while competitors summarize treatments too early.",
        sourceRefs: ["F7", "F8", "A1", "https://competitor.example/page-1"],
        intentDimensionRefs: ["D1"],
        competitorOrUserGap: "Competitor acne pages do not put reader pattern recognition before ingredient selection.",
        expectedVisibleOutput: "Near-top pattern-recognition answer with safe next-step boundaries.",
        competitorGapRefs: ["https://competitor.example/page-1"],
        audienceLanguageRefs: ["A1"],
        trustCitationRefs: ["F7"],
        finalCopyUse: "Open the section with the acne-pattern decision before background.",
        finalCopyAcceptanceCheck: "Final copy includes a near-top answer naming pattern recognition as the first step.",
        scanPriority: "top",
        readerQuestionAnswered: "Which acne pattern do I have?",
        differentiatesFromPageIds: ["previous-acne-template"]
      },
      {
        sectionId: "S4_decision",
        sectionRole: "decision support",
        sectionAction: "add",
        targetSectionTitle: "Acne pattern to safe next-step decision tree",
        whyThisSectionExists: "SERP and audience gaps show readers need an action path when acne pattern and irritation tolerance conflict.",
        sourceRefs: ["F7", "F3", "A2", "https://competitor.example/page-2"],
        intentDimensionRefs: ["D3"],
        competitorOrUserGap: "Competitors list acne actives without mapping reader symptoms to stop, switch, or seek-help actions.",
        expectedVisibleOutput: "Decision tree mapping pattern, likely issue, safe next step, and escalation.",
        competitorGapRefs: ["https://competitor.example/page-2"],
        audienceLanguageRefs: ["A2"],
        trustCitationRefs: ["F7"],
        finalCopyUse: "Add a visible decision tree for pattern-to-action guidance.",
        finalCopyAcceptanceCheck: "Final copy contains a decision tree with stop/switch/seek-help actions.",
        scanPriority: "top",
        readerQuestionAnswered: "What should I do next for this acne pattern?",
        differentiatesFromPageIds: ["previous-acne-template"]
      }
    ],
    highImpactComponents: [
      {
        componentType: "decision_tree",
        mappedSectionId: "S4_decision",
        readerJob: "Map acne pattern and irritation tolerance to the safest next action.",
        whyThisComponentExists: "Competitor and audience sources show treatment lists without action boundaries.",
        sourceRefs: ["F7", "F3", "A2", "https://competitor.example/page-2"],
        intentDimensionRefs: ["D3"],
        competitorOrAudienceGapAddressed: "Top competitors do not turn worsening symptoms into a stop, switch, or seek-help path.",
        competitorGapRefs: ["https://competitor.example/page-2"],
        audienceLanguageRefs: ["A2"],
        trustCitationRefs: ["F7"],
        visibleReaderBenefit: "Readers can scan their acne pattern and choose a safer next step without reading every section.",
        notGenericReason: "The component is built from acne-pattern and irritation questions found in research.",
        columnsOrSteps: ["pattern", "likely concern", "safe next step", "when to seek help"],
        whyThisShape: "A decision tree matches the reader's step-by-step triage job.",
        expectedVisibleOutput: "Markdown decision tree with pattern, next step, and escalation.",
        finalCopyAcceptanceCheck: "Final copy includes the decision tree with safe next-step actions."
      }
    ],
    structureDecisions: [
      {
        sectionId: "S4_decision",
        sectionAction: "add",
        targetSectionTitle: "Acne pattern to safe next-step decision tree",
        sourceRefs: ["F7", "F3", "A2", "https://competitor.example/page-2"],
        competitorOrUserGap: "Competitors do not convert acne symptoms into reader action boundaries.",
        whyThisStructureIsNeeded: "Readers need a visible acne decision aid, not a generic explanatory sequence.",
        expectedVisibleOutput: "A decision tree with pattern, next step, and escalation columns.",
        finalCopyAcceptanceCheck: "Final copy includes a visible decision tree."
      }
    ],
    structureComparison: {
      comparedCurrentBatchPageIds: ["P0"],
      comparedHistoricalPageIds: ["previous-acne-template"],
      reusedStructureRisk: "low",
      materialDifferences: [
        "The structure surfaces pattern recognition before treatment background.",
        "Decision support is a research-derived tree rather than a reused generic matrix."
      ]
    }
  };
}

function evidenceLinkedItem(item: string, mappedSectionId: string, sourceRefs: string[]): Record<string, unknown> {
  return {
    item,
    sourceRefs,
    mappedSectionId,
    whyThisMatters: `${item} matters because it changes the reader decision.`,
    finalCopyUse: `Use this in ${mappedSectionId} to make the final copy more specific.`
  };
}

function sourceRoleForFact(index: number): string {
  const roles = [
    "primary_serp_competitor",
    "secondary_serp_competitor",
    "reddit_forum_source",
    "video_social_source",
    "paa_source",
    "ai_overview_source",
    "trust_citation_source",
    "long_tail_source"
  ];
  return roles[index % roles.length];
}

function fullCompetitorScores(base: number): Record<string, unknown> {
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
      score: dimension === "intentMatch" || dimension === "topIntentCoverage" ? Math.max(base, 4) : base,
      evidence: `${dimension} has enough evidence for the fixture.`
    }
  ]));
}

function intentDimension(id: string, label: string, priority: number, sourceRefs: string[]): Record<string, unknown> {
  return {
    id,
    label,
    priority,
    sourceRefs,
    plannedWin: `${label} will be answered with more concrete reader action than the current SERP.`,
    competitorBenchmark: `Top competitors mention ${label} but do not turn it into a safe decision path.`
  };
}

function extractableAnswer(blockType: string, mappedSectionId: string, sourceRefs: string[]): Record<string, unknown> {
  return {
    blockType,
    answer: `${blockType} answer that is safer and more useful than the current summary.`,
    sourceRefs,
    mappedSectionId,
    keywordUse: ["acne treatment India", "oily acne routine"],
    aiOverviewDelta: "Adds a humanized action rule rather than repeating generic summary text."
  };
}
