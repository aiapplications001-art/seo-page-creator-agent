# Page Depth Contract Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add deterministic V2.1 depth gates so batch-created SEO pages must prove research density, competitor differentiation, audience specificity, and section usefulness before copy can be treated as ready.

**Architecture:** Add a focused `src/lib/v2/depth.ts` validator that reads structured depth artifacts and returns blocking issues. Seed those artifacts during `prepare-page`, expose a `seo-agent v2 validate-depth` command, and update batch/adapter guidance so every page worker must pass depth validation before final copy, images, commit, or publish.

**Tech Stack:** TypeScript ESM, Node built-in test runner, existing V2 CLI/template patterns, JSON/Markdown artifacts under `.seo-agent-workspace/v2/page-packets/<cluster>/<page-id>/`.

---

### Task 1: Depth Contract Validator

**Files:**
- Create: `src/lib/v2/depth.ts`
- Test: `tests/v2-depth-contract.test.ts`

- [ ] **Step 1: Write failing validator tests**

Create tests that import `validatePageDepthContract` and verify:

- A complete depth packet passes.
- Missing extraction density fails with `Research extraction matrix requires at least 40 extracted facts.`
- Missing competitor deltas fails with `Competitor depth delta requires at least 10 specificity improvements.`
- Missing audience concerns fails with `Audience pain-point ledger requires at least 20 audience signals.`
- A section without evidence budget fails with `<sectionId>: section evidence budget requires 2 facts, 1 cited claim, and 1 concrete usefulness item.`
- A low score fails with `Depth score must be at least 85.`

- [ ] **Step 2: Run the test and confirm RED**

Run: `npm test -- tests/v2-depth-contract.test.ts`

Expected: FAIL because `src/lib/v2/depth.ts` does not exist.

- [ ] **Step 3: Implement minimal validator**

Create interfaces for:

- `ResearchExtractionMatrix`
- `CompetitorDepthDelta`
- `AudiencePainPointLedger`
- `PreDraftSynthesisBrief`
- `PageDepthScore`
- `PageDepthContractInput`

Implement `validatePageDepthContract(input)` returning:

```ts
{
  status: "passed" | "failed";
  blockingIssues: string[];
  advisoryIssues: string[];
  score: number;
}
```

Hard thresholds:

- at least 40 extracted facts
- at least 3 extracted facts per analyzed source
- at least 10 specificity improvements
- at least 20 audience signals
- every major section has 2 facts, 1 cited claim, and 1 concrete usefulness item
- synthesis brief is 500-900 words
- depth score is at least 85
- all depth dimensions are at least 4/5

- [ ] **Step 4: Run the validator test and confirm GREEN**

Run: `npm test -- tests/v2-depth-contract.test.ts`

Expected: PASS.

### Task 2: Seed Depth Artifacts

**Files:**
- Modify: `src/lib/v2/templates.ts`
- Test: `tests/v2-prepare-page.test.ts`

- [ ] **Step 1: Add failing prepare-page assertions**

Assert that `prepareV2PageWorkspace` creates:

- `research-extraction-matrix.json`
- `research-extraction-matrix.md`
- `competitor-depth-delta.json`
- `competitor-depth-delta.md`
- `audience-pain-point-ledger.json`
- `audience-pain-point-ledger.md`
- `pre-draft-synthesis-brief.json`
- `pre-draft-synthesis-brief.md`
- `depth-score.json`
- `depth-score.md`

- [ ] **Step 2: Run focused test and confirm RED**

Run: `npm test -- tests/v2-prepare-page.test.ts`

Expected: FAIL because seeded files are missing.

- [ ] **Step 3: Seed missing JSON and Markdown templates**

Add seed functions with explicit threshold instructions and empty arrays/fields. The Markdown must tell agents that final copy is blocked until `validate-depth` passes.

- [ ] **Step 4: Run focused test and confirm GREEN**

Run: `npm test -- tests/v2-prepare-page.test.ts`

Expected: PASS.

### Task 3: CLI Depth Validation

**Files:**
- Modify: `src/cli/v2.ts`
- Test: `tests/v2-cli.test.ts`

- [ ] **Step 1: Add failing CLI tests**

Add one test where seeded artifacts fail:

```ts
const validation = await captureCommand(cwd, () =>
  runV2Command(["validate-depth", "--cluster", "acne-treatment", "--page-id", "P1"])
);
assert.equal(validation.exitCode, 1);
assert.match(validation.stdout, /Page Depth Contract: failed/);
```

Add one test where completed artifacts pass and print:

- `Page Depth Contract: passed`
- `Depth score: 88`

- [ ] **Step 2: Run focused test and confirm RED**

Run: `npm test -- tests/v2-cli.test.ts`

Expected: FAIL because `validate-depth` is unknown.

- [ ] **Step 3: Implement `validate-depth`**

Read the five depth artifacts, call `validatePageDepthContract`, print blocking issues, and set `process.exitCode = 1` when status is failed.

- [ ] **Step 4: Run focused test and confirm GREEN**

Run: `npm test -- tests/v2-cli.test.ts`

Expected: PASS.

### Task 4: Batch And Agent Guidance

**Files:**
- Modify: `src/lib/batch-live/types.ts`
- Modify: `README.md`
- Modify: `adapters/codex/skills/seo-page-creator/SKILL.md`
- Modify: `adapters/gemini-cli/GEMINI.md`
- Modify: `workflows/19-v2-content-quality.md`

- [ ] **Step 1: Extend the batch page-worker options test**

Assert the page worker receives `depthContract.required === true` and `depthContract.minimumScore === 85`.

- [ ] **Step 2: Run focused test and confirm RED**

Run: `npm test -- tests/batch-live-runner.test.ts`

Expected: FAIL because `depthContract` is not passed.

- [ ] **Step 3: Add depth contract to page-worker options and docs**

Update the batch options to require `validate-depth` before final copy/images/publish. Update agent docs to say repairs for depth failures must add new research, not only rewrite prose.

- [ ] **Step 4: Run validation**

Run: `npm run validate`

Expected: PASS.
