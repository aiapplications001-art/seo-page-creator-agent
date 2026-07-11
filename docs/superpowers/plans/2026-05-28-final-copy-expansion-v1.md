# Final Copy Expansion V1 Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a deterministic final-copy expansion layer that turns a page packet scaffold into a fuller review-ready draft while preserving the page-packet schema.

**Architecture:** Add pure expansion logic that preserves generated section IDs and writes expanded Markdown/JSON artifacts next to the original packet. Current V2.1 behavior requires adapter-written final prose in `final-copy-draft.json`; section IDs are generated from intent-aware prewriting structure and are not globally standardized across page types.

**Tech Stack:** TypeScript, Node test runner, existing `.seo-agent-workspace` conventions, Markdown workflow docs.

---

### Task 1: Final Copy Core

**Files:**
- Create: `src/lib/final-copy.ts`
- Test: `tests/final-copy.test.ts`

- [x] **Step 1: Write failing tests**

Test that copy expansion preserves schema, section IDs, images, links, and machine-readable mirror while replacing scaffold text with fuller section copy.

- [x] **Step 2: Run tests to verify RED**

Run: `npm test`
Expected: FAIL because `src/lib/final-copy.ts` does not exist.

- [x] **Step 3: Implement minimal expansion logic**

Implement `expandPagePacketCopy(packet)` with deterministic legacy copy only for non-V2 packets. V2.1 packets must use adapter-written final-copy drafts keyed to the exact generated section IDs.

- [x] **Step 4: Run tests to verify GREEN**

Run: `npm test`
Expected: PASS.

### Task 2: CLI Command

**Files:**
- Create: `src/cli/final-copy.ts`
- Modify: `src/cli/index.ts`
- Test: `tests/final-copy-cli.test.ts`

- [x] **Step 1: Write failing CLI tests**

Test `expandPagePacketFromWorkspace` reads `page-packet.json` and writes:
- `page-packet.expanded.json`
- `page-packet.expanded.md`

- [x] **Step 2: Run tests to verify RED**

Run: `npm test`
Expected: FAIL because CLI helper does not exist.

- [x] **Step 3: Implement CLI helper**

Add `seo-agent final-copy expand --cluster <slug> --page-id <P1>`.

- [x] **Step 4: Run tests to verify GREEN**

Run: `npm test`
Expected: PASS.

### Task 3: Workflow Docs

**Files:**
- Create: `workflows/16-final-copy-expansion.md`
- Modify: `README.md`
- Modify: `AGENT.md`

- [x] **Step 1: Add workflow documentation**

Document that expanded copy is review-ready, source-aware, and schema-preserving, but still requires editor review.

- [x] **Step 2: Validate**

Run: `npm run validate`
Expected: TypeScript build and tests pass.

### Task 4: Commit And Deploy

**Files:**
- All files above.

- [x] **Step 1: Inspect diff**

Run: `git diff --stat`
Expected: Only final-copy files and docs changed.

- [x] **Step 2: Commit as aiapplications001-art**

Run: `git commit --author="aiapplications001-art <aiapplications001-art@users.noreply.github.com>" -m "Add final copy expansion"`

- [ ] **Step 3: Push branch and fast-forward main**

Run: `git push -u origin codex/final-copy-expansion-v1`
Run: `git push origin codex/final-copy-expansion-v1:main`

- [ ] **Step 4: Verify remote**

Run: `git ls-remote origin refs/heads/main refs/heads/codex/final-copy-expansion-v1`
Expected: Both point to the same commit.
