import assert from "node:assert/strict";
import { mkdtemp, readFile, writeFile } from "node:fs/promises";
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

test("v2 validate-human reports missing human editorial artifacts and exits non-zero", async () => {
  const cwd = await mkdtemp(path.join(tmpdir(), "seo-v2-cli-"));
  await captureCommand(cwd, () =>
    runV2Command(["prepare-page", "--cluster", "acne-treatment", "--page-id", "P1", "--page-type", "product_category"])
  );

  const validation = await captureCommand(cwd, () =>
    runV2Command(["validate-human", "--cluster", "acne-treatment", "--page-id", "P1"])
  );

  assert.equal(validation.exitCode, 1);
  assert.match(validation.stdout, /Human Editorial Brief: failed/);
  assert.match(validation.stdout, /Claim-First Section Plan: failed/);
  assert.match(validation.stdout, /At least 2 useful examples/);
  assert.match(validation.stdout, /Claim-first section plan requires at least one planned visible section/);
});

test("v2 validate-human passes completed human editorial artifacts", async () => {
  const cwd = await mkdtemp(path.join(tmpdir(), "seo-v2-cli-"));
  await captureCommand(cwd, () =>
    runV2Command(["prepare-page", "--cluster", "acne-treatment", "--page-id", "P1", "--page-type", "product_category"])
  );
  const pageDir = path.join(cwd, ".seo-agent-workspace", "v2", "page-packets", "acne-treatment", "P1");

  await writeFile(path.join(pageDir, "human-editorial-brief.json"), `${JSON.stringify(completedHumanBrief(), null, 2)}\n`, "utf8");
  await writeFile(path.join(pageDir, "claim-first-section-plan.json"), `${JSON.stringify(completedClaimPlan(), null, 2)}\n`, "utf8");

  const validation = await captureCommand(cwd, () =>
    runV2Command(["validate-human", "--cluster", "acne-treatment", "--page-id", "P1"])
  );

  assert.equal(validation.exitCode, undefined);
  assert.match(validation.stdout, /Human Editorial Brief: passed/);
  assert.match(validation.stdout, /Claim-First Section Plan: passed/);
  assert.match(validation.stdout, /Voice model: category_manager_with_editorial_empathy/);
  assert.match(validation.stdout, /Examples planned: 2/);
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

function completedHumanBrief(): Record<string, unknown> {
  return {
    schemaVersion: "human-editorial-brief.v2",
    status: "draft",
    voiceModel: "category_manager_with_editorial_empathy",
    visibility: { default: "internal_only" },
    depthStrategy: { pageType: "product_category", depth: "medium", framework: "five_w_plus_causal_chain" },
    readerTension: {
      whatReaderIsConfusedAbout: "Why acne keeps returning.",
      whatReaderIsAnxiousAbout: "Choosing the wrong routine.",
      decisionReaderNeedsToMake: "Whether to start with diagnosis or another product."
    },
    categoryManagerPov: {
      whatToChoose: "Start with identifying the acne pattern.",
      whatToAvoid: "Do not treat every breakout as random.",
      whereBuyersGoWrong: "They compare treatment strength before understanding the trigger.",
      whatTheBrandBelieves: "ClearNest believes acne care should start with pattern recognition.",
      tradeoffsThatMatter: ["speed versus tolerability"]
    },
    exampleRequirement: {
      minimumExamplesPerPage: 2,
      plannedExamples: [
        { sectionId: "S3_context", contextType: "category", purpose: "Recurring jawline acne versus occasional forehead bumps." },
        { sectionId: "S5_decision_support", contextType: "india_market", purpose: "Humid-weather routine tradeoffs." }
      ]
    },
    humanDevices: {
      decisionFramework: { required: true, selectedFormat: "if_this_then_that" },
      commonMistakes: {
        required: true,
        mistakesToCover: [{ sectionId: "S4_main_content", mistake: "Using harsher cleansers.", betterWayToThink: "Identify the trigger first." }]
      },
      notRightForYou: {
        required: true,
        conditions: [{ condition: "Painful recurring acne", reason: "Needs expert attention.", saferAlternativeOrNextStep: "Consult a dermatologist." }]
      },
      brandPov: { mode: "clear_not_salesy", firstPerson: "occasional", statement: "Our view is that treatment should start with understanding the acne pattern." },
      finalClosingBeforeCta: { required: true, plannedClosing: "If you are unsure what is triggering your acne, start with a skin analysis before changing another product." }
    },
    qaSummary: { includeInEditorialQaReport: true }
  };
}

function completedClaimPlan(): Record<string, unknown> {
  return {
    schemaVersion: "claim-first-section-plan.v2",
    status: "draft",
    sectionPlanTemplate: { requiredFields: ["sectionId", "sectionClaim"] },
    sections: [
      {
        sectionId: "S3_context",
        sectionClaim: "Acne treatment works better when the reader first identifies the acne pattern.",
        readerQuestion: "Why did my previous acne products not work?",
        evidenceNeeded: ["Source-backed acne type or trigger guidance."],
        exampleOrTradeoff: "Recurring jawline acne may need a different path from occasional forehead bumps.",
        caveatOrNotRightForYou: "Do not treat painful or worsening acne casually.",
        decisionPurpose: "Help the reader choose diagnosis-first action.",
        transitionPurpose: "Move from background explanation to decision framework."
      }
    ]
  };
}
