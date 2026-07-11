# Page Packet V1 Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build the first publish-ready page packet generator scaffold from a completed Pre-Writing Strategy.

**Architecture:** Keep page-packet creation deterministic in the CLI: it reads a prewriting strategy, builds a structured Markdown editor packet and matching JSON mirror, then writes both to the workspace. Creative long-form copy and live SERP enrichment remain adapter responsibilities.

**Tech Stack:** TypeScript, Node test runner, existing `.seo-agent-workspace` conventions, JSON schemas, Markdown workflow docs.

---

### Task 1: Page Packet Core

**Files:**
- Create: `src/lib/page-packet.ts`
- Test: `tests/page-packet.test.ts`

- [x] **Step 1: Write failing tests**

Test that a selected prewriting strategy generates metadata, H1, URL slug, CTA copy, mobile/desktop notes, intent-aware generated sections, references, image slots, JSON-LD drafts, and machine metadata.

- [x] **Step 2: Run tests to verify RED**

Run: `npm test`
Expected: FAIL because `src/lib/page-packet.ts` does not exist.

- [x] **Step 3: Implement minimal packet builder**

Implement `generatePagePacket(input)` and `renderPagePacketMarkdown(packet)`.

- [x] **Step 4: Run tests to verify GREEN**

Run: `npm test`
Expected: PASS.

### Task 2: CLI Command

**Files:**
- Create: `src/cli/page-packet.ts`
- Modify: `src/cli/index.ts`
- Test: `tests/page-packet-cli.test.ts`

- [x] **Step 1: Write failing CLI tests**

Test `buildPagePacketFromWorkspace` reads `clusters/<slug>/prewriting/<page-id>/strategy.json` and writes:
- `page-packets/<slug>/<page-id>/page-packet.json`
- `page-packets/<slug>/<page-id>/page-packet.md`

- [x] **Step 2: Run tests to verify RED**

Run: `npm test`
Expected: FAIL because CLI helper does not exist.

- [x] **Step 3: Implement CLI helper**

Add `seo-agent page-packet build --cluster <slug> --page-id <P1> [--author <name>] [--reviewer <name>]`.

- [x] **Step 4: Run tests to verify GREEN**

Run: `npm test`
Expected: PASS.

### Task 3: Schema And Workflow Docs

**Files:**
- Create: `schemas/page-packet.schema.json`
- Create: `workflows/15-page-packet.md`
- Modify: `README.md`
- Modify: `AGENT.md`

- [x] **Step 1: Add schema**

Define the machine-readable CMS parsing contract for metadata, sections, links, images, schema drafts, and source prewriting metadata.

- [x] **Step 2: Add workflow documentation**

Document that this is the publish-ready packet container and that final creative prose can be filled by adapters while preserving the packet schema.

- [x] **Step 3: Validate**

Run: `npm run validate`
Expected: TypeScript build and tests pass.

### Task 4: Commit And Deploy

**Files:**
- All files above.

- [x] **Step 1: Inspect diff**

Run: `git diff --stat`
Expected: Only page packet files and docs changed.

- [x] **Step 2: Commit as aiapplications001-art**

Run: `git commit --author="aiapplications001-art <aiapplications001-art@users.noreply.github.com>" -m "Add page packet generator"`

- [ ] **Step 3: Push branch and fast-forward main**

Run: `git push -u origin codex/page-packet-v1`
Run: `git push origin codex/page-packet-v1:main`

- [ ] **Step 4: Verify remote**

Run: `git ls-remote origin refs/heads/main refs/heads/codex/page-packet-v1`
Expected: Both point to the same commit.
