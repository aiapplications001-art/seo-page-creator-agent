import assert from "node:assert/strict";
import { mkdtemp } from "node:fs/promises";
import { tmpdir } from "node:os";
import path from "node:path";
import { test } from "node:test";
import { runBatchCommand } from "../src/cli/batch.js";

test("batch live prepares an autonomous publishing run from cluster and count", async () => {
  const cwd = await mkdtemp(path.join(tmpdir(), "seo-batch-cli-"));

  const result = await captureCommand(cwd, () =>
    runBatchCommand(["live", "--cluster", "acne-treatment", "--count", "10"])
  );

  assert.equal(result.exitCode, undefined);
  assert.match(result.stdout, /Prepared batch live run/);
  assert.match(result.stdout, /Cluster: acne-treatment/);
  assert.match(result.stdout, /Target live pages: 10/);
  assert.match(result.stdout, /Max total attempts: 20/);
  assert.match(result.stdout, /Repair attempts per page: 3/);
  assert.match(result.stdout, /Voice: category-manager-with-editorial-empathy/);
  assert.match(result.stdout, /Live verification: HTTP 200 OK/);
  assert.match(result.stdout, /Keyword discovery: prioritize unfocused and long-tail opportunities/);
  assert.match(result.stdout, /Reject volume-only page selection/);
  assert.match(result.stdout, /Depth contract: validate-depth required before final copy, images, commit, and publish/);
  assert.match(result.stdout, /Durable state: \.seo-agent-workspace\/batch-runs\/<run-id>\/batch-run\.json, run-ledger\.jsonl, and current-page\.lock/);
  assert.match(result.stdout, /Concurrency guard: refuse to start a new page while current-page\.lock exists/);
  assert.match(result.stdout, /Completion email: not configured/);
  assert.match(result.stdout, /Completion email packet: send final batch QA report with batch score, confidence/);
});

test("batch live records completion email recipient when provided", async () => {
  const cwd = await mkdtemp(path.join(tmpdir(), "seo-batch-cli-"));

  const result = await captureCommand(cwd, () =>
    runBatchCommand(["live", "--cluster", "acne-treatment", "--count", "10", "--email-to", "owner@example.com"])
  );

  assert.equal(result.exitCode, undefined);
  assert.match(result.stdout, /Completion email: owner@example\.com/);
});

test("batch live prepares cluster auto-identification when cluster is omitted", async () => {
  const cwd = await mkdtemp(path.join(tmpdir(), "seo-batch-cli-"));

  const result = await captureCommand(cwd, () =>
    runBatchCommand(["live", "--count", "10"])
  );

  assert.equal(result.exitCode, undefined);
  assert.match(result.stdout, /Cluster: auto-identify during preflight/);
  assert.match(result.stdout, /Cluster preflight: identify existing cluster or create one before page work/);
  assert.match(result.stdout, /Do not create page packets, copy, or images during cluster identification/);
  assert.match(result.stdout, /Batch mode: completed live page, not workflow stage/);
  assert.match(result.stdout, /No future-page assets or copy before the current page is live or skipped/);
});

test("batch live rejects invalid count", async () => {
  const cwd = await mkdtemp(path.join(tmpdir(), "seo-batch-cli-"));

  const result = await captureCommand(cwd, () =>
    runBatchCommand(["live", "--cluster", "acne-treatment", "--count", "0"])
  );

  assert.equal(result.exitCode, 1);
  assert.match(result.stderr, /--count must be a positive integer/);
});

async function captureCommand(cwd: string, run: () => Promise<void>): Promise<{ stdout: string; stderr: string; exitCode: string | number | undefined }> {
  const previousCwd = process.cwd();
  const previousExitCode = process.exitCode;
  const originalLog = console.log;
  const originalError = console.error;
  let stdout = "";
  let stderr = "";

  console.log = (...args: unknown[]) => {
    stdout += `${args.join(" ")}\n`;
  };
  console.error = (...args: unknown[]) => {
    stderr += `${args.join(" ")}\n`;
  };
  process.exitCode = undefined;
  process.chdir(cwd);

  try {
    await run();
    return { stdout, stderr, exitCode: process.exitCode };
  } finally {
    process.chdir(previousCwd);
    process.exitCode = previousExitCode;
    console.log = originalLog;
    console.error = originalError;
  }
}
