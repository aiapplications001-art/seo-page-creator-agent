# SEO Page Creator Agent

A portable open-source agent framework for creating company-specific SEO pages that are structured, source-backed, design-aware, and ready for editorial review.

The agent produces publish-ready page packets for guide/blog pages, comparison pages, and product category pages. It supports company onboarding, product/category cluster strategy, Google read-only data inputs, image workflows, and CMS-friendly Markdown plus JSON outputs.

## V1 Scope

- Company and product/category SEO profiling
- Sitemap/site inventory support
- Google Search Console OAuth read-only integration
- Google Ads Keyword Planner data access through a read-only application policy
- CSV/XLSX fallback imports
- Sitemap fetch and URL metadata extraction
- Cluster strategy and page packet workflows
- Image generation workflow specs and prompt fallback
- TypeScript CLI helpers
- Gemini/Codex adapter-ready structure

## V2 Content Quality

V2 adds mandatory research, narrative, citation, QA, repair, and image-readiness gates before a final page packet is treated as ready for editorial review.

Normal editor-facing output is the final page packet, editorial QA report, and image manifest. Internal research ledgers, source notes, page state, version history, and debug bundles stay available for troubleshooting without cluttering the editor review flow.

Useful V2 commands:

```bash
seo-agent v2 prepare-page --cluster acne-treatment --page-id P1 --page-type product_category
seo-agent v2 status --cluster acne-treatment --page-id P1
seo-agent v2 validate-gates --cluster acne-treatment --page-id P1
seo-agent v2 validate-depth --cluster acne-treatment --page-id P1
seo-agent v2 qa --cluster acne-treatment --page-id P1
seo-agent v2 debug-bundle --cluster acne-treatment --page-id P1
seo-agent images plan --cluster acne-treatment --page-id P1
```

Read the full flow in `workflows/19-v2-content-quality.md`.

## Step 0A Foundation Gate

Before choosing keywords or page opportunities, the agent must complete Step 0A from `workflows/13-cluster-strategy.md`. Step 0A defines the search opportunity: the broad topic, the real search problem, and the natural problem-language users use before keyword targeting begins.

The compact Step 0A output must include `selectedTopic`, `topicBoundarySummary`, `includedSubareas`, `excludedSubareas`, `candidateTopics`, `businessSideRelevance`, `deferredKeywordCandidates`, `deferredIntentSignals`, `primarySearchProblem`, `searchProblemBoundarySummary`, `wrongPageRisk`, `desiredOutcome`, `readerState`, `problemLanguage`, `relationshipCheck`, `foundationVerdict`, and `mustCarryForward`.

When input is messy or broad, the agent creates 2-4 candidate topics, scores them, routes rejected inputs, and asks the user if the winner is unclear. `businessSideRelevance` checks user/project input, company/product profile, site inventory, conversion destinations, content authority, audience fit, expertise/risk fit, and commercial or strategic fit. Business relevance is unclear is a critical blocker.

`primarySearchProblem` must describe the real task, pain, confusion, or goal, not restate a topic or keyword. It must include `wrongPageRisk`, `desiredOutcome`, and `readerState`. `problemLanguage` must include 8 cleaned natural user phrases; at least 5-6 must be evidence-backed with `cleanedPhrase`, source excerpt, `sourceRef`, `sourceType`, and `sourceClass`. Use `search_surface` for PAA/autocomplete/related searches/Search Console/site search/query exports and `audience_language` for Reddit, Quora, forums, video comments, reviews, support chats, emails, or social/community comments. At least one `audience_language` source is mandatory when available.

At least 6/8 phrases must support the `primarySearchProblem`, at most 2/8 may be adjacent, and 0 contradictions are allowed. `relationshipCheck` must prove the topic, search problem, and problem-language connect clearly. `foundationVerdict` may be `pass`, `pass_with_warnings`, `fail`, or `ask_user`; only non-critical warnings continue automatically.

## Step 0B Page Scope Contract

Before V2 research, prewriting, final copy, images, batch publishing, commit, deploy, or live publish work, the agent must complete Step 0A and Step 0B from the cluster strategy workflow.

Step 0B freezes the selected page opportunity as a Page Scope Contract. It requires one exact `targetKeyword`, a human-readable `targetQueryIntent`, 3-8 same-task supporting queries, live keyword/search evidence from at least two approved source types, one true search-demand source, and a light SERP overlap/page-type check for clustering and splitting. Deep competitor-quality analysis stays in the later SERP Superiority Gate.

The selected contract must include `pageScopeSummary`, `uniqueContribution`, `mustCover`, `mustNotCover`, `businessGoal`, `existingUrlAction`, rough `slugCandidate`, and `contractHash`. Every candidate phrase must be routed, every `mustCover` item needs light evidence refs, and every `mustNotCover` item needs a route such as future page, internal link out, light mention, or exclusion.

Only the frozen selected opportunity may flow downstream. All V2, page packet, image, QA, and batch artifacts must reference the same `contractHash`; if the target keyword, query cluster, selected opportunity, or page scope changes, Step 0B must be regenerated and revalidated.

## Step 1 Page Job Contract

After Step 0B freezes the selected opportunity and before prewriting, V2 research, final copy, images, commit, deploy, or live publishing, the agent must complete Step 1 from `workflows/13-cluster-strategy.md`.

Step 1 creates `pageJobContract`, the user-purpose contract for the page. It must include `step0BContractHash`, `pageJobHash`, `pageJobStatement`, `audience`, `userTask`, `primaryHelpFormat`, `secondaryHelpFormats`, `userOutcome`, `businessRole`, `riskLayer`, `evidenceBasis`, `jobUniquenessCheck`, `pageJobVerdict`, and `inferenceRepairLog`.

The contract must include a concrete `audienceSentence`, one user task with `taskConstraints`, 3-6 `successCriteria`, 3-8 `nonGoals`, one `primaryHelpFormat`, up to 3 `secondaryHelpFormats`, one `primaryBusinessRole`, a light safety layer with `riskLevel` and `claimSensitivity`, and a specific `outcomeConsequence`. `evidenceBasis` may cite only Step 0A and Step 0B fields, so the page job is inferred rather than invented.

Step 1 must not directly change Step 0B. If Step 0B is wrong, it returns `return_to_0B` with the exact blocker. Prewriting must not directly change Step 1; it returns `return_to_step1` when the page job is wrong or incomplete. Batch mode must run `jobUniquenessCheck` against current-batch, planned-cluster, and historical jobs when available, so pages cannot share the same audience, task, help format, outcome, or body promise with only keyword wording changed.

## Step 2 Search Intent Contract

After Step 1 and before prewriting, V2 research, final copy, images, commit, deploy, or publishing, the agent must complete Step 2 from `workflows/13-cluster-strategy.md`. Step 2 creates `searchIntentContract`, which validates whether the page job matches the search intent behind the selected query.

The contract must include `step0BContractHash`, `pageJobHash`, `searchIntentHash`, `intentStatement`, `dominantBroadIntent`, optional `coPrimaryBroadIntent`, `primaryDeeperIntent`, optional `projectSpecificIntentLabel`, `depthLevel`, `depthStyle`, `satisfactionCondition`, `tooShallowIf`, `wrongPageIf`, `recommendedPageType`, `dominantInternalContentFormat`, `supportingContentFormats`, `lightSerpValidation`, `mixedIntentHandling`, `pageJobAlignmentCheck`, `validatedIntentDecision`, `marketContextCheck`, `aiOverviewIntentSignal`, `intentVerdict`, `intentRepairLog`, and `mustCarryForward`.

`lightSerpValidation` checks the top 5 SERP results lightly for result type and intent pattern only. Normal pass requires 3/5 support for the chosen `dominantBroadIntent` and `primaryDeeperIntent`; 2/5 may continue only as non-critical `pass_with_warnings` when PAA, autocomplete, query cluster, and other search-surface evidence strongly support it. `mixedIntentHandling` must route every non-dominant intent as `adjacent` or `conflicting`. `validatedIntentDecision` records whether search evidence `confirm`, `refine`, or `correct` the query-only hypothesis. The final action is `continue_to_prewriting`, `return_to_step1`, `return_to_0B`, `ask_user`, or `skip_page`.

Step 2 gives prewriting validated recommendations, not final structure: `recommendedPageType`, `dominantInternalContentFormat`, `supportingContentFormats`, expected depth, and the `satisfactionCondition`. `aiOverviewIntentSignal` may be used only as a light answer-shape signal, not as factual authority or citation evidence.

## Step 3 Page Format Contract

After Step 2 and before prewriting, V2 research, final copy, images, commit, deploy, or publishing, the agent must complete Step 3 from `workflows/13-cluster-strategy.md`. Step 3 creates `pageFormatContract`, the format lock for the selected page.

The contract must include `step0BContractHash`, `pageJobHash`, `searchIntentHash`, `pageFormatHash`, `primaryPageType`, `secondaryPageTypeInfluences`, `primaryInternalContentFormat`, `supportingFormatInfluences`, `supportingContentElements`, `step2RecommendationFit`, `formatEvidenceBasis`, `scopeBoundaryCheck`, `formatCompatibilityCheck`, `formatRiskCheck`, `formatUniquenessCheck`, `businessConnectionBoundary`, `adjacentNeedRouting`, `rejectedPageTypes`, `rejectedInternalFormats`, `formatDecisionStatement`, `step3OutputMustNotContain`, `formatRepairLog`, `formatVerdict`, and `mustCarryForward`.

Step 3 requires one `primaryPageType`, one `primaryInternalContentFormat`, and 3-6 `supportingContentElements`; each supporting element must map to Step 2 `satisfactionCondition` and include `allowedScope` plus `notAllowedScope`. Step 3 uses only inherited light evidence from Step 0B, Step 1, and Step 2. It may define `businessConnectionBoundary`, but not CTA strategy. It may define visual/media ideas only as scoped supporting elements, not image prompts or an image manifest.

Step 3 must route adjacent needs with `adjacentNeedRouting`, reject plausible wrong options through `rejectedPageTypes` and `rejectedInternalFormats`, and block outline leakage through `step3OutputMustNotContain`. It uses structured pass/fail only: `formatVerdict` can continue with `continue_to_prewriting` or route to `return_to_step2`, `return_to_step1`, `return_to_0B`, `ask_user`, or `skip_page`.

## Intent-Aware Page Structure

Prewriting generates `pageStructure.intentPattern`, `pageStructure.structureVariant`, and exact `pageStructure.sections` for each selected page. The middle section sequence changes for comparison, alternatives, best-list, how-to, pricing, local, category, and informational intents.

Adapters must not assume old global section IDs such as `S3_context` or `S4_main_content`. Claim-first plans, depth artifacts, final-copy drafts, image mappings, and QA must follow the exact generated section IDs plus each section's `sectionIntent`, `evidenceNeeded`, `requiredDevices`, and `evidenceBudget`.

Before final copy, V2.1 also requires `pre-draft-quality-brief.json`. This artifact blocks thin pages by forcing the adapter to prove sub-intent coverage, diagnostic depth, India or market specificity, safety/trust requirements, a standout element, brand connection, publish-worthiness, SERP superiority, extractable answer targets, and internal links before prose is written. Publish-worthiness includes real reader questions, recommendation sanity checks, claim-risk planning, troubleshooting, and honest brand CTA fit. Each publish-worthiness item must include `sourceRefs`, `mappedSectionId`, `whyThisMatters`, and `finalCopyUse`.

The SERP Superiority Gate requires the primary keyword top 5 SERP pages, at least one secondary keyword or long-tail top 3 SERP set, Reddit/forum/video or PAA audience language, AI Overview weaknesses when available, and trust/citation sources for skincare, medical, safety, or brand-capability claims. The page must beat the current SERP on the top 4 intent dimensions, include at least 1 required superiority component, include 5 differentiated visible improvements, and carry those promises into `final-copy-draft.json` through `superiorityProof` and `whyThisDeservesToRank`.

The Research-Derived Structure Gate is mandatory inside `pre-draft-quality-brief.json` as `researchDerivedStructurePlan`. It must prove the main search intent is visible within the first 3 visible sections, each section/component is source-linked to SERP, audience-language, and trust evidence as applicable, and the page shape is materially different from current batch pages and historical runs. Final copy must then include `structurePlanDeliveryProof` with visible snippets proving the primary concern, high-impact components, and promised visible outputs actually appeared.

## Batch Live Publishing

The batch live publisher is designed to batch by completed live page, not by workflow stage.

Recommended command shape:

```bash
seo-agent batch live --count 10
seo-agent batch live --count 10 --cluster acne-treatment
seo-agent batch live --count 10 --cluster acne-treatment --email-to owner@example.com
```

When `--cluster` is omitted, the runner identifies or creates the right cluster during preflight. Cluster identification must not create page packets, final copy, images, or image manifests.

After cluster preflight, each page is processed as a serial transaction: select one opportunity, complete deep research, create the page packet, write copy, prepare images, run validation and QA, repair up to three total attempts, commit only that page, push/deploy, and verify the production URL returns HTTP 200 OK before starting the next page.

Each selected batch page must first pass Step 0B, Step 1, Step 2, and Step 3, receiving its own Page Scope Contract, Page Job Contract, Search Intent Contract, and Page Format Contract. Batch mode must run a duplicate check across current-batch and historical pages before generation by comparing `targetKeyword`, `targetQueryIntent`, `primaryIntent`, `primaryReaderStage`, `pageType`, `pageScopeSummary`, `uniqueContribution`, `mustCover`, `mustNotCover`, and optional `componentOpportunityHint`. Pages that only differ by keyword wording, share the same body promise, or would reuse the same section plan or decision content must be merged, split, repaired, rerouted, or blocked before downstream work. In batch mode, create `current-page.lock` only after Step 3 passes with action `continue_to_prewriting`.

Opportunity selection prioritizes unfocused and long-tail keywords: messy SERPs, underserved sub-intents, thin competitor pages, Reddit/forum/video language, specific reader problems, pricing/alternative/local/how-to modifiers, and clear information-gain potential. Do not choose pages only because head-term volume is high; every selected page needs an underserved reason, at least 5 long-tail variants, at least 5 related questions, and a standout angle before page production starts.

Research depth is required per page: primary SERP top 5 competitor scoring, secondary keyword top 3 gap review, at least 10 meaningful SERP sources, 7 attempted social/video assets, 5 reviewed social/video assets, claim-specific citations, a required superiority component, and a passing `seo-agent v2 validate-depth` result. Future-page assets or copy must not be created while the current page is still in progress.

Content and structure uniqueness are required across the batch and across historical runs. Before committing or publishing a page, compare its final body copy and page structure against prior pages in the current batch plus stored pages from previous runs. A page must fail repair if it reuses one shared HTML body template, repeats long body sections, or follows the same body section pattern as another page. Different title, hook, slug, or paraphrased copy is insufficient. Main section order, decision matrices, mistake lists, troubleshooting blocks, tables, superiority components, FAQ shape, CTA placement, and CTA body copy must be distinct and custom-created from that page's own SERP, PAA, Reddit/forum/video, AI Overview, audience-language, and competitor-gap research.

Batch runs persist durable state under `.seo-agent-workspace/batch-runs/<run-id>/`: `batch-run.json`, append-only `run-ledger.jsonl`, and `current-page.lock`. A runner must refuse to start another page while `current-page.lock` exists, so interrupted sessions resume or fail visibly instead of silently starting future-page work.

When a V2 page workspace exists, `seo-agent final-copy expand` and `seo-agent images plan` are guarded. They refuse to run until `validate-human`, `validate-gates`, and `validate-depth` pass for that page.

For V2.1 pages, `seo-agent final-copy expand` does not author final prose. The host adapter must fill `final-copy-draft.json` with evidence-backed section markdown first; the CLI validates and merges that adapter-written copy into the expanded page packet.

When `--email-to` or an adapter-level recipient is configured, the batch runner should send a completion email after the run finishes. The email must use the deterministic batch completion packet: final batch QA report, batch score, confidence label, live URLs, QA report paths, failed/skipped attempts, failure reasons, and recommended fixes. Do not send interim per-page emails unless the user explicitly asks.

## Out Of Scope For V1

- CMS publishing
- Direct live page updates
- Analytics/event tracking
- Google account write actions
- Paid ad campaign management
- Unconfigured batch live publishing without a project publish playbook and page worker adapter

## Quick Start

```bash
npm install
npm run build
seo-agent init
```

For local development before publishing/installing the CLI:

```bash
npm run dev -- init
npm run dev -- help
```

Useful CLI helpers:

```bash
seo-agent sitemap fetch https://example.com/sitemap.xml
seo-agent metadata extract --limit 500
seo-agent cluster plan --category "Acne Treatment" --company "ClearNest" --market India --keywords "acne treatment,acne marks treatment"
seo-agent prewriting plan --cluster acne-treatment --page-id P1 --audience "Indian adults with visible acne" --tone "professional compact"
seo-agent page-packet build --cluster acne-treatment --page-id P1 --author "ClearNest Editorial Team"
seo-agent final-copy expand --cluster acne-treatment --page-id P1
seo-agent images plan --cluster acne-treatment --page-id P1
seo-agent watcher google-guidance
seo-agent v2 prepare-page --cluster acne-treatment --page-id P1 --page-type product_category
seo-agent v2 validate-gates --cluster acne-treatment --page-id P1
seo-agent v2 validate-depth --cluster acne-treatment --page-id P1
seo-agent v2 qa --cluster acne-treatment --page-id P1
seo-agent v2 debug-bundle --cluster acne-treatment --page-id P1
```

The Google guidance watcher is also scheduled through GitHub Actions every Tuesday morning India time. Reports are uploaded as workflow artifacts rather than committed to the repo.

Cluster strategy outputs are written to:

```text
.seo-agent-workspace/clusters/<category-slug>/strategy.json
.seo-agent-workspace/clusters/<category-slug>/strategy.md
.seo-agent-workspace/clusters/<category-slug>/prewriting/<page-id>/strategy.json
.seo-agent-workspace/clusters/<category-slug>/prewriting/<page-id>/strategy.md
.seo-agent-workspace/page-packets/<category-slug>/<page-id>/page-packet.json
.seo-agent-workspace/page-packets/<category-slug>/<page-id>/page-packet.md
.seo-agent-workspace/page-packets/<category-slug>/<page-id>/page-packet.expanded.json
.seo-agent-workspace/page-packets/<category-slug>/<page-id>/page-packet.expanded.md
.seo-agent-workspace/page-packets/<category-slug>/<page-id>/image-manifest.json
.seo-agent-workspace/page-packets/<category-slug>/<page-id>/image-prompts.md
.seo-agent-workspace/v2/page-packets/<category-slug>/<page-id>/page-state.json
.seo-agent-workspace/v2/page-packets/<category-slug>/<page-id>/serp-research-ledger.json
.seo-agent-workspace/v2/page-packets/<category-slug>/<page-id>/social-video-research.json
.seo-agent-workspace/v2/page-packets/<category-slug>/<page-id>/audience-definition.json
.seo-agent-workspace/v2/page-packets/<category-slug>/<page-id>/narrative-brief.json
.seo-agent-workspace/v2/page-packets/<category-slug>/<page-id>/citation-set.json
.seo-agent-workspace/v2/page-packets/<category-slug>/<page-id>/editorial-qa-report.md
.seo-agent-workspace/v2/page-packets/<category-slug>/<page-id>/debug-bundle.md
.seo-agent-workspace/watcher-reports/google-guidance-YYYY-MM-DD.md
.seo-agent-workspace/watcher-state/google-guidance-state.json
```

## Workspace

Private company data is stored outside the public repo in:

```text
.seo-agent-workspace/
```

This folder is ignored by git by default.

## License

Apache-2.0
