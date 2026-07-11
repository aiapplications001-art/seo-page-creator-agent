import type { PagePacket } from "../page-packet.js";
import { detectPlaceholderCopy } from "./heuristics.js";
import type { PreDraftQualityBrief } from "./depth.js";

export interface FinalCopyDraftSection {
  sectionId: string;
  markdown: string;
  evidenceRefs?: string[];
  citationClaimIds?: string[];
  audienceSignalIds?: string[];
  standoutElementRefs?: string[];
}

export interface FinalCopyReference {
  sourceUrl: string;
  label: string;
  claimIds?: string[];
}

export interface FinalCopyDraft {
  schemaVersion: "final-copy-draft.v2";
  adapter: string;
  generatedAt: string;
  sections: FinalCopyDraftSection[];
  references?: FinalCopyReference[];
  standoutElements?: Array<{
    id: string;
    type: string;
    title: string;
  }>;
  superiorityProof?: FinalCopySuperiorityProof;
  structurePlanDeliveryProof?: FinalCopyStructurePlanDeliveryProof;
  qaNotes?: string[];
}

export interface FinalCopySuperiorityProof {
  intentWinsDelivered?: Array<{
    intentDimensionId?: string;
    sectionId?: string;
    evidenceRefs?: unknown[];
    finalCopyEvidence?: string;
  }>;
  superiorityComponentsDelivered?: Array<{
    componentId?: string;
    sectionId?: string;
    visibleOutputType?: string;
    finalCopyEvidence?: string;
  }>;
  differentiatedImprovementsDelivered?: Array<{
    improvementId?: string;
    sectionId?: string;
    visibleOutputType?: string;
    finalCopyEvidence?: string;
  }>;
  extractableAnswerBlocksDelivered?: Array<{
    blockType?: string;
    sectionId?: string;
    finalCopyEvidence?: string;
  }>;
  visibleCitationHandling?: Array<{
    claim?: string;
    claimImportance?: "minor" | "important" | "critical" | "brand_capability";
    sourceRefs?: unknown[];
    finalCopyEvidence?: string;
  }>;
  whyThisDeservesToRank?: string;
}

export interface FinalCopyStructurePlanDeliveryProof {
  primaryConcernDelivered?: {
    sectionId?: string;
    finalCopyEvidence?: string;
  };
  highImpactComponentsDelivered?: Array<{
    componentType?: string;
    mappedSectionId?: string;
    finalCopyEvidence?: string;
  }>;
  expectedVisibleOutputsDelivered?: Array<{
    mappedSectionId?: string;
    finalCopyEvidence?: string;
  }>;
  structureDecisionsDelivered?: Array<{
    sectionId?: string;
    finalCopyEvidence?: string;
  }>;
}

export interface FinalCopyDraftValidationResult {
  status: "passed" | "failed";
  blockingIssues: string[];
}

export interface FinalCopyDraftValidationOptions {
  expectedQualityBrief?: PreDraftQualityBrief;
}

const genericScaffoldPatterns = [
  /this section should/i,
  /the page should explain/i,
  /use this section/i,
  /reference urls still need/i,
  /add reference urls/i,
  /add cited reference urls/i,
  /expanded review-ready draft copy/i
];

export function validateFinalCopyDraft(
  draft: FinalCopyDraft | unknown,
  packet: PagePacket,
  options: FinalCopyDraftValidationOptions = {}
): FinalCopyDraftValidationResult {
  const value = asDraft(draft);
  const blockingIssues: string[] = [];

  if (!value) {
    return {
      status: "failed",
      blockingIssues: ["final-copy-draft.json is required before V2 final copy expansion."]
    };
  }

  if (value.schemaVersion !== "final-copy-draft.v2") {
    blockingIssues.push("Final copy draft schemaVersion must be final-copy-draft.v2.");
  }
  if (!hasText(value.adapter)) blockingIssues.push("Final copy draft requires adapter.");
  if (!hasText(value.generatedAt)) blockingIssues.push("Final copy draft requires generatedAt.");

  const draftSections = new Map(value.sections.map((section) => [section.sectionId, section]));
  for (const packetSection of packet.sections) {
    const draftSection = draftSections.get(packetSection.id);
    if (!draftSection) {
      blockingIssues.push(`${packetSection.id}: final copy draft section is missing.`);
      continue;
    }

    if (!hasText(draftSection.markdown)) {
      blockingIssues.push(`${packetSection.id}: final copy markdown is required.`);
      continue;
    }

    for (const issue of detectPlaceholderCopy(draftSection.markdown)) {
      blockingIssues.push(`${packetSection.id}: ${issue.message}`);
    }
    if (genericScaffoldPatterns.some((pattern) => pattern.test(draftSection.markdown))) {
      blockingIssues.push(`${packetSection.id}: generic scaffold prose is not allowed in final copy.`);
    }

    if (requiresEvidence(packetSection) && !draftSection.evidenceRefs?.length) {
      blockingIssues.push(`${packetSection.id}: final copy section requires evidenceRefs.`);
    }
    if (requiresEvidence(packetSection) && !draftSection.citationClaimIds?.length) {
      blockingIssues.push(`${packetSection.id}: final copy section requires citationClaimIds.`);
    }
  }

  if (packet.sections.some((section) => section.id === "S10_references") && !value.references?.length) {
    blockingIssues.push("References section requires at least one real source record.");
  }
  if (value.references?.some((reference) => !hasText(reference.sourceUrl) || !hasText(reference.label))) {
    blockingIssues.push("Every final copy reference requires sourceUrl and label.");
  }
  blockingIssues.push(...validateSuperiorityProof(value.superiorityProof, options.expectedQualityBrief, packet, value));
  blockingIssues.push(...validateStructurePlanDelivery(value.structurePlanDeliveryProof, options.expectedQualityBrief, packet, value));

  return {
    status: blockingIssues.length === 0 ? "passed" : "failed",
    blockingIssues
  };
}

function validateStructurePlanDelivery(
  proof: FinalCopyStructurePlanDeliveryProof | undefined,
  expectedQualityBrief: PreDraftQualityBrief | undefined,
  packet: PagePacket,
  draft: FinalCopyDraft
): string[] {
  const plan = expectedQualityBrief?.researchDerivedStructurePlan;
  if (!plan) return [];

  if (!proof) {
    return ["Final copy structure plan delivery proof is required when pre-draft-quality-brief.json includes researchDerivedStructurePlan."];
  }

  const issues: string[] = [];
  const sectionIds = new Set(packet.sections.map((section) => section.id));
  const sectionsById = new Map(draft.sections.map((section) => [section.sectionId, section.markdown]));

  const visibleInSection = (sectionId: string | undefined, snippet: string | undefined): boolean => {
    if (!hasText(sectionId) || !hasText(snippet)) return false;
    const validatedSectionId = String(sectionId);
    if (!sectionIds.has(validatedSectionId)) return false;
    return markdownContains(sectionsById.get(validatedSectionId) ?? "", snippet);
  };

  if (hasText(plan.primaryUserConcern)) {
    const primary = proof.primaryConcernDelivered;
    if (
      !primary ||
      !hasText(primary.sectionId) ||
      !hasText(primary.finalCopyEvidence) ||
      !visibleInSection(primary.sectionId, primary.finalCopyEvidence)
    ) {
      issues.push("Final copy must deliver the research-derived primary user concern in the planned near-top section.");
    } else if (hasText(plan.primaryConcernVisibleBySectionId) && primary.sectionId !== plan.primaryConcernVisibleBySectionId) {
      issues.push("Final copy must deliver the research-derived primary user concern in the planned near-top section.");
    }
  }

  const deliveredHighImpact = proof.highImpactComponentsDelivered ?? [];
  for (const component of plan.highImpactComponents ?? []) {
    const matchingDelivery = deliveredHighImpact.find((delivered) =>
      delivered.componentType === component.componentType &&
      delivered.mappedSectionId === component.mappedSectionId &&
      visibleInSection(delivered.mappedSectionId, delivered.finalCopyEvidence) &&
      evidenceMatchesPromise(delivered.finalCopyEvidence, component.expectedVisibleOutput, component.finalCopyAcceptanceCheck)
    );
    if (!matchingDelivery) {
      issues.push("Final copy must deliver every high-impact component promised by researchDerivedStructurePlan.");
    }
  }

  const deliveredOutputs = proof.expectedVisibleOutputsDelivered ?? [];
  for (const section of plan.sections ?? []) {
    if (!hasText(section.expectedVisibleOutput)) continue;
    const matchingOutput = deliveredOutputs.find((delivered) =>
      delivered.mappedSectionId === section.sectionId &&
      visibleInSection(delivered.mappedSectionId, delivered.finalCopyEvidence) &&
      evidenceMatchesPromise(delivered.finalCopyEvidence, section.expectedVisibleOutput, section.finalCopyAcceptanceCheck)
    );
    if (!matchingOutput) {
      issues.push("Final copy must deliver every expected visible output promised by researchDerivedStructurePlan sections.");
    }
  }

  const deliveredDecisions = proof.structureDecisionsDelivered ?? [];
  for (const decision of plan.structureDecisions ?? []) {
    if (!hasText(decision.expectedVisibleOutput)) continue;
    const matchingDecision = deliveredDecisions.find((delivered) =>
      delivered.sectionId === decision.sectionId &&
      visibleInSection(delivered.sectionId, delivered.finalCopyEvidence) &&
      evidenceMatchesPromise(delivered.finalCopyEvidence, decision.expectedVisibleOutput, decision.finalCopyAcceptanceCheck)
    );
    if (!matchingDecision) {
      issues.push("Final copy must deliver every structure decision promised by researchDerivedStructurePlan.");
    }
  }

  if (issues.some((issue) =>
    issue === "Final copy must deliver every high-impact component promised by researchDerivedStructurePlan." ||
    issue === "Final copy must deliver every expected visible output promised by researchDerivedStructurePlan sections." ||
    issue === "Final copy must deliver every structure decision promised by researchDerivedStructurePlan."
  )) {
    issues.push("Final copy structure proof must visibly match the promised research-derived output.");
  }

  return issues;
}

function evidenceMatchesPromise(evidence: string | undefined, expectedOutput: string | undefined, acceptanceCheck?: string): boolean {
  if (!hasText(expectedOutput) && !hasText(acceptanceCheck)) return true;
  const evidenceTerms = meaningfulTerms(evidence ?? "");
  const promisedTerms = new Set([
    ...meaningfulTerms(expectedOutput ?? ""),
    ...meaningfulTerms(acceptanceCheck ?? "")
  ]);
  if (evidenceTerms.length === 0 || promisedTerms.size === 0) return false;
  const overlap = evidenceTerms.filter((term) => promisedTerms.has(term));
  return overlap.length >= Math.min(2, promisedTerms.size);
}

function meaningfulTerms(value: string): string[] {
  const stopwords = new Set([
    "the", "and", "or", "with", "when", "what", "why", "how", "this", "that", "from", "into", "their",
    "final", "copy", "include", "includes", "included", "visible", "output", "promised", "section", "reader", "readers"
  ]);
  return normalizeText(value)
    .split(" ")
    .filter((term) => term.length >= 4 && !stopwords.has(term));
}

function validateSuperiorityProof(
  proof: FinalCopySuperiorityProof | undefined,
  expectedQualityBrief: PreDraftQualityBrief | undefined,
  packet: PagePacket,
  draft: FinalCopyDraft
): string[] {
  if (!proof) return ["Final copy superiority proof is required."];
  const issues: string[] = [];

  if ((proof.intentWinsDelivered ?? []).length < 4 || (proof.intentWinsDelivered ?? []).some((item) =>
    !hasText(item.intentDimensionId) || !hasText(item.sectionId) || !hasText(item.finalCopyEvidence) || !arrayHasText(item.evidenceRefs)
  )) {
    issues.push("Final copy superiority proof requires 4 delivered intent wins with section, evidenceRefs, and final copy evidence.");
  }
  if ((proof.superiorityComponentsDelivered ?? []).length < 1 || (proof.superiorityComponentsDelivered ?? []).some((item) =>
    !hasText(item.componentId) || !hasText(item.sectionId) || !hasText(item.visibleOutputType) || !hasText(item.finalCopyEvidence)
  )) {
    issues.push("Final copy superiority proof requires at least 1 visible superiority component.");
  }
  if ((proof.differentiatedImprovementsDelivered ?? []).length < 5 || (proof.differentiatedImprovementsDelivered ?? []).some((item) =>
    !hasText(item.improvementId) || !hasText(item.sectionId) || !hasText(item.visibleOutputType) || !hasText(item.finalCopyEvidence)
  )) {
    issues.push("Final copy superiority proof requires 5 visible differentiated improvements.");
  }
  const blockTypes = new Set((proof.extractableAnswerBlocksDelivered ?? []).map((block) => block.blockType));
  for (const blockType of ["quick_answer", "decision_action", "troubleshooting_safety"]) {
    if (!blockTypes.has(blockType)) {
      issues.push(`Final copy superiority proof requires visible ${blockType} extractable answer block.`);
    }
  }
  if ((proof.extractableAnswerBlocksDelivered ?? []).some((item) =>
    !hasText(item.blockType) || !hasText(item.sectionId) || !hasText(item.finalCopyEvidence)
  )) {
    issues.push("Final copy superiority proof extractable answer blocks require section and final copy evidence.");
  }
  if ((proof.visibleCitationHandling ?? []).some((item) =>
    !hasText(item.claim) || !hasText(item.claimImportance) || !arrayHasText(item.sourceRefs) || !hasText(item.finalCopyEvidence)
  )) {
    issues.push("Final copy superiority proof visible citation handling requires claim, importance, sourceRefs, and final copy evidence.");
  }
  if ((proof.visibleCitationHandling ?? []).filter((item) => item.claimImportance !== "minor").length < 1) {
    issues.push("Final copy superiority proof requires visible citation handling for at least one important, critical, or brand capability claim.");
  }
  if (!hasText(proof.whyThisDeservesToRank) || wordCount(proof.whyThisDeservesToRank ?? "") < 18) {
    issues.push("Final copy superiority proof requires a substantive whyThisDeservesToRank summary.");
  }
  issues.push(...validateProofVisibility(proof, packet, draft));
  issues.push(...validateExpectedSuperiorityDelivery(proof, expectedQualityBrief));

  return issues;
}

function validateProofVisibility(proof: FinalCopySuperiorityProof, packet: PagePacket, draft: FinalCopyDraft): string[] {
  const issues: string[] = [];
  const packetSectionIds = new Set(packet.sections.map((section) => section.id));
  const draftSections = new Map(draft.sections.map((section) => [section.sectionId, section]));
  const componentIds = new Set([
    ...(draft.standoutElements ?? []).map((element) => element.id),
    ...draft.sections.flatMap((section) => section.standoutElementRefs ?? [])
  ]);
  const allMarkdown = draft.sections.map((section) => section.markdown).join("\n\n");

  const validateSectionSnippet = (sectionId: string | undefined, snippet: string | undefined, label: string) => {
    if (!hasText(sectionId)) {
      issues.push(`${label} references a section that is not present in the final page packet.`);
      return;
    }
    const validatedSectionId = String(sectionId);
    if (!packetSectionIds.has(validatedSectionId) || !draftSections.has(validatedSectionId)) {
      issues.push(`${label} references a section that is not present in the final page packet.`);
      return;
    }
    const markdown = draftSections.get(validatedSectionId)?.markdown ?? "";
    if (!markdownContains(markdown, snippet)) {
      issues.push(`${label} finalCopyEvidence must be a visible snippet from the referenced section markdown.`);
    }
  };

  for (const item of proof.intentWinsDelivered ?? []) {
    validateSectionSnippet(item.sectionId, item.finalCopyEvidence, "Final copy intent win");
  }
  for (const item of proof.superiorityComponentsDelivered ?? []) {
    validateSectionSnippet(item.sectionId, item.finalCopyEvidence, "Final copy superiority component");
    if (!hasText(item.componentId)) {
      issues.push("Final copy superiority component must reference a declared standout element or section standoutElementRefs entry.");
    } else {
      const componentId = String(item.componentId);
      if (!componentIds.has(componentId)) {
        issues.push("Final copy superiority component must reference a declared standout element or section standoutElementRefs entry.");
      }
    }
  }
  for (const item of proof.differentiatedImprovementsDelivered ?? []) {
    validateSectionSnippet(item.sectionId, item.finalCopyEvidence, "Final copy differentiated improvement");
  }
  for (const item of proof.extractableAnswerBlocksDelivered ?? []) {
    validateSectionSnippet(item.sectionId, item.finalCopyEvidence, "Final copy extractable answer block");
  }
  for (const item of proof.visibleCitationHandling ?? []) {
    if (!markdownContains(allMarkdown, item.finalCopyEvidence)) {
      issues.push("Final copy visible citation handling finalCopyEvidence must be visible in section markdown.");
    }
  }

  return issues;
}

function validateExpectedSuperiorityDelivery(
  proof: FinalCopySuperiorityProof,
  expectedQualityBrief: PreDraftQualityBrief | undefined
): string[] {
  if (!expectedQualityBrief) return [];
  const issues: string[] = [];
  const deliveredIntentIds = new Set((proof.intentWinsDelivered ?? []).map((item) => item.intentDimensionId).filter(hasText));
  const promisedTopFour = (expectedQualityBrief.intentDimensions ?? [])
    .filter((dimension) => typeof dimension.priority === "number" && dimension.priority >= 1)
    .sort((left, right) => (left.priority ?? 0) - (right.priority ?? 0))
    .slice(0, 4)
    .map((dimension) => dimension.id)
    .filter(hasText);

  if (promisedTopFour.length >= 4 && promisedTopFour.some((intentId) => !deliveredIntentIds.has(intentId))) {
    issues.push("Final copy superiority proof must deliver the promised top 4 intent dimensions from pre-draft-quality-brief.json.");
  }

  const deliveredComponentIds = new Set((proof.superiorityComponentsDelivered ?? []).map((item) => item.componentId).filter(hasText));
  const requiredComponentIds = (expectedQualityBrief.superiorityComponents ?? [])
    .map((component) => component.id)
    .filter(hasText);
  if (requiredComponentIds.length > 0 && requiredComponentIds.some((componentId) => !deliveredComponentIds.has(componentId))) {
    issues.push("Final copy superiority proof must deliver every required superiority component from pre-draft-quality-brief.json.");
  }

  return issues;
}

export function mergeFinalCopyDraft(
  packet: PagePacket,
  draft: FinalCopyDraft,
  options: FinalCopyDraftValidationOptions = {}
): PagePacket {
  const result = validateFinalCopyDraft(draft, packet, options);
  if (result.status !== "passed") {
    throw new Error(result.blockingIssues.join("\n"));
  }

  const draftSections = new Map(draft.sections.map((section) => [section.sectionId, section]));
  const sections = packet.sections.map((section) => {
    const draftSection = draftSections.get(section.id);
    return {
      ...section,
      markdown: section.id === "S10_references"
        ? renderReferences(draft.references ?? [])
        : draftSection?.markdown ?? section.markdown
    };
  });

  return {
    ...packet,
    metadata: {
      ...packet.metadata,
      copyStatus: "adapter_written_review_ready"
    },
    sections,
    machineReadable: {
      ...packet.machineReadable,
      sections
    }
  };
}

function renderReferences(references: FinalCopyReference[]): string {
  return references
    .map((reference) => `- ${reference.label}: ${reference.sourceUrl}`)
    .join("\n");
}

function requiresEvidence(section: PagePacket["sections"][number]): boolean {
  return section.role !== "conversion" && section.role !== "reference";
}

function asDraft(value: unknown): FinalCopyDraft | undefined {
  if (!value || typeof value !== "object" || Array.isArray(value)) return undefined;
  const record = value as Partial<FinalCopyDraft>;
  if (!Array.isArray(record.sections)) return undefined;
  return record as FinalCopyDraft;
}

function hasText(value: string | undefined): boolean {
  return Boolean(value && value.trim().length > 0);
}

function arrayHasText(value: unknown[] | undefined): boolean {
  return Array.isArray(value) && value.some((item) => typeof item === "string" && item.trim().length > 0);
}

function wordCount(value: string): number {
  return value.trim().split(/\s+/).filter(Boolean).length;
}

function markdownContains(markdown: string, snippet: string | undefined): boolean {
  if (!hasText(snippet)) return false;
  const visibleSnippet = String(snippet);
  return normalizeText(markdown).includes(normalizeText(visibleSnippet));
}

function normalizeText(value: string): string {
  return value.toLowerCase().replace(/[^a-z0-9\s]/g, " ").replace(/\s+/g, " ").trim();
}
