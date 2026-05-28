import { createHash } from "node:crypto";

export interface GuidanceSource {
  id: string;
  label: string;
  url: string;
  category: "updates" | "essentials" | "content_quality" | "core_updates" | "ai_features";
  official: true;
}

export interface GuidanceSnapshot {
  sourceId: string;
  label: string;
  url: string;
  category: GuidanceSource["category"];
  official: true;
  contentHash: string;
  contentLength: number;
  contentSignals: string[];
}

export interface GuidanceChange {
  sourceId: string;
  label: string;
  url: string;
  category: GuidanceSource["category"];
  urgency: "low" | "medium" | "high";
  summary: string;
  recommendation: string;
}

export interface GuidanceWatcherResult {
  schemaVersion: "google-guidance-watcher-report.v1";
  date: string;
  officialSourcesOnly: true;
  meaningfulChangesFound: boolean;
  sourcesChecked: GuidanceSnapshot[];
  changes: GuidanceChange[];
}

export interface GuidanceWatcherState {
  schemaVersion: "google-guidance-watcher-state.v1";
  updatedAt: string;
  officialSourcesOnly: true;
  snapshots: GuidanceSnapshot[];
}

export const defaultGoogleGuidanceSources: GuidanceSource[] = [
  {
    id: "search-doc-updates",
    label: "Google Search documentation updates",
    url: "https://developers.google.com/search/updates",
    category: "updates",
    official: true
  },
  {
    id: "search-essentials",
    label: "Google Search Essentials",
    url: "https://developers.google.com/search/docs/fundamentals/creating-helpful-content",
    category: "essentials",
    official: true
  },
  {
    id: "helpful-content",
    label: "Helpful, reliable, people-first content",
    url: "https://developers.google.com/search/docs/fundamentals/creating-helpful-content",
    category: "content_quality",
    official: true
  },
  {
    id: "core-updates",
    label: "Google Search core updates",
    url: "https://developers.google.com/search/docs/appearance/core-updates",
    category: "core_updates",
    official: true
  },
  {
    id: "ai-optimization",
    label: "AI features and website guidance",
    url: "https://developers.google.com/search/docs/fundamentals/ai-optimization-guide",
    category: "ai_features",
    official: true
  }
];

export async function createGuidanceSnapshot(
  source: GuidanceSource,
  content: string
): Promise<GuidanceSnapshot> {
  const normalized = normalizeContent(content);
  return {
    sourceId: source.id,
    label: source.label,
    url: source.url,
    category: source.category,
    official: true,
    contentHash: createHash("sha256").update(normalized).digest("hex"),
    contentLength: normalized.length,
    contentSignals: extractContentSignals(normalized)
  };
}

export function compareGuidanceSnapshots(
  previous: GuidanceSnapshot[],
  current: GuidanceSnapshot[],
  date: string
): GuidanceWatcherResult {
  const previousById = new Map(previous.map((snapshot) => [snapshot.sourceId, snapshot]));
  const changes = current
    .filter((snapshot) => previousById.get(snapshot.sourceId)?.contentHash !== snapshot.contentHash)
    .map((snapshot) => toGuidanceChange(snapshot));

  return {
    schemaVersion: "google-guidance-watcher-report.v1",
    date,
    officialSourcesOnly: true,
    meaningfulChangesFound: changes.length > 0,
    sourcesChecked: current,
    changes
  };
}

export function createWatcherState(snapshots: GuidanceSnapshot[], updatedAt: string): GuidanceWatcherState {
  return {
    schemaVersion: "google-guidance-watcher-state.v1",
    updatedAt,
    officialSourcesOnly: true,
    snapshots
  };
}

export function renderGuidanceReport(result: GuidanceWatcherResult): string {
  const sourceList = result.sourcesChecked.map((source) => `- ${source.label}: ${source.url}`).join("\n");
  const high = renderChangeGroup("High Urgency", result.changes.filter((change) => change.urgency === "high"));
  const medium = renderChangeGroup("Medium Urgency", result.changes.filter((change) => change.urgency === "medium"));
  const low = renderChangeGroup("Low Urgency", result.changes.filter((change) => change.urgency === "low"));
  const summary = result.meaningfulChangesFound
    ? "Meaningful official Google guidance changes were found. The agent should suggest reviewing existing clusters and page packets by urgency."
    : "No meaningful official Google guidance changes found. No cluster refresh is suggested from official guidance changes this week.";

  return `# Google Guidance Watcher Report

Date: ${result.date}
Official sources only: yes

## Summary

${summary}

## Official sources checked

${sourceList}

## Urgency Groups

${high}

${medium}

${low}
`;
}

function toGuidanceChange(snapshot: GuidanceSnapshot): GuidanceChange {
  const urgency = classifyUrgency(snapshot);
  return {
    sourceId: snapshot.sourceId,
    label: snapshot.label,
    url: snapshot.url,
    category: snapshot.category,
    urgency,
    summary: `${snapshot.label} changed since the previous watcher state.`,
    recommendation: urgency === "high"
      ? "Suggest reviewing existing clusters and page packets that depend on this guidance."
      : "Mention this in the watcher report and refresh only if the user asks."
  };
}

function classifyUrgency(snapshot: GuidanceSnapshot): GuidanceChange["urgency"] {
  if (snapshot.contentSignals.some((signal) => ["ai", "structured_data", "core_update", "content_quality"].includes(signal))) {
    return "high";
  }
  if (snapshot.category === "ai_features" || snapshot.category === "core_updates" || snapshot.category === "content_quality") {
    return "high";
  }
  if (snapshot.category === "essentials") return "medium";
  return "low";
}

function renderChangeGroup(title: string, changes: GuidanceChange[]): string {
  if (changes.length === 0) return `### ${title}\n\n- None`;
  return `### ${title}\n\n${changes.map((change) => (
    `- ${change.label}: ${change.summary} Recommendation: ${change.recommendation} Source: ${change.url}`
  )).join("\n")}`;
}

function normalizeContent(content: string): string {
  return content.replace(/\s+/g, " ").trim();
}

function extractContentSignals(content: string): string[] {
  const lower = content.toLowerCase();
  const signals = new Set<string>();
  if (lower.includes("ai overview") || lower.includes("ai mode") || lower.includes("generative ai")) signals.add("ai");
  if (lower.includes("structured data") || lower.includes("schema")) signals.add("structured_data");
  if (lower.includes("core update")) signals.add("core_update");
  if (lower.includes("helpful") || lower.includes("people-first")) signals.add("content_quality");
  return [...signals];
}
