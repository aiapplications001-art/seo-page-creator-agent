# Step 5 SERP Competitor Analysis Design

## Purpose

Step 5 happens after Step 4 and before `current-page.lock`, prewriting, V2 research, final copy, images, commit, deploy, or publishing.

It answers:

- What does the real SERP look like for the selected target keyword?
- What do the strongest competitors already do well?
- What minimum bar must our page match?
- What gaps or opportunities should later steps explore?
- Do Steps 1-4 still hold after seeing the competitive reality?

Step 5 is not the outline step, unique-angle step, topic-research step, final-copy step, or SERP Superiority Gate. It locks the competitive reality and routes findings forward.

## Artifacts

Step 5 creates both:

- `serp-competitor-analysis.json`: machine-validated contract and source registry.
- `serp-competitor-analysis.md`: human-readable summary and QA/debug view.

The JSON is the gate. The Markdown cannot replace it.

Every Step 5 artifact must include:

- `step0BContractHash`
- `pageJobHash`
- `searchIntentHash`
- `pageFormatHash`
- `nextActionHash`
- `serpCompetitorHash`

All downstream artifacts must carry `serpCompetitorHash`.

## Required Contract Fields

The JSON must include:

- `serpContext`
- `sourceRegistry`
- `primarySerpResults`
- `reviewedCompetitors`
- `supportingQuerySerpChecks`
- `discoveredQueryCandidates`
- `serpFeatureInventory`
- `marketSerpFitCheck`
- `deviceSerpCheck`
- `mobileFirstSerpInterpretation`
- `globalBenchmarkRelevanceCheck`
- `marketCompetitorMix`
- `indiaGlobalInfluenceBoundary`
- `serpCannibalizationCheck`
- `differentiationRequirement` when needed
- `commercialSerpSignals`
- `serpQuestionAndRelatedSignals`
- `domainClusterHandling`
- `excludedResults`
- `serpStrengthLabel`
- `minimumBarToMatch`
- `opportunityGapsToExplore`
- `coveragePatterns`
- `contentAnglePatterns`
- `depthBenchmark`
- `trustSignalBenchmark`
- `uxComponentBenchmark`
- `competitorStrengthsToRespect`
- `competitorWeaknessesAndGaps`
- `superiorityComponentOpportunities`
- `serpInformedScopeProtection`
- `directionValidation`
- `competitorImitationRisk`
- `step5BoundaryNotes`
- `analysisConfidence`
- `batchSerpIsolationCheck`
- `step5CompletenessChecklist`
- `serpCompetitorSummaryStatement`
- `serpCompetitorVerdict`
- `mustCarryForward`

## SERP Collection Rules

Primary target keyword:

- Collect the top 10 organic results when available.
- Attempt direct page review for the top 5 organic competitors.
- Complete at least 3 direct competitor reviews.
- Preserve original ranks in `primarySerpResults`.
- Record blocked, inaccessible, excluded, paid, duplicate-domain, wrong-market, or wrong-language results in `excludedResults`.
- Replace inaccessible top-5 pages with the next accessible organic result when possible, without hiding the original rank.

Supporting queries:

- Check 3-5 important Step 0B supporting queries when available.
- For each supporting query, do a light top 3 SERP check.
- Route each supporting query as `keep_in_current_scope`, `briefly_support_only`, `separate_page_candidate`, `exclude_from_current_page`, or `return_to_0B_required`.

Discovered query candidates:

- Step 5 may identify candidates from PAA, autocomplete, related searches, video suggestions, forums, or competitor patterns.
- It must route each as `add_to_current_scope_candidate`, `separate_page_candidate`, `exclude_from_current_page`, or `return_to_0B_required`.
- It must not silently expand the frozen Step 0B scope.

## Source Registry Rules

Every source must include:

- `sourceRef`
- `sourceClass`
- `sourceType`
- query
- rank when applicable
- title
- URL
- `accessStatus`
- `reviewDepth`
- `dateChecked`
- `allowedEvidenceUse`
- `notAllowedEvidenceUse` when useful

Important boundaries:

- Reddit, forums, video comments, PAA, and AI Overview may support audience language or answer shape, not factual authority.
- AI Overview is only an intent/answer-shape signal and must not be copied.
- Official sources can support trust and safety, but they do not replace competitor/page research.
- Global benchmarks can raise quality standards but cannot override India-market relevance.

## Competitor Review Rules

Each directly reviewed competitor must include:

- scoring for `intentMatch`, `coverageDepth`, `structureClarity`, `examplesAndPracticality`, `trustSignals`, `freshness`, `uxAndReadability`, and `distinctiveAssets`
- `competitorStrengthScore`
- `competitorStrengthLabel`
- `strengthReason`
- `pageExperienceNotes`
- `aboveFoldIntentMatch`
- `freshnessSignals`
- `rankingHypothesis`
- strengths
- weaknesses
- `whatToRespect`
- `whatToAvoid`

Strength thresholds:

- weak: 1.0-2.4
- moderate: 2.5-3.7
- strong: 3.8-5.0

High authority/trust plus strong intent match plus strong UX/components can make a competitor strong even when one smaller dimension is weaker.

## Market And Device Rules

For India-sensitive or market-sensitive pages:

- `marketSerpFitCheck` is required.
- `not_matched` fails or asks the user.
- Mobile-first interpretation is required for consumer, skincare, product, service, and local queries.
- Dual-device checking is required when SERP features are likely device-sensitive.

Global benchmarks:

- Attempt 2 only when `globalBenchmarkRelevanceCheck` says they are relevant.
- Keep them separate as `sourceClass: global_benchmark_competitor`.
- Do not count them toward the primary competitor minimum.
- They may inform quality, trust, UX, explanation clarity, and safety-boundary standards.
- They cannot override Indian product availability, pricing, climate/context, user language, local SERP intent, or brand next action.

## Required Synthesis

Step 5 must separate:

- `minimumBarToMatch`: things our page must do to be credible.
- `opportunityGapsToExplore`: weaknesses or missing pieces later steps may use.

Each major conclusion must be evidence-linked.

Normal page minimums:

- at least 2 `contentAnglePatterns`
- at least 4 `coveragePatterns`
- at least 3 `competitorStrengthsToRespect`
- at least 3 `competitorWeaknessesAndGaps`
- at least 2 `minimumBarToMatch`
- at least 2 `opportunityGapsToExplore`
- at least 3 `serpQuestionAndRelatedSignals` when visible

Fewer can pass only with warnings and a reason that the SERP is sparse or narrow.

## Cannibalization And Differentiation

When site inventory, sitemap, repo routes, known URLs, or historical page packets are accessible, Step 5 must run a moderate `serpCannibalizationCheck`.

It compares:

- target keyword
- query cluster
- page job
- intent
- page format
- SERP shape
- audience
- next action

Adjacent, safe, or partial overlap can continue. If partial overlap continues, Step 5 must create `differentiationRequirement` with downstream proof required. High or critical overlap must return to Step 0B, ask the user, merge/refresh, or skip in batch.

## Later-Step Impact

Synthesized strengths and gaps must not stay as notes. They need `utilizationRouting` or `pageImpact`:

- `must_apply`
- `consider_for_step6`
- `consider_for_step7`
- `consider_for_step9`
- `consider_for_superiority_gate`
- `do_not_use`
- `separate_page_candidate`

`must_apply` items require `pageImpact`. `do_not_use` items require `whyNotUsed`. `proofRequired: true` items must later appear in `serpCompetitorDeliveryProof`.

## Boundaries

Step 5 must not contain:

- final outline
- H1/H2/H3 section order
- final factual claims without Step 6 validation
- final unique angle
- final superiority component
- final CTA wording
- metadata
- image prompts
- copied competitor headings
- copied competitor tables
- copied competitor examples

## Verdict

`serpCompetitorVerdict.status` may be:

- `pass`
- `pass_with_warnings`
- `fail`
- `ask_user`

`serpCompetitorVerdict.action` may be:

- `continue_to_step6`
- `return_to_step4`
- `return_to_step3`
- `return_to_step2`
- `return_to_step1`
- `return_to_0B`
- `ask_user`
- `skip_page`

Step 5 may repair weak Step 5 fields up to 2 times. It must not auto-repair fewer than 3 direct competitor reviews, no primary SERP evidence, no fixed SERP context, access failure that prevents competitive read, major Step 1-4 contradiction, copy-like competitor material, no evidence-linked minimum bar, no evidence-linked opportunity gaps, no direction validation, or no defensible SERP strength judgment.

## Must Carry Forward

`mustCarryForward` must include:

- SERP context
- dominant SERP reality
- `serpStrengthLabel`
- `minimumBarToMatch`
- `opportunityGapsToExplore`
- direction validation
- imitation warnings
- `serpInformedScopeProtection`
- any `differentiationRequirement`
- `serpCompetitorSummaryStatement`

Final QA must include `serpCompetitorDeliveryProof`, and `differentiationDeliveryProof` when a differentiation requirement exists.
