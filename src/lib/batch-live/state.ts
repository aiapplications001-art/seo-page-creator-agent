import type { BatchLiveClusterSelection, BatchLiveRun, RunBatchLiveInput } from "./types.js";

export function createInitialBatchLiveRun(
  input: RunBatchLiveInput,
  clusterSelection: BatchLiveClusterSelection
): BatchLiveRun {
  return {
    schemaVersion: "batch-live-run.v1",
    runId: input.runId,
    clusterSlug: clusterSelection.clusterSlug,
    clusterSelection,
    targetLiveCount: input.targetLiveCount,
    maxTotalAttempts: input.targetLiveCount * 2,
    totalAttemptsUsed: 0,
    liveCount: 0,
    status: "running",
    branch: "main",
    requiresCleanWorkingTree: true,
    repairAttemptsPerPage: 3,
    workflowMode: "serial_page_transaction",
    liveVerification: {
      mode: "http_200"
    },
    pages: []
  };
}
