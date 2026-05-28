# Image Manifest V1 Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build an image asset manifest and prompt-brief companion for page packets.

**Architecture:** Add pure image planning logic that converts page-packet image slots into SEO-friendly asset records. Add a CLI command that reads an existing page packet and writes `image-manifest.json` plus `image-prompts.md` only when ungenerated images exist.

**Tech Stack:** TypeScript, Node test runner, existing `.seo-agent-workspace` conventions, JSON schema, Markdown workflow docs.

---

### Task 1: Image Manifest Core

**Files:**
- Create: `src/lib/image-manifest.ts`
- Test: `tests/image-manifest.test.ts`

- [x] **Step 1: Write failing tests**

Test that a page packet produces manifest records with image IDs, section IDs, SEO filenames, aspect ratios, alt text, prompt briefs, and licensing notes.

- [x] **Step 2: Run tests to verify RED**

Run: `npm test`
Expected: FAIL because `src/lib/image-manifest.ts` does not exist.

- [x] **Step 3: Implement minimal manifest builder**

Implement `buildImageManifest(packet)` and `renderImagePromptBriefs(manifest)`.

- [x] **Step 4: Run tests to verify GREEN**

Run: `npm test`
Expected: PASS.

### Task 2: CLI Command

**Files:**
- Create: `src/cli/images.ts`
- Modify: `src/cli/index.ts`
- Test: `tests/images-cli.test.ts`

- [x] **Step 1: Write failing CLI tests**

Test `planImagesFromWorkspace` writes:
- `image-manifest.json`
- `image-prompts.md` when ungenerated images exist

- [x] **Step 2: Run tests to verify RED**

Run: `npm test`
Expected: FAIL because image CLI helper does not exist.

- [x] **Step 3: Implement CLI helper**

Add `seo-agent images plan --cluster <slug> --page-id <P1> [--expanded]`.

- [x] **Step 4: Run tests to verify GREEN**

Run: `npm test`
Expected: PASS.

### Task 3: Schema And Workflow Docs

**Files:**
- Create: `schemas/image-manifest.schema.json`
- Create: `workflows/17-image-manifest.md`
- Modify: `README.md`
- Modify: `AGENT.md`

- [x] **Step 1: Add schema**

Define required fields for image IDs, page metadata, asset records, SEO filenames, prompt briefs, and licensing review notes.

- [x] **Step 2: Add workflow documentation**

Document that this command creates planning artifacts and does not generate images directly.

- [x] **Step 3: Validate**

Run: `npm run validate`
Expected: TypeScript build and tests pass.

### Task 4: Commit And Deploy

**Files:**
- All files above.

- [x] **Step 1: Inspect diff**

Run: `git diff --stat`
Expected: Only image manifest files and docs changed.

- [x] **Step 2: Commit as aiapplications001-art**

Run: `git commit --author="aiapplications001-art <aiapplications001-art@users.noreply.github.com>" -m "Add image manifest planning"`

- [ ] **Step 3: Push branch and fast-forward main**

Run: `git push -u origin codex/image-manifest-v1`
Run: `git push origin codex/image-manifest-v1:main`

- [ ] **Step 4: Verify remote**

Run: `git ls-remote origin refs/heads/main refs/heads/codex/image-manifest-v1`
Expected: Both point to the same commit.
