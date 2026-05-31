import assert from "node:assert/strict";
import { mkdtemp, readFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import path from "node:path";
import { test } from "node:test";
import { runV2Command } from "../src/cli/v2.js";

test("v2 prepare-page creates artifacts and status reports in_progress", async () => {
  const cwd = await mkdtemp(path.join(tmpdir(), "seo-v2-cli-"));

  const prepare = await captureCommand(cwd, () =>
    runV2Command(["prepare-page", "--cluster", "acne-treatment", "--page-id", "P1", "--page-type", "product_category"])
  );

  assert.equal(prepare.exitCode, undefined);
  assert.match(prepare.stdout, /Prepared V2 page workspace:/);
  assert.match(prepare.stdout, /Next: complete the SERP research ledger/);

  const statePath = path.join(cwd, ".seo-agent-workspace", "v2", "page-packets", "acne-treatment", "P1", "page-state.json");
  const state = JSON.parse(await readFile(statePath, "utf8"));
  assert.equal(state.schemaVersion, "page-state.v2");
  assert.equal(state.status, "in_progress");

  const status = await captureCommand(cwd, () =>
    runV2Command(["status", "--cluster", "acne-treatment", "--page-id", "P1"])
  );

  assert.equal(status.exitCode, undefined);
  assert.match(status.stdout, /Status: in_progress/);
  assert.match(status.stdout, /Publish ready: false/);
});

test("v2 validate-gates reports missing seeded gates and exits non-zero", async () => {
  const cwd = await mkdtemp(path.join(tmpdir(), "seo-v2-cli-"));
  await captureCommand(cwd, () =>
    runV2Command(["prepare-page", "--cluster", "acne-treatment", "--page-id", "P1", "--page-type", "product_category"])
  );

  const validation = await captureCommand(cwd, () =>
    runV2Command(["validate-gates", "--cluster", "acne-treatment", "--page-id", "P1"])
  );

  assert.equal(validation.exitCode, 1);
  assert.match(validation.stdout, /SERP Research Ledger: failed/);
  assert.match(validation.stdout, /Social\/Video Research: failed/);
  assert.match(validation.stdout, /Audience Definition: failed/);
  assert.match(validation.stdout, /Narrative Brief: failed/);
  assert.match(validation.stdout, /Citation Set: failed/);
});

test("v2 qa reports missing QA input when no report exists", async () => {
  const cwd = await mkdtemp(path.join(tmpdir(), "seo-v2-cli-"));
  await captureCommand(cwd, () =>
    runV2Command(["prepare-page", "--cluster", "acne-treatment", "--page-id", "P1", "--page-type", "product_category"])
  );

  const qa = await captureCommand(cwd, () =>
    runV2Command(["qa", "--cluster", "acne-treatment", "--page-id", "P1"])
  );

  assert.equal(qa.exitCode, 1);
  assert.match(qa.stderr, /No editorial QA report found/);
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
