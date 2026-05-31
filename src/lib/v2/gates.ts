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
