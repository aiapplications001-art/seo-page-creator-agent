import assert from "node:assert/strict";
import { test } from "node:test";
import {
  buildEditorialQaReport,
  canGenerateFinalPacket,
  renderEditorialQaReportMarkdown,
  sectionStatus
} from "../src/lib/v2/qa.js";

const passingGateResults = [
  { gate: "SERP Research Ledger", status: "passed", blockingIssues: [] },
  { gate: "Social/Video Research", status: "passed_limited_confidence", blockingIssues: [] },
  { gate: "Audience Definition", status: "passed", blockingIssues: [] },
  { gate: "Narrative Brief", status: "passed", blockingIssues: [] },
  { gate: "Citation Set", status: "passed", blockingIssues: [] }
];

const dimensionScores = {
  researchGrounding: 88,
  narrativeFit: 84,
  humanReadability: 82,
  seoCompleteness: 86,
  conversionClarity: 85
};

test("sectionStatus maps scores into V2 QA bands", () => {
  assert.equal(sectionStatus(94), "Strong");
  assert.equal(sectionStatus(81), "Pass");
  assert.equal(sectionStatus(72), "Advisory");
  assert.equal(sectionStatus(69), "Needs repair");
});

test("QA passes when all gates pass and every section score is at least 70", () => {
  const report = buildEditorialQaReport({
    overallScore: 85,
    dimensionScores,
    hardGateResults: passingGateResults,
    sectionScores: [
      {
        sectionId: "S1_hero",
        heading: "Hero",
        score: 88,
        whyPointsWereLost: "CTA microcopy could be sharper.",
        notes: "Strong first-fold value."
      },
      {
        sectionId: "S4_main_content",
        heading: "Main Content",
        score: 73,
        whyPointsWereLost: "One example could be more specific.",
        notes: "Still useful and publishable."
      }
    ],
    recommendations: ["Add one stronger proof point if available."]
  });

  assert.equal(report.finalStatus, "passed");
  assert.equal(canGenerateFinalPacket(report), true);
  assert.equal(report.sectionScores[0]?.status, "Pass");
  assert.equal(report.sectionScores[1]?.status, "Advisory");
});

test("QA fails when any section remains below 70", () => {
  const report = buildEditorialQaReport({
    overallScore: 78,
    dimensionScores,
    hardGateResults: passingGateResults,
    sectionScores: [
      {
        sectionId: "S8_faq",
        heading: "FAQ",
        score: 66,
        whyPointsWereLost: "Answers are too generic after repair.",
        notes: "Needs sharper objection handling."
      }
    ],
    recommendations: ["Revise FAQ using the audience objections."]
  });

  assert.equal(report.finalStatus, "failed");
  assert.equal(canGenerateFinalPacket(report), false);
  assert.equal(report.sectionScores[0]?.status, "Needs repair");
  assert.ok(report.blockingIssues.includes("Every visible section must score at least 70."));
});

test("hard gate failure prevents final packet eligibility", () => {
  const report = buildEditorialQaReport({
    overallScore: 91,
    dimensionScores,
    hardGateResults: [
      ...passingGateResults.slice(0, 4),
      { gate: "Citation Set", status: "failed", blockingIssues: ["High-strength claims require source support."] }
    ],
    sectionScores: [
      {
        sectionId: "S1_hero",
        heading: "Hero",
        score: 91,
        whyPointsWereLost: "Minor CTA wording issue.",
        notes: "Strong opening."
      }
    ],
    recommendations: ["Add source support for the high-strength claim."]
  });

  assert.equal(report.finalStatus, "failed");
  assert.equal(canGenerateFinalPacket(report), false);
  assert.ok(report.blockingIssues.includes("Citation Set: High-strength claims require source support."));
});

test("markdown renderer includes scores, section lost-points reasons, and optional auto-repair summary", () => {
  const report = buildEditorialQaReport({
    overallScore: 86,
    dimensionScores,
    hardGateResults: passingGateResults,
    sectionScores: [
      {
        sectionId: "S1_hero",
        heading: "Hero",
        score: 88,
        whyPointsWereLost: "CTA microcopy could be sharper.",
        notes: "Clear first-fold value."
      }
    ],
    autoRepairSummary: [
      "Rewrote the hero opening to remove generic framing."
    ],
    recommendations: ["Add one stronger brand proof point."]
  });

  const markdown = renderEditorialQaReportMarkdown(report);

  assert.match(markdown, /Overall: 86\/100/);
  assert.match(markdown, /Research grounding \| 88/);
  assert.match(markdown, /S1_hero \| Hero \| 88/);
  assert.match(markdown, /CTA microcopy could be sharper/);
  assert.match(markdown, /Auto-Repair Summary/);
  assert.match(markdown, /Rewrote the hero opening/);

  const withoutRepair = renderEditorialQaReportMarkdown(buildEditorialQaReport({
    overallScore: 86,
    dimensionScores,
    hardGateResults: passingGateResults,
    sectionScores: [
      {
        sectionId: "S1_hero",
        heading: "Hero",
        score: 88,
        whyPointsWereLost: "CTA microcopy could be sharper.",
        notes: "Clear first-fold value."
      }
    ],
    recommendations: ["Add one stronger brand proof point."]
  }));

  assert.doesNotMatch(withoutRepair, /Auto-Repair Summary/);
});
