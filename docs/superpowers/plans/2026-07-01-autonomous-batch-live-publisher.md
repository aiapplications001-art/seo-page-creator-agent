# Autonomous Batch Live Publisher Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build the deterministic framework for autonomous batch live publishing: cluster identification preflight, state, opportunity replacement, strict serial page transactions, deep research requirements, three-repair page attempts, one publish per successful page, HTTP-200 live verification status, playbook validation, CLI routing, and reports.

**Architecture:** Add a `batch-live` library with small modules for types, state, playbook validation, runner orchestration, and report rendering. The runner uses injectable `ClusterPlanner`, `OpportunityEngine`, `PageWorker`, `Publisher`, and preflight checks so the host-agent V2.1 workflow and project-specific publish process can be plugged in without hard-coding LLM or CMS behavior.

**Tech Stack:** TypeScript ESM, Node built-in test runner, existing CLI dispatcher style.

---

### Task 1: Batch Live Runner Core

**Files:**
- Create: `src/lib/batch-live/types.ts`
- Create: `src/lib/batch-live/state.ts`
- Create: `src/lib/batch-live/runner.ts`
- Test: `tests/batch-live-runner.test.ts`

- [ ] **Step 1: Write failing runner tests**

Create `tests/batch-live-runner.test.ts` with tests for:

```ts
import assert from "node:assert/strict";
import { test } from "node:test";
import { runBatchLive } from "../src/lib/batch-live/runner.js";
import type { BatchLiveDependencies, BatchLiveOpportunity } from "../src/lib/batch-live/types.js";

test("continues generating replacements until target live count is reached", async () => {
  const opportunities: BatchLiveOpportunity[] = [
    opportunity("P1"),
    opportunity("P2"),
    opportunity("P3")
  ];
  const deps = fakeDependencies({
    opportunities,
    pageResults: ["page_failed", "page_ready", "page_ready"],
    publishResults: ["live", "live"]
  });

  const result = await runBatchLive({
    clusterSlug: "acne-treatment",
    targetLiveCount: 2,
    runId: "run-1"
  }, deps);

  assert.equal(result.status, "complete");
  assert.equal(result.liveCount, 2);
  assert.equal(result.totalAttemptsUsed, 3);
  assert.equal(result.pages.filter((page) => page.status === "live").length, 2);
  assert.equal(result.pages[0].status, "failed_after_3_repairs");
});

test("stops at double the requested count when live target is not reached", async () => {
  const deps = fakeDependencies({
    opportunities: [opportunity("P1"), opportunity("P2"), opportunity("P3"), opportunity("P4")],
    pageResults: ["page_failed", "page_failed", "page_failed", "page_failed"],
    publishResults: []
  });

  const result = await runBatchLive({
    clusterSlug: "acne-treatment",
    targetLiveCount: 2,
    runId: "run-2"
  }, deps);

  assert.equal(result.status, "partial_complete_attempt_limit_reached");
  assert.equal(result.maxTotalAttempts, 4);
  assert.equal(result.totalAttemptsUsed, 4);
  assert.equal(result.liveCount, 0);
});
```

- [ ] **Step 2: Run the new test and verify it fails**

Run: `npm test -- tests/batch-live-runner.test.ts`

Expected: FAIL because `src/lib/batch-live/runner.ts` and related types do not exist.

- [ ] **Step 3: Implement minimal runner core**

Create `types.ts`, `state.ts`, and `runner.ts` with:

- `BatchLiveRun`
- `BatchLivePageAttempt`
- `BatchLiveOpportunity`
- `BatchLiveDependencies`
- `createInitialBatchLiveRun`
- `runBatchLive`

`runBatchLive` must:

- Set `maxTotalAttempts = targetLiveCount * 2`.
- Run `deps.ensureCleanProjectState()` before start and before each attempt.
- Identify the cluster in preflight when `clusterSlug` is omitted.
- Call `deps.opportunityEngine.nextOpportunity(run)` for each attempt.
- Call `deps.pageWorker.produce(opportunity, options)` with `repairAttempts: 3`, `workflowMode: "serial_page_transaction"`, current-page-only asset/copy batching, and deep research requirements.
- Skip failed pages and preserve structured failure.
- Publish ready pages with `deps.publisher.publish(pagePackage)`.
- Mark pages live only when publish result is `live`.
- Stop on target live count or max attempts.
- Never request the next opportunity until the current page is live or skipped.

- [ ] **Step 4: Run the new test and verify it passes**

Run: `npm test -- tests/batch-live-runner.test.ts`

Expected: PASS.

### Task 2: Playbook Validation And Report Rendering

**Files:**
- Create: `src/lib/batch-live/playbook.ts`
- Create: `src/lib/batch-live/report.ts`
- Test: `tests/batch-live-playbook-report.test.ts`

- [ ] **Step 1: Write failing tests**

Create tests for:

- Valid `git_push_deploy` playbook passes.
- Missing `repoPath`, non-`main` branch, or missing validation commands fail.
- Markdown report includes live pages, failed attempts, commit SHAs, URLs, failure reasons, and recommended fixes.

- [ ] **Step 2: Run the test and verify it fails**

Run: `npm test -- tests/batch-live-playbook-report.test.ts`

Expected: FAIL because modules do not exist.

- [ ] **Step 3: Implement playbook validation and report rendering**

Implement:

- `validatePublishPlaybook(input: unknown): PublishPlaybook`
- `renderBatchLiveReport(run: BatchLiveRun): string`

- [ ] **Step 4: Run tests and verify they pass**

Run: `npm test -- tests/batch-live-playbook-report.test.ts`

Expected: PASS.

### Task 3: CLI Routing

**Files:**
- Create: `src/cli/batch.ts`
- Modify: `src/cli/index.ts`
- Test: `tests/batch-cli.test.ts`

- [ ] **Step 1: Write failing CLI tests**

Create tests that:

- `seo-agent batch live --cluster acne-treatment --count 10` parses successfully and prints a preparation summary.
- `seo-agent batch live --count 10` parses successfully and prints cluster auto-identification preflight.
- Invalid `--count` exits non-zero.
- The top-level CLI routes the `batch` command.

- [ ] **Step 2: Run the CLI test and verify it fails**

Run: `npm test -- tests/batch-cli.test.ts`

Expected: FAIL because `runBatchCommand` does not exist and index routing is missing.

- [ ] **Step 3: Implement CLI routing**

Implement `runBatchCommand(args)` with argument validation and a preparation summary. Do not launch a real live run yet because real host-agent V2.1 production requires a concrete `PageWorker` and project playbook wiring.

- [ ] **Step 4: Run CLI tests and verify they pass**

Run: `npm test -- tests/batch-cli.test.ts`

Expected: PASS.

### Task 4: Full Validation

**Files:**
- Existing source and tests.

- [ ] **Step 1: Run focused batch tests**

Run: `npm test -- tests/batch-live-runner.test.ts tests/batch-live-playbook-report.test.ts tests/batch-cli.test.ts`

Expected: PASS.

- [ ] **Step 2: Run full validation**

Run: `npm run validate`

Expected: PASS.
