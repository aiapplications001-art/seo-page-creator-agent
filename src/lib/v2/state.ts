import type { V2GateState, V2PageState } from "./types.js";
import type { V2ImageReadinessResult } from "./image-readiness.js";

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

export function markContentReady(state: V2PageState, input: {
  packetGenerated: boolean;
  qaReportGenerated: boolean;
  minimumSectionScore?: number;
  updatedAt?: string;
}): V2PageState {
  return {
    ...state,
    status: "content_ready",
    content: {
      packetGenerated: input.packetGenerated,
      qaReportGenerated: input.qaReportGenerated,
      minimumSectionScore: input.minimumSectionScore
    },
    publishReady: false,
    nextRecommendedAction: "Complete the image manifest and required image slots.",
    updatedAt: input.updatedAt ?? new Date().toISOString()
  };
}

export function applyImageReadinessToState(
  state: V2PageState,
  readiness: V2ImageReadinessResult,
  updatedAt = new Date().toISOString()
): V2PageState {
  const contentIsReady = state.content.packetGenerated && state.content.qaReportGenerated;
  const publishReady = contentIsReady
    && readiness.manifestGenerated
    && readiness.requiredSlotsComplete
    && readiness.heroMappedToS1;

  return {
    ...state,
    status: publishReady ? "publish_ready" : contentIsReady ? "content_ready" : state.status,
    images: {
      manifestGenerated: readiness.manifestGenerated,
      requiredSlotsComplete: readiness.requiredSlotsComplete
    },
    publishReady,
    nextRecommendedAction: publishReady
      ? "Page is publish-ready."
      : "Complete the image manifest and required image slots.",
    updatedAt
  };
}
