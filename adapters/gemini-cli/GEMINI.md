# Gemini CLI Adapter

Use the SEO Page Creator Agent core files as the source of truth.

## Recommended Commands

- `/seo:help`
- `/seo:onboard`
- `/seo:site-scan`
- `/seo:cluster`
- `/seo:page`
- `/seo:refresh`
- `/seo:edit-section`
- `/seo:rescore`
- `/seo:watcher`

## Google Data Access

Before starting OAuth or fetching private Google account data, ask the user for approval.

Use the local CLI helpers for deterministic tasks:

```bash
npm run dev -- init
npm run dev -- auth google
```

Google integrations are read-only by policy.

## V2.1 Content Quality

Compatibility note: /seo:page now uses V2.1 quality gates by default.

Use `/seo:page` for one page at a time when stronger content quality is required. Read `workflows/19-v2-content-quality.md`, run the V2 prepare/status/validate-human/validate-gates/validate-depth/qa/debug-bundle helpers, and keep normal editor-facing output limited to the final page packet, editorial QA report, and image manifest.

Before `/seo:page` starts V2 preparation or research, read `workflows/13-cluster-strategy.md` and enforce Step 0A, Step 0B, Step 1, Step 2, and Step 3.

Step 0A Foundation must define the search opportunity before keyword targeting. It must include `selectedTopic`, `topicBoundarySummary`, included/excluded subareas, `candidateTopics`, `businessSideRelevance`, `deferredKeywordCandidates`, `deferredIntentSignals`, `primarySearchProblem`, `searchProblemBoundarySummary`, `wrongPageRisk`, `desiredOutcome`, `readerState`, `problemLanguage`, `relationshipCheck`, `foundationVerdict`, and `mustCarryForward`. For messy or broad input, create 2-4 candidate topics, route rejected inputs, and ask the user if the winner is unclear. `businessSideRelevance` must be evidence-based; business relevance is unclear is a critical blocker. `primarySearchProblem` must describe the real task, pain, confusion, or goal, not restate the topic or keyword. `problemLanguage` must include 8 cleaned natural user phrases, at least 5-6 evidence-backed phrases with `cleanedPhrase`, source excerpt, `sourceRef`, `sourceType`, and `sourceClass`, and must separate `search_surface` from `audience_language`. At least one `audience_language` source is mandatory when available. At least 6/8 phrases must support the `primarySearchProblem`, at most 2/8 may be adjacent, and 0 contradictions are allowed.

Step 0B must freeze exactly one selected opportunity in a Page Scope Contract with `targetKeyword`, `targetQueryIntent`, `queryCluster`, `selectedOpportunity`, `pageScopeSummary`, evidence-linked `uniqueContribution`, `mustCover`, routed `mustNotCover`, `businessGoal`, `existingUrlAction`, rough `slugCandidate`, and `contractHash`.

Step 0B requires live keyword/search evidence from at least two approved source types, including one true search-demand source, plus a light SERP overlap/page-type check for clustering and splitting only. Every candidate phrase must be routed. Use fixed enums for `pageType`, `primaryIntent`, and `primaryReaderStage`, and force one dominant primary intent even when the SERP is mixed.

Step 1 must freeze the page job as `pageJobContract` before prewriting. It must include `step0BContractHash`, `pageJobHash`, `pageJobStatement`, `audience` with `audienceSentence`, `userTask` with `taskConstraints`, `successCriteria`, and `nonGoals`, `primaryHelpFormat`, `secondaryHelpFormats`, `userOutcome` with `outcomeConsequence`, `businessRole` with `primaryBusinessRole`, `riskLayer` with `riskLevel` and `claimSensitivity`, `evidenceBasis`, `jobUniquenessCheck`, `pageJobVerdict`, and `inferenceRepairLog`. Infer the page job from Step 0A and Step 0B only. If Step 0B is wrong, return `return_to_0B`; if prewriting finds Step 1 wrong or incomplete, return `return_to_step1`.

Step 2 must freeze search intent as `searchIntentContract` before prewriting. It must include `step0BContractHash`, `pageJobHash`, `searchIntentHash`, `intentStatement`, `dominantBroadIntent`, optional `coPrimaryBroadIntent`, `primaryDeeperIntent`, optional `projectSpecificIntentLabel`, `depthLevel`, `depthStyle`, `satisfactionCondition`, `tooShallowIf`, `wrongPageIf`, `recommendedPageType`, `dominantInternalContentFormat`, `supportingContentFormats`, `lightSerpValidation`, `mixedIntentHandling`, `pageJobAlignmentCheck`, `validatedIntentDecision`, `marketContextCheck`, optional `aiOverviewIntentSignal`, `intentVerdict`, `intentRepairLog`, and `mustCarryForward`.

Step 2 must run a light top 5 SERP intent-pattern check. Normal pass requires 3/5 support for `dominantBroadIntent` and `primaryDeeperIntent`; 2/5 may continue only as non-critical `pass_with_warnings` when PAA, autocomplete, related searches, query cluster, or other search-surface evidence strongly supports it. `mixedIntentHandling` must route non-dominant intents as `adjacent` or `conflicting`. `validatedIntentDecision` must say whether evidence `confirm`, `refine`, or `correct` the query-only hypothesis. `marketContextCheck` protects target-market fit, and `aiOverviewIntentSignal` is only optional light answer-shape evidence, not a citation.

Step 3 must freeze the page format as `pageFormatContract` before prewriting. It must include `step0BContractHash`, `pageJobHash`, `searchIntentHash`, `pageFormatHash`, `primaryPageType`, `secondaryPageTypeInfluences`, `primaryInternalContentFormat`, `supportingFormatInfluences`, `supportingContentElements`, `step2RecommendationFit`, `formatEvidenceBasis`, `scopeBoundaryCheck`, `formatCompatibilityCheck`, `formatRiskCheck`, `formatUniquenessCheck`, `businessConnectionBoundary`, `adjacentNeedRouting`, `rejectedPageTypes`, `rejectedInternalFormats`, `formatDecisionStatement`, `step3OutputMustNotContain`, `formatRepairLog`, `formatVerdict`, and `mustCarryForward`.

Step 3 must use one fixed-enum `primaryPageType`, one fixed-enum `primaryInternalContentFormat`, optional `secondaryPageTypeInfluences`, optional `supportingFormatInfluences`, and 3-6 `supportingContentElements` mapped to Step 2 satisfaction needs. Every supporting element must include `allowedScope` and `notAllowedScope`; adjacent needs must be routed through `adjacentNeedRouting`; at least two plausible wrong `rejectedPageTypes` and `rejectedInternalFormats` must be recorded. Step 3 may only refine within Step 2's validated intent. If it finds an intent contradiction, return `return_to_step2`; if it finds a page-job conflict, return `return_to_step1`; if it finds a scope conflict, return `return_to_0B`. Step 3 action must be `continue_to_prewriting`, `return_to_step2`, `return_to_step1`, `return_to_0B`, `ask_user`, or `skip_page`.

No downstream work may start before 0A, 0B, Step 1, Step 2, and Step 3 pass: no V2 research, prewriting, final-copy-draft, page packet, images, commit, deploy, publish, or future-page assets. Carry `foundationVerdict` and `mustCarryForward` into Step 0B and V2 artifacts. All downstream artifacts must reference the same `contractHash`, `step0BContractHash`, `pageJobHash`, `searchIntentHash`, and `pageFormatHash`. If `targetKeyword`, `targetQueryIntent`, query cluster, selected opportunity, `pageScopeSummary`, `uniqueContribution`, `mustCover`, or `mustNotCover` changes, regenerate and revalidate Step 0B. If `pageJobStatement`, audience, task, help format, outcome, business role, risk boundary, `evidenceBasis`, or uniqueness changes, regenerate and revalidate Step 1. If intent, expected depth, satisfaction condition, page type recommendation, content format, or alignment changes, regenerate and revalidate Step 2. If page type, internal content format, supporting elements, adjacent routing, or business connection boundary changes, regenerate and revalidate Step 3.

When a V2 workspace exists for a page, `seo-agent final-copy expand` and `seo-agent images plan` are guarded and refuse to run until validate-human, validate-gates, and validate-depth pass. Fill `final-copy-draft.json` with adapter-written, evidence-backed prose before running `seo-agent final-copy expand`; the CLI validates and merges prose, it does not write final copy.

Prewriting is intent-aware. Read `pageStructure.intentPattern`, `pageStructure.structureVariant`, and every entry in `pageStructure.sections` before creating research artifacts, claim-first plans, final copy, or images. Section IDs are stable within one generated packet, not globally fixed across all page types. Do not assume old IDs such as `S3_context` or `S4_main_content`; match all artifacts to the exact generated section IDs and each section's `sectionIntent`, `evidenceNeeded`, `requiredDevices`, and `evidenceBudget`.

Before final prose, fill `pre-draft-quality-brief.json`. It must prove sub-intent coverage, diagnostic depth, India or market specificity, safety/trust requirements, a standout element, brand connection, publish-worthiness, SERP superiority, AI Overview/extractable answer targets, and internal links. Publish-worthiness requires real reader questions, recommendation sanity checks, claim-risk planning, troubleshooting, and honest brand CTA fit. Weak filler such as "What is this?", "Recommend good products", "Cite claims", or "Help if it gets worse" is invalid. Each publish-worthiness item must include `sourceRefs`, `mappedSectionId`, `whyThisMatters`, and `finalCopyUse`.

SERP Superiority is mandatory: review and score the primary keyword top 5 SERP competitors, review the top 3 pages for at least one secondary keyword or long-tail variant, include Reddit/forum/video/PAA audience-language gaps, inspect AI Overview weaknesses when available, and use trust/citation sources for skincare, medical, safety, or brand-capability claims. The page must beat the SERP on the top 4 intent dimensions, include at least 1 research-custom superiority component, add 5 differentiated visible improvements, and carry all of that into `final-copy-draft.json` through `superiorityProof` and `whyThisDeservesToRank`.

Research-Derived Structure is mandatory: `pre-draft-quality-brief.json` must include `researchDerivedStructurePlan`. It must make the primary search intent visible within the first 3 visible sections, link normal sections to at least 2 evidence refs, link decision tools/matrices/comparisons/troubleshooting/FAQs/superiority components/CTA structure to at least 3 evidence refs, include audience-language refs for objections/mistakes/troubleshooting/FAQs, include SERP competitor gap refs for differentiation claims, and explain how this structure differs from current batch and historical pages. Shared body section patterns are forbidden. `final-copy-draft.json` must include `structurePlanDeliveryProof` with visible snippets proving the primary concern, high-impact components, and promised visible outputs made it into final copy.

## Batch Live Publishing

When asked to create multiple live SEO pages, run a strict serial page-by-page loop. Do not batch by workflow stage.

First run cluster preflight only:

- Confirm the target repo is clean.
- Identify the right cluster from project context.
- Use an existing cluster plan when suitable; otherwise create/discover the cluster plan.
- Do not create page packets, final copy, images, or image manifests during cluster identification.

Then process one page at a time:

- Persist the run under `.seo-agent-workspace/batch-runs/<run-id>/` with `batch-run.json`, append-only `run-ledger.jsonl`, and `current-page.lock`.
- If `current-page.lock` already exists, do not select another page; resume or repair the locked page first.
- Select exactly one opportunity.
- Run Step 0B and freeze the selected Page Scope Contract before page work starts. The contract must include `targetKeyword`, `targetQueryIntent`, `pageScopeSummary`, `uniqueContribution`, `mustCover`, `mustNotCover`, and `contractHash`.
- Run the Step 0B batch duplicate check before generation by comparing `targetKeyword`, `targetQueryIntent`, `primaryIntent`, `primaryReaderStage`, `pageType`, `pageScopeSummary`, `uniqueContribution`, `mustCover`, `mustNotCover`, and any `componentOpportunityHint` against current-batch and historical pages.
- Run Step 1 and freeze `pageJobContract` before prewriting. Require `pageJobHash`, `pageJobStatement`, `audienceSentence`, `taskConstraints`, `successCriteria`, `nonGoals`, `primaryHelpFormat`, `outcomeConsequence`, `evidenceBasis`, and `jobUniquenessCheck` so the page job is distinct before generation.
- Run Step 2 and freeze `searchIntentContract` before prewriting. Require `searchIntentHash`, `intentStatement`, `dominantBroadIntent`, `primaryDeeperIntent`, `depthLevel`, `depthStyle`, `satisfactionCondition`, `lightSerpValidation`, `pageJobAlignmentCheck`, `intentVerdict`, and `continue_to_prewriting` so the page matches search intent before generation.
- Run Step 3 and freeze `pageFormatContract` before prewriting or `current-page.lock`. Require `pageFormatHash`, `primaryPageType`, `secondaryPageTypeInfluences`, `primaryInternalContentFormat`, `supportingFormatInfluences`, `supportingContentElements` with `allowedScope` and `notAllowedScope`, `adjacentNeedRouting`, `rejectedPageTypes`, `rejectedInternalFormats`, `formatDecisionStatement`, `step2RecommendationFit`, `formatEvidenceBasis`, `scopeBoundaryCheck`, `formatCompatibilityCheck`, `formatRiskCheck`, `formatUniquenessCheck`, `businessConnectionBoundary`, `step3OutputMustNotContain`, `formatRepairLog`, `formatVerdict`, and `continue_to_prewriting` so the page format is locked before generation.
- Prioritize unfocused and long-tail keyword opportunities: messy SERP intent, thin competitor coverage, specific reader problems, Reddit/forum/video language, comparison/alternative/pricing/local/how-to modifiers, and clear information-gain potential. Reject volume-only selection; every selected page needs an underserved reason, at least 5 long-tail variants, at least 5 related questions, and a standout angle.
- Complete deep SERP research, social/video research, internal artifacts, validate-human, validate-gates, validate-depth, final copy, image manifest, QA, and repairs for that page only.
- Require primary SERP top 5 competitor scoring, secondary keyword top 3 gap review, at least 10 meaningful SERP sources, 7 attempted social/video assets, 5 reviewed social/video assets, claim-specific citations, 40 extracted facts, competitor depth delta, audience pain-point ledger, pre-draft synthesis brief, required superiority component, and depth score >= 85 before treating copy as usable.
- Before commit, compare the current page's final body copy and page structure against prior pages in the current batch and historical pages from previous runs. Shared HTML body templates and shared body section patterns are forbidden. Different title, hook, slug, or paraphrased wording is not enough. Main section order, decision matrices, mistakes, troubleshooting blocks, tables, FAQs, superiority components, CTA placement, and CTA body copy must be distinct and custom-created from the current page's SERP, PAA, Reddit/forum/video, AI Overview, audience-language, and competitor-gap research.
- Never create assets, images, copy, page packets, or manifests for future pages while the current page is in progress.
- Commit, push/deploy, and verify HTTP 200 OK for the current page before starting the next page.
- If validate-depth fails, add new research before rewriting prose.
- After the batch finishes, send the deterministic completion email packet when `--email-to` or a user/adapter recipient is configured. Include the final batch QA report, batch score, confidence label, live URLs, QA report paths, failed/skipped attempts, failure reasons, and recommended fixes. Do not send interim per-page emails unless explicitly requested.

## Image Generation

Use available Gemini/image tooling in the host environment to generate image assets when possible. If generation fails or exceeds the user-approved time budget, create `image-prompts.md` from `templates/image-prompt-briefs.template.md`.
