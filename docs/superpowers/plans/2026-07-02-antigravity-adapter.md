# Antigravity Adapter Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add an Antigravity adapter that mirrors the Codex/Gemini SEO Page Creator rules and adds strict batch execution safeguards.

**Architecture:** This is a documentation-adapter slice. The Antigravity adapter lives in one instruction file, and the existing documentation adapter test pins the required workflow language so future edits cannot silently remove the batch safeguards.

**Tech Stack:** Markdown adapter instructions, Node.js built-in test runner, TypeScript project validation.

**Local-Only Constraint:** Do not commit, push, or publish from this replica unless the user explicitly asks. Commit steps are intentionally omitted.

---

## File Structure

- Create: `adapters/antigravity/AGENTS.md`
  - Antigravity-specific instruction surface.
  - Uses existing project docs as source of truth.
  - Repeats V2.1 single-page rules and stricter batch execution rules.
- Modify: `tests/v2-docs-adapters.test.ts`
  - Reads the Antigravity adapter.
  - Asserts it includes the V2.1, validation, editor-facing output, lock, ledger, and no-stage-batching requirements.
- Existing source context:
  - `AGENT.md`
  - `README.md`
  - `workflows/19-v2-content-quality.md`
  - `adapters/codex/skills/seo-page-creator/SKILL.md`
  - `adapters/gemini-cli/GEMINI.md`

---

### Task 1: Add Failing Adapter Coverage

**Files:**
- Modify: `tests/v2-docs-adapters.test.ts`
- Test: `tests/v2-docs-adapters.test.ts`

- [ ] **Step 1: Add Antigravity test reads and assertions**

Update the test to read the new adapter:

```ts
const antigravity = readFileSync("adapters/antigravity/AGENTS.md", "utf8");
```

Add assertions near the existing Codex/Gemini adapter assertions:

```ts
assert.match(antigravity, /Antigravity Adapter/);
assert.match(antigravity, /V2\.1/);
assert.match(antigravity, /validate-human/);
assert.match(antigravity, /validate-gates/);
assert.match(antigravity, /validate-depth/);
assert.match(antigravity, /final page packet, editorial QA report, and image manifest/);
assert.match(antigravity, /current-page\.lock/);
assert.match(antigravity, /run-ledger\.jsonl/);
assert.match(antigravity, /Do not batch by workflow stage/);
assert.match(antigravity, /future-page copy, images, assets, page packets, or manifests/);
assert.match(antigravity, /commit, push\/deploy, and verify HTTP 200 OK/);
```

- [ ] **Step 2: Run the focused test and verify it fails**

Run:

```bash
npm test -- tests/v2-docs-adapters.test.ts
```

Expected: FAIL because `adapters/antigravity/AGENTS.md` does not exist yet.

---

### Task 2: Add Antigravity Adapter Instructions

**Files:**
- Create: `adapters/antigravity/AGENTS.md`
- Test: `tests/v2-docs-adapters.test.ts`

- [ ] **Step 1: Create the adapter file**

Create `adapters/antigravity/AGENTS.md` with this content:

```md
# Antigravity Adapter

Use the SEO Page Creator Agent core files as the source of truth:

- `AGENT.md`
- `README.md`
- `workflows/19-v2-content-quality.md`
- `adapters/codex/skills/seo-page-creator/SKILL.md`
- `adapters/gemini-cli/GEMINI.md`

## V2.1 Single Page Workflow

For one SEO page, run the full V2.1 workflow for the current page only.

Required sequence:

1. Prepare or inspect the page workspace with `seo-agent v2 prepare-page --cluster <cluster-slug> --page-id <page-id> --page-type <page-type>`.
2. Do live SERP research and fill the SERP research ledger.
3. Review social/video assets and fill the social/video research artifact.
4. Fill audience, narrative, human editorial, claim-first section, citation, and depth artifacts.
5. Run `seo-agent v2 validate-human`.
6. Run `seo-agent v2 validate-gates`.
7. Run `seo-agent v2 validate-depth`.
8. If validation fails, repair the underlying research or artifact first. If `validate-depth` fails, add new research before rewriting prose.
9. Generate final copy only after `validate-human`, `validate-gates`, and `validate-depth` pass.
10. Generate the image manifest only after content and depth validation pass.
11. Return the final page packet, editorial QA report, and image manifest as the normal editor-facing output.

Keep internal ledgers, source notes, page state, and debug bundles available for troubleshooting, but do not make them the default editor-facing output.

## Batch Execution Contract

When asked to create multiple live SEO pages, run a strict serial page-by-page loop.

Do not batch by workflow stage.

Required batch sequence:

1. Stop before starting if the target project repo has uncommitted changes.
2. Identify the cluster during preflight. Use an existing cluster plan when suitable, or create/discover the cluster plan if needed.
3. Do not create page packets, final copy, images, or image manifests during cluster identification.
4. Select exactly one page opportunity.
5. Create or respect `.seo-agent-workspace/batch-runs/<run-id>/current-page.lock` before page work starts.
6. Append durable progress to `.seo-agent-workspace/batch-runs/<run-id>/run-ledger.jsonl`.
7. Complete research, page packet, final copy, image manifest, validation, QA, repair, commit, push/deploy, and verify HTTP 200 OK for the current page.
8. Clear `current-page.lock` only after the page is recorded as live, skipped, publish-failed, deploy-failed, or failed after repairs.
9. Start the next page only after the current page reaches a terminal recorded state.

If `current-page.lock` already exists, do not select another page. Inspect, resume, repair, or report the locked page before doing anything else.

## Hard Rules

- Generate one page packet at a time.
- Do not batch research, copy, images, validation, commits, or deployments across multiple pages.
- Do not create future-page copy, images, assets, page packets, or manifests while the current page is still in progress.
- Run `validate-depth` before final copy, images, commit, push, deploy, or publish.
- Treat shallow research as a repairable page-level failure.
- Use up to three total repair attempts per page.
- If a page still fails, record why, preserve artifacts and recommended fixes, skip that page, and select a replacement opportunity.
- Keep generating replacement opportunities until the requested live page count is reached or the max attempt limit is reached.
- At batch end, report live pages, failed pages, skipped pages, and failure reasons.
- Use Google data read-only.
- Ask before OAuth or private account fetches.
- Require approval for competitor names and third-party brand visuals.
- Do not override V2 hard gates.
```

- [ ] **Step 2: Run the focused docs adapter test**

Run:

```bash
npm test -- tests/v2-docs-adapters.test.ts
```

Expected: PASS.

---

### Task 3: Full Verification

**Files:**
- Verify: entire project

- [ ] **Step 1: Run full validation**

Run:

```bash
npm run validate
```

Expected: TypeScript build passes and all tests pass.

- [ ] **Step 2: Inspect local diff**

Run:

```bash
git status --short
git diff --stat
```

Expected: local replica changes only. No staged files, no commits, no pushes.

---

## Plan Self-Review

- Spec coverage: The plan covers the new Antigravity adapter, same rules as Codex/Gemini, stricter batch execution, `current-page.lock`, `run-ledger.jsonl`, no future-page assets/copy, validation gates, and tests.
- Placeholder scan: No TBD/TODO placeholders.
- Type consistency: Only Markdown and test assertions are changed; no new runtime types.
