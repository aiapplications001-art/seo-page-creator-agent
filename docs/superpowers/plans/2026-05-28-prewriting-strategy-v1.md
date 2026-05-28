# Pre-Writing Strategy V1 Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build the required Pre-Writing Strategy gate that turns one selected cluster page opportunity into a structured brief before publish-ready page copy is drafted.

**Architecture:** The cluster strategy decides what page could be generated next; the pre-writing strategy decides how exactly that single page should be written. Keep deterministic planning in the CLI and leave live SERP research, approvals, and creative copy generation to adapters.

**Tech Stack:** TypeScript, Node test runner, existing `.seo-agent-workspace` conventions, JSON schemas, Markdown workflow docs.

---

### Task 1: Pre-Writing Strategy Core

**Files:**
- Create: `src/lib/prewriting-strategy.ts`
- Test: `tests/prewriting-strategy.test.ts`

- [x] **Step 1: Write failing tests**

Test that a selected cluster page opportunity generates page intent, tone options, content depth range, CTA strategy, section plan, reference requirements, image requirements, approval queues, and machine metadata.

- [x] **Step 2: Run tests to verify RED**

Run: `npm test`
Expected: FAIL because `src/lib/prewriting-strategy.ts` does not exist.

- [x] **Step 3: Implement minimal strategy builder**

Implement `generatePreWritingStrategy(input)` for one selected page opportunity. It should support product/category, guide/blog, and comparison pages.

- [x] **Step 4: Run tests to verify GREEN**

Run: `npm test`
Expected: PASS.

### Task 2: CLI Command

**Files:**
- Create: `src/cli/prewriting.ts`
- Modify: `src/cli/index.ts`
- Test: `tests/prewriting-cli.test.ts`

- [x] **Step 1: Write failing CLI tests**

Test `buildPreWritingStrategyFromWorkspace` reads `clusters/<slug>/strategy.json` and writes:
- `clusters/<slug>/prewriting/<page-id>/strategy.json`
- `clusters/<slug>/prewriting/<page-id>/strategy.md`

- [x] **Step 2: Run tests to verify RED**

Run: `npm test`
Expected: FAIL because the CLI helper does not exist.

- [x] **Step 3: Implement CLI helper**

Add `seo-agent prewriting plan --cluster <slug> --page-id <P1> --audience <cohort> [--tone <tone>] [--depth <range>]`.

- [x] **Step 4: Run tests to verify GREEN**

Run: `npm test`
Expected: PASS.

### Task 3: Schema And Workflow Docs

**Files:**
- Create: `schemas/prewriting-strategy.schema.json`
- Create: `workflows/14-prewriting-strategy.md`
- Modify: `README.md`
- Modify: `AGENT.md`

- [x] **Step 1: Add schema**

Define required fields for selected page, audience, tone choices, keywords, CTA, destination, sections, references, approvals, content depth, image requirements, and machine-readable metadata.

- [x] **Step 2: Add workflow documentation**

Document that the agent cannot create full copy until pre-writing strategy exists and unresolved critical approvals are handled.

- [x] **Step 3: Validate**

Run: `npm run validate`
Expected: TypeScript build and tests pass.

### Task 4: Commit And Deploy

**Files:**
- All files above.

- [x] **Step 1: Inspect diff**

Run: `git diff --stat`
Expected: Only pre-writing strategy files and docs changed.

- [x] **Step 2: Commit as aiapplications001-art**

Run: `git commit --author="aiapplications001-art <aiapplications001-art@users.noreply.github.com>" -m "Add pre-writing strategy generator"`

- [x] **Step 3: Push branch and fast-forward main**

Run: `git push -u origin codex/prewriting-strategy-v1`
Run: `git push origin codex/prewriting-strategy-v1:main`

- [x] **Step 4: Verify remote**

Run: `git ls-remote origin refs/heads/main refs/heads/codex/prewriting-strategy-v1`
Expected: Both point to the same commit.
