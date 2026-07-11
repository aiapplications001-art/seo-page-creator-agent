# Research-Derived Structure Gate Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Enforce `researchDerivedStructurePlan` inside `pre-draft-quality-brief.json` as a hard V2.1 pre-final-copy gate.

**Architecture:** Extend the existing V2 depth contract instead of adding a new artifact. `src/lib/v2/depth.ts` validates the new structure plan against known evidence refs and source roles, while final-copy validation later checks that promised structure outputs are delivered. Docs, templates, and adapter contracts tell Codex/Gemini/Antigravity that this gate blocks final copy.

**Tech Stack:** TypeScript, Node test runner, existing V2 depth/final-copy validators.

---

### Task 1: Add Depth Contract Validation

**Files:**
- Modify: `src/lib/v2/depth.ts`
- Test: `tests/v2-depth-contract.test.ts`

- [ ] Add failing tests for missing `researchDerivedStructurePlan`, buried primary concern, weak refs, generic rationale, wrong source-role refs, and valid passing plan.
- [ ] Implement `ResearchDerivedStructurePlan` types and validation helpers.
- [ ] Wire validation into `validatePreDraftQualityBrief`.
- [ ] Run `npm test -- tests/v2-depth-contract.test.ts`.

### Task 2: Add Final Copy Delivery Validation

**Files:**
- Modify: `src/lib/v2/final-copy-draft.ts`
- Test: `tests/final-copy-draft.test.ts`

- [ ] Add failing tests proving final copy fails when the near-top primary concern or a promised high-impact component is missing.
- [ ] Add `structurePlanDeliveryProof` support to final-copy draft validation.
- [ ] Check proof snippets against actual section markdown, not model-written status.
- [ ] Run `npm test -- tests/final-copy-draft.test.ts`.

### Task 3: Update Templates, Docs, And Adapters

**Files:**
- Modify: `src/lib/v2/templates.ts`
- Modify: `workflows/19-v2-content-quality.md`
- Modify: `README.md`
- Modify: `adapters/codex/skills/seo-page-creator/SKILL.md`
- Modify: `adapters/gemini-cli/GEMINI.md`
- Modify: `adapters/antigravity/AGENTS.md`
- Test: `tests/v2-docs-adapters.test.ts`

- [ ] Seed `pre-draft-quality-brief.json` and markdown with `researchDerivedStructurePlan`.
- [ ] Document the hard gate before final copy.
- [ ] Update adapter instructions for source-role evidence, scan priority, and final-copy delivery proof.
- [ ] Run `npm test -- tests/v2-docs-adapters.test.ts tests/v2-prepare-page.test.ts`.

### Task 4: Full Verification

**Files:**
- Verify all touched files.

- [ ] Run `npm run validate`.
- [ ] Fix any failures without weakening the gate.
- [ ] Summarize changed files and test results.
