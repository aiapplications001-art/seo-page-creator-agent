export const CATEGORY_DISCOVERY_SCHEMA_VERSION = "category-discovery.v1";

export const CATEGORY_DISCOVERY_ARTIFACTS = {
  seedUniverse: "seed-universe-contract.json",
  clusterPortfolio: "cluster-portfolio-discovery.json",
  clusterBoundary: "cluster-boundary-contract.json",
  validation: "category-discovery-validation.json",
  lock: "category-discovery.lock.json"
} as const;

export type CategoryDiscoveryMode =
  | "batch_growth"
  | "authority_building"
  | "conversion_support"
  | "refresh_existing"
  | "market_entry";

export type VerdictStatus = "pass" | "pass_with_warnings" | "fail" | "ask_user";
export type SelectionConfidence = "low" | "medium" | "high";

export type SourceRole =
  | "business_profile"
  | "site_inventory"
  | "conversion_destination"
  | "search_demand"
  | "serp_competitor"
  | "competitor_sitemap"
  | "category_leader"
  | "audience_language"
  | "paa"
  | "autocomplete"
  | "related_search"
  | "video_signal"
  | "forum_signal"
  | "search_console"
  | "keyword_tool"
  | "internal_site_search";

export type ClusterType =
  | "condition_or_problem"
  | "product_or_solution"
  | "audience_or_segment"
  | "routine_or_process"
  | "comparison_or_alternative"
  | "location_or_market"
  | "use_case_or_situation"
  | "ingredient_or_component"
  | "myth_or_misconception"
  | "tool_or_template"
  | "service_or_conversion";

export type OpportunityRoute =
  | "ready_for_step0B"
  | "needs_more_discovery_before_step0B"
  | "needs_step0B_scope_decision"
  | "future_cluster"
  | "adjacent_cluster"
  | "too_narrow_page_opportunity"
  | "rejected";

export interface CategoryDiscoveryVerdict {
  status: VerdictStatus;
  action: string;
  warnings: string[];
  blockers: string[];
  repairAttemptsUsed: number;
  reason: string;
}

export interface SourceAttempt {
  sourceSurface: string;
  sourceRole: SourceRole;
  attemptedAt: string;
  accessStatus: "available" | "unavailable" | "not_applicable";
  reason: string;
  absenceImpact: "none" | "warning" | "blocker";
}

export interface CategorySourceRef {
  sourceRef: string;
  sourceRole: SourceRole;
  title?: string;
  url?: string;
  sourceUseReason?: string;
}

export interface RawToNormalizedEvidence {
  rawDiscovery: string;
  sourceRef: string;
  normalizedTo: string;
  normalizationReason: string;
}

export interface LightweightOpportunityProof {
  opportunityName: string;
  distinctSearchProblem: string;
  distinctnessReason: string;
  evidenceRefs: string[];
  rawToNormalizedEvidence: RawToNormalizedEvidence[];
  route: OpportunityRoute;
  pageTypeHint?: string;
}

export interface CategoryDiscoveryTemplateInput {
  runId: string;
  createdAt: string;
  business?: string;
  company?: string;
  market?: string;
  mode?: CategoryDiscoveryMode;
  seeds: string[];
  sites: string[];
  competitors: string[];
  references: string[];
  imports: {
    searchConsole: string[];
    keywords: string[];
    siteInventory: string[];
  };
}

export interface CategoryDiscoveryTemplates {
  seedUniverse: Record<string, unknown> & { verdict: CategoryDiscoveryVerdict };
  clusterPortfolio: Record<string, unknown> & { verdict: CategoryDiscoveryVerdict };
  clusterBoundary: Record<string, unknown> & { verdict: CategoryDiscoveryVerdict };
}
