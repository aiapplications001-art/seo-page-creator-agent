import { mkdir, writeFile } from "node:fs/promises";
import { createInitialV2PageState } from "./state.js";
import type { V2PageState } from "./types.js";
import { getV2PageDir, v2ArtifactPath } from "./paths.js";

export interface PrepareV2PageWorkspaceInput {
  cwd: string;
  clusterSlug: string;
  pageId: string;
  pageType: string;
}

export interface PrepareV2PageWorkspaceResult {
  pageDir: string;
  state: V2PageState;
  createdFiles: string[];
}

export async function prepareV2PageWorkspace(input: PrepareV2PageWorkspaceInput): Promise<PrepareV2PageWorkspaceResult> {
  const pageDir = await getV2PageDir(input.cwd, input.clusterSlug, input.pageId);
  const state = createInitialV2PageState(input);
  const createdFiles: string[] = [];

  await mkdir(pageDir, { recursive: true });

  await writeJson(pageDir, "page-state.json", state, createdFiles);
  await writeJson(pageDir, "serp-research-ledger.json", seedSerpResearchLedger(), createdFiles);
  await writeMarkdown(pageDir, "serp-research-ledger.md", "# SERP Research Ledger\n\nStatus: missing\n", createdFiles);
  await writeJson(pageDir, "social-video-research.json", seedSocialVideoResearch(), createdFiles);
  await writeMarkdown(pageDir, "social-video-research.md", "# Social/Video Research\n\nStatus: missing\n", createdFiles);
  await writeJson(pageDir, "audience-definition.json", seedAudienceDefinition(), createdFiles);
  await writeMarkdown(pageDir, "audience-definition.md", "# Audience Definition\n\nStatus: missing\n", createdFiles);
  await writeJson(pageDir, "narrative-brief.json", seedNarrativeBrief(), createdFiles);
  await writeMarkdown(pageDir, "narrative-brief.md", "# Narrative Brief\n\nStatus: missing\n", createdFiles);
  await writeJson(pageDir, "human-editorial-brief.json", seedHumanEditorialBrief(input.pageType), createdFiles);
  await writeMarkdown(pageDir, "human-editorial-brief.md", renderHumanEditorialBriefMarkdown(input.pageType), createdFiles);
  await writeJson(pageDir, "claim-first-section-plan.json", seedClaimFirstSectionPlan(), createdFiles);
  await writeMarkdown(pageDir, "claim-first-section-plan.md", renderClaimFirstSectionPlanMarkdown(), createdFiles);
  await writeJson(pageDir, "research-extraction-matrix.json", seedResearchExtractionMatrix(), createdFiles);
  await writeMarkdown(pageDir, "research-extraction-matrix.md", renderResearchExtractionMatrixMarkdown(), createdFiles);
  await writeJson(pageDir, "competitor-depth-delta.json", seedCompetitorDepthDelta(), createdFiles);
  await writeMarkdown(pageDir, "competitor-depth-delta.md", renderCompetitorDepthDeltaMarkdown(), createdFiles);
  await writeJson(pageDir, "audience-pain-point-ledger.json", seedAudiencePainPointLedger(), createdFiles);
  await writeMarkdown(pageDir, "audience-pain-point-ledger.md", renderAudiencePainPointLedgerMarkdown(), createdFiles);
  await writeJson(pageDir, "pre-draft-synthesis-brief.json", seedPreDraftSynthesisBrief(), createdFiles);
  await writeMarkdown(pageDir, "pre-draft-synthesis-brief.md", renderPreDraftSynthesisBriefMarkdown(), createdFiles);
  await writeJson(pageDir, "pre-draft-quality-brief.json", seedPreDraftQualityBrief(), createdFiles);
  await writeMarkdown(pageDir, "pre-draft-quality-brief.md", renderPreDraftQualityBriefMarkdown(), createdFiles);
  await writeJson(pageDir, "depth-score.json", seedDepthScore(), createdFiles);
  await writeMarkdown(pageDir, "depth-score.md", renderDepthScoreMarkdown(), createdFiles);
  await writeJson(pageDir, "citation-set.json", seedCitationSet(), createdFiles);
  await writeMarkdown(pageDir, "citation-set.md", "# Citation Set\n\nStatus: missing\n", createdFiles);
  await writeJson(pageDir, "final-copy-draft.json", seedFinalCopyDraft(), createdFiles);
  await writeMarkdown(pageDir, "final-copy-draft.md", renderFinalCopyDraftMarkdown(), createdFiles);
  await writeJson(pageDir, "section-version-history.json", {
    schemaVersion: "section-version-history.v2",
    entries: []
  }, createdFiles);
  await writeMarkdown(pageDir, "section-version-history.md", "# Section Version History\n\nNo section changes recorded yet.\n", createdFiles);

  return { pageDir, state, createdFiles };
}

async function writeJson(pageDir: string, fileName: string, value: unknown, createdFiles: string[]): Promise<void> {
  const target = v2ArtifactPath(pageDir, fileName);
  await writeFile(target, `${JSON.stringify(value, null, 2)}\n`, "utf8");
  createdFiles.push(target);
}

async function writeMarkdown(pageDir: string, fileName: string, value: string, createdFiles: string[]): Promise<void> {
  const target = v2ArtifactPath(pageDir, fileName);
  await writeFile(target, value, "utf8");
  createdFiles.push(target);
}

function seedSerpResearchLedger(): Record<string, unknown> {
  return {
    schemaVersion: "serp-research-ledger.v2",
    status: "missing",
    primaryKeyword: "",
    originalTop10: [],
    analyzedSources: [],
    contentGapSynthesis: {
      gaps: [],
      differentiationOpportunities: []
    }
  };
}

function seedSocialVideoResearch(): Record<string, unknown> {
  return {
    schemaVersion: "social-video-research.v2",
    status: "missing",
    assets: [],
    insights: [],
    confidence: "limited"
  };
}

function seedAudienceDefinition(): Record<string, unknown> {
  return {
    schemaVersion: "audience-definition.v2",
    status: "missing",
    targetCohort: "",
    awarenessStage: "",
    readerTakeaway: "",
    objections: [],
    ctaConnection: ""
  };
}

function seedNarrativeBrief(): Record<string, unknown> {
  return {
    schemaVersion: "narrative-brief.v2",
    status: "missing",
    primaryStyle: "",
    readerTakeaway: "",
    openingAngle: "",
    brandPov: "",
    sectionDirections: []
  };
}

function seedCitationSet(): Record<string, unknown> {
  return {
    schemaVersion: "citation-set.v2",
    status: "missing",
    claims: [],
    sources: []
  };
}

function seedFinalCopyDraft(): Record<string, unknown> {
  return {
    schemaVersion: "final-copy-draft.v2",
    status: "missing",
    adapter: "",
    generatedAt: "",
    sections: [],
    references: [],
    standoutElements: [],
    superiorityProof: {
      intentWinsDelivered: [],
      superiorityComponentsDelivered: [],
      differentiatedImprovementsDelivered: [],
      extractableAnswerBlocksDelivered: [],
      visibleCitationHandling: [],
      whyThisDeservesToRank: ""
    },
    structurePlanDeliveryProof: {
      primaryConcernDelivered: {
        sectionId: "",
        finalCopyEvidence: ""
      },
      highImpactComponentsDelivered: [],
      expectedVisibleOutputsDelivered: [],
      structureDecisionsDelivered: []
    },
    qaNotes: []
  };
}

function seedHumanEditorialBrief(pageType: string): Record<string, unknown> {
  const depth = depthForPageType(pageType);

  return {
    schemaVersion: "human-editorial-brief.v2",
    status: "missing",
    voiceModel: "category_manager_with_editorial_empathy",
    visibility: {
      default: "internal_only",
      editorVisibleSummary: "editorial_qa_report",
      debugBundle: "include_artifact_path_and_summary"
    },
    depthStrategy: {
      pageType,
      depth,
      framework: "five_w_plus_causal_chain",
      lengthBehavior: depth === "full" ? "auto_expand_when_useful" : "controlled_by_usefulness",
      requiredAngles: depth === "decision_relevant"
        ? ["what affects the decision", "what to choose", "what to avoid", "what tradeoffs matter"]
        : ["what", "why", "how", "who", "when", "where", "types or variants", "common mistakes", "practical next step"]
    },
    readerTension: {
      whatReaderIsConfusedAbout: "",
      whatReaderIsAnxiousAbout: "",
      decisionReaderNeedsToMake: ""
    },
    categoryManagerPov: {
      whatToChoose: "",
      whatToAvoid: "",
      whereBuyersGoWrong: "",
      whatTheBrandBelieves: "",
      tradeoffsThatMatter: []
    },
    exampleRequirement: {
      minimumExamplesPerPage: 2,
      priority: ["category_context", "india_context_when_relevant", "brand_context_only_when_proof_exists"],
      plannedExamples: []
    },
    humanDevices: {
      decisionFramework: {
        required: true,
        askUserOnce: true,
        selectedFormat: "",
        recommendedFormats: ["if_this_then_that", "comparison_table", "checklist", "scorecard", "criteria_table"]
      },
      commonMistakes: {
        required: true,
        standaloneSectionDefault: false,
        placement: "blended_into_relevant_sections",
        mistakesToCover: []
      },
      notRightForYou: {
        required: pageType === "product_category" || pageType === "comparison",
        recommended: pageType === "guide_blog",
        conditions: []
      },
      brandPov: {
        mode: "clear_not_salesy",
        firstPerson: "occasional"
      },
      readerQuestions: "natural_when_useful",
      analogies: "use_when_useful",
      decisionTrees: "preferred",
      microSummaries: "after_complex_explanations",
      simpleWordsExplainer: "only_when_necessary",
      finalClosingBeforeCta: "required"
    },
    qaSummary: {
      includeInEditorialQaReport: true,
      fields: [
        "voice model",
        "depth level",
        "examples count",
        "decision framework type",
        "brand POV used",
        "top human quality risks"
      ]
    }
  };
}

function seedClaimFirstSectionPlan(): Record<string, unknown> {
  return {
    schemaVersion: "claim-first-section-plan.v2",
    status: "missing",
    sectionPlanTemplate: {
      requiredFields: [
        "sectionId",
        "sectionClaim",
        "readerQuestion",
        "evidenceNeeded",
        "exampleOrTradeoff",
        "caveatOrNotRightForYou",
        "decisionPurpose",
        "transitionPurpose"
      ],
      guidance: "Draft every visible section from a claim, reader question, evidence need, and usefulness reason before writing final copy."
    },
    sections: []
  };
}

function seedResearchExtractionMatrix(): Record<string, unknown> {
  return {
    schemaVersion: "research-extraction-matrix.v2",
    status: "missing",
    thresholds: {
      minimumExtractedFacts: 40,
      minimumFactsPerAnalyzedSource: 3
    },
    extractedFacts: []
  };
}

function seedCompetitorDepthDelta(): Record<string, unknown> {
  return {
    schemaVersion: "competitor-depth-delta.v2",
    status: "missing",
    thresholds: {
      minimumCompetitorsAnalyzed: 5,
      minimumSpecificityImprovements: 10,
      minimumPrimarySerpPages: 5,
      minimumSecondarySerpPagesPerKeyword: 3
    },
    primaryKeyword: "",
    primarySerpTop5: [],
    secondaryKeywordSerps: [],
    competitors: [],
    specificityImprovements: []
  };
}

function seedAudiencePainPointLedger(): Record<string, unknown> {
  return {
    schemaVersion: "audience-pain-point-ledger.v2",
    status: "missing",
    thresholds: {
      minimumAudienceSignals: 20,
      minimumSignalsMappedPerMajorSection: 2
    },
    signals: []
  };
}

function seedPreDraftSynthesisBrief(): Record<string, unknown> {
  return {
    schemaVersion: "pre-draft-synthesis-brief.v2",
    status: "missing",
    thresholds: {
      minimumWords: 500,
      maximumWords: 900
    },
    wordCount: 0,
    searchIntent: "",
    audienceAnxieties: [],
    competitorGaps: [],
    recommendedAngle: "",
    sectionPromises: [],
    evidenceInventory: []
  };
}

function seedPreDraftQualityBrief(): Record<string, unknown> {
  return {
    schemaVersion: "pre-draft-quality-brief.v2",
    status: "missing",
    thresholds: {
      minimumSubIntents: 6,
      minimumDiagnosticDepthItems: 4,
      minimumIndiaSpecificAngles: 4,
      minimumSafetyTrustRequirements: 4,
      minimumReaderQuestions: 8,
      minimumRecommendationSanityChecks: 3,
      minimumClaimRiskItems: 5,
      minimumTroubleshootingItems: 4,
      minimumIntentDimensions: 4,
      minimumSuperiorityComponents: 1,
      minimumDifferentiatedImprovements: 5,
      minimumExtractableAnswerBlocks: 3,
      minimumAiOverviewTargets: 3,
      minimumInternalLinkTargets: 5
    },
    requiredDimensions: [
      "intent_completeness",
      "diagnostic_depth",
      "india_specificity",
      "safety_trust",
      "standout_element",
      "brand_connection",
      "publish_worthiness",
      "serp_superiority",
      "source_diversity",
      "visible_information_gain",
      "ai_overview_extractability",
      "internal_linking"
    ],
    searchIntent: "",
    subIntents: [],
    diagnosticPlan: [],
    indiaSpecificity: [],
    safetyTrustPlan: [],
    standoutElement: {
      type: "",
      title: "",
      whyCompetitorsMissIt: ""
    },
    brandConnection: "",
    readerQuestionCoverage: [],
    recommendationSanityPlan: [],
    claimRiskPlan: [],
    troubleshootingPlan: [],
    brandCtaFit: {
      readerProblem: "",
      supportedCtaPromise: "",
      unsupportedClaimsToAvoid: []
    },
    intentDimensions: [],
    superiorityComponents: [],
    differentiatedImprovements: [],
    extractableAnswerBlocks: [],
    researchDerivedStructurePlan: {
      primaryUserConcern: "",
      primaryConcernVisibleBySectionId: "",
      primaryConcernVisibleBySectionIndex: 0,
      importantInformationNotBuried: false,
      scanPriorityRationale: "",
      sectionOrderRationale: "",
      sections: [],
      highImpactComponents: [],
      structureDecisions: [],
      structureComparison: {
        comparedCurrentBatchPageIds: [],
        comparedHistoricalPageIds: [],
        reusedStructureRisk: "",
        materialDifferences: []
      }
    },
    aiOverviewTargets: [],
    internalLinkPlan: [],
    notes: []
  };
}

function seedDepthScore(): Record<string, unknown> {
  return {
    schemaVersion: "page-depth-score.v2",
    status: "missing",
    thresholds: {
      minimumOverallScore: 85,
      minimumDimensionScore: 4,
      minimumInformationGainItems: 8
    },
    overallScore: 0,
    dimensions: {
      searchIntentCoverage: 0,
      serpGapCoverage: 0,
      socialPainPointCoverage: 0,
      topicalEntityCompleteness: 0,
      brandProductSpecificity: 0,
      evidenceCitationQuality: 0,
      originalInsightUsefulness: 0,
      structureReadability: 0,
      conversionUsefulness: 0,
      technicalSeoCompleteness: 0
    },
    informationGainItems: [],
    sectionEvidenceBudgets: []
  };
}

function renderHumanEditorialBriefMarkdown(pageType: string): string {
  const depth = depthForPageType(pageType);
  return `# Human Editorial Brief

Status: missing
Visibility: internal-only by default. Show only a short summary in the editorial QA report.

## Voice Model

Category Manager With Editorial Empathy

- Write in English only.
- Be commercially aware and opinionated where useful.
- Explain background deeply when the topic is complex.
- Reduce anxiety through clarity, not generic reassurance.
- Use occasional first-person brand POV only in key POV, trust, and CTA moments.

## Depth Strategy

- Page type: ${pageType}
- Depth: ${depth}
- Framework: 5W plus causal chain

Use decision-first background: begin with the practical reader decision, then explain the background behind it.

For deep topics, answer what, why, how, who, when, where, types or variants, common mistakes, and practical next step.

## Required Human Touches

- At least 2 useful examples or scenarios per page.
- Example priority: category context first, India context when relevant, brand context only with proof.
- Decision framework/table required once per page. Ask the user once for the preferred format.
- Common mistakes are mandatory but should be blended into relevant sections by default.
- "Not right for you" guidance is mandatory for product/category and comparison pages, recommended for guide/blog pages.
- Use natural reader questions when they mirror real confusion.
- Use simple practical analogies only when useful.
- Use micro-summaries after complex explanations.
- Add a short human closing before the CTA.

## Example Pattern

\`\`\`yaml
planned_example:
  section_id: S4_main_content
  context_type: category
  purpose: clarify the decision or tradeoff
  proof_required: false
  example_note: If the reader is choosing acne treatment, show how recurring jawline acne differs from occasional clogged-pore breakouts.
\`\`\`
`;
}

function renderClaimFirstSectionPlanMarkdown(): string {
  return `# Claim-First Section Plan

Status: missing

Before final copy, every visible section should be planned from a claim and a reader decision.

## Section Template

\`\`\`yaml
section_id:
section_claim:
reader_question:
evidence_needed:
example_or_tradeoff:
caveat_or_not_right_for_you:
decision_purpose:
transition_purpose:
\`\`\`

## Example

\`\`\`yaml
section_id: S3_context
section_claim: Acne treatment works better when the reader first identifies the acne pattern.
reader_question: Why did my previous acne products not work?
evidence_needed: Source-backed acne type or trigger guidance.
example_or_tradeoff: Recurring jawline acne may need a different path from occasional forehead bumps after a new product.
caveat_or_not_right_for_you: Do not treat painful or worsening acne casually.
decision_purpose: Help the reader choose diagnosis-first action instead of random product switching.
transition_purpose: Move from background explanation to decision framework.
\`\`\`
`;
}

function renderResearchExtractionMatrixMarkdown(): string {
  return `# Research Extraction Matrix

Status: missing

Final copy is blocked until \`seo-agent v2 validate-depth\` passes.

Extract usable facts, not just titles, meta descriptions, or general summaries.

Minimums:

- 40 extracted facts total.
- At least 3 facts per analyzed source.
- Every fact needs a claim, source URL, section relevance, evidence type, confidence, freshness, and contradiction notes when relevant.
`;
}

function renderCompetitorDepthDeltaMarkdown(): string {
  return `# Competitor Depth Delta

Status: missing

Final copy is blocked until \`seo-agent v2 validate-depth\` passes.

Analyze the top competing pages section by section. Record what they cover, miss, overdo, explain vaguely, or fail to connect to a decision.

Minimums:

- Primary keyword top 5 SERP pages analyzed with full strength scoring.
- At least 1 secondary keyword or long-tail SERP analyzed with top 3 pages.
- 5 competing pages analyzed.
- 10 specific ways this page will be more useful, concrete, or decision-helpful than the competitors.

Primary SERP scoring dimensions for each top 5 page:

- intentMatch
- topIntentCoverage
- depthAndSpecificity
- originalityInformationGain
- evidenceAndTrust
- audienceSpecificity
- decisionUsefulness
- informationArchitecture
- riskHandling
- practicalCompleteness
- uxPageExperience

Define a competitor as strong when it has at least 4/5 on intentMatch and topIntentCoverage, at least 3/5 on decisionUsefulness, depthAndSpecificity, and practicalCompleteness, at least 3/5 on uxPageExperience, and at least 3 evidence notes. Strong competitors make parity insufficient: the new page must add at least one major information-gain component and at least 5 differentiated section improvements.

Suggested JSON fields:

- \`primaryKeyword\`
- \`primarySerpTop5[].url\`, \`rankingPosition\`, \`strengthLabel\`, \`scores\`, \`evidenceNotes\`, \`standoutAssets\`, \`whyUsersMightStopSearching\`
- \`secondaryKeywordSerps[].keyword\` and \`topPages[]\` with \`url\`, \`rankingPosition\`, \`intentContribution\`, and \`usefulGap\`
`;
}

function renderAudiencePainPointLedgerMarkdown(): string {
  return `# Audience Pain-Point Ledger

Status: missing

Final copy is blocked until \`seo-agent v2 validate-depth\` passes.

Extract real user questions, objections, complaints, anxieties, and wording from social/video/forum research. Map each signal to the section where it will improve the page.

Minimums:

- 20 audience signals.
- Each major H2 should be informed by at least 2 audience-derived concerns when possible.
`;
}

function renderPreDraftSynthesisBriefMarkdown(): string {
  return `# Pre-Draft Synthesis Brief

Status: missing

Final copy is blocked until \`seo-agent v2 validate-depth\` passes.

Before writing final copy, prove the page has a useful mental model.

Required length: 500-900 words.

Include:

- Search intent.
- Audience anxieties.
- Competitor gaps.
- Recommended angle.
- Section promises.
- Evidence inventory.
`;
}

function renderPreDraftQualityBriefMarkdown(): string {
  return `# Pre-Draft Quality Brief

Status: missing

Final copy is blocked until \`seo-agent v2 validate-depth\` passes.

Fill this before writing prose. This brief prevents thin routine-style pages by proving the page can become diagnostic, safety-led, India-specific, brand-relevant, and meaningfully better than competitors.

Required minimums:

- 6 sub-intents.
- 4 diagnostic depth items.
- 4 India-specific angles.
- 4 safety and trust requirements.
- 1 standout element competitors do not have.
- 1 natural brand connection.
- 8 real reader questions from SERP/social/video/forum research.
- 3 recommendation sanity checks for products, tools, services, or actives mentioned.
- 5 claim-risk items that require citations or careful wording.
- 4 troubleshooting items that answer what to do if the advice makes things worse.
- 4-7 intent dimensions, with superiority required on the top 4 dimensions.
- 1+ required superiority component custom-created from this page's research.
- 5 differentiated improvements across visible sections.
- 3 extractable answer blocks: quick answer, decision/action answer, and troubleshooting/safety answer when relevant.
- 1 brand CTA fit that states what the brand can support and what it must not claim.
- 3 AI Overview/extractable answer targets.
- 5 internal link targets.

SERP Superiority Gate:

- Use the primary keyword top 5, secondary keyword top 3, People Also Ask, AI Overview, Reddit/forum/video/social insights, long-tail variants, and trust/citation sources.
- Require superiority on the top 4 main intent dimensions. Lower-priority dimensions may be parity.
- If competitors are strong, parity fails. Add at least 1 major superiority component and 5 differentiated improvements.
- Every superiority component must be custom-created from research findings, mapped to a section, and represented in final copy as visible content such as a table, checklist, flow, image, calculator-style matrix, or interactive note.
- If no strong competitor component exists, prove the top competitors were reviewed and explain why the new component fills an empty gap.
- Require source diversity across primary SERP competitors, one secondary/long-tail source, one audience-language source, and one trust/citation source for skincare/medical/safety claims.
- AI Overview targets must become safer, more complete, humanized, keyword-aware answer blocks without copying Google's wording.

Quality prompts:

- What is the exact search intent?
- What are the 6-10 sub-intents the page must satisfy?
- What diagnostic table, decision matrix, checklist, calculator-style table, or comparison framework will make this page stand out?
- What Indian climate, market, skin tone, product availability, city, season, language, or behavior nuance matters?
- What medical/safety/trust warnings, reviewer proof, dates, citations, and when-to-see-an-expert guidance are needed?
- What user questions from SERP, Reddit/forums, YouTube, and social discussions must be answered?
- What products, actives, tools, or services might be recommended, and what inclusion reason, avoid-if condition, and source support will each need?
- Which phrases would be unsafe if unsupported, such as clinically proven, dermatologist-approved, safest, non-comedogenic, guaranteed, or AI diagnosis?
- What should readers do if the routine/product/step causes breakouts, tightness, irritation, burning, worsening redness, or no improvement?
- What are the top 4 intent dimensions where this page must beat the SERP?
- What on-page component will visibly make the page better than the top results?
- Which 5 section-level improvements are differentiated because of SERP, secondary-keyword, Reddit/forum/video, PAA, or AI Overview gaps?
- Which claims need visible citations, and which lower-risk claims should be softened instead?
- How does the brand naturally help the reader without sounding pasted in?
- What claims should the brand CTA avoid because they are not supported by product capability or reviewer proof?

Weak filler is invalid even when counts are met. Do not use generic entries such as "What is this?", "Recommend good products", "Cite claims", or "Help if it gets worse." Every item must be specific, evidence-aware, and decision-useful.

Each item in \`readerQuestionCoverage\`, \`recommendationSanityPlan\`, \`claimRiskPlan\`, and \`troubleshootingPlan\` must include \`item\`, \`sourceRefs\`, \`mappedSectionId\`, \`whyThisMatters\`, and \`finalCopyUse\`. Use source refs from extracted fact ids, audience signal ids, or analyzed source URLs already present in the depth artifacts.

Suggested JSON shape:

\`\`\`json
{
  "schemaVersion": "pre-draft-quality-brief.v2",
  "status": "complete",
  "searchIntent": "Reader job in one sentence.",
  "subIntents": ["cause", "identify", "routine", "ingredient choice", "safety", "timeline"],
  "diagnosticPlan": ["table or decision aid"],
  "indiaSpecificity": ["humidity", "pollution", "PIH", "SPF availability"],
  "safetyTrustPlan": ["reviewer credentials", "stop rules", "when to see an expert", "citations"],
  "standoutElement": {
    "type": "diagnostic_matrix",
    "title": "Standout element title",
    "whyCompetitorsMissIt": "Specific competitor gap"
  },
  "brandConnection": "How the brand helps this uncertainty.",
  "intentDimensions": [
    {
      "id": "D1",
      "label": "diagnosis",
      "priority": 1,
      "sourceRefs": ["https://competitor.example/top-1", "F1", "A1"],
      "plannedWin": "How this page will beat the SERP on this intent dimension.",
      "competitorBenchmark": "What top competitors currently do."
    }
  ],
  "superiorityComponents": [
    {
      "id": "custom-component-1",
      "componentType": "decision_matrix",
      "title": "Component title",
      "researchBasis": "Specific research finding that proves this is needed.",
      "sourceRefs": ["https://competitor.example/top-1", "F2", "A2"],
      "mappedSectionId": "S4_decision",
      "intentDimensionSupported": "D1",
      "competitorGapAddressed": "What competitors miss.",
      "whyThisIsInformationGain": "Why readers learn or decide something new.",
      "competitorComponentComparison": {
        "comparisonPath": "beat_existing_component",
        "competitorsReviewed": ["https://competitor.example/top-1"],
        "whyOursIsBetterOrNeeded": "Why this visible component is equivalent or better."
      },
      "finalCopyBlock": "Markdown table, checklist, flow, image brief, or interactive note that will appear in final copy.",
      "imageOrInteractiveNeed": "Optional image or interactive component need.",
      "fallbackContent": "Static content version if image/interactive cannot be built.",
      "primaryReaderJob": "Reader job served first.",
      "brandFit": "Light brand-fit explanation.",
      "naturalCtaConnection": "soft",
      "unsupportedBrandClaimsToAvoid": ["Unsupported brand claim"]
    }
  ],
  "researchDerivedStructurePlan": {
    "primaryUserConcern": "The main thing the reader came to learn or avoid.",
    "primaryConcernVisibleBySectionId": "S2_quick_answer",
    "primaryConcernVisibleBySectionIndex": 2,
    "importantInformationNotBuried": true,
    "scanPriorityRationale": "Why the main intent must be visible near the top.",
    "sectionOrderRationale": "Why this page order follows the research instead of a reusable template.",
    "sections": [
      {
        "sectionId": "S2_quick_answer",
        "sectionRole": "quick answer",
        "sectionAction": "add",
        "targetSectionTitle": "Research-derived section title",
        "whyThisSectionExists": "Specific SERP, audience, or trust finding that requires this section.",
        "sourceRefs": ["https://competitor.example/top-1", "F1", "A1"],
        "intentDimensionRefs": ["D1"],
        "competitorOrUserGap": "Specific gap this section closes.",
        "expectedVisibleOutput": "What the reader will visibly see in final copy.",
        "competitorGapRefs": ["https://competitor.example/top-1"],
        "audienceLanguageRefs": ["A1"],
        "trustCitationRefs": ["F1"],
        "finalCopyUse": "How final copy must use this section.",
        "finalCopyAcceptanceCheck": "Visible check that proves this made it into final copy.",
        "scanPriority": "top",
        "readerQuestionAnswered": "Concrete reader question answered here.",
        "differentiatesFromPageIds": ["current-batch-or-historical-page-id"]
      }
    ],
    "highImpactComponents": [
      {
        "componentType": "decision_matrix",
        "mappedSectionId": "S4_decision",
        "readerJob": "Reader decision this component serves.",
        "whyThisComponentExists": "Specific research finding that requires this shape.",
        "sourceRefs": ["https://competitor.example/top-2", "F2", "A2"],
        "intentDimensionRefs": ["D2"],
        "competitorOrAudienceGapAddressed": "Gap this component beats or fills.",
        "competitorGapRefs": ["https://competitor.example/top-2"],
        "audienceLanguageRefs": ["A2"],
        "trustCitationRefs": ["F2"],
        "visibleReaderBenefit": "Why this improves scanning and action.",
        "notGenericReason": "Why this is not a reused table/template.",
        "columnsOrSteps": ["specific", "research-derived", "columns", "or steps"],
        "whyThisShape": "Why table, matrix, checklist, flow, image, or interactive is the right shape.",
        "expectedVisibleOutput": "Exact visible output to appear in final copy.",
        "finalCopyAcceptanceCheck": "How final copy proves the component was delivered."
      }
    ],
    "structureDecisions": [
      {
        "sectionId": "S4_decision",
        "sectionAction": "add",
        "targetSectionTitle": "Research-derived decision section",
        "sourceRefs": ["https://competitor.example/top-2", "F2", "A2"],
        "competitorOrUserGap": "Specific reason this structure is needed.",
        "whyThisStructureIsNeeded": "Why the page must change shape after research.",
        "expectedVisibleOutput": "Visible section, table, checklist, image, or interactive output.",
        "finalCopyAcceptanceCheck": "What must be present in final copy."
      }
    ],
    "structureComparison": {
      "comparedCurrentBatchPageIds": ["page-id-1"],
      "comparedHistoricalPageIds": ["older-page-id"],
      "reusedStructureRisk": "low",
      "materialDifferences": ["Specific structural difference from other generated pages."]
    }
  },
  "differentiatedImprovements": [
    {
      "improvement": "Visible section-level improvement.",
      "sourceRefs": ["https://competitor.example/top-2", "F3", "A3"],
      "intentDimension": "D2",
      "competitorOrUserGapAddressed": "Gap found in competitor, secondary keyword, Reddit/forum/video, PAA, or AI Overview research.",
      "mappedSectionId": "S5_comparison",
      "visibleOutputType": "table",
      "finalOutputLocation": "S5_comparison",
      "finalCopyEvidence": "How the final copy will visibly include it.",
      "whyDifferentiated": "Why this is not just comprehensive but distinct."
    }
  ],
  "readerQuestionCoverage": [
    {
      "item": "Real long-tail reader question?",
      "sourceRefs": ["F1", "A3"],
      "mappedSectionId": "S4_decision",
      "whyThisMatters": "Why this question changes the reader decision.",
      "finalCopyUse": "How final copy will answer this question."
    }
  ],
  "recommendationSanityPlan": [
    {
      "item": "Recommendation role, avoid-if condition, suitability, and evidence need.",
      "sourceRefs": ["F2"],
      "mappedSectionId": "S5_comparison",
      "whyThisMatters": "Why this prevents an unsafe or lazy recommendation.",
      "finalCopyUse": "How final copy will frame the recommendation."
    }
  ],
  "claimRiskPlan": [
    {
      "item": "Unsupported claim pattern to cite, rewrite, or avoid.",
      "sourceRefs": ["F3"],
      "mappedSectionId": "S6_trust",
      "whyThisMatters": "Why this claim could mislead without evidence.",
      "finalCopyUse": "How final copy will soften or cite the claim."
    }
  ],
  "troubleshootingPlan": [
    {
      "item": "If a specific symptom happens, stop/switch/repair/monitor/escalate.",
      "sourceRefs": ["A4"],
      "mappedSectionId": "S7_faq",
      "whyThisMatters": "Why this protects readers when advice does not work.",
      "finalCopyUse": "How final copy will give the stop or escalation rule."
    }
  ],
  "brandCtaFit": {
    "readerProblem": "Uncertainty the CTA helps with.",
    "supportedCtaPromise": "Specific supported brand action.",
    "unsupportedClaimsToAvoid": ["diagnosis claim", "unsupported measurement claim"]
  },
  "extractableAnswerBlocks": [
    {
      "blockType": "quick_answer",
      "answer": "Short answer that is safer and more useful than AI Overview or SERP summaries.",
      "sourceRefs": ["F4", "A4"],
      "mappedSectionId": "S2_quick_answer",
      "keywordUse": ["primary keyword", "long-tail variant"],
      "aiOverviewDelta": "What this answer adds without copying AI Overview."
    }
  ],
  "aiOverviewTargets": ["direct answer block", "comparison table", "FAQ cluster"],
  "internalLinkPlan": ["supporting guide 1", "supporting guide 2"]
}
\`\`\`
`;
}

function renderDepthScoreMarkdown(): string {
  return `# Page Depth Score

Status: missing

Final copy, images, commit, and publish are blocked until \`seo-agent v2 validate-depth\` passes.

Publish threshold:

- Overall score: at least 85/100.
- Every dimension: at least 4/5.
- At least 8 information-gain items.
- Every major section must have 2 facts, 1 cited claim, and 1 concrete usefulness item.

If this fails during repair, add new research before rewriting prose.
`;
}

function renderFinalCopyDraftMarkdown(): string {
  return `# Final Copy Draft

Status: missing

The deterministic CLI does not write final prose for V2.1 pages. An adapter must write the final copy here after \`validate-human\`, \`validate-gates\`, and \`validate-depth\` pass.

Every visible section needs adapter-written markdown. Informational sections also need evidence refs and citation claim ids.

Blocked phrases:

- This section should
- The page should explain
- Use this section
- Replace this
- Reference URLs still need
- Editable scaffold

Required JSON shape:

\`\`\`json
{
  "schemaVersion": "final-copy-draft.v2",
  "adapter": "antigravity",
  "generatedAt": "2026-07-02T10:00:00.000Z",
  "sections": [
    {
      "sectionId": "S2_quick_answer",
      "markdown": "Adapter-written final prose.",
      "evidenceRefs": ["F1"],
      "citationClaimIds": ["C1"],
      "audienceSignalIds": ["A1"],
      "standoutElementRefs": ["decision-tree-1"]
    }
  ],
  "references": [
    {
      "sourceUrl": "https://example.com/source",
      "label": "Source label",
      "claimIds": ["C1"]
    }
  ],
  "standoutElements": [
    {
      "id": "decision-tree-1",
      "type": "decision_tree",
      "title": "Decision tree title"
    }
  ],
  "superiorityProof": {
    "intentWinsDelivered": [
      {
        "intentDimensionId": "D1",
        "sectionId": "S4_decision",
        "evidenceRefs": ["F1", "A1"],
        "finalCopyEvidence": "Quote or summarize the visible final-copy block that delivers the win."
      }
    ],
    "superiorityComponentsDelivered": [
      {
        "componentId": "custom-component-1",
        "sectionId": "S4_decision",
        "visibleOutputType": "decision_matrix",
        "finalCopyEvidence": "The matrix appears in the final copy with reader actions."
      }
    ],
    "differentiatedImprovementsDelivered": [
      {
        "improvementId": "improvement-1",
        "sectionId": "S5_comparison",
        "visibleOutputType": "table",
        "finalCopyEvidence": "The section includes the promised differentiating detail."
      }
    ],
    "extractableAnswerBlocksDelivered": [
      {
        "blockType": "quick_answer",
        "sectionId": "S2_quick_answer",
        "finalCopyEvidence": "The quick answer is visible near the top."
      }
    ],
    "visibleCitationHandling": [
      {
        "claim": "Important skincare or brand-capability claim.",
        "claimImportance": "important",
        "sourceRefs": ["F8"],
        "finalCopyEvidence": "The final copy cites or softens the claim visibly."
      }
    ],
    "whyThisDeservesToRank": "One human-readable summary explaining the top-4 intent wins and required superiority component."
  },
  "structurePlanDeliveryProof": {
    "primaryConcernDelivered": {
      "sectionId": "S2_quick_answer",
      "finalCopyEvidence": "Visible snippet proving the main research-derived concern is answered near the top."
    },
    "highImpactComponentsDelivered": [
      {
        "componentType": "decision_matrix",
        "mappedSectionId": "S4_decision",
        "finalCopyEvidence": "Visible snippet from the promised component."
      }
    ],
    "expectedVisibleOutputsDelivered": [
      {
        "mappedSectionId": "S4_decision",
        "finalCopyEvidence": "Visible snippet proving the promised section output is present."
      }
    ],
    "structureDecisionsDelivered": [
      {
        "sectionId": "S4_decision",
        "finalCopyEvidence": "Visible snippet proving the promised structure decision is present."
      }
    ]
  },
  "qaNotes": []
}
\`\`\`

Post-draft rule: final copy must visibly deliver the promised top-4 intent wins, required superiority component, 5 differentiated improvements, 3 extractable answer blocks, visible citation/source handling for important medical, skincare, safety, or brand-capability claims, and the research-derived structure plan. Strategy notes alone do not count.
`;
}

function depthForPageType(pageType: string): "decision_relevant" | "medium" | "full" {
  if (pageType === "comparison") return "decision_relevant";
  if (pageType === "guide_blog") return "full";
  return "medium";
}
