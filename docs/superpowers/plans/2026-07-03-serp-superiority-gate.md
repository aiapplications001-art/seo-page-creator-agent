# SERP Superiority Gate Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Enforce SERP superiority inside the existing V2.1 depth, final-copy, QA, template, and adapter workflow.

**Architecture:** Extend existing artifacts instead of adding a new gate file. `validate-depth` blocks weak pre-draft superiority plans, final-copy validation blocks missing visible delivery, and editorial QA requires a human-readable ranking rationale.

**Tech Stack:** TypeScript, Node test runner, existing JSON artifact templates and adapter markdown.

---

### Task 1: Pre-Draft Superiority Depth Validation

**Files:**
- Modify: `src/lib/v2/depth.ts`
- Modify: `tests/v2-depth-contract.test.ts`

- [ ] Add failing tests that a complete depth contract fails when missing SERP superiority proof, missing source diversity, weak competitor scoring, missing superiority component, missing differentiated improvements, or missing extractable answer blocks.
- [ ] Implement typed superiority fields on `CompetitorDepthDelta`, `PreDraftQualityBrief`, and `PageDepthScore`.
- [ ] Collect evidence refs with source roles from research facts, audience signals, primary competitors, and secondary SERPs.
- [ ] Validate primary top 5 competitor scoring, lighter secondary top 3 analysis, source role coverage, top-four intent wins, one major superiority component, five visible differentiated improvements, and three extractable answer blocks.
- [ ] Run `npm test tests/v2-depth-contract.test.ts`.

### Task 2: Post-Draft Superiority Final Copy Validation

**Files:**
- Modify: `src/lib/v2/final-copy-draft.ts`
- Modify: `tests/final-copy-draft.test.ts`
- Modify: `tests/final-copy-cli.test.ts`

- [ ] Add failing tests that final copy fails when superiority proof is absent, the superiority component is not visible, differentiated improvements are not delivered, extractable blocks are missing, visible citation handling is absent for trust-sensitive claims, or the ranking rationale is missing.
- [ ] Add `superiorityProof` to `FinalCopyDraft`.
- [ ] Validate delivered intent wins, delivered component, delivered differentiated improvements, extractable answer blocks, visible citation handling, and `whyThisDeservesToRank`.
- [ ] Update existing final-copy test fixtures to include valid superiority proof.
- [ ] Run `npm test tests/final-copy-draft.test.ts tests/final-copy-cli.test.ts`.

### Task 3: Editorial QA Ranking Rationale

**Files:**
- Modify: `src/lib/v2/qa.ts`
- Modify: `tests/v2-qa.test.ts`

- [ ] Add failing tests that QA fails without `whyThisDeservesToRank`.
- [ ] Add `whyThisDeservesToRank` to QA input/report.
- [ ] Render the summary in markdown and include it in blocking logic.
- [ ] Update passing QA fixtures.
- [ ] Run `npm test tests/v2-qa.test.ts`.

### Task 4: Templates, Workflow Docs, And Adapter Instructions

**Files:**
- Modify: `src/lib/v2/templates.ts`
- Modify: `workflows/19-v2-content-quality.md`
- Modify: `README.md`
- Modify: `adapters/codex/skills/seo-page-creator/SKILL.md`
- Modify: `adapters/gemini-cli/GEMINI.md`
- Modify: `adapters/gemini-cli/commands/seo/page.toml`
- Modify: `adapters/antigravity/AGENTS.md`
- Modify: `tests/v2-docs-adapters.test.ts`

- [ ] Add template guidance and JSON shape for the new superiority fields.
- [ ] Update workflow docs and adapters to require top 5 primary SERP, top 3 secondary SERPs, source roles, competitor scoring, one custom component, five differentiated visible improvements, three extractable answer blocks, and post-draft superiority verification.
- [ ] Add or update docs tests to catch missing adapter instructions.
- [ ] Run `npm test tests/v2-docs-adapters.test.ts`.

### Task 5: Full Validation

**Files:**
- Verify all modified source/tests/docs.

- [ ] Run `npm run validate`.
- [ ] Review changed files for accidental git or generated-output churn.
- [ ] Request code review and fix any actionable issues.
