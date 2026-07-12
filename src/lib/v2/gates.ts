export interface V2GateValidationResult {
  status: "passed" | "passed_limited_confidence" | "failed";
  machineChecksPassed: boolean;
  judgmentChecksPassed: boolean;
  blockingIssues: string[];
  advisoryIssues: string[];
}

export interface SerpResearchGateInput {
  analyzedSources: Array<{
    url: string;
    sourceType: string;
    extractionStatus: string;
    bodySummary?: string;
    h2h3Outline?: string[];
  }>;
  contentGapSynthesis?: {
    gaps?: string[];
    differentiationOpportunities?: string[];
  };
  judgmentChecks?: JudgmentChecks;
}

export interface SocialVideoResearchGateInput {
  assets: Array<{
    id: string;
    accessStatus: "reviewed" | "inaccessible";
    failureReason?: string;
  }>;
  insights: string[];
  judgmentChecks?: JudgmentChecks;
}

export interface AudienceDefinitionGateInput {
  targetCohort?: string;
  awarenessStage?: string;
  readerTakeaway?: string;
  objections?: string[];
  ctaConnection?: string;
  judgmentChecks?: JudgmentChecks;
}

export interface NarrativeBriefGateInput {
  primaryStyle?: string;
  secondaryFlavor?: string;
  openingAngle?: string;
  brandPov?: string;
  pagePromise?: string;
  sectionDirections?: Array<{
    sectionId: string;
    direction: string;
  }>;
  judgmentChecks?: JudgmentChecks;
}

export interface CitationSetGateInput {
  claims: Array<{
    claim: string;
    strength: "low" | "medium" | "high" | "critical";
    sourceUrl?: string;
    approvalStatus?: "approved" | "not_required" | "missing";
  }>;
  judgmentChecks?: JudgmentChecks;
}

export interface ContentBriefGateInput {
  upstreamHashes: {
    step0AHash?: string;
    step0BHash?: string;
    pageJobHash?: string;
    searchIntentHash?: string;
    pageFormatHash?: string;
    nextActionHash?: string;
    serpCompetitorHash?: string;
    topicResearchHash?: string;
    uniqueAngleHash?: string;
  };
  contentBriefSummaryStatement?: string;
  readerOutcomePromise?: string;
  targetWordCountContract?: {
    minimumWordCount?: number;
    targetWordCountRange?: {
      min?: number;
      max?: number;
    };
    rangeBasis?: string;
    rangeFlexibility?: string;
  };
  depthRequirements?: {
    highDepthRequirements?: unknown[];
    supportingDepthRequirements?: unknown[];
    keepBriefOrExclude?: unknown[];
  };
  instructionRegistry?: Array<{
    instructionId?: string;
    priority?: "mandatory" | "conditional" | "supporting" | "prohibited";
    writerInstruction?: string;
    sourceRefs?: string[];
    deliveryTest?: string;
  }>;
  upstreamCoverageMatrix?: unknown[];
  sourceUseGuidance?: unknown[];
  assetBriefingContract?: unknown[];
  voiceAndQualityContract?: Record<string, unknown>;
  readabilityAndScanabilityRequirements?: unknown[];
  antiGenericContract?: {
    genericFailureRisks?: unknown[];
    pageSpecificityRequirements?: unknown[];
    genericPhrasesOrMovesToAvoid?: unknown[];
  };
  synthesisRequirement?: string;
  brandFitBoundaries?: Record<string, unknown>;
  recencySensitivityCheck?: {
    recencySensitive?: boolean;
    freshnessRequirements?: unknown[];
  };
  marketLocalizationRequirements?: {
    marketSensitive?: boolean;
    requirements?: unknown[];
  };
  readerObjectionHandling?: {
    required?: boolean;
    objections?: unknown[];
  };
  practicalDeviceRequirements?: {
    sharedBaselineConfigVersion?: string;
    pageSpecificMinimums?: unknown[];
  };
  minimumCompletenessStandard?: unknown[];
  draftRepairGuidance?: unknown[];
  batchBriefIsolationCheck?: {
    pageSpecificBrief?: boolean;
    reusedPriorBrief?: boolean;
    similarityToCurrentBatch?: "low" | "medium" | "high" | "unknown";
  };
  semanticBriefUniquenessCheck?: {
    currentBatchUnique?: boolean;
    historicalUniquenessChecked?: boolean;
  };
  contentBriefDeliveryProofRequirements?: {
    step9Required?: boolean;
    step10Required?: boolean;
    finalQaRequired?: boolean;
  };
  mustCarryForward?: unknown[];
  step8OutputMustNotContain?: string[];
  step8CompletenessChecklist?: Record<string, boolean>;
  markdownParityChecked?: boolean;
  judgmentChecks?: JudgmentChecks;
}

interface JudgmentChecks {
  passed: boolean;
  notes?: string;
}

export function validateSerpResearchGate(ledger: SerpResearchGateInput): V2GateValidationResult {
  const machineIssues: string[] = [];
  const meaningful = ledger.analyzedSources.filter(isMeaningfullyExtractedSerpSource);
  const cappedCount = meaningful.filter((source) => cappedSourceTypes.has(source.sourceType)).length;

  if (meaningful.length < 10) machineIssues.push("SERP research requires 10 meaningful webpage extractions.");
  if (cappedCount > 2) machineIssues.push("At most 2 analyzed SERP sources can be capped source types.");
  if (!ledger.contentGapSynthesis?.gaps?.length) machineIssues.push("Content gap synthesis must include gaps.");
  if (!ledger.contentGapSynthesis?.differentiationOpportunities?.length) {
    machineIssues.push("Content gap synthesis must include differentiation opportunities.");
  }

  return buildGateResult(machineIssues, ledger.judgmentChecks);
}

export function validateSocialVideoResearchGate(research: SocialVideoResearchGateInput): V2GateValidationResult {
  const machineIssues: string[] = [];
  const advisoryIssues: string[] = [];
  const reviewed = research.assets.filter((asset) => asset.accessStatus === "reviewed");
  const inaccessible = research.assets.filter((asset) => asset.accessStatus === "inaccessible");
  const inaccessibleWithoutReason = inaccessible.filter((asset) => !hasText(asset.failureReason));

  if (research.assets.length < 7) machineIssues.push("Social/video research requires at least 7 attempted assets.");
  if (inaccessibleWithoutReason.length > 0) machineIssues.push("Inaccessible social/video assets must include failure reasons.");
  if (research.insights.length === 0) machineIssues.push("Social/video research must include at least one usable insight.");

  let limitedConfidence = false;
  if (reviewed.length < 5) {
    if (research.assets.length >= 7 && inaccessible.length > 0 && inaccessibleWithoutReason.length === 0) {
      limitedConfidence = true;
      advisoryIssues.push("Social/video research passed with limited confidence.");
    } else {
      machineIssues.push("Social/video research requires 5 reviewed assets when accessible.");
    }
  }

  return buildGateResult(machineIssues, research.judgmentChecks, advisoryIssues, limitedConfidence);
}

export function validateAudienceDefinitionGate(audience: AudienceDefinitionGateInput): V2GateValidationResult {
  const machineIssues: string[] = [];

  if (!hasText(audience.targetCohort)) machineIssues.push("Audience definition must include a target cohort.");
  if (!hasText(audience.awarenessStage)) machineIssues.push("Audience definition must include reader awareness stage.");
  if (!hasText(audience.readerTakeaway)) machineIssues.push("Audience definition must include reader takeaway.");
  if (!audience.objections?.length) machineIssues.push("Audience definition must include at least one objection or trust barrier.");
  if (!hasText(audience.ctaConnection)) machineIssues.push("Audience definition must connect the reader to the CTA.");

  return buildGateResult(machineIssues, audience.judgmentChecks);
}

export function validateNarrativeBriefGate(brief: NarrativeBriefGateInput): V2GateValidationResult {
  const machineIssues: string[] = [];

  if (!hasText(brief.primaryStyle)) machineIssues.push("Narrative brief must include a selected primary style.");
  if (!hasText(brief.openingAngle)) machineIssues.push("Narrative brief must include an opening angle.");
  if (!hasText(brief.brandPov)) machineIssues.push("Narrative brief must include brand POV.");
  if (!hasText(brief.pagePromise)) machineIssues.push("Narrative brief must include page promise.");
  if (!brief.sectionDirections?.some((section) => hasText(section.sectionId) && hasText(section.direction))) {
    machineIssues.push("Narrative brief must include section-level direction.");
  }

  return buildGateResult(machineIssues, brief.judgmentChecks);
}

export function validateCitationSetGate(citationSet: CitationSetGateInput): V2GateValidationResult {
  const machineIssues: string[] = [];
  const highClaimWithoutSource = citationSet.claims.some((claim) => claim.strength === "high" && !hasText(claim.sourceUrl));
  const criticalClaimWithoutApprovalAndSource = citationSet.claims.some((claim) =>
    claim.strength === "critical" && (!hasText(claim.sourceUrl) || claim.approvalStatus !== "approved")
  );

  if (citationSet.claims.length === 0) machineIssues.push("Citation set must include claim mappings.");
  if (highClaimWithoutSource) machineIssues.push("High-strength claims require source support.");
  if (criticalClaimWithoutApprovalAndSource) machineIssues.push("Critical claims require explicit approval and source support.");

  return buildGateResult(machineIssues, citationSet.judgmentChecks);
}

export function validateContentBriefGate(brief: ContentBriefGateInput): V2GateValidationResult {
  const machineIssues: string[] = [];
  const requiredHashes: Array<keyof ContentBriefGateInput["upstreamHashes"]> = [
    "step0AHash",
    "step0BHash",
    "pageJobHash",
    "searchIntentHash",
    "pageFormatHash",
    "nextActionHash",
    "serpCompetitorHash",
    "topicResearchHash",
    "uniqueAngleHash"
  ];
  const missingHashes = requiredHashes.filter((hashName) => !hasText(brief.upstreamHashes?.[hashName]));

  if (missingHashes.length > 0) {
    machineIssues.push(`Content brief requires all upstream hashes before Step 9: ${missingHashes.join(", ")}.`);
  }
  if (!hasText(brief.contentBriefSummaryStatement)) {
    machineIssues.push("Content brief must include contentBriefSummaryStatement.");
  }
  if (!hasText(brief.readerOutcomePromise)) {
    machineIssues.push("Content brief must include readerOutcomePromise.");
  }
  if (!brief.targetWordCountContract?.minimumWordCount || brief.targetWordCountContract.minimumWordCount <= 0) {
    machineIssues.push("Content brief must include a positive minimumWordCount.");
  }
  if (!brief.targetWordCountContract?.targetWordCountRange?.min || !brief.targetWordCountContract.targetWordCountRange.max) {
    machineIssues.push("Content brief must include targetWordCountRange.");
  }
  if (!hasText(brief.targetWordCountContract?.rangeBasis)) {
    machineIssues.push("Content brief must justify the word-count range basis.");
  }
  if ((brief.depthRequirements?.highDepthRequirements?.length ?? 0) < 3) {
    machineIssues.push("Content brief requires at least 3 highDepthRequirements.");
  }
  if ((brief.depthRequirements?.supportingDepthRequirements?.length ?? 0) < 2) {
    machineIssues.push("Content brief requires at least 2 supportingDepthRequirements.");
  }
  if ((brief.depthRequirements?.keepBriefOrExclude?.length ?? 0) < 2) {
    machineIssues.push("Content brief requires at least 2 keepBriefOrExclude depth boundaries.");
  }
  if (!brief.instructionRegistry?.length) {
    machineIssues.push("Content brief must include instructionRegistry.");
  } else {
    const mandatoryInstruction = brief.instructionRegistry.some((instruction) => instruction.priority === "mandatory");
    const prohibitedInstruction = brief.instructionRegistry.some((instruction) => instruction.priority === "prohibited");
    const incompleteInstruction = brief.instructionRegistry.some((instruction) =>
      !hasText(instruction.instructionId) ||
      !hasText(instruction.writerInstruction) ||
      !instruction.sourceRefs?.length ||
      !hasText(instruction.deliveryTest)
    );
    if (!mandatoryInstruction) machineIssues.push("Content brief instructionRegistry must include at least one mandatory instruction.");
    if (!prohibitedInstruction) machineIssues.push("Content brief instructionRegistry must include at least one prohibited instruction.");
    if (incompleteInstruction) machineIssues.push("Content brief instructions must include id, instruction, source refs, and delivery test.");
  }
  if (!brief.upstreamCoverageMatrix?.length) {
    machineIssues.push("Content brief must include upstreamCoverageMatrix.");
  }
  if (!brief.sourceUseGuidance?.length) {
    machineIssues.push("Content brief must include sourceUseGuidance.");
  }
  if (!brief.assetBriefingContract?.length) {
    machineIssues.push("Content brief must include assetBriefingContract.");
  }
  if (!brief.voiceAndQualityContract || Object.keys(brief.voiceAndQualityContract).length === 0) {
    machineIssues.push("Content brief must include voiceAndQualityContract.");
  }
  if (!brief.readabilityAndScanabilityRequirements?.length) {
    machineIssues.push("Content brief must include readabilityAndScanabilityRequirements.");
  }
  if (!brief.antiGenericContract?.genericFailureRisks?.length ||
    !brief.antiGenericContract.pageSpecificityRequirements?.length ||
    !brief.antiGenericContract.genericPhrasesOrMovesToAvoid?.length) {
    machineIssues.push("Content brief must include a complete antiGenericContract.");
  }
  if (!hasText(brief.synthesisRequirement)) {
    machineIssues.push("Content brief must include synthesisRequirement.");
  }
  if (!brief.brandFitBoundaries || Object.keys(brief.brandFitBoundaries).length === 0) {
    machineIssues.push("Content brief must include brandFitBoundaries.");
  }
  if (!brief.recencySensitivityCheck) {
    machineIssues.push("Content brief must include recencySensitivityCheck.");
  }
  if (brief.recencySensitivityCheck?.recencySensitive && !brief.recencySensitivityCheck.freshnessRequirements?.length) {
    machineIssues.push("Recency-sensitive briefs require freshnessRequirements.");
  }
  if (brief.marketLocalizationRequirements?.marketSensitive && !brief.marketLocalizationRequirements.requirements?.length) {
    machineIssues.push("Market-sensitive briefs require marketLocalizationRequirements.");
  }
  if (brief.readerObjectionHandling?.required && !brief.readerObjectionHandling.objections?.length) {
    machineIssues.push("Briefs with reader objections require readerObjectionHandling objections.");
  }
  if (!hasText(brief.practicalDeviceRequirements?.sharedBaselineConfigVersion)) {
    machineIssues.push("Content brief must reference the shared practical-device baseline config version.");
  }
  if (!brief.practicalDeviceRequirements?.pageSpecificMinimums?.length) {
    machineIssues.push("Content brief must include page-specific practical device minimums.");
  }
  if (!brief.minimumCompletenessStandard?.length) {
    machineIssues.push("Content brief must include minimumCompletenessStandard.");
  }
  if (!brief.draftRepairGuidance?.length) {
    machineIssues.push("Content brief must include draftRepairGuidance.");
  }
  if (brief.batchBriefIsolationCheck?.pageSpecificBrief !== true || brief.batchBriefIsolationCheck.reusedPriorBrief === true) {
    machineIssues.push("Content brief must pass batchBriefIsolationCheck.");
  }
  if (brief.semanticBriefUniquenessCheck?.currentBatchUnique !== true) {
    machineIssues.push("Content brief must pass current-batch semantic uniqueness.");
  }
  if (!brief.contentBriefDeliveryProofRequirements?.step9Required ||
    !brief.contentBriefDeliveryProofRequirements.step10Required ||
    !brief.contentBriefDeliveryProofRequirements.finalQaRequired) {
    machineIssues.push("Content brief must require Step 9, Step 10, and final QA delivery proof.");
  }
  if (!brief.mustCarryForward?.length) {
    machineIssues.push("Content brief must include mustCarryForward.");
  }
  if (!brief.step8OutputMustNotContain?.length) {
    machineIssues.push("Content brief must include step8OutputMustNotContain.");
  }
  if (!brief.step8CompletenessChecklist || Object.keys(brief.step8CompletenessChecklist).length === 0) {
    machineIssues.push("Content brief must include step8CompletenessChecklist.");
  } else {
    const failedChecklistItems = Object.entries(brief.step8CompletenessChecklist)
      .filter(([, passed]) => passed !== true)
      .map(([key]) => key);
    if (failedChecklistItems.length > 0) {
      machineIssues.push(`Content brief completeness checklist failed: ${failedChecklistItems.join(", ")}.`);
    }
  }
  if (brief.markdownParityChecked !== true) {
    machineIssues.push("Content brief Markdown parity must be checked.");
  }

  return buildGateResult(machineIssues, brief.judgmentChecks);
}

export function allMandatoryGatesPassed(results: V2GateValidationResult[]): boolean {
  return results.every((result) =>
    (result.status === "passed" || result.status === "passed_limited_confidence") &&
    result.machineChecksPassed &&
    result.judgmentChecksPassed &&
    result.blockingIssues.length === 0
  );
}

const cappedSourceTypes = new Set(["forum", "directory", "marketplace", "community", "aggregator", "reddit", "quora"]);

function isMeaningfullyExtractedSerpSource(source: SerpResearchGateInput["analyzedSources"][number]): boolean {
  return hasText(source.url) &&
    source.extractionStatus === "success" &&
    Boolean(source.bodySummary && source.bodySummary.trim().length >= 80) &&
    Array.isArray(source.h2h3Outline) &&
    source.h2h3Outline.length > 0;
}

function buildGateResult(
  machineIssues: string[],
  judgmentChecks?: JudgmentChecks,
  advisoryIssues: string[] = [],
  limitedConfidence = false
): V2GateValidationResult {
  const judgmentChecksPassed = Boolean(judgmentChecks?.passed);
  const blockingIssues = [...machineIssues];
  if (!judgmentChecksPassed) blockingIssues.push("Host-agent judgment checks must pass.");

  return {
    status: blockingIssues.length === 0 ? (limitedConfidence ? "passed_limited_confidence" : "passed") : "failed",
    machineChecksPassed: machineIssues.length === 0,
    judgmentChecksPassed,
    blockingIssues,
    advisoryIssues
  };
}

function hasText(value: string | undefined): boolean {
  return Boolean(value && value.trim().length > 0);
}
