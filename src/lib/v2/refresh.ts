import { createHash } from "node:crypto";

export type SectionVersionEvent = "draft_created" | "auto_repair" | "manual_edit" | "refresh_update";

export interface CreateVersionHistoryEntryInput {
  sectionId: string;
  event: SectionVersionEvent;
  summary: string;
  reason: string;
  before: string;
  after: string;
  changedBy: string;
  timestamp?: string;
}

export interface SectionVersionHistoryEntry {
  sectionId: string;
  event: SectionVersionEvent;
  summary: string;
  reason: string;
  beforeHash: string;
  afterHash: string;
  beforeExcerpt: string;
  afterExcerpt: string;
  changedBy: string;
  timestamp: string;
}

export interface RefreshChangedSection {
  sectionId: string;
  heading: string;
  currentIssue: string;
  recommendedEdit: string;
  citationChanges: string[];
  before: string;
  after: string;
}

export interface RefreshQaSectionInput {
  sectionId: string;
  score: number;
  threshold: number;
  changed?: boolean;
}

export interface RefreshQaSummary {
  status: "passed" | "failed";
  changedSectionScores: Array<{
    sectionId: string;
    score: number;
    threshold: number;
    status: "passed" | "failed";
  }>;
  failedSectionIds: string[];
}

export interface BuildRefreshPacketInput {
  pageId: string;
  trigger: string;
  reason: string;
  changedSections: RefreshChangedSection[];
  unchangedSectionIds: string[];
  qa: RefreshQaSummary;
  timestamp?: string;
}

export interface RefreshPacket {
  json: {
    schemaVersion: "refresh-packet.v2";
    pageId: string;
    trigger: string;
    reason: string;
    changedSections: Array<{
      sectionId: string;
      heading: string;
      currentIssue: string;
      recommendedEdit: string;
      citationChanges: string[];
    }>;
    unchangedSectionIds: string[];
    qa: RefreshQaSummary;
    versionHistorySummary: {
      totalChanges: number;
      entries: SectionVersionHistoryEntry[];
    };
    createdAt: string;
  };
  markdown: string;
}

const VERSION_EXCERPT_LIMIT = 280;

export function truncateVersionExcerpt(value: string): string {
  return value.length <= VERSION_EXCERPT_LIMIT
    ? value
    : `${value.slice(0, VERSION_EXCERPT_LIMIT - 3)}...`;
}

export function createVersionHistoryEntry(input: CreateVersionHistoryEntryInput): SectionVersionHistoryEntry {
  return {
    sectionId: input.sectionId,
    event: input.event,
    summary: input.summary,
    reason: input.reason,
    beforeHash: normalizedHash(input.before),
    afterHash: normalizedHash(input.after),
    beforeExcerpt: truncateVersionExcerpt(input.before),
    afterExcerpt: truncateVersionExcerpt(input.after),
    changedBy: input.changedBy,
    timestamp: input.timestamp ?? new Date().toISOString()
  };
}

export function buildRefreshQaSummary(sections: RefreshQaSectionInput[]): RefreshQaSummary {
  const changedSections = sections.filter((section) => section.changed !== false);
  const changedSectionScores = changedSections.map((section) => ({
    sectionId: section.sectionId,
    score: section.score,
    threshold: section.threshold,
    status: section.score >= section.threshold ? "passed" as const : "failed" as const
  }));
  const failedSectionIds = changedSectionScores
    .filter((section) => section.status === "failed")
    .map((section) => section.sectionId);

  return {
    status: failedSectionIds.length === 0 ? "passed" : "failed",
    changedSectionScores,
    failedSectionIds
  };
}

export function buildRefreshPacket(input: BuildRefreshPacketInput): RefreshPacket {
  const createdAt = input.timestamp ?? new Date().toISOString();
  const versionEntries = input.changedSections.map((section) => createVersionHistoryEntry({
    sectionId: section.sectionId,
    event: "refresh_update",
    summary: `Refresh update for ${section.heading}.`,
    reason: input.reason,
    before: section.before,
    after: section.after,
    changedBy: "host_agent",
    timestamp: createdAt
  }));

  const json: RefreshPacket["json"] = {
    schemaVersion: "refresh-packet.v2",
    pageId: input.pageId,
    trigger: input.trigger,
    reason: input.reason,
    changedSections: input.changedSections.map((section) => ({
      sectionId: section.sectionId,
      heading: section.heading,
      currentIssue: section.currentIssue,
      recommendedEdit: section.recommendedEdit,
      citationChanges: section.citationChanges
    })),
    unchangedSectionIds: input.unchangedSectionIds,
    qa: input.qa,
    versionHistorySummary: {
      totalChanges: versionEntries.length,
      entries: versionEntries
    },
    createdAt
  };

  return {
    json,
    markdown: renderRefreshPacketMarkdown(json)
  };
}

function renderRefreshPacketMarkdown(packet: RefreshPacket["json"]): string {
  const changedRows = packet.changedSections
    .map((section) => `| ${section.sectionId} | ${section.heading} | ${section.currentIssue} | ${section.recommendedEdit} | ${section.citationChanges.join("; ") || "None"} |`)
    .join("\n") || "| None | None | None | None | None |";
  const qaRows = packet.qa.changedSectionScores
    .map((section) => `| ${section.sectionId} | ${section.score} | ${section.threshold} | ${section.status} |`)
    .join("\n") || "| None | 0 | 0 | passed |";
  const historyRows = packet.versionHistorySummary.entries
    .map((entry) => `| ${entry.sectionId} | ${entry.event} | ${entry.summary} | ${entry.beforeHash} | ${entry.afterHash} |`)
    .join("\n") || "| None | None | None | None | None |";

  return `# Refresh Packet: ${packet.pageId}

Trigger: ${packet.trigger}
Reason: ${packet.reason}
Created: ${packet.createdAt}

## Changed Sections

| Section | Heading | Current issue | Recommended edit | Citation changes |
| --- | --- | --- | --- | --- |
${changedRows}

## Refresh QA

Status: ${packet.qa.status}

| Section | Score | Threshold | Status |
| --- | --- | --- | --- |
${qaRows}

## Version History Summary

Total changes: ${packet.versionHistorySummary.totalChanges}

| Section | Event | Summary | Before hash | After hash |
| --- | --- | --- | --- | --- |
${historyRows}
`;
}

function normalizedHash(value: string): string {
  return createHash("sha256")
    .update(value.trim().replace(/\s+/g, " "))
    .digest("hex");
}
