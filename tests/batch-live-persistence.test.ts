import assert from "node:assert/strict";
import { mkdtemp, readFile, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import path from "node:path";
import { test } from "node:test";
import { BatchLiveFileStore } from "../src/lib/batch-live/persistence.js";
import { runBatchLive } from "../src/lib/batch-live/runner.js";
import type {
  BatchLiveDependencies,
  BatchLiveOpportunity,
  BatchLivePageAttempt,
  BatchLiveRun,
  PageProductionResult,
  PublishResult
} from "../src/lib/batch-live/types.js";
import type { PageContentForUniqueness } from "../src/lib/v2/content-uniqueness.js";

test("persists batch run state, ledger events, and page lock around each attempt", async () => {
  const cwd = await mkdtemp(path.join(tmpdir(), "seo-batch-store-"));
  const store = new BatchLiveFileStore({
    workspaceRoot: path.join(cwd, ".seo-agent-workspace"),
    runId: "run-1"
  });
  const dependencies = fakeDependencies({
    opportunities: [opportunity("P1")],
    pageResults: [pageReady("P1")],
    publishResults: [published("P1")],
    runStore: store
  });

  const result = await runBatchLive({
    clusterSlug: "acne-treatment",
    runId: "run-1",
    targetLiveCount: 1
  }, dependencies);

  assert.equal(result.status, "complete");

  const runJson = JSON.parse(await readFile(path.join(cwd, ".seo-agent-workspace", "batch-runs", "run-1", "batch-run.json"), "utf8"));
  assert.equal(runJson.liveCount, 1);
  assert.equal(runJson.pages[0].status, "live");

  const ledgerLines = (await readFile(path.join(cwd, ".seo-agent-workspace", "batch-runs", "run-1", "run-ledger.jsonl"), "utf8"))
    .trim()
    .split("\n")
    .map((line) => JSON.parse(line));
  assert.deepEqual(ledgerLines.map((event) => event.event), [
    "run_started",
    "page_attempt_started",
    "page_attempt_finished",
    "run_completed"
  ]);
  assert.equal(ledgerLines[1].opportunityId, "P1");
  assert.equal(ledgerLines[2].status, "live");

  assert.equal(dependencies.lockSnapshots.length, 1);
  assert.equal(dependencies.lockSnapshots[0].opportunityId, "P1");
});

test("refuses to start a page attempt when current-page lock already exists", async () => {
  const cwd = await mkdtemp(path.join(tmpdir(), "seo-batch-store-"));
  const store = new BatchLiveFileStore({
    workspaceRoot: path.join(cwd, ".seo-agent-workspace"),
    runId: "run-locked"
  });
  await store.ensureRunDirectory();
  await writeFile(
    path.join(cwd, ".seo-agent-workspace", "batch-runs", "run-locked", "current-page.lock"),
    `${JSON.stringify({ opportunityId: "existing", attemptNumber: 1 })}\n`,
    "utf8"
  );
  const dependencies = fakeDependencies({
    opportunities: [opportunity("P1")],
    pageResults: [pageReady("P1")],
    publishResults: [published("P1")],
    runStore: store
  });

  await assert.rejects(
    () => runBatchLive({
      clusterSlug: "acne-treatment",
      runId: "run-locked",
      targetLiveCount: 1
    }, dependencies),
    /current-page.lock already exists/
  );
});

test("persists live page content uniqueness history across runs", async () => {
  const cwd = await mkdtemp(path.join(tmpdir(), "seo-batch-store-"));
  const store = new BatchLiveFileStore({
    workspaceRoot: path.join(cwd, ".seo-agent-workspace"),
    runId: "run-history"
  });
  const run = {
    runId: "run-history",
    clusterSlug: "acne-treatment"
  } as BatchLiveRun;
  const page = {
    status: "live",
    opportunityId: "P1",
    pageTitle: "Page P1",
    slug: "p1",
    productionUrl: "https://example.com/p1"
  } as BatchLivePageAttempt;

  await store.recordLivePageContent(run, page, pageContent("P1"));
  const loaded = await store.loadHistoricalPageContent("acne-treatment");

  assert.equal(loaded.length, 1);
  assert.equal(loaded[0].pageId, "P1");
  assert.equal(loaded[0].structureVariant, "research-derived-P1");
});

function opportunity(id: string): BatchLiveOpportunity {
  return {
    id,
    pageTitle: `Page ${id}`,
    slug: id,
    confidence: "strong",
    searchIntent: `Search intent for ${id}`,
    evidence: [`SERP evidence for ${id}`],
    targetAudience: "Readers comparing options",
    canonicalDecision: "self-canonical",
    nonDuplicateReason: "Distinct search intent."
  };
}

function pageReady(pageId: string): PageProductionResult {
  return {
    status: "ready",
    repairAttemptsUsed: 1,
    package: {
      opportunityId: pageId,
      pageTitle: `Page ${pageId}`,
      slug: pageId,
      artifacts: {
        pagePacket: `.seo-agent-workspace/page-packets/acne/${pageId}/page-packet.json`,
        qaReport: `.seo-agent-workspace/v2/page-packets/acne/${pageId}/editorial-qa-report.md`,
        imageManifest: `.seo-agent-workspace/page-packets/acne/${pageId}/image-manifest.json`
      }
    }
  };
}

function published(pageId: string): PublishResult {
  return {
    status: "live",
    commitSha: `commit-${pageId}`,
    productionUrl: `https://example.com/${pageId}`,
    httpStatus: 200
  };
}

function fakeDependencies(input: {
  opportunities: BatchLiveOpportunity[];
  pageResults: PageProductionResult[];
  publishResults: PublishResult[];
  runStore: BatchLiveFileStore;
}): BatchLiveDependencies & { lockSnapshots: Array<{ opportunityId: string }> } {
  const opportunities = [...input.opportunities];
  const pageResults = [...input.pageResults];
  const publishResults = [...input.publishResults];
  const lockSnapshots: Array<{ opportunityId: string }> = [];

  return {
    lockSnapshots,
    runStore: input.runStore,
    ensureCleanProjectState: async () => {},
    opportunityEngine: {
      nextOpportunity: async (_run: BatchLiveRun) => opportunities.shift() ?? null
    },
    pageWorker: {
      produce: async () => {
        const lock = await input.runStore.readCurrentPageLock();
        assert.ok(lock, "Expected current-page lock during page production.");
        lockSnapshots.push({ opportunityId: lock.opportunityId });
        const result = pageResults.shift();
        assert.ok(result, "Expected a page production result.");
        return result;
      }
    },
    publisher: {
      publish: async () => {
        const result = publishResults.shift();
        assert.ok(result, "Expected a publish result.");
        return result;
      }
    }
  };
}

function pageContent(pageId: string): PageContentForUniqueness {
  return {
    pageId,
    title: `Page ${pageId}`,
    slug: pageId.toLowerCase(),
    intentPattern: "diagnostic how-to",
    structureVariant: `research-derived-${pageId}`,
    researchDerivedStructureRationale: `Structure follows SERP, PAA, forum, and video gaps for ${pageId}.`,
    researchRefs: [`serp-${pageId}`],
    sections: [
      {
        sectionId: "S3_diagnosis",
        heading: "Diagnosis",
        sectionIntent: "diagnostic sorter",
        markdown: "A specific diagnostic section based on the page research."
      }
    ]
  };
}
