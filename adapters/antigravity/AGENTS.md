# Antigravity Adapter

Use the SEO Page Creator Agent core files as the source of truth:

- `AGENT.md`
- `README.md`
- `workflows/19-v2-content-quality.md`
- `adapters/codex/skills/seo-page-creator/SKILL.md`
- `adapters/gemini-cli/GEMINI.md`

## V2.1 Single Page Workflow

For one SEO page, run the full V2.1 workflow for the current page only.

Before the V2.1 workflow starts, enforce Step 0A, Step 0B, Step 1, Step 2, and Step 3 from `workflows/13-cluster-strategy.md`.

Step 0A Foundation must define the search opportunity before keyword targeting. It must include `selectedTopic`, `topicBoundarySummary`, included/excluded subareas, `candidateTopics`, `businessSideRelevance`, `deferredKeywordCandidates`, `deferredIntentSignals`, `primarySearchProblem`, `searchProblemBoundarySummary`, `wrongPageRisk`, `desiredOutcome`, `readerState`, `problemLanguage`, `relationshipCheck`, `foundationVerdict`, and `mustCarryForward`.

For messy or broad input, create 2-4 candidate topics, route rejected inputs, and ask the user if the winner is unclear. `businessSideRelevance` must be evidence-based; business relevance is unclear is a critical blocker. `primarySearchProblem` must describe the real task, pain, confusion, or goal, not restate the topic or keyword.

`problemLanguage` must include 8 cleaned natural user phrases, at least 5-6 evidence-backed phrases with `cleanedPhrase`, source excerpt, `sourceRef`, `sourceType`, and `sourceClass`, and must separate `search_surface` from `audience_language`. At least one `audience_language` source is mandatory when available. At least 6/8 phrases must support the `primarySearchProblem`, at most 2/8 may be adjacent, and 0 contradictions are allowed.

`relationshipCheck` must prove the topic, search problem, and problem-language connect clearly. `foundationVerdict` may be `pass`, `pass_with_warnings`, `fail`, or `ask_user`; only non-critical warnings continue automatically.

Step 0B must then freeze exactly one selected opportunity as a Page Scope Contract before any downstream work starts.

The Page Scope Contract must include `targetKeyword`, `targetQueryIntent`, `queryCluster`, `selectedOpportunity`, `pageScopeSummary`, evidence-linked `uniqueContribution`, `mustCover`, routed `mustNotCover`, `businessGoal`, `existingUrlAction`, rough `slugCandidate`, and `contractHash`.

Step 0B must use live keyword/search evidence from at least two approved source types, including one true search-demand source. It must run a light SERP overlap/page-type check for clustering and splitting only, route every candidate phrase, force one fixed-enum `primaryIntent`, use fixed-enum `pageType` and `primaryReaderStage`, and allow only non-critical `pass_with_warnings`.

Step 1 must then freeze the page's purpose as `pageJobContract` before prewriting. It must include `step0BContractHash`, `pageJobHash`, `pageJobStatement`, `audience` with `audienceSentence`, `userTask` with `taskConstraints`, `successCriteria`, and `nonGoals`, `primaryHelpFormat`, `secondaryHelpFormats`, `userOutcome` with `outcomeConsequence`, `businessRole` with `primaryBusinessRole`, `riskLayer` with `riskLevel` and `claimSensitivity`, `evidenceBasis`, `jobUniquenessCheck`, `pageJobVerdict`, and `inferenceRepairLog`.

Step 1 may infer from Step 0A and Step 0B but must not directly modify Step 0B. If the frozen scope is wrong, return `return_to_0B` with exact blockers. Prewriting must not directly modify Step 1; return `return_to_step1` if the page job is wrong or incomplete.

Step 2 must then freeze the search intent as `searchIntentContract` before prewriting. It must include `step0BContractHash`, `pageJobHash`, `searchIntentHash`, `intentStatement`, `dominantBroadIntent`, optional `coPrimaryBroadIntent`, `primaryDeeperIntent`, optional `projectSpecificIntentLabel`, `depthLevel`, `depthStyle`, `satisfactionCondition`, `tooShallowIf`, `wrongPageIf`, `recommendedPageType`, `dominantInternalContentFormat`, `supportingContentFormats`, `lightSerpValidation`, `mixedIntentHandling`, `pageJobAlignmentCheck`, `validatedIntentDecision`, `marketContextCheck`, optional `aiOverviewIntentSignal`, `intentVerdict`, `intentRepairLog`, and `mustCarryForward`.

Step 2 must check the top 5 SERP results lightly for intent pattern. Normal pass requires 3/5 support for `dominantBroadIntent` and `primaryDeeperIntent`; 2/5 may continue only as non-critical `pass_with_warnings` when PAA, autocomplete, related searches, query cluster, or other search-surface evidence strongly supports it. `mixedIntentHandling` must classify non-dominant intents as `adjacent` or `conflicting`. `validatedIntentDecision` must state whether evidence `confirm`, `refine`, or `correct` the query-only hypothesis. `marketContextCheck` validates target-market context. `aiOverviewIntentSignal` is optional answer-shape evidence only, not factual authority or citation support.

Step 3 must then freeze the page format as `pageFormatContract` before prewriting and before `current-page.lock` is created. It must include `step0BContractHash`, `pageJobHash`, `searchIntentHash`, `pageFormatHash`, `primaryPageType`, `secondaryPageTypeInfluences`, `primaryInternalContentFormat`, `supportingFormatInfluences`, `supportingContentElements`, `step2RecommendationFit`, `formatEvidenceBasis`, `scopeBoundaryCheck`, `formatCompatibilityCheck`, `formatRiskCheck`, `formatUniquenessCheck`, `businessConnectionBoundary`, `adjacentNeedRouting`, `rejectedPageTypes`, `rejectedInternalFormats`, `formatDecisionStatement`, `step3OutputMustNotContain`, `formatRepairLog`, `formatVerdict`, and `mustCarryForward`.

Step 3 must select exactly one fixed-enum `primaryPageType` and one fixed-enum `primaryInternalContentFormat`; `secondaryPageTypeInfluences` and `supportingFormatInfluences` may add nuance but cannot control the page. Require 3-6 `supportingContentElements`, each mapped to Step 2's `satisfactionCondition` with `allowedScope` and `notAllowedScope`. Route every adjacent need through `adjacentNeedRouting`; record at least two plausible `rejectedPageTypes` and `rejectedInternalFormats`; prove `step2RecommendationFit`, `scopeBoundaryCheck`, `formatCompatibilityCheck`, `formatRiskCheck`, `formatUniquenessCheck`, and `businessConnectionBoundary`; and keep `step3OutputMustNotContain` explicit: no detailed outline, headings, CTA strategy, competitor gaps, metadata, final copy, image prompts, image manifest, or visual design. Step 3 may only refine within Step 2's validated intent. Intent contradictions return `return_to_step2`, page-job conflicts return `return_to_step1`, scope conflicts return `return_to_0B`, and a valid format returns `continue_to_prewriting`; unresolved batch pages may `skip_page`.

No downstream work may start before 0A, 0B, Step 1, Step 2, and Step 3 pass: no V2 research, prewriting, final-copy-draft, page packet, images, current or future page assets, commit, deploy, or publish. Carry `foundationVerdict` and `mustCarryForward` into Step 0B and V2 artifacts. Every downstream artifact must reference the same `contractHash`, `step0BContractHash`, `pageJobHash`, `searchIntentHash`, and `pageFormatHash`. If `targetKeyword`, `targetQueryIntent`, query cluster, selected opportunity, `pageScopeSummary`, `uniqueContribution`, `mustCover`, or `mustNotCover` changes, regenerate and revalidate Step 0B. If `pageJobStatement`, audience, task, help format, outcome, business role, risk boundary, `evidenceBasis`, or uniqueness changes, regenerate and revalidate Step 1. If intent, expected depth, satisfaction condition, page type recommendation, content format, or alignment changes, regenerate and revalidate Step 2. If page type, internal content format, supporting elements, format boundaries, adjacent routing, rejected formats, or business connection boundary changes, regenerate and revalidate Step 3.

Required sequence:

1. Confirm or create the Step 0A Foundation artifact and keep its `foundationVerdict` and `mustCarryForward` available.
2. Confirm or create the Step 0B Page Scope Contract and keep its `contractHash` available.
3. Confirm or create Step 1 Page Job Contract and keep its `pageJobHash` available.
4. Confirm or create Step 2 Search Intent Contract and keep its `searchIntentHash` available.
5. Confirm or create Step 3 Page Format Contract and keep its `pageFormatHash` available.
6. Prepare or inspect the page workspace with `seo-agent v2 prepare-page --cluster <cluster-slug> --page-id <page-id> --page-type <page-type>`.
7. Do live SERP research and fill the SERP research ledger.
8. Review social/video assets and fill the social/video research artifact.
9. Fill audience, narrative, human editorial, claim-first section, citation, and depth artifacts.
10. Fill `pre-draft-quality-brief.json` before final prose. It must prove sub-intent coverage, diagnostic depth, India or market specificity, safety/trust requirements, a standout element, brand connection, publish-worthiness, SERP superiority, AI Overview/extractable answer targets, internal links, and `researchDerivedStructurePlan`. Publish-worthiness requires real reader questions, recommendation sanity checks, claim-risk planning, troubleshooting, and honest brand CTA fit. Weak filler such as "What is this?", "Recommend good products", "Cite claims", or "Help if it gets worse" is invalid. Each publish-worthiness item must include `sourceRefs`, `mappedSectionId`, `whyThisMatters`, and `finalCopyUse`.
11. For SERP Superiority, score the primary keyword top 5 competitors, review top 3 pages for at least one secondary keyword or long-tail variant, include Reddit/forum/video/PAA audience-language gaps, inspect AI Overview weaknesses when available, use trust/citation sources for skincare/medical/safety/brand-capability claims, prove superiority on the top 4 intent dimensions, require 1 custom superiority component, and plan 5 differentiated visible improvements.
12. For Research-Derived Structure, make the primary search intent visible within the first 3 visible sections, link normal sections to at least 2 evidence refs, link decision tools/matrices/comparisons/troubleshooting/FAQs/superiority components/CTA structure to at least 3 evidence refs, include audience-language refs for objections/mistakes/troubleshooting/FAQs, include SERP competitor gap refs for differentiation claims, and prove the structure differs from current batch and historical pages. Shared body section patterns are forbidden.
13. Run `seo-agent v2 validate-human`.
14. Run `seo-agent v2 validate-gates`.
15. Run `seo-agent v2 validate-depth`.
16. If validation fails, repair the underlying research or artifact first. If `validate-depth` fails, add new research before rewriting prose.
17. Do not create final copy, page packet, image manifest, commit, push, deploy, or publish until `validate-human`, `validate-gates`, and `validate-depth` pass.
18. Fill `final-copy-draft.json` with adapter-written, evidence-backed section prose. Include `superiorityProof`, `structurePlanDeliveryProof`, and `whyThisDeservesToRank`, proving the top-4 intent wins, superiority component, 5 differentiated improvements, 3 extractable answer blocks, visible citation/source handling, primary concern, high-impact structure components, and promised visible outputs made it into final copy. Do not rely on the CLI to author final prose.
19. Run `seo-agent final-copy expand` only after `final-copy-draft.json` is ready; the CLI validates and merges the adapter-written prose.
20. Generate the image manifest only after content and depth validation pass.
21. Return the final page packet, editorial QA report, and image manifest as the normal editor-facing output.

Keep internal ledgers, source notes, page state, and debug bundles available for troubleshooting, but do not make them the default editor-facing output.

Prewriting is intent-aware. Before research, claim planning, copy, or image work, read `pageStructure.intentPattern`, `pageStructure.structureVariant`, and the exact generated `pageStructure.sections`. Section IDs are stable within a generated page packet, not globally fixed across page types. Do not assume old IDs such as `S3_context` or `S4_main_content`. Match every claim-first entry, depth artifact, final-copy section, and image mapping to the generated section IDs and to each section's `sectionIntent`, `evidenceNeeded`, `requiredDevices`, and `evidenceBudget`.

## Batch Execution Contract

When asked to create multiple live SEO pages, run a strict serial page-by-page loop.

Do not batch by workflow stage.

Required batch sequence:

1. Stop before starting if the target project repo has uncommitted changes.
2. Identify the cluster during preflight. Use an existing cluster plan when suitable, or create/discover the cluster plan if needed.
3. Do not create page packets, final copy, images, or image manifests during cluster identification.
4. Select exactly one page opportunity.
5. Run Step 0A and freeze the Foundation artifact before selecting or locking page work.
6. Run Step 0B and freeze the selected Page Scope Contract before creating `current-page.lock` or starting page work.
7. Run the Step 0B batch duplicate check against current-batch and historical pages using `targetKeyword`, `targetQueryIntent`, `primaryIntent`, `primaryReaderStage`, `pageType`, `pageScopeSummary`, `uniqueContribution`, `mustCover`, `mustNotCover`, and any `componentOpportunityHint`.
8. Run Step 1 and freeze `pageJobContract` before creating `current-page.lock` or starting page work. Require `pageJobHash`, `pageJobStatement`, `audienceSentence`, `taskConstraints`, `successCriteria`, `nonGoals`, `primaryHelpFormat`, `outcomeConsequence`, `evidenceBasis`, and `jobUniquenessCheck`.
9. Run Step 2 and freeze `searchIntentContract` before creating `current-page.lock` or starting page work. Require `searchIntentHash`, `intentStatement`, `dominantBroadIntent`, `primaryDeeperIntent`, `depthLevel`, `depthStyle`, `satisfactionCondition`, `lightSerpValidation`, `pageJobAlignmentCheck`, `intentVerdict`, and `continue_to_prewriting`.
10. Run Step 3 and freeze `pageFormatContract` before creating `current-page.lock` or starting page work. Require `pageFormatHash`, `primaryPageType`, `secondaryPageTypeInfluences`, `primaryInternalContentFormat`, `supportingFormatInfluences`, `supportingContentElements` with `allowedScope` and `notAllowedScope`, `adjacentNeedRouting`, `rejectedPageTypes`, `rejectedInternalFormats`, `formatDecisionStatement`, `step2RecommendationFit`, `formatEvidenceBasis`, `scopeBoundaryCheck`, `formatCompatibilityCheck`, `formatRiskCheck`, `formatUniquenessCheck`, `businessConnectionBoundary`, `step3OutputMustNotContain`, `formatRepairLog`, `formatVerdict`, and `continue_to_prewriting`.
11. Prioritize unfocused and long-tail keyword opportunities: messy SERP intent, thin competitor coverage, specific reader problems, Reddit/forum/video language, comparison/alternative/pricing/local/how-to modifiers, and clear information-gain potential. Reject volume-only selection; every selected page needs an underserved reason, at least 5 long-tail variants, at least 5 related questions, and a standout angle.
12. Create or respect `.seo-agent-workspace/batch-runs/<run-id>/current-page.lock` only after Step 3 passes with `continue_to_prewriting`.
13. Append durable progress to `.seo-agent-workspace/batch-runs/<run-id>/run-ledger.jsonl`.
14. Complete research, page packet, final copy, image manifest, validation, QA, repair, commit, push/deploy, and verify HTTP 200 OK for the current page.
15. Before commit, compare the current page's final body copy and page structure against prior pages in the current batch and historical pages from previous runs. Shared HTML body templates and shared body section patterns are forbidden. Different title, hook, slug, or paraphrased wording is not enough. Main section order, decision matrices, mistakes, troubleshooting blocks, tables, FAQs, superiority components, CTA placement, and CTA body copy must be distinct and custom-created from the current page's SERP, PAA, Reddit/forum/video, AI Overview, audience-language, and competitor-gap research.
16. Record terminal state in `batch-run.json` and `run-ledger.jsonl` before clearing `current-page.lock`.
17. Clear `current-page.lock` only after the page is recorded as live, skipped, publish-failed, deploy-failed, or failed after repairs.
18. Only after the current page is live or terminally skipped may you select the next page.
19. After the batch finishes, send the deterministic completion email packet when `--email-to` or a user/adapter recipient is configured. Include the final batch QA report, batch score, confidence label, live URLs, QA report paths, failed/skipped attempts, failure reasons, and recommended fixes.

If `current-page.lock` already exists, do not select another page. Inspect, resume, repair, or report the locked page before doing anything else.

## Hard Rules

- Generate one page packet at a time.
- Do not batch research, copy, images, validation, commits, or deployments across multiple pages.
- Enforce Step 0A Foundation before Step 0B and downstream page work; no downstream work may start before 0A passes, and carry `foundationVerdict` plus `mustCarryForward`.
- Enforce Step 0B Page Scope Contract before any downstream page work; no downstream work may start before 0B passes, and all downstream artifacts must carry the same `contractHash`.
- Enforce Step 1 Page Job Contract before prewriting or downstream page work; no downstream work may start before Step 1 passes, and all downstream artifacts must carry `step0BContractHash` and `pageJobHash`.
- Enforce Step 2 Search Intent Contract before prewriting or downstream page work; no downstream work may start before Step 2 passes, and all downstream artifacts must carry `searchIntentHash`.
- Enforce Step 3 Page Format Contract before prewriting, `current-page.lock`, or downstream page work; no downstream work may start before Step 3 passes, and all downstream artifacts must carry `pageFormatHash`.
- Select unfocused and long-tail opportunities with documented underserved intent, not generic high-volume head terms.
- Enforce SERP Superiority on every page: primary top 5, secondary top 3, audience-language gaps, source diversity, 1 superiority component, 5 differentiated improvements, `superiorityProof`, and `whyThisDeservesToRank`.
- Enforce Research-Derived Structure on every page: `researchDerivedStructurePlan`, primary intent visible within the first 3 visible sections, source-linked section/component proof, material structure differences from current batch and historical pages, and `structurePlanDeliveryProof` visible in final copy.
- Do not reuse one shared HTML body template or body section structure across pages, batches, or previous runs. Different titles, hooks, slugs, or paraphrased wording are not enough; section order, decision content, matrix shape, mistakes, troubleshooting, superiority component, FAQ shape, CTA placement, and CTA body must be page-specific and research-derived.
- Do not create future-page research, copy, images, assets, page packets, QA, commits, deploys, or manifests while the current page is still in progress.
- Run `validate-depth` before final copy, images, commit, push, deploy, or publish.
- Treat shallow research as a repairable page-level failure.
- Use up to three total repair attempts per page.
- If a page still fails, record why, preserve artifacts and recommended fixes, skip that page, and select a replacement opportunity.
- Keep generating replacement opportunities until the requested live page count is reached or the max attempt limit is reached.
- At batch end, report live pages, failed pages, skipped pages, and failure reasons.
- Send the batch completion email only after the run is complete or attempt-limited; do not send interim per-page emails unless explicitly requested.
- Use Google data read-only.
- Ask before OAuth or private account fetches.
- Require approval for competitor names and third-party brand visuals.
- Do not override V2 hard gates.
