export type V2GateStatus = "missing" | "draft" | "passed" | "passed_limited_confidence" | "failed";
export type V2PageStatus = "in_progress" | "failed" | "content_ready" | "publish_ready";

export interface V2GateState {
  status: V2GateStatus;
  machineChecksPassed: boolean;
  judgmentChecksPassed: boolean;
  blockingIssues: string[];
  advisoryIssues: string[];
}

export interface V2PageState {
  schemaVersion: "page-state.v2";
  status: V2PageStatus;
  clusterSlug: string;
  pageId: string;
  pageType: string;
  gates: {
    serpResearch: V2GateState;
    socialVideoResearch: V2GateState;
    audienceDefinition: V2GateState;
    narrativeBrief: V2GateState;
    citationSet: V2GateState;
  };
  repairAttempts: {
    automatic: number;
    manual: number;
    maxAutomatic: 1;
    maxManualWithoutUpstreamRevision: 1;
  };
  content: {
    packetGenerated: boolean;
    qaReportGenerated: boolean;
    minimumSectionScore?: number;
  };
  images: {
    manifestGenerated: boolean;
    requiredSlotsComplete: boolean;
  };
  publishReady: boolean;
  nextRecommendedAction: string;
  updatedAt: string;
}
