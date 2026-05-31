# SEO Page Creator V2 Content Quality Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build V2 content-quality infrastructure so the agent cannot generate final page packets without research, narrative, social/video, audience, citation, QA, repair, and image-readiness gates.

**Architecture:** Keep the host-agent-first model. The Node.js repo creates artifact templates, schemas, validators, state files, CLI orchestration, QA reports, and status transitions; Codex/Gemini/other host agents perform live research and writing, then fill artifacts. Each slice is deterministic and testable.

**Tech Stack:** TypeScript ESM, Node.js built-in test runner, `tsx`, existing `.seo-agent-workspace` artifact layout, JSON Schema files, Markdown renderers.

---

## File Structure

Create and modify these focused units:

- Create `config/generic-phrase-patterns.json`: editable global generic phrase patterns.
- Create `config/narrative-style-profiles.json`: editable master profile and narrative style profiles.
- Create `config/page-type-modifiers.json`: editable page-type modifiers.
- Create `config/claim-rewrite-patterns.json`: editable risky-claim rewrite rules.
- Create `config/image-prompt-profiles.json`: editable OG/in-page prompt profiles.
- Create `schemas/v2-page-state.schema.json`: lifecycle status contract.
- Create `schemas/v2-serp-research-ledger.schema.json`: SERP gate contract.
- Create `schemas/v2-social-video-research.schema.json`: social/video gate contract.
- Create `schemas/v2-audience-definition.schema.json`: audience gate contract.
- Create `schemas/v2-narrative-brief.schema.json`: narrative gate contract.
- Create `schemas/v2-citation-set.schema.json`: citation gate contract.
- Create `schemas/v2-editorial-qa-report.schema.json`: QA report contract.
- Create `schemas/v2-section-version-history.schema.json`: section version history contract.
- Create `src/lib/v2/types.ts`: shared V2 TypeScript interfaces.
- Create `src/lib/v2/paths.ts`: V2 workspace path helpers.
- Create `src/lib/v2/templates.ts`: JSON/Markdown seed artifact builders.
- Create `src/lib/v2/state.ts`: page-state creation and transition helpers.
- Create `src/lib/v2/gates.ts`: gate machine-check validators.
- Create `src/lib/v2/heuristics.ts`: placeholder/generic/risky claim/copy heuristics.
- Create `src/lib/v2/qa.ts`: editorial QA summary builder and status decisions.
- Create `src/lib/v2/debug-bundle.ts`: debug bundle Markdown and zip file listing support.
- Create `src/lib/v2/refresh.ts`: refresh packet builder for changed sections.
- Create `src/lib/v2/image-readiness.ts`: V2 image readiness and reserved ID rules.
- Create `src/cli/v2.ts`: V2 command router.
- Modify `src/cli/index.ts`: route `seo-agent v2` subcommands.
- Modify `src/lib/workspace.ts`: include V2 workspace folders if needed.
- Create `workflows/19-v2-content-quality.md`: adapter workflow for V2 gates and writing.
- Create tests under `tests/v2-*.test.ts`.
- Update `README.md`, `AGENT.md`, `adapters/gemini-cli/GEMINI.md`, and Gemini/Codex adapter command files after CLI slices land.

## Slice Order

1. Config and schemas.
2. V2 paths, state, and prepare-page templates.
3. Gate validators.
4. Heuristic validators.
5. QA report and section threshold logic.
6. V2 CLI prepare/status/validate-gates/qa.
7. Image readiness and publish-ready state.
8. Refresh packets and section version history.
9. Debug bundle.
10. Documentation and adapters.

Each slice ends with `npm run validate` and an atomic commit.

---

### Task 1: Add V2 Config Defaults And Schemas

**Files:**
- Create: `config/generic-phrase-patterns.json`
- Create: `config/narrative-style-profiles.json`
- Create: `config/page-type-modifiers.json`
- Create: `config/claim-rewrite-patterns.json`
- Create: `config/image-prompt-profiles.json`
- Create: `schemas/v2-page-state.schema.json`
- Create: `schemas/v2-serp-research-ledger.schema.json`
- Create: `schemas/v2-social-video-research.schema.json`
- Create: `schemas/v2-audience-definition.schema.json`
- Create: `schemas/v2-narrative-brief.schema.json`
- Create: `schemas/v2-citation-set.schema.json`
- Create: `schemas/v2-editorial-qa-report.schema.json`
- Create: `schemas/v2-section-version-history.schema.json`
- Test: `tests/v2-config-schemas.test.ts`

- [ ] **Step 1: Write the failing test**

Create `tests/v2-config-schemas.test.ts`:

```ts
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { test } from "node:test";

const json = (path: string) => JSON.parse(readFileSync(path, "utf8"));

test("V2 editable config files define required defaults", () => {
  const generic = json("config/generic-phrase-patterns.json");
  const styles = json("config/narrative-style-profiles.json");
  const pageTypes = json("config/page-type-modifiers.json");
  const claims = json("config/claim-rewrite-patterns.json");
  const images = json("config/image-prompt-profiles.json");

  assert.equal(generic.schemaVersion, "generic-phrase-patterns.v1");
  assert.ok(generic.hardFailInOpening.includes("in today's fast-paced world"));
  assert.ok(generic.repairAnywhere.includes("game-changer"));

  assert.equal(styles.schemaVersion, "narrative-style-profiles.v1");
  assert.equal(styles.masterProfile.id, "advanced_india_seo_editorial_strategist");
  assert.ok(styles.profiles.some((profile: { id: string }) => profile.id === "professional_compact_guide"));
  assert.ok(styles.profiles.some((profile: { id: string }) => profile.id === "story_led_blog"));

  assert.equal(pageTypes.schemaVersion, "page-type-modifiers.v1");
  assert.ok(pageTypes.modifiers.some((modifier: { id: string }) => modifier.id === "product_category_modifier"));

  assert.equal(claims.schemaVersion, "claim-rewrite-patterns.v1");
  assert.ok(claims.patterns.some((pattern: { riskType: string }) => pattern.riskType === "medical_or_outcome_guarantee"));

  assert.equal(images.schemaVersion, "image-prompt-profiles.v1");
  assert.ok(images.profiles.some((profile: { id: string }) => profile.id === "og_image"));
  assert.ok(images.profiles.some((profile: { id: string }) => profile.id === "product_category_visual"));
});

test("V2 schema files expose expected schema ids", () => {
  const schemaIds = [
    ["schemas/v2-page-state.schema.json", "page-state.v2"],
    ["schemas/v2-serp-research-ledger.schema.json", "serp-research-ledger.v2"],
    ["schemas/v2-social-video-research.schema.json", "social-video-research.v2"],
    ["schemas/v2-audience-definition.schema.json", "audience-definition.v2"],
    ["schemas/v2-narrative-brief.schema.json", "narrative-brief.v2"],
    ["schemas/v2-citation-set.schema.json", "citation-set.v2"],
    ["schemas/v2-editorial-qa-report.schema.json", "editorial-qa-report.v2"],
    ["schemas/v2-section-version-history.schema.json", "section-version-history.v2"]
  ];

  for (const [path, schemaVersion] of schemaIds) {
    const schema = json(path);
    assert.equal(schema.properties.schemaVersion.const, schemaVersion);
    assert.ok(Array.isArray(schema.required), `${path} should declare required fields`);
  }
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npm test -- tests/v2-config-schemas.test.ts`

Expected: FAIL with `ENOENT` for missing config or schema files.

- [ ] **Step 3: Add minimal config files**

Create `config/generic-phrase-patterns.json`:

```json
{
  "schemaVersion": "generic-phrase-patterns.v1",
  "hardFailInOpening": [
    "in today's fast-paced world",
    "in the ever-evolving world",
    "unlock your potential"
  ],
  "repairAnywhere": [
    "game-changer",
    "comprehensive solution",
    "tailored to your needs",
    "seamless experience",
    "cutting-edge",
    "revolutionary",
    "one-stop solution"
  ]
}
```

Create `config/narrative-style-profiles.json` with master profile and built-ins:

```json
{
  "schemaVersion": "narrative-style-profiles.v1",
  "masterProfile": {
    "id": "advanced_india_seo_editorial_strategist",
    "label": "Advanced India SEO Editorial Strategist",
    "marketFocus": "India",
    "coreObjective": "Create deeply researched, human-sounding, publish-ready SEO page copy that can rank, earn clicks, satisfy reader intent, and guide the user toward the right action.",
    "expertise": [
      "Indian search behavior",
      "Google helpful content and E-E-A-T",
      "SERP pattern analysis",
      "content gap identification",
      "AI Overview-friendly answer structuring",
      "mobile-first readability",
      "conversion copy alignment",
      "source-backed claims"
    ]
  },
  "profiles": [
    {
      "id": "professional_compact_guide",
      "label": "Professional compact guide",
      "useWhen": "The reader needs clear, high-impact guidance without a long story.",
      "mustInclude": ["direct answer near the top", "source-backed claims", "clear next step"],
      "avoid": ["dramatic storytelling", "excessive adjectives", "sales-heavy phrasing"]
    },
    {
      "id": "story_led_blog",
      "label": "Story-led blog",
      "useWhen": "The reader needs context, empathy, and a natural journey into the topic.",
      "mustInclude": ["reader situation", "emotional context", "practical resolution"],
      "avoid": ["generic inspirational openings", "overlong anecdotes", "unsupported claims"]
    },
    {
      "id": "expert_explainer",
      "label": "Expert explainer",
      "useWhen": "The page needs stronger E-E-A-T and careful source-backed education.",
      "mustInclude": ["methodology", "definitions", "source-supported guidance"],
      "avoid": ["overconfident claims", "unsupported certainty"]
    },
    {
      "id": "comparison_review",
      "label": "Comparison/review",
      "useWhen": "The reader is comparing options and needs fair decision support.",
      "mustInclude": ["methodology", "criteria", "tradeoffs"],
      "avoid": ["unapproved competitor claims", "fake numeric precision"]
    },
    {
      "id": "customer_problem_narrative",
      "label": "Customer-problem narrative",
      "useWhen": "The page should start from a real reader concern and move toward a helpful next step.",
      "mustInclude": ["reader tension", "objection handling", "practical next step"],
      "avoid": ["shame language", "pressure without reason"]
    },
    {
      "id": "neutral_editorial_guide",
      "label": "Neutral editorial guide",
      "useWhen": "The page should feel balanced, calm, and non-salesy.",
      "mustInclude": ["balanced framing", "clear explanations", "source-aware claims"],
      "avoid": ["hard sell", "dramatic claims"]
    },
    {
      "id": "high_conversion_product_category",
      "label": "High-conversion product/category page",
      "useWhen": "The page is close to action and needs conversion clarity without losing trust.",
      "mustInclude": ["first-fold value", "CTA logic", "decision criteria"],
      "avoid": ["unsupported urgency", "CTA overload"]
    }
  ]
}
```

Create `config/page-type-modifiers.json`:

```json
{
  "schemaVersion": "page-type-modifiers.v1",
  "modifiers": [
    {
      "id": "guide_blog_modifier",
      "appliesTo": "guide_blog",
      "primaryGoal": "Educate, clarify, and build trust before suggesting a next step.",
      "writingRules": [
        "Start with the reader's problem or question.",
        "Explain concepts in plain language.",
        "Use examples and scenarios where useful.",
        "Avoid pushing the product too early."
      ],
      "ctaBehavior": "Soft CTA after meaningful education."
    },
    {
      "id": "comparison_modifier",
      "appliesTo": "comparison",
      "primaryGoal": "Help the reader compare options fairly and choose a next step.",
      "writingRules": [
        "State the comparison methodology.",
        "Use qualitative labels unless numeric scoring is requested.",
        "Explain tradeoffs clearly.",
        "Avoid copying competitor claims."
      ],
      "ctaBehavior": "CTA should follow decision criteria."
    },
    {
      "id": "product_category_modifier",
      "appliesTo": "product_category",
      "primaryGoal": "Match search intent, explain the category, and move qualified readers toward action.",
      "writingRules": [
        "Show useful first-fold value and primary CTA.",
        "Explain the problem or category before selling.",
        "Use benefit-led but source-safe copy.",
        "Keep the primary CTA consistent."
      ],
      "ctaBehavior": "Primary CTA visible early and repeated naturally near the end."
    }
  ]
}
```

Create `config/claim-rewrite-patterns.json`:

```json
{
  "schemaVersion": "claim-rewrite-patterns.v1",
  "patterns": [
    {
      "riskPattern": "cure|permanent cure|guaranteed cure",
      "riskType": "medical_or_outcome_guarantee",
      "defaultRewrite": "help you understand visible patterns and choose a more informed next step",
      "requiresApprovalIfKept": true
    },
    {
      "riskPattern": "best in india|number one|#1",
      "riskType": "unsupported_superlative",
      "defaultRewrite": "a useful option for readers comparing this category",
      "requiresApprovalIfKept": true
    },
    {
      "riskPattern": "works for everyone|suitable for all",
      "riskType": "overbroad_claim",
      "defaultRewrite": "may be suitable depending on the reader's needs, context, and available guidance",
      "requiresApprovalIfKept": true
    }
  ]
}
```

Create `config/image-prompt-profiles.json`:

```json
{
  "schemaVersion": "image-prompt-profiles.v1",
  "profiles": [
    {
      "id": "og_image",
      "label": "Open Graph image",
      "aspectRatio": "1.91:1",
      "rules": ["include brand logo", "keep crop safe", "avoid clutter", "use minimal embedded text"]
    },
    {
      "id": "in_page_explainer",
      "label": "In-page explainer",
      "aspectRatio": "4:3",
      "rules": ["support section comprehension", "avoid unsupported before-after claims", "prioritize clarity"]
    },
    {
      "id": "comparison_visual",
      "label": "Comparison visual",
      "aspectRatio": "16:9",
      "rules": ["show criteria clearly", "avoid competitor marks without approval"]
    },
    {
      "id": "process_visual",
      "label": "Process visual",
      "aspectRatio": "4:3",
      "rules": ["show steps simply", "fit mobile"]
    },
    {
      "id": "trust_visual",
      "label": "Trust visual",
      "aspectRatio": "4:3",
      "rules": ["support credibility", "avoid fake certifications"]
    },
    {
      "id": "product_category_visual",
      "label": "Product/category visual",
      "aspectRatio": "16:9",
      "rules": ["connect category to user problem", "keep CTA-adjacent visuals clear"]
    }
  ]
}
```

- [ ] **Step 4: Add schema files**

For each schema file, include Draft 2020-12 shape with `schemaVersion` as a required const. Example for `schemas/v2-page-state.schema.json`:

```json
{
  "$schema": "https://json-schema.org/draft/2020-12/schema",
  "$id": "https://example.com/schemas/v2-page-state.schema.json",
  "title": "V2 Page State",
  "type": "object",
  "required": ["schemaVersion", "status", "gates", "publishReady"],
  "properties": {
    "schemaVersion": { "const": "page-state.v2" },
    "status": { "type": "string", "enum": ["in_progress", "failed", "content_ready", "publish_ready"] },
    "gates": { "type": "object" },
    "publishReady": { "type": "boolean" }
  },
  "additionalProperties": true
}
```

Use the same structure for the other schema files with this exact mapping:

```text
schemas/v2-serp-research-ledger.schema.json -> serp-research-ledger.v2
schemas/v2-social-video-research.schema.json -> social-video-research.v2
schemas/v2-audience-definition.schema.json -> audience-definition.v2
schemas/v2-narrative-brief.schema.json -> narrative-brief.v2
schemas/v2-citation-set.schema.json -> citation-set.v2
schemas/v2-editorial-qa-report.schema.json -> editorial-qa-report.v2
schemas/v2-section-version-history.schema.json -> section-version-history.v2
```

Each schema must require `schemaVersion`. Add a small set of required fields that matches the artifact name, such as `analyzedSources` for SERP, `assets` for social/video, `awarenessStage` for audience, `primaryStyle` for narrative, `claims` for citation set, `sectionScores` for QA, and `entries` for version history.

- [ ] **Step 5: Run tests to verify pass**

Run: `npm test -- tests/v2-config-schemas.test.ts`

Expected: PASS for both tests.

- [ ] **Step 6: Run full validation**

Run: `npm run validate`

Expected: build succeeds and all tests pass.

- [ ] **Step 7: Commit**

```bash
git add config schemas tests/v2-config-schemas.test.ts
git commit -m "Add V2 config and schema defaults"
```

---

### Task 2: Add V2 Paths, Page State, And Prepare Templates

**Files:**
- Create: `src/lib/v2/types.ts`
- Create: `src/lib/v2/paths.ts`
- Create: `src/lib/v2/templates.ts`
- Create: `src/lib/v2/state.ts`
- Create: `tests/v2-prepare-page.test.ts`

- [ ] **Step 1: Write failing tests**

Create `tests/v2-prepare-page.test.ts`:

```ts
import assert from "node:assert/strict";
import { mkdtemp, readFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import path from "node:path";
import { test } from "node:test";
import { prepareV2PageWorkspace } from "../src/lib/v2/templates.js";

test("prepareV2PageWorkspace creates required V2 artifacts", async () => {
  const cwd = await mkdtemp(path.join(tmpdir(), "seo-v2-"));

  const result = await prepareV2PageWorkspace({
    cwd,
    clusterSlug: "acne-treatment",
    pageId: "P1",
    pageType: "product_category"
  });

  assert.equal(result.state.status, "in_progress");
  assert.equal(result.state.gates.serpResearch.status, "missing");
  assert.ok(result.createdFiles.some((file) => file.endsWith("page-state.json")));
  assert.ok(result.createdFiles.some((file) => file.endsWith("serp-research-ledger.json")));
  assert.ok(result.createdFiles.some((file) => file.endsWith("social-video-research.md")));
  assert.ok(result.createdFiles.some((file) => file.endsWith("section-version-history.json")));

  const stateJson = JSON.parse(await readFile(path.join(cwd, ".seo-agent-workspace", "v2", "page-packets", "acne-treatment", "P1", "page-state.json"), "utf8"));
  assert.equal(stateJson.schemaVersion, "page-state.v2");
  assert.equal(stateJson.status, "in_progress");
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npm test -- tests/v2-prepare-page.test.ts`

Expected: FAIL with missing module `src/lib/v2/templates.js`.

- [ ] **Step 3: Add V2 shared types**

Create `src/lib/v2/types.ts`:

```ts
export type V2GateStatus = "missing" | "draft" | "passed" | "passed_limited_confidence" | "failed";
export type V2PageStatus = "in_progress" | "failed" | "content_ready" | "publish_ready";

export interface V2GateState {
  status: V2GateStatus;
  machineChecksPassed: boolean;
  judgmentChecksPassed: boolean;
  blockingIssues: string[];
  advisoryIssues: string[];
}

export interface V2PageState {
  schemaVersion: "page-state.v2";
  status: V2PageStatus;
  clusterSlug: string;
  pageId: string;
  pageType: string;
  gates: {
    serpResearch: V2GateState;
    socialVideoResearch: V2GateState;
    audienceDefinition: V2GateState;
    narrativeBrief: V2GateState;
    citationSet: V2GateState;
  };
  repairAttempts: {
    automatic: number;
    manual: number;
    maxAutomatic: 1;
    maxManualWithoutUpstreamRevision: 1;
  };
  content: {
    packetGenerated: boolean;
    qaReportGenerated: boolean;
    minimumSectionScore?: number;
  };
  images: {
    manifestGenerated: boolean;
    requiredSlotsComplete: boolean;
  };
  publishReady: boolean;
  nextRecommendedAction: string;
  updatedAt: string;
}
```

- [ ] **Step 4: Add path helpers**

Create `src/lib/v2/paths.ts`:

```ts
import path from "node:path";
import { readConfig } from "../config.js";

export async function getV2PageDir(cwd: string, clusterSlug: string, pageId: string): Promise<string> {
  const config = await readConfig(cwd);
  return path.join(cwd, config.workspace_path, "v2", "page-packets", clusterSlug, pageId);
}

export function v2ArtifactPath(pageDir: string, fileName: string): string {
  return path.join(pageDir, fileName);
}
```

- [ ] **Step 5: Add state helpers**

Create `src/lib/v2/state.ts`:

```ts
import type { V2GateState, V2PageState } from "./types.js";

export function missingGate(): V2GateState {
  return {
    status: "missing",
    machineChecksPassed: false,
    judgmentChecksPassed: false,
    blockingIssues: ["Artifact has not been completed."],
    advisoryIssues: []
  };
}

export function createInitialV2PageState(input: {
  clusterSlug: string;
  pageId: string;
  pageType: string;
  updatedAt?: string;
}): V2PageState {
  return {
    schemaVersion: "page-state.v2",
    status: "in_progress",
    clusterSlug: input.clusterSlug,
    pageId: input.pageId,
    pageType: input.pageType,
    gates: {
      serpResearch: missingGate(),
      socialVideoResearch: missingGate(),
      audienceDefinition: missingGate(),
      narrativeBrief: missingGate(),
      citationSet: missingGate()
    },
    repairAttempts: {
      automatic: 0,
      manual: 0,
      maxAutomatic: 1,
      maxManualWithoutUpstreamRevision: 1
    },
    content: {
      packetGenerated: false,
      qaReportGenerated: false
    },
    images: {
      manifestGenerated: false,
      requiredSlotsComplete: false
    },
    publishReady: false,
    nextRecommendedAction: "Complete the SERP research ledger.",
    updatedAt: input.updatedAt ?? new Date().toISOString()
  };
}
```

- [ ] **Step 6: Add template writer**

Create `src/lib/v2/templates.ts` with `prepareV2PageWorkspace`. It should:

- Create page dir.
- Write `page-state.json`.
- Write JSON and Markdown seed files for the five gates.
- Write empty `section-version-history.json/md`.
- Return `createdFiles` and `state`.

Use `mkdir` and `writeFile` from `node:fs/promises`.

- [ ] **Step 7: Run tests to verify pass**

Run: `npm test -- tests/v2-prepare-page.test.ts`

Expected: PASS.

- [ ] **Step 8: Run full validation**

Run: `npm run validate`

Expected: build succeeds and all tests pass.

- [ ] **Step 9: Commit**

```bash
git add src/lib/v2 tests/v2-prepare-page.test.ts
git commit -m "Add V2 page preparation artifacts"
```

---

### Task 3: Implement Mandatory Gate Validators

**Files:**
- Create: `src/lib/v2/gates.ts`
- Test: `tests/v2-gates.test.ts`

- [ ] **Step 1: Write failing tests**

Create tests for:

- SERP gate passes only with 10 meaningful extracted sources.
- SERP gate fails when capped source types exceed 2.
- Social/video gate passes with 7 attempted and 5 reviewed.
- Social/video gate can pass with limited confidence when fewer than 5 are accessible and failure reasons are logged.
- Audience gate requires awareness stage, takeaway, barriers, and CTA connection.
- Narrative gate requires primary style, opening angle, brand POV, and section direction.
- Citation gate fails when high/critical claims lack source support.

Use small object literals rather than fixtures.

- [ ] **Step 2: Run test to verify it fails**

Run: `npm test -- tests/v2-gates.test.ts`

Expected: FAIL with missing `validateSerpResearchGate`.

- [ ] **Step 3: Add gate result type and SERP validator**

In `src/lib/v2/gates.ts`:

```ts
export interface V2GateValidationResult {
  status: "passed" | "passed_limited_confidence" | "failed";
  machineChecksPassed: boolean;
  judgmentChecksPassed: boolean;
  blockingIssues: string[];
  advisoryIssues: string[];
}

export function validateSerpResearchGate(ledger: {
  analyzedSources: Array<{
    url: string;
    sourceType: string;
    extractionStatus: string;
    bodySummary?: string;
    h2h3Outline?: string[];
  }>;
  contentGapSynthesis?: {
    gaps?: string[];
    differentiationOpportunities?: string[];
  };
  judgmentChecks?: { passed: boolean; notes?: string };
}): V2GateValidationResult {
  const blockingIssues: string[] = [];
  const meaningful = ledger.analyzedSources.filter((source) =>
    source.url &&
    source.extractionStatus === "success" &&
    Boolean(source.bodySummary && source.bodySummary.trim().length >= 80) &&
    Array.isArray(source.h2h3Outline) &&
    source.h2h3Outline.length > 0
  );

  const cappedTypes = new Set(["forum", "directory", "marketplace", "community", "aggregator", "reddit", "quora"]);
  const cappedCount = meaningful.filter((source) => cappedTypes.has(source.sourceType)).length;

  if (meaningful.length < 10) blockingIssues.push("SERP research requires 10 meaningful webpage extractions.");
  if (cappedCount > 2) blockingIssues.push("At most 2 analyzed SERP sources can be capped source types.");
  if (!ledger.contentGapSynthesis?.gaps?.length) blockingIssues.push("Content gap synthesis must include gaps.");
  if (!ledger.contentGapSynthesis?.differentiationOpportunities?.length) blockingIssues.push("Content gap synthesis must include differentiation opportunities.");
  if (!ledger.judgmentChecks?.passed) blockingIssues.push("Host-agent judgment checks must pass.");

  return {
    status: blockingIssues.length === 0 ? "passed" : "failed",
    machineChecksPassed: blockingIssues.filter((issue) => issue !== "Host-agent judgment checks must pass.").length === 0,
    judgmentChecksPassed: Boolean(ledger.judgmentChecks?.passed),
    blockingIssues,
    advisoryIssues: []
  };
}
```

- [ ] **Step 4: Add remaining validators**

Add these exported functions:

```ts
export function validateSocialVideoResearchGate(research: {
  assets: Array<{ id: string; accessStatus: "reviewed" | "inaccessible"; failureReason?: string }>;
  insights: string[];
  judgmentChecks?: { passed: boolean; notes?: string };
}): V2GateValidationResult;

export function validateAudienceDefinitionGate(audience: {
  targetCohort?: string;
  awarenessStage?: string;
  readerTakeaway?: string;
  objections?: string[];
  ctaConnection?: string;
  judgmentChecks?: { passed: boolean; notes?: string };
}): V2GateValidationResult;

export function validateNarrativeBriefGate(brief: {
  primaryStyle?: string;
  secondaryFlavor?: string;
  openingAngle?: string;
  brandPov?: string;
  pagePromise?: string;
  sectionDirections?: Array<{ sectionId: string; direction: string }>;
  judgmentChecks?: { passed: boolean; notes?: string };
}): V2GateValidationResult;

export function validateCitationSetGate(citationSet: {
  claims: Array<{ claim: string; strength: "low" | "medium" | "high" | "critical"; sourceUrl?: string; approvalStatus?: "approved" | "not_required" | "missing" }>;
  judgmentChecks?: { passed: boolean; notes?: string };
}): V2GateValidationResult;

export function allMandatoryGatesPassed(results: V2GateValidationResult[]): boolean;
```

Make each function return `V2GateValidationResult` and use exact blocking messages that tests assert.

- [ ] **Step 5: Run tests to verify pass**

Run: `npm test -- tests/v2-gates.test.ts`

Expected: PASS.

- [ ] **Step 6: Run full validation**

Run: `npm run validate`

Expected: build succeeds and all tests pass.

- [ ] **Step 7: Commit**

```bash
git add src/lib/v2/gates.ts tests/v2-gates.test.ts
git commit -m "Add V2 mandatory gate validators"
```

---

### Task 4: Implement Heuristic Validators

**Files:**
- Create: `src/lib/v2/heuristics.ts`
- Test: `tests/v2-heuristics.test.ts`

- [ ] **Step 1: Write failing tests**

Create tests that assert:

- Placeholder text is detected.
- Generic opening phrase is hard-fail when in `S1_hero` or `S2_quick_answer`.
- Generic phrase outside opening triggers repair issue.
- Brand/page banned phrase is hard fail.
- Critical claim pattern can produce a safer rewrite suggestion.
- Source excerpts and failed excerpts are truncated to configured limits.

- [ ] **Step 2: Run test to verify it fails**

Run: `npm test -- tests/v2-heuristics.test.ts`

Expected: FAIL with missing heuristic module.

- [ ] **Step 3: Implement placeholder and phrase checks**

In `src/lib/v2/heuristics.ts`, export:

```ts
export interface HeuristicIssue {
  severity: "hard_fail" | "repair" | "advisory";
  code: string;
  sectionId?: string;
  message: string;
  matchedText?: string;
}

export function detectPlaceholderCopy(markdown: string): HeuristicIssue[] {
  const patterns = [/TBD/i, /TODO/i, /replace this/i, /lorem ipsum/i, /add reference here/i, /editable scaffold/i];
  return patterns
    .filter((pattern) => pattern.test(markdown))
    .map((pattern) => ({
      severity: "hard_fail" as const,
      code: "placeholder_copy",
      message: `Placeholder pattern detected: ${pattern.source}`
    }));
}
```

Add `detectGenericPhraseIssues`, `detectBannedPhraseIssues`, `suggestClaimRewrites`, and `truncateExcerpt`.

- [ ] **Step 4: Run tests to verify pass**

Run: `npm test -- tests/v2-heuristics.test.ts`

Expected: PASS.

- [ ] **Step 5: Run full validation**

Run: `npm run validate`

Expected: build succeeds and all tests pass.

- [ ] **Step 6: Commit**

```bash
git add src/lib/v2/heuristics.ts tests/v2-heuristics.test.ts
git commit -m "Add V2 editorial heuristic validators"
```

---

### Task 5: Build Editorial QA And Section Threshold Logic

**Files:**
- Create: `src/lib/v2/qa.ts`
- Test: `tests/v2-qa.test.ts`

- [ ] **Step 1: Write failing tests**

Create tests that assert:

- QA passes when all gates pass and every section score is at least 70.
- QA fails when any section remains below 70 after allowed repair.
- Auto-repair summary appears only when repair happened.
- Section lost-points reasons are preserved.
- Overall score and five dimension subscores are rendered.
- Hard gate failure prevents final packet eligibility.

- [ ] **Step 2: Run test to verify it fails**

Run: `npm test -- tests/v2-qa.test.ts`

Expected: FAIL with missing `buildEditorialQaReport`.

- [ ] **Step 3: Implement QA report builder**

Create `src/lib/v2/qa.ts` with:

```ts
export interface SectionQaScore {
  sectionId: string;
  heading: string;
  score: number;
  status: "Strong" | "Pass" | "Advisory" | "Needs repair" | "Hard fail";
  whyPointsWereLost: string;
  notes: string;
}

export interface EditorialQaReportInput {
  overallScore: number;
  dimensionScores: {
    researchGrounding: number;
    narrativeFit: number;
    humanReadability: number;
    seoCompleteness: number;
    conversionClarity: number;
  };
  hardGateResults: Array<{ gate: string; status: string; blockingIssues: string[] }>;
  sectionScores: SectionQaScore[];
  autoRepairSummary?: string[];
  recommendations: string[];
}

export function sectionStatus(score: number): SectionQaScore["status"] {
  if (score >= 90) return "Strong";
  if (score >= 80) return "Pass";
  if (score >= 70) return "Advisory";
  return "Needs repair";
}

export function canGenerateFinalPacket(input: EditorialQaReportInput): boolean {
  const hardGateFailed = input.hardGateResults.some((gate) => gate.status !== "passed" && gate.status !== "passed_limited_confidence");
  const sectionFailed = input.sectionScores.some((section) => section.score < 70);
  return !hardGateFailed && !sectionFailed;
}
```

Add Markdown renderer `renderEditorialQaReportMarkdown`.

- [ ] **Step 4: Run tests to verify pass**

Run: `npm test -- tests/v2-qa.test.ts`

Expected: PASS.

- [ ] **Step 5: Run full validation**

Run: `npm run validate`

Expected: build succeeds and all tests pass.

- [ ] **Step 6: Commit**

```bash
git add src/lib/v2/qa.ts tests/v2-qa.test.ts
git commit -m "Add V2 editorial QA scoring"
```

---

### Task 6: Add V2 CLI Prepare, Status, Validate-Gates, And QA Commands

**Files:**
- Create: `src/cli/v2.ts`
- Modify: `src/cli/index.ts`
- Test: `tests/v2-cli.test.ts`

- [ ] **Step 1: Write failing CLI tests**

Create `tests/v2-cli.test.ts` using `spawnSync` from `node:child_process` and a temp cwd. Assert:

- `seo-agent v2 prepare-page --cluster acne-treatment --page-id P1 --page-type product_category` creates artifacts.
- `seo-agent v2 status --cluster acne-treatment --page-id P1` prints `in_progress`.
- `seo-agent v2 validate-gates --cluster acne-treatment --page-id P1` reports missing gates and exits with non-zero.

- [ ] **Step 2: Run test to verify it fails**

Run: `npm test -- tests/v2-cli.test.ts`

Expected: FAIL because `v2` is an unknown command.

- [ ] **Step 3: Add CLI router**

Create `src/cli/v2.ts`:

```ts
import { readFile } from "node:fs/promises";
import path from "node:path";
import { prepareV2PageWorkspace } from "../lib/v2/templates.js";
import { getV2PageDir } from "../lib/v2/paths.js";

function argValue(args: string[], name: string): string | undefined {
  const index = args.indexOf(name);
  return index >= 0 ? args[index + 1] : undefined;
}

export async function runV2Command(args: string[]): Promise<void> {
  const [subcommand, ...rest] = args;
  const clusterSlug = argValue(rest, "--cluster");
  const pageId = argValue(rest, "--page-id");
  const pageType = argValue(rest, "--page-type") ?? "product_category";

  if (!clusterSlug || !pageId) {
    console.error("Usage: seo-agent v2 <command> --cluster <slug> --page-id <id>");
    process.exitCode = 1;
    return;
  }

  if (subcommand === "prepare-page") {
    const result = await prepareV2PageWorkspace({ cwd: process.cwd(), clusterSlug, pageId, pageType });
    console.log(`Prepared V2 page workspace: ${result.pageDir}`);
    console.log("Next: complete the SERP research ledger.");
    return;
  }

  if (subcommand === "status") {
    const pageDir = await getV2PageDir(process.cwd(), clusterSlug, pageId);
    const state = JSON.parse(await readFile(path.join(pageDir, "page-state.json"), "utf8"));
    console.log(`Status: ${state.status}`);
    console.log(`Publish ready: ${state.publishReady}`);
    console.log(`Next: ${state.nextRecommendedAction}`);
    return;
  }

  console.error(`Unknown v2 command: ${subcommand}`);
  process.exitCode = 1;
}
```

Modify `src/cli/index.ts`:

```ts
import { runV2Command } from "./v2.js";
```

and route:

```ts
if (command === "v2") {
  await runV2Command([subcommand, ...args].filter((item): item is string => Boolean(item)));
  return;
}
```

- [ ] **Step 4: Add validate-gates and qa command handling**

Extend `runV2Command` to:

- `validate-gates`: read all gate artifacts and print passed/missing/failed statuses. Non-zero if any mandatory gate is not passed.
- `qa`: read/write `editorial-qa-report.md/json` from prepared QA inputs if present, or print missing QA input message.

- [ ] **Step 5: Run tests to verify pass**

Run: `npm test -- tests/v2-cli.test.ts`

Expected: PASS.

- [ ] **Step 6: Run full validation**

Run: `npm run validate`

Expected: build succeeds and all tests pass.

- [ ] **Step 7: Commit**

```bash
git add src/cli/v2.ts src/cli/index.ts tests/v2-cli.test.ts
git commit -m "Add V2 CLI preparation and status commands"
```

---

### Task 7: Add V2 Image Readiness And Publish-Ready State

**Files:**
- Create: `src/lib/v2/image-readiness.ts`
- Modify: `src/lib/v2/state.ts`
- Test: `tests/v2-image-readiness.test.ts`

- [ ] **Step 1: Write failing tests**

Assert:

- `IMG_OG` and `IMG_HERO` are required.
- `IMG_HERO` maps to `S1_hero`.
- OG image is not counted against 3-5 in-page image target.
- Prompt-only required image counts only when accepted by user.
- `content_ready` can exist before image manifest.
- `publish_ready` requires image manifest and required image slots complete or prompt-only accepted.

- [ ] **Step 2: Run test to verify it fails**

Run: `npm test -- tests/v2-image-readiness.test.ts`

Expected: FAIL with missing module.

- [ ] **Step 3: Implement image readiness**

Create `src/lib/v2/image-readiness.ts`:

```ts
export type V2ImageAssetType = "generated" | "fetched_external" | "brand_asset" | "prompt_only" | "reserved";

export interface V2ImageManifestItem {
  id: string;
  assetType: V2ImageAssetType;
  sectionId?: string;
  promptOnlyAcceptedByUser?: boolean;
}

export function requiredImageIds(): string[] {
  return ["IMG_OG", "IMG_HERO"];
}

export function imageSlotComplete(item: V2ImageManifestItem): boolean {
  if (item.assetType === "prompt_only") return item.promptOnlyAcceptedByUser === true;
  return item.assetType === "generated" || item.assetType === "fetched_external" || item.assetType === "brand_asset";
}

export function requiredImagesComplete(items: V2ImageManifestItem[]): boolean {
  return requiredImageIds().every((id) => {
    const item = items.find((candidate) => candidate.id === id);
    return Boolean(item && imageSlotComplete(item));
  });
}
```

- [ ] **Step 4: Run tests to verify pass**

Run: `npm test -- tests/v2-image-readiness.test.ts`

Expected: PASS.

- [ ] **Step 5: Run full validation**

Run: `npm run validate`

Expected: build succeeds and all tests pass.

- [ ] **Step 6: Commit**

```bash
git add src/lib/v2/image-readiness.ts src/lib/v2/state.ts tests/v2-image-readiness.test.ts
git commit -m "Add V2 image readiness rules"
```

---

### Task 8: Add Section Version History And Refresh Packets

**Files:**
- Create: `src/lib/v2/refresh.ts`
- Modify: `src/lib/v2/templates.ts`
- Test: `tests/v2-refresh-version-history.test.ts`

- [ ] **Step 1: Write failing tests**

Assert:

- Empty section history is created at page setup.
- Version history entries truncate excerpts to 280 characters.
- `refresh_update` event is accepted.
- Refresh packet includes only changed sections and update rationale.
- Refresh QA applies section threshold only to changed sections.

- [ ] **Step 2: Run test to verify it fails**

Run: `npm test -- tests/v2-refresh-version-history.test.ts`

Expected: FAIL with missing refresh module.

- [ ] **Step 3: Implement version history helpers**

Create helper:

```ts
export function truncateVersionExcerpt(value: string): string {
  return value.length <= 280 ? value : `${value.slice(0, 277)}...`;
}
```

Create `createVersionHistoryEntry` with fields:

- `sectionId`
- `event`
- `summary`
- `reason`
- `beforeHash`
- `afterHash`
- `beforeExcerpt`
- `afterExcerpt`
- `changedBy`
- `timestamp`

- [ ] **Step 4: Implement refresh packet builder**

Create `buildRefreshPacket` that accepts changed sections and returns JSON plus Markdown with:

- Page ID.
- Trigger/reason.
- Changed sections.
- Recommended edits.
- Citation changes.
- QA status.
- Version history summary.

- [ ] **Step 5: Run tests to verify pass**

Run: `npm test -- tests/v2-refresh-version-history.test.ts`

Expected: PASS.

- [ ] **Step 6: Run full validation**

Run: `npm run validate`

Expected: build succeeds and all tests pass.

- [ ] **Step 7: Commit**

```bash
git add src/lib/v2/refresh.ts src/lib/v2/templates.ts tests/v2-refresh-version-history.test.ts
git commit -m "Add V2 refresh packets and section history"
```

---

### Task 9: Add Debug Bundle

**Files:**
- Create: `src/lib/v2/debug-bundle.ts`
- Modify: `src/cli/v2.ts`
- Test: `tests/v2-debug-bundle.test.ts`

- [ ] **Step 1: Write failing tests**

Assert:

- Debug bundle Markdown lists page state, gate statuses, editor artifacts, and internal artifact paths.
- Large image binaries are not included by default.
- Image manifest paths are included when present.
- `debug-bundle.zip` is optional, but Markdown summary is always created.

- [ ] **Step 2: Run test to verify it fails**

Run: `npm test -- tests/v2-debug-bundle.test.ts`

Expected: FAIL with missing debug bundle module.

- [ ] **Step 3: Implement debug bundle summary**

Create `src/lib/v2/debug-bundle.ts`:

```ts
export interface DebugBundleInput {
  pageDir: string;
  artifactPaths: string[];
  status: string;
  gateStatuses: Array<{ gate: string; status: string }>;
  nextRecommendedAction: string;
}

export function renderDebugBundleMarkdown(input: DebugBundleInput): string {
  const artifacts = input.artifactPaths.map((artifact) => `- ${artifact}`).join("\n");
  const gates = input.gateStatuses.map((gate) => `- ${gate.gate}: ${gate.status}`).join("\n");

  return `# V2 Debug Bundle

## Status

- Page directory: ${input.pageDir}
- Status: ${input.status}
- Next action: ${input.nextRecommendedAction}

## Gates

${gates || "- No gate statuses found."}

## Artifacts

${artifacts || "- No artifacts found."}
`;
}
```

Add CLI command `seo-agent v2 debug-bundle --cluster <slug> --page-id <id>`.

- [ ] **Step 4: Run tests to verify pass**

Run: `npm test -- tests/v2-debug-bundle.test.ts`

Expected: PASS.

- [ ] **Step 5: Run full validation**

Run: `npm run validate`

Expected: build succeeds and all tests pass.

- [ ] **Step 6: Commit**

```bash
git add src/lib/v2/debug-bundle.ts src/cli/v2.ts tests/v2-debug-bundle.test.ts
git commit -m "Add V2 debug bundle"
```

---

### Task 10: Add Workflow Docs And Adapter Commands

**Files:**
- Create: `workflows/19-v2-content-quality.md`
- Modify: `README.md`
- Modify: `AGENT.md`
- Modify: `adapters/gemini-cli/GEMINI.md`
- Create: `adapters/gemini-cli/commands/seo/v2.toml`
- Modify or create: `adapters/codex/skills/seo-page-creator/SKILL.md`
- Test: `tests/v2-docs-adapters.test.ts`

- [ ] **Step 1: Write failing docs/adapters test**

Create `tests/v2-docs-adapters.test.ts`:

```ts
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { test } from "node:test";

test("V2 workflow docs and adapters expose content quality flow", () => {
  const workflow = readFileSync("workflows/19-v2-content-quality.md", "utf8");
  const readme = readFileSync("README.md", "utf8");
  const gemini = readFileSync("adapters/gemini-cli/GEMINI.md", "utf8");
  const command = readFileSync("adapters/gemini-cli/commands/seo/v2.toml", "utf8");

  assert.match(workflow, /SERP Research Ledger Gate/);
  assert.match(workflow, /Social\\/Video Research Gate/);
  assert.match(workflow, /Narrative Brief Gate/);
  assert.match(readme, /seo-agent v2 prepare-page/);
  assert.match(gemini, /\/seo:v2/);
  assert.match(command, /Generate one V2 content-quality page workflow/);
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npm test -- tests/v2-docs-adapters.test.ts`

Expected: FAIL because workflow and Gemini command are missing.

- [ ] **Step 3: Write V2 workflow**

Create `workflows/19-v2-content-quality.md` with:

- Host-agent-first rule.
- Five mandatory gates.
- Top 10 meaningful SERP extraction requirement.
- Social/video attempt/review requirement.
- Narrative style and reader takeaway intake.
- QA, repair, section threshold, and no-hard-gate-override rules.
- Content-ready versus publish-ready status.
- Image workflow after content passes.

- [ ] **Step 4: Update README and AGENT**

Add V2 command summary:

```bash
seo-agent v2 prepare-page --cluster acne-treatment --page-id P1 --page-type product_category
seo-agent v2 status --cluster acne-treatment --page-id P1
seo-agent v2 validate-gates --cluster acne-treatment --page-id P1
seo-agent v2 qa --cluster acne-treatment --page-id P1
seo-agent v2 images --cluster acne-treatment --page-id P1
seo-agent v2 refresh --cluster acne-treatment --page-id P1
seo-agent v2 debug-bundle --cluster acne-treatment --page-id P1
```

Explain that normal editor-facing output is final page packet, editorial QA report, and image manifest.

- [ ] **Step 5: Add Gemini command**

Create `adapters/gemini-cli/commands/seo/v2.toml`:

```toml
description = "Generate one V2 content-quality page workflow."
prompt = """
Use AGENT.md and workflows/19-v2-content-quality.md.
Run the SEO Page Creator V2 flow for one page only.
Create/check required V2 artifacts with seo-agent v2 prepare-page.
Do live research as the host agent, fill the five mandatory gates, validate gates, generate final packet only when hard gates pass, then produce QA report and image manifest workflow.
Show the editor only the final page packet, editorial QA report, and image manifest unless debug artifacts are requested.
"""
```

Update `adapters/gemini-cli/GEMINI.md` to include `/seo:v2`.

- [ ] **Step 6: Run tests to verify pass**

Run: `npm test -- tests/v2-docs-adapters.test.ts`

Expected: PASS.

- [ ] **Step 7: Run full validation**

Run: `npm run validate`

Expected: build succeeds and all tests pass.

- [ ] **Step 8: Commit**

```bash
git add workflows/19-v2-content-quality.md README.md AGENT.md adapters tests/v2-docs-adapters.test.ts
git commit -m "Document V2 content quality workflow"
```

---

## Final Integration

- [ ] **Step 1: Run final validation**

Run: `npm run validate`

Expected: build succeeds and all tests pass.

- [ ] **Step 2: Verify CLI help includes V2**

Run: `npm run dev -- help`

Expected: help output includes `seo-agent v2 prepare-page`.

- [ ] **Step 3: Smoke-test V2 prepare/status**

Run:

```bash
npm run dev -- init
npm run dev -- v2 prepare-page --cluster acne-treatment --page-id P1 --page-type product_category
npm run dev -- v2 status --cluster acne-treatment --page-id P1
```

Expected:

- Workspace initializes.
- V2 page workspace is created.
- Status output shows `in_progress`.

- [ ] **Step 4: Commit final integration fixes if needed**

```bash
git add .
git commit -m "Finalize V2 content quality implementation"
```

- [ ] **Step 5: Push branch and fast-forward main when validated**

```bash
git push -u origin codex/v2-content-quality
git switch main
git pull --ff-only origin main
git merge --ff-only codex/v2-content-quality
git push origin main
```

## Self-Review Checklist

- Every V2 mandatory gate has at least one schema and one validator task.
- SERP top-25 replacement and 10 meaningful extraction requirement are covered.
- Social/video 7 attempted, 5 reviewed, limited confidence behavior is covered.
- Audience, narrative, citation, claim, and sensitivity requirements are covered.
- QA score, section score, threshold, auto-repair, and failure behavior are covered.
- Image status, `content_ready`, and `publish_ready` are covered.
- Refresh packets and section version history are covered.
- Debug bundle is covered.
- Docs and Gemini/Codex adapter updates are covered.
