import type {
  CategoryDiscoveryTemplateInput,
  CategoryDiscoveryTemplates,
  CategoryDiscoveryVerdict,
  SourceAttempt
} from "./types.js";

const failingVerdict: CategoryDiscoveryVerdict = {
  status: "fail",
  action: "repair_category_discovery",
  warnings: [],
  blockers: ["Artifact template has not been filled with evidence."],
  repairAttemptsUsed: 0,
  reason: "Template requires live evidence and LLM/user completion before validation can pass."
};

export function createCategoryDiscoveryTemplates(input: CategoryDiscoveryTemplateInput): CategoryDiscoveryTemplates {
  const sourceAttemptLog = buildSourceAttemptLog(input);
  const common = {
    runId: input.runId,
    createdAt: input.createdAt
  };

  return {
    seedUniverse: {
      schemaVersion: "category-seed-universe-contract.v1",
      artifactType: "seed_universe_contract",
      ...common,
      inputProvenance: {
        originalUserInput: null,
        business: input.business ?? "",
        company: input.company ?? "",
        market: input.market ?? "",
        seeds: input.seeds,
        sites: input.sites,
        competitors: input.competitors,
        references: input.references,
        imports: input.imports
      },
      mode: input.mode ?? "batch_growth",
      modeDetectionReason: "",
      candidateSeedUniverses: [],
      selectedSeedUniverse: "",
      rejectedSeedUniverses: [],
      seedUniverseScorecard: {},
      evidenceBasis: [],
      seedUniverseBoundaries: { included: [], excluded: [] },
      seedUniverseSummaryStatement: "",
      sourceAttemptLog,
      completenessChecklist: {},
      verdict: failingVerdict,
      fieldGuidance: {
        selectedSeedUniverse: "Fill with the broad business/search universe, not the final SEO cluster.",
        evidenceBasis: "Add evidence refs from business/site/search/audience/competitor surfaces."
      }
    },
    clusterPortfolio: {
      schemaVersion: "category-cluster-portfolio-discovery.v1",
      artifactType: "cluster_portfolio_discovery",
      ...common,
      selectedSeedUniverse: "",
      candidateClusters: [],
      selectedClusterCandidate: null,
      rejectedCandidateRoutes: [],
      modeAdjustedScoreWeights: {},
      rawDiscoveryMappings: [],
      sourceRegistry: [],
      sourceAttemptLog,
      portfolioSummaryStatement: "",
      completenessChecklist: {},
      verdict: failingVerdict,
      fieldGuidance: {
        candidateClusters: "Create 5-10 SEO cluster category candidates from live evidence.",
        rawDiscoveryMappings: "Map messy phrases or source discoveries to normalized candidates."
      }
    },
    clusterBoundary: {
      schemaVersion: "category-cluster-boundary-contract.v1",
      artifactType: "cluster_boundary_contract",
      ...common,
      selectedClusterCategory: "",
      parentCategory: "",
      clusterType: "",
      clusterSearchProblem: "",
      sharedAudience: "",
      clusterPositioningStatement: "",
      includedSubareas: [],
      excludedSubareas: [],
      adjacentClusters: [],
      subclusterSignals: [],
      pageOpportunitySignals: [],
      needsStep0BDecision: [],
      clusterContentPromises: [],
      antiPromises: [],
      namingConfidence: "low",
      namingChecks: {},
      nameRejectedAlternatives: [],
      clusterViabilityStatement: "",
      batchSuitability: {
        suitableForBatch: false,
        maxConfidentPageCount: 0,
        reason: ""
      },
      siteEvidenceSummary: {
        evidenceRefs: [],
        businessSiteFitReason: "",
        cannibalizationRoute: ""
      },
      cannibalizationCheck: {},
      originalityCheck: {},
      selectionConfidence: "low",
      confidenceReasons: [],
      confidenceLimits: [],
      categoryDiscoverySummaryStatement: "",
      mustCarryForward: {},
      categoryDiscoveryOutputMustNotContain: [],
      completenessChecklist: {},
      verdict: failingVerdict,
      fieldGuidance: {
        selectedClusterCategory: "Fill with a noun-phrase SEO cluster category such as acne scar treatment.",
        clusterSearchProblem: "Explain the shared human problem across the cluster."
      }
    }
  };
}

function buildSourceAttemptLog(input: CategoryDiscoveryTemplateInput): SourceAttempt[] {
  return [
    ...input.sites.map((site) => ({
      sourceSurface: site,
      sourceRole: "site_inventory" as const,
      attemptedAt: input.createdAt,
      accessStatus: "available" as const,
      reason: "Registered site evidence input for adapter review.",
      absenceImpact: "none" as const
    })),
    ...input.competitors.map((competitor) => ({
      sourceSurface: competitor,
      sourceRole: "serp_competitor" as const,
      attemptedAt: input.createdAt,
      accessStatus: "available" as const,
      reason: "Registered competitor evidence input for adapter review.",
      absenceImpact: "none" as const
    })),
    ...input.references.map((reference) => ({
      sourceSurface: reference,
      sourceRole: "category_leader" as const,
      attemptedAt: input.createdAt,
      accessStatus: "available" as const,
      reason: "Registered reference/category leader input for adapter review.",
      absenceImpact: "none" as const
    })),
    ...input.imports.searchConsole.map((filePath) => ({
      sourceSurface: filePath,
      sourceRole: "search_console" as const,
      attemptedAt: input.createdAt,
      accessStatus: "available" as const,
      reason: "Registered Search Console export for adapter review.",
      absenceImpact: "none" as const
    })),
    ...input.imports.keywords.map((filePath) => ({
      sourceSurface: filePath,
      sourceRole: "keyword_tool" as const,
      attemptedAt: input.createdAt,
      accessStatus: "available" as const,
      reason: "Registered keyword export for adapter review.",
      absenceImpact: "none" as const
    })),
    ...input.imports.siteInventory.map((filePath) => ({
      sourceSurface: filePath,
      sourceRole: "site_inventory" as const,
      attemptedAt: input.createdAt,
      accessStatus: "available" as const,
      reason: "Registered site inventory export for adapter review.",
      absenceImpact: "none" as const
    }))
  ];
}
