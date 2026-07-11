import type { PageContentForUniqueness } from "../v2/content-uniqueness.js";

export type OpportunityConfidence = "strong" | "medium" | "exploratory";

export type BatchLiveReportConfidence = "high" | "medium" | "low";

export type BatchLiveRunStatus =
  | "running"
  | "complete"
  | "partial_complete_attempt_limit_reached"
  | "failed";

export type BatchLivePageStatus =
  | "live"
  | "failed_after_3_repairs"
  | "publish_failed"
  | "deploy_verification_failed";

export type BatchLiveClusterSelectionMode = "provided" | "auto_identified" | "created";

export interface BatchLiveClusterSelection {
  mode: BatchLiveClusterSelectionMode;
  clusterSlug: string;
  source: "cli_argument" | "existing_cluster_plan" | "new_cluster_plan";
  rationale: string;
}

export interface BatchLiveOpportunity {
  id: string;
  pageTitle: string;
  slug: string;
  confidence: OpportunityConfidence;
  searchIntent: string;
  evidence: string[];
  targetAudience: string;
  canonicalDecision: string;
  nonDuplicateReason: string;
}

export interface BatchLiveArtifacts {
  pagePacket?: string;
  qaReport?: string;
  imageManifest?: string;
  [key: string]: string | undefined;
}

export interface PageProductionPackage {
  opportunityId: string;
  pageTitle: string;
  slug: string;
  artifacts: BatchLiveArtifacts;
}

export type PageProductionResult =
  | {
      status: "ready";
      package: PageProductionPackage;
      repairAttemptsUsed: number;
    }
  | {
      status: "failed";
      failedStage: string;
      failureReason: string;
      repairAttemptsUsed: number;
      recommendedFix: string;
      retryable: boolean;
      artifacts?: BatchLiveArtifacts;
    };

export type PublishResult =
  | {
      status: "live";
      commitSha: string;
      productionUrl: string;
      httpStatus: 200;
    }
  | {
      status: "publish_failed" | "deploy_verification_failed";
      failedStage: string;
      failureReason: string;
      commitSha?: string;
      productionUrl?: string;
      httpStatus?: number;
      recommendedFix: string;
      retryable: boolean;
    };

export interface BatchLivePageAttempt {
  attemptNumber: number;
  opportunityId: string;
  status: BatchLivePageStatus;
  pageTitle: string;
  slug: string;
  confidence: OpportunityConfidence;
  commitSha?: string;
  productionUrl?: string;
  httpStatus?: number;
  artifacts: BatchLiveArtifacts;
  repairAttemptsUsed: number;
  failedStage?: string;
  failureReason?: string;
  recommendedFix?: string;
  retryable?: boolean;
}

export interface BatchLiveRun {
  schemaVersion: "batch-live-run.v1";
  runId: string;
  clusterSlug: string;
  clusterSelection: BatchLiveClusterSelection;
  targetLiveCount: number;
  maxTotalAttempts: number;
  totalAttemptsUsed: number;
  liveCount: number;
  status: BatchLiveRunStatus;
  branch: "main";
  requiresCleanWorkingTree: true;
  repairAttemptsPerPage: 3;
  workflowMode: "serial_page_transaction";
  liveVerification: {
    mode: "http_200";
  };
  pages: BatchLivePageAttempt[];
}

export interface RunBatchLiveInput {
  clusterSlug?: string;
  runId: string;
  targetLiveCount: number;
  completionEmailTo?: string;
}

export interface BatchLiveQualitySummary {
  score: number;
  confidence: BatchLiveReportConfidence;
  liveRate: number;
  attemptEfficiency: number;
  averageLiveOpportunityConfidence: number;
  http200Rate: number;
  rationale: string[];
}

export interface BatchLiveCompletionEmailPacket {
  to?: string;
  subject: string;
  bodyMarkdown: string;
  summary: BatchLiveQualitySummary;
}

export interface PageProductionOptions {
  repairAttempts: 3;
  workflowMode: "serial_page_transaction";
  assetBatching: "current_page_only";
  copyBatching: "current_page_only";
  voice: "category-manager-with-editorial-empathy";
  keywordDiscovery: {
    prioritizeUnfocusedKeywords: true;
    prioritizeLongTailKeywords: true;
    rejectVolumeOnlySelection: true;
    requireSerpIntentMessinessAssessment: true;
    requireCompetitorThinnessAssessment: true;
    requireRedditForumVideoLanguage: true;
    requireUnderservedReason: true;
    requireStandoutAngle: true;
    minimumLongTailVariants: 5;
    minimumRelatedQuestions: 5;
    acceptedOpportunitySignals: Array<
      | "messy_serp_intent"
      | "thin_competitor_coverage"
      | "specific_reader_problem"
      | "reddit_forum_language"
      | "video_social_questions"
      | "comparison_or_alternative_intent"
      | "pricing_or_objection_intent"
      | "local_or_market_specific_modifier"
      | "diagnostic_or_how_to_modifier"
    >;
  };
  researchDepth: {
    serpMeaningfulSourcesMinimum: 10;
    socialVideoAttemptedAssetsMinimum: 7;
    socialVideoReviewedAssetsMinimum: 5;
    requireClaimSpecificCitations: true;
    requireInternalArtifactsBeforeCopy: true;
    prohibitFuturePageAssets: true;
    prohibitFuturePageCopy: true;
  };
  depthContract: {
    required: true;
    minimumScore: 85;
    minimumExtractedFacts: 40;
    minimumFactsPerSource: 3;
    minimumCompetitorSpecificityImprovements: 10;
    minimumAudienceSignals: 20;
    minimumInformationGainItems: 8;
    validateBeforeFinalCopy: true;
    validateBeforeImages: true;
    validateBeforePublish: true;
    repairRequiresNewResearch: true;
  };
  contentUniqueness: {
    prohibitSharedBodyTemplate: true;
    compareAgainstPriorBatchPages: true;
    compareAgainstHistoricalRuns: true;
    requireResearchDerivedStructure: true;
    requireDistinctPageStructure: true;
    requireDistinctSectionCopy: true;
    requireDistinctDecisionContent: true;
    requireDistinctMistakesTroubleshootingAndCta: true;
    maximumSharedBodySimilarity: number;
    maximumSharedStructureSimilarity: number;
    repeatedLongSectionLimit: number;
    validateBeforeCommit: true;
    validateBeforePublish: true;
  };
}

export interface BatchLiveDependencies {
  ensureCleanProjectState: (phase: "before_start" | "before_attempt") => Promise<void>;
  runStore?: BatchLiveRunStore;
  clusterPlanner?: {
    identifyCluster: (input: RunBatchLiveInput) => Promise<BatchLiveClusterSelection>;
  };
  opportunityEngine: {
    nextOpportunity: (run: BatchLiveRun) => Promise<BatchLiveOpportunity | null>;
  };
  pageWorker: {
    produce: (opportunity: BatchLiveOpportunity, options: PageProductionOptions) => Promise<PageProductionResult>;
  };
  publisher: {
    publish: (page: PageProductionPackage) => Promise<PublishResult>;
  };
  contentUniqueness?: {
    loadHistoricalPageContent?: (clusterSelection: BatchLiveClusterSelection) => Promise<PageContentForUniqueness[]>;
    loadPageContent: (page: PageProductionPackage) => Promise<PageContentForUniqueness>;
    recordLivePageContent?: (page: PageProductionPackage, content: PageContentForUniqueness, run: BatchLiveRun) => Promise<void>;
  };
  completionNotifier?: {
    sendCompletionEmail: (packet: BatchLiveCompletionEmailPacket, run: BatchLiveRun) => Promise<void>;
  };
}

export interface BatchLiveRunStore {
  initializeRun: (run: BatchLiveRun) => Promise<void>;
  beginPageAttempt: (run: BatchLiveRun, opportunity: BatchLiveOpportunity) => Promise<void>;
  finishPageAttempt: (run: BatchLiveRun, page: BatchLivePageAttempt) => Promise<void>;
  completeRun: (run: BatchLiveRun) => Promise<void>;
}

export type PublishPlaybookAdapter = "git_push_deploy" | "custom_script";

export interface PublishPlaybook {
  schemaVersion: "publish-playbook.v1";
  projectId: string;
  adapter: PublishPlaybookAdapter;
  repoPath: string;
  branch: "main";
  requiresCleanWorkingTree: true;
  contentIntegration: {
    mode: "project_existing_page_process";
    instructions: string;
  };
  validationCommands: string[];
  commit: {
    strategy: "one_commit_per_page";
    messageTemplate: string;
  };
  deploy: {
    trigger: "git_push" | "custom_script";
    pushAfterEachCommit: true;
  };
  liveVerification: {
    mode: "http_200";
    timeoutMinutes: number;
    retryEverySeconds: number;
  };
}
