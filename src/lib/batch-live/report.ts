import type {
  BatchLiveCompletionEmailPacket,
  BatchLivePageAttempt,
  BatchLiveQualitySummary,
  BatchLiveRun,
  OpportunityConfidence
} from "./types.js";

export function renderBatchLiveReport(run: BatchLiveRun): string {
  const livePages = run.pages.filter((page) => page.status === "live");
  const failedPages = run.pages.filter((page) => page.status !== "live");
  const summary = buildBatchLiveQualitySummary(run);

  return `# Batch Live Report: ${run.runId}

## Summary

- Cluster: ${run.clusterSlug}
- Status: ${run.status}
- Live: ${run.liveCount}/${run.targetLiveCount}
- Attempts used: ${run.totalAttemptsUsed}/${run.maxTotalAttempts}
- Batch score: ${summary.score}/100
- Batch confidence: ${summary.confidence}
- Score rationale: ${summary.rationale.join("; ")}
- Branch: ${run.branch}
- Live verification: ${run.liveVerification.mode}

## Live Pages

${renderLivePages(livePages)}

## Failed Attempts

${renderFailedPages(failedPages)}
`;
}

export function buildBatchLiveQualitySummary(run: BatchLiveRun): BatchLiveQualitySummary {
  const livePages = run.pages.filter((page) => page.status === "live");
  const failedPages = run.pages.filter((page) => page.status !== "live");
  const liveRate = ratio(run.liveCount, run.targetLiveCount);
  const attemptEfficiency = ratio(run.liveCount, Math.max(run.totalAttemptsUsed, 1));
  const averageLiveOpportunityConfidence = livePages.length === 0
    ? 0
    : livePages.reduce((sum, page) => sum + confidenceValue(page.confidence), 0) / livePages.length;
  const http200Rate = livePages.length === 0
    ? 0
    : livePages.filter((page) => page.httpStatus === 200).length / livePages.length;
  const score = Math.round(
    (liveRate * 60)
    + (attemptEfficiency * 20)
    + (averageLiveOpportunityConfidence * 15)
    + (http200Rate * 5)
  );
  const confidence = run.status === "complete" && score >= 90 && failedPages.length === 0
    ? "high"
    : run.liveCount > 0 && score >= 65
      ? "medium"
      : "low";

  return {
    score,
    confidence,
    liveRate,
    attemptEfficiency,
    averageLiveOpportunityConfidence,
    http200Rate,
    rationale: [
      `${run.liveCount}/${run.targetLiveCount} requested pages are live`,
      `${run.totalAttemptsUsed}/${run.maxTotalAttempts} total attempts used`,
      `${livePages.length} live pages returned HTTP 200`,
      failedPages.length === 0 ? "no failed attempts recorded" : `${failedPages.length} failed or skipped attempts recorded`
    ]
  };
}

export function renderBatchLiveCompletionEmail(
  run: BatchLiveRun,
  options: { to?: string } = {}
): BatchLiveCompletionEmailPacket {
  const summary = buildBatchLiveQualitySummary(run);
  const livePages = run.pages.filter((page) => page.status === "live");
  const failedPages = run.pages.filter((page) => page.status !== "live");
  const subject = `[SEO Batch QA] ${run.clusterSlug}: ${run.liveCount}/${run.targetLiveCount} live, score ${summary.score}/100, ${summary.confidence} confidence`;
  const bodyMarkdown = `# SEO Batch QA Report

Batch run \`${run.runId}\` has finished.

## Executive Summary

- Cluster: ${run.clusterSlug}
- Status: ${run.status}
- Live pages: ${run.liveCount}/${run.targetLiveCount}
- Attempts used: ${run.totalAttemptsUsed}/${run.maxTotalAttempts}
- Batch score: ${summary.score}/100
- Confidence: ${summary.confidence}
- Live verification: ${run.liveVerification.mode}
- Branch: ${run.branch}

## Score Rationale

${summary.rationale.map((item) => `- ${item}`).join("\n")}

## Live Pages

${renderEmailLivePages(livePages)}

## Failed Or Skipped Attempts

${renderEmailFailedPages(failedPages)}

## Recommended Next Step

${failedPages.length === 0
  ? "No failed pages need repair. Review the live URLs and QA artifacts if you want a human spot-check."
  : "Review the failed attempts first. Fix the listed failure reasons, then rerun replacement opportunities until the requested live count is reached."}
`;

  return {
    to: options.to,
    subject,
    bodyMarkdown,
    summary
  };
}

function renderLivePages(pages: BatchLivePageAttempt[]): string {
  if (pages.length === 0) return "None yet.\n";

  return pages.map((page) => `### Attempt ${page.attemptNumber}: ${page.pageTitle}

- Opportunity: ${page.opportunityId}
- Slug: ${page.slug}
- Confidence: ${page.confidence}
- Commit: ${page.commitSha ?? "not recorded"}
- URL: ${page.productionUrl ?? "not recorded"}
- HTTP status: ${page.httpStatus ?? "not recorded"}
- Repair attempts used: ${page.repairAttemptsUsed}
- Page packet: ${page.artifacts.pagePacket ?? "not recorded"}
- QA report: ${page.artifacts.qaReport ?? "not recorded"}
- Image manifest: ${page.artifacts.imageManifest ?? "not recorded"}
`).join("\n");
}

function renderFailedPages(pages: BatchLivePageAttempt[]): string {
  if (pages.length === 0) return "None.\n";

  return pages.map((page) => `### Attempt ${page.attemptNumber}: ${page.pageTitle}

- Opportunity: ${page.opportunityId}
- Status: ${page.status}
- Failed stage: ${page.failedStage ?? "not recorded"}
- Reason: ${page.failureReason ?? "not recorded"}
- Repair attempts used: ${page.repairAttemptsUsed}
- Retryable: ${page.retryable === undefined ? "unknown" : String(page.retryable)}
- Recommended fix: ${page.recommendedFix ?? "not recorded"}
- Page packet: ${page.artifacts.pagePacket ?? "not recorded"}
- QA report: ${page.artifacts.qaReport ?? "not recorded"}
- Image manifest: ${page.artifacts.imageManifest ?? "not recorded"}
`).join("\n");
}

function renderEmailLivePages(pages: BatchLivePageAttempt[]): string {
  if (pages.length === 0) return "None.\n";

  return pages.map((page) => `- ${page.pageTitle}
  - URL: ${page.productionUrl ?? "not recorded"}
  - Confidence: ${page.confidence}
  - HTTP status: ${page.httpStatus ?? "not recorded"}
  - QA report: ${page.artifacts.qaReport ?? "not recorded"}
  - Page packet: ${page.artifacts.pagePacket ?? "not recorded"}
  - Image manifest: ${page.artifacts.imageManifest ?? "not recorded"}`).join("\n");
}

function renderEmailFailedPages(pages: BatchLivePageAttempt[]): string {
  if (pages.length === 0) return "None.\n";

  return pages.map((page) => `- ${page.pageTitle}
  - Status: ${page.status}
  - Failed stage: ${page.failedStage ?? "not recorded"}
  - Reason: ${page.failureReason ?? "not recorded"}
  - Recommended fix: ${page.recommendedFix ?? "not recorded"}
  - QA report: ${page.artifacts.qaReport ?? "not recorded"}`).join("\n");
}

function ratio(numerator: number, denominator: number): number {
  if (denominator <= 0) return 0;
  return Math.max(0, Math.min(1, numerator / denominator));
}

function confidenceValue(confidence: OpportunityConfidence): number {
  if (confidence === "strong") return 1;
  if (confidence === "medium") return 0.7;
  return 0.4;
}
