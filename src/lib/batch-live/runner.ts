import { createInitialBatchLiveRun } from "./state.js";
import { renderBatchLiveCompletionEmail } from "./report.js";
import { validateBatchContentUniqueness } from "../v2/content-uniqueness.js";
import type {
  BatchLiveClusterSelection,
  BatchLiveDependencies,
  BatchLiveOpportunity,
  BatchLivePageAttempt,
  BatchLiveRun,
  PageProductionOptions,
  PageProductionPackage,
  PageProductionResult,
  PublishResult,
  RunBatchLiveInput
} from "./types.js";
import type { PageContentForUniqueness } from "../v2/content-uniqueness.js";

const PAGE_PRODUCTION_OPTIONS: PageProductionOptions = {
  repairAttempts: 3,
  workflowMode: "serial_page_transaction",
  assetBatching: "current_page_only",
  copyBatching: "current_page_only",
  voice: "category-manager-with-editorial-empathy",
  keywordDiscovery: {
    prioritizeUnfocusedKeywords: true,
    prioritizeLongTailKeywords: true,
    rejectVolumeOnlySelection: true,
    requireSerpIntentMessinessAssessment: true,
    requireCompetitorThinnessAssessment: true,
    requireRedditForumVideoLanguage: true,
    requireUnderservedReason: true,
    requireStandoutAngle: true,
    minimumLongTailVariants: 5,
    minimumRelatedQuestions: 5,
    acceptedOpportunitySignals: [
      "messy_serp_intent",
      "thin_competitor_coverage",
      "specific_reader_problem",
      "reddit_forum_language",
      "video_social_questions",
      "comparison_or_alternative_intent",
      "pricing_or_objection_intent",
      "local_or_market_specific_modifier",
      "diagnostic_or_how_to_modifier"
    ]
  },
  researchDepth: {
    serpMeaningfulSourcesMinimum: 10,
    socialVideoAttemptedAssetsMinimum: 7,
    socialVideoReviewedAssetsMinimum: 5,
    requireClaimSpecificCitations: true,
    requireInternalArtifactsBeforeCopy: true,
    prohibitFuturePageAssets: true,
    prohibitFuturePageCopy: true
  },
  depthContract: {
    required: true,
    minimumScore: 85,
    minimumExtractedFacts: 40,
    minimumFactsPerSource: 3,
    minimumCompetitorSpecificityImprovements: 10,
    minimumAudienceSignals: 20,
    minimumInformationGainItems: 8,
    validateBeforeFinalCopy: true,
    validateBeforeImages: true,
    validateBeforePublish: true,
    repairRequiresNewResearch: true
  },
  contentUniqueness: {
    prohibitSharedBodyTemplate: true,
    compareAgainstPriorBatchPages: true,
    compareAgainstHistoricalRuns: true,
    requireResearchDerivedStructure: true,
    requireDistinctPageStructure: true,
    requireDistinctSectionCopy: true,
    requireDistinctDecisionContent: true,
    requireDistinctMistakesTroubleshootingAndCta: true,
    maximumSharedBodySimilarity: 0.5,
    maximumSharedStructureSimilarity: 0.8,
    repeatedLongSectionLimit: 2,
    validateBeforeCommit: true,
    validateBeforePublish: true
  }
};

export async function runBatchLive(
  input: RunBatchLiveInput,
  dependencies: BatchLiveDependencies
): Promise<BatchLiveRun> {
  await dependencies.ensureCleanProjectState("before_start");
  const clusterSelection = await resolveClusterSelection(input, dependencies);
  const run = createInitialBatchLiveRun(input, clusterSelection);
  const livePageContent = await loadHistoricalPageContent(clusterSelection, dependencies);
  await dependencies.runStore?.initializeRun(run);

  while (run.liveCount < run.targetLiveCount && run.totalAttemptsUsed < run.maxTotalAttempts) {
    await dependencies.ensureCleanProjectState("before_attempt");
    const opportunity = await dependencies.opportunityEngine.nextOpportunity(run);
    if (!opportunity) {
      run.status = "partial_complete_attempt_limit_reached";
      await completeRun(run, input, dependencies);
      return run;
    }

    run.totalAttemptsUsed += 1;
    await dependencies.runStore?.beginPageAttempt(run, opportunity);
    const production = await dependencies.pageWorker.produce(opportunity, PAGE_PRODUCTION_OPTIONS);

    if (production.status === "failed") {
      const page = failedPageAttempt(run.totalAttemptsUsed, opportunity, production);
      run.pages.push(page);
      await dependencies.runStore?.finishPageAttempt(run, page);
      continue;
    }

    const uniqueness = await validateContentUniquenessBeforePublish(production.package, livePageContent, dependencies);
    if (uniqueness.status === "failed") {
      const page = failedPageAttempt(run.totalAttemptsUsed, opportunity, {
        status: "failed",
        failedStage: "content-uniqueness",
        failureReason: uniqueness.failureReason,
        repairAttemptsUsed: PAGE_PRODUCTION_OPTIONS.repairAttempts,
        recommendedFix: "Rewrite the page from its own research so body sections, decision content, mistakes, troubleshooting, superiority component, and CTA are distinct from prior live batch pages.",
        retryable: true,
        artifacts: production.package.artifacts
      });
      run.pages.push(page);
      await dependencies.runStore?.finishPageAttempt(run, page);
      continue;
    }

    const publish = await dependencies.publisher.publish(production.package);
    const page = publishedPageAttempt(run.totalAttemptsUsed, opportunity, production, publish);
    run.pages.push(page);
    if (publish.status === "live") {
      run.liveCount += 1;
      if (uniqueness.content) {
        livePageContent.push(uniqueness.content);
        await dependencies.contentUniqueness?.recordLivePageContent?.(production.package, uniqueness.content, run);
      }
    }
    await dependencies.runStore?.finishPageAttempt(run, page);
  }

  run.status = run.liveCount === run.targetLiveCount
    ? "complete"
    : "partial_complete_attempt_limit_reached";
  await completeRun(run, input, dependencies);

  return run;
}

async function loadHistoricalPageContent(
  clusterSelection: BatchLiveClusterSelection,
  dependencies: BatchLiveDependencies
): Promise<PageContentForUniqueness[]> {
  if (!dependencies.contentUniqueness?.loadHistoricalPageContent) {
    return [];
  }
  return dependencies.contentUniqueness.loadHistoricalPageContent(clusterSelection);
}

async function completeRun(
  run: BatchLiveRun,
  input: RunBatchLiveInput,
  dependencies: BatchLiveDependencies
): Promise<void> {
  await dependencies.runStore?.completeRun(run);
  if (dependencies.completionNotifier) {
    const packet = renderBatchLiveCompletionEmail(run, { to: input.completionEmailTo });
    await dependencies.completionNotifier.sendCompletionEmail(packet, run);
  }
}

async function validateContentUniquenessBeforePublish(
  page: PageProductionPackage,
  livePageContent: PageContentForUniqueness[],
  dependencies: BatchLiveDependencies
): Promise<{ status: "passed"; content?: PageContentForUniqueness } | { status: "failed"; failureReason: string }> {
  if (!dependencies.contentUniqueness) {
    return { status: "passed" };
  }

  try {
    const content = await dependencies.contentUniqueness.loadPageContent(page);
    const result = validateBatchContentUniqueness(
      [...livePageContent, content],
      PAGE_PRODUCTION_OPTIONS.contentUniqueness
    );
    if (result.status === "failed") {
      return {
        status: "failed",
        failureReason: result.blockingIssues.join(" ")
      };
    }
    return { status: "passed", content };
  } catch (error) {
    return {
      status: "failed",
      failureReason: `Unable to validate batch content uniqueness before publish: ${error instanceof Error ? error.message : String(error)}`
    };
  }
}

async function resolveClusterSelection(
  input: RunBatchLiveInput,
  dependencies: BatchLiveDependencies
): Promise<BatchLiveClusterSelection> {
  if (input.clusterSlug) {
    return {
      mode: "provided",
      clusterSlug: input.clusterSlug,
      source: "cli_argument",
      rationale: "Cluster slug was provided by the caller."
    };
  }

  if (!dependencies.clusterPlanner) {
    throw new Error("clusterPlanner is required when clusterSlug is not provided.");
  }

  return dependencies.clusterPlanner.identifyCluster(input);
}

function failedPageAttempt(
  attemptNumber: number,
  opportunity: BatchLiveOpportunity,
  result: Extract<PageProductionResult, { status: "failed" }>
): BatchLivePageAttempt {
  return {
    attemptNumber,
    opportunityId: opportunity.id,
    status: "failed_after_3_repairs",
    pageTitle: opportunity.pageTitle,
    slug: opportunity.slug,
    confidence: opportunity.confidence,
    artifacts: result.artifacts ?? {},
    repairAttemptsUsed: result.repairAttemptsUsed,
    failedStage: result.failedStage,
    failureReason: result.failureReason,
    recommendedFix: result.recommendedFix,
    retryable: result.retryable
  };
}

function publishedPageAttempt(
  attemptNumber: number,
  opportunity: BatchLiveOpportunity,
  production: Extract<PageProductionResult, { status: "ready" }>,
  publish: PublishResult
): BatchLivePageAttempt {
  const base = {
    attemptNumber,
    opportunityId: opportunity.id,
    pageTitle: production.package.pageTitle,
    slug: production.package.slug,
    confidence: opportunity.confidence,
    artifacts: production.package.artifacts,
    repairAttemptsUsed: production.repairAttemptsUsed
  };

  if (publish.status === "live") {
    return {
      ...base,
      status: "live",
      commitSha: publish.commitSha,
      productionUrl: publish.productionUrl,
      httpStatus: publish.httpStatus
    };
  }

  return {
    ...base,
    status: publish.status,
    commitSha: publish.commitSha,
    productionUrl: publish.productionUrl,
    httpStatus: publish.httpStatus,
    failedStage: publish.failedStage,
    failureReason: publish.failureReason,
    recommendedFix: publish.recommendedFix,
    retryable: publish.retryable
  };
}
