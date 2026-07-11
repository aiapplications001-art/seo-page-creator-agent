export interface ResearchExtractionFact {
  id: string;
  claim: string;
  sourceUrl: string;
  sourceRole?: SourceRole;
  sectionRelevance: string;
  evidenceType: string;
  confidence: string;
  freshness: string;
  contradictionNotes?: string;
}

export type SourceRole =
  | "primary_serp_competitor"
  | "secondary_serp_competitor"
  | "long_tail_source"
  | "paa_source"
  | "ai_overview_source"
  | "reddit_forum_source"
  | "video_social_source"
  | "trust_citation_source"
  | "brand_source";

export interface ResearchExtractionMatrix {
  extractedFacts?: ResearchExtractionFact[];
}

export interface CompetitorDepthDelta {
  competitors?: unknown[];
  primaryKeyword?: string;
  primarySerpTop5?: CompetitorEvaluation[];
  secondaryKeywordSerps?: SecondaryKeywordSerp[];
  specificityImprovements?: Array<{
    sectionId?: string;
    improvement?: string;
    competitorGapAddressed?: string;
  }>;
}

export interface CompetitorEvaluation {
  url?: string;
  rankingPosition?: number;
  strengthLabel?: "weak" | "moderate" | "strong" | "excellent";
  scores?: Record<string, CompetitorScore>;
  evidenceNotes?: unknown[];
  standoutAssets?: unknown[];
  whyUsersMightStopSearching?: string;
}

export interface CompetitorScore {
  score?: number;
  evidence?: string;
}

export interface SecondaryKeywordSerp {
  keyword?: string;
  topPages?: Array<{
    url?: string;
    rankingPosition?: number;
    intentContribution?: string;
    usefulGap?: string;
  }>;
}

export interface AudiencePainPointLedger {
  signals?: Array<{
    id?: string;
    sourceType?: string;
    audienceLanguage?: string;
    concernType?: string;
    mappedSectionId?: string;
  }>;
}

export interface PreDraftSynthesisBrief {
  wordCount?: number;
  searchIntent?: string;
  audienceAnxieties?: unknown[];
  competitorGaps?: unknown[];
  recommendedAngle?: string;
  sectionPromises?: unknown[];
  evidenceInventory?: unknown[];
}

export interface PreDraftQualityBrief {
  schemaVersion?: string;
  status?: string;
  searchIntent?: string;
  subIntents?: unknown[];
  diagnosticPlan?: unknown[];
  indiaSpecificity?: unknown[];
  safetyTrustPlan?: unknown[];
  standoutElement?: {
    type?: string;
    title?: string;
    whyCompetitorsMissIt?: string;
  };
  brandConnection?: string;
  readerQuestionCoverage?: PublishWorthinessItem[];
  recommendationSanityPlan?: PublishWorthinessItem[];
  claimRiskPlan?: PublishWorthinessItem[];
  troubleshootingPlan?: PublishWorthinessItem[];
  brandCtaFit?: {
    readerProblem?: string;
    supportedCtaPromise?: string;
    unsupportedClaimsToAvoid?: unknown[];
  };
  aiOverviewTargets?: unknown[];
  internalLinkPlan?: unknown[];
  intentDimensions?: IntentDimensionProof[];
  superiorityComponents?: SuperiorityComponentProof[];
  differentiatedImprovements?: DifferentiatedImprovementProof[];
  extractableAnswerBlocks?: ExtractableAnswerBlockProof[];
  researchDerivedStructurePlan?: ResearchDerivedStructurePlan;
}

export interface PublishWorthinessItem {
  item?: string;
  sourceRefs?: unknown[];
  mappedSectionId?: string;
  whyThisMatters?: string;
  finalCopyUse?: string;
}

export interface IntentDimensionProof {
  id?: string;
  label?: string;
  priority?: number;
  sourceRefs?: unknown[];
  plannedWin?: string;
  competitorBenchmark?: string;
}

export interface SuperiorityComponentProof {
  id?: string;
  componentType?: string;
  title?: string;
  researchBasis?: string;
  sourceRefs?: unknown[];
  mappedSectionId?: string;
  intentDimensionSupported?: string;
  competitorGapAddressed?: string;
  whyThisIsInformationGain?: string;
  competitorComponentComparison?: {
    comparisonPath?: "beat_existing_component" | "fill_empty_gap";
    competitorsReviewed?: unknown[];
    whyOursIsBetterOrNeeded?: string;
  };
  finalCopyBlock?: string;
  imageOrInteractiveNeed?: string;
  fallbackContent?: string;
  primaryReaderJob?: string;
  brandFit?: string;
  naturalCtaConnection?: "none" | "soft" | "direct";
  unsupportedBrandClaimsToAvoid?: unknown[];
}

export interface DifferentiatedImprovementProof {
  improvement?: string;
  sourceRefs?: unknown[];
  intentDimension?: string;
  competitorOrUserGapAddressed?: string;
  mappedSectionId?: string;
  visibleOutputType?: string;
  finalOutputLocation?: string;
  finalCopyEvidence?: string;
  whyDifferentiated?: string;
}

export interface ExtractableAnswerBlockProof {
  blockType?: "quick_answer" | "decision_action" | "troubleshooting_safety" | string;
  answer?: string;
  sourceRefs?: unknown[];
  mappedSectionId?: string;
  keywordUse?: unknown[];
  aiOverviewDelta?: string;
}

export interface ResearchDerivedStructurePlan {
  primaryUserConcern?: string;
  primaryConcernVisibleBySectionId?: string;
  primaryConcernVisibleBySectionIndex?: number;
  importantInformationNotBuried?: boolean;
  scanPriorityRationale?: string;
  sectionOrderRationale?: string;
  sections?: ResearchDerivedStructureSection[];
  highImpactComponents?: ResearchDerivedStructureComponent[];
  structureDecisions?: ResearchDerivedStructureDecision[];
  structureComparison?: {
    comparedCurrentBatchPageIds?: unknown[];
    comparedHistoricalPageIds?: unknown[];
    reusedStructureRisk?: string;
    materialDifferences?: unknown[];
  };
}

export interface ResearchDerivedStructureSection {
  sectionId?: string;
  sectionRole?: string;
  sectionAction?: "add" | "expand" | "reorder" | "replace" | "merge" | "remove" | string;
  targetSectionTitle?: string;
  whyThisSectionExists?: string;
  sourceRefs?: unknown[];
  intentDimensionRefs?: unknown[];
  competitorOrUserGap?: string;
  expectedVisibleOutput?: string;
  competitorGapRefs?: unknown[];
  audienceLanguageRefs?: unknown[];
  trustCitationRefs?: unknown[];
  finalCopyUse?: string;
  finalCopyAcceptanceCheck?: string;
  scanPriority?: string;
  readerQuestionAnswered?: string;
  differentiatesFromPageIds?: unknown[];
}

export interface ResearchDerivedStructureComponent {
  componentType?: string;
  mappedSectionId?: string;
  readerJob?: string;
  whyThisComponentExists?: string;
  sourceRefs?: unknown[];
  intentDimensionRefs?: unknown[];
  competitorOrAudienceGapAddressed?: string;
  competitorGapRefs?: unknown[];
  audienceLanguageRefs?: unknown[];
  trustCitationRefs?: unknown[];
  visibleReaderBenefit?: string;
  notGenericReason?: string;
  columnsOrSteps?: unknown[];
  whyThisShape?: string;
  expectedVisibleOutput?: string;
  finalCopyAcceptanceCheck?: string;
}

export interface ResearchDerivedStructureDecision {
  sectionId?: string;
  sectionAction?: "add" | "expand" | "reorder" | "replace" | "merge" | "remove" | string;
  targetSectionTitle?: string;
  sourceRefs?: unknown[];
  competitorOrUserGap?: string;
  whyThisStructureIsNeeded?: string;
  expectedVisibleOutput?: string;
  finalCopyAcceptanceCheck?: string;
}

export interface SectionEvidenceBudget {
  sectionId: string;
  facts?: unknown[];
  citedClaims?: unknown[];
  usefulnessItems?: unknown[];
}

export interface PageDepthScore {
  overallScore?: number;
  dimensions?: Record<string, number>;
  informationGainItems?: unknown[];
  sectionEvidenceBudgets?: SectionEvidenceBudget[];
}

export interface PageDepthContractInput {
  researchExtractionMatrix?: ResearchExtractionMatrix;
  competitorDepthDelta?: CompetitorDepthDelta;
  audiencePainPointLedger?: AudiencePainPointLedger;
  preDraftSynthesisBrief?: PreDraftSynthesisBrief;
  preDraftQualityBrief?: PreDraftQualityBrief;
  pageDepthScore?: PageDepthScore;
  expectedSectionIds?: string[];
}

export interface PageDepthValidationResult {
  status: "passed" | "failed";
  blockingIssues: string[];
  advisoryIssues: string[];
  score: number;
}

export function validatePageDepthContract(input: PageDepthContractInput): PageDepthValidationResult {
  const evidence = collectEvidence(input);
  const blockingIssues = [
    ...validateResearchExtractionMatrix(input.researchExtractionMatrix),
    ...validateCompetitorDepthDelta(input.competitorDepthDelta),
    ...validateAudiencePainPointLedger(input.audiencePainPointLedger),
    ...validatePreDraftSynthesisBrief(input.preDraftSynthesisBrief),
    ...validatePreDraftQualityBrief(input.preDraftQualityBrief, evidence, input.competitorDepthDelta, input.expectedSectionIds ?? []),
    ...validatePageDepthScore(input.pageDepthScore),
    ...validateSectionAlignment(input)
  ];
  const score = readNumber(input.pageDepthScore?.overallScore);

  return {
    status: blockingIssues.length === 0 ? "passed" : "failed",
    blockingIssues,
    advisoryIssues: [],
    score
  };
}

interface EvidenceRegistry {
  refs: Set<string>;
  rolesByRef: Map<string, SourceRole>;
}

function collectEvidence(input: PageDepthContractInput): EvidenceRegistry {
  const refs = new Set<string>();
  const rolesByRef = new Map<string, SourceRole>();

  const add = (ref: string | undefined, role?: SourceRole) => {
    if (!hasText(ref)) return;
    refs.add(ref);
    if (role) rolesByRef.set(ref, role);
  };

  for (const fact of input.researchExtractionMatrix?.extractedFacts ?? []) {
    add(fact.id, fact.sourceRole);
    add(fact.sourceUrl, fact.sourceRole);
  }
  for (const signal of input.audiencePainPointLedger?.signals ?? []) {
    add(signal.id, audienceSourceRole(signal.sourceType));
  }
  for (const competitor of input.competitorDepthDelta?.primarySerpTop5 ?? []) {
    add(competitor.url, "primary_serp_competitor");
  }
  for (const serp of input.competitorDepthDelta?.secondaryKeywordSerps ?? []) {
    for (const page of serp.topPages ?? []) {
      add(page.url, "secondary_serp_competitor");
    }
  }
  return { refs, rolesByRef };
}

function audienceSourceRole(sourceType: string | undefined): SourceRole | undefined {
  const normalized = sourceType?.toLowerCase();
  if (!normalized) return undefined;
  if (/\b(reddit|forum|quora|community)\b/.test(normalized)) return "reddit_forum_source";
  if (/\b(video|youtube|short|reel|social|instagram|tiktok)\b/.test(normalized)) return "video_social_source";
  return undefined;
}

function validateResearchExtractionMatrix(matrix: ResearchExtractionMatrix | undefined): string[] {
  const issues: string[] = [];
  const facts = matrix?.extractedFacts ?? [];
  if (facts.length < 40) {
    issues.push("Research extraction matrix requires at least 40 extracted facts.");
  }

  const factsBySource = new Map<string, number>();
  for (const fact of facts) {
    if (!hasText(fact.claim) || !hasText(fact.sourceUrl) || !hasText(fact.sectionRelevance)) {
      issues.push("Every extracted fact requires claim, source URL, and section relevance.");
      break;
    }
    factsBySource.set(fact.sourceUrl, (factsBySource.get(fact.sourceUrl) ?? 0) + 1);
  }

  for (const [sourceUrl, count] of factsBySource) {
    if (count < 3) {
      issues.push(`${sourceUrl}: each analyzed source requires at least 3 extracted facts.`);
    }
  }

  return issues;
}

function validateCompetitorDepthDelta(delta: CompetitorDepthDelta | undefined): string[] {
  const issues: string[] = [];
  const competitors = delta?.competitors ?? [];
  const improvements = delta?.specificityImprovements ?? [];
  const primarySerpTop5 = delta?.primarySerpTop5 ?? [];
  const secondaryKeywordSerps = delta?.secondaryKeywordSerps ?? [];

  if (competitors.length < 5) {
    issues.push("Competitor depth delta requires analysis of at least 5 competing pages.");
  }
  if (!hasText(delta?.primaryKeyword)) {
    issues.push("Competitor depth delta requires the primary keyword being benchmarked.");
  }
  if (primarySerpTop5.length < 5) {
    issues.push("Competitor depth delta requires full scoring for the primary keyword top 5 SERP pages.");
  }
  issues.push(...validatePrimaryCompetitorScoring(primarySerpTop5));
  if (secondaryKeywordSerps.length < 1) {
    issues.push("Competitor depth delta requires at least one secondary keyword SERP or long-tail SERP set.");
  }
  for (const serp of secondaryKeywordSerps) {
    if (!hasText(serp.keyword) || (serp.topPages ?? []).length < 3) {
      issues.push("Every secondary keyword SERP requires keyword and top 3 page analysis.");
      break;
    }
    const urls = new Set<string>();
    for (const page of serp.topPages ?? []) {
      if (!hasText(page.url) || readNumber(page.rankingPosition) < 1 || !hasText(page.intentContribution) || !hasText(page.usefulGap)) {
        issues.push("Every secondary keyword SERP top page requires URL, ranking position, intent contribution, and useful gap.");
        break;
      }
      urls.add(page.url);
    }
    if ((serp.topPages ?? []).length >= 3 && urls.size < 3) {
      issues.push("Every secondary keyword SERP requires 3 distinct top page URLs.");
    }
  }
  if (improvements.length < 10) {
    issues.push("Competitor depth delta requires at least 10 specificity improvements.");
  }
  if (improvements.some((item) => !hasText(item.sectionId) || !hasText(item.improvement) || !hasText(item.competitorGapAddressed))) {
    issues.push("Every specificity improvement requires section, improvement, and competitor gap addressed.");
  }

  return issues;
}

const competitorScoreDimensions = [
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

function validatePrimaryCompetitorScoring(competitors: CompetitorEvaluation[]): string[] {
  const issues: string[] = [];
  let hasScoreShapeIssue = false;
  let hasLabelRuleIssue = false;

  for (const competitor of competitors) {
    if (!hasText(competitor.url) || readNumber(competitor.rankingPosition) < 1) {
      hasScoreShapeIssue = true;
      continue;
    }
    for (const dimension of competitorScoreDimensions) {
      const score = competitor.scores?.[dimension];
      const numericScore = readNumber(score?.score);
      if (numericScore < 0 || numericScore > 5 || !hasText(score?.evidence)) {
        hasScoreShapeIssue = true;
        break;
      }
    }

    if (!["weak", "moderate", "strong", "excellent"].includes(competitor.strengthLabel ?? "")) {
      hasLabelRuleIssue = true;
      continue;
    }
    if (!competitorMeetsStrengthRules(competitor)) {
      hasLabelRuleIssue = true;
    }
  }

  if (hasScoreShapeIssue) {
    issues.push("Primary SERP competitor scoring requires URL, ranking position, all 11 dimension scores, and evidence notes.");
  }
  if (hasLabelRuleIssue) {
    issues.push("Primary SERP competitor strength labels must obey weak/moderate/strong/excellent non-negotiable rules.");
  }

  return issues;
}

function competitorMeetsStrengthRules(competitor: CompetitorEvaluation): boolean {
  const scores = competitor.scores ?? {};
  const score = (dimension: string) => readNumber(scores[dimension]?.score);
  const values = competitorScoreDimensions.map(score);
  const average = values.reduce((sum, value) => sum + value, 0) / Math.max(values.length, 1);
  const topIntentScores = [
    score("intentMatch"),
    score("topIntentCoverage"),
    score("decisionUsefulness"),
    score("depthAndSpecificity")
  ];

  if (score("uxPageExperience") <= 1 && ["strong", "excellent"].includes(competitor.strengthLabel ?? "")) {
    return false;
  }
  if (competitor.strengthLabel === "excellent") {
    return score("intentMatch") === 5
      && score("topIntentCoverage") >= 4
      && values.filter((value) => value >= 4).length >= 5
      && topIntentScores.every((value) => value >= 4)
      && score("uxPageExperience") >= 3
      && (competitor.standoutAssets ?? []).length >= 1
      && hasText(competitor.whyUsersMightStopSearching);
  }
  if (competitor.strengthLabel === "strong") {
    return score("intentMatch") >= 4
      && score("topIntentCoverage") >= 4
      && score("decisionUsefulness") >= 3
      && score("depthAndSpecificity") >= 3
      && score("practicalCompleteness") >= 3
      && (competitor.evidenceNotes ?? []).length >= 3;
  }
  if (competitor.strengthLabel === "moderate") {
    return average >= 3;
  }
  return average < 3 || score("intentMatch") < 3;
}

function validateAudiencePainPointLedger(ledger: AudiencePainPointLedger | undefined): string[] {
  const issues: string[] = [];
  const signals = ledger?.signals ?? [];

  if (signals.length < 20) {
    issues.push("Audience pain-point ledger requires at least 20 audience signals.");
  }
  if (signals.some((signal) => !hasText(signal.audienceLanguage) || !hasText(signal.mappedSectionId))) {
    issues.push("Every audience signal requires audience language and mapped section.");
  }

  return issues;
}

function validatePreDraftSynthesisBrief(brief: PreDraftSynthesisBrief | undefined): string[] {
  const issues: string[] = [];
  const wordCount = readNumber(brief?.wordCount);

  if (wordCount < 500 || wordCount > 900) {
    issues.push("Pre-draft synthesis brief must be 500-900 words.");
  }
  if (!hasText(brief?.searchIntent)) issues.push("Pre-draft synthesis brief requires search intent.");
  if (!hasText(brief?.recommendedAngle)) issues.push("Pre-draft synthesis brief requires recommended angle.");
  if (!brief?.audienceAnxieties?.length) issues.push("Pre-draft synthesis brief requires audience anxieties.");
  if (!brief?.competitorGaps?.length) issues.push("Pre-draft synthesis brief requires competitor gaps.");
  if (!brief?.sectionPromises?.length) issues.push("Pre-draft synthesis brief requires section promises.");
  if (!brief?.evidenceInventory?.length) issues.push("Pre-draft synthesis brief requires evidence inventory.");

  return issues;
}

function validatePreDraftQualityBrief(
  brief: PreDraftQualityBrief | undefined,
  evidence: EvidenceRegistry,
  competitorDepthDelta: CompetitorDepthDelta | undefined,
  expectedSectionIds: string[]
): string[] {
  const issues: string[] = [];

  if (!brief) {
    return ["Pre-draft quality brief is required before final copy."];
  }

  if (brief.schemaVersion !== "pre-draft-quality-brief.v2") {
    issues.push("Pre-draft quality brief schemaVersion must be pre-draft-quality-brief.v2.");
  }
  if (brief.status !== "complete") {
    issues.push("Pre-draft quality brief status must be complete.");
  }
  if (!hasText(brief.searchIntent)) {
    issues.push("Pre-draft quality brief requires search intent.");
  }
  if ((brief.subIntents ?? []).length < 6) {
    issues.push("Pre-draft quality brief requires at least 6 sub-intents.");
  }
  if ((brief.diagnosticPlan ?? []).length < 4) {
    issues.push("Pre-draft quality brief requires at least 4 diagnostic depth items.");
  }
  if ((brief.indiaSpecificity ?? []).length < 4) {
    issues.push("Pre-draft quality brief requires at least 4 India-specific angles.");
  }
  if ((brief.safetyTrustPlan ?? []).length < 4) {
    issues.push("Pre-draft quality brief requires at least 4 safety and trust requirements.");
  }
  if (
    !hasText(brief.standoutElement?.type)
    || !hasText(brief.standoutElement?.title)
    || !hasText(brief.standoutElement?.whyCompetitorsMissIt)
  ) {
    issues.push("Pre-draft quality brief requires a standout element with type, title, and why competitors miss it.");
  }
  if (!hasText(brief.brandConnection)) {
    issues.push("Pre-draft quality brief requires brand connection.");
  }
  if ((brief.readerQuestionCoverage ?? []).length < 8) {
    issues.push("Pre-draft quality brief requires at least 8 real reader questions.");
  }
  if ((brief.recommendationSanityPlan ?? []).length < 3) {
    issues.push("Pre-draft quality brief requires at least 3 recommendation sanity checks.");
  }
  if ((brief.claimRiskPlan ?? []).length < 5) {
    issues.push("Pre-draft quality brief requires at least 5 claim risk plan items.");
  }
  if ((brief.troubleshootingPlan ?? []).length < 4) {
    issues.push("Pre-draft quality brief requires at least 4 troubleshooting plan items.");
  }
  if (
    !hasText(brief.brandCtaFit?.readerProblem)
    || !hasText(brief.brandCtaFit?.supportedCtaPromise)
    || (brief.brandCtaFit?.unsupportedClaimsToAvoid ?? []).length < 1
  ) {
    issues.push("Pre-draft quality brief requires brand CTA fit with reader problem, supported promise, and unsupported claims to avoid.");
  }
  issues.push(...validatePublishWorthinessSpecificity(brief, evidence.refs));
  if ((brief.aiOverviewTargets ?? []).length < 3) {
    issues.push("Pre-draft quality brief requires at least 3 AI Overview/extractable answer targets.");
  }
  if ((brief.internalLinkPlan ?? []).length < 5) {
    issues.push("Pre-draft quality brief requires at least 5 internal link targets.");
  }
  issues.push(...validateResearchDerivedStructurePlan(brief.researchDerivedStructurePlan, evidence, expectedSectionIds));
  issues.push(...validateSerpSuperiorityProof(brief, evidence, competitorDepthDelta));

  return issues;
}

function validateResearchDerivedStructurePlan(
  plan: ResearchDerivedStructurePlan | undefined,
  evidence: EvidenceRegistry,
  expectedSectionIds: string[] = []
): string[] {
  const issues: string[] = [];

  if (!plan) {
    return ["Pre-draft quality brief research-derived structure plan is required before final copy."];
  }

  if (!hasText(plan.primaryUserConcern) || !hasText(plan.primaryConcernVisibleBySectionId)) {
    issues.push("Research-derived structure plan requires primary user concern and visible section id.");
  }
  const visibleIndex = readNumber(plan.primaryConcernVisibleBySectionIndex);
  if (visibleIndex < 1 || visibleIndex > 3 || plan.importantInformationNotBuried !== true) {
    issues.push("Research-derived structure plan primary user concern must be visible within the first 3 visible sections and importantInformationNotBuried must be true.");
  }
  if (expectedSectionIds.length > 0 && hasText(plan.primaryConcernVisibleBySectionId)) {
    const actualVisibleIndex = expectedSectionIds.indexOf(plan.primaryConcernVisibleBySectionId) + 1;
    if (actualVisibleIndex < 1 || actualVisibleIndex > 3 || actualVisibleIndex !== visibleIndex) {
      issues.push("Research-derived structure plan primary user concern section must match the first 3 generated sections and its actual generated section index.");
    }
  }
  if (!hasSpecificRationale(plan.scanPriorityRationale) || !hasSpecificRationale(plan.sectionOrderRationale)) {
    issues.push("Research-derived structure rationales must be specific, source-shaped, and not generic filler.");
  }

  const sections = plan.sections ?? [];
  if (sections.length === 0) {
    issues.push("Research-derived structure plan requires section-level proof for visible sections.");
  }
  for (const section of sections) {
    issues.push(...validateResearchDerivedStructureSection(section, evidence));
  }

  const components = plan.highImpactComponents ?? [];
  if (components.length === 0) {
    issues.push("Research-derived structure plan requires at least one high-impact component or scan-first device.");
  }
  for (const component of components) {
    issues.push(...validateResearchDerivedStructureComponent(component, evidence));
  }

  const decisions = plan.structureDecisions ?? [];
  if (decisions.length === 0) {
    issues.push("Research-derived structure plan requires at least one page-specific structural mutation.");
  }
  for (const decision of decisions) {
    issues.push(...validateResearchDerivedStructureDecision(decision, evidence));
  }

  if (
    !plan.structureComparison
    || !hasText(plan.structureComparison.reusedStructureRisk)
    || (plan.structureComparison.materialDifferences ?? []).length < 1
  ) {
    issues.push("Research-derived structure plan requires structure comparison with material differences from current or historical pages.");
  }

  return [...new Set(issues)];
}

function validateResearchDerivedStructureSection(
  section: ResearchDerivedStructureSection,
  evidence: EvidenceRegistry
): string[] {
  const issues: string[] = [];
  const sourceRefs = stringItems(readUnknownArray(section.sourceRefs));
  const isHighImpact = highImpactStructureText(`${section.sectionRole ?? ""} ${section.targetSectionTitle ?? ""} ${section.expectedVisibleOutput ?? ""}`);
  const minimumRefs = isHighImpact ? 3 : 2;
  if (!hasSpecificRationale(section.whyThisSectionExists) || !hasSpecificRationale(section.competitorOrUserGap)) {
    issues.push("Research-derived structure rationales must be specific, source-shaped, and not generic filler.");
  }

  if (
    !hasText(section.sectionId)
    || !hasText(section.sectionRole)
    || !validSectionAction(section.sectionAction)
    || !hasText(section.targetSectionTitle)
    || !hasSpecificRationale(section.whyThisSectionExists)
    || sourceRefs.length < minimumRefs
    || !sourceRefs.every((sourceRef) => evidence.refs.has(sourceRef))
    || !arrayHasText(section.intentDimensionRefs)
    || !hasSpecificRationale(section.competitorOrUserGap)
    || !hasText(section.expectedVisibleOutput)
    || !hasText(section.finalCopyUse)
    || !hasText(section.finalCopyAcceptanceCheck)
    || !hasText(section.scanPriority)
    || !hasText(section.readerQuestionAnswered)
  ) {
    issues.push("Research-derived structure sections require action, specific rationale, visible output, acceptance check, intent refs, reader question, and enough known sourceRefs.");
  }

  issues.push(...validateTypedStructureRefs(section, sourceRefs, evidence, [
    section.sectionRole,
    section.targetSectionTitle,
    section.whyThisSectionExists,
    section.competitorOrUserGap,
    section.expectedVisibleOutput,
    section.finalCopyUse,
    section.readerQuestionAnswered
  ].join(" ")));
  return issues;
}

function validateResearchDerivedStructureComponent(
  component: ResearchDerivedStructureComponent,
  evidence: EvidenceRegistry
): string[] {
  const issues: string[] = [];
  const sourceRefs = stringItems(readUnknownArray(component.sourceRefs));
  if (!hasSpecificRationale(component.whyThisComponentExists) || !hasSpecificRationale(component.competitorOrAudienceGapAddressed) || !hasSpecificRationale(component.notGenericReason)) {
    issues.push("Research-derived structure rationales must be specific, source-shaped, and not generic filler.");
  }

  if (
    !hasText(component.componentType)
    || !hasText(component.mappedSectionId)
    || !hasText(component.readerJob)
    || !hasSpecificRationale(component.whyThisComponentExists)
    || sourceRefs.length < 3
    || !sourceRefs.every((sourceRef) => evidence.refs.has(sourceRef))
    || !arrayHasText(component.intentDimensionRefs)
    || !hasSpecificRationale(component.competitorOrAudienceGapAddressed)
    || !hasText(component.visibleReaderBenefit)
    || !hasSpecificRationale(component.notGenericReason)
    || !hasText(component.expectedVisibleOutput)
    || !hasText(component.finalCopyAcceptanceCheck)
  ) {
    issues.push("Research-derived high-impact structure components require at least 3 known sourceRefs, reader job, specific gap, visible benefit, and final copy acceptance check.");
  }
  if (sourceRefs.length < 3 || !sourceRefs.every((sourceRef) => evidence.refs.has(sourceRef))) {
    issues.push("Research-derived high-impact structure components require at least 3 known sourceRefs.");
  }
  if (tableLikeComponent(component.componentType)) {
    const columns = stringItems(readUnknownArray(component.columnsOrSteps)).map(normalizeText);
    if (columns.length < 3 || isGenericTableShape(columns) || !hasSpecificRationale(component.whyThisShape)) {
      issues.push("Research-derived structure generic table or matrix columns are not allowed without a specific research-backed shape.");
    }
  }

  issues.push(...validateTypedStructureRefs(component, sourceRefs, evidence, [
    component.componentType,
    component.readerJob,
    component.whyThisComponentExists,
    component.competitorOrAudienceGapAddressed,
    component.visibleReaderBenefit,
    component.notGenericReason,
    component.expectedVisibleOutput
  ].join(" ")));
  return issues;
}

function validateResearchDerivedStructureDecision(
  decision: ResearchDerivedStructureDecision,
  evidence: EvidenceRegistry
): string[] {
  const sourceRefs = stringItems(readUnknownArray(decision.sourceRefs));
  if (
    !hasText(decision.sectionId)
    || !validSectionAction(decision.sectionAction)
    || !hasText(decision.targetSectionTitle)
    || sourceRefs.length < 2
    || !sourceRefs.every((sourceRef) => evidence.refs.has(sourceRef))
    || !hasSpecificRationale(decision.competitorOrUserGap)
    || !hasSpecificRationale(decision.whyThisStructureIsNeeded)
    || !hasText(decision.expectedVisibleOutput)
    || !hasText(decision.finalCopyAcceptanceCheck)
  ) {
    return ["Research-derived structure decisions require section action, source-backed gap, visible output, and final copy acceptance check."];
  }
  return [];
}

function validateTypedStructureRefs(
  item: {
    sourceRefs?: unknown[];
    competitorGapRefs?: unknown[];
    audienceLanguageRefs?: unknown[];
    trustCitationRefs?: unknown[];
  },
  sourceRefs: string[],
  evidence: EvidenceRegistry,
  requirementText: string
): string[] {
  const issues: string[] = [];
  const sourceRefSet = new Set(sourceRefs);
  const competitorRefs = stringItems(readUnknownArray(item.competitorGapRefs));
  const audienceRefs = stringItems(readUnknownArray(item.audienceLanguageRefs));
  const trustRefs = stringItems(readUnknownArray(item.trustCitationRefs));
  const normalizedRequirement = normalizeText(requirementText);

  if (requiresCompetitorGapRefs(normalizedRequirement) && competitorRefs.length === 0) {
    issues.push("Research-derived structure requires competitorGapRefs from SERP competitor evidence when claiming differentiation, superiority, competitor gaps, or SERP gaps.");
  }
  if (requiresAudienceLanguageRefs(normalizedRequirement) && audienceRefs.length === 0) {
    issues.push("Research-derived structure requires audienceLanguageRefs from audience-language evidence for objections, mistakes, troubleshooting, FAQs, symptoms, or reader questions.");
  }
  if (requiresTrustCitationRefs(normalizedRequirement) && trustRefs.length === 0) {
    issues.push("Research-derived structure requires trustCitationRefs from trust/citation evidence for skincare, medical, safety, risk, harm, irritation, or escalation content.");
  }

  if (!typedRefsAreSubset(competitorRefs, sourceRefSet) || !typedRefsAreSubset(audienceRefs, sourceRefSet) || !typedRefsAreSubset(trustRefs, sourceRefSet)) {
    issues.push("Research-derived structure typed refs must also appear in sourceRefs for the same section or component.");
  }
  if (competitorRefs.length > 0 && !refsHaveAllowedRole(competitorRefs, evidence, ["primary_serp_competitor", "secondary_serp_competitor"])) {
    issues.push("Research-derived structure competitorGapRefs must use primary or secondary SERP competitor evidence.");
  }
  if (audienceRefs.length > 0 && !refsHaveAllowedRole(audienceRefs, evidence, ["paa_source", "reddit_forum_source", "video_social_source", "long_tail_source"])) {
    issues.push("Research-derived structure audienceLanguageRefs must use audience-language evidence.");
  }
  if (trustRefs.length > 0 && !refsHaveAllowedRole(trustRefs, evidence, ["trust_citation_source"])) {
    issues.push("Research-derived structure trustCitationRefs must use trust/citation evidence.");
  }

  return issues;
}

function requiresCompetitorGapRefs(normalized: string): boolean {
  return /\b(competitor|competitors|serp|gap|gaps|differentiat|superiority|outrank|rank)\b/.test(normalized);
}

function requiresAudienceLanguageRefs(normalized: string): boolean {
  return /\b(objection|objections|mistake|mistakes|troubleshoot|troubleshooting|faq|faqs|question|questions|symptom|symptoms|burning|bumps|worsen|worsening|stop|switch|reader asks|readers ask)\b/.test(normalized);
}

function requiresTrustCitationRefs(normalized: string): boolean {
  return /\b(skin|skincare|acne|medical|safety|safe|risk|harm|irritation|irritated|burn|burning|stop|switch|escalat|dermatologist|pregnancy|active|actives|claim|claims)\b/.test(normalized);
}

function typedRefsAreSubset(refs: string[], sourceRefs: Set<string>): boolean {
  return refs.every((ref) => sourceRefs.has(ref));
}

function refsHaveAllowedRole(refs: string[], evidence: EvidenceRegistry, allowedRoles: SourceRole[]): boolean {
  return refs.every((ref) => {
    const role = evidence.rolesByRef.get(ref);
    return Boolean(role && allowedRoles.includes(role));
  });
}

function validSectionAction(action: string | undefined): boolean {
  return ["add", "expand", "reorder", "replace", "merge", "remove"].includes(action ?? "");
}

function arrayHasText(items: unknown[] | undefined): boolean {
  return stringItems(readUnknownArray(items)).length > 0;
}

function hasSpecificRationale(value: string | undefined): boolean {
  if (!hasText(value)) return false;
  const normalized = normalizeText(value);
  if (wordCount(value) < 8) return false;
  if (isGenericStructureRationale(normalized)) return false;
  return /\b(reader|readers|user|users|searcher|searchers|audience|competitor|competitors|serp|gap|signals?|source|risk|safety|trust|india|market|price|pricing|constraint|decision|symptom|burning|bumps|irritation|action|routine|texture|acne)\b/.test(normalized);
}

function isGenericStructureRationale(normalized: string): boolean {
  return [
    "helps users understand",
    "answers common questions",
    "improves seo",
    "provides value",
    "supports decision making",
    "covers the topic",
    "improves ux",
    "adds depth",
    "better for readers",
    "more comprehensive"
  ].some((phrase) => normalized.includes(phrase));
}

function highImpactStructureText(value: string): boolean {
  return /\b(decision|matrix|comparison|table|troubleshoot|faq|superiority|cta|risk|safety|harm|side effect|objection|mistake|checklist|flow)\b/i.test(value);
}

function tableLikeComponent(componentType: string | undefined): boolean {
  return /(table|matrix|comparison|grid)/i.test(componentType ?? "");
}

function isGenericTableShape(columns: string[]): boolean {
  const joined = columns.join("|");
  return joined === "feature|benefit|notes" || joined === "feature|benefits|notes";
}

function validateSerpSuperiorityProof(
  brief: PreDraftQualityBrief,
  evidence: EvidenceRegistry,
  competitorDepthDelta: CompetitorDepthDelta | undefined
): string[] {
  const issues: string[] = [];
  const intentDimensions = brief.intentDimensions ?? [];
  const components = brief.superiorityComponents ?? [];
  const improvements = brief.differentiatedImprovements ?? [];
  const answerBlocks = brief.extractableAnswerBlocks ?? [];

  if (intentDimensions.length < 4 || intentDimensions.length > 7) {
    issues.push("SERP superiority requires 4-7 intent dimensions.");
  }
  const topFour = intentDimensions
    .filter((dimension) => readNumber(dimension.priority) >= 1)
    .sort((left, right) => readNumber(left.priority) - readNumber(right.priority))
    .slice(0, 4);
  if (intentDimensions.length >= 4 && topFour.length < 4) {
    issues.push("SERP superiority requires the top 4 intent dimensions to be ranked by priority.");
  }
  if (topFour.some((dimension) => !hasText(dimension.id) || !hasText(dimension.label) || !hasText(dimension.plannedWin) || !hasText(dimension.competitorBenchmark) || !sourceRefsKnown(dimension.sourceRefs, evidence.refs))) {
    issues.push("SERP superiority top intent dimensions require id, label, planned win, competitor benchmark, and known sourceRefs.");
  }

  if (components.length < 1) {
    issues.push("SERP superiority requires at least 1 major superiority component.");
  }
  if (components.some((component) => !validSuperiorityComponent(component, evidence.refs))) {
    issues.push("SERP superiority components require custom evidence-linked component proof, competitor delta, final copy block, fallback, and brand fit.");
  }

  if (improvements.length < 5) {
    issues.push("SERP superiority requires at least 5 differentiated improvements.");
  }
  if (improvements.length >= 5 && improvements.some((improvement) => !validDifferentiatedImprovement(improvement, evidence.refs))) {
    issues.push("SERP superiority differentiated improvements must map to sourceRefs, intent dimension, section, visible output, final copy evidence, and differentiation rationale.");
  }
  if (improvements.length >= 5 && new Set(improvements.map((item) => item.mappedSectionId).filter(Boolean)).size < 2) {
    issues.push("SERP superiority differentiated improvements must appear across at least 2 sections.");
  }

  if (answerBlocks.length < 3) {
    issues.push("SERP superiority requires at least 3 extractable answer blocks.");
  }
  const blockTypes = new Set(answerBlocks.map((block) => block.blockType));
  for (const requiredType of ["quick_answer", "decision_action", "troubleshooting_safety"]) {
    if (!blockTypes.has(requiredType)) {
      issues.push(`SERP superiority extractable answer blocks require ${requiredType}.`);
    }
  }
  if (answerBlocks.length >= 3 && answerBlocks.some((block) => !validExtractableAnswerBlock(block, evidence.refs))) {
    issues.push("SERP superiority extractable answer blocks require answer, mapped section, known sourceRefs, keyword use, and AI Overview delta.");
  }

  issues.push(...validateSourceDiversity([...topFour, ...components, ...improvements, ...answerBlocks], evidence));
  if (strongCompetitorCount(competitorDepthDelta) >= 2 && components.length < 1) {
    issues.push("SERP superiority requires an information-gain component when 2 or more primary competitors are strong or excellent.");
  }

  return issues;
}

function validSuperiorityComponent(component: SuperiorityComponentProof, evidenceRefs: Set<string>): boolean {
  const comparison = component.competitorComponentComparison;
  return hasText(component.id)
    && hasText(component.componentType)
    && hasText(component.title)
    && hasText(component.researchBasis)
    && sourceRefsKnown(component.sourceRefs, evidenceRefs)
    && hasText(component.mappedSectionId)
    && hasText(component.intentDimensionSupported)
    && hasText(component.competitorGapAddressed)
    && hasText(component.whyThisIsInformationGain)
    && (comparison?.comparisonPath === "beat_existing_component" || comparison?.comparisonPath === "fill_empty_gap")
    && (comparison?.competitorsReviewed ?? []).length >= 1
    && hasText(comparison?.whyOursIsBetterOrNeeded)
    && hasText(component.finalCopyBlock)
    && hasText(component.imageOrInteractiveNeed)
    && hasText(component.fallbackContent)
    && hasText(component.primaryReaderJob)
    && hasText(component.brandFit)
    && ["none", "soft", "direct"].includes(component.naturalCtaConnection ?? "")
    && (component.unsupportedBrandClaimsToAvoid ?? []).length >= 1;
}

function validDifferentiatedImprovement(improvement: DifferentiatedImprovementProof, evidenceRefs: Set<string>): boolean {
  return hasText(improvement.improvement)
    && sourceRefsKnown(improvement.sourceRefs, evidenceRefs)
    && hasText(improvement.intentDimension)
    && hasText(improvement.competitorOrUserGapAddressed)
    && hasText(improvement.mappedSectionId)
    && ["copy", "table", "checklist", "flow", "image", "interactive_component", "schema", "layout_note"].includes(improvement.visibleOutputType ?? "")
    && hasText(improvement.finalOutputLocation)
    && hasText(improvement.finalCopyEvidence)
    && hasText(improvement.whyDifferentiated);
}

function validExtractableAnswerBlock(block: ExtractableAnswerBlockProof, evidenceRefs: Set<string>): boolean {
  return hasText(block.blockType)
    && hasText(block.answer)
    && sourceRefsKnown(block.sourceRefs, evidenceRefs)
    && hasText(block.mappedSectionId)
    && (block.keywordUse ?? []).length >= 1
    && hasText(block.aiOverviewDelta);
}

function sourceRefsKnown(sourceRefs: unknown[] | undefined, evidenceRefs: Set<string>): boolean {
  const refs = stringItems(readUnknownArray(sourceRefs));
  return refs.length > 0 && refs.every((sourceRef) => evidenceRefs.has(sourceRef));
}

function validateSourceDiversity(items: Array<{ sourceRefs?: unknown[] }>, evidence: EvidenceRegistry): string[] {
  const roles = new Set<SourceRole>();
  for (const item of items) {
    for (const sourceRef of stringItems(readUnknownArray(item.sourceRefs))) {
      const role = evidence.rolesByRef.get(sourceRef);
      if (role) roles.add(role);
    }
  }

  const issues: string[] = [];
  if (!roles.has("primary_serp_competitor")) issues.push("SERP superiority source diversity requires primary SERP competitor evidence.");
  if (!roles.has("secondary_serp_competitor") && !roles.has("long_tail_source")) issues.push("SERP superiority source diversity requires secondary keyword SERP or long-tail evidence.");
  if (!roles.has("reddit_forum_source") && !roles.has("video_social_source") && !roles.has("paa_source")) issues.push("SERP superiority source diversity requires audience-language evidence from Reddit, forum, video, social, or PAA.");
  if (!roles.has("trust_citation_source")) issues.push("SERP superiority source diversity requires trust/citation evidence for trust-sensitive claims.");
  return issues;
}

function strongCompetitorCount(delta: CompetitorDepthDelta | undefined): number {
  return (delta?.primarySerpTop5 ?? []).filter((competitor) =>
    competitor.strengthLabel === "strong" || competitor.strengthLabel === "excellent"
  ).length;
}

function validatePublishWorthinessSpecificity(brief: PreDraftQualityBrief, evidenceRefs: Set<string>): string[] {
  const issues: string[] = [];
  const readerQuestions = publishWorthinessItems(brief.readerQuestionCoverage, "reader question coverage", issues, evidenceRefs);
  const recommendationChecks = publishWorthinessItems(brief.recommendationSanityPlan, "recommendation sanity check", issues, evidenceRefs);
  const claimRisks = publishWorthinessItems(brief.claimRiskPlan, "claim risk", issues, evidenceRefs);
  const troubleshootingItems = publishWorthinessItems(brief.troubleshootingPlan, "troubleshooting", issues, evidenceRefs);

  if (readerQuestions.length >= 8 && readerQuestions.some((entry) => isWeakReaderQuestion(entry.item))) {
    issues.push("Pre-draft quality brief reader questions must be specific, long-tail, and tied to a concrete audience, symptom, product, situation, objection, or decision.");
  }
  if (recommendationChecks.length >= 3 && recommendationChecks.some((entry) => isWeakRecommendationSanityCheck(entry.item))) {
    issues.push("Pre-draft quality brief recommendation sanity checks must name a recommendation role, avoid-if condition, suitability check, evidence need, source need, or market fit.");
  }
  if (claimRisks.length >= 5 && claimRisks.some((entry) => isWeakClaimRiskItem(entry.item))) {
    issues.push("Pre-draft quality brief claim risk items must name a risky phrase, claim type, citation need, or safer rewrite.");
  }
  if (troubleshootingItems.length >= 4 && troubleshootingItems.some((entry) => isWeakTroubleshootingItem(entry.item))) {
    issues.push("Pre-draft quality brief troubleshooting items must include a trigger or symptom plus a stop, switch, repair, monitor, or escalation action.");
  }

  return issues;
}

function publishWorthinessItems(
  items: unknown[] | undefined,
  label: string,
  issues: string[],
  evidenceRefs: Set<string>
): Array<Required<PublishWorthinessItem> & { sourceRefs: string[] }> {
  const validItems: Array<Required<PublishWorthinessItem> & { sourceRefs: string[] }> = [];
  let hasShapeIssue = false;
  let hasUnknownSourceRef = false;

  for (const item of items ?? []) {
    if (!isRecord(item)) {
      hasShapeIssue = true;
      continue;
    }

    const sourceRefs = stringItems(readUnknownArray(item.sourceRefs));
    const candidate = {
      item: readString(item.item),
      sourceRefs,
      mappedSectionId: readString(item.mappedSectionId),
      whyThisMatters: readString(item.whyThisMatters),
      finalCopyUse: readString(item.finalCopyUse)
    };

    if (
      !hasText(candidate.item)
      || sourceRefs.length === 0
      || !hasText(candidate.mappedSectionId)
      || !hasText(candidate.whyThisMatters)
      || !hasText(candidate.finalCopyUse)
    ) {
      hasShapeIssue = true;
      continue;
    }

    if (!sourceRefs.some((sourceRef) => evidenceRefs.has(sourceRef))) {
      hasUnknownSourceRef = true;
    }

    validItems.push(candidate as Required<PublishWorthinessItem> & { sourceRefs: string[] });
  }

  if (hasShapeIssue) {
    issues.push(`Pre-draft quality brief ${label} items require item, sourceRefs, mappedSectionId, whyThisMatters, and finalCopyUse.`);
  }
  if (hasUnknownSourceRef) {
    issues.push(`Pre-draft quality brief ${label} sourceRefs must reference extracted fact ids, audience signal ids, or analyzed source URLs.`);
  }

  return validItems;
}

function isWeakReaderQuestion(item: string): boolean {
  const normalized = normalizeText(item);
  const genericQuestions = new Set([
    "what is this",
    "how does it work",
    "is it good",
    "what is best",
    "is it safe",
    "how long",
    "what next",
    "should i use it"
  ]);

  if (genericQuestions.has(normalized)) return true;
  if (!item.trim().endsWith("?")) return true;
  if (wordCount(item) < 4) return true;
  if (/\b(it|this|that|thing)\b/.test(normalized) && !hasConcreteSignal(normalized)) return true;

  return false;
}

function isWeakRecommendationSanityCheck(item: string): boolean {
  const normalized = normalizeText(item);
  if (wordCount(item) < 7) return true;
  if (isGenericFiller(normalized)) return true;

  return !/\b(role|avoid|avoid-if|condition|suitability|suitable|evidence|source|label|ingredient|market|availability|price|pricing|routine|recommendation|product|active|service|tool|fit)\b/.test(normalized);
}

function isWeakClaimRiskItem(item: string): boolean {
  const normalized = normalizeText(item);
  if (wordCount(item) < 5) return true;
  if (isGenericFiller(normalized)) return true;

  return !/\b(claim|cite|citation|source|rewrite|replace|soften|avoid|clinically|proven|dermatologist|approved|safe|safest|non-comedogenic|guarantee|diagnos|detect|ai|evidence|risk|unsupported)\b/.test(normalized);
}

function isWeakTroubleshootingItem(item: string): boolean {
  const normalized = normalizeText(item);
  if (wordCount(item) < 6) return true;
  if (isGenericFiller(normalized)) return true;

  const hasTrigger = /\b(if|when|after|appear|appears|worse|worsens|burn|burning|redness|tight|bumps|breakout|breakouts|irritation|painful|cystic|side effect|no improvement)\b/.test(normalized);
  const hasAction = /\b(stop|switch|reduce|repair|seek|see|monitor|pause|avoid|restart|escalat|dermatologist|doctor|medical|check)\b/.test(normalized);

  return !(hasTrigger && hasAction);
}

function stringItems(items: unknown[] | undefined): string[] {
  return (items ?? []).filter((item): item is string => typeof item === "string" && item.trim().length > 0);
}

function readUnknownArray(value: unknown): unknown[] | undefined {
  return Array.isArray(value) ? value : undefined;
}

function readString(value: unknown): string | undefined {
  return typeof value === "string" ? value : undefined;
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return Boolean(value && typeof value === "object" && !Array.isArray(value));
}

function normalizeText(value: string): string {
  return value.toLowerCase().replace(/[^a-z0-9\s-]/g, "").replace(/\s+/g, " ").trim();
}

function wordCount(value: string): number {
  return normalizeText(value).split(" ").filter(Boolean).length;
}

function isGenericFiller(normalized: string): boolean {
  return [
    "recommend good products",
    "check if it is useful",
    "make sure it is safe",
    "cite claims",
    "be careful",
    "avoid risky claims",
    "use sources",
    "do not overclaim",
    "help if it gets worse",
    "fix side effects",
    "tell users what to do",
    "see a doctor"
  ].includes(normalized);
}

function hasConcreteSignal(normalized: string): boolean {
  return /\b(acne|skin|sunscreen|cleanse|cleansing|cleanser|oil|micellar|comedone|comedones|bumps|barrier|salicylic|adapalene|benzoyl|isotretinoin|dermatologist|humidity|india|routine|texture|redness|marks|active|product|symptom|price|pricing|service|tool|ingredient|risk|result|results)\b/.test(normalized);
}

function validatePageDepthScore(score: PageDepthScore | undefined): string[] {
  const issues: string[] = [];
  const overallScore = readNumber(score?.overallScore);
  const informationGainItems = score?.informationGainItems ?? [];
  const budgets = score?.sectionEvidenceBudgets ?? [];

  if (overallScore < 85) {
    issues.push("Depth score must be at least 85.");
  }
  for (const dimension of requiredPageDepthScoreDimensions) {
    const value = score?.dimensions?.[dimension];
    if (readNumber(value) < 4) {
      issues.push(`${dimension}: depth dimension must be at least 4/5.`);
    }
  }
  if (informationGainItems.length < 8) {
    issues.push("Depth score requires at least 8 information gain items.");
  }
  if (budgets.length === 0) {
    issues.push("Depth score requires section evidence budgets.");
  }
  for (const budget of budgets) {
    if ((budget.facts ?? []).length < 2 || (budget.citedClaims ?? []).length < 1 || (budget.usefulnessItems ?? []).length < 1) {
      issues.push(`${budget.sectionId}: section evidence budget requires 2 facts, 1 cited claim, and 1 concrete usefulness item.`);
    }
  }

  return issues;
}

const requiredPageDepthScoreDimensions = [
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

function validateSectionAlignment(input: PageDepthContractInput): string[] {
  const expectedSectionIds = new Set(input.expectedSectionIds ?? []);
  if (expectedSectionIds.size === 0) return [];

  const issues: string[] = [];
  const referencedSectionIds = new Set<string>();
  const add = (sectionId: string | undefined, context: string) => {
    if (!hasText(sectionId)) return;
    referencedSectionIds.add(sectionId);
    if (!expectedSectionIds.has(sectionId)) {
      issues.push(`${context}: ${sectionId} does not match a generated page section.`);
    }
  };

  for (const fact of input.researchExtractionMatrix?.extractedFacts ?? []) add(fact.sectionRelevance, "Research extraction section relevance");
  for (const improvement of input.competitorDepthDelta?.specificityImprovements ?? []) add(improvement.sectionId, "Competitor specificity improvement");
  for (const signal of input.audiencePainPointLedger?.signals ?? []) add(signal.mappedSectionId, "Audience signal mapped section");
  for (const promise of input.preDraftSynthesisBrief?.sectionPromises ?? []) {
    if (isRecord(promise)) add(readString(promise.sectionId), "Pre-draft section promise");
  }
  for (const item of [
    ...(input.preDraftQualityBrief?.readerQuestionCoverage ?? []),
    ...(input.preDraftQualityBrief?.recommendationSanityPlan ?? []),
    ...(input.preDraftQualityBrief?.claimRiskPlan ?? []),
    ...(input.preDraftQualityBrief?.troubleshootingPlan ?? [])
  ]) {
    add(item.mappedSectionId, "Publish-worthiness mapped section");
  }
  for (const component of input.preDraftQualityBrief?.superiorityComponents ?? []) add(component.mappedSectionId, "Superiority component mapped section");
  for (const improvement of input.preDraftQualityBrief?.differentiatedImprovements ?? []) add(improvement.mappedSectionId, "Differentiated improvement mapped section");
  for (const block of input.preDraftQualityBrief?.extractableAnswerBlocks ?? []) add(block.mappedSectionId, "Extractable answer mapped section");
  const structurePlan = input.preDraftQualityBrief?.researchDerivedStructurePlan;
  add(structurePlan?.primaryConcernVisibleBySectionId, "Research-derived primary concern section");
  for (const section of structurePlan?.sections ?? []) add(section.sectionId, "Research-derived structure section");
  for (const component of structurePlan?.highImpactComponents ?? []) add(component.mappedSectionId, "Research-derived structure component mapped section");
  for (const decision of structurePlan?.structureDecisions ?? []) add(decision.sectionId, "Research-derived structure decision section");
  for (const budget of input.pageDepthScore?.sectionEvidenceBudgets ?? []) add(budget.sectionId, "Depth score section evidence budget");

  for (const sectionId of expectedSectionIds) {
    if (!referencedSectionIds.has(sectionId)) {
      issues.push(`${sectionId}: generated page section must be covered by depth artifacts.`);
    }
  }

  return [...new Set(issues)];
}

function hasText(value: string | undefined): value is string {
  return Boolean(value && value.trim().length > 0);
}

function readNumber(value: unknown): number {
  return typeof value === "number" && Number.isFinite(value) ? value : 0;
}
