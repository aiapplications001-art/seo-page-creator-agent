import assert from "node:assert/strict";
import { mkdir, mkdtemp, readFile, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import path from "node:path";
import { test } from "node:test";
import { runV2Command } from "../src/cli/v2.js";
import { createInitialV2PageState } from "../src/lib/v2/state.js";
import {
  createDebugBundle,
  renderDebugBundleMarkdown
} from "../src/lib/v2/debug-bundle.js";

test("debug bundle markdown lists state, gate statuses, editor artifacts, and internal artifacts", () => {
  const state = createInitialV2PageState({
    clusterSlug: "acne-treatment",
    pageId: "P1",
    pageType: "product_category",
    updatedAt: "2026-05-31T10:00:00.000Z"
  });
  state.gates.serpResearch.status = "passed";
  state.gates.serpResearch.machineChecksPassed = true;
  state.gates.serpResearch.judgmentChecksPassed = true;

  const markdown = renderDebugBundleMarkdown({
    pageDir: "/tmp/page",
    state,
    editorArtifactPaths: ["/tmp/page/final-page-packet.md", "/tmp/page/editorial-qa-report.md"],
    internalArtifactPaths: ["/tmp/page/page-state.json", "/tmp/page/serp-research-ledger.json"],
    imageManifestPaths: ["/tmp/page/image-manifest.json"],
    omittedBinaryCount: 2
  });

  assert.match(markdown, /# V2 Debug Bundle/);
  assert.match(markdown, /Status: in_progress/);
  assert.match(markdown, /SERP Research: passed/);
  assert.match(markdown, /final-page-packet\.md/);
  assert.match(markdown, /page-state\.json/);
  assert.match(markdown, /image-manifest\.json/);
  assert.match(markdown, /Omitted binary artifacts: 2/);
});

test("debug bundle creation writes markdown and omits image binaries by default", async () => {
  const pageDir = await mkdtemp(path.join(tmpdir(), "seo-v2-debug-"));
  const state = createInitialV2PageState({
    clusterSlug: "acne-treatment",
    pageId: "P1",
    pageType: "product_category"
  });

  await writeFile(path.join(pageDir, "page-state.json"), `${JSON.stringify(state, null, 2)}\n`, "utf8");
  await writeFile(path.join(pageDir, "final-page-packet.md"), "# Final Packet\n", "utf8");
  await writeFile(path.join(pageDir, "editorial-qa-report.md"), "# QA\n", "utf8");
  await writeFile(path.join(pageDir, "image-manifest.json"), "{}\n", "utf8");
  await writeFile(path.join(pageDir, "hero.webp"), "not-a-real-image", "utf8");
  await mkdir(path.join(pageDir, "nested"), { recursive: true });
  await writeFile(path.join(pageDir, "nested", "source-inventory.json"), "{}\n", "utf8");

  const result = await createDebugBundle({ pageDir });
  const markdown = await readFile(result.markdownPath, "utf8");

  assert.equal(path.basename(result.markdownPath), "debug-bundle.md");
  assert.match(markdown, /final-page-packet\.md/);
  assert.match(markdown, /editorial-qa-report\.md/);
  assert.match(markdown, /image-manifest\.json/);
  assert.match(markdown, /source-inventory\.json/);
  assert.doesNotMatch(markdown, /hero\.webp/);
});

test("v2 debug-bundle command creates a markdown summary", async () => {
  const cwd = await mkdtemp(path.join(tmpdir(), "seo-v2-cli-debug-"));

  await captureCommand(cwd, () =>
    runV2Command(["prepare-page", "--cluster", "acne-treatment", "--page-id", "P1", "--page-type", "product_category"])
  );

  const result = await captureCommand(cwd, () =>
    runV2Command(["debug-bundle", "--cluster", "acne-treatment", "--page-id", "P1"])
  );

  assert.equal(result.exitCode, undefined);
  assert.match(result.stdout, /Created V2 debug bundle:/);

  const bundlePath = path.join(
    cwd,
    ".seo-agent-workspace",
    "v2",
    "page-packets",
    "acne-treatment",
    "P1",
    "debug-bundle.md"
  );
  const markdown = await readFile(bundlePath, "utf8");
  assert.match(markdown, /SERP Research: missing/);
  assert.match(markdown, /serp-research-ledger\.json/);
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
