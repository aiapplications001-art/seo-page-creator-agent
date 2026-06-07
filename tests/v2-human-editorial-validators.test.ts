import assert from "node:assert/strict";
import { test } from "node:test";
import {
  buildHumanEditorialQaSummary,
  validateClaimFirstSectionPlan,
  validateHumanEditorialBrief
} from "../src/lib/v2/human-editorial.js";

const passingHumanBrief = {
  schemaVersion: "human-editorial-brief.v2",
  status: "draft",
  voiceModel: "category_manager_with_editorial_empathy",
  visibility: { default: "internal_only" },
  depthStrategy: {
    pageType: "product_category",
    depth: "medium",
    framework: "five_w_plus_causal_chain"
  },
  readerTension: {
    whatReaderIsConfusedAbout: "Why acne keeps returning after changing products.",
    whatReaderIsAnxiousAbout: "Whether they are choosing the wrong routine.",
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
      { sectionId: "S3_context", contextType: "category", purpose: "Compare recurring jawline acne with occasional forehead bumps." },
      { sectionId: "S5_decision_support", contextType: "india_market", purpose: "Explain humid-weather routine tradeoffs." }
    ]
  },
  humanDevices: {
    decisionFramework: {
      required: true,
      askUserOnce: true,
      selectedFormat: "if_this_then_that"
    },
    commonMistakes: {
      required: true,
      placement: "blended_into_relevant_sections",
      mistakesToCover: [
        { sectionId: "S4_main_content", mistake: "Using harsher cleansers for every breakout.", betterWayToThink: "Identify the trigger first." }
      ]
    },
    notRightForYou: {
      required: true,
      conditions: [
        { condition: "Painful recurring acne", reason: "Needs expert attention.", saferAlternativeOrNextStep: "Consult a dermatologist." }
      ]
    },
    brandPov: {
      mode: "clear_not_salesy",
      firstPerson: "occasional",
      statement: "Our view is that treatment should start with understanding the acne pattern."
    },
    finalClosingBeforeCta: {
      required: true,
      plannedClosing: "If you are unsure what is triggering your acne, start with a skin analysis before changing another product."
    }
  },
  qaSummary: { includeInEditorialQaReport: true }
};

const passingClaimFirstPlan = {
  schemaVersion: "claim-first-section-plan.v2",
  status: "draft",
  sectionPlanTemplate: {
    requiredFields: [
      "sectionId",
      "sectionClaim",
      "readerQuestion",
      "evidenceNeeded",
      "exampleOrTradeoff",
      "decisionPurpose",
      "transitionPurpose"
    ]
  },
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

test("human editorial brief passes when required V2.1 human devices are present", () => {
  const result = validateHumanEditorialBrief(passingHumanBrief);

  assert.equal(result.status, "passed");
  assert.deepEqual(result.blockingIssues, []);
  assert.equal(result.summary.voiceModel, "category_manager_with_editorial_empathy");
  assert.equal(result.summary.examplesCount, 2);
  assert.equal(result.summary.decisionFrameworkType, "if_this_then_that");
});

test("human editorial brief fails missing examples, decision framework, common mistakes, and not-right-for-you guidance", () => {
  const result = validateHumanEditorialBrief({
    ...passingHumanBrief,
    exampleRequirement: { minimumExamplesPerPage: 2, plannedExamples: [{ sectionId: "S3_context", purpose: "One example only." }] },
    humanDevices: {
      ...passingHumanBrief.humanDevices,
      decisionFramework: { required: true, selectedFormat: "" },
      commonMistakes: { required: true, mistakesToCover: [] },
      notRightForYou: { required: true, conditions: [] },
      brandPov: { mode: "clear_not_salesy", firstPerson: "occasional", statement: "" },
      finalClosingBeforeCta: { required: true, plannedClosing: "" }
    }
  });

  assert.equal(result.status, "failed");
  assert.ok(result.blockingIssues.some((issue) => issue.includes("At least 2 useful examples")));
  assert.ok(result.blockingIssues.some((issue) => issue.includes("decision framework")));
  assert.ok(result.blockingIssues.some((issue) => issue.includes("common mistake")));
  assert.ok(result.blockingIssues.some((issue) => issue.includes("not-right-for-you")));
  assert.ok(result.blockingIssues.some((issue) => issue.includes("brand POV")));
  assert.ok(result.blockingIssues.some((issue) => issue.includes("human closing")));
});

test("claim-first section plan requires every section to earn its place", () => {
  const passing = validateClaimFirstSectionPlan(passingClaimFirstPlan);
  assert.equal(passing.status, "passed");

  const failing = validateClaimFirstSectionPlan({
    ...passingClaimFirstPlan,
    sections: [
      {
        sectionId: "S3_context",
        sectionClaim: "",
        readerQuestion: "Why did my products not work?",
        evidenceNeeded: [],
        exampleOrTradeoff: "",
        decisionPurpose: "",
        transitionPurpose: ""
      }
    ]
  });

  assert.equal(failing.status, "failed");
  assert.ok(failing.blockingIssues.some((issue) => issue.includes("S3_context")));
  assert.ok(failing.blockingIssues.some((issue) => issue.includes("section claim")));
  assert.ok(failing.blockingIssues.some((issue) => issue.includes("evidence need")));
  assert.ok(failing.blockingIssues.some((issue) => issue.includes("example or tradeoff")));
});

test("human editorial QA summary stays compact for editor visibility", () => {
  const briefResult = validateHumanEditorialBrief(passingHumanBrief);
  const planResult = validateClaimFirstSectionPlan(passingClaimFirstPlan);
  const summary = buildHumanEditorialQaSummary({ briefResult, planResult });

  assert.equal(summary.status, "passed");
  assert.equal(summary.voiceModel, "category_manager_with_editorial_empathy");
  assert.equal(summary.examplesCount, 2);
  assert.deepEqual(summary.topHumanQualityRisks, []);
  assert.ok(summary.keyHumanTouches.includes("decision framework: if_this_then_that"));
  assert.ok(summary.keyHumanTouches.includes("common mistakes blended into relevant sections"));
});
