# Google Guidance Watcher V1 Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a weekly Google guidance watcher helper that compares official source snapshots and writes urgency-grouped Markdown reports.

**Architecture:** Add pure watcher logic for source normalization, hashing, snapshot comparison, urgency classification, and report rendering. Add a CLI command that fetches official URLs, reads/writes watcher state, and writes a report under the workspace.

**Tech Stack:** TypeScript, Node test runner, existing `.seo-agent-workspace` conventions, JSON schema, Markdown workflow docs.

---

### Task 1: Watcher Core

**Files:**
- Create: `src/lib/google-guidance-watcher.ts`
- Test: `tests/google-guidance-watcher.test.ts`

- [x] **Step 1: Write failing tests**

Test that the watcher detects changed official guidance, groups urgency, and renders a no meaningful changes found report.

- [x] **Step 2: Run tests to verify RED**

Run: `npm test`
Expected: FAIL because watcher core does not exist.

- [x] **Step 3: Implement watcher core**

Implement default official source definitions, snapshot hashing, change detection, urgency grouping, and Markdown rendering.

- [x] **Step 4: Run tests to verify GREEN**

Run: `npm test`
Expected: PASS.

### Task 2: CLI Command

**Files:**
- Create: `src/cli/watcher.ts`
- Modify: `src/cli/index.ts`
- Test: `tests/watcher-cli.test.ts`

- [x] **Step 1: Write failing CLI tests**

Test `runGoogleGuidanceWatcher` writes state and Markdown report files using injected fetch content.

- [x] **Step 2: Run tests to verify RED**

Run: `npm test`
Expected: FAIL because CLI helper does not exist.

- [x] **Step 3: Implement CLI helper**

Add `seo-agent watcher google-guidance [--date YYYY-MM-DD]`.

- [x] **Step 4: Run tests to verify GREEN**

Run: `npm test`
Expected: PASS.

### Task 3: Schema And Workflow Docs

**Files:**
- Create: `schemas/google-guidance-watcher.schema.json`
- Create: `workflows/18-google-guidance-watcher.md`
- Modify: `README.md`
- Modify: `AGENT.md`

- [x] **Step 1: Add schema**

Define state/report fields for official sources, content hashes, changes, urgency, and report metadata.

- [x] **Step 2: Add workflow documentation**

Document Tuesday morning weekly usage, official-source-only rules, and refresh suggestions.

- [x] **Step 3: Validate**

Run: `npm run validate`
Expected: TypeScript build and tests pass.

### Task 4: Commit And Deploy

**Files:**
- All files above.

- [x] **Step 1: Inspect diff**

Run: `git diff --stat`
Expected: Only Google guidance watcher files and docs changed.

- [x] **Step 2: Commit as aiapplications001-art**

Run: `git commit --author="aiapplications001-art <aiapplications001-art@users.noreply.github.com>" -m "Add Google guidance watcher"`

- [ ] **Step 3: Push branch and fast-forward main**

Run: `git push -u origin codex/google-guidance-watcher-v1`
Run: `git push origin codex/google-guidance-watcher-v1:main`

- [ ] **Step 4: Verify remote**

Run: `git ls-remote origin refs/heads/main refs/heads/codex/google-guidance-watcher-v1`
Expected: Both point to the same commit.
