# Google OAuth And Image Generation V1 Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add the first open-source repo scaffold for the SEO Page Creator Agent with Google OAuth read-only and image generation workflows treated as V1 tracks.

**Architecture:** Keep the CLI deterministic and provider-safe: it initializes workspaces, stores local credentials, validates config, and documents workflows, while Gemini/Codex adapters perform the creative writing and image generation. Google integrations are read-only and fallback to uploaded CSV/XLSX data when OAuth/API access is unavailable.

**Tech Stack:** TypeScript, Node.js CLI, Markdown workflow specs, JSON schemas/templates, local `.seo-agent-workspace/` storage.

---

### Task 1: Repo Scaffold And Config

**Files:**
- Create: `README.md`
- Create: `AGENT.md`
- Create: `.gitignore`
- Create: `.seo-agent.config.example.json`
- Create: `package.json`
- Create: `tsconfig.json`

- [ ] **Step 1: Add public-facing repo metadata and safe defaults**

Create the repo overview, gitignore, package metadata, and default config.

- [ ] **Step 2: Verify scaffold**

Run: `git status --short`
Expected: new scaffold files appear as untracked.

### Task 2: Google OAuth Read-Only Track

**Files:**
- Create: `workflows/10-google-oauth-readonly.md`
- Create: `policies/google-data-access-policy.md`
- Create: `schemas/google-data-import.schema.json`
- Create: `src/connectors/google/auth.ts`
- Create: `src/connectors/google/search-console.ts`
- Create: `src/connectors/google/keyword-planner.ts`
- Create: `src/cli/auth-google.ts`

- [ ] **Step 1: Document OAuth and fallback workflow**

Write the V1 workflow and policy for read-only Search Console and Google Ads Keyword Planner access.

- [ ] **Step 2: Add TypeScript connector skeletons**

Implement small deterministic helpers for OAuth URL generation, token file storage paths, Search Console request shaping, and Keyword Planner request shaping.

### Task 3: Image Generation Track

**Files:**
- Create: `workflows/11-image-generation.md`
- Create: `policies/image-generation-policy.md`
- Create: `schemas/image-plan.schema.json`
- Create: `templates/image-prompt-briefs.template.md`
- Create: `src/lib/image-filenames.ts`

- [ ] **Step 1: Document image generation rules**

Capture top 3-5 in-page images, separate `IMG_OG`, approval rules for external brand visuals, timeout fallback, and prompt companion artifact behavior.

- [ ] **Step 2: Add filename helper**

Add a deterministic image filename normalizer for SEO-friendly filenames.

### Task 4: CLI Entrypoint And Workspace Init

**Files:**
- Create: `src/cli/index.ts`
- Create: `src/cli/init-workspace.ts`
- Create: `src/lib/config.ts`
- Create: `src/lib/workspace.ts`

- [ ] **Step 1: Add basic CLI command routing**

Support `init`, `auth google`, and `help` command stubs.

- [ ] **Step 2: Add workspace init helper**

Create `.seo-agent-workspace/` folders and `.seo-agent.config.json` from the example config.

### Task 5: Lightweight Tests

**Files:**
- Create: `tests/image-filenames.test.ts`
- Create: `tests/workspace.test.ts`

- [ ] **Step 1: Add focused tests**

Test filename normalization and workspace folder list behavior.

- [ ] **Step 2: Run available verification**

Run: `git diff --check`
Expected: no whitespace errors.

Run: `git status --short`
Expected: only intended files are changed.
