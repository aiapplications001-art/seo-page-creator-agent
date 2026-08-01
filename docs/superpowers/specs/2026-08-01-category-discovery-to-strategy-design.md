# Category Discovery To Strategy Design

Status: Approved design proposal
Scope: Local replica only
Date: 2026-08-01

## Purpose

Category discovery identifies the SEO cluster category before slugging, cluster strategy creation, page selection, Step 0A, Step 0B, prewriting, drafting, batching, or publishing.

The current cluster flow assumes the user already knows the right category. That makes broad inputs like `acne`, messy business descriptions, or auto-batch requests too fragile. The new flow must infer and validate a specific, expandable SEO cluster category before strategy creation.

The agent must distinguish:

- Seed universe: broad business or search area, such as `acne skincare`
- SEO cluster category: specific but expandable cluster, such as `acne scar treatment`
- Subcluster signal: narrower area inside the selected cluster, such as `pitted acne scars`
- Page opportunity signal: one possible page idea, such as `tretinoin for acne scars`

Category discovery selects the SEO cluster category. It does not create final page keywords, query clusters, page outlines, CTAs, metadata, image prompts, final copy, or page-level must-not-cover rules.

## Approach

Use the full discovery-to-strategy bridge.

The workflow creates:

- `seed-universe-contract.json`
- `cluster-portfolio-discovery.json`
- `cluster-boundary-contract.json`
- `category-discovery-validation.json`
- `category-discovery.lock.json`

Validated discovery then creates or updates:

- `clusters/<cluster-slug>/strategy.json`
- `clusters/<cluster-slug>/strategy.md`
- immutable timestamped snapshots in `clusters/<cluster-slug>/strategy-versions/`

The cluster strategy uses discovered opportunity proofs as the strategy seed. The old deterministic 3-page strategy pattern remains only as a legacy fallback when no discovery artifacts are used.

## Flow

1. `seo-agent category init`
   - Creates a new discovery run folder.
   - Writes schema-valid failing JSON templates with empty values and `fieldGuidance`.

2. LLM adapter fills discovery artifacts
   - Codex, Gemini, or Antigravity performs live research and fills the three JSON files.
   - The TypeScript package supplies schemas, deterministic templates, hashing, validation, locking, artifact paths, and strategy scaffolding.
   - The LLM adapters perform live evidence gathering and interpretation.

3. `seo-agent category validate --run-id <run-id>`
   - Validates all three artifacts.
   - Writes `category-discovery-validation.json`.
   - Writes `category-discovery.lock.json` after `pass` or non-critical `pass_with_warnings`.

4. `seo-agent cluster plan --auto-discover --run-id <run-id>`
   - Revalidates the artifacts before strategy creation.
   - Refreshes the lock file.
   - Slugifies the approved cluster only after the boundary contract passes.
   - Creates or updates the cluster strategy and strategy snapshots.

5. Page-level workflow
   - Step 0A and Step 0B must carry `clusterBoundaryHash`.
   - Step 0B decides exact page keyword, query cluster, page scope, and page-level exclusions.
   - If a page opportunity drifts outside the selected cluster boundary, Step 0B routes it instead of forcing it into the page.

## Artifact Location

Discovery artifacts live under:

```text
.seo-agent-workspace/category-discovery/<run-id>/
  seed-universe-contract.json
  cluster-portfolio-discovery.json
  cluster-boundary-contract.json
  category-discovery-validation.json
  category-discovery.lock.json
```

Discovery artifacts are JSON-only. They include summary statements for human review instead of Markdown companions.

## Template Rules

`category init` writes real files, not console-only templates.

Template rules:

- Files must be schema-valid.
- Verdicts must default to `fail`.
- Values are empty until filled.
- `fieldGuidance` explains what the LLM or user should fill.
- `fieldGuidance` may remain in final artifacts.
- Validators and hashes ignore `fieldGuidance`.
- `fieldGuidance` cannot count as evidence, reasoning, source support, summary text, or contract substance.

## Seed Universe Contract

`seed-universe-contract.json` chooses the broad business/search universe.

Required core fields:

- `runId`
- `artifactType`
- `schemaVersion`
- `createdAt`
- `inputProvenance`
- `mode`
- `modeDetectionReason`
- `candidateSeedUniverses`
- `selectedSeedUniverse`
- `rejectedSeedUniverses`
- `seedUniverseScorecard`
- `evidenceBasis`
- `seedUniverseBoundaries`
- `seedUniverseSummaryStatement`
- `sourceAttemptLog`
- `completenessChecklist`
- `verdict`

If the user provides no explicit category or topic input, the artifact must set `originalUserInput` to `null` and infer from available business profile, site inventory, conversion destinations, existing content, search surfaces, or competitor/category evidence.

When no explicit user input exists, at least one business description and at least one concrete support source are required. Concrete support may come from site inventory, product/category list, service list, conversion destination, existing content, Search Console, sitemap, user-provided business docs, or keyword exports.

### Seed Universe Scorecard

Seed universe scoring is intentionally lighter than cluster scoring:

- Business/site evidence fit: 30
- Site/product evidence: 25
- Search/audience signal: 20
- Strategic mode fit: 15
- Risk/manageability: 10

The seed universe contract must ask the user when:

- Top seed universes are within 8-10 points and tie-breakers cannot resolve them.
- Business priority is unclear.
- The selected seed would exclude a prominent user-stated business area.
- Evidence conflicts materially.
- Market/language ambiguity changes the category set.

## Cluster Portfolio Discovery

`cluster-portfolio-discovery.json` produces 5-10 candidate SEO cluster categories, routes every non-selected candidate, and selects one active cluster candidate.

Required core fields:

- `runId`
- `selectedSeedUniverse`
- `candidateClusters`
- `selectedClusterCandidate`
- `rejectedCandidateRoutes`
- `modeAdjustedScoreWeights`
- `rawDiscoveryMappings`
- `sourceRegistry`
- `sourceAttemptLog`
- `portfolioSummaryStatement`
- `completenessChecklist`
- `verdict`

Every candidate must include:

- `candidateClusterCategory`
- `clusterType`
- `canonicalNameCheck`
- `evidenceGroupsPresent`
- `eligibility`
- `score`
- `scoreReason`
- `lightweightOpportunityProofs`
- `route`
- `reason`

Every candidate needs source refs for eligibility groups. Only the selected cluster needs dimension-level score evidence refs.

### Candidate Evidence

Candidates may enter the portfolio with at least two evidence groups, but a candidate cannot be selected unless it has all required evidence groups or a documented exception.

Required evidence groups for selected clusters:

- 2-3 search-demand surfaces
- 2-3 SERP or competitor surfaces
- 2-3 audience-language surfaces when available
- 2-3 site or business evidence sources

Supported source roles:

- `business_profile`
- `site_inventory`
- `conversion_destination`
- `search_demand`
- `serp_competitor`
- `competitor_sitemap`
- `category_leader`
- `audience_language`
- `paa`
- `autocomplete`
- `related_search`
- `video_signal`
- `forum_signal`
- `search_console`
- `keyword_tool`
- `internal_site_search`

Selected-cluster evidence must include `sourceUseReason`. Raw discovery sources only need source role and source refs.

### Raw-To-Normalized Mapping

The artifact must preserve raw discoveries and normalized candidate mapping.

Example:

```json
{
  "rawDiscovery": "pimple marks kaise hataye",
  "sourceRef": "youtube-comment-3",
  "normalizedTo": "acne scar treatment",
  "normalizationReason": "Audience-language phrase points to the broader scar and mark improvement cluster."
}
```

Competitor labels or sitemap labels may be stored only as short observed labels when necessary. The artifact must store synthesized mappings and must not copy full competitor taxonomy, sitemap structures, headings, page groups, or category architecture.

## Cluster Scoring

Use a 100-point cluster scorecard after eligibility rules pass.

Default weights:

- Business/site evidence and strategic fit: 20
- Search demand and long-tail breadth: 15
- SERP opportunity and competitor weakness: 15
- Audience pain and natural language clarity: 15
- Cluster depth and page-opportunity richness: 15
- Site authority and internal support: 10
- Boundary clarity and operational safety: 10

Mode-specific weights:

| Mode | Business | Search/Long-Tail | SERP Opportunity | Audience Pain | Cluster Richness | Site Support | Boundary/Safety |
| --- | ---: | ---: | ---: | ---: | ---: | ---: | ---: |
| `batch_growth` | 15 | 20 | 20 | 15 | 20 | 5 | 5 |
| `authority_building` | 20 | 10 | 10 | 15 | 15 | 20 | 10 |
| `conversion_support` | 25 | 10 | 10 | 10 | 10 | 20 | 15 |
| `refresh_existing` | 20 | 10 | 15 | 10 | 10 | 20 | 15 |
| `market_entry` | 20 | 20 | 20 | 15 | 15 | 5 | 5 |

The agent auto-detects mode but allows user override.

Modes:

- `batch_growth`
- `authority_building`
- `conversion_support`
- `refresh_existing`
- `market_entry`

Examples:

- `create 10 pages` implies `batch_growth`.
- `improve existing pages` implies `refresh_existing`.
- `build authority around acne scars` implies `authority_building`.
- `support product/category pages` implies `conversion_support`.
- `new brand/site, where should I start?` implies `market_entry`.

Feasibility is not a separate score. It is reflected in SERP opportunity, site authority/internal support, boundary clarity, and mode fit.

## Cluster Boundary Contract

`cluster-boundary-contract.json` approves and freezes the selected cluster before slugging or strategy creation.

Required core fields:

- `selectedClusterCategory`
- `parentCategory`
- `clusterType`
- `clusterSearchProblem`
- `sharedAudience`
- `clusterPositioningStatement`
- `includedSubareas`
- `excludedSubareas`
- `adjacentClusters`
- `subclusterSignals`
- `pageOpportunitySignals`
- `needsStep0BDecision`
- `clusterContentPromises`
- `antiPromises`
- `namingConfidence`
- `namingChecks`
- `nameRejectedAlternatives`
- `clusterViabilityStatement`
- `batchSuitability`
- `siteEvidenceSummary`
- `cannibalizationCheck`
- `originalityCheck`
- `selectionConfidence`
- `confidenceReasons`
- `confidenceLimits`
- `categoryDiscoverySummaryStatement`
- `mustCarryForward`
- `categoryDiscoveryOutputMustNotContain`
- `completenessChecklist`
- `verdict`

### Boundary Minimums

Light minimums:

- `includedSubareas`: 5-8
- `excludedSubareas`: 2-5
- `adjacentClusters`: 2-8 when available

These prevent vague boundaries while avoiding artificial over-structuring.

### Cluster Type

Use a fixed enum:

- `condition_or_problem`
- `product_or_solution`
- `audience_or_segment`
- `routine_or_process`
- `comparison_or_alternative`
- `location_or_market`
- `use_case_or_situation`
- `ingredient_or_component`
- `myth_or_misconception`
- `tool_or_template`
- `service_or_conversion`

Type-aware opportunity expectations are allowed. For example:

- `condition_or_problem`: guides, prevention, myths, treatment options, troubleshooting, when-to-seek-help
- `comparison_or_alternative`: versus pages, best-for scenarios, alternatives, pricing/fit, decision matrices
- `routine_or_process`: routines, mistakes, product fit, troubleshooting, timing/frequency, examples
- `ingredient_or_component`: what it does, who it suits, side effects, combinations, myths, alternatives
- `location_or_market`: market modifiers, local availability, pricing, local constraints, provider or product fit

These expectations guide discovery only. They do not define final page type, outline, or structure.

### Naming Rules

The selected cluster name must be:

- a noun phrase
- cluster-level, not page-level
- specific but expandable
- understandable to readers and the business
- not a polished long-tail keyword
- not copied from competitor navigation, taxonomy, sitemap, or category labels

The boundary contract must include:

- `namingConfidence`
- `namingChecks`
- `nameRejectedAlternatives`

Required naming checks:

- `isNounPhrase`
- `isClusterLevel`
- `isSpecificButExpandable`
- `notPageLevelKeyword`
- `notTooBroadParent`
- `notCompetitorCopied`

### Search Problem And Positioning

`clusterSearchProblem` is required. It defines the human problem tying the whole cluster together.

`sharedAudience` is required. It defines the broad audience/situation across the cluster while Step 1 later narrows the audience for a specific page.

`clusterPositioningStatement` is required and separate from `clusterSearchProblem`.

- `clusterSearchProblem`: what users are trying to solve.
- `clusterPositioningStatement`: how this brand/cluster will help in a distinct, consistent way.

Example:

- `clusterSearchProblem`: People with acne scars want to understand what can realistically improve scar appearance, what cannot, and when home care versus clinical care makes sense.
- `clusterPositioningStatement`: This cluster will offer realistic, India-aware, safety-first scar guidance that separates acne marks, texture scars, active acne prevention, at-home care, and clinical treatment decisions without miracle-cure claims.

### Cluster Content Promises

`clusterContentPromises` is required with 3-5 light promises. These are recurring quality principles, not repeated sections or templates.

Example for `acne scar treatment`:

- Avoid miracle-cure framing.
- Distinguish marks, scars, and active acne when relevant.
- Keep India-market practicality visible when relevant.
- Route medical/safety claims carefully.
- Avoid product-roundup drift unless the page is explicitly about product evaluation.

`antiPromises` are optional generally, but required when an obvious claim-risk boundary exists. The category layer must not create a heavy claim-risk taxonomy. Formal business-side relevance and page-level risk handling belong to Step 0A and later page gates.

## Page Opportunity Proofs

Category discovery creates lightweight opportunity proofs only. Step 0B later freezes individual page opportunities.

Each opportunity proof must include:

- `opportunityName`
- `distinctSearchProblem`
- `distinctnessReason`
- `evidenceRefs`
- `rawToNormalizedEvidence`
- `route`
- optional `pageTypeHint`

No `shouldNotBecome` is required at opportunity-proof level. Step 0B owns page-level exclusions and `mustNotCover`.

Opportunity routes:

- `ready_for_step0B`
- `needs_more_discovery_before_step0B`
- `needs_step0B_scope_decision`
- `future_cluster`
- `adjacent_cluster`
- `too_narrow_page_opportunity`
- `rejected`

`needsStep0BDecision` is a separate queue in strategy output. It stores uncertain or bridge-like ideas that are plausibly connected to the cluster search problem but need Step 0B judgment.

Example:

```json
{
  "name": "best face wash for oily acne skin India",
  "possibleClusterConnection": "Could support scar prevention if framed around reducing active acne irritation and future scarring risk.",
  "route": "needs_step0B_scope_decision"
}
```

Batch selection consumes `ready_for_step0B` opportunities first. `needs_more_discovery_before_step0B` opportunities can be used only after ready opportunities run out and after enrichment.

## Opportunity Proof Counts

Normal selected clusters should have at least 5 distinct opportunity proofs.

Mode rules:

- `batch_growth`: 5+ distinct opportunity proofs required.
- `authority_building`, `conversion_support`, `refresh_existing`, and `market_entry`: 3-4 strong proofs may pass with warnings.
- Fewer than 3 distinct proofs fails.

Distinctness means a different search problem or decision task, not a keyword variant.

## Batch Suitability

The selected cluster requires `batchSuitability`.

Required fields:

- `suitableForBatch`
- `maxConfidentPageCount`
- `reason`

If requested batch count exceeds `maxConfidentPageCount`, the runner must first auto-continue opportunity discovery inside the selected cluster. Expansion attempts are capped at 2x the requested page count. If enough opportunities still cannot be found inside the boundary, the runner reports shortage and reasons instead of diluting the cluster.

## Competitor And Category Evidence

Discovery uses:

- Direct SERP competitors
- 2-3 broader category leaders
- Competitor sitemaps/navigation/category pages when accessible

Competitor findings are evidence and inspiration only. They must not become copied category names, copied architecture, copied page groups, copied headings, or copied sitemap structures.

Discovery artifacts may include names and URLs for competitors/category leaders. Strategy keeps only source refs and compact summary.

## Site Evidence And Internal Links

Category discovery may use site inventory, conversion destinations, sitemap, navigation, local cluster folders, and existing content as evidence for selection and cannibalization.

However, category discovery and cluster strategy must not carry internal link guidance. Step 4, Step 8, and Step 9 own internal linking and next-action planning.

Strategy may keep only a compact `siteEvidenceSummary`:

- evidence refs
- business/site fit reason
- cannibalization route

No internal link suggestions, anchor suggestions, CTA recommendations, or destination plans are allowed.

## Cannibalization And Slugging

Slugging happens only after the boundary contract passes.

Flow:

1. Selected cluster category passes boundary.
2. Generate `slugCandidate`.
3. Check local cluster folders, site inventory URLs, sitemap, navigation, and known existing hubs/pages.
4. Classify overlap.
5. Route the collision.
6. Create final `clusterSlug`.

Overlap types:

- `same_cluster`
- `parent_overlap`
- `subcluster_overlap`
- `adjacent_overlap`
- `page_level_overlap`
- `no_overlap`

Collision routes:

- `reuse_existing_cluster`
- `refresh_existing_cluster`
- `create_subcluster`
- `rename_new_cluster`
- `merge_with_existing_cluster`
- `ask_user`
- `continue`

Unresolved cannibalization conflicts block strategy creation.

## Discovery Research Depth

Category discovery may automatically use live search/web evidence:

- SERP
- competitor pages
- competitor sitemaps/navigation/category hubs
- PAA
- autocomplete
- related searches
- Reddit/forums
- videos/video comments when available
- site inventory
- conversion destination checks
- optional imports

Moderate discovery target:

- 5-8 seed/search explorations
- Top 5 SERP competitors across strongest seed terms
- 3-5 competitor sitemap/navigation/category checks
- 2-3 broader category leaders
- PAA/autocomplete/related-search expansion
- Reddit/forum/video audience-language scan when available
- Site inventory and conversion destination check

Optional imports are supported as evidence references:

- `--search-console-export`
- `--keyword-export`
- `--site-inventory-export`

The first version registers import file references as evidence sources and provenance. The CLI does not need to parse and normalize CSV rows in the first implementation.

## Source Attempt Log

Every discovery run requires `sourceAttemptLog`.

The log records:

- source surface attempted
- date/time attempted
- source role
- access status
- reason used or unavailable
- whether absence is warning or blocker

This is required when sources like Reddit, video comments, Search Console, or competitor sitemaps are unavailable.

## Freshness

Category discovery must record:

- `dateChecked`
- recency sensitivity notes
- `refreshRecommendedAfter`

Market/language may be stored as input context when provided, but market/language assumptions are not a hard selected-cluster decision requirement. Step 5 owns SERP market validation.

## Selection Confidence

The selected cluster must include:

- `selectionConfidence`: `low`, `medium`, or `high`
- `confidenceReasons`
- `confidenceLimits`

Hard gates override confidence. Low confidence can only result in `pass_with_warnings`, and the caution must carry into Step 0A, Step 0B, and batch expansion.

## User Override

The user may override the score-based selected cluster with another candidate.

Rules:

- Override can replace score-based selection.
- Override cannot bypass evidence, naming, boundary, cannibalization, or validation gates.
- The overridden cluster must still pass the boundary contract.

Ask the user when:

- Top seed universes or clusters are within 8-10 points and tie-breakers cannot resolve the winner.
- Business priority is unclear.
- Selection would exclude a prominent user-stated business area.
- Existing cluster collision needs owner judgment.
- Market/language is unclear and materially changes discovery.
- Evidence conflicts.
- Safety or claim-risk boundary is obvious but cannot be framed safely.
- No eligible cluster exists but several plausible weak clusters exist.

## Verdicts And Actions

Each artifact has its own verdict:

```json
{
  "status": "pass | pass_with_warnings | fail | ask_user",
  "action": "...",
  "warnings": [],
  "blockers": [],
  "repairAttemptsUsed": 0,
  "reason": "..."
}
```

Allowed actions:

- `continue_to_cluster_strategy`
- `repair_category_discovery`
- `return_to_category_discovery`
- `ask_user`
- `skip_cluster`

The validator computes the combined discovery result and writes `category-discovery-validation.json`.

## Validation Rules

Hard blockers:

- no live evidence
- no defensible seed universe
- no eligible selected cluster candidate
- business/site evidence too weak outside `market_entry`
- selected cluster too broad or too narrow
- vague or invalid canonical cluster name
- missing selected-cluster evidence groups without documented exception
- unresolved cannibalization conflict
- unclear active cluster after tie-breakers
- missing boundary contract
- missing cluster search problem
- missing shared audience
- missing cluster positioning statement
- missing cluster viability statement
- missing mustCarryForward
- copied competitor taxonomy/category architecture
- category discovery outputs forbidden page-level artifacts
- low confidence trying to pass as `pass`

Warnings that may continue automatically:

- audience-language evidence unavailable after attempts
- only 3-4 opportunity proofs in non-`batch_growth` mode
- one broader category leader inaccessible
- historical inventory inaccessible
- low confidence with explicit caution carried forward

Repairable up to 2 attempts:

- vague canonical cluster name
- missing route for rejected candidate
- weak cluster viability statement
- missing source-role labels
- incomplete raw-to-normalized mapping
- unclear included/excluded boundary
- missing source-use reason for selected evidence
- missing checklist item
- missing summary statement

Not repairable:

- no live evidence
- no defensible seed universe
- no eligible cluster
- selected cluster too broad or too narrow after repair
- unresolved cannibalization conflict
- copied competitor architecture
- business/site evidence too weak outside `market_entry`
- unclear selection after tie-breakers

## Completeness Checklist

Each artifact must include a machine-readable checklist. The combined validator must check at least:

- seed universe selected
- mode selected or inferred
- mode detection reason present
- source roles present
- source attempt log complete
- candidate clusters routed
- selected cluster eligible
- selected-cluster score evidence present
- raw-to-normalized mappings complete
- naming confidence check complete
- opportunity proofs distinct
- opportunity proof counts valid for mode
- included/excluded/adjacent boundaries meet minimums
- cluster search problem present
- shared audience present
- positioning statement present
- content promises present
- cannibalization checked
- originality checked
- site evidence summary complete
- batch suitability complete
- summary statements present
- mustCarryForward complete
- output boundary respected
- no copied competitor architecture

Any false checklist item triggers repair, warning, failure, or ask-user routing based on criticality.

## Locking And Immutability

Discovery runs are editable until the first successful validation:

- `pass`
- non-critical `pass_with_warnings`

After that, the run is treated as immutable.

Successful validation writes `category-discovery.lock.json` with:

- artifact paths
- artifact hashes
- selected seed universe
- selected cluster category
- verdict
- warnings
- blockers
- validatedAt

`cluster plan --auto-discover --run-id <id>` must revalidate and refresh the lock before strategy creation. It cannot trust an existing validation file without checking current artifact contents.

Category discovery does not require a clean git worktree. Live page publishing and batch publishing still block on uncommitted changes.

## Strategy Output

`strategy.json` includes a compact discovery block:

```json
{
  "categoryDiscovery": {
    "runId": "...",
    "seedUniverseHash": "...",
    "clusterPortfolioHash": "...",
    "clusterBoundaryHash": "...",
    "selectedSeedUniverse": "...",
    "selectedClusterCategory": "...",
    "clusterSearchProblem": "...",
    "clusterPositioningStatement": "...",
    "clusterViabilityStatement": "...",
    "boundarySummary": "...",
    "warnings": []
  }
}
```

Strategy must include:

- ready page opportunities seeded from validated proofs
- `needsMoreDiscoveryBeforeStep0B`
- `needsStep0BDecision`
- compact raw-to-normalized mapping per opportunity
- `siteEvidenceSummary`
- `batchSuitability`
- discovery hashes
- boundary summary

Strategy must not include:

- cluster-level content architecture
- hub-and-spoke architecture
- internal link suggestions
- CTA strategy
- final target keywords
- final query clusters
- page outlines
- page copy
- image prompts
- metadata

An optional `hubOpportunitySignal` is allowed, but it is non-binding. Step 0B decides whether a hub page is actually selected.

## Strategy Versioning

When discovery hashes change, strategy must be versioned instead of silently mutating the old foundation.

Use latest stable files plus immutable snapshots:

```text
clusters/<cluster-slug>/
  strategy.json
  strategy.md
  strategy-versions/
    2026-08-01T101500Z-strategy.json
    2026-08-01T101500Z-strategy.md
```

`strategy.md` must include:

- selected seed universe
- selected cluster category
- cluster viability statement
- boundary summary
- discovery hashes
- warnings

## CLI

Add category commands:

```bash
seo-agent category init \
  --business "..." \
  --company "..." \
  --market India \
  --mode batch_growth \
  --site https://example.com \
  --seed "acne, acne scars" \
  --competitor https://competitor.com \
  --reference https://leader.com \
  --search-console-export ./gsc.csv \
  --keyword-export ./keywords.csv \
  --site-inventory-export ./site.csv
```

Then:

```bash
seo-agent category validate --run-id <run-id>
seo-agent cluster plan --auto-discover --run-id <run-id>
```

Support integrated mode:

```bash
seo-agent cluster plan --auto-discover \
  --business "..." \
  --company "..." \
  --market India
```

Existing explicit category flow remains:

```bash
seo-agent cluster plan --category "Acne Treatment" --company "ClearNest"
```

The CLI warns when explicit `--category` looks broad or vague, but still allows the legacy command. Adapters enforce discovery when the category is missing, broad, vague, stale, or missing `clusterBoundaryHash`.

## Adapter Rules

Codex, Gemini, and Antigravity adapters must run category discovery when:

- `--cluster` is omitted
- category input is broad or vague
- user provides business description only
- batch runner needs automatic cluster selection
- existing cluster boundary hash is missing or stale
- user asks for new opportunities beyond the current cluster

Adapters must:

- fill the three JSON artifacts using live research
- preserve source roles and source attempt logs
- record raw-to-normalized mappings
- route every non-selected candidate
- avoid invented evidence
- avoid copied competitor architecture
- respect output boundaries
- carry `clusterBoundaryHash` into Step 0A, Step 0B, and downstream page artifacts

Adapters must not:

- create final page target keywords during category discovery
- create final query clusters
- create page outlines
- create page copy
- create image prompts
- create final superiority components
- create CTA strategy
- create metadata
- copy competitor category architecture

## Reuse And Refresh

Existing discovery may be reused only when:

- `clusterBoundaryHash` exists
- selected cluster category matches requested scope
- mode is compatible
- freshness window is valid
- business/site context has not materially changed

Rerun discovery when:

- freshness expired
- business/category scope changed
- user asks for new opportunities beyond the current cluster
- batch growth needs more opportunities than the current cluster can support
- cluster boundary hash is missing or stale

In `refresh_existing` mode, candidates may route to:

- `refresh_existing_cluster`
- `refresh_existing_page_set`
- `merge_duplicate_cluster`
- `expand_underdeveloped_cluster`
- `leave_unchanged`

## Downstream Contract

Every page-level artifact from Step 0A onward must carry `clusterBoundaryHash`.

Step 0A performs the formal business-side relevance validation and search-problem fit check inside the approved cluster.

Step 0B validates:

- exact target keyword
- query cluster
- page scope
- whether an uncertain opportunity belongs in current scope
- whether a bridge idea should become a future/adjacent cluster

If a page opportunity falls outside the selected cluster, Step 0B must route it instead of forcing it into the page.

Allowed downstream routes:

- `future_cluster`
- `adjacent_cluster`
- `separate_cluster_required`
- `return_to_category_discovery`
- `exclude_from_current_cluster`
- `ask_user`

## Output Must Not Contain

Category discovery must not produce:

- final page target keyword
- final query cluster
- page outline
- page copy
- image prompts
- final superiority component
- CTA strategy
- metadata
- exact page titles
- final Step 0A or Step 0B contracts
- copied competitor category architecture
- copied competitor sitemap structures
- copied competitor headings or page groups

Category discovery may produce:

- candidate seed universes
- candidate SEO cluster categories
- lightweight opportunity proofs
- raw-to-normalized discovery mappings
- selected cluster boundary
- compact strategy seed inputs

## Success Criteria

The design succeeds when:

- Broad user/business input can become a defensible SEO cluster category.
- Cluster selection is evidence-backed, inspectable, and not copied from competitors.
- The selected category is neither too broad nor too narrow.
- The strategy uses discovered opportunities instead of the old fixed 3-page pattern.
- Step 0A/0B inherit the cluster boundary through `clusterBoundaryHash`.
- Batch runners can understand whether the cluster can support the requested page count.
- Uncertain bridge opportunities are preserved without contaminating the ready page list.
- Validators and adapters can enforce the same gates deterministically.
