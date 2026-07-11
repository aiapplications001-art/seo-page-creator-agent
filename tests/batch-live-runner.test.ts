import assert from "node:assert/strict";
import { test } from "node:test";
import { runBatchLive } from "../src/lib/batch-live/runner.js";
import type {
  BatchLiveDependencies,
  BatchLiveCompletionEmailPacket,
  BatchLiveOpportunity,
  BatchLiveRun,
  PageProductionResult,
  PublishResult
} from "../src/lib/batch-live/types.js";
import type { PageContentForUniqueness } from "../src/lib/v2/content-uniqueness.js";

test("continues generating replacements until target live count is reached", async () => {
  const dependencies = fakeDependencies({
    opportunities: [opportunity("P1"), opportunity("P2"), opportunity("P3")],
    pageResults: [
      pageFailed("validate-gates", "Citation set still has unsupported high-strength claims."),
      pageReady("P2"),
      pageReady("P3")
    ],
    publishResults: [published("P2"), published("P3")]
  });

  const result = await runBatchLive({
    clusterSlug: "acne-treatment",
    runId: "run-1",
    targetLiveCount: 2
  }, dependencies);

  assert.equal(result.status, "complete");
  assert.equal(result.maxTotalAttempts, 4);
  assert.equal(result.totalAttemptsUsed, 3);
  assert.equal(result.liveCount, 2);
  assert.deepEqual(result.pages.map((page) => page.status), [
    "failed_after_3_repairs",
    "live",
    "live"
  ]);
  assert.equal(result.pages[0].failedStage, "validate-gates");
  assert.equal(result.pages[0].repairAttemptsUsed, 3);
  assert.equal(result.pages[1].commitSha, "commit-P2");
  assert.equal(result.pages[2].productionUrl, "https://example.com/P3");
});

test("stops at double the requested count when live target is not reached", async () => {
  const dependencies = fakeDependencies({
    opportunities: [opportunity("P1"), opportunity("P2"), opportunity("P3"), opportunity("P4")],
    pageResults: [
      pageFailed("validate-human", "Human editorial brief is incomplete."),
      pageFailed("validate-gates", "SERP research has fewer than 10 meaningful sources."),
      pageFailed("qa", "Every visible section must score at least 70."),
      pageFailed("image-manifest", "IMG_HERO is missing.")
    ],
    publishResults: []
  });

  const result = await runBatchLive({
    clusterSlug: "acne-treatment",
    runId: "run-2",
    targetLiveCount: 2
  }, dependencies);

  assert.equal(result.status, "partial_complete_attempt_limit_reached");
  assert.equal(result.maxTotalAttempts, 4);
  assert.equal(result.totalAttemptsUsed, 4);
  assert.equal(result.liveCount, 0);
  assert.equal(result.pages.length, 4);
  assert.ok(result.pages.every((page) => page.status === "failed_after_3_repairs"));
});

test("runs clean project preflight before start and before every page attempt", async () => {
  const dependencies = fakeDependencies({
    opportunities: [opportunity("P1")],
    pageResults: [pageReady("P1")],
    publishResults: [published("P1")]
  });

  await runBatchLive({
    clusterSlug: "acne-treatment",
    runId: "run-3",
    targetLiveCount: 1
  }, dependencies);

  assert.equal(dependencies.cleanChecks.length, 2);
  assert.deepEqual(dependencies.cleanChecks, ["before_start", "before_attempt"]);
});

test("identifies the cluster during preflight when no cluster slug is provided", async () => {
  const dependencies = fakeDependencies({
    opportunities: [opportunity("P1")],
    pageResults: [pageReady("P1")],
    publishResults: [published("P1")]
  });

  const result = await runBatchLive({
    runId: "run-4",
    targetLiveCount: 1
  }, dependencies);

  assert.equal(result.clusterSlug, "auto-identified-cluster");
  assert.equal(result.clusterSelection.mode, "auto_identified");
  assert.equal(dependencies.clusterIdentificationCount, 1);
  assert.deepEqual(dependencies.cleanChecks, ["before_start", "before_attempt"]);
});

test("passes strict serial page and research depth rules to every page worker call", async () => {
  const dependencies = fakeDependencies({
    opportunities: [opportunity("P1"), opportunity("P2")],
    pageResults: [pageReady("P1"), pageReady("P2")],
    publishResults: [published("P1"), published("P2")]
  });

  await runBatchLive({
    clusterSlug: "acne-treatment",
    runId: "run-5",
    targetLiveCount: 2
  }, dependencies);

  assert.equal(dependencies.pageWorkerOptions.length, 2);
  assert.ok(dependencies.pageWorkerOptions.every((options) => options.workflowMode === "serial_page_transaction"));
  assert.ok(dependencies.pageWorkerOptions.every((options) => options.assetBatching === "current_page_only"));
  assert.ok(dependencies.pageWorkerOptions.every((options) => options.copyBatching === "current_page_only"));
  assert.ok(dependencies.pageWorkerOptions.every((options) => options.researchDepth.serpMeaningfulSourcesMinimum === 10));
  assert.ok(dependencies.pageWorkerOptions.every((options) => options.researchDepth.socialVideoAttemptedAssetsMinimum === 7));
  assert.ok(dependencies.pageWorkerOptions.every((options) => options.researchDepth.socialVideoReviewedAssetsMinimum === 5));
  assert.ok(dependencies.pageWorkerOptions.every((options) => options.researchDepth.requireClaimSpecificCitations === true));
  assert.ok(dependencies.pageWorkerOptions.every((options) => options.depthContract.required === true));
  assert.ok(dependencies.pageWorkerOptions.every((options) => options.depthContract.minimumScore === 85));
  assert.ok(dependencies.pageWorkerOptions.every((options) => options.depthContract.validateBeforeFinalCopy === true));
  assert.ok(dependencies.pageWorkerOptions.every((options) => options.depthContract.repairRequiresNewResearch === true));
  assert.ok(dependencies.pageWorkerOptions.every((options) => options.keywordDiscovery.prioritizeUnfocusedKeywords === true));
  assert.ok(dependencies.pageWorkerOptions.every((options) => options.keywordDiscovery.prioritizeLongTailKeywords === true));
  assert.ok(dependencies.pageWorkerOptions.every((options) => options.keywordDiscovery.rejectVolumeOnlySelection === true));
  assert.ok(dependencies.pageWorkerOptions.every((options) => options.keywordDiscovery.minimumLongTailVariants === 5));
  assert.ok(dependencies.pageWorkerOptions.every((options) => options.keywordDiscovery.requireUnderservedReason === true));
  assert.ok(dependencies.pageWorkerOptions.every((options) => options.keywordDiscovery.requireStandoutAngle === true));
  assert.ok(dependencies.pageWorkerOptions.every((options) => options.contentUniqueness.prohibitSharedBodyTemplate === true));
  assert.ok(dependencies.pageWorkerOptions.every((options) => options.contentUniqueness.compareAgainstPriorBatchPages === true));
  assert.ok(dependencies.pageWorkerOptions.every((options) => options.contentUniqueness.compareAgainstHistoricalRuns === true));
  assert.ok(dependencies.pageWorkerOptions.every((options) => options.contentUniqueness.requireResearchDerivedStructure === true));
  assert.ok(dependencies.pageWorkerOptions.every((options) => options.contentUniqueness.requireDistinctPageStructure === true));
  assert.ok(dependencies.pageWorkerOptions.every((options) => options.contentUniqueness.requireDistinctSectionCopy === true));
  assert.ok(dependencies.pageWorkerOptions.every((options) => options.contentUniqueness.requireDistinctDecisionContent === true));
  assert.ok(dependencies.pageWorkerOptions.every((options) => options.contentUniqueness.requireDistinctMistakesTroubleshootingAndCta === true));
  assert.ok(dependencies.pageWorkerOptions.every((options) => options.contentUniqueness.maximumSharedBodySimilarity === 0.5));
  assert.ok(dependencies.pageWorkerOptions.every((options) => options.contentUniqueness.maximumSharedStructureSimilarity === 0.8));
  assert.ok(dependencies.pageWorkerOptions.every((options) => options.contentUniqueness.repeatedLongSectionLimit === 2));
  assert.ok(dependencies.pageWorkerOptions.every((options) => options.contentUniqueness.validateBeforeCommit === true));
  assert.ok(dependencies.pageWorkerOptions.every((options) => options.contentUniqueness.validateBeforePublish === true));
});

test("sends completion email packet after the batch run finishes", async () => {
  const dependencies = fakeDependencies({
    opportunities: [opportunity("P1")],
    pageResults: [pageReady("P1")],
    publishResults: [published("P1")]
  });

  await runBatchLive({
    clusterSlug: "acne-treatment",
    runId: "run-email",
    targetLiveCount: 1,
    completionEmailTo: "owner@example.com"
  }, dependencies);

  assert.equal(dependencies.sentEmails.length, 1);
  assert.equal(dependencies.sentEmails[0].to, "owner@example.com");
  assert.match(dependencies.sentEmails[0].subject, /\[SEO Batch QA\] acne-treatment: 1\/1 live/);
  assert.match(dependencies.sentEmails[0].bodyMarkdown, /# SEO Batch QA Report/);
  assert.equal(dependencies.sentEmails[0].summary.confidence, "high");
});

test("blocks publishing when a ready page repeats prior live batch body copy", async () => {
  const dependencies = fakeDependencies({
    opportunities: [opportunity("P1"), opportunity("P2")],
    pageResults: [pageReady("P1"), pageReady("P2")],
    publishResults: [published("P1"), published("P2")],
    pageContents: {
      P1: repeatedPageContent("P1"),
      P2: repeatedPageContent("P2")
    }
  });

  const result = await runBatchLive({
    clusterSlug: "acne-treatment",
    runId: "run-duplicate-body",
    targetLiveCount: 2
  }, dependencies);

  assert.equal(result.status, "partial_complete_attempt_limit_reached");
  assert.equal(result.liveCount, 1);
  assert.equal(result.pages[0].status, "live");
  assert.equal(result.pages[1].status, "failed_after_3_repairs");
  assert.equal(result.pages[1].failedStage, "content-uniqueness");
  assert.match(result.pages[1].failureReason ?? "", /Shared body templates across pages are not allowed/);
  assert.equal(dependencies.publishCalls.length, 1);
});

test("blocks publishing when a ready page repeats historical cross-run page structure or body", async () => {
  const dependencies = fakeDependencies({
    opportunities: [opportunity("P2")],
    pageResults: [pageReady("P2")],
    publishResults: [published("P2")],
    historicalPageContents: [repeatedPageContent("historical-P1")],
    pageContents: {
      P2: repeatedPageContent("P2")
    }
  });

  const result = await runBatchLive({
    clusterSlug: "acne-treatment",
    runId: "run-historical-duplicate",
    targetLiveCount: 1
  }, dependencies);

  assert.equal(result.status, "partial_complete_attempt_limit_reached");
  assert.equal(result.liveCount, 0);
  assert.equal(result.pages[0].status, "failed_after_3_repairs");
  assert.equal(result.pages[0].failedStage, "content-uniqueness");
  assert.match(result.pages[0].failureReason ?? "", /historical-P1 and P2/);
  assert.match(result.pages[0].failureReason ?? "", /another batch or previous run/);
  assert.equal(dependencies.historicalLoads, 1);
  assert.equal(dependencies.publishCalls.length, 0);
});

function opportunity(id: string): BatchLiveOpportunity {
  return {
    id,
    pageTitle: `Page ${id}`,
    slug: id,
    confidence: "strong",
    searchIntent: `Search intent for ${id}`,
    evidence: [`SERP evidence for ${id}`],
    targetAudience: "Readers comparing options",
    canonicalDecision: "self-canonical",
    nonDuplicateReason: "Distinct search intent."
  };
}

function pageReady(pageId: string): PageProductionResult {
  return {
    status: "ready",
    repairAttemptsUsed: 1,
    package: {
      opportunityId: pageId,
      pageTitle: `Page ${pageId}`,
      slug: pageId,
      artifacts: {
        pagePacket: `.seo-agent-workspace/page-packets/acne/${pageId}/page-packet.json`,
        qaReport: `.seo-agent-workspace/v2/page-packets/acne/${pageId}/editorial-qa-report.md`,
        imageManifest: `.seo-agent-workspace/page-packets/acne/${pageId}/image-manifest.json`
      }
    }
  };
}

function pageFailed(failedStage: string, failureReason: string): PageProductionResult {
  return {
    status: "failed",
    failedStage,
    failureReason,
    repairAttemptsUsed: 3,
    recommendedFix: "Review the failed artifact and retry the page.",
    retryable: true,
    artifacts: {
      pagePacket: ".seo-agent-workspace/page-packets/acne/failed/page-packet.json"
    }
  };
}

function published(pageId: string): PublishResult {
  return {
    status: "live",
    commitSha: `commit-${pageId}`,
    productionUrl: `https://example.com/${pageId}`,
    httpStatus: 200
  };
}

function fakeDependencies(input: {
  opportunities: BatchLiveOpportunity[];
  pageResults: PageProductionResult[];
  publishResults: PublishResult[];
  pageContents?: Record<string, PageContentForUniqueness>;
  historicalPageContents?: PageContentForUniqueness[];
}): BatchLiveDependencies & {
  cleanChecks: string[];
  clusterIdentificationCount: number;
  pageWorkerOptions: Parameters<BatchLiveDependencies["pageWorker"]["produce"]>[1][];
  sentEmails: BatchLiveCompletionEmailPacket[];
  publishCalls: string[];
  historicalLoads: number;
} {
  const opportunities = [...input.opportunities];
  const pageResults = [...input.pageResults];
  const publishResults = [...input.publishResults];
  const cleanChecks: string[] = [];
  const pageWorkerOptions: Parameters<BatchLiveDependencies["pageWorker"]["produce"]>[1][] = [];
  const sentEmails: BatchLiveCompletionEmailPacket[] = [];
  const publishCalls: string[] = [];
  let historicalLoads = 0;
  let clusterIdentificationCount = 0;

  return {
    cleanChecks,
    sentEmails,
    publishCalls,
    get historicalLoads() {
      return historicalLoads;
    },
    get clusterIdentificationCount() {
      return clusterIdentificationCount;
    },
    pageWorkerOptions,
    ensureCleanProjectState: async (phase) => {
      cleanChecks.push(phase);
    },
    clusterPlanner: {
      identifyCluster: async () => {
        clusterIdentificationCount += 1;
        return {
          mode: "auto_identified",
          clusterSlug: "auto-identified-cluster",
          source: "existing_cluster_plan",
          rationale: "Only suitable cluster plan in workspace."
        };
      }
    },
    opportunityEngine: {
      nextOpportunity: async (_run: BatchLiveRun) => opportunities.shift() ?? null
    },
    pageWorker: {
      produce: async (_opportunity, options) => {
        assert.equal(options.repairAttempts, 3);
        pageWorkerOptions.push(options);
        const result = pageResults.shift();
        assert.ok(result, "Expected a page production result.");
        return result;
      }
    },
    publisher: {
      publish: async (page) => {
        publishCalls.push(page.opportunityId);
        const result = publishResults.shift();
        assert.ok(result, "Expected a publish result.");
        return result;
      }
    },
    contentUniqueness: input.pageContents
      ? {
          loadHistoricalPageContent: async () => {
            historicalLoads += 1;
            return input.historicalPageContents ?? [];
          },
          loadPageContent: async (page) => {
            const content = input.pageContents?.[page.opportunityId];
            assert.ok(content, `Expected page content for ${page.opportunityId}`);
            return content;
          }
        }
      : undefined,
    completionNotifier: {
      sendCompletionEmail: async (packet) => {
        sentEmails.push(packet);
      }
    }
  };
}

function repeatedPageContent(pageId: string): PageContentForUniqueness {
  return {
    pageId,
    title: `Distinct title for ${pageId}`,
    slug: pageId.toLowerCase(),
    intentPattern: "diagnostic how-to",
    structureVariant: `research-derived-${pageId}`,
    researchDerivedStructureRationale: `Structure was selected from SERP, PAA, forum, and video gaps for ${pageId}.`,
    researchRefs: [`serp-${pageId}`, `forum-${pageId}`],
    sections: [
      {
        sectionId: "S1_hero",
        heading: "Hero",
        markdown: `# Distinct hook for ${pageId}`
      },
      {
        sectionId: "S3_main",
        heading: "Main routine",
        sectionIntent: "routine decision support",
        markdown: "Start with the same morning and night routine for every concern. Use a gentle cleanser, one treatment serum, moisturiser, and sunscreen. Keep the steps simple for two weeks, avoid changing multiple products together, and compare skin response before adding anything stronger."
      },
      {
        sectionId: "S4_matrix",
        heading: "Decision matrix",
        sectionIntent: "symptom to action matrix",
        markdown: "If the skin feels oily, choose a lightweight gel. If the skin feels dry, choose a cream. If breakouts continue, reduce actives. If irritation appears, pause products. Use this matrix to move from a symptom to a next step without overcomplicating the routine."
      },
      {
        sectionId: "S6_troubleshooting",
        heading: "Troubleshooting",
        sectionIntent: "trigger action troubleshooting",
        markdown: "Trigger: redness or stinging after product use. Action: stop the newest active and repair the barrier. Trigger: bumps keep appearing. Action: simplify the routine and check whether any heavy product is clogging skin. Trigger: dryness. Action: moisturise more consistently."
      },
      {
        sectionId: "S8_cta",
        heading: "CTA",
        sectionIntent: "reader first brand bridge",
        markdown: "Use MyMirror to track your skin, compare progress, and decide what to adjust next. The brand helps you understand whether the routine is working and supports a calmer, more confident skincare decision."
      }
    ]
  };
}
