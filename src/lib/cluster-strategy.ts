import type { PageMetadata } from "./metadata.js";
import type { PageType } from "./url-classifier.js";

export type StrategyCategory =
  | "first_organic_wins"
  | "highest_conversion"
  | "startup_conversion"
  | "low_competition"
  | "high_competition"
  | "competitor_category";

export type EvidenceStrength = "low" | "medium" | "high";

export interface GenerateClusterStrategyInput {
  companyName: string;
  categoryName: string;
  market: string;
  metadata: PageMetadata[];
  seedKeywords?: string[];
}

export interface ExistingUrlCandidate {
  url: string;
  pageType: PageType;
  title?: string;
  h1?: string;
  evidenceStrength: EvidenceStrength;
  matchReason: string;
}

export interface PageOpportunity {
  id: string;
  title: string;
  pageType: Extract<PageType, "product_category" | "guide_blog" | "comparison">;
  strategyCategory: StrategyCategory;
  targetIntent: string;
  primaryCtaGoal: string;
  suggestedUrlSlug: string;
  sourceUrl?: string;
  evidenceStrength: EvidenceStrength;
}

export interface InternalLinkSuggestion {
  sourceUrl: string;
  destinationUrl: string;
  placement: "header" | "body" | "breadcrumb" | "faq";
  anchorText: string;
  reason: string;
}

export interface ClusterQualityIssue {
  area: string;
  issue: string;
  likelyImpact: "seo" | "conversion" | "seo_and_conversion";
  priority: "low" | "medium" | "high";
}

export interface ClusterStrategy {
  companyName: string;
  market: string;
  category: {
    name: string;
    slug: string;
  };
  sourceMetadata: {
    urlsConsidered: number;
    urlsMatched: number;
    seedKeywords: string[];
  };
  existingUrlCandidates: ExistingUrlCandidate[];
  pageOpportunities: PageOpportunity[];
  internalLinkSuggestions: InternalLinkSuggestion[];
  qualityScore: {
    score: number;
    advisoryOnly: true;
    topIssues: ClusterQualityIssue[];
  };
  assumptions: Array<{
    statement: string;
    evidenceStrength: EvidenceStrength;
    source: "metadata" | "seed_keywords" | "agent_inference";
  }>;
  nextPageSelection: {
    instruction: string;
    recommendedPageId: string;
  };
}

export function generateClusterStrategy(input: GenerateClusterStrategyInput): ClusterStrategy {
  const categorySlug = slugify(input.categoryName);
  const seedKeywords = input.seedKeywords ?? [];
  const matched = input.metadata
    .filter((page) => pageMatchesCategory(page, input.categoryName, seedKeywords))
    .slice(0, 12);
  const existingUrlCandidates = matched.map(toExistingUrlCandidate);
  const primaryCategoryUrl = matched.find((page) => page.pageType === "product_category" || page.pageType === "product")?.url;
  const pageOpportunities = buildPageOpportunities(input, matched);
  const internalLinkSuggestions = buildInternalLinks(matched, primaryCategoryUrl, input.categoryName);
  const topIssues = buildQualityIssues(matched, pageOpportunities);
  const score = scoreCluster(matched, pageOpportunities, internalLinkSuggestions, topIssues);
  const assumptions = buildAssumptions(input, matched);

  return {
    companyName: input.companyName,
    market: input.market,
    category: {
      name: input.categoryName,
      slug: categorySlug
    },
    sourceMetadata: {
      urlsConsidered: input.metadata.length,
      urlsMatched: matched.length,
      seedKeywords
    },
    existingUrlCandidates,
    pageOpportunities,
    internalLinkSuggestions,
    qualityScore: {
      score,
      advisoryOnly: true,
      topIssues
    },
    assumptions,
    nextPageSelection: {
      instruction: "User should select one page opportunity to generate next. V1 generates one publish-ready page packet at a time.",
      recommendedPageId: pageOpportunities[0]?.id ?? "P1"
    }
  };
}

export function slugify(value: string): string {
  return value
    .toLowerCase()
    .replace(/&/g, " and ")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .replace(/-{2,}/g, "-");
}

function pageMatchesCategory(page: PageMetadata, categoryName: string, seedKeywords: string[]): boolean {
  const terms = [categoryName, ...seedKeywords].map(normalizeSearchTerm).filter(Boolean);
  const categoryTokens = normalizeSearchTerm(categoryName).split(/\s+/).filter((token) => token.length >= 4);
  const haystack = normalizeSearchTerm([
    page.url,
    page.title ?? "",
    page.metaDescription ?? "",
    page.h1 ?? "",
    ...page.h2s
  ].join(" "));

  return terms.some((term) => term.length >= 3 && haystack.includes(term))
    || categoryTokens.some((token) => haystack.includes(token));
}

function toExistingUrlCandidate(page: PageMetadata): ExistingUrlCandidate {
  return {
    url: page.canonical ?? page.url,
    pageType: page.pageType,
    title: page.title,
    h1: page.h1,
    evidenceStrength: page.title && page.h1 ? "high" : "medium",
    matchReason: "URL and metadata matched the selected product/category cluster."
  };
}

function buildPageOpportunities(input: GenerateClusterStrategyInput, matched: PageMetadata[]): PageOpportunity[] {
  const categorySlug = slugify(input.categoryName);
  const categoryPage = matched.find((page) => page.pageType === "product_category" || page.pageType === "product");
  const guidePage = matched.find((page) => page.pageType === "guide_blog");
  const comparisonPage = matched.find((page) => page.pageType === "comparison");
  const hasEvidence = matched.length > 0;

  return [
    {
      id: "P1",
      title: `${input.categoryName} Category Page`,
      pageType: "product_category",
      strategyCategory: categoryPage ? "highest_conversion" : "startup_conversion",
      targetIntent: "Help users understand the category and route them toward the best product or diagnostic action.",
      primaryCtaGoal: "Route users to the category's primary product or action destination.",
      suggestedUrlSlug: categorySlug,
      sourceUrl: categoryPage?.canonical ?? categoryPage?.url,
      evidenceStrength: categoryPage ? "high" : "low"
    },
    {
      id: "P2",
      title: `${input.categoryName} Guide`,
      pageType: "guide_blog",
      strategyCategory: guidePage ? "first_organic_wins" : longTailSeedExists(input.seedKeywords ?? []) ? "low_competition" : "first_organic_wins",
      targetIntent: "Capture informational and long-tail search demand before moving readers to the main category experience.",
      primaryCtaGoal: "Route readers to a relevant category page, diagnostic flow, or deeper guide.",
      suggestedUrlSlug: `${categorySlug}-guide`,
      sourceUrl: guidePage?.canonical ?? guidePage?.url,
      evidenceStrength: guidePage ? "high" : "medium"
    },
    {
      id: "P3",
      title: `${input.categoryName} Comparison Page`,
      pageType: "comparison",
      strategyCategory: comparisonPage ? "competitor_category" : "high_competition",
      targetIntent: "Support users comparing alternatives, formats, or brands before they choose a solution.",
      primaryCtaGoal: "Route high-intent comparison traffic to the best internal product/category destination.",
      suggestedUrlSlug: `${categorySlug}-comparison`,
      sourceUrl: comparisonPage?.canonical ?? comparisonPage?.url,
      evidenceStrength: comparisonPage ? "high" : hasEvidence ? "medium" : "low"
    }
  ];
}

function buildInternalLinks(
  matched: PageMetadata[],
  destinationUrl: string | undefined,
  categoryName: string
): InternalLinkSuggestion[] {
  if (!destinationUrl) return [];

  return matched
    .filter((page) => (page.canonical ?? page.url) !== destinationUrl)
    .slice(0, 8)
    .map((page) => ({
      sourceUrl: page.canonical ?? page.url,
      destinationUrl,
      placement: page.pageType === "comparison" ? "body" : "header",
      anchorText: categoryName,
      reason: "Cross-link supporting cluster pages back to the primary product/category destination."
    }));
}

function buildQualityIssues(matched: PageMetadata[], opportunities: PageOpportunity[]): ClusterQualityIssue[] {
  const issues: ClusterQualityIssue[] = [];
  const hasFaqSchema = matched.some((page) => page.schemaTypes.includes("FAQPage"));
  const hasCategoryPage = opportunities.some((page) => page.pageType === "product_category" && page.sourceUrl);
  const hasGuidePage = opportunities.some((page) => page.pageType === "guide_blog" && page.sourceUrl);
  const hasComparisonPage = opportunities.some((page) => page.pageType === "comparison" && page.sourceUrl);

  if (!hasCategoryPage) {
    issues.push({
      area: "Primary category page",
      issue: "No existing product/category destination was found for this cluster.",
      likelyImpact: "seo_and_conversion",
      priority: "high"
    });
  }
  if (!hasGuidePage) {
    issues.push({
      area: "Long-tail guide coverage",
      issue: "No existing guide page was found for the category.",
      likelyImpact: "seo",
      priority: "medium"
    });
  }
  if (!hasComparisonPage) {
    issues.push({
      area: "Comparison coverage",
      issue: "No existing comparison page was found for high-intent alternatives.",
      likelyImpact: "seo_and_conversion",
      priority: "medium"
    });
  }
  if (!hasFaqSchema) {
    issues.push({
      area: "FAQ schema",
      issue: "No FAQPage schema was detected in the matched URLs.",
      likelyImpact: "seo",
      priority: "medium"
    });
  } else {
    issues.push({
      area: "FAQ schema",
      issue: "FAQ schema exists in the cluster, but should be checked for the selected page packet only when FAQ content is present.",
      likelyImpact: "seo",
      priority: "low"
    });
  }

  return issues.slice(0, 10);
}

function scoreCluster(
  matched: PageMetadata[],
  opportunities: PageOpportunity[],
  internalLinks: InternalLinkSuggestion[],
  issues: ClusterQualityIssue[]
): number {
  let score = 53;
  score += Math.min(matched.length, 4) * 6;
  score += opportunities.filter((page) => Boolean(page.sourceUrl)).length * 3;
  score += internalLinks.length > 0 ? 3 : 0;
  score -= issues.filter((issue) => issue.priority === "high").length * 8;
  score -= issues.filter((issue) => issue.priority === "medium").length * 4;
  score -= issues.filter((issue) => issue.priority === "low").length;
  return Math.max(0, Math.min(100, score));
}

function buildAssumptions(input: GenerateClusterStrategyInput, matched: PageMetadata[]): ClusterStrategy["assumptions"] {
  if (matched.length === 0) {
    return [
      {
        statement: `No existing URL clearly matched ${input.categoryName}; the first strategy draft should be treated as a startup cluster.`,
        evidenceStrength: "low",
        source: "agent_inference"
      }
    ];
  }

  return [
    {
      statement: `${input.categoryName} has enough site-inventory evidence to draft a cluster strategy before generating page packets.`,
      evidenceStrength: matched.length >= 3 ? "high" : "medium",
      source: "metadata"
    },
    {
      statement: `The selected target market is ${input.market}.`,
      evidenceStrength: "high",
      source: "seed_keywords"
    }
  ];
}

function normalizeSearchTerm(value: string): string {
  return value.toLowerCase().replace(/[^a-z0-9]+/g, " ").trim();
}

function longTailSeedExists(seedKeywords: string[]): boolean {
  return seedKeywords.some((keyword) => normalizeSearchTerm(keyword).split(/\s+/).length >= 3);
}
