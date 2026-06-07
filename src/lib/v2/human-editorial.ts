export interface HumanEditorialValidationResult {
  status: "passed" | "failed";
  blockingIssues: string[];
  advisoryIssues: string[];
  summary: HumanEditorialSummary;
}

export interface HumanEditorialSummary {
  voiceModel: string;
  depth?: string;
  examplesCount: number;
  decisionFrameworkType?: string;
  brandPovUsed: boolean;
  keyHumanTouches: string[];
  topHumanQualityRisks: string[];
}

export interface ClaimFirstSectionPlanValidationResult {
  status: "passed" | "failed";
  blockingIssues: string[];
  advisoryIssues: string[];
  sectionCount: number;
}

export interface HumanEditorialQaSummary extends HumanEditorialSummary {
  status: "passed" | "failed";
}

export function validateHumanEditorialBrief(value: unknown): HumanEditorialValidationResult {
  const brief = asRecord(value);
  const blockingIssues: string[] = [];
  const advisoryIssues: string[] = [];
  const voiceModel = readString(brief, "voiceModel");
  const depthStrategy = asRecord(brief.depthStrategy);
  const exampleRequirement = asRecord(brief.exampleRequirement);
  const humanDevices = asRecord(brief.humanDevices);
  const decisionFramework = asRecord(humanDevices.decisionFramework);
  const commonMistakes = asRecord(humanDevices.commonMistakes);
  const notRightForYou = asRecord(humanDevices.notRightForYou);
  const brandPov = asRecord(humanDevices.brandPov);
  const finalClosing = asRecord(humanDevices.finalClosingBeforeCta);
  const plannedExamples = readArray(exampleRequirement, "plannedExamples");
  const minimumExamples = readNumber(exampleRequirement, "minimumExamplesPerPage") ?? 2;
  const decisionFrameworkType = readString(decisionFramework, "selectedFormat");
  const commonMistakesToCover = readArray(commonMistakes, "mistakesToCover");
  const notRightConditions = readArray(notRightForYou, "conditions");
  const brandPovStatement = readString(brandPov, "statement");
  const finalClosingText = readString(finalClosing, "plannedClosing");

  if (voiceModel !== "category_manager_with_editorial_empathy") {
    blockingIssues.push("Human editorial brief must use category_manager_with_editorial_empathy voice model.");
  }

  if (plannedExamples.length < minimumExamples) {
    blockingIssues.push(`At least ${minimumExamples} useful examples or scenarios are required.`);
  }

  if (readBoolean(decisionFramework, "required") !== false && !decisionFrameworkType) {
    blockingIssues.push("A selected decision framework format is required.");
  }

  if (readBoolean(commonMistakes, "required") !== false && commonMistakesToCover.length === 0) {
    blockingIssues.push("At least one blended common mistake is required.");
  }

  if (readBoolean(notRightForYou, "required") === true && notRightConditions.length === 0) {
    blockingIssues.push("Product/category and comparison pages require not-right-for-you guidance.");
  }

  if (!brandPovStatement) {
    blockingIssues.push("Clear, non-salesy brand POV statement is required.");
  }

  if (readBoolean(finalClosing, "required") !== false && !finalClosingText) {
    blockingIssues.push("A short human closing before CTA is required.");
  }

  const keyHumanTouches = collectKeyHumanTouches({
    decisionFrameworkType,
    commonMistakesToCover,
    notRightConditions,
    finalClosingText
  });
  const topHumanQualityRisks = blockingIssues.slice(0, 5);

  return {
    status: blockingIssues.length === 0 ? "passed" : "failed",
    blockingIssues,
    advisoryIssues,
    summary: {
      voiceModel,
      depth: readString(depthStrategy, "depth"),
      examplesCount: plannedExamples.length,
      decisionFrameworkType,
      brandPovUsed: Boolean(brandPovStatement),
      keyHumanTouches,
      topHumanQualityRisks
    }
  };
}

export function validateClaimFirstSectionPlan(value: unknown): ClaimFirstSectionPlanValidationResult {
  const plan = asRecord(value);
  const sections = readArray(plan, "sections");
  const blockingIssues: string[] = [];

  if (sections.length === 0) {
    blockingIssues.push("Claim-first section plan requires at least one planned visible section.");
  }

  for (const rawSection of sections) {
    const section = asRecord(rawSection);
    const sectionId = readString(section, "sectionId") || "unknown section";

    if (!readString(section, "sectionClaim")) {
      blockingIssues.push(`${sectionId}: section claim is required.`);
    }
    if (!readString(section, "readerQuestion")) {
      blockingIssues.push(`${sectionId}: reader question is required.`);
    }
    if (!hasTextOrItems(section.evidenceNeeded)) {
      blockingIssues.push(`${sectionId}: evidence need is required.`);
    }
    if (!hasTextOrItems(section.exampleOrTradeoff)) {
      blockingIssues.push(`${sectionId}: example or tradeoff is required.`);
    }
    if (!readString(section, "decisionPurpose")) {
      blockingIssues.push(`${sectionId}: decision purpose is required.`);
    }
    if (!readString(section, "transitionPurpose")) {
      blockingIssues.push(`${sectionId}: transition purpose is required.`);
    }
  }

  return {
    status: blockingIssues.length === 0 ? "passed" : "failed",
    blockingIssues,
    advisoryIssues: [],
    sectionCount: sections.length
  };
}

export function buildHumanEditorialQaSummary(input: {
  briefResult: HumanEditorialValidationResult;
  planResult: ClaimFirstSectionPlanValidationResult;
}): HumanEditorialQaSummary {
  const topHumanQualityRisks = [
    ...input.briefResult.summary.topHumanQualityRisks,
    ...input.planResult.blockingIssues
  ].slice(0, 5);

  return {
    ...input.briefResult.summary,
    status: input.briefResult.status === "passed" && input.planResult.status === "passed" ? "passed" : "failed",
    topHumanQualityRisks
  };
}

function collectKeyHumanTouches(input: {
  decisionFrameworkType?: string;
  commonMistakesToCover: unknown[];
  notRightConditions: unknown[];
  finalClosingText: string;
}): string[] {
  const touches: string[] = [];
  if (input.decisionFrameworkType) touches.push(`decision framework: ${input.decisionFrameworkType}`);
  if (input.commonMistakesToCover.length > 0) touches.push("common mistakes blended into relevant sections");
  if (input.notRightConditions.length > 0) touches.push("not-right-for-you guidance");
  if (input.finalClosingText) touches.push("short human closing before CTA");
  return touches;
}

function asRecord(value: unknown): Record<string, unknown> {
  return value && typeof value === "object" && !Array.isArray(value) ? value as Record<string, unknown> : {};
}

function readString(record: Record<string, unknown>, key: string): string {
  const value = record[key];
  return typeof value === "string" ? value.trim() : "";
}

function readNumber(record: Record<string, unknown>, key: string): number | undefined {
  const value = record[key];
  return typeof value === "number" ? value : undefined;
}

function readBoolean(record: Record<string, unknown>, key: string): boolean | undefined {
  const value = record[key];
  return typeof value === "boolean" ? value : undefined;
}

function readArray(record: Record<string, unknown>, key: string): unknown[] {
  const value = record[key];
  return Array.isArray(value) ? value : [];
}

function hasTextOrItems(value: unknown): boolean {
  if (typeof value === "string") return value.trim().length > 0;
  if (Array.isArray(value)) return value.length > 0;
  return false;
}
