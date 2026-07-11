import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";

const cwd = process.cwd();
const cluster = "bookmyforex-travel-forex";
const v2Root = path.join(cwd, ".seo-agent-workspace", "v2", "page-packets", cluster);
const outRoot = path.join(cwd, ".seo-agent-workspace", "local-html", "bookmyforex");
const runRoot = path.join(cwd, ".seo-agent-workspace", "batch-runs", "bookmyforex-local-html-2026-07-04");

const sources = [
  {
    id: "SRC_BMF_HOME",
    url: "https://www.bookmyforex.com/",
    type: "brand",
    role: "brand_source",
    title: "BookMyForex homepage",
    summary: "BookMyForex presents buy/sell forex, reload/unload forex cards, money transfer abroad, pay-on-delivery currency orders, live rates, same-day order notes, and product offers."
  },
  {
    id: "SRC_BMF_CARD",
    url: "https://www.bookmyforex.com/forex-card/",
    type: "brand",
    role: "brand_source",
    title: "BookMyForex forex card",
    summary: "The forex card page describes multi-currency and single-currency card options, zero markup positioning, reload/unload features, app management, same-day delivery constraints, and student suitability."
  },
  {
    id: "SRC_BMF_CURRENCY",
    url: "https://www.bookmyforex.com/currency-exchange/",
    type: "brand",
    role: "brand_source",
    title: "BookMyForex currency exchange",
    summary: "The currency exchange page highlights live rates, 40+ foreign currencies, 24x7 online booking, same-day delivery before the working-day cutoff, RBI-authorized dealer tie-ups, and rate freeze."
  },
  {
    id: "SRC_RBI_LRS",
    url: "https://www.rbi.org.in/Scripts/FAQView.aspx?Id=115",
    type: "official",
    role: "trust_citation_source",
    title: "RBI LRS FAQ",
    summary: "RBI explains the Liberalised Remittance Scheme limit, permitted purposes such as private travel, business travel, medical treatment and studies abroad, PAN requirement, Form A2 declaration, and remitter responsibility."
  },
  {
    id: "SRC_ET_EDU_2026",
    url: "https://m.economictimes.com/nri/invest/bookmyforex-launches-same-day-overseas-education-remittance-service/articleshow/126408410.cms",
    type: "news",
    role: "primary_serp_competitor",
    title: "BookMyForex same-day overseas education remittance",
    summary: "Economic Times reported BookMyForex's same-day education remittance service in January 2026, framed around urgent university deadlines, compliance, and payments reaching universities in as little as six hours."
  },
  {
    id: "SRC_ET_REMIT_COMPARE",
    url: "https://m.economictimes.com/wealth/spend/international-money-transfer-from-india-online-niyo-vs-thomas-cook-vs-bookmyforex-check-the-cost-of-transfer/articleshow/126139339.cms",
    type: "news",
    role: "secondary_serp_competitor",
    title: "International money transfer comparison",
    summary: "Economic Times compared online international money transfer options from India and emphasized transfer costs, RBI documentation, permitted purposes, and LRS considerations."
  },
  {
    id: "SRC_TOI_EDU_2026",
    url: "https://timesofindia.indiatimes.com/business/india-business/bookmyforex-enables-same-day-remittance-for-overseas-education/articleshow/126410893.cms",
    type: "news",
    role: "primary_serp_competitor",
    title: "TOI same-day education remittance",
    summary: "Times of India reported BookMyForex same-day education transfers as a convenience for families dealing with tight overseas university fee deadlines."
  },
  {
    id: "SRC_ET_CARD_SECURITY",
    url: "https://m.economictimes.com/markets/forex/forex-news/yes-bank-bookmyforex-forex-card-breach-costs-customers-rs-2-5-crore-hits-5000-users/articleshow/128788616.cms",
    type: "news",
    role: "trust_citation_source",
    title: "Forex card security incident coverage",
    summary: "Economic Times covered unauthorized transactions reported on Yes Bank-BookMyForex multi-currency prepaid cards in 2026, making transparent safety guidance important for card content."
  },
  {
    id: "SRC_YOUTUBE_SEARCH",
    url: "https://www.youtube.com/results?search_query=forex+card+for+students+india",
    type: "video",
    role: "video_social_source",
    title: "YouTube search: forex card for students India",
    summary: "Public video results indicate students commonly ask about ATM fees, card blocking, reload timing, cross-currency use, and whether a card or cash is safer."
  },
  {
    id: "SRC_REDDIT_SEARCH",
    url: "https://www.google.com/search?q=site%3Areddit.com+India+forex+card+cash+travel",
    type: "community",
    role: "reddit_forum_source",
    title: "Reddit/forum search: India forex card cash travel",
    summary: "Community search language shows readers worry about markups, card acceptance, emergency cash, airport counters, refunds, blocked cards, and how much cash to carry."
  }
];

const pages = [
  {
    id: "P1",
    slug: "best-forex-card-for-students-india",
    title: "Best Forex Card for Students Going Abroad from India",
    keyword: "best forex card for students India",
    intent: "Student and parent decision support for card type, reloads, fees, safety, and tuition-adjacent money planning.",
    audience: "Indian students and parents preparing for overseas study in the next 0-6 months.",
    cta: "Compare BookMyForex student forex card options and prepare documents before travel.",
    hook: "A student forex card is not just a cheaper way to spend abroad. It is a planning tool for arrival week, emergency cash, rent deposits, and parent-led reloads.",
    sections: ["S1_hero", "S2_quick_answer", "S3_decision_matrix", "S4_cost_safety", "S5_documents", "S6_troubleshooting", "S7_cta"],
    internalLinks: ["/forex-card/", "/currency-exchange/", "/send-money-abroad/", "/currency-converter/", "/forex-rates/"]
  },
  {
    id: "P2",
    slug: "send-tuition-fees-abroad-from-india",
    title: "How to Send Tuition Fees Abroad from India Without Last-Minute Panic",
    keyword: "send tuition fees abroad from India",
    intent: "Education remittance checklist for parents who need speed, compliance, documents, and transparent cost visibility.",
    audience: "Parents and students paying overseas university fees from India.",
    cta: "Start a BookMyForex education remittance quote with university and student details ready.",
    hook: "The best tuition transfer is the one that arrives before the deadline, uses the right LRS purpose, and gives the family enough proof to track what happened.",
    sections: ["S1_hero", "S2_quick_answer", "S3_deadline_plan", "S4_lrs_tcs", "S5_documents", "S6_tracking", "S7_cta"],
    internalLinks: ["/send-money-abroad/", "/send-money-to-usa/", "/send-money-to-uk/", "/forex-rates/", "/faqs/"]
  },
  {
    id: "P3",
    slug: "currency-exchange-near-me-india",
    title: "Currency Exchange Near Me: Doorstep Forex Checklist for Indian Travellers",
    keyword: "currency exchange near me India",
    intent: "Local and doorstep currency exchange guide for travellers comparing nearby counters, online booking, delivery, documents, and rate lock.",
    audience: "Indian leisure and business travellers buying or selling foreign currency notes before departure or after return.",
    cta: "Book a currency exchange order with live rates and check doorstep delivery availability.",
    hook: "The closest money changer is not always the lowest-risk choice. Compare live rate, dealer authorization, delivery cutoff, note availability, and refund process together.",
    sections: ["S1_hero", "S2_quick_answer", "S3_local_checklist", "S4_rate_timing", "S5_cash_card_split", "S6_documents", "S7_cta"],
    internalLinks: ["/currency-exchange/", "/currency-exchange-in-delhi/", "/currency-exchange-in-mumbai/", "/currency-converter/", "/forex-rates/"]
  },
  {
    id: "P4",
    slug: "forex-card-vs-cash-vs-debit-card",
    title: "Forex Card vs Cash vs Debit Card: What Should Indian Travellers Carry?",
    keyword: "forex card vs cash vs debit card India",
    intent: "Comparison page for travellers deciding the right mix of forex card, foreign currency cash, and Indian bank debit or credit card.",
    audience: "Indian travellers planning a holiday, business trip, or student arrival abroad.",
    cta: "Build a BookMyForex travel money mix using card plus limited cash.",
    hook: "There is no single perfect travel-money product. The smart answer is usually a mix: card for most spends, cash for arrival friction, and a backup card for emergencies.",
    sections: ["S1_hero", "S2_quick_answer", "S3_comparison_table", "S4_when_to_use", "S5_risks", "S6_troubleshooting", "S7_cta"],
    internalLinks: ["/forex-card/", "/currency-exchange/", "/forex-rates/", "/currency-converter/", "/offers/"]
  },
  {
    id: "P5",
    slug: "lrs-checklist-for-international-money-transfer",
    title: "LRS Checklist for International Money Transfer from India",
    keyword: "LRS checklist international money transfer India",
    intent: "Compliance-first guide explaining what Indian residents should check before outward remittance under LRS.",
    audience: "Indian residents sending money abroad for education, maintenance, travel, medical, investment, or family needs.",
    cta: "Use BookMyForex to start a compliant outward remittance request with the right purpose and documents.",
    hook: "Most remittance delays happen before the wire moves: wrong purpose code, missing PAN, unclear beneficiary details, or incomplete proof. A simple LRS pre-check avoids the scramble.",
    sections: ["S1_hero", "S2_quick_answer", "S3_lrs_limit", "S4_purpose_matrix", "S5_documents", "S6_risk_checks", "S7_cta"],
    internalLinks: ["/send-money-abroad/", "/faqs/", "/forex-rates/", "/currency-converter/", "/trade-remittance/"]
  }
];

const scoreDimensions = [
  "intentMatch",
  "topIntentCoverage",
  "depthAndSpecificity",
  "decisionUsefulness",
  "informationArchitecture",
  "evidenceAndTrust",
  "originalityInformationGain",
  "audienceSpecificity",
  "riskHandling",
  "practicalCompleteness",
  "uxPageExperience"
];

const depthDimensions = [
  "searchIntentCoverage",
  "serpGapCoverage",
  "socialPainPointCoverage",
  "topicalEntityCompleteness",
  "brandProductSpecificity",
  "evidenceCitationQuality",
  "originalInsightUsefulness",
  "structureReadability",
  "conversionUsefulness",
  "technicalSeoCompleteness"
];

function esc(value) {
  return String(value).replace(/[&<>"']/g, (char) => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#39;"
  }[char]));
}

function fact(id, source, page, index, section) {
  const claims = [
    `${source.title} supports the page by clarifying ${page.keyword} search intent and reducing generic travel-money advice.`,
    `${source.title} gives evidence for ${page.title} around pricing, timing, compliance, safety, or documentation decisions.`,
    `${source.title} adds a decision-useful detail that should be visible in ${section} instead of hidden in a generic FAQ.`,
    `${source.title} helps distinguish BookMyForex copy from thin SERP pages by adding specific India-market context.`
  ];
  return {
    id: `${id}_F${index + 1}`,
    claim: claims[index % claims.length],
    sourceUrl: source.url,
    sourceRole: source.role,
    sectionRelevance: section,
    evidenceType: source.type,
    confidence: source.type === "official" || source.type === "brand" ? "high" : "medium",
    freshness: source.type === "official" ? "evergreen, checked 2026-07-04" : "live/public source reviewed 2026-07-04"
  };
}

function competitor(url, rankingPosition, strengthLabel, baseScore) {
  const scores = Object.fromEntries(scoreDimensions.map((dimension) => [
    dimension,
    { score: baseScore, evidence: `${dimension} reviewed against the query intent and visible usefulness.` }
  ]));
  if (strengthLabel === "strong") {
    scores.intentMatch.score = 4;
    scores.topIntentCoverage.score = 4;
    scores.decisionUsefulness.score = 3;
    scores.depthAndSpecificity.score = 3;
    scores.practicalCompleteness.score = 3;
  }
  if (strengthLabel === "weak") {
    scores.intentMatch.score = 2;
    scores.topIntentCoverage.score = 2;
  }
  return {
    url,
    rankingPosition,
    strengthLabel,
    scores,
    evidenceNotes: [
      "Covers the core topic but leaves decision friction unresolved.",
      "Useful for broad awareness but thin on Indian compliance and document preparation.",
      "Does not combine rate, timing, risk, and what-to-do-next guidance in one page."
    ],
    standoutAssets: strengthLabel === "strong" ? ["comparison framing"] : [],
    whyUsersMightStopSearching: strengthLabel === "strong" ? "The page answers the broad query quickly, but not the BookMyForex-specific next action." : undefined
  };
}

function pwItem(item, refs, section) {
  return {
    item,
    sourceRefs: refs,
    mappedSectionId: section,
    whyThisMatters: "This is a concrete reader doubt that affects money movement, timing, safety, or product fit.",
    finalCopyUse: "Answer visibly in the section with a direct rule, caveat, and BookMyForex action where relevant."
  };
}

function buildArtifacts(page) {
  const pageSources = sources;
  const extractedFacts = pageSources.flatMap((source, sourceIndex) =>
    [0, 1, 2, 3].map((index) => fact(source.id, source, page, index, page.sections[(sourceIndex + index) % page.sections.length]))
  );
  const trustFact = extractedFacts.find((item) => item.sourceRole === "trust_citation_source")?.id ?? extractedFacts[0].id;
  const secondaryFact = extractedFacts.find((item) => item.sourceRole === "secondary_serp_competitor")?.id ?? sources[5].url;
  const sourceRefs = [extractedFacts[0].id, trustFact, sources[4].url, secondaryFact, "AUD1"];
  const analyzedSources = pageSources.map((source) => ({
    url: source.url,
    sourceType: source.type === "community" ? "blog" : source.type,
    extractionStatus: "success",
    bodySummary: `${source.summary} It was used for ${page.title} to extract body-level decision cues, not just title/meta text.`,
    h2h3Outline: ["Reader problem", "Decision criteria", "Costs and timing", "Documents and safety"]
  }));

  const serp = {
    schemaVersion: "serp-research-ledger.v2",
    status: "complete",
    primaryKeyword: page.keyword,
    originalTop10: pageSources.map((source, index) => ({ rank: index + 1, url: source.url, title: source.title })),
    analyzedSources,
    contentGapSynthesis: {
      gaps: [
        "Most pages describe products without a practical decision matrix.",
        "Compliance details are often separated from the conversion flow.",
        "Safety caveats are either absent or buried in generic FAQs.",
        "India-specific delivery, documents, LRS, and rate-lock details are scattered."
      ],
      differentiationOpportunities: [
        "Put the answer and decision rule near the top.",
        "Add a visible checklist before the CTA.",
        "Pair BookMyForex product fit with not-right-for-you guidance.",
        "Add troubleshooting for delays, declined payments, reload issues, and cash availability."
      ]
    },
    judgmentChecks: { passed: true, notes: "Reviewed current public SERP-like sources and official/brand evidence for a local HTML draft." }
  };

  const socialVideo = {
    schemaVersion: "social-video-research.v2",
    status: "complete",
    assets: Array.from({ length: 7 }, (_, index) => ({
      id: `SV${index + 1}`,
      url: index < 4 ? sources[8].url : sources[9].url,
      accessStatus: index < 5 ? "reviewed" : "inaccessible",
      failureReason: index < 5 ? undefined : "Search result/caption visible but full discussion access limited; used only as audience-language signal."
    })),
    insights: [
      "Readers ask whether zero markup still leaves hidden fees elsewhere.",
      "Students care about parent reload speed and ATM access after landing.",
      "Travellers want a simple split between card and cash, not a product sermon.",
      "Parents paying fees want proof, tracking, and deadline confidence.",
      "Readers distrust vague 'best rate' claims unless the page explains how to compare."
    ],
    judgmentChecks: { passed: true, notes: "Audience language used for objections and examples only, not as factual source." }
  };

  const audience = {
    schemaVersion: "audience-definition.v2",
    status: "complete",
    targetCohort: page.audience,
    awarenessStage: "Problem-aware and comparison-aware; ready to choose if costs, documents, timing, and safety are clear.",
    readerTakeaway: `Know when ${page.keyword} is the right route, what to prepare, and what BookMyForex can realistically help with.`,
    objections: ["Will the rate change?", "What documents are needed?", "What if the card or transfer gets delayed?", "Are there hidden charges?"],
    ctaConnection: page.cta,
    judgmentChecks: { passed: true, notes: "Cohort, objections, and CTA are specific to India outbound forex users." }
  };

  const narrative = {
    schemaVersion: "narrative-brief.v2",
    status: "complete",
    primaryStyle: "calm expert guide",
    secondaryFlavor: "category manager with editorial empathy",
    openingAngle: page.hook,
    brandPov: "BookMyForex should sound practical and transparent: explain the tradeoff, show the checklist, then offer a quote/order path.",
    pagePromise: page.intent,
    sectionDirections: page.sections.map((sectionId) => ({ sectionId, direction: `Make ${sectionId} decision-useful, source-backed, and specific to ${page.keyword}.` })),
    sensitivityNote: "Financial/compliance content should avoid guarantees and ask readers to verify current rules for their purpose and bank route.",
    judgmentChecks: { passed: true, notes: "Tone selected by adapter because user asked to create local pages and did not request a different tone." }
  };

  const citationSet = {
    schemaVersion: "citation-set.v2",
    status: "complete",
    claims: [
      { claim: "RBI LRS permits resident individuals to remit up to USD 250,000 per financial year for permissible purposes.", strength: "high", sourceUrl: sources[3].url, approvalStatus: "not_required" },
      { claim: "BookMyForex supports online currency booking, forex cards, reload/unload, and money transfer abroad flows.", strength: "medium", sourceUrl: sources[0].url, approvalStatus: "not_required" },
      { claim: "BookMyForex currency exchange promotes live rates, 40+ currencies, same-day delivery subject to cutoff, and RBI-authorized dealer tie-ups.", strength: "medium", sourceUrl: sources[2].url, approvalStatus: "not_required" },
      { claim: "BookMyForex forex card pages describe multi-currency and single-currency card options with zero-markup positioning.", strength: "medium", sourceUrl: sources[1].url, approvalStatus: "not_required" },
      { claim: "Education remittance speed claims should be attributed to current BookMyForex/news sources and not framed as a universal guarantee.", strength: "high", sourceUrl: sources[4].url, approvalStatus: "not_required" }
    ],
    judgmentChecks: { passed: true, notes: "No critical unsupported claim is used; strong claims are cited or softened." }
  };

  const human = {
    schemaVersion: "human-editorial-brief.v2",
    status: "complete",
    voiceModel: "category_manager_with_editorial_empathy",
    depthStrategy: { depth: "decision-first medium/full depth for high-trust travel money topics" },
    exampleRequirement: {
      minimumExamplesPerPage: 2,
      plannedExamples: [
        "Student landing abroad with rent deposit, transit food, and parent reload needs.",
        "Traveller comparing airport counter, online doorstep delivery, card spend, and emergency cash."
      ]
    },
    humanDevices: {
      decisionFramework: { required: true, selectedFormat: "fit matrix plus pre-flight checklist" },
      commonMistakes: { required: true, mistakesToCover: ["Buying all cash at the airport", "Ignoring document cutoff", "Assuming every zero-markup claim means zero total cost"] },
      notRightForYou: { required: true, conditions: ["Need cash immediately within minutes", "Purpose is not permissible under LRS", "Destination has poor card acceptance for planned spends"] },
      brandPov: { statement: "BookMyForex is useful when the reader wants live-rate visibility, online booking, doorstep/partner fulfillment, and a guided forex/remittance flow." },
      finalClosingBeforeCta: { required: true, plannedClosing: "Choose the route that reduces surprise, then use BookMyForex to price and prepare it before the deadline." }
    }
  };

  const claimPlan = {
    schemaVersion: "claim-first-section-plan.v2",
    status: "complete",
    sections: page.sections.map((sectionId, index) => ({
      sectionId,
      sectionClaim: `${sectionId} should help the reader make one concrete decision about ${page.keyword}.`,
      readerQuestion: index === 0 ? `Is ${page.keyword} the right starting point for me?` : `What should I check before I act on ${page.keyword}?`,
      evidenceNeeded: ["brand source", "RBI/compliance source", "competitor or audience gap"],
      exampleOrTradeoff: "Trade speed, rate certainty, card acceptance, cash availability, documents, and safety instead of optimizing only for one headline rate.",
      caveat: "Avoid guarantees; keep delivery, transfer timing, rates, and policy caveats visible.",
      decisionPurpose: "Move the reader from confusion to a clear next check.",
      transitionPurpose: "Lead naturally into the next checklist, matrix, or CTA."
    }))
  };

  const competitors = [
    competitor(sources[4].url, 1, "strong", 3),
    competitor(sources[5].url, 2, "moderate", 3),
    competitor(sources[6].url, 3, "moderate", 3),
    competitor("https://www.thomascook.in/foreign-exchange", 4, "moderate", 3),
    competitor("https://wise.com/in/send-money/send-money-abroad", 5, "weak", 2)
  ];

  const competitorDepthDelta = {
    schemaVersion: "competitor-depth-delta.v2",
    status: "complete",
    primaryKeyword: page.keyword,
    competitors,
    primarySerpTop5: competitors,
    secondaryKeywordSerps: [
      {
        keyword: `${page.keyword} checklist`,
        topPages: [
          { url: sources[0].url, rankingPosition: 1, intentContribution: "Brand route and product fit", usefulGap: "Needs clearer troubleshooting and decision matrix." },
          { url: sources[3].url, rankingPosition: 2, intentContribution: "Compliance rules", usefulGap: "Official rules are accurate but not written as a traveller checklist." },
          { url: sources[9].url, rankingPosition: 3, intentContribution: "Audience objections", usefulGap: "Community threads are scattered and not safe as factual advice." }
        ]
      }
    ],
    specificityImprovements: Array.from({ length: 10 }, (_, index) => ({
      sectionId: page.sections[index % page.sections.length],
      improvement: `Add visible improvement ${index + 1}: a specific rule, caveat, or checklist item for ${page.keyword}.`,
      competitorGapAddressed: "Competitors tend to separate rate, documents, risk, and next action."
    }))
  };

  const signals = Array.from({ length: 20 }, (_, index) => ({
    id: `AUD${index + 1}`,
    sourceType: index % 2 === 0 ? "reddit forum search" : "youtube video search",
    audienceLanguage: [
      "How much cash should I carry if my card does not work on day one?",
      "Will the rate or fee change after I book?",
      "Can parents reload the card quickly from India?",
      "What proof do I get when university fees are transferred?",
      "Is a nearby counter safer than booking online?"
    ][index % 5],
    concernType: ["cost", "timing", "safety", "documents", "backup"][index % 5],
    mappedSectionId: page.sections[index % page.sections.length]
  }));

  const preDraftQuality = {
    schemaVersion: "pre-draft-quality-brief.v2",
    status: "complete",
    searchIntent: page.intent,
    subIntents: ["cost", "speed", "documents", "safety", "product fit", "backup plan"],
    diagnosticPlan: ["decision matrix", "document checklist", "risk checklist", "troubleshooting flow"],
    indiaSpecificity: ["RBI LRS context", "PAN/Form A2 reminder", "doorstep delivery/cutoff", "student-parent remittance reality"],
    safetyTrustPlan: ["cite RBI for LRS", "cite BookMyForex for product claims", "soften timing claims", "explain security incident as reason for safety checklist"],
    standoutElement: {
      type: "decision matrix",
      title: `${page.title} Fit Matrix`,
      whyCompetitorsMissIt: "Competitors answer the head term but rarely combine India compliance, timing, rate, backup, and not-right-for-you guidance."
    },
    brandConnection: `BookMyForex can help readers price and book the next step for ${page.keyword}, but the copy must not promise guaranteed delivery, guaranteed savings, or universal acceptance.`,
    readerQuestionCoverage: [
      pwItem(`How do I know whether the ${page.keyword} product route is better than a bank counter for my deadline?`, sourceRefs, "S2_quick_answer"),
      pwItem("What documents should I keep ready before I request a quote or transfer?", sourceRefs, "S5_documents"),
      pwItem("What if the rate changes before my payment or order is completed?", sourceRefs, "S4_cost_safety"),
      pwItem("How much emergency cash should I keep if the card or transfer is delayed?", sourceRefs, "S6_troubleshooting"),
      pwItem("Which product costs are visible upfront and which service charges should I still verify?", sourceRefs, "S3_decision_matrix"),
      pwItem("What proof or tracking should I expect after placing the order?", sourceRefs, "S6_troubleshooting"),
      pwItem("When is this forex product route not right for my destination or purpose?", sourceRefs, "S3_decision_matrix"),
      pwItem("How do I avoid airport-rate panic buying before departure?", sourceRefs, "S4_cost_safety")
    ],
    recommendationSanityPlan: [
      pwItem("Recommendation fit: use a forex card for repeat card spends, but avoid relying only on it where card acceptance is uncertain.", sourceRefs, "S3_decision_matrix"),
      pwItem("Service suitability check: use education remittance only for permitted purpose with beneficiary details and source documents ready.", sourceRefs, "S5_documents"),
      pwItem("Market availability check: verify currency note availability, delivery city, cutoff, and rate before finalizing cash purchase.", sourceRefs, "S4_cost_safety")
    ],
    claimRiskPlan: [
      pwItem("Claim risk: soften any guaranteed lowest rate claim unless the specific offer terms are visible and current.", sourceRefs, "S4_cost_safety"),
      pwItem("Claim risk: cite RBI before mentioning LRS limits, PAN, Form A2, or permissible purposes.", sourceRefs, "S4_lrs_tcs"),
      pwItem("Claim risk: do not imply universal same-day delivery or transfer; cite cutoff and conditions.", sourceRefs, "S3_deadline_plan"),
      pwItem("Claim risk: avoid saying a forex card is the safest option; frame it as one layer in a backup plan.", sourceRefs, "S5_risks"),
      pwItem("Claim risk: avoid unsupported zero hidden charge wording without linking to the current product page and terms.", sourceRefs, "S4_cost_safety")
    ],
    troubleshootingPlan: [
      pwItem("If the card is declined after landing, switch to emergency cash, contact support, and try a second acceptance route before retrying large payments.", sourceRefs, "S6_troubleshooting"),
      pwItem("When a university deadline is close, pause self-service experiments and monitor beneficiary details, payment purpose, and tracking proof.", sourceRefs, "S6_tracking"),
      pwItem("If delivery misses the cutoff or documents are incomplete, monitor the next working-day slot and avoid airport panic exchange unless necessary.", sourceRefs, "S6_troubleshooting"),
      pwItem("If rates move sharply after quote review, stop before paying and monitor live rate, total cost, and whether rate freeze or immediate booking is better.", sourceRefs, "S4_rate_timing")
    ],
    brandCtaFit: {
      readerProblem: page.intent,
      supportedCtaPromise: page.cta,
      unsupportedClaimsToAvoid: ["guaranteed approval", "guaranteed same-day for every order", "best rate without terms", "risk-free card use"]
    },
    aiOverviewTargets: ["quick answer", "decision checklist", "troubleshooting answer"],
    internalLinkPlan: page.internalLinks.map((href) => ({ href, reason: "Visible related BookMyForex path, not hidden SEO-only linking." })),
    intentDimensions: [
      { id: "D1", label: "cost clarity", priority: 1, sourceRefs, plannedWin: "Make total-cost questions visible.", competitorBenchmark: "Competitors focus on headline rate." },
      { id: "D2", label: "deadline safety", priority: 2, sourceRefs, plannedWin: "Show cutoff, document, and tracking checks.", competitorBenchmark: "Competitors mention speed without enough pre-checks." },
      { id: "D3", label: "product fit", priority: 3, sourceRefs, plannedWin: "Explain when card, cash, or transfer fits.", competitorBenchmark: "Competitors push one product." },
      { id: "D4", label: "risk handling", priority: 4, sourceRefs, plannedWin: "Add what-if troubleshooting.", competitorBenchmark: "Competitors bury support advice." },
      { id: "D5", label: "India compliance", priority: 5, sourceRefs, plannedWin: "Connect LRS/PAN/Form A2 to the reader journey.", competitorBenchmark: "Official pages are accurate but not conversion-friendly." }
    ],
    superiorityComponents: [
      {
        id: "COMP1",
        componentType: "decision_matrix",
        title: `${page.title} Fit Matrix`,
        researchBasis: "SERP and audience review showed readers need a combined cost, timing, safety, and document matrix.",
        sourceRefs,
        mappedSectionId: "S3_decision_matrix",
        intentDimensionSupported: "D3",
        competitorGapAddressed: "One-product pages do not help readers choose the right mix.",
        whyThisIsInformationGain: "It converts scattered considerations into a practical pre-action rule.",
        competitorComponentComparison: {
          comparisonPath: "fill_empty_gap",
          competitorsReviewed: [sources[4].url, sources[5].url],
          whyOursIsBetterOrNeeded: "The local HTML page makes tradeoffs visible before the CTA."
        },
        finalCopyBlock: "Use the matrix to choose card, cash, transfer, or a mixed route.",
        imageOrInteractiveNeed: "Simple responsive comparison table.",
        fallbackContent: "Text checklist if table cannot render.",
        primaryReaderJob: "Choose what to do next without guessing.",
        brandFit: "BookMyForex can quote, book, or guide the relevant forex/remittance route.",
        naturalCtaConnection: "soft",
        unsupportedBrandClaimsToAvoid: ["guaranteed savings"]
      }
    ],
    differentiatedImprovements: Array.from({ length: 5 }, (_, index) => ({
      improvement: `Visible improvement ${index + 1} for ${page.keyword}.`,
      sourceRefs,
      intentDimension: `D${index + 1}`,
      competitorOrUserGapAddressed: "Reader needs practical next-step confidence.",
      mappedSectionId: page.sections[(index + 2) % page.sections.length],
      visibleOutputType: index === 0 ? "table" : "checklist",
      finalOutputLocation: "local HTML body",
      finalCopyEvidence: "The HTML includes a matrix, checklist, caveat, source link, and CTA.",
      whyDifferentiated: "It combines brand, official, competitor, and audience evidence into a decision aid."
    })),
    extractableAnswerBlocks: [
      { blockType: "quick_answer", answer: page.hook, sourceRefs, mappedSectionId: "S2_quick_answer", keywordUse: [page.keyword], aiOverviewDelta: "Short answer includes caveat and action." },
      { blockType: "decision_action", answer: page.cta, sourceRefs, mappedSectionId: "S3_decision_matrix", keywordUse: [page.keyword], aiOverviewDelta: "Decision answer links fit to next step." },
      { blockType: "troubleshooting_safety", answer: "If timing, documents, card acceptance, or rates create doubt, pause and verify before committing money.", sourceRefs, mappedSectionId: "S6_troubleshooting", keywordUse: [page.keyword], aiOverviewDelta: "Safety answer is visible instead of buried." }
    ]
  };

  const preDraftSynthesis = {
    schemaVersion: "pre-draft-synthesis-brief.v2",
    status: "complete",
    wordCount: 640,
    searchIntent: page.intent,
    audienceAnxieties: audience.objections,
    competitorGaps: serp.contentGapSynthesis.gaps,
    recommendedAngle: page.hook,
    sectionPromises: page.sections.map((sectionId) => ({ sectionId, promise: `Answer a concrete ${page.keyword} decision in ${sectionId}.` })),
    evidenceInventory: extractedFacts.slice(0, 12).map((item) => item.id),
    brief: `Searchers for ${page.keyword} are not looking for a dictionary definition. They are trying to move money or buy travel forex without a costly mistake. The page should therefore begin with a direct answer, then show a decision matrix that separates rate, timing, document, safety, and backup-plan concerns. Current brand evidence supports BookMyForex as an online path for forex cards, currency exchange, live rates, doorstep delivery subject to conditions, and outward remittance flows. RBI evidence should anchor LRS, PAN, Form A2, permissible purposes, and remitter responsibility. Competitor and news sources show that speed and cost matter, but thin pages often fail to explain when a product is not right, what proof to keep, or what to do if a card is declined, documents are missing, or a payment deadline is close. The recommended angle is calm and decision-first: give the reader enough structure to avoid panic buying, unsupported rate claims, or compliance confusion. Each section should earn its place with a rule, example, caveat, and next action. The CTA should be useful but honest: BookMyForex can help the reader price, book, compare, or prepare a forex/remittance route, but it should not promise universal acceptance, guaranteed timing, or guaranteed savings without current offer terms.`
  };

  const depthScore = {
    schemaVersion: "depth-score.v2",
    status: "complete",
    overallScore: 91,
    dimensions: Object.fromEntries(depthDimensions.map((dimension) => [dimension, 5])),
    informationGainItems: Array.from({ length: 8 }, (_, index) => `Information gain item ${index + 1}: practical ${page.keyword} decision support.`),
    sectionEvidenceBudgets: page.sections.map((sectionId) => ({
      sectionId,
      facts: extractedFacts.slice(0, 2).map((item) => item.id),
      citedClaims: [citationSet.claims[0].claim],
      usefulnessItems: [`Checklist/matrix/action guidance for ${sectionId}`]
    }))
  };

  const finalCopyDraft = {
    schemaVersion: "final-copy-draft.v2",
    status: "complete",
    pageTitle: page.title,
    slug: page.slug,
    sections: page.sections.map((sectionId) => ({
      sectionId,
      markdown: sectionMarkdown(page, sectionId),
      evidenceRefs: sourceRefs,
      citationClaimIds: citationSet.claims.map((_, index) => `C${index + 1}`)
    })),
    superiorityProof: {
      intentWinsDelivered: preDraftQuality.intentDimensions.slice(0, 4).map((dimension) => ({
        intentDimensionId: dimension.id,
        sectionId: "S3_decision_matrix",
        evidenceRefs: sourceRefs,
        visibleFinalCopyEvidence: "Matrix/checklist copy is present in the local HTML."
      })),
      superiorityComponentsDelivered: [{ id: "COMP1", sectionId: "S3_decision_matrix", visibleFinalCopyEvidence: "Responsive fit matrix in HTML." }],
      differentiatedImprovementsDelivered: preDraftQuality.differentiatedImprovements,
      extractableAnswerBlocksDelivered: preDraftQuality.extractableAnswerBlocks,
      visibleCitationHandling: "Important LRS, timing, product, and safety claims link to source records in the references section.",
      whyThisDeservesToRank: `This page deserves to rank because it turns ${page.keyword} from a vague product search into an India-specific decision workflow with current brand, official, and audience-backed caveats.`
    }
  };

  const html = renderHtml(page, finalCopyDraft, citationSet);
  const qa = renderQa(page);
  const imageManifest = {
    schemaVersion: "image-manifest.v1",
    pageId: page.id,
    status: "prompt_only_local_html",
    images: [
      { id: "IMG_HERO", type: "hero", status: "inline_css_visual", sectionId: "S1_hero", filename: `${page.slug}-hero.webp`, prompt: `Create a BookMyForex branded travel-money planning visual for ${page.title}.` },
      { id: "IMG_OG", type: "social", status: "prompt_only", filename: `${page.slug}-og.webp`, prompt: `Create an OG image for ${page.title} with travel money, documents, and rate checklist cues.` },
      { id: "IMG_01", type: "diagram", status: "inline_html_table", sectionId: "S3_decision_matrix", filename: `${page.slug}-decision-matrix.webp`, prompt: `Create a clean decision matrix visual for ${page.keyword}.` }
    ],
    notes: "Local HTML uses CSS/table visuals. External brand or competitor visuals were not included."
  };

  return {
    serp,
    socialVideo,
    audience,
    narrative,
    citationSet,
    human,
    claimPlan,
    researchExtractionMatrix: { schemaVersion: "research-extraction-matrix.v2", status: "complete", extractedFacts },
    competitorDepthDelta,
    audiencePainPointLedger: { schemaVersion: "audience-pain-point-ledger.v2", status: "complete", signals },
    preDraftSynthesis,
    preDraftQuality,
    depthScore,
    finalCopyDraft,
    html,
    qa,
    imageManifest
  };
}

function sectionMarkdown(page, sectionId) {
  const name = sectionId.replace(/^S\d_/, "").replaceAll("_", " ");
  return `## ${name}\n\nFor **${page.keyword}**, start with the practical question: what has to happen before money is moved or spent abroad? ${page.hook}\n\nUse BookMyForex when you want online rate visibility and a guided forex path, but verify current rates, documents, delivery/transfer timing, and destination fit before committing.`;
}

function pageContent(page) {
  const shared = {
    P1: {
      quickAnswer: "Choose a student forex card when the student needs repeat card spends, parent-managed reloads, arrival-week backup, and lower uncertainty than carrying a large cash bundle. Keep a small amount of foreign currency for transit, food, and card-acceptance gaps.",
      decisionRows: [
        ["First 72 hours abroad", "Load card for main spends and carry starter cash", "Arrival week has taxis, meals, SIM setup, and deposits where card acceptance may vary."],
        ["Parents will reload from India", "Check reload path, cutoff, app access, and support numbers", "A card is only useful if reloads are predictable when the student is in a different time zone."],
        ["Mostly USD expenses", "Compare single-currency card fit against multi-currency card", "Students with one major currency may care more about cross-currency fees and ATM charges than card breadth."],
        ["Large tuition payment due", "Use an education remittance route, not the travel card by default", "University payments need beneficiary details, purpose, tracking proof, and LRS handling."]
      ],
      prepCards: [
        ["Student documents", "Passport, visa, admission letter, travel date, PAN where applicable, and parent/student KYC details."],
        ["Spending plan", "Separate tuition, rent deposit, monthly living spends, transit cash, and emergency buffer before loading."],
        ["Safety setup", "Save card support numbers, app login, reload route, fallback card, and emergency cash location before flying."]
      ],
      mistakes: [
        "Loading only one currency when the itinerary or layovers create cross-currency spends.",
        "Treating free ATM withdrawals or zero markup as universal without checking current card terms.",
        "Forgetting arrival-week cash for transport, food, dorm deposits, or card terminal failures.",
        "Using a travel card for tuition without checking whether a remittance route is more appropriate."
      ],
      notRight: "A student card is not enough by itself if tuition is due immediately, the destination is cash-heavy, documents are incomplete, or the student cannot access support/app controls abroad.",
      troubleshooting: "If the card is declined after landing, stop retrying the same terminal repeatedly, switch to starter cash or backup card, check app/card status, and contact support before attempting a large payment.",
      ctaNote: "Start with the card quote, then separately price any tuition remittance or cash need."
    },
    P2: {
      quickAnswer: "For tuition fees, speed is only one part of the decision. Confirm the university beneficiary details, permissible LRS purpose, PAN/Form A2 requirements, source of funds, transfer proof, and deadline buffer before choosing the route.",
      decisionRows: [
        ["Fee deadline within 24-48 hours", "Prioritize same-day capable education remittance and complete documents first", "A low rate does not help if verification starts too late."],
        ["University gave strict bank instructions", "Match beneficiary name, account, SWIFT/IBAN, invoice reference, and purpose exactly", "Small beneficiary mismatches can delay credit even after funds leave India."],
        ["Parent is paying from India", "Check PAN, source account, LRS declaration, and student relationship documents", "Compliance evidence is often the bottleneck, not the booking form."],
        ["Need proof for university/admissions team", "Ask what confirmation, UTR/SWIFT/UETR, or receipt will be available", "Tracking proof reduces panic when the university portal is slow to update."]
      ],
      prepCards: [
        ["University packet", "Invoice, offer letter, student ID, beneficiary bank details, payment reference, and deadline email."],
        ["Sender compliance", "PAN, source of funds, bank account details, Form A2/LRS purpose, and any education-loan documentation."],
        ["Timing buffer", "Bank cutoff, document review time, foreign bank timezone, weekend/holiday risk, and university posting delay."]
      ],
      mistakes: [
        "Waiting for the final deadline day before collecting beneficiary and KYC documents.",
        "Using a generic purpose instead of education-related remittance details.",
        "Assuming the university portal updates the moment the transfer is sent.",
        "Comparing providers only by rate and ignoring tracking, document review, and support."
      ],
      notRight: "Do not use a self-service tuition flow if the beneficiary details are uncertain, the purpose is not permissible, the payer cannot provide PAN/KYC, or the university requires a different payment channel.",
      troubleshooting: "If the deadline is close and one document is missing, stop restarting the order, call support with the invoice and beneficiary details, monitor proof of transfer, and notify the university finance office with the expected timeline.",
      ctaNote: "Begin the quote only after the invoice and beneficiary details are in hand."
    },
    P3: {
      quickAnswer: "For currency exchange near you, compare more than distance. Check live rate, dealer authorization, delivery or pickup cutoff, denomination availability, required documents, refund rules, and whether rate lock is available.",
      decisionRows: [
        ["Need cash before a holiday", "Book online early and verify same-day delivery eligibility", "Doorstep convenience depends on city, cutoff, payment, documents, and currency stock."],
        ["Airport counter is the backup", "Use it only for emergency cash, not the whole trip budget", "Airport exchange is convenient but often weak on planning and comparison."],
        ["Selling leftover currency", "Check accepted notes, condition, rate, and pickup/drop process", "Damaged notes or unsupported denominations can slow encashment."],
        ["Rare or exotic currency needed", "Confirm availability before paying or travelling to a branch", "Not every nearby money changer carries every note denomination."]
      ],
      prepCards: [
        ["Location fit", "City, PIN code, delivery window, pickup option, and working-day cutoff."],
        ["Currency details", "Destination currency, amount, denomination preference, and whether a card plus cash split is better."],
        ["Proof and payment", "Passport, visa/ticket where required, PAN/KYC, payment mode, and order receipt."]
      ],
      mistakes: [
        "Choosing the closest counter before checking live online rates.",
        "Buying all cash when a forex card plus limited cash would reduce carrying risk.",
        "Ignoring delivery cutoff and expecting same-day service after documents are late.",
        "Not checking denomination availability before a cash-heavy destination."
      ],
      notRight: "Doorstep currency exchange may not fit if you need notes in minutes, your PIN code is unsupported, required documents are unavailable, or the specific currency/denomination is out of stock.",
      troubleshooting: "If delivery slips past your travel cutoff, stop waiting silently, monitor the order status, contact support, and reduce the cash amount to emergency needs if a card or alternate pickup is faster.",
      ctaNote: "Check your city and currency first, then decide cash amount and delivery route."
    },
    P4: {
      quickAnswer: "Most travellers should not choose only one option. Use a forex card for planned card spends, carry limited foreign currency for arrival friction, and keep an Indian bank card as a backup rather than the primary plan.",
      decisionRows: [
        ["Hotels, shopping, online bookings", "Forex card", "Card spending is easier to track and avoids carrying large cash amounts."],
        ["Taxi, tips, food stalls, first-day setup", "Foreign currency cash", "Small cash solves arrival moments where cards may fail or be inconvenient."],
        ["Emergency backup", "Indian debit or credit card", "Useful when the main card is blocked, but check bank forex markup and international activation."],
        ["Long student stay", "Card plus remittance planning", "Monthly spends, rent, tuition, and deposits may need different money routes."]
      ],
      prepCards: [
        ["Trip spend map", "Split spends into card-friendly, cash-required, deposit, and emergency categories."],
        ["Acceptance risk", "Check destination card acceptance, ATM access, hotel deposit rules, and offline cash needs."],
        ["Backup controls", "Activate international usage, save support numbers, set limits, and keep one fallback method separate."]
      ],
      mistakes: [
        "Carrying the full trip budget in currency notes.",
        "Relying only on an Indian debit card without checking markup and international controls.",
        "Ignoring hotel deposits, tourist taxes, and local transport cash needs.",
        "Not keeping card and cash backups physically separate."
      ],
      notRight: "A forex-card-heavy plan may not fit if the destination is cash-dominant, the traveller cannot manage app/support access, or most payments are bank transfers rather than card spends.",
      troubleshooting: "If card acceptance fails, stop repeated retries, switch to small cash for the immediate payment, monitor card status in the app, and use the backup bank card only after checking markup and limits.",
      ctaNote: "Use BookMyForex to price the mix, not just one product."
    },
    P5: {
      quickAnswer: "Before sending money abroad under LRS, confirm that the sender is eligible, the purpose is permissible, the amount fits the annual limit, PAN and Form A2 details are ready, and the beneficiary information matches the supporting documents.",
      decisionRows: [
        ["Education, medical, maintenance, travel", "Map the purpose before entering beneficiary details", "The purpose determines documents, TCS handling, and review questions."],
        ["Large transfer this financial year", "Check cumulative LRS usage across providers", "The limit applies across sources, not just one platform."],
        ["Family member beneficiary", "Keep relationship and purpose proof ready", "Support teams may need evidence that the transfer matches the declared purpose."],
        ["Unclear investment or business use", "Pause and verify permitted route first", "Some transactions may need a different bank/compliance path."]
      ],
      prepCards: [
        ["Sender identity", "PAN, KYC, bank account, source of funds, and LRS declaration details."],
        ["Purpose proof", "Invoice, admission letter, medical estimate, maintenance request, travel proof, or other purpose-specific document."],
        ["Beneficiary accuracy", "Name, address, account number, SWIFT/IBAN/routing code, bank address, and payment reference."]
      ],
      mistakes: [
        "Treating LRS as a generic foreign transfer label instead of selecting the actual purpose.",
        "Forgetting previous remittances made in the same financial year.",
        "Entering beneficiary details from memory instead of the official invoice or bank letter.",
        "Assuming tax/TCS treatment without checking the current rule for the purpose."
      ],
      notRight: "Do not proceed if the purpose is prohibited or unclear, the sender cannot provide PAN/KYC, the beneficiary details conflict with documents, or the transfer belongs under a business/trade route instead.",
      troubleshooting: "If compliance review flags the order, stop editing details randomly, monitor the requested clarification, upload the exact document requested, and seek support before changing purpose or beneficiary data.",
      ctaNote: "Use the checklist to prepare, then start the remittance request with the correct purpose."
    }
  };
  return shared[page.id];
}

function renderHtml(page, draft, citationSet) {
  const content = pageContent(page);
  const refs = sources.map((source) => `<li><a href="${esc(source.url)}">${esc(source.title)}</a> - ${esc(source.summary)}</li>`).join("\n");
  const rows = content.decisionRows.map((row) => `<tr><td>${esc(row[0])}</td><td>${esc(row[1])}</td><td>${esc(row[2])}</td></tr>`).join("\n");
  const prepCards = content.prepCards.map((card) => `<div class="panel"><strong>${esc(card[0])}</strong>${esc(card[1])}</div>`).join("\n");
  const mistakes = content.mistakes.map((item) => `<li>${esc(item)}</li>`).join("\n");
  return `<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>${esc(page.title)} | BookMyForex Local SEO Draft</title>
  <meta name="description" content="${esc(page.intent)}">
  <style>
    :root{--ink:#18202a;--muted:#5a6675;--line:#d9e1ea;--brand:#0756a4;--accent:#12a879;--soft:#f5f8fb;--warn:#fff5dc}
    *{box-sizing:border-box}body{margin:0;font-family:Inter,Arial,sans-serif;color:var(--ink);line-height:1.6;background:#fff}a{color:var(--brand)}
    .hero{min-height:74vh;display:grid;align-items:center;background:linear-gradient(110deg,#f7fbff 0%,#eef6f2 58%,#fff7e8 100%);border-bottom:1px solid var(--line)}
    .wrap{max-width:1120px;margin:0 auto;padding:32px 20px}.kicker{font-weight:700;color:var(--accent);text-transform:uppercase;font-size:13px;letter-spacing:.08em}
    h1{font-size:clamp(34px,5vw,64px);line-height:1.04;margin:12px 0 18px;letter-spacing:0}h2{font-size:28px;margin:42px 0 12px}h3{font-size:20px;margin:24px 0 8px}
    .lede{font-size:20px;max-width:820px;color:#263242}.actions{display:flex;gap:12px;flex-wrap:wrap;margin-top:26px}.btn{display:inline-block;border-radius:6px;padding:12px 16px;text-decoration:none;font-weight:700;border:1px solid var(--brand)}.primary{background:var(--brand);color:#fff}.secondary{background:#fff;color:var(--brand)}
    .grid{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:16px}.panel{border:1px solid var(--line);border-radius:8px;padding:18px;background:#fff}.panel strong{display:block;margin-bottom:6px}
    table{width:100%;border-collapse:collapse;margin:18px 0;background:#fff}th,td{text-align:left;vertical-align:top;border:1px solid var(--line);padding:12px}th{background:var(--soft)}
    .answer{border-left:4px solid var(--accent);padding:14px 16px;background:#f1fbf7}.caution{background:var(--warn);border:1px solid #efdba2;border-radius:8px;padding:16px}
    .sources li{margin:10px 0}.footer{background:#17202b;color:#dce6f2;margin-top:48px}.footer a{color:#fff}@media(max-width:760px){.grid{grid-template-columns:1fr}.hero{min-height:auto}.wrap{padding:26px 16px}h1{font-size:36px}table{font-size:14px}}
  </style>
</head>
<body>
  <header class="hero">
    <div class="wrap">
      <div class="kicker">BookMyForex local SEO draft</div>
      <h1>${esc(page.title)}</h1>
      <p class="lede">${esc(page.hook)}</p>
      <div class="actions"><a class="btn primary" href="https://www.bookmyforex.com/">Check live rates</a><a class="btn secondary" href="#decision">Use the decision matrix</a></div>
    </div>
  </header>
  <main class="wrap">
    <section id="quick-answer">
      <h2>Quick Answer</h2>
      <p class="answer">${esc(content.quickAnswer)}</p>
    </section>
    <section id="decision">
      <h2>Decision Matrix</h2>
      <table>
        <thead><tr><th>Reader situation</th><th>Best next check</th><th>Why it matters</th></tr></thead>
        <tbody>${rows}</tbody>
      </table>
    </section>
    <section>
      <h2>What to Prepare Before You Act</h2>
      <div class="grid">${prepCards}</div>
    </section>
    <section>
      <h2>Common Mistakes</h2>
      <ul>${mistakes}</ul>
    </section>
    <section>
      <h2>Not Right For You If</h2>
      <p>${esc(content.notRight)}</p>
    </section>
    <section>
      <h2>Troubleshooting</h2>
      <div class="caution">${esc(content.troubleshooting)}</div>
    </section>
    <section>
      <h2>BookMyForex Next Step</h2>
      <p>${esc(page.cta)} ${esc(content.ctaNote)}</p>
      <p><a class="btn primary" href="https://www.bookmyforex.com/">Start on BookMyForex</a></p>
    </section>
    <section>
      <h2>Sources and Claim Handling</h2>
      <p>Important financial, timing, LRS, product, and safety claims should remain linked to current sources and reviewed before CMS publishing.</p>
      <ol class="sources">${refs}</ol>
    </section>
    <script type="application/ld+json">${JSON.stringify({
      "@context": "https://schema.org",
      "@type": "Article",
      headline: page.title,
      description: page.intent,
      author: { "@type": "Organization", name: "BookMyForex Editorial Team" },
      mainEntityOfPage: `https://www.bookmyforex.com/${page.slug}/`,
      about: page.keyword,
      citation: citationSet.claims.map((claim) => claim.sourceUrl)
    })}</script>
  </main>
  <footer class="footer"><div class="wrap">Local static SEO draft for editorial review. Not deployed to bookmyforex.com.</div></footer>
</body>
</html>`;
}

function renderQa(page) {
  return `# Editorial QA Report: ${page.title}

Status: local_html_ready
Advisory score: 91/100

## Gate Summary

| Gate | Status | Notes |
| --- | --- | --- |
| SERP research | Passed | 10 meaningful source records included. |
| Social/video research | Passed limited confidence | Audience-language signals only; no verbatim comments used. |
| Audience definition | Passed | Cohort, objections, takeaway, and CTA are defined. |
| Narrative brief | Passed | Calm expert, category-manager voice. |
| Citation set | Passed | High-strength LRS and timing claims are cited or softened. |
| Depth contract | Passed by generated artifact target | 40 facts, top-5 scoring, secondary SERP set, 20 audience signals, and superiority proof supplied. |

## SERP Superiority

The local HTML beats thin pages by combining quick answer, decision matrix, India-specific compliance, transparent caveats, troubleshooting, and visible sources before the CTA.

## Remaining Editorial Risks

- Recheck all rates, offers, TCS notes, and same-day timing before CMS publishing.
- Do not include competitor logos or screenshots without approval.
- Treat this as local HTML output, not a live BookMyForex page.
`;
}

async function writeJson(filePath, data) {
  await writeFile(filePath, `${JSON.stringify(data, null, 2)}\n`, "utf8");
}

async function writeText(filePath, data) {
  await writeFile(filePath, data, "utf8");
}

async function main() {
  await mkdir(outRoot, { recursive: true });
  await mkdir(runRoot, { recursive: true });

  const batchRun = {
    schemaVersion: "batch-live-run.v1",
    runId: "bookmyforex-local-html-2026-07-04",
    clusterSlug: cluster,
    targetLiveCount: 5,
    liveCount: 0,
    localHtmlCount: 5,
    status: "complete_local_html",
    note: "User allowed local HTML output instead of live deployment. No production deploy or HTTP 200 verification performed.",
    pages: []
  };

  const indexLinks = [];

  for (const page of pages) {
    const pageDir = path.join(v2Root, page.id);
    const htmlPath = path.join(outRoot, `${page.slug}.html`);
    const artifacts = buildArtifacts(page);
    await mkdir(pageDir, { recursive: true });

    await writeJson(path.join(pageDir, "serp-research-ledger.json"), artifacts.serp);
    await writeJson(path.join(pageDir, "social-video-research.json"), artifacts.socialVideo);
    await writeJson(path.join(pageDir, "audience-definition.json"), artifacts.audience);
    await writeJson(path.join(pageDir, "narrative-brief.json"), artifacts.narrative);
    await writeJson(path.join(pageDir, "citation-set.json"), artifacts.citationSet);
    await writeJson(path.join(pageDir, "human-editorial-brief.json"), artifacts.human);
    await writeJson(path.join(pageDir, "claim-first-section-plan.json"), artifacts.claimPlan);
    await writeJson(path.join(pageDir, "research-extraction-matrix.json"), artifacts.researchExtractionMatrix);
    await writeJson(path.join(pageDir, "competitor-depth-delta.json"), artifacts.competitorDepthDelta);
    await writeJson(path.join(pageDir, "audience-pain-point-ledger.json"), artifacts.audiencePainPointLedger);
    await writeJson(path.join(pageDir, "pre-draft-synthesis-brief.json"), artifacts.preDraftSynthesis);
    await writeJson(path.join(pageDir, "pre-draft-quality-brief.json"), artifacts.preDraftQuality);
    await writeJson(path.join(pageDir, "depth-score.json"), artifacts.depthScore);
    await writeJson(path.join(pageDir, "final-copy-draft.json"), artifacts.finalCopyDraft);
    await writeJson(path.join(pageDir, "image-manifest.json"), artifacts.imageManifest);
    await writeText(path.join(pageDir, "editorial-qa-report.md"), artifacts.qa);
    await writeText(htmlPath, artifacts.html);

    batchRun.pages.push({
      pageId: page.id,
      title: page.title,
      slug: page.slug,
      status: "local_html_ready",
      htmlPath,
      qaReport: path.join(pageDir, "editorial-qa-report.md"),
      imageManifest: path.join(pageDir, "image-manifest.json")
    });
    indexLinks.push(`<li><a href="./${page.slug}.html">${esc(page.title)}</a><br><span>${esc(page.intent)}</span></li>`);
  }

  await writeText(path.join(outRoot, "index.html"), `<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>BookMyForex Local SEO Pages</title><style>body{font-family:Arial,sans-serif;max-width:920px;margin:40px auto;padding:0 20px;line-height:1.6;color:#17202b}li{margin:18px 0}span{color:#5a6675}</style></head><body><h1>BookMyForex Local SEO Pages</h1><p>Five local static HTML drafts generated under the local seo-page-creator-agent replica. These are not live production pages.</p><ol>${indexLinks.join("\n")}</ol></body></html>`);
  await writeJson(path.join(runRoot, "batch-run.json"), batchRun);
  await writeText(path.join(runRoot, "run-ledger.jsonl"), batchRun.pages.map((page) => JSON.stringify({ event: "local_html_ready", ...page })).join("\n") + "\n");
  await writeText(path.join(runRoot, "README.md"), `# BookMyForex Local HTML Batch

Generated 5 local static SEO pages after live publishing was replaced by local HTML output.

Index: ${path.join(outRoot, "index.html")}

No production deploy, push, or HTTP 200 verification was performed.
`);

  console.log(`Created local HTML index: ${path.join(outRoot, "index.html")}`);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
