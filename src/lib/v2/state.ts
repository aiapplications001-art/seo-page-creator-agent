import type { V2GateState, V2PageState } from "./types.js";

export function missingGate(): V2GateState {
  return {
    status: "missing",
    machineChecksPassed: false,
    judgmentChecksPassed: false,
    blockingIssues: ["Artifact has not been completed."],
    advisoryIssues: []
  };
}

export function createInitialV2PageState(input: {
  clusterSlug: string;
  pageId: string;
  pageType: string;
  updatedAt?: string;
}): V2PageState {
  return {
    schemaVersion: "page-state.v2",
    status: "in_progress",
    clusterSlug: input.clusterSlug,
    pageId: input.pageId,
    pageType: input.pageType,
    gates: {
      serpResearch: missingGate(),
      socialVideoResearch: missingGate(),
      audienceDefinition: missingGate(),
      narrativeBrief: missingGate(),
      citationSet: missingGate()
    },
    repairAttempts: {
      automatic: 0,
      manual: 0,
      maxAutomatic: 1,
      maxManualWithoutUpstreamRevision: 1
    },
    content: {
      packetGenerated: false,
      qaReportGenerated: false
    },
    images: {
      manifestGenerated: false,
      requiredSlotsComplete: false
    },
    publishReady: false,
    nextRecommendedAction: "Complete the SERP research ledger.",
    updatedAt: input.updatedAt ?? new Date().toISOString()
  };
}
