# Step 0B Page Scope Contract Wiring Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Wire the approved Step 0B Page Scope Contract design into the local replica workflows and adapters so Codex, Gemini, and Antigravity must enforce it before page generation.

**Architecture:** Keep Step 0B as a cluster/page-scope gate in `workflows/13-cluster-strategy.md`, then mirror the required gate in each adapter's page workflow instructions. Use docs-adapter tests to prevent regressions in handler coverage.

**Tech Stack:** Markdown workflows/adapters, Gemini TOML prompt, Node `node:test` docs tests.

---

### Task 1: Add Regression Coverage

**Files:**
- Modify: `tests/v2-docs-adapters.test.ts`

- [ ] **Step 1: Write the failing test**

Add assertions that the cluster workflow and each adapter mention the Step 0B Page Scope Contract terms:

```ts
const clusterWorkflow = readFileSync("workflows/13-cluster-strategy.md", "utf8");

for (const doc of [clusterWorkflow, codexSkill, gemini, pageCommand, antigravity]) {
  assert.match(doc, /Step 0B|0B/);
  assert.match(doc, /Page Scope Contract|PageScopeContract/);
  assert.match(doc, /targetKeyword/);
  assert.match(doc, /targetQueryIntent/);
  assert.match(doc, /contractHash/);
  assert.match(doc, /mustCover/);
  assert.match(doc, /mustNotCover/);
  assert.match(doc, /pageScopeSummary/);
  assert.match(doc, /uniqueContribution/);
}
```

- [ ] **Step 2: Run test to verify it fails**

Run:

```bash
npm test -- tests/v2-docs-adapters.test.ts
```

Expected: FAIL because current workflow/adapters do not yet mention the Step 0B contract.

### Task 2: Wire Core Cluster Workflow

**Files:**
- Modify: `workflows/13-cluster-strategy.md`

- [ ] **Step 1: Add Step 0A/0B gate section**

Add a section that requires Step 0A before keyword work and Step 0B before page packet/prewriting/final copy/image generation.

- [ ] **Step 2: Add Page Scope Contract fields and pass/fail rules**

Include live evidence, light SERP overlap, exact target keyword, target query intent, selected opportunity, contract hash, must-cover/must-not-cover, unique contribution, batch duplicate check, and repair attempts.

### Task 3: Wire Codex Adapter

**Files:**
- Modify: `adapters/codex/skills/seo-page-creator/SKILL.md`

- [ ] **Step 1: Add Step 0B to Core Workflow**

Require `workflows/13-cluster-strategy.md` to be loaded before V2 page work.

- [ ] **Step 2: Add Page Scope Contract enforcement**

State that no V2 page work, final copy, images, commit, deploy, or publish may start until Step 0B passes and the downstream artifacts reference the same `contractHash`.

### Task 4: Wire Gemini Adapter And Command

**Files:**
- Modify: `adapters/gemini-cli/GEMINI.md`
- Modify: `adapters/gemini-cli/commands/seo/page.toml`

- [ ] **Step 1: Add Step 0B gate to Gemini adapter**

Mirror Codex enforcement in the Gemini adapter instructions.

- [ ] **Step 2: Add Step 0B gate to `/seo:page` prompt**

Require the page command to confirm or create the Page Scope Contract before `seo-agent v2 prepare-page` and before any research/copy/image work.

### Task 5: Wire Antigravity Adapter

**Files:**
- Modify: `adapters/antigravity/AGENTS.md`

- [ ] **Step 1: Add Step 0B gate before single-page workflow**

Require the Page Scope Contract before V2.1 page work.

- [ ] **Step 2: Add strict batch execution language**

Require batch duplicate checks and forbid future-page work unless the current page has a passing Step 0B contract and active `current-page.lock`.

### Task 6: Verify

**Files:**
- Test: `tests/v2-docs-adapters.test.ts`

- [ ] **Step 1: Run docs adapter test**

Run:

```bash
npm test -- tests/v2-docs-adapters.test.ts
```

Expected: PASS.

- [ ] **Step 2: Inspect git status**

Run:

```bash
git status --short
```

Expected: local-only changes in the replica; no commit or push.
