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
  sectionIntent: string;
  evidenceNeeded: string[];
  requiredDevices: string[];
  evidenceBudget: {
    minimumFacts: number;
    minimumCitedClaims: number;
    minimumConcreteExamples: number;
  };
  optional?: boolean;
  notes: string;
}

export type PageStructureIntentPattern =
  | "product_category"
  | "comparison"
  | "alternatives"
  | "best_list"
  | "how_to"
  | "pricing"
  | "local"
  | "informational";

export type PageStructureVariant =
  | "category_solution"
  | "comparison_matrix"
  | "alternatives_evaluator"
  | "ranked_shortlist"
  | "step_by_step_guide"
  | "pricing_decision"
  | "local_service"
  | "educational_guide";

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
    intentPattern: PageStructureIntentPattern;
    structureVariant: PageStructureVariant;
    inference: {
      confidence: EvidenceStrength;
      signals: string[];
      notes: string;
    };
    researchBasis: string[];
    structureUniquenessRationale: string;
    mustDifferFromPages: string[];
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
  const pageStructure = buildPageStructure(selectedPage);

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
      ...pageStructure,
      h1Rule: "exactly_one",
      sections: pageStructure.sections
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

function buildPageStructure(page: PageOpportunity): Pick<PreWritingStrategy["pageStructure"], "intentPattern" | "structureVariant" | "inference" | "researchBasis" | "structureUniquenessRationale" | "mustDifferFromPages" | "sections"> {
  const inference = inferPageStructure(page);
  return {
    ...inference,
    researchBasis: [
      "selected page title, slug, target intent, page type, and strategy category",
      "live SERP, PAA, social/video, competitor-gap, and audience-language research must refine this before final copy"
    ],
    structureUniquenessRationale: `${inference.structureVariant} is the starting structure because the selected opportunity signals ${inference.intentPattern} intent. The adapter must revise the section sequence, decision tools, FAQs, troubleshooting blocks, tables, superiority components, and CTA placement when current-page research shows different sub-intents or gaps, and must not reuse a structure from another page, batch, or historical run.`,
    mustDifferFromPages: [],
    sections: sectionsForVariant(inference.structureVariant)
  };
}

function inferPageStructure(page: PageOpportunity): Pick<PreWritingStrategy["pageStructure"], "intentPattern" | "structureVariant" | "inference"> {
  const titleSlugText = normalizeIntentText([
    page.title,
    page.suggestedUrlSlug
  ].join(" "));
  const text = normalizeIntentText([
    page.title,
    page.suggestedUrlSlug,
    page.targetIntent,
    page.pageType,
    page.strategyCategory
  ].join(" "));

  const signals: string[] = [];
  const has = (label: string, patterns: RegExp[]): boolean => {
    const matched = patterns.some((pattern) => pattern.test(text));
    if (matched) signals.push(label);
    return matched;
  };
  const hasTitleSlugSignal = (label: string, patterns: RegExp[]): boolean => {
    const matched = patterns.some((pattern) => pattern.test(titleSlugText));
    if (matched) signals.push(label);
    return matched;
  };

  const pricing = has("pricing/cost language", [/\bpric(?:e|ing|es)\b/, /\bcosts?\b/, /\bfees?\b/, /\bcharges?\b/, /\bplans?\b/, /\bpackages?\b/, /\bworth it\b/]);
  const local = has("local/near-me language", [/\bnear me\b/, /\bnearby\b/, /\bin (?:delhi|mumbai|bangalore|bengaluru|pune|hyderabad|chennai|kolkata|gurgaon|gurugram|noida)\b/]);
  const alternatives = hasTitleSlugSignal("alternatives title/slug language", [/\balternatives?\b/])
    || has("alternatives language", [/\binstead of\b/, /\bsimilar to\b/, /\bsubstitutes?\b/]);
  const comparison = page.pageType === "comparison" || has("comparison language", [/\bvs\b/, /\bversus\b/, /\bcompare\b/, /\bcomparison\b/]);
  if (page.pageType === "comparison") signals.push("pageType=comparison");
  const bestList = hasTitleSlugSignal("best-list title/slug language", [/\bbest\b/, /\btop\b/, /\brecommended\b/, /\branked\b/, /\bshortlist\b/]);
  const howTo = has("how-to language", [/\bhow to\b/, /\bsteps?\b/, /\broutine\b/, /\bapply\b/, /\buse\b/, /\busing\b/, /\bprocess\b/]);

  if (pricing) return inferred("pricing", "pricing_decision", "high", signals, "Pricing and cost intent wins before guide, comparison, and best-list signals.");
  if (local) return inferred("local", "local_service", "high", signals, "Local intent wins when near-me, nearby, or supported city wording is present.");
  if (alternatives) return inferred("alternatives", "alternatives_evaluator", comparison ? "high" : "medium", signals, "Alternatives intent is treated as comparison-like but needs switching and fairness guidance.");
  if (comparison) return inferred("comparison", "comparison_matrix", page.pageType === "comparison" ? "high" : "medium", signals, "Comparison intent needs methodology, criteria, and tradeoff structure.");
  if (bestList) return inferred("best_list", "ranked_shortlist", "medium", signals, "Best-list intent needs ranking criteria and best-fit recommendations.");
  if (howTo) return inferred("how_to", "step_by_step_guide", "medium", signals, "How-to intent needs ordered steps, mistakes, and expected outcome guidance.");
  if (page.pageType === "product_category") return inferred("product_category", "category_solution", "high", ["pageType=product_category"], "Product/category pages need diagnosis, selection criteria, solution mapping, and conversion support.");
  return inferred("informational", "educational_guide", "medium", ["guide fallback"], "Informational guide fallback avoids assuming all guides are step-by-step tutorials.");
}

function inferred(
  intentPattern: PageStructureIntentPattern,
  structureVariant: PageStructureVariant,
  confidence: EvidenceStrength,
  signals: string[],
  notes: string
): Pick<PreWritingStrategy["pageStructure"], "intentPattern" | "structureVariant" | "inference"> {
  return {
    intentPattern,
    structureVariant,
    inference: {
      confidence,
      signals: unique(signals),
      notes
    }
  };
}

function sectionsForVariant(variant: PageStructureVariant): PreWritingSection[] {
  const templates: Record<PageStructureVariant, PreWritingSection[]> = {
    category_solution: [
      hero("State the category promise, reader problem, and primary CTA in the first fold."),
      quickAnswer("Give the category fit answer before expanding details."),
      section("S3_problem_diagnosis", "Explain the problem, audience context, and how readers should recognize fit.", "ux", "problem diagnosis", ["audience signal", "category symptom or trigger", "reader decision context"], ["diagnostic checklist", "reader-fit examples"], budget(3, 1, 2), "Tie the diagnosis to the selected audience cohort."),
      section("S4_selection_criteria", "Define practical buying or selection criteria for the category.", "seo", "selection criteria", ["criteria with rationale", "common tradeoffs", "category constraints"], ["criteria list", "decision table"], budget(4, 2, 1), "Make criteria specific enough to guide product/category choice."),
      section("S5_solution_mapping", "Map reader situations to the relevant internal solution path.", "conversion", "solution mapping", ["internal offer fit", "reader scenario", "CTA rationale"], ["scenario-to-solution map", "contextual CTA"], budget(3, 1, 2), "Connect the user's problem to the relevant internal destination."),
      section("S6_common_mistakes", "Show what readers often get wrong and how to avoid it.", "ux", "mistake prevention", ["common mistake", "better action", "consequence"], ["mistakes table", "not-right-for-you guidance"], budget(3, 1, 2), "Include not-right-for-you guidance so the page does not over-sell."),
      trustProof(),
      faq(),
      finalCta(),
      references()
    ],
    comparison_matrix: [
      hero("State the comparison promise and primary CTA without declaring a winner before evidence."),
      section("S2_quick_verdict", "Give a short, qualified verdict for the main comparison intent.", "seo", "quick comparison verdict", ["verdict condition", "reader scenario", "comparison caveat"], ["best-for/avoid-if callout"], budget(3, 1, 2), "Use a qualified verdict, not a universal winner."),
      section("S3_comparison_methodology", "Explain how options are compared and what evidence is allowed.", "trust", "comparison methodology", ["methodology", "evaluation scope", "fairness caveat"], ["methodology note", "scoring rubric"], budget(3, 2, 1), "Include a concise comparison methodology and qualitative labels unless numeric scoring is explicitly requested."),
      section("S4_decision_criteria", "Define the criteria readers should use before reading the matrix.", "ux", "decision criteria", ["criteria", "why it matters", "reader use case"], ["criteria checklist"], budget(4, 2, 1), "Make each criterion actionable and tied to the search intent."),
      section("S5_side_by_side_matrix", "Compare options side by side against the stated criteria.", "seo", "side-by-side evaluation", ["option-specific facts", "tradeoff", "citation-backed claim"], ["side-by-side comparison matrix"], budget(5, 3, 2), "Matrix cells must be specific; avoid generic good/better/best language."),
      section("S6_reader_fit_tradeoffs", "Explain who each option is and is not for.", "ux", "reader-fit tradeoffs", ["best-fit scenario", "avoid-if scenario", "switching consideration"], ["best-for/avoid-if blocks", "reader scenarios"], budget(4, 2, 2), "Spell out tradeoffs by reader need, not just feature lists."),
      trustProof(),
      faq(),
      finalCta(),
      references()
    ],
    alternatives_evaluator: [
      hero("State why alternatives are being evaluated and keep the CTA fair."),
      section("S2_quick_recommendation", "Summarize the alternative path and when the brand solution still fits.", "seo", "quick alternatives recommendation", ["recommendation condition", "reader reason", "fairness caveat"], ["best-fit callout"], budget(3, 1, 2), "Do not frame every alternative as inferior."),
      section("S3_why_seek_alternatives", "Explain the situations that make readers look for alternatives.", "ux", "alternative trigger diagnosis", ["pain point", "constraint", "reader scenario"], ["reason list", "audience examples"], budget(3, 1, 2), "Name practical triggers such as cost, availability, tolerance, or feature mismatch."),
      section("S4_evaluation_criteria", "Define criteria for judging alternatives fairly.", "trust", "alternative evaluation criteria", ["criteria", "fairness caveat", "evidence rule"], ["evaluation rubric"], budget(4, 2, 1), "Include fairness and competitor-mention caution."),
      section("S5_alternative_options", "Review alternative groups or options with fit and tradeoffs.", "seo", "alternative option evaluation", ["option fact", "tradeoff", "fit scenario"], ["alternatives table", "option cards"], budget(5, 3, 2), "Cover option groups deeply enough for a reader to choose."),
      section("S6_switching_guidance", "Explain switching, migration, or next-step considerations.", "ux", "switching guidance", ["switching step", "risk", "when not to switch"], ["switching checklist", "not-right-for-you guidance"], budget(4, 2, 2), "Make the transition guidance concrete and cautious."),
      trustProof(),
      faq(),
      finalCta(),
      references()
    ],
    ranked_shortlist: [
      hero("State the shortlist promise and make the CTA secondary to useful selection help."),
      section("S2_quick_picks", "Give quick best picks by use case before the full ranking.", "seo", "quick picks", ["pick", "use case", "rationale"], ["quick-picks table"], budget(4, 2, 3), "Every pick needs a clear best-for condition."),
      section("S3_selection_methodology", "Explain ranking criteria and evidence rules.", "trust", "selection methodology", ["ranking criteria", "evidence rule", "exclusion rule"], ["methodology note", "criteria rubric"], budget(4, 2, 1), "Make the ranking method transparent enough to avoid a thin listicle."),
      section("S4_ranked_recommendations", "Present ranked recommendations with evidence and tradeoffs.", "seo", "ranked recommendations", ["recommendation fact", "tradeoff", "reader fit"], ["ranked list", "best-for/avoid-if blocks"], budget(6, 3, 3), "Each recommendation needs evidence, not just a superlative."),
      section("S5_comparison_table", "Compare shortlisted options across the most important criteria.", "ux", "shortlist comparison", ["criteria value", "decision contrast", "reader scenario"], ["comparison table"], budget(4, 2, 1), "Use this to help readers choose between top picks."),
      section("S6_how_to_choose", "Turn the shortlist into a decision path.", "conversion", "choice guidance", ["decision rule", "scenario", "CTA rationale"], ["decision tree", "contextual CTA"], budget(3, 1, 2), "End with a practical path, not another summary."),
      trustProof(),
      faq(),
      finalCta(),
      references()
    ],
    step_by_step_guide: [
      hero("State the outcome, safety boundary, and primary CTA in the first fold."),
      quickAnswer("Summarize the process and expected result before the full steps."),
      section("S3_prerequisites_safety", "Explain prerequisites, safety constraints, and when not to proceed.", "trust", "prerequisites and safety", ["prerequisite", "safety caveat", "when to escalate"], ["before-you-start checklist", "not-right-for-you guidance"], budget(4, 2, 1), "Do not give step advice without safety and escalation context."),
      section("S4_step_by_step_process", "Provide the ordered process a reader can follow.", "seo", "step-by-step process", ["step", "why it matters", "example"], ["numbered steps", "timing/routine table"], budget(6, 2, 3), "Each step must include action, rationale, and practical detail."),
      section("S5_mistakes_troubleshooting", "Cover common mistakes and troubleshooting paths.", "ux", "mistake and troubleshooting guidance", ["mistake", "symptom", "fix"], ["mistakes table", "troubleshooting flow"], budget(4, 2, 2), "Use observed audience pain points where available."),
      section("S6_expected_outcome", "Set expectations for results, timelines, and next action.", "conversion", "expected outcome and next step", ["expected outcome", "timeframe", "CTA rationale"], ["timeline", "next-step checklist"], budget(3, 1, 2), "Avoid guaranteed outcomes; keep timelines evidence-backed."),
      trustProof(),
      faq(),
      finalCta(),
      references()
    ],
    pricing_decision: [
      hero("State the pricing question, answer boundary, and primary CTA in the first fold."),
      section("S2_quick_pricing_answer", "Give a quick price or cost-range answer with caveats.", "seo", "quick pricing answer", ["range or model", "caveat", "what changes price"], ["range callout"], budget(3, 2, 1), "If exact pricing is unavailable, say what determines price instead of inventing numbers."),
      section("S3_cost_drivers", "Explain the main factors that change price or package fit.", "ux", "cost drivers", ["driver", "why it changes cost", "reader scenario"], ["cost-driver table"], budget(5, 2, 2), "Ground every driver in observable service, product, or plan differences."),
      section("S4_pricing_ranges", "Show pricing ranges, plans, packages, or quote logic.", "seo", "pricing ranges and models", ["price/range fact", "plan/package distinction", "source caveat"], ["pricing table", "quote logic explainer"], budget(5, 3, 2), "Use cost transparency and cite sources; never fabricate prices."),
      section("S5_value_tradeoffs", "Compare value, outcomes, limitations, and alternatives.", "ux", "value tradeoffs", ["value factor", "limitation", "scenario"], ["value comparison table"], budget(4, 2, 2), "Help readers judge whether the cost is worth it for their case."),
      section("S6_hidden_costs_limitations", "Name hidden costs, exclusions, risks, and questions to ask.", "trust", "hidden costs and limitations", ["limitation", "extra cost", "question to ask"], ["ask-before-you-buy checklist"], budget(4, 2, 2), "Add legal/claim caution where pricing can change."),
      trustProof(),
      faq(),
      finalCta(),
      references()
    ],
    local_service: [
      hero("State the local service answer and booking/action path in the first fold."),
      section("S2_local_answer", "Answer local availability or near-me intent directly.", "seo", "local intent answer", ["location cue", "availability signal", "reader next step"], ["local answer callout"], budget(3, 1, 1), "Do not imply service coverage without a source or internal destination."),
      section("S3_local_decision_factors", "Explain what matters when choosing locally.", "ux", "local decision factors", ["local criterion", "why it matters", "verification step"], ["local checklist"], budget(4, 2, 2), "Include practical checks such as availability, credentials, reviews, or consultation path."),
      section("S4_service_area_availability", "Describe service-area, booking, delivery, or access constraints.", "conversion", "service area and availability", ["coverage fact", "booking path", "constraint"], ["availability table", "booking path"], budget(4, 2, 1), "Keep geography factual and tied to internal proof."),
      section("S5_local_trust_proof", "Show local proof, process expectations, and trust signals.", "trust", "local trust proof", ["local proof", "process expectation", "review or credential cue"], ["trust proof block", "what-to-expect list"], budget(4, 2, 2), "Use local proof only when supported."),
      section("S6_before_booking_checks", "Give a final checklist before booking or contacting.", "ux", "booking checks", ["question to ask", "document/detail needed", "avoid-if cue"], ["booking checklist"], budget(3, 1, 2), "Make this useful even if the reader chooses another provider."),
      trustProof(),
      faq(),
      finalCta(),
      references()
    ],
    educational_guide: [
      hero("State the guide promise and primary CTA in the first fold."),
      quickAnswer("Answer the informational query directly before deeper explanation."),
      section("S3_topic_context", "Explain the topic context and why it matters.", "ux", "topic context", ["definition", "audience concern", "scope boundary"], ["plain-language explainer", "reader examples"], budget(4, 2, 2), "Keep the scope specific to the selected page intent."),
      section("S4_deep_explanation", "Provide the main researched explanation.", "seo", "deep explanation", ["source-backed fact", "mechanism", "example"], ["explainer sections", "example boxes"], budget(6, 3, 2), "Avoid generic summaries; make the explanation evidence-led."),
      section("S5_decision_implications", "Explain what the reader should do with the information.", "ux", "decision implications", ["decision rule", "tradeoff", "scenario"], ["decision checklist"], budget(4, 2, 2), "Convert information into reader judgment."),
      section("S6_solution_bridge", "Bridge the topic to a relevant product, category, or next guide.", "conversion", "solution bridge", ["CTA rationale", "internal destination fit", "reader scenario"], ["contextual CTA", "next-step map"], budget(3, 1, 1), "Keep conversion helpful and proportional."),
      trustProof(),
      faq(),
      finalCta(),
      references()
    ]
  };

  return templates[variant];
}

function hero(notes: string): PreWritingSection {
  return section(
    "S1_hero",
    "First-fold answer, H1, primary CTA, and surrounding CTA microcopy.",
    "conversion",
    "first-fold promise",
    ["page promise", "primary CTA rationale", "reader intent"],
    ["H1", "primary CTA", "CTA microcopy"],
    budget(2, 0, 1),
    `${notes} Primary actionable must be visible in the first fold on desktop and mobile.`
  );
}

function quickAnswer(notes: string): PreWritingSection {
  return section(
    "S2_quick_answer",
    "Short answer optimized for humans and AI overview style retrieval.",
    "seo",
    "direct answer",
    ["direct answer", "intent qualifier", "reader next step"],
    ["short answer block"],
    budget(3, 1, 1),
    notes
  );
}

function trustProof(): PreWritingSection {
  return section(
    "S7_trust_proof",
    "Author, reviewer, methodology, experience, proof, and brand trust signals.",
    "trust",
    "trust and methodology proof",
    ["authorship signal", "review or methodology note", "brand proof"],
    ["author/reviewer block", "methodology note", "proof points"],
    budget(3, 1, 1),
    "Include authored-by visibility and page creation or update date."
  );
}

function faq(): PreWritingSection {
  return section(
    "S8_faq",
    "Answer likely questions and support FAQ JSON-LD only when FAQ content exists.",
    "seo",
    "FAQ support",
    ["question", "direct answer", "source-backed caveat"],
    ["FAQ entries", "FAQ schema draft"],
    budget(4, 2, 0),
    "Include FAQ schema draft when this section is present."
  );
}

function finalCta(): PreWritingSection {
  return section(
    "S9_final_cta",
    "Final primary CTA and conversion-oriented closing copy.",
    "conversion",
    "final conversion path",
    ["CTA rationale", "reader readiness cue", "destination fit"],
    ["final CTA", "short closing copy"],
    budget(2, 0, 1),
    "Use one primary CTA variant in V1."
  );
}

function references(): PreWritingSection {
  return section(
    "S10_references",
    "Reference URLs and source metadata used for page claims.",
    "reference",
    "source record",
    ["reference URL", "source label", "access date or retrieval note"],
    ["reference list"],
    budget(0, 0, 0),
    "Only URL/source metadata belongs here."
  );
}

function section(
  id: string,
  purpose: string,
  contentRole: PreWritingSection["contentRole"],
  sectionIntent: string,
  evidenceNeeded: string[],
  requiredDevices: string[],
  evidenceBudget: PreWritingSection["evidenceBudget"],
  notes: string
): PreWritingSection {
  return {
    id,
    purpose,
    contentRole,
    sectionIntent,
    evidenceNeeded,
    requiredDevices,
    evidenceBudget,
    notes
  };
}

function budget(
  minimumFacts: number,
  minimumCitedClaims: number,
  minimumConcreteExamples: number
): PreWritingSection["evidenceBudget"] {
  return {
    minimumFacts,
    minimumCitedClaims,
    minimumConcreteExamples
  };
}

function normalizeIntentText(value: string): string {
  return value.toLowerCase().replace(/[-_/]+/g, " ").replace(/\s+/g, " ").trim();
}

function unique(values: string[]): string[] {
  return [...new Set(values)];
}

function buildApprovalQueues(page: PageOpportunity): PreWritingStrategy["approvalQueues"] {
  const critical: ApprovalItem[] = [];
  const structure = inferPageStructure(page);
  if (
    page.pageType === "comparison"
    || page.strategyCategory === "competitor_category"
    || structure.intentPattern === "comparison"
    || structure.intentPattern === "alternatives"
  ) {
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
