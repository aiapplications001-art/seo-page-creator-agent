export interface SectionQaScoreInput {
  sectionId: string;
  heading: string;
  score: number;
  whyPointsWereLost: string;
  notes: string;
}

export interface SectionQaScore extends SectionQaScoreInput {
  status: "Strong" | "Pass" | "Advisory" | "Needs repair" | "Hard fail";
}

export interface DimensionScores {
  researchGrounding: number;
  narrativeFit: number;
  humanReadability: number;
  seoCompleteness: number;
  conversionClarity: number;
}

export interface HardGateResult {
  gate: string;
  status: string;
  blockingIssues: string[];
}

export interface EditorialQaReportInput {
  overallScore: number;
  dimensionScores: DimensionScores;
  hardGateResults: HardGateResult[];
  sectionScores: SectionQaScoreInput[];
  humanEditorialSummary?: HumanEditorialQaSummary;
  autoRepairSummary?: string[];
  recommendations: string[];
}

export interface EditorialQaReport {
  schemaVersion: "editorial-qa-report.v2";
  finalStatus: "passed" | "failed";
  overallScore: number;
  dimensionScores: DimensionScores;
  hardGateResults: HardGateResult[];
  sectionScores: SectionQaScore[];
  humanEditorialSummary?: HumanEditorialQaSummary;
  autoRepairSummary?: string[];
  recommendations: string[];
  blockingIssues: string[];
}

export function sectionStatus(score: number): SectionQaScore["status"] {
  if (score >= 90) return "Strong";
  if (score >= 80) return "Pass";
  if (score >= 70) return "Advisory";
  return "Needs repair";
}

export function buildEditorialQaReport(input: EditorialQaReportInput): EditorialQaReport {
  const sectionScores = input.sectionScores.map((section) => ({
    ...section,
    status: sectionStatus(section.score)
  }));
  const blockingIssues = collectBlockingIssues(input.hardGateResults, sectionScores);

  return {
    schemaVersion: "editorial-qa-report.v2",
    finalStatus: blockingIssues.length === 0 ? "passed" : "failed",
    overallScore: input.overallScore,
    dimensionScores: input.dimensionScores,
    hardGateResults: input.hardGateResults,
    sectionScores,
    humanEditorialSummary: input.humanEditorialSummary,
    autoRepairSummary: input.autoRepairSummary?.length ? input.autoRepairSummary : undefined,
    recommendations: input.recommendations,
    blockingIssues
  };
}

export function canGenerateFinalPacket(report: EditorialQaReport): boolean {
  return report.finalStatus === "passed" && report.blockingIssues.length === 0;
}

export function renderEditorialQaReportMarkdown(report: EditorialQaReport): string {
  const gateRows = report.hardGateResults.map((gate) =>
    `| ${gate.gate} | ${gate.status} | ${gate.blockingIssues.join("; ") || "None"} |`
  ).join("\n");
  const dimensionRows = [
    ["Research grounding", report.dimensionScores.researchGrounding],
    ["Narrative fit", report.dimensionScores.narrativeFit],
    ["Human readability", report.dimensionScores.humanReadability],
    ["SEO completeness", report.dimensionScores.seoCompleteness],
    ["Conversion clarity", report.dimensionScores.conversionClarity]
  ].map(([label, score]) => `| ${label} | ${score} |`).join("\n");
  const sectionRows = report.sectionScores.map((section) =>
    `| ${section.sectionId} | ${section.heading} | ${section.score} | ${section.status} | ${section.whyPointsWereLost} | ${section.notes} |`
  ).join("\n");
  const humanEditorialSummary = report.humanEditorialSummary
    ? renderHumanEditorialSummary(report.humanEditorialSummary)
    : "";
  const repairSummary = report.autoRepairSummary?.length
    ? `\n## Auto-Repair Summary\n\n${report.autoRepairSummary.map((item) => `- ${item}`).join("\n")}\n`
    : "";
  const blockingIssues = report.blockingIssues.length
    ? `\n## Blocking Issues\n\n${report.blockingIssues.map((issue) => `- ${issue}`).join("\n")}\n`
    : "";

  return `# Editorial QA Report

## Final Status

${report.finalStatus}

## Advisory Quality Score

Overall: ${report.overallScore}/100

This score is advisory. Hard gate status and section thresholds determine whether a final packet can be generated.

## Dimension Scores

| Dimension | Score |
| --- | ---: |
${dimensionRows}

## Hard Gate Results

| Gate | Status | Blocking issues |
| --- | --- | --- |
${gateRows}

## Section-Level QA

| Section ID | Heading | Score | Status | Why Points Were Lost | Notes |
| --- | --- | ---: | --- | --- | --- |
${sectionRows}
${humanEditorialSummary}${repairSummary}${blockingIssues}
## Top Remaining Recommendations

${report.recommendations.map((recommendation, index) => `${index + 1}. ${recommendation}`).join("\n") || "None"}
`;
}

function renderHumanEditorialSummary(summary: HumanEditorialQaSummary): string {
  const touches = summary.keyHumanTouches.map((touch) => `- ${touch}`).join("\n") || "- None";
  const risks = summary.topHumanQualityRisks.map((risk) => `- ${risk}`).join("\n") || "- None";

  return `
## Human Editorial Summary

- Status: ${summary.status}
- Voice model: ${summary.voiceModel}
- Depth: ${summary.depth ?? "Not provided"}
- Examples planned: ${summary.examplesCount}
- Decision framework: ${summary.decisionFrameworkType ?? "Not selected"}
- Brand POV used: ${summary.brandPovUsed}

Key human touches:
${touches}

Top human quality risks:
${risks}
`;
}

function collectBlockingIssues(hardGateResults: HardGateResult[], sectionScores: SectionQaScore[]): string[] {
  const issues: string[] = [];
  for (const gate of hardGateResults) {
    if (gate.status === "passed" || gate.status === "passed_limited_confidence") continue;
    if (gate.blockingIssues.length === 0) {
      issues.push(`${gate.gate}: Gate did not pass.`);
      continue;
    }
    for (const issue of gate.blockingIssues) {
      issues.push(`${gate.gate}: ${issue}`);
    }
  }
  if (sectionScores.some((section) => section.score < 70)) {
    issues.push("Every visible section must score at least 70.");
  }
  return issues;
}
import type { HumanEditorialQaSummary } from "./human-editorial.js";
