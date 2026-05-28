import type { ClusterStrategy, EvidenceStrength, PageOpportunity } from "./cluster-strategy.js";

export interface GeneratePreWritingStrategyInput {
  clusterStrategy: ClusterStrategy;
  selectedPageId: string;
  audienceCohort: string;
  selectedTone?: string;
  contentDepthTarget?: string;
  primaryKeyword?: string;
  secondaryKeywords?: string[];
}

export interface PreWritingSection {
  id: string;
  purpose: string;
  contentRole: "conversion" | "seo" | "trust" | "ux" | "reference";
  notes: string;
}

export interface PreWritingStrategy {
  companyName: string;
  market: string;
  category: ClusterStrategy["category"];
  selectedPage: PageOpportunity;
  audience: {
    cohort: string;
    market: string;
  };
  tone: {
    selected?: string;
    requiresUserSelection: boolean;
    options: string[];
  };
  keywords: {
    primary?: string;
    secondary: string[];
    clusterSeeds: string[];
  };
  contentDepth: {
    targetRange: string;
    strict: false;
  };
  cta: {
    primaryGoal: string;
    recommendedDestination?: string;
    firstFoldRequired: true;
    mobileSticky: {
      recommended: boolean;
      shortenedLabelRequired: boolean;
    };
  };
  pageStructure: {
    h1Rule: "exactly_one";
    sections: PreWritingSection[];
  };
  referenceRequirements: {
    liveSerpReviewRequired: true;
    quoteReferenceUrlsRequired: true;
    externalLinksOpenInNewTab: true;
    notes: string[];
  };
  imageRequirements: {
    defaultGeneratedImageCount: "3-5";
    ogImageRequired: true;
    brandGuidelineRequired: true;
    notes: string[];
  };
  approvalQueues: {
    structure: ApprovalItem[];
    content: ApprovalItem[];
    images: ApprovalItem[];
    critical: ApprovalItem[];
  };
  evidenceNotes: Array<{
    pointer: string;
    evidenceStrength: EvidenceStrength;
    source: "cluster_strategy" | "user_input" | "agent_inference";
  }>;
  machineMetadata: {
    schemaVersion: "prewriting-strategy.v1";
    generatedFrom: "cluster-strategy.v1";
    selectedPageId: string;
  };
}

export interface ApprovalItem {
  item: string;
  reason: string;
  risk: "low" | "medium" | "high" | "critical";
}

export function generatePreWritingStrategy(input: GeneratePreWritingStrategyInput): PreWritingStrategy {
  const selectedPage = input.clusterStrategy.pageOpportunities.find((page) => page.id === input.selectedPageId);
  if (!selectedPage) {
    throw new Error(`Selected page ${input.selectedPageId} was not found in the cluster strategy.`);
  }

  const toneOptions = suggestToneOptions(selectedPage);
  const recommendedDestination = selectedPage.sourceUrl ?? firstDestination(input.clusterStrategy);
  const contentDepthTarget = input.contentDepthTarget ?? defaultDepthForPage(selectedPage);

  return {
    companyName: input.clusterStrategy.companyName,
    market: input.clusterStrategy.market,
    category: input.clusterStrategy.category,
    selectedPage,
    audience: {
      cohort: input.audienceCohort,
      market: input.clusterStrategy.market
    },
    tone: {
      selected: input.selectedTone,
      requiresUserSelection: !input.selectedTone,
      options: toneOptions
    },
    keywords: {
      primary: input.primaryKeyword,
      secondary: input.secondaryKeywords ?? [],
      clusterSeeds: input.clusterStrategy.sourceMetadata.seedKeywords
    },
    contentDepth: {
      targetRange: contentDepthTarget,
      strict: false
    },
    cta: {
      primaryGoal: selectedPage.primaryCtaGoal,
      recommendedDestination,
      firstFoldRequired: true,
      mobileSticky: {
        recommended: true,
        shortenedLabelRequired: true
      }
    },
    pageStructure: {
      h1Rule: "exactly_one",
      sections: buildSections(selectedPage)
    },
    referenceRequirements: {
      liveSerpReviewRequired: true,
      quoteReferenceUrlsRequired: true,
      externalLinksOpenInNewTab: true,
      notes: [
        "Review top live search results before finalizing page structure.",
        "Use cited source URLs for claims and reference notes.",
        "Do not copy competitor wording."
      ]
    },
    imageRequirements: {
      defaultGeneratedImageCount: "3-5",
      ogImageRequired: true,
      brandGuidelineRequired: true,
      notes: [
        "Generate top 3-5 high-impact in-page images when possible.",
        "Include a separate OG image asset.",
        "Use image briefs only when generation is unavailable or time-bounded by the user."
      ]
    },
    approvalQueues: buildApprovalQueues(selectedPage),
    evidenceNotes: buildEvidenceNotes(input.clusterStrategy, selectedPage, input.audienceCohort),
    machineMetadata: {
      schemaVersion: "prewriting-strategy.v1",
      generatedFrom: "cluster-strategy.v1",
      selectedPageId: selectedPage.id
    }
  };
}

function suggestToneOptions(page: PageOpportunity): string[] {
  if (page.pageType === "comparison") {
    return ["balanced evaluator", "professional compact", "decision-supportive"];
  }
  if (page.pageType === "guide_blog") {
    return ["story-led explainer", "professional compact", "empathetic educational"];
  }
  return ["professional compact", "clear advisory", "conversion-supportive"];
}

function defaultDepthForPage(page: PageOpportunity): string {
  if (page.pageType === "product_category") return "1800-2400 words";
  if (page.pageType === "comparison") return "1200-1800 words";
  return "1500-2200 words";
}

function buildSections(page: PageOpportunity): PreWritingSection[] {
  const comparisonNote = page.pageType === "comparison"
    ? "Include a concise comparison methodology and qualitative labels unless numeric scoring is explicitly requested."
    : "State the user problem, page promise, and primary CTA in the first fold.";

  return [
    {
      id: "S1_hero",
      purpose: "First-fold answer, H1, primary CTA, and surrounding CTA microcopy.",
      contentRole: "conversion",
      notes: "Primary actionable must be visible in the first fold on desktop and mobile."
    },
    {
      id: "S2_quick_answer",
      purpose: "Short answer optimized for humans and AI overview style retrieval.",
      contentRole: "seo",
      notes: "Answer the page intent directly before expanding details."
    },
    {
      id: "S3_context",
      purpose: "Explain the problem, audience context, and why the page exists.",
      contentRole: "ux",
      notes: "Keep this aligned to the selected audience cohort."
    },
    {
      id: "S4_main_content",
      purpose: "Main educational or category explanation.",
      contentRole: "seo",
      notes: comparisonNote
    },
    {
      id: "S5_decision_support",
      purpose: "Comparison table, decision criteria, checklist, or user path.",
      contentRole: "ux",
      notes: "Use qualitative labels by default."
    },
    {
      id: "S6_product_or_solution_block",
      purpose: "Connect the user's problem to the relevant internal destination.",
      contentRole: "conversion",
      notes: "Preserve the recommended CTA destination unless the editor changes it."
    },
    {
      id: "S7_trust_proof",
      purpose: "Author, reviewer, methodology, experience, proof, and brand trust signals.",
      contentRole: "trust",
      notes: "Include authored-by visibility and page creation or update date."
    },
    {
      id: "S8_faq",
      purpose: "Answer likely questions and support FAQ JSON-LD only when FAQ content exists.",
      contentRole: "seo",
      notes: "Include FAQ schema draft when this section is present."
    },
    {
      id: "S9_final_cta",
      purpose: "Final primary CTA and conversion-oriented closing copy.",
      contentRole: "conversion",
      notes: "Use one primary CTA variant in V1."
    },
    {
      id: "S10_references",
      purpose: "Reference URLs and source metadata used for page claims.",
      contentRole: "reference",
      notes: "Only URL/source metadata belongs here."
    }
  ];
}

function buildApprovalQueues(page: PageOpportunity): PreWritingStrategy["approvalQueues"] {
  const critical: ApprovalItem[] = [];
  if (page.pageType === "comparison" || page.strategyCategory === "competitor_category") {
    critical.push({
      item: "Competitor or external brand mentions",
      reason: "Comparison pages may mention competitors or external products and require explicit approval before inclusion.",
      risk: "critical"
    });
  }

  return {
    structure: [
      {
        item: "Selected section order",
        reason: "Standard V1 section order is proposed before full copy is drafted.",
        risk: "low"
      }
    ],
    content: [
      {
        item: "Tone and content depth",
        reason: "The user should choose tone per page and content depth is treated as a target range.",
        risk: "medium"
      }
    ],
    images: [
      {
        item: "Brand-led generated images",
        reason: "Images should follow brand guidelines and include logo/brand signals only when appropriate.",
        risk: "medium"
      }
    ],
    critical
  };
}

function buildEvidenceNotes(
  cluster: ClusterStrategy,
  page: PageOpportunity,
  audienceCohort: string
): PreWritingStrategy["evidenceNotes"] {
  return [
    {
      pointer: `Selected page ${page.id} came from cluster opportunity ${page.strategyCategory}.`,
      evidenceStrength: page.evidenceStrength,
      source: "cluster_strategy"
    },
    {
      pointer: `Audience cohort supplied: ${audienceCohort}.`,
      evidenceStrength: "high",
      source: "user_input"
    },
    {
      pointer: `Cluster quality score at strategy time was ${cluster.qualityScore.score}/100.`,
      evidenceStrength: "medium",
      source: "cluster_strategy"
    }
  ];
}

function firstDestination(cluster: ClusterStrategy): string | undefined {
  return cluster.existingUrlCandidates.find((candidate) => (
    candidate.pageType === "product_category" || candidate.pageType === "product"
  ))?.url;
}
