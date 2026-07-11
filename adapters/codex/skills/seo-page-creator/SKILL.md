---
name: seo-page-creator
description: Create brand-aware, E-E-A-T-oriented SEO page packets with company onboarding, product/category cluster strategy, Google read-only data inputs, image workflows, and CMS-friendly Markdown/JSON outputs.
---

# SEO Page Creator

Use this skill when the user wants to create or refresh SEO pages for a specific company or product/category.

## Core Workflow

1. Read `AGENT.md`.
2. Load the relevant workflow file:
   - Google OAuth: `workflows/10-google-oauth-readonly.md`
   - Image generation: `workflows/11-image-generation.md`
   - Cluster strategy and Page Scope Contract: `workflows/13-cluster-strategy.md`
   - V2 Content Quality: `workflows/19-v2-content-quality.md`
3. Apply relevant policies:
   - `policies/google-data-access-policy.md`
   - `policies/image-generation-policy.md`
4. Use CLI helpers for deterministic tasks when available.

## V2 Content Quality

Use V2 for stronger page-copy quality when the user wants one carefully researched page packet. Start with:

```bash
seo-agent v2 prepare-page --cluster <cluster-slug> --page-id <page-id> --page-type product_category
seo-agent v2 validate-gates --cluster <cluster-slug> --page-id <page-id>
seo-agent v2 validate-depth --cluster <cluster-slug> --page-id <page-id>
seo-agent v2 qa --cluster <cluster-slug> --page-id <page-id>
seo-agent v2 debug-bundle --cluster <cluster-slug> --page-id <page-id>
```

Before running `seo-agent v2 prepare-page`, confirm Step 0A has passed, Step 0B has produced a passing Page Scope Contract for the selected opportunity, Step 1 has produced a passing Page Job Contract, Step 2 has produced a passing Search Intent Contract, and Step 3 has produced a passing Page Format Contract.

Step 0A Foundation is the first hard gate. It must include `selectedTopic`, `topicBoundarySummary`, included/excluded subareas, `candidateTopics`, `businessSideRelevance`, `deferredKeywordCandidates`, `deferredIntentSignals`, `primarySearchProblem`, `searchProblemBoundarySummary`, `wrongPageRisk`, `desiredOutcome`, `readerState`, `problemLanguage`, `relationshipCheck`, `foundationVerdict`, and `mustCarryForward`. For messy or broad input, create 2-4 candidate topics, route rejected inputs, and ask the user if the winner is unclear. `businessSideRelevance` must be evidence-based; business relevance is unclear is a critical blocker. `primarySearchProblem` must describe the real task, pain, confusion, or goal, not restate the topic or keyword. `problemLanguage` must include 8 cleaned natural user phrases, at least 5-6 evidence-backed phrases with `cleanedPhrase`, source excerpt, `sourceRef`, `sourceType`, and `sourceClass`, and must separate `search_surface` from `audience_language`. At least one `audience_language` source is mandatory when available. At least 6/8 phrases must support the `primarySearchProblem`, at most 2/8 may be adjacent, and 0 contradictions are allowed.

Step 0B must include `targetKeyword`, `targetQueryIntent`, `queryCluster`, `selectedOpportunity`, `pageScopeSummary`, evidence-linked `uniqueContribution`, `mustCover`, routed `mustNotCover`, `businessGoal`, `existingUrlAction`, rough `slugCandidate`, and frozen `contractHash`.

Step 0B requires live keyword/search evidence from at least two approved source types, with one true search-demand source; a light SERP overlap/page-type check for clustering and splitting; one dominant fixed-enum `primaryIntent`; fixed-enum `pageType` and `primaryReaderStage`; 3-8 supporting queries unless a narrow scope is justified; every collected candidate phrase routed; and batch duplicate checks when running multiple pages. Do not let Reddit/forum/video comments prove demand by themselves.

Step 1 must create `pageJobContract` before prewriting. It must include `step0BContractHash`, `pageJobHash`, `pageJobStatement`, `audience` with `audienceSentence`, `userTask` with `taskConstraints`, `successCriteria`, and `nonGoals`, `primaryHelpFormat`, `secondaryHelpFormats`, `userOutcome` with `outcomeConsequence`, `businessRole` with `primaryBusinessRole`, `riskLayer` with `riskLevel` and `claimSensitivity`, `evidenceBasis`, `jobUniquenessCheck`, `pageJobVerdict`, and `inferenceRepairLog`. Infer the job from Step 0A and Step 0B only; if Step 0B is wrong, return `return_to_0B`. If prewriting finds the job wrong or incomplete, return `return_to_step1`.

Step 2 must create `searchIntentContract` before prewriting. It must include `step0BContractHash`, `pageJobHash`, `searchIntentHash`, `intentStatement`, `dominantBroadIntent`, optional `coPrimaryBroadIntent`, `primaryDeeperIntent`, optional `projectSpecificIntentLabel`, `depthLevel`, `depthStyle`, `satisfactionCondition`, `tooShallowIf`, `wrongPageIf`, `recommendedPageType`, `dominantInternalContentFormat`, `supportingContentFormats`, `lightSerpValidation`, `mixedIntentHandling`, `pageJobAlignmentCheck`, `validatedIntentDecision`, `marketContextCheck`, optional `aiOverviewIntentSignal`, `intentVerdict`, `intentRepairLog`, and `mustCarryForward`.

For Step 2, run a light top 5 SERP result-pattern check before prewriting. Normal pass requires 3/5 support for the chosen `dominantBroadIntent` and `primaryDeeperIntent`; 2/5 may continue only as non-critical `pass_with_warnings` when query cluster, PAA, autocomplete, related searches, or other search-surface evidence strongly supports it. `mixedIntentHandling` must classify non-dominant intents as `adjacent` or `conflicting`. `validatedIntentDecision` must say whether evidence `confirm`, `refine`, or `correct` the query-only hypothesis. Use `marketContextCheck` for target-market/location/recency fit. Use `aiOverviewIntentSignal` only as optional answer-shape evidence, not as factual authority.

Step 3 must create `pageFormatContract` before prewriting. It must include `step0BContractHash`, `pageJobHash`, `searchIntentHash`, `pageFormatHash`, `primaryPageType`, `secondaryPageTypeInfluences`, `primaryInternalContentFormat`, `supportingFormatInfluences`, `supportingContentElements`, `step2RecommendationFit`, `formatEvidenceBasis`, `scopeBoundaryCheck`, `formatCompatibilityCheck`, `formatRiskCheck`, `formatUniquenessCheck`, `businessConnectionBoundary`, `adjacentNeedRouting`, `rejectedPageTypes`, `rejectedInternalFormats`, `formatDecisionStatement`, `step3OutputMustNotContain`, `formatRepairLog`, `formatVerdict`, and `mustCarryForward`.

For Step 3, choose one `primaryPageType` and one `primaryInternalContentFormat` from fixed enums, with explanation fields for nuance. Require 3-6 `supportingContentElements`, each mapped to Step 2 satisfaction needs and carrying `allowedScope` plus `notAllowedScope`. Step 3 may only refine within Step 2's validated recommendations; real intent changes must return `return_to_step2`, page-job conflicts return `return_to_step1`, and scope conflicts return `return_to_0B`. It must reject at least two plausible wrong page types and internal formats, route adjacent needs through `adjacentNeedRouting`, avoid CTA strategy and detailed outline work, and use only inherited evidence from Step 0B, Step 1, and Step 2. Step 3 actions are `continue_to_prewriting`, `return_to_step2`, `return_to_step1`, `return_to_0B`, `ask_user`, or `skip_page`.

No V2 research, page packet, prewriting, final-copy draft, image plan, commit, deploy, or publish work may start until Step 0B, Step 1, Step 2, and Step 3 return `pass` or non-critical `pass_with_warnings`. Every downstream artifact must reference the same `contractHash`, `step0BContractHash`, `pageJobHash`, `searchIntentHash`, and `pageFormatHash`; if the target keyword, targetQueryIntent, query cluster, selected opportunity, pageScopeSummary, uniqueContribution, mustCover, or mustNotCover changes, regenerate and revalidate Step 0B. If the pageJobStatement, audience, user task, help format, outcome, business role, risk boundary, evidence basis, or uniqueness changes, regenerate and revalidate Step 1. If intent, expected depth, satisfaction condition, page type recommendation, content format, or alignment changes, regenerate and revalidate Step 2. If page type, internal content format, supporting elements, format boundaries, adjacent routing, or business connection boundary changes, regenerate and revalidate Step 3.

The host agent performs live research and fills the SERP, social/video, audience, narrative, citation, and depth artifacts. The final page packet should not be generated when hard gates or `validate-depth` fail. Use `debug-bundle` only when the user asks to inspect troubleshooting artifacts.

When a V2 workspace exists for a page, `seo-agent final-copy expand` and `seo-agent images plan` enforce the transaction guard and refuse to run until `validate-human`, `validate-gates`, and `validate-depth` pass.

For V2.1 final copy, fill `final-copy-draft.json` with adapter-written, evidence-backed section prose before running `seo-agent final-copy expand`. The CLI validates and merges this prose; it must not be treated as the prose author.

Prewriting is intent-aware. Always read `pageStructure.intentPattern`, `pageStructure.structureVariant`, and every entry in `pageStructure.sections` before drafting research artifacts or copy. Section IDs are stable within the generated packet, not globally fixed across all page types. Do not assume category-era IDs such as `S3_context` or `S4_main_content`. Match claim-first plans, depth budgets, final-copy sections, and image mapping to the exact generated section IDs and each section's `sectionIntent`, `evidenceNeeded`, `requiredDevices`, and `evidenceBudget`.

Before final prose, fill `pre-draft-quality-brief.json`. It must prove sub-intent coverage, diagnostic depth, India or market specificity, safety/trust requirements, a standout element, brand connection, publish-worthiness, SERP superiority, AI Overview/extractable answer targets, and internal links. Publish-worthiness requires real reader questions, recommendation sanity checks, claim-risk planning, troubleshooting, and honest brand CTA fit. Weak filler such as "What is this?", "Recommend good products", "Cite claims", or "Help if it gets worse" is invalid. Each publish-worthiness item must include `sourceRefs`, `mappedSectionId`, `whyThisMatters`, and `finalCopyUse`.

SERP Superiority is mandatory: review and score the primary keyword top 5 SERP competitors, review the top 3 pages for at least one secondary keyword or long-tail variant, include Reddit/forum/video/PAA audience-language gaps, inspect AI Overview weaknesses when available, and use trust/citation sources for skincare, medical, safety, or brand-capability claims. The page must beat the SERP on the top 4 intent dimensions, include at least 1 research-custom superiority component, add 5 differentiated visible improvements, and carry all of that into `final-copy-draft.json` through `superiorityProof` and `whyThisDeservesToRank`.

Research-Derived Structure is mandatory: `pre-draft-quality-brief.json` must include `researchDerivedStructurePlan`. It must make the primary search intent visible within the first 3 visible sections, link normal sections to at least 2 evidence refs, link decision tools/matrices/comparisons/troubleshooting/FAQs/superiority components/CTA structure to at least 3 evidence refs, include audience-language refs for objections/mistakes/troubleshooting/FAQs, include SERP competitor gap refs for differentiation claims, and explain how this structure differs from current batch and historical pages. Shared body section patterns are forbidden. `final-copy-draft.json` must include `structurePlanDeliveryProof` with visible snippets proving the primary concern, high-impact components, and promised visible outputs made it into final copy.

## Batch Live Publishing

When the user asks to create multiple live pages, do not batch by workflow stage. Batch by completed live page.

Required flow:

1. Run preflight: confirm the project repo is clean, identify the right cluster from project context, and create/discover the cluster plan only if needed.
2. Do not create page packets, final copy, images, or image manifests during cluster identification.
3. Select exactly one page opportunity.
4. Run Step 0B for the selected opportunity and freeze a Page Scope Contract before page work starts. The contract must include `targetKeyword`, `targetQueryIntent`, `pageScopeSummary`, `uniqueContribution`, `mustCover`, `mustNotCover`, `contractHash`, and a batch duplicate check against current and historical pages.
5. Run Step 1 and freeze the `pageJobContract` before prewriting. Require `pageJobHash`, `pageJobStatement`, `audienceSentence`, `primaryHelpFormat`, `outcomeConsequence`, `evidenceBasis`, and `jobUniquenessCheck` so the page has a distinct user job before copy begins.
6. Run Step 2 and freeze `searchIntentContract` before prewriting. Require `searchIntentHash`, `intentStatement`, `dominantBroadIntent`, `primaryDeeperIntent`, `depthLevel`, `depthStyle`, `satisfactionCondition`, `lightSerpValidation`, `pageJobAlignmentCheck`, `intentVerdict`, and `continue_to_prewriting`.
7. Run Step 3 and freeze `pageFormatContract` before prewriting or `current-page.lock`. Require `pageFormatHash`, `primaryPageType`, `secondaryPageTypeInfluences`, `primaryInternalContentFormat`, `supportingFormatInfluences`, `supportingContentElements` with `allowedScope` and `notAllowedScope`, `adjacentNeedRouting`, `rejectedPageTypes`, `rejectedInternalFormats`, `formatDecisionStatement`, `step2RecommendationFit`, `formatEvidenceBasis`, `scopeBoundaryCheck`, `formatCompatibilityCheck`, `formatRiskCheck`, `formatUniquenessCheck`, `businessConnectionBoundary`, `step3OutputMustNotContain`, `formatRepairLog`, `formatVerdict`, and `continue_to_prewriting`.
8. Prioritize unfocused and long-tail keyword opportunities: messy SERP intent, thin competitor coverage, specific reader problems, Reddit/forum/video language, comparison/alternative/pricing/local/how-to modifiers, and clear information-gain potential. Reject volume-only page selection; every selected page needs an underserved reason, at least 5 long-tail variants, at least 5 related questions, and a standout angle.
9. Complete the full V2.1 workflow for that page only: deep SERP research, social/video research, internal artifacts, `validate-human`, `validate-gates`, `validate-depth`, final copy, image manifest, QA, and repairs.
10. Require strong research depth for each page before final copy: primary SERP top 5 competitor scoring, secondary keyword top 3 gap review, at least 10 meaningful SERP sources, 7 attempted social/video assets, 5 reviewed social/video assets, claim-specific citations, 40 extracted facts, competitor depth delta, audience pain-point ledger, pre-draft synthesis brief, required superiority component, and depth score >= 85.
11. Before commit, compare the current page's final body copy and page structure against prior pages in the current batch and historical pages from previous runs. Shared HTML body templates and shared body section patterns are forbidden. Different title, hook, slug, or paraphrased wording is not enough. Main section order, decision matrices, mistakes, troubleshooting blocks, tables, FAQs, superiority components, CTA placement, and CTA body copy must be distinct and custom-created from the current page's SERP, PAA, Reddit/forum/video, AI Overview, audience-language, and competitor-gap research.
12. If the page passes, commit only that page, push/deploy, and verify the production URL returns HTTP 200 OK.
13. If the page fails after 3 total repair attempts, skip it, record why, and select a replacement opportunity.
14. Only after the current page is live or skipped may you select or work on the next page.
15. After the batch finishes, send the deterministic completion email packet when `--email-to` or a user/adapter recipient is configured. Include the final batch QA report, batch score, confidence label, live URLs, QA report paths, failed/skipped attempts, failure reasons, and recommended fixes.

Never generate images, copy, page packets, or manifests for future pages while the current page is still in progress.

## Hard Rules

- Generate one page packet at a time.
- For batch live publishing, identify the cluster once in preflight, then process pages as strict serial page transactions.
- Enforce Step 0A Foundation before Step 0B and downstream page work; no downstream work may start before 0A passes, and carry `foundationVerdict` plus `mustCarryForward` into Step 0B and V2 artifacts.
- Enforce Step 0B Page Scope Contract before downstream page work; no downstream work may start before 0B passes, and all downstream artifacts must carry the same `contractHash`.
- Enforce Step 1 Page Job Contract before prewriting and downstream page work; no downstream work may start before Step 1 passes, and all downstream artifacts must carry `step0BContractHash` plus `pageJobHash`.
- Enforce Step 2 Search Intent Contract before prewriting and downstream page work; no downstream work may start before Step 2 passes, and all downstream artifacts must carry `searchIntentHash`.
- Enforce Step 3 Page Format Contract before prewriting and downstream page work; no downstream work may start before Step 3 passes, and all downstream artifacts must carry `pageFormatHash`.
- Select unfocused and long-tail opportunities with documented underserved intent, not generic high-volume head terms.
- Do not batch research, copy, images, or validation across multiple pages.
- Do not start future-page assets or copy before the current page is live or skipped.
- Do not reuse one shared HTML body template or body section structure across pages, batches, or previous runs. Different titles, hooks, slugs, or paraphrased wording are not enough; section order, decision content, matrix shape, mistakes, troubleshooting, superiority component, FAQ shape, CTA placement, and CTA body must be page-specific and research-derived.
- Persist every batch run under `.seo-agent-workspace/batch-runs/<run-id>/` with `batch-run.json`, `run-ledger.jsonl`, and `current-page.lock`.
- If `current-page.lock` exists, do not select another page; resume or repair the locked page before continuing.
- Treat shallow research as a repairable page-level failure.
- Run `validate-depth` before final copy, images, commit, or publish.
- If `validate-depth` fails, add new research before rewriting prose.
- Send the batch completion email only after the run is complete or attempt-limited; do not send interim per-page emails unless explicitly requested.
- Use Google data read-only.
- Ask before OAuth or private account fetches.
- Require approval for competitor names and third-party brand visuals.
- Do not publish to CMS in V1.
- Do not override V2 hard gates.
