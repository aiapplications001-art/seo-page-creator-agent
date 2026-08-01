# Category Discovery To Strategy Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add a validated category-discovery gate that selects an evidence-backed SEO cluster category, then seeds cluster strategy from discovered page opportunities instead of a fixed 3-page pattern.

**Architecture:** Add a focused `src/lib/category-discovery/` module for artifact paths, templates, hashing, validation, and strategy conversion. Keep `src/cli/category.ts` responsible for `category init` and `category validate`, and extend `src/cli/cluster.ts` only for `cluster plan --auto-discover`. Existing legacy `cluster plan --category` remains supported.

**Tech Stack:** TypeScript ESM, Node.js `node:test`, JSON Schema files for adapter/documentation contracts, deterministic file I/O with `node:fs/promises`, no new runtime dependencies.

## Global Constraints

- Category discovery creates `seed-universe-contract.json`, `cluster-portfolio-discovery.json`, and `cluster-boundary-contract.json` under a run folder such as `.seo-agent-workspace/category-discovery/cat-20260801-101500/`.
- Discovery artifacts are JSON-only and include summary statements for human review.
- Templates are schema-valid, default to failing verdicts, use empty values plus `fieldGuidance`, and never use realistic example content.
- Validators and hashes ignore `fieldGuidance`.
- Category discovery must not produce final page target keywords, final query clusters, page outlines, page copy, image prompts, final superiority components, CTA strategy, metadata, exact page titles, final Step 0A/0B contracts, or copied competitor architecture.
- Selected cluster strategy uses discovered opportunity proofs as strategy seeds.
- Existing explicit `seo-agent cluster plan --category "Acne Treatment" --company "ClearNest"` flow remains available.
- CLI does not perform live research in this version; Codex/Gemini/Antigravity adapters fill evidence-heavy artifacts.
- `cluster plan --auto-discover --run-id cat-20260801-101500` revalidates artifacts before strategy creation and refreshes `category-discovery.lock.json`.
- Discovery runs are editable until first `pass` or non-critical `pass_with_warnings`, then immutable by lock/hash.
- Category discovery does not require a clean git worktree.

---

## File Structure

- Create `src/lib/category-discovery/types.ts`: shared enums and interfaces for seed universe, portfolio, boundary, validation reports, locks, and strategy seed conversion.
- Create `src/lib/category-discovery/paths.ts`: workspace path helpers for discovery run folders and category files.
- Create `src/lib/category-discovery/hash.ts`: stable JSON normalization and SHA-256 hashing that strips `fieldGuidance`.
- Create `src/lib/category-discovery/templates.ts`: failing artifact template builders with empty values and field guidance.
- Create `src/lib/category-discovery/validation.ts`: deterministic validation for the three artifacts plus combined validation report/lock generation.
- Create `src/lib/category-discovery/strategy-seed.ts`: convert validated discovery artifacts into cluster strategy seed inputs and archive strategy versions.
- Create `src/cli/category.ts`: `category init` and `category validate` command handler.
- Modify `src/cli/index.ts`: route `seo-agent category init` and `seo-agent category validate`.
- Modify `src/cli/cluster.ts`: support `cluster plan --auto-discover --run-id cat-20260801-101500` and integrated init mode.
- Modify `src/lib/cluster-strategy.ts`: add optional discovery metadata, no-link strategy support for discovery-generated strategies, and discovered opportunity seeding.
- Create schemas:
  - `schemas/category-seed-universe-contract.schema.json`
  - `schemas/category-cluster-portfolio-discovery.schema.json`
  - `schemas/category-cluster-boundary-contract.schema.json`
  - `schemas/category-discovery-validation.schema.json`
  - `schemas/category-discovery-lock.schema.json`
- Modify `src/lib/workspace.ts`: include `category-discovery` workspace folder.
- Modify `workflows/13-cluster-strategy.md`, `README.md`, `AGENT.md`, `adapters/codex/skills/seo-page-creator/SKILL.md`, `adapters/gemini-cli/GEMINI.md`, `adapters/gemini-cli/commands/seo/help.toml`, `adapters/gemini-cli/commands/seo/page.toml`, and `adapters/antigravity/AGENTS.md`.
- Add tests:
  - `tests/category-discovery-schemas.test.ts`
  - `tests/category-discovery-templates.test.ts`
  - `tests/category-discovery-validation.test.ts`
  - `tests/category-cli.test.ts`
  - update `tests/cluster-cli.test.ts`
  - update `tests/cluster-strategy.test.ts`
  - update `tests/v2-docs-adapters.test.ts`

---

### Task 1: Category Discovery Contracts, Schemas, And Templates

**Files:**
- Create: `src/lib/category-discovery/types.ts`
- Create: `src/lib/category-discovery/paths.ts`
- Create: `src/lib/category-discovery/templates.ts`
- Create: `schemas/category-seed-universe-contract.schema.json`
- Create: `schemas/category-cluster-portfolio-discovery.schema.json`
- Create: `schemas/category-cluster-boundary-contract.schema.json`
- Create: `schemas/category-discovery-validation.schema.json`
- Create: `schemas/category-discovery-lock.schema.json`
- Create: `tests/category-discovery-schemas.test.ts`
- Create: `tests/category-discovery-templates.test.ts`
- Modify: `tests/v2-config-schemas.test.ts`

**Interfaces:**
- Produces:
  - `CATEGORY_DISCOVERY_SCHEMA_VERSION = "category-discovery.v1"`
  - `CATEGORY_DISCOVERY_ARTIFACTS`
  - `createCategoryDiscoveryTemplates(input: CategoryDiscoveryTemplateInput): CategoryDiscoveryTemplates`
  - `getCategoryDiscoveryPaths(workspaceRoot: string, runId: string): CategoryDiscoveryPaths`
- Consumes: none from later tasks.

- [ ] **Step 1: Write schema-id coverage test**

Add `tests/category-discovery-schemas.test.ts`:

```ts
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { test } from "node:test";

const json = (path: string) => JSON.parse(readFileSync(path, "utf8"));

test("category discovery schemas expose stable schema versions", () => {
  const expected = [
    ["schemas/category-seed-universe-contract.schema.json", "category-seed-universe-contract.v1"],
    ["schemas/category-cluster-portfolio-discovery.schema.json", "category-cluster-portfolio-discovery.v1"],
    ["schemas/category-cluster-boundary-contract.schema.json", "category-cluster-boundary-contract.v1"],
    ["schemas/category-discovery-validation.schema.json", "category-discovery-validation.v1"],
    ["schemas/category-discovery-lock.schema.json", "category-discovery-lock.v1"]
  ];

  for (const [file, schemaVersion] of expected) {
    const schema = json(file);
    assert.equal(schema.properties.schemaVersion.const, schemaVersion);
    assert.ok(Array.isArray(schema.required), `${file} should declare required fields`);
  }
});
```

- [ ] **Step 2: Write template behavior test**

Add `tests/category-discovery-templates.test.ts`:

```ts
import assert from "node:assert/strict";
import { test } from "node:test";
import { createCategoryDiscoveryTemplates } from "../src/lib/category-discovery/templates.js";

test("category discovery templates use failing verdicts and guidance without realistic examples", () => {
  const templates = createCategoryDiscoveryTemplates({
    runId: "cat-20260801-101500",
    createdAt: "2026-08-01T10:15:00.000Z",
    business: "Skincare guidance and product education",
    company: "MyMirror",
    market: "India",
    mode: "batch_growth",
    seeds: ["acne", "acne scars"],
    sites: ["https://mymirror.fit"],
    competitors: ["https://example-competitor.com"],
    references: [],
    imports: {
      searchConsole: ["./gsc.csv"],
      keywords: [],
      siteInventory: []
    }
  });

  assert.equal(templates.seedUniverse.verdict.status, "fail");
  assert.equal(templates.clusterPortfolio.verdict.status, "fail");
  assert.equal(templates.clusterBoundary.verdict.status, "fail");
  assert.equal(templates.seedUniverse.inputProvenance.originalUserInput, null);
  assert.equal(templates.seedUniverse.inputProvenance.business, "Skincare guidance and product education");
  assert.equal(templates.seedUniverse.fieldGuidance.selectedSeedUniverse.includes("broad"), true);
  assert.deepEqual(templates.clusterPortfolio.candidateClusters, []);
  assert.deepEqual(templates.clusterBoundary.includedSubareas, []);
});
```

- [ ] **Step 3: Run tests to verify they fail**

Run: `npm test -- tests/category-discovery-schemas.test.ts tests/category-discovery-templates.test.ts`

Expected: FAIL because files/modules do not exist.

- [ ] **Step 4: Create TypeScript contracts**

Create `src/lib/category-discovery/types.ts` with:

```ts
export const CATEGORY_DISCOVERY_SCHEMA_VERSION = "category-discovery.v1";

export type CategoryDiscoveryMode =
  | "batch_growth"
  | "authority_building"
  | "conversion_support"
  | "refresh_existing"
  | "market_entry";

export type VerdictStatus = "pass" | "pass_with_warnings" | "fail" | "ask_user";
export type SelectionConfidence = "low" | "medium" | "high";

export type SourceRole =
  | "business_profile"
  | "site_inventory"
  | "conversion_destination"
  | "search_demand"
  | "serp_competitor"
  | "competitor_sitemap"
  | "category_leader"
  | "audience_language"
  | "paa"
  | "autocomplete"
  | "related_search"
  | "video_signal"
  | "forum_signal"
  | "search_console"
  | "keyword_tool"
  | "internal_site_search";

export type ClusterType =
  | "condition_or_problem"
  | "product_or_solution"
  | "audience_or_segment"
  | "routine_or_process"
  | "comparison_or_alternative"
  | "location_or_market"
  | "use_case_or_situation"
  | "ingredient_or_component"
  | "myth_or_misconception"
  | "tool_or_template"
  | "service_or_conversion";

export type OpportunityRoute =
  | "ready_for_step0B"
  | "needs_more_discovery_before_step0B"
  | "needs_step0B_scope_decision"
  | "future_cluster"
  | "adjacent_cluster"
  | "too_narrow_page_opportunity"
  | "rejected";

export interface CategoryDiscoveryVerdict {
  status: VerdictStatus;
  action: string;
  warnings: string[];
  blockers: string[];
  repairAttemptsUsed: number;
  reason: string;
}

export interface SourceAttempt {
  sourceSurface: string;
  sourceRole: SourceRole;
  attemptedAt: string;
  accessStatus: "available" | "unavailable" | "not_applicable";
  reason: string;
  absenceImpact: "none" | "warning" | "blocker";
}

export interface CategorySourceRef {
  sourceRef: string;
  sourceRole: SourceRole;
  title?: string;
  url?: string;
  sourceUseReason?: string;
}

export interface LightweightOpportunityProof {
  opportunityName: string;
  distinctSearchProblem: string;
  distinctnessReason: string;
  evidenceRefs: string[];
  rawToNormalizedEvidence: Array<{
    rawDiscovery: string;
    sourceRef: string;
    normalizedTo: string;
    normalizationReason: string;
  }>;
  route: OpportunityRoute;
  pageTypeHint?: string;
}

export interface CategoryDiscoveryTemplateInput {
  runId: string;
  createdAt: string;
  business?: string;
  company?: string;
  market?: string;
  mode?: CategoryDiscoveryMode;
  seeds: string[];
  sites: string[];
  competitors: string[];
  references: string[];
  imports: {
    searchConsole: string[];
    keywords: string[];
    siteInventory: string[];
  };
}
```

- [ ] **Step 5: Create path helper**

Create `src/lib/category-discovery/paths.ts`:

```ts
import path from "node:path";

export interface CategoryDiscoveryPaths {
  runRoot: string;
  seedUniverse: string;
  clusterPortfolio: string;
  clusterBoundary: string;
  validation: string;
  lock: string;
}

export function getCategoryDiscoveryPaths(workspaceRoot: string, runId: string): CategoryDiscoveryPaths {
  const runRoot = path.join(workspaceRoot, "category-discovery", runId);
  return {
    runRoot,
    seedUniverse: path.join(runRoot, "seed-universe-contract.json"),
    clusterPortfolio: path.join(runRoot, "cluster-portfolio-discovery.json"),
    clusterBoundary: path.join(runRoot, "cluster-boundary-contract.json"),
    validation: path.join(runRoot, "category-discovery-validation.json"),
    lock: path.join(runRoot, "category-discovery.lock.json")
  };
}
```

- [ ] **Step 6: Create failing templates**

Create `src/lib/category-discovery/templates.ts`:

```ts
import type { CategoryDiscoveryTemplateInput } from "./types.js";

const failingVerdict = {
  status: "fail",
  action: "repair_category_discovery",
  warnings: [],
  blockers: ["Artifact template has not been filled with evidence."],
  repairAttemptsUsed: 0,
  reason: "Template requires live evidence and LLM/user completion before validation can pass."
} as const;

export function createCategoryDiscoveryTemplates(input: CategoryDiscoveryTemplateInput) {
  const sourceAttemptLog = [
    ...input.sites.map((site) => ({
      sourceSurface: site,
      sourceRole: "site_inventory" as const,
      attemptedAt: input.createdAt,
      accessStatus: "available" as const,
      reason: "Registered site evidence input for adapter review.",
      absenceImpact: "none" as const
    })),
    ...input.competitors.map((competitor) => ({
      sourceSurface: competitor,
      sourceRole: "serp_competitor" as const,
      attemptedAt: input.createdAt,
      accessStatus: "available" as const,
      reason: "Registered competitor evidence input for adapter review.",
      absenceImpact: "none" as const
    }))
  ];

  const common = {
    runId: input.runId,
    createdAt: input.createdAt
  };

  return {
    seedUniverse: {
      schemaVersion: "category-seed-universe-contract.v1",
      artifactType: "seed_universe_contract",
      ...common,
      inputProvenance: {
        originalUserInput: null,
        business: input.business ?? "",
        company: input.company ?? "",
        market: input.market ?? "",
        seeds: input.seeds,
        sites: input.sites,
        competitors: input.competitors,
        references: input.references,
        imports: input.imports
      },
      mode: input.mode ?? "batch_growth",
      modeDetectionReason: "",
      candidateSeedUniverses: [],
      selectedSeedUniverse: "",
      rejectedSeedUniverses: [],
      seedUniverseScorecard: {},
      evidenceBasis: [],
      seedUniverseBoundaries: { included: [], excluded: [] },
      seedUniverseSummaryStatement: "",
      sourceAttemptLog,
      completenessChecklist: {},
      verdict: failingVerdict,
      fieldGuidance: {
        selectedSeedUniverse: "Fill with the broad business/search universe, not the final SEO cluster.",
        evidenceBasis: "Add evidence refs from business/site/search/audience/competitor surfaces."
      }
    },
    clusterPortfolio: {
      schemaVersion: "category-cluster-portfolio-discovery.v1",
      artifactType: "cluster_portfolio_discovery",
      ...common,
      selectedSeedUniverse: "",
      candidateClusters: [],
      selectedClusterCandidate: null,
      rejectedCandidateRoutes: [],
      modeAdjustedScoreWeights: {},
      rawDiscoveryMappings: [],
      sourceRegistry: [],
      sourceAttemptLog,
      portfolioSummaryStatement: "",
      completenessChecklist: {},
      verdict: failingVerdict,
      fieldGuidance: {
        candidateClusters: "Create 5-10 SEO cluster category candidates from live evidence.",
        rawDiscoveryMappings: "Map messy phrases or source discoveries to normalized candidates."
      }
    },
    clusterBoundary: {
      schemaVersion: "category-cluster-boundary-contract.v1",
      artifactType: "cluster_boundary_contract",
      ...common,
      selectedClusterCategory: "",
      parentCategory: "",
      clusterType: "",
      clusterSearchProblem: "",
      sharedAudience: "",
      clusterPositioningStatement: "",
      includedSubareas: [],
      excludedSubareas: [],
      adjacentClusters: [],
      subclusterSignals: [],
      pageOpportunitySignals: [],
      needsStep0BDecision: [],
      clusterContentPromises: [],
      antiPromises: [],
      namingConfidence: "low",
      namingChecks: {},
      nameRejectedAlternatives: [],
      clusterViabilityStatement: "",
      batchSuitability: {
        suitableForBatch: false,
        maxConfidentPageCount: 0,
        reason: ""
      },
      siteEvidenceSummary: {
        evidenceRefs: [],
        businessSiteFitReason: "",
        cannibalizationRoute: ""
      },
      cannibalizationCheck: {},
      originalityCheck: {},
      selectionConfidence: "low",
      confidenceReasons: [],
      confidenceLimits: [],
      categoryDiscoverySummaryStatement: "",
      mustCarryForward: {},
      categoryDiscoveryOutputMustNotContain: [],
      completenessChecklist: {},
      verdict: failingVerdict,
      fieldGuidance: {
        selectedClusterCategory: "Fill with a noun-phrase SEO cluster category such as acne scar treatment.",
        clusterSearchProblem: "Explain the shared human problem across the cluster."
      }
    }
  };
}
```

- [ ] **Step 7: Create schema files**

Create the five JSON schema files with these minimum properties:

```json
{
  "$schema": "https://json-schema.org/draft/2020-12/schema",
  "type": "object",
  "properties": {
    "schemaVersion": { "const": "category-seed-universe-contract.v1" }
  },
  "required": ["schemaVersion"]
}
```

Use the matching const values for each schema file:

- `category-seed-universe-contract.v1`
- `category-cluster-portfolio-discovery.v1`
- `category-cluster-boundary-contract.v1`
- `category-discovery-validation.v1`
- `category-discovery-lock.v1`

- [ ] **Step 8: Add schema list coverage to existing config test**

In `tests/v2-config-schemas.test.ts`, append the five schema files to the `schemaIds` list with their version consts.

- [ ] **Step 9: Run tests**

Run: `npm test -- tests/category-discovery-schemas.test.ts tests/category-discovery-templates.test.ts tests/v2-config-schemas.test.ts`

Expected: PASS.

- [ ] **Step 10: Commit Task 1**

```bash
git add src/lib/category-discovery/types.ts src/lib/category-discovery/paths.ts src/lib/category-discovery/templates.ts schemas/category-*.schema.json tests/category-discovery-schemas.test.ts tests/category-discovery-templates.test.ts tests/v2-config-schemas.test.ts
git commit -m "feat: add category discovery contracts"
```

---

### Task 2: Hashing, Validation Report, And Lock File

**Files:**
- Create: `src/lib/category-discovery/hash.ts`
- Create: `src/lib/category-discovery/validation.ts`
- Create: `tests/category-discovery-validation.test.ts`

**Interfaces:**
- Consumes:
  - `getCategoryDiscoveryPaths(workspaceRoot, runId)`
  - template/artifact types from Task 1
- Produces:
  - `hashCategoryArtifact(value: unknown): string`
  - `stripFieldGuidance(value: unknown): unknown`
  - `validateCategoryDiscoveryRun(options: { workspaceRoot: string; runId: string; writeReport?: boolean; now?: string }): Promise<CategoryDiscoveryValidationResult>`
  - `readCategoryDiscoveryArtifacts(paths: CategoryDiscoveryPaths): Promise<CategoryDiscoveryArtifacts>`

- [ ] **Step 1: Write validation test**

Add `tests/category-discovery-validation.test.ts`:

```ts
import assert from "node:assert/strict";
import { mkdir, mkdtemp, readFile, writeFile } from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import { test } from "node:test";
import { createCategoryDiscoveryTemplates } from "../src/lib/category-discovery/templates.js";
import { getCategoryDiscoveryPaths } from "../src/lib/category-discovery/paths.js";
import { hashCategoryArtifact, stripFieldGuidance } from "../src/lib/category-discovery/hash.js";
import { validateCategoryDiscoveryRun } from "../src/lib/category-discovery/validation.js";

test("hashing ignores fieldGuidance", () => {
  const base = { value: "acne scar treatment", fieldGuidance: { value: "fill me" } };
  const changedGuidance = { value: "acne scar treatment", fieldGuidance: { value: "different" } };
  assert.deepEqual(stripFieldGuidance(base), { value: "acne scar treatment" });
  assert.equal(hashCategoryArtifact(base), hashCategoryArtifact(changedGuidance));
});

test("validation fails empty templates and writes report", async () => {
  const cwd = await mkdtemp(path.join(os.tmpdir(), "seo-category-validation-"));
  const workspaceRoot = path.join(cwd, ".seo-agent-workspace");
  const runId = "cat-20260801-101500";
  const paths = getCategoryDiscoveryPaths(workspaceRoot, runId);
  await mkdir(paths.runRoot, { recursive: true });
  const templates = createCategoryDiscoveryTemplates({
    runId,
    createdAt: "2026-08-01T10:15:00.000Z",
    business: "Skincare guidance",
    company: "MyMirror",
    market: "India",
    mode: "batch_growth",
    seeds: ["acne"],
    sites: ["https://mymirror.fit"],
    competitors: [],
    references: [],
    imports: { searchConsole: [], keywords: [], siteInventory: [] }
  });
  await writeFile(paths.seedUniverse, JSON.stringify(templates.seedUniverse, null, 2));
  await writeFile(paths.clusterPortfolio, JSON.stringify(templates.clusterPortfolio, null, 2));
  await writeFile(paths.clusterBoundary, JSON.stringify(templates.clusterBoundary, null, 2));

  const result = await validateCategoryDiscoveryRun({
    workspaceRoot,
    runId,
    writeReport: true,
    now: "2026-08-01T11:00:00.000Z"
  });

  assert.equal(result.combinedVerdict.status, "fail");
  assert.ok(result.combinedVerdict.blockers.includes("seed-universe-contract.json verdict is fail"));
  const report = JSON.parse(await readFile(paths.validation, "utf8"));
  assert.equal(report.schemaVersion, "category-discovery-validation.v1");
  assert.equal(report.combinedVerdict.status, "fail");
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npm test -- tests/category-discovery-validation.test.ts`

Expected: FAIL because modules are missing.

- [ ] **Step 3: Implement hashing**

Create `src/lib/category-discovery/hash.ts`:

```ts
import { createHash } from "node:crypto";

export function stripFieldGuidance(value: unknown): unknown {
  if (Array.isArray(value)) return value.map(stripFieldGuidance);
  if (value && typeof value === "object") {
    const entries = Object.entries(value as Record<string, unknown>)
      .filter(([key]) => key !== "fieldGuidance")
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([key, item]) => [key, stripFieldGuidance(item)]);
    return Object.fromEntries(entries);
  }
  return value;
}

export function hashCategoryArtifact(value: unknown): string {
  const normalized = JSON.stringify(stripFieldGuidance(value));
  return createHash("sha256").update(normalized).digest("hex");
}
```

- [ ] **Step 4: Implement validator**

Create `src/lib/category-discovery/validation.ts` with:

```ts
import { readFile, writeFile } from "node:fs/promises";
import type { CategoryDiscoveryPaths } from "./paths.js";
import { getCategoryDiscoveryPaths } from "./paths.js";
import { hashCategoryArtifact } from "./hash.js";
import type { CategoryDiscoveryVerdict } from "./types.js";

export interface CategoryDiscoveryArtifacts {
  seedUniverse: any;
  clusterPortfolio: any;
  clusterBoundary: any;
}

export interface CategoryDiscoveryValidationResult {
  schemaVersion: "category-discovery-validation.v1";
  runId: string;
  validatedAt: string;
  artifactHashes: {
    seedUniverseHash: string;
    clusterPortfolioHash: string;
    clusterBoundaryHash: string;
  };
  artifactVerdicts: {
    seedUniverse: CategoryDiscoveryVerdict;
    clusterPortfolio: CategoryDiscoveryVerdict;
    clusterBoundary: CategoryDiscoveryVerdict;
  };
  combinedVerdict: CategoryDiscoveryVerdict;
}

export async function readCategoryDiscoveryArtifacts(paths: CategoryDiscoveryPaths): Promise<CategoryDiscoveryArtifacts> {
  return {
    seedUniverse: JSON.parse(await readFile(paths.seedUniverse, "utf8")),
    clusterPortfolio: JSON.parse(await readFile(paths.clusterPortfolio, "utf8")),
    clusterBoundary: JSON.parse(await readFile(paths.clusterBoundary, "utf8"))
  };
}

export async function validateCategoryDiscoveryRun(options: {
  workspaceRoot: string;
  runId: string;
  writeReport?: boolean;
  now?: string;
}): Promise<CategoryDiscoveryValidationResult> {
  const paths = getCategoryDiscoveryPaths(options.workspaceRoot, options.runId);
  const artifacts = await readCategoryDiscoveryArtifacts(paths);
  const blockers = collectBlockers(artifacts);
  const warnings = collectWarnings(artifacts);
  const artifactHashes = {
    seedUniverseHash: hashCategoryArtifact(artifacts.seedUniverse),
    clusterPortfolioHash: hashCategoryArtifact(artifacts.clusterPortfolio),
    clusterBoundaryHash: hashCategoryArtifact(artifacts.clusterBoundary)
  };
  const status = blockers.length > 0
    ? "fail"
    : artifacts.clusterBoundary.selectionConfidence === "low"
      ? "pass_with_warnings"
      : "pass";
  const combinedVerdict: CategoryDiscoveryVerdict = {
    status,
    action: status === "pass" || status === "pass_with_warnings" ? "continue_to_cluster_strategy" : "repair_category_discovery",
    warnings: status === "pass_with_warnings" ? [...warnings, "Low selection confidence must carry forward."] : warnings,
    blockers,
    repairAttemptsUsed: Math.max(
      artifacts.seedUniverse.verdict?.repairAttemptsUsed ?? 0,
      artifacts.clusterPortfolio.verdict?.repairAttemptsUsed ?? 0,
      artifacts.clusterBoundary.verdict?.repairAttemptsUsed ?? 0
    ),
    reason: status === "fail"
      ? "Category discovery has blocking validation issues."
      : "Category discovery artifacts passed deterministic validation."
  };
  const result: CategoryDiscoveryValidationResult = {
    schemaVersion: "category-discovery-validation.v1",
    runId: options.runId,
    validatedAt: options.now ?? new Date().toISOString(),
    artifactHashes,
    artifactVerdicts: {
      seedUniverse: artifacts.seedUniverse.verdict,
      clusterPortfolio: artifacts.clusterPortfolio.verdict,
      clusterBoundary: artifacts.clusterBoundary.verdict
    },
    combinedVerdict
  };
  if (options.writeReport) {
    await writeFile(paths.validation, `${JSON.stringify(result, null, 2)}\n`, "utf8");
    if (status === "pass" || status === "pass_with_warnings") {
      await writeFile(paths.lock, `${JSON.stringify({
        schemaVersion: "category-discovery-lock.v1",
        runId: options.runId,
        lockedAt: result.validatedAt,
        selectedSeedUniverse: artifacts.seedUniverse.selectedSeedUniverse,
        selectedClusterCategory: artifacts.clusterBoundary.selectedClusterCategory,
        artifactPaths: {
          seedUniverse: paths.seedUniverse,
          clusterPortfolio: paths.clusterPortfolio,
          clusterBoundary: paths.clusterBoundary
        },
        artifactHashes,
        verdict: combinedVerdict
      }, null, 2)}\n`, "utf8");
    }
  }
  return result;
}
```

Also implement private `collectBlockers()` and `collectWarnings()` with deterministic checks for the design blockers:

```ts
function collectBlockers(artifacts: CategoryDiscoveryArtifacts): string[] {
  const blockers: string[] = [];
  for (const [name, artifact] of [
    ["seed-universe-contract.json", artifacts.seedUniverse],
    ["cluster-portfolio-discovery.json", artifacts.clusterPortfolio],
    ["cluster-boundary-contract.json", artifacts.clusterBoundary]
  ] as const) {
    if (!artifact.verdict || artifact.verdict.status === "fail") blockers.push(`${name} verdict is fail`);
    if (artifact.verdict?.status === "ask_user") blockers.push(`${name} asks user`);
  }
  const boundary = artifacts.clusterBoundary;
  if (!boundary.selectedClusterCategory) blockers.push("selectedClusterCategory is required");
  if (!boundary.clusterSearchProblem) blockers.push("clusterSearchProblem is required");
  if (!boundary.sharedAudience) blockers.push("sharedAudience is required");
  if (!boundary.clusterPositioningStatement) blockers.push("clusterPositioningStatement is required");
  if (!boundary.clusterViabilityStatement) blockers.push("clusterViabilityStatement is required");
  if ((boundary.includedSubareas ?? []).length < 5) blockers.push("includedSubareas requires at least 5 items");
  if ((boundary.excludedSubareas ?? []).length < 2) blockers.push("excludedSubareas requires at least 2 items");
  if ((boundary.clusterContentPromises ?? []).length < 3) blockers.push("clusterContentPromises requires at least 3 items");
  if (!boundary.batchSuitability || typeof boundary.batchSuitability.maxConfidentPageCount !== "number") blockers.push("batchSuitability is required");
  if (!boundary.mustCarryForward || Object.keys(boundary.mustCarryForward).length === 0) blockers.push("mustCarryForward is required");
  if (boundary.originalityCheck?.copiedCompetitorArchitecture === true) blockers.push("copied competitor architecture is not allowed");
  const mode = artifacts.seedUniverse.mode;
  const readyProofs = (boundary.pageOpportunitySignals ?? []).filter((item: any) => item.route === "ready_for_step0B");
  if (mode === "batch_growth" && readyProofs.length < 5) blockers.push("batch_growth requires at least 5 ready opportunity proofs");
  if ((boundary.pageOpportunitySignals ?? []).length < 3) blockers.push("at least 3 opportunity proofs are required");
  return blockers;
}

function collectWarnings(artifacts: CategoryDiscoveryArtifacts): string[] {
  const warnings: string[] = [];
  const unavailableAudience = (artifacts.clusterPortfolio.sourceAttemptLog ?? []).some((attempt: any) =>
    attempt.sourceRole === "audience_language" && attempt.accessStatus === "unavailable"
  );
  if (unavailableAudience) warnings.push("Audience-language evidence unavailable after attempts.");
  if (artifacts.clusterBoundary.selectionConfidence === "low") warnings.push("Selection confidence is low.");
  return warnings;
}
```

- [ ] **Step 5: Run validation test**

Run: `npm test -- tests/category-discovery-validation.test.ts`

Expected: PASS.

- [ ] **Step 6: Commit Task 2**

```bash
git add src/lib/category-discovery/hash.ts src/lib/category-discovery/validation.ts tests/category-discovery-validation.test.ts
git commit -m "feat: validate category discovery artifacts"
```

---

### Task 3: Category CLI Init And Validate

**Files:**
- Create: `src/cli/category.ts`
- Modify: `src/cli/index.ts`
- Modify: `src/lib/workspace.ts`
- Create: `tests/category-cli.test.ts`

**Interfaces:**
- Consumes:
  - `createCategoryDiscoveryTemplates(input)`
  - `getCategoryDiscoveryPaths(workspaceRoot, runId)`
  - `validateCategoryDiscoveryRun(options)`
- Produces:
  - `runCategoryCommand(args: string[]): Promise<void>`
  - `initCategoryDiscoveryFromWorkspace(options): Promise<CategoryDiscoveryInitOutputs>`
  - `validateCategoryDiscoveryFromWorkspace(options): Promise<CategoryDiscoveryValidateOutputs>`

- [ ] **Step 1: Write CLI test**

Add `tests/category-cli.test.ts`:

```ts
import test from "node:test";
import assert from "node:assert/strict";
import { mkdtemp, readFile } from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import { initCategoryDiscoveryFromWorkspace, validateCategoryDiscoveryFromWorkspace } from "../src/cli/category.js";
import { writeConfig } from "../src/lib/config.js";

test("category init writes three failing discovery templates", async () => {
  const cwd = await mkdtemp(path.join(os.tmpdir(), "seo-category-cli-"));
  await writeConfig(baseConfig(), cwd);

  const outputs = await initCategoryDiscoveryFromWorkspace({
    cwd,
    runId: "cat-test",
    business: "Skincare guidance",
    company: "MyMirror",
    market: "India",
    mode: "batch_growth",
    seeds: ["acne", "acne scars"],
    sites: ["https://mymirror.fit"],
    competitors: ["https://competitor.example"],
    references: [],
    imports: { searchConsole: ["./gsc.csv"], keywords: [], siteInventory: [] },
    now: "2026-08-01T10:15:00.000Z"
  });

  assert.equal(outputs.runId, "cat-test");
  const seed = JSON.parse(await readFile(outputs.seedUniversePath, "utf8"));
  const portfolio = JSON.parse(await readFile(outputs.clusterPortfolioPath, "utf8"));
  const boundary = JSON.parse(await readFile(outputs.clusterBoundaryPath, "utf8"));
  assert.equal(seed.verdict.status, "fail");
  assert.equal(portfolio.verdict.status, "fail");
  assert.equal(boundary.verdict.status, "fail");
  assert.equal(seed.inputProvenance.imports.searchConsole[0], "./gsc.csv");
});

test("category validate writes validation report for a run", async () => {
  const cwd = await mkdtemp(path.join(os.tmpdir(), "seo-category-cli-validate-"));
  await writeConfig(baseConfig(), cwd);
  await initCategoryDiscoveryFromWorkspace({
    cwd,
    runId: "cat-test",
    business: "Skincare guidance",
    company: "MyMirror",
    market: "India",
    mode: "batch_growth",
    seeds: ["acne"],
    sites: [],
    competitors: [],
    references: [],
    imports: { searchConsole: [], keywords: [], siteInventory: [] },
    now: "2026-08-01T10:15:00.000Z"
  });

  const outputs = await validateCategoryDiscoveryFromWorkspace({
    cwd,
    runId: "cat-test",
    now: "2026-08-01T11:00:00.000Z"
  });

  assert.equal(outputs.result.combinedVerdict.status, "fail");
  assert.equal(outputs.validationPath.endsWith("category-discovery-validation.json"), true);
});
```

Add a local `baseConfig()` helper copied from `tests/cluster-cli.test.ts`.

- [ ] **Step 2: Run test to verify it fails**

Run: `npm test -- tests/category-cli.test.ts`

Expected: FAIL because `src/cli/category.ts` does not exist.

- [ ] **Step 3: Implement category CLI helpers**

Create `src/cli/category.ts`:

```ts
import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import { readConfig } from "../lib/config.js";
import { getCategoryDiscoveryPaths } from "../lib/category-discovery/paths.js";
import { createCategoryDiscoveryTemplates } from "../lib/category-discovery/templates.js";
import { validateCategoryDiscoveryRun } from "../lib/category-discovery/validation.js";
import type { CategoryDiscoveryMode } from "../lib/category-discovery/types.js";

export interface CategoryDiscoveryInitOptions {
  cwd?: string;
  runId?: string;
  business?: string;
  company?: string;
  market?: string;
  mode?: CategoryDiscoveryMode;
  seeds: string[];
  sites: string[];
  competitors: string[];
  references: string[];
  imports: {
    searchConsole: string[];
    keywords: string[];
    siteInventory: string[];
  };
  now?: string;
}

export async function initCategoryDiscoveryFromWorkspace(options: CategoryDiscoveryInitOptions) {
  const cwd = options.cwd ?? process.cwd();
  const config = await readConfig(cwd);
  const workspaceRoot = path.resolve(cwd, config.workspace_path);
  const now = options.now ?? new Date().toISOString();
  const runId = options.runId ?? `cat-${now.replace(/[-:.]/g, "").slice(0, 15)}Z`;
  const paths = getCategoryDiscoveryPaths(workspaceRoot, runId);
  const templates = createCategoryDiscoveryTemplates({
    runId,
    createdAt: now,
    business: options.business,
    company: options.company,
    market: options.market ?? config.default_market,
    mode: options.mode,
    seeds: options.seeds,
    sites: options.sites,
    competitors: options.competitors,
    references: options.references,
    imports: options.imports
  });
  await mkdir(paths.runRoot, { recursive: true });
  await writeFile(paths.seedUniverse, `${JSON.stringify(templates.seedUniverse, null, 2)}\n`, "utf8");
  await writeFile(paths.clusterPortfolio, `${JSON.stringify(templates.clusterPortfolio, null, 2)}\n`, "utf8");
  await writeFile(paths.clusterBoundary, `${JSON.stringify(templates.clusterBoundary, null, 2)}\n`, "utf8");
  return {
    runId,
    runRoot: paths.runRoot,
    seedUniversePath: paths.seedUniverse,
    clusterPortfolioPath: paths.clusterPortfolio,
    clusterBoundaryPath: paths.clusterBoundary
  };
}

export async function validateCategoryDiscoveryFromWorkspace(options: { cwd?: string; runId: string; now?: string }) {
  const cwd = options.cwd ?? process.cwd();
  const config = await readConfig(cwd);
  const workspaceRoot = path.resolve(cwd, config.workspace_path);
  const paths = getCategoryDiscoveryPaths(workspaceRoot, options.runId);
  const result = await validateCategoryDiscoveryRun({
    workspaceRoot,
    runId: options.runId,
    writeReport: true,
    now: options.now
  });
  return { result, validationPath: paths.validation, lockPath: paths.lock };
}
```

Add `runCategoryCommand(args)` supporting:

- `init`
- `validate --run-id cat-20260801-101500`

Parse flags using local `readFlag`, `readCsvFlag`, and `readRepeatedFlag`.

- [ ] **Step 4: Wire CLI index**

Modify `src/cli/index.ts`:

```ts
import { runCategoryCommand } from "./category.js";
```

Update help text with:

```text
seo-agent category init --business "AI skincare guidance for Indian acne users" --company "MyMirror" --market India --seed "acne,acne scars"
seo-agent category validate --run-id cat-20260801-101500
seo-agent cluster plan --auto-discover --run-id cat-20260801-101500 --company "MyMirror"
```

Route:

```ts
if (command === "category") {
  await runCategoryCommand([subcommand, ...args].filter((item): item is string => Boolean(item)));
  return;
}
```

- [ ] **Step 5: Add workspace folder**

Modify `src/lib/workspace.ts` and add `"category-discovery"` to `workspaceFolders`.

- [ ] **Step 6: Run CLI tests**

Run: `npm test -- tests/category-cli.test.ts tests/workspace.test.ts`

Expected: PASS.

- [ ] **Step 7: Commit Task 3**

```bash
git add src/cli/category.ts src/cli/index.ts src/lib/workspace.ts tests/category-cli.test.ts
git commit -m "feat: add category discovery cli"
```

---

### Task 4: Strategy Bridge, Auto-Discover, And Versioning

**Files:**
- Create: `src/lib/category-discovery/strategy-seed.ts`
- Modify: `src/lib/cluster-strategy.ts`
- Modify: `src/cli/cluster.ts`
- Modify: `tests/cluster-strategy.test.ts`
- Modify: `tests/cluster-cli.test.ts`

**Interfaces:**
- Consumes:
  - `validateCategoryDiscoveryRun()`
  - `readCategoryDiscoveryArtifacts()`
  - `hashCategoryArtifact()`
- Produces:
  - `buildStrategySeedFromDiscovery(artifacts, validation): CategoryDiscoveryStrategySeed`
  - `archiveStrategyVersion(clusterRoot, timestamp): Promise<void>`
  - `generateClusterStrategy({ discoverySeed?: CategoryDiscoveryStrategySeed })`
  - `buildClusterStrategyFromDiscoveryRun(options)`

- [ ] **Step 1: Write strategy seed test**

Extend `tests/cluster-strategy.test.ts` with:

```ts
test("uses discovered opportunity proofs when discovery seed is provided", () => {
  const strategy = generateClusterStrategy({
    companyName: "MyMirror",
    categoryName: "Acne Scar Treatment",
    market: "India",
    metadata,
    seedKeywords: [],
    discoverySeed: {
      categoryDiscovery: {
        runId: "cat-test",
        seedUniverseHash: "seed-hash",
        clusterPortfolioHash: "portfolio-hash",
        clusterBoundaryHash: "boundary-hash",
        selectedSeedUniverse: "acne skincare",
        selectedClusterCategory: "acne scar treatment",
        clusterSearchProblem: "People want realistic help improving acne scars.",
        clusterPositioningStatement: "Realistic scar guidance without miracle claims.",
        clusterViabilityStatement: "The cluster has distinct prevention, myth, treatment, and scar-type opportunities.",
        boundarySummary: "Includes scar treatment and prevention; excludes general acne care.",
        warnings: []
      },
      pageOpportunities: [
        {
          opportunityName: "acne scar prevention",
          distinctSearchProblem: "User wants to stop active acne from becoming long-term scarring.",
          distinctnessReason: "Different from treating existing scars.",
          evidenceRefs: ["paa-1"],
          rawToNormalizedEvidence: [],
          route: "ready_for_step0B"
        }
      ],
      needsMoreDiscoveryBeforeStep0B: [],
      needsStep0BDecision: [],
      siteEvidenceSummary: {
        evidenceRefs: ["site-1"],
        businessSiteFitReason: "Existing acne content supports this cluster.",
        cannibalizationRoute: "continue"
      },
      batchSuitability: {
        suitableForBatch: true,
        maxConfidentPageCount: 8,
        reason: "Enough distinct proofs."
      }
    }
  });

  assert.equal(strategy.categoryDiscovery?.clusterBoundaryHash, "boundary-hash");
  assert.equal(strategy.pageOpportunities.length, 1);
  assert.equal(strategy.pageOpportunities[0].title, "acne scar prevention");
  assert.equal(strategy.pageOpportunities[0].targetIntent, "User wants to stop active acne from becoming long-term scarring.");
  assert.equal(strategy.internalLinkSuggestions.length, 0);
});
```

- [ ] **Step 2: Write auto-discover CLI test**

Extend `tests/cluster-cli.test.ts` with a test that creates valid-ish discovery artifacts directly, runs `buildClusterStrategyFromDiscoveryRun({ cwd, runId, companyName })`, and asserts:

- `strategy.json` exists under `clusters/acne-scar-treatment/`.
- `strategy.categoryDiscovery.clusterBoundaryHash` exists.
- first page opportunity comes from discovery proof.
- `strategy-versions/` contains a timestamped snapshot after a second run with changed discovery hash.

- [ ] **Step 3: Run tests to verify they fail**

Run: `npm test -- tests/cluster-strategy.test.ts tests/cluster-cli.test.ts`

Expected: FAIL because strategy seed support is missing.

- [ ] **Step 4: Implement strategy seed types**

In `src/lib/cluster-strategy.ts`, add:

```ts
export interface CategoryDiscoveryStrategySeed {
  categoryDiscovery: {
    runId: string;
    seedUniverseHash: string;
    clusterPortfolioHash: string;
    clusterBoundaryHash: string;
    selectedSeedUniverse: string;
    selectedClusterCategory: string;
    clusterSearchProblem: string;
    clusterPositioningStatement: string;
    clusterViabilityStatement: string;
    boundarySummary: string;
    warnings: string[];
  };
  pageOpportunities: Array<{
    opportunityName: string;
    distinctSearchProblem: string;
    distinctnessReason: string;
    evidenceRefs: string[];
    rawToNormalizedEvidence: unknown[];
    route: string;
    pageTypeHint?: string;
  }>;
  needsMoreDiscoveryBeforeStep0B: unknown[];
  needsStep0BDecision: unknown[];
  siteEvidenceSummary: unknown;
  batchSuitability: unknown;
}
```

Add `discoverySeed?: CategoryDiscoveryStrategySeed` to `GenerateClusterStrategyInput`.

Add optional fields to `ClusterStrategy`:

```ts
categoryDiscovery?: CategoryDiscoveryStrategySeed["categoryDiscovery"];
needsMoreDiscoveryBeforeStep0B?: unknown[];
needsStep0BDecision?: unknown[];
siteEvidenceSummary?: unknown;
batchSuitability?: unknown;
```

- [ ] **Step 5: Convert discovery opportunities**

In `generateClusterStrategy()`, when `input.discoverySeed` exists:

- category name comes from `input.discoverySeed.categoryDiscovery.selectedClusterCategory`
- `pageOpportunities` comes from a new `buildDiscoveredPageOpportunities()`
- `internalLinkSuggestions` is `[]`
- add discovery fields to returned strategy
- `nextPageSelection.recommendedPageId` is first discovered opportunity id

Implement `buildDiscoveredPageOpportunities()` so each ready proof becomes:

```ts
{
  id: `P${index + 1}`,
  title: proof.opportunityName,
  pageType: normalizePageTypeHint(proof.pageTypeHint),
  strategyCategory: "first_organic_wins",
  targetIntent: proof.distinctSearchProblem,
  primaryCtaGoal: "Step 4 must define the page-specific next action after Step 0B locks the page scope.",
  suggestedUrlSlug: slugify(proof.opportunityName),
  evidenceStrength: proof.evidenceRefs.length >= 2 ? "high" : "medium"
}
```

`normalizePageTypeHint()` maps hints containing `comparison` to `"comparison"`, hints containing `product` to `"product_category"`, and everything else to `"guide_blog"`.

- [ ] **Step 6: Implement discovery-to-strategy bridge**

Create `src/lib/category-discovery/strategy-seed.ts`:

```ts
import { mkdir, copyFile, stat } from "node:fs/promises";
import path from "node:path";
import type { CategoryDiscoveryStrategySeed } from "../cluster-strategy.js";
import type { CategoryDiscoveryArtifacts, CategoryDiscoveryValidationResult } from "./validation.js";

export function buildStrategySeedFromDiscovery(
  artifacts: CategoryDiscoveryArtifacts,
  validation: CategoryDiscoveryValidationResult
): CategoryDiscoveryStrategySeed {
  const boundary = artifacts.clusterBoundary;
  const ready = (boundary.pageOpportunitySignals ?? []).filter((item: any) => item.route === "ready_for_step0B");
  return {
    categoryDiscovery: {
      runId: validation.runId,
      seedUniverseHash: validation.artifactHashes.seedUniverseHash,
      clusterPortfolioHash: validation.artifactHashes.clusterPortfolioHash,
      clusterBoundaryHash: validation.artifactHashes.clusterBoundaryHash,
      selectedSeedUniverse: artifacts.seedUniverse.selectedSeedUniverse,
      selectedClusterCategory: boundary.selectedClusterCategory,
      clusterSearchProblem: boundary.clusterSearchProblem,
      clusterPositioningStatement: boundary.clusterPositioningStatement,
      clusterViabilityStatement: boundary.clusterViabilityStatement,
      boundarySummary: boundary.categoryDiscoverySummaryStatement,
      warnings: validation.combinedVerdict.warnings
    },
    pageOpportunities: ready,
    needsMoreDiscoveryBeforeStep0B: (boundary.pageOpportunitySignals ?? []).filter((item: any) => item.route === "needs_more_discovery_before_step0B"),
    needsStep0BDecision: boundary.needsStep0BDecision ?? [],
    siteEvidenceSummary: boundary.siteEvidenceSummary,
    batchSuitability: boundary.batchSuitability
  };
}

export async function archiveStrategyVersion(clusterRoot: string, timestamp: string): Promise<void> {
  const jsonPath = path.join(clusterRoot, "strategy.json");
  const markdownPath = path.join(clusterRoot, "strategy.md");
  const versionRoot = path.join(clusterRoot, "strategy-versions");
  await mkdir(versionRoot, { recursive: true });
  const safeTimestamp = timestamp.replace(/[-:.]/g, "").slice(0, 15) + "Z";
  try {
    await stat(jsonPath);
    await copyFile(jsonPath, path.join(versionRoot, `${safeTimestamp}-strategy.json`));
  } catch {}
  try {
    await stat(markdownPath);
    await copyFile(markdownPath, path.join(versionRoot, `${safeTimestamp}-strategy.md`));
  } catch {}
}
```

- [ ] **Step 7: Implement cluster auto-discover helper**

In `src/cli/cluster.ts`, add:

```ts
export async function buildClusterStrategyFromDiscoveryRun(options: {
  runId: string;
  companyName: string;
  cwd?: string;
  now?: string;
}): Promise<ClusterStrategyOutputs> {
  const cwd = options.cwd ?? process.cwd();
  const config = await readConfig(cwd);
  const workspaceRoot = path.resolve(cwd, config.workspace_path);
  const validation = await validateCategoryDiscoveryRun({
    workspaceRoot,
    runId: options.runId,
    writeReport: true,
    now: options.now
  });
  if (validation.combinedVerdict.status !== "pass" && validation.combinedVerdict.status !== "pass_with_warnings") {
    throw new Error(`Category discovery did not pass: ${validation.combinedVerdict.blockers.join("; ")}`);
  }
  const paths = getCategoryDiscoveryPaths(workspaceRoot, options.runId);
  const artifacts = await readCategoryDiscoveryArtifacts(paths);
  const seed = buildStrategySeedFromDiscovery(artifacts, validation);
  const metadata = await readMetadataIfPresent(workspaceRoot);
  const strategy = generateClusterStrategy({
    companyName: options.companyName,
    categoryName: seed.categoryDiscovery.selectedClusterCategory,
    market: config.default_market,
    metadata,
    seedKeywords: [],
    discoverySeed: seed
  });
  return writeClusterStrategy({ workspaceRoot, strategy, archiveExisting: true, now: options.now });
}
```

Refactor existing `buildClusterStrategyFromWorkspace()` to call `writeClusterStrategy()`.

Add CLI parsing:

```text
seo-agent cluster plan --auto-discover --run-id cat-20260801-101500 --company "MyMirror"
```

If `--auto-discover` is present without `--run-id`, create a run via `initCategoryDiscoveryFromWorkspace()` and print instructions that adapters must fill artifacts before validation.

- [ ] **Step 8: Update Markdown renderer**

In `renderClusterStrategyMarkdown()`, add a `## Category Discovery` section when `strategy.categoryDiscovery` exists. Include selected seed, selected cluster, viability statement, boundary summary, hashes, warnings, and no internal link guidance.

- [ ] **Step 9: Run tests**

Run: `npm test -- tests/cluster-strategy.test.ts tests/cluster-cli.test.ts`

Expected: PASS.

- [ ] **Step 10: Commit Task 4**

```bash
git add src/lib/cluster-strategy.ts src/lib/category-discovery/strategy-seed.ts src/cli/cluster.ts tests/cluster-strategy.test.ts tests/cluster-cli.test.ts
git commit -m "feat: seed cluster strategy from discovery"
```

---

### Task 5: Workflow, README, And Adapter Enforcement

**Files:**
- Modify: `workflows/13-cluster-strategy.md`
- Modify: `README.md`
- Modify: `AGENT.md`
- Modify: `adapters/codex/skills/seo-page-creator/SKILL.md`
- Modify: `adapters/gemini-cli/GEMINI.md`
- Modify: `adapters/gemini-cli/commands/seo/help.toml`
- Modify: `adapters/gemini-cli/commands/seo/page.toml`
- Modify: `adapters/antigravity/AGENTS.md`
- Modify: `tests/v2-docs-adapters.test.ts`

**Interfaces:**
- Consumes:
  - CLI commands from Task 3 and Task 4
  - artifact names and hashes from the spec
- Produces:
  - Adapter-readable instructions for category discovery
  - Test coverage that docs mention required artifacts and rules

- [ ] **Step 1: Write docs/adapters assertions**

Add assertions to `tests/v2-docs-adapters.test.ts`:

```ts
assert.match(clusterWorkflow, /Category Discovery Gate/);
assert.match(clusterWorkflow, /seed-universe-contract\.json/);
assert.match(clusterWorkflow, /cluster-portfolio-discovery\.json/);
assert.match(clusterWorkflow, /cluster-boundary-contract\.json/);
assert.match(clusterWorkflow, /clusterBoundaryHash/);
assert.match(clusterWorkflow, /needsStep0BDecision/);
assert.match(clusterWorkflow, /discovered opportunity proofs/);
assert.match(readme, /seo-agent category init/);
assert.match(readme, /seo-agent category validate/);
assert.match(readme, /cluster plan --auto-discover/);
assert.match(codexSkill, /Category Discovery Gate/);
assert.match(gemini, /Category Discovery Gate/);
assert.match(antigravity, /Category Discovery Gate/);
assert.match(antigravity, /Do not create final target keywords during category discovery/);
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npm test -- tests/v2-docs-adapters.test.ts`

Expected: FAIL until docs and adapters are updated.

- [ ] **Step 3: Update cluster workflow**

In `workflows/13-cluster-strategy.md`, add a `Category Discovery Gate` section near the top with:

- when discovery must run
- three artifact names
- `category-discovery-validation.json`
- `category-discovery.lock.json`
- seed universe vs selected cluster vs page opportunity distinction
- no page-level outputs during discovery
- Step 0A/0B must carry `clusterBoundaryHash`
- strategy uses discovered opportunity proofs

- [ ] **Step 4: Update README and AGENT**

In `README.md`, add a concise command example:

```bash
seo-agent category init --business "AI skincare guidance for Indian acne users" --company "MyMirror" --market India --seed "acne, acne scars"
seo-agent category validate --run-id cat-20260801-101500
seo-agent cluster plan --auto-discover --run-id cat-20260801-101500 --company "MyMirror"
```

Add a short explanation that adapters fill the discovery JSON with live evidence.

In `AGENT.md`, add that category discovery is the first gate when cluster/category is missing or broad.

- [ ] **Step 5: Update Codex/Gemini/Antigravity adapters**

Add rules to all adapters:

- run Category Discovery Gate before strategy when cluster missing/broad/vague/stale
- fill the three JSON artifacts
- use live evidence and sourceAttemptLog
- do not invent evidence
- do not create final target keywords during category discovery
- preserve `clusterBoundaryHash`
- use discovered opportunity proofs as strategy seed
- uncertain ideas go to `needsStep0BDecision`
- Step 0B owns final scope/exclusions

- [ ] **Step 6: Run docs/adapters test**

Run: `npm test -- tests/v2-docs-adapters.test.ts`

Expected: PASS.

- [ ] **Step 7: Commit Task 5**

```bash
git add workflows/13-cluster-strategy.md README.md AGENT.md adapters/codex/skills/seo-page-creator/SKILL.md adapters/gemini-cli/GEMINI.md adapters/gemini-cli/commands/seo/help.toml adapters/gemini-cli/commands/seo/page.toml adapters/antigravity/AGENTS.md tests/v2-docs-adapters.test.ts
git commit -m "docs: add category discovery adapter rules"
```

---

### Task 6: Final Verification And Regression Sweep

**Files:**
- Modify only if verification reveals a real defect in previous tasks.

**Interfaces:**
- Consumes all prior tasks.
- Produces a verified local implementation ready for user review and later git deployment.

- [ ] **Step 1: Run focused test set**

Run:

```bash
npm test -- \
  tests/category-discovery-schemas.test.ts \
  tests/category-discovery-templates.test.ts \
  tests/category-discovery-validation.test.ts \
  tests/category-cli.test.ts \
  tests/cluster-strategy.test.ts \
  tests/cluster-cli.test.ts \
  tests/v2-docs-adapters.test.ts \
  tests/v2-config-schemas.test.ts
```

Expected: PASS.

- [ ] **Step 2: Run full validation**

Run:

```bash
npm run validate
```

Expected: PASS.

- [ ] **Step 3: Manual CLI smoke test**

Run:

```bash
tmpdir=$(mktemp -d)
cp .seo-agent.config.example.json "$tmpdir/.seo-agent.config.json"
node --import tsx src/cli/index.ts category init --business "AI skincare guidance for Indian acne users" --company "MyMirror" --market India --seed "acne, acne scars" --site https://mymirror.fit --run-id cat-smoke
node --import tsx src/cli/index.ts category validate --run-id cat-smoke
```

Expected:

- `category init` prints the run folder and three artifact paths.
- `category validate` prints a failing validation report for the unfilled templates.
- The command does not crash.

- [ ] **Step 4: Check git status**

Run: `git status --short`

Expected: only intended files changed; no generated smoke-test files inside repo.

- [ ] **Step 5: Commit final fixes if needed**

If Step 1-4 required corrections:

```bash
git add src tests schemas workflows README.md AGENT.md adapters docs/superpowers/plans/2026-08-01-category-discovery-to-strategy.md
git commit -m "fix: complete category discovery integration"
```

- [ ] **Step 6: Final response**

Report:

- files/areas changed
- tests run
- whether implementation stayed local
- any known limitations, especially that CLI scaffolds and validates artifacts while adapters perform live research
