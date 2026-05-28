# Cluster Strategy V1 Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a deterministic cluster strategy generator that converts site inventory metadata into one product/category cluster strategy at a time.

**Architecture:** Keep creative SEO judgment in the agent adapter, and make the CLI produce structured, reviewable strategy scaffolds from existing metadata. The generator should classify candidate pages, group internal URLs by selected product/category, propose page opportunities, assign advisory strategy categories, and write Markdown plus JSON outputs for editor review.

**Tech Stack:** TypeScript, Node test runner, existing `.seo-agent-workspace` conventions, JSON schemas, Markdown workflow docs.

---

### Task 1: Cluster Strategy Planner Core

**Files:**
- Create: `src/lib/cluster-strategy.ts`
- Test: `tests/cluster-strategy.test.ts`

- [x] **Step 1: Write failing tests**

Test that metadata rows for a selected category generate a cluster strategy with primary URL candidates, page opportunities, advisory categories, internal links, and assumptions.

- [x] **Step 2: Run tests to verify RED**

Run: `npm test`
Expected: FAIL because `src/lib/cluster-strategy.ts` does not exist.

- [x] **Step 3: Implement minimal planner**

Implement a deterministic planner with:
- `generateClusterStrategy(input)`
- product/category matching against URL, title, meta description, H1, and H2s
- page opportunities for `product_category`, `guide_blog`, and `comparison`
- category labels: `first_organic_wins`, `highest_conversion`, `startup_conversion`, `low_competition`, `high_competition`, `competitor_category`
- advisory quality score with issue list and likely SEO/conversion impact

- [x] **Step 4: Run tests to verify GREEN**

Run: `npm test`
Expected: PASS.

### Task 2: CLI Command

**Files:**
- Create: `src/cli/cluster.ts`
- Modify: `src/cli/index.ts`
- Test: `tests/cluster-cli.test.ts`

- [x] **Step 1: Write failing CLI tests**

Test `buildClusterStrategyFromWorkspace` writes:
- `.seo-agent-workspace/clusters/<slug>/strategy.json`
- `.seo-agent-workspace/clusters/<slug>/strategy.md`

- [x] **Step 2: Run tests to verify RED**

Run: `npm test`
Expected: FAIL because cluster CLI helpers do not exist.

- [x] **Step 3: Implement CLI helper**

Add `seo-agent cluster plan --category "<name>" [--market India]` that reads `site-inventory/metadata.json`, writes the cluster outputs, and prints paths.

- [x] **Step 4: Run tests to verify GREEN**

Run: `npm test`
Expected: PASS.

### Task 3: Schema And Workflow Docs

**Files:**
- Create: `schemas/cluster-strategy.schema.json`
- Create: `workflows/13-cluster-strategy.md`
- Modify: `README.md`
- Modify: `AGENT.md`

- [x] **Step 1: Add schema**

Define required machine fields for selected category, market, source metadata, candidate existing URLs, page opportunities, internal link suggestions, advisory quality score, assumptions, and next-page selection guidance.

- [x] **Step 2: Add workflow documentation**

Document that cluster strategy is created once per selected product/category, refreshed only on user request, and live SERP URLs are temporary unless explicitly saved.

- [x] **Step 3: Validate**

Run: `npm run validate`
Expected: TypeScript build and tests pass.

### Task 4: Commit And Deploy

**Files:**
- All files above.

- [x] **Step 1: Inspect diff**

Run: `git diff --stat`
Expected: Only cluster strategy files and docs changed.

- [x] **Step 2: Commit as aiapplications001-art**

Run: `git commit --author="aiapplications001-art <aiapplications001-art@users.noreply.github.com>" -m "Add cluster strategy generator"`

- [x] **Step 3: Push branch and fast-forward main**

Run: `git push -u origin codex/cluster-strategy-v1`
Run: `git push origin codex/cluster-strategy-v1:main`

- [x] **Step 4: Verify remote**

Run: `git ls-remote origin refs/heads/main refs/heads/codex/cluster-strategy-v1`
Expected: Both point to the same commit.
