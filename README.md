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

## Step 4 Next Action Contract

After Step 3 and before prewriting, V2 research, final copy, images, commit, deploy, or publishing, the agent must complete Step 4 from `workflows/13-cluster-strategy.md`. Step 4 creates `nextActionContract`, the journey lock for what the reader should naturally do after the page.

The contract must include `step0BContractHash`, `pageJobHash`, `searchIntentHash`, `pageFormatHash`, `nextActionHash`, `userJourneyStage`, `secondaryJourneyStages`, `secondaryStageNotes`, `primaryNextAction`, `secondaryNextActions`, `ctaStrength`, `ctaStrengthMapping`, `ctaStrengthExceptionReason`, `ctaStrengthExceptionEvidenceRefs`, `internalJourneyPath`, `nextActionStatement`, `stageEvidenceBasis`, `nextActionEvidenceBasis`, `step4InputFit`, `formatBoundaryCheck`, `businessRoleBoundaryCheck`, `brandConnectionFit`, `sensitiveActionRiskCheck`, `internalDestinationCheck`, `rejectedNextActions`, `nextActionUniquenessCheck`, `step4OutputMustNotContain`, `nextActionRepairLog`, `nextActionVerdict`, and `mustCarryForward`.

Step 4 must infer one primary `userJourneyStage` as `learning`, `evaluation`, or `action`, with up to 3 `secondaryJourneyStages` for adjacent readiness only. CTA strength follows strict `ctaStrengthMapping`: `learning` -> `soft`, `evaluation` -> `medium`, and `action` -> `direct`; exceptions require `ctaStrengthExceptionReason` plus evidence refs. `primaryNextAction` is the single main next step after the page satisfies the search need; `secondaryNextActions` must include 1-3 alternate or softer steps. Every action needs evidence refs and `finalCopyGuidance`, but exact CTA wording is banned.

`internalJourneyPath` must be primarily internal and use existing internal destinations when known. `internalDestinationCheck.destinationStatus` must be `existing_internal_destination`, `missing_but_recommended`, `external_destination`, or `ask_user_required`. If accessible inventory/repo pages exist, Step 4 must check them; if inaccessible, it may continue with `pass_with_warnings`. External destinations are allowed only for trust/safety/compliance, official guidance, platform docs, required third-party actions, or other recommended products. `brandConnectionFit` keeps the step user-first with `direct_business_connection`, `soft_brand_bridge`, `authority_building_internal_education`, or `no_brand_connection_reader_first_justified`.

Step 4 uses only inherited evidence from Step 0B, Step 1, Step 2, Step 3, and already-known site inventory or conversion destinations. It must not start new SERP, competitor, Reddit, video, PAA, or keyword research. It must reject at least 2 plausible wrong actions through `rejectedNextActions`, run `nextActionUniquenessCheck`, use broad placement guidance only, block exact CTA placement and copy through `step4OutputMustNotContain`, and route conflicts to `return_to_step3`, `return_to_step2`, `return_to_step1`, `return_to_0B`, `ask_user`, or `skip_page`. Final copy/page-packet QA must include `nextActionDeliveryProof`.

## Step 5 SERP Competitor Analysis

After Step 4 and before `current-page.lock`, prewriting, V2 research, final copy, images, commit, deploy, or publishing, the agent must complete Step 5 from `workflows/13-cluster-strategy.md`. Step 5 creates `serpCompetitorAnalysis`, saved as both `serp-competitor-analysis.json` and `serp-competitor-analysis.md`, with a frozen `serpCompetitorHash`.

Step 5 must review the primary `targetKeyword` SERP and lighter supporting-query SERPs before the page is locked. It must collect the primary top 10 organic results when available, attempt direct review of the top 5 organic competitors, complete at least 3 direct competitor page reviews, and run top 3 light SERP checks for 3-5 important supporting queries when available. It must preserve original ranks, record replacements and exclusions, keep Reddit/forums/videos/official docs classified separately, and keep global benchmarks separate from the primary market competitor count.

The contract must include `serpContext`, `sourceRegistry`, `primarySerpResults`, `reviewedCompetitors`, `supportingQuerySerpChecks`, `serpFeatureInventory`, `marketSerpFitCheck`, `deviceSerpCheck`, `mobileFirstSerpInterpretation`, `globalBenchmarkRelevanceCheck`, `indiaGlobalInfluenceBoundary`, `serpCannibalizationCheck`, `differentiationRequirement` when needed, `commercialSerpSignals`, `serpQuestionAndRelatedSignals`, `serpStrengthLabel`, `minimumBarToMatch`, `opportunityGapsToExplore`, `coveragePatterns`, `contentAnglePatterns`, `depthBenchmark`, `trustSignalBenchmark`, `uxComponentBenchmark`, `competitorStrengthsToRespect`, `competitorWeaknessesAndGaps`, `serpInformedScopeProtection`, `directionValidation`, `competitorImitationRisk`, `analysisConfidence`, `batchSerpIsolationCheck`, `step5CompletenessChecklist`, `serpCompetitorSummaryStatement`, `serpCompetitorVerdict`, and `mustCarryForward`.

Step 5 is evidence-heavy but not an outline step. It may identify `superiorityComponentOpportunities`, useful gaps, scope protections, and later-step impacts, but it must not create final H1/H2/H3 structure, final factual claims, final unique angle, final superiority component, CTA wording, metadata, image prompts, or copied competitor material. Final copy/page-packet QA must later include `serpCompetitorDeliveryProof`, and `differentiationDeliveryProof` when Step 5 created a differentiation requirement.

## Step 6 Topic Research Bank

After Step 5 and before Step 7, prewriting, V2 research artifacts, final copy, images, commit, deploy, or publishing, the agent must complete Step 6 from `workflows/13-cluster-strategy.md`. Step 6 creates `topicResearchBank`, saved as both `topic-research-bank.json` and `topic-research-bank.md`, with a frozen `topicResearchHash`.

Step 6 must declare `researchDepthDecision` before collecting sources, create `researchAgenda`, separate `topicEvidenceSources` from `audienceSearchLanguageSources`, fill `sourceRegistry`, capture useful `extractedFacts`, group those facts into `researchBank`, prove `agendaCoverage`, cover Step 5 carry-forward requirements through `step5CarryForwardCoverage`, handle `sourceConflictNotes`, list `researchGaps`, capture weak material in `doNotUse`, complete `researchCompletenessChecklist`, produce `researchSummaryStatement`, return `topicResearchVerdict`, and freeze `mustCarryForward`.

Risk-tier minimums are enforced: `low_risk` needs 6+ credible sources and 20+ useful facts; `standard` needs 8+ credible sources, 2+ high/authoritative sources, and 30+ facts; `market_sensitive` needs 10+ credible sources, 2+ local/market sources, 2+ high/authoritative sources, and 35+ facts; `sensitive_or_medical` needs 12+ credible sources, 4+ authoritative medical/scientific/expert sources, and 45+ facts; and `high_competition_or_deep` needs 12-15+ credible sources, 4+ high/authoritative sources, and 50-70+ facts.

Competitor pages do not count as authoritative topic-research sources. Audience/search-language sources can support user questions, objections, phrasing, confusion, mistakes, and lived concerns, but not medical, legal, finance, safety, product-efficacy, or factual truth claims by themselves. Indian-market skincare, product, and service pages need local-market evidence for product availability, pricing or budget fit, Indian climate/context, local routines, regulations or labels, and brand/category fit; missing local support must be marked `unsupported_local_context`, softened, routed, or avoided.

Step 6 is not an outline or copy step. It must not create final H1/H2/H3 structure, final unique angle, required superiority component, CTA wording, metadata, image prompts, final copy, final citation display strategy, trust module design, or copied source/competitor material. Final copy/page-packet QA must later include `topicResearchDeliveryProof` for every Step 6 `mustCarryForward` item.

Step 6 returns `continue_to_step7` only after its evidence contract passes.

## Step 7 Unique Angle And Information Gain

After Step 6 and before Step 8, prewriting, structure, final copy, images, commit, deploy, or publishing, the agent must complete Step 7 from `workflows/13-cluster-strategy.md`. Step 7 performs no new research. It creates `uniqueAngleInformationGain`, saves `unique-angle-information-gain.json` and `unique-angle-information-gain.md`, and freezes `uniqueAngleHash`.

The contract includes all upstream hashes plus `primaryImprovementAngle`, 1-3 `supportingImprovementAngles`, `step5GapRouting`, `step6OpportunityRouting`, `informationGainAssets`, `baselineToMatch`, `areasToExceed`, `informationGainStatement`, `differentiationStatement`, `whyThisPageDeservesToCompeteStatement`, `informationGainQualificationCheck`, `formatCompatibilityCheck`, `safetyAndBrandFitCheck`, `originalityContract`, `multiSurfaceEvidenceCoverage`, `uniqueAngleUniquenessCheck`, `mustCarryForward`, `step7OutputMustNotContain`, `step7CompletenessChecklist`, `uniqueAngleRepairLog`, and `uniqueAngleVerdict`.

Every page needs one mandatory primary asset, one mandatory supporting asset, and one conditional optional supporting asset, each with `accessibleContentFallback`. The primary asset needs at least 2 Step 5 refs and 3 Step 6 evidence items from at least 2 credible sources. Require at least 2 `baselineToMatch` items and 5-7 distinct `areasToExceed`, with primary SERP, credible topic research, secondary-query/long-tail, and audience-language coverage collectively. Assets must pass the evidence + synthesis + action test, `formatCompatibilityCheck`, `safetyAndBrandFitCheck`, and the hard current-batch/historical `uniqueAngleUniquenessCheck`.

Step 7 may repair weak fields twice and returns `continue_to_step8` only after the contract passes. It must not create final outline, headings, section order, detailed asset content, final prose, CTA wording, metadata, image prompts, citation-display strategy, new research, or unsupported claims. Final copy/page-packet QA must include `informationGainDeliveryProof`; missing required delivery blocks publishing.

## Step 8 SEO Content Brief

After Step 7 and before Step 9 outline creation, prewriting, final copy, images, commit, deploy, or publishing, the agent must complete Step 8 from `workflows/13-cluster-strategy.md`. Step 8 creates `seoContentBrief`, saves `seo-content-brief.json` and `seo-content-brief.md`, and freezes `contentBriefHash`.

Step 8 is the writer-ready compiler for Steps 0A-7. It may translate upstream decisions into clear instructions, but it must not change strategy, start new research, invent missing evidence, create H1/H2/H3s, decide section order, write final prose, create metadata, image prompts, exact CTA wording, or exact citation placement. It hard-fails if any required upstream hash is missing: `step0AHash`, `step0BHash`, `pageJobHash`, `searchIntentHash`, `pageFormatHash`, `nextActionHash`, `serpCompetitorHash`, `topicResearchHash`, or `uniqueAngleHash`.

The brief must include `contentBriefSummaryStatement`, `readerOutcomePromise`, `provisionalWorkingTitle`, `targetWordCountContract`, `depthRequirements`, `depthBoundaries`, `instructionRegistry`, `upstreamCoverageMatrix`, `requiredInclusions`, `conditionalInclusions`, `exclusions`, `queryCoverageContract`, `sourceUseGuidance`, `assetBriefingContract`, `voiceAndQualityContract`, `readabilityAndScanabilityRequirements`, `antiGenericContract`, `synthesisRequirement`, `brandFitBoundaries`, `marketLocalizationRequirements`, `recencySensitivityCheck`, `readerObjectionHandling`, `internalLinkGuidance`, `practicalDeviceRequirements`, `minimumCompletenessStandard`, `draftRepairGuidance`, `batchBriefIsolationCheck`, `semanticBriefUniquenessCheck`, `contentBriefDeliveryProofRequirements`, `mustCarryForward`, `step8OutputMustNotContain`, `step8CompletenessChecklist`, `contentBriefRepairLog`, and `contentBriefVerdict`.

`targetWordCountContract` sets a hard `minimumWordCount` plus a soft `targetWordCountRange`; drafts below the floor fail and filler is forbidden. `depthRequirements` normally require 3-7 `highDepthRequirements`, 2-6 `supportingDepthRequirements`, and at least 2 `keepBriefOrExclude` items. The shared practical-device baseline lives in `config/step8-practical-device-baselines.json`; adapters must read that config and record page-specific minimums, replacements, reasons, and evidence.

Step 8 must include writer-facing `sourceUseGuidance`, `antiGenericContract`, `synthesisRequirement`, `brandFitBoundaries`, `readabilityAndScanabilityRequirements`, and market/localization requirements when relevant. `seo-content-brief.md` must maintain strict Markdown parity with the JSON for major decisions, while JSON remains the source of truth.

Step 8 returns `continue_to_step9` only after `contentBriefHash` is frozen. Step 9 must provide `contentBriefDeliveryProof` showing mandatory brief instructions are represented in the outline plan; Step 10 must map them to visible draft content; final QA must verify the delivered page still satisfies `contentBriefHash`, the word-count floor, completeness tests, safety boundaries, required assets, differentiation obligations, and exclusions.

## Step 9 SEO Page Outline

After Step 8 and before Step 10 drafting, final copy, images, commit, deploy, or publishing, the agent must complete Step 9 from `workflows/13-cluster-strategy.md`. Step 9 creates `seoPageOutline`, saves `seo-page-outline.json` and `seo-page-outline.md`, and freezes `pageOutlineHash`.

Step 9 is the blueprint gate. It converts the SEO content brief into a working H1, page flow, H2 sections, section obligations, asset placement, FAQ plan, and broad CTA/internal-link placement without writing final prose. It must carry all upstream hashes including `contentBriefHash`, and must include `workingH1`, `pageFlowType`, `pageFlowReason`, `pageFlowStep8Refs`, `readerJourneySummaryStatement`, `sectionSequenceRationale`, `mainIntentVisibilityCheck`, `outlineSections`, `queryCoveragePlan`, `assetPlacementPlan`, `internalLinkPlacementPlan`, `ctaPlacementPlan`, `faqPlan`, `contentBriefDeliveryProof`, optional `step8RefinementPatch`, `outlineOriginalityCheck`, `outlineScanabilityCheck`, `headingHierarchyCheck`, `batchOutlineIsolationCheck`, `outlineDeliveryProofRequirements`, `mustCarryForward`, `step9OutputMustNotContain`, `step9CompletenessChecklist`, `step9RepairLog`, and `pageOutlineVerdict`.

Normal pages should use 8-14 H2 sections unless Step 2 depth, Step 3 format, Step 8 brief, or page type justifies an exception. The main search intent must be visibly answered within the first 1-2 H2 sections. Only H2s get `sectionId`; H3s are nested without IDs. Each H2 must map to Step 8 instruction IDs, depth requirements, inclusions, assets, source-use guidance, or exclusions, and include `sectionRole`, `depthLevel`, `depthReason`, `expectedTreatment`, `contentObligations`, `transitionFromPrevious`, section-level query mapping, claim/evidence notes, and section-specific scope boundaries when needed.

Step 9 may apply only non-strategic Step 8 clarifications through `step8RefinementPatch`; strategic changes return to the owner step. It performs no new research and must not output final paragraphs, exact CTA wording, metadata, image prompts, exact asset rows/branches/copy, citation display strategy, new facts, copied competitor/source structure, or Step 10 draft copy. `seo-page-outline.md` must preserve Markdown parity with the JSON for H1, flow, H2 structure, depth map, asset placement, FAQ plan, verdict, and must-carry-forward summary.

Step 9 returns `continue_to_step10` only after `pageOutlineHash` is frozen. Step 10 and final QA must carry `pageOutlineHash` and provide `pageOutlineDeliveryProof`/`outlineDeliveryProof` showing section IDs, required assets, FAQ treatment, content-brief instructions, exclusions, intent visibility, and outline uniqueness were delivered or validly returned to the owner step.

## Step 10 SEO First Draft

After Step 9 and before Step 11 on-page SEO optimization, final copy, images, commit, deploy, or publishing, the agent must complete Step 10 from `workflows/13-cluster-strategy.md`. Step 10 creates `seoFirstDraft`, saves `seo-first-draft.json` and `seo-first-draft.md`, and freezes `firstDraftHash`.

Step 10 writes the first full draft from the frozen `pageOutlineHash`. It must carry all upstream hashes including `contentBriefHash` and `pageOutlineHash`, and must include `draftSummaryStatement`, `h1`, `wordCountContract`, `draftSections`, `introductionQualityGate`, `sectionExpansionGate`, `draftCompletenessProof`, `requiredAssetDelivery`, `draftClaimSafetyCheck`, `naturalQueryCoverageCheck`, `draftReadabilityScanabilityGate`, `faqDraftDelivery`, `ctaInternalLinkDelivery`, `voiceAndBrandFitCheck`, `draftUniquenessCheck`, `antiGenericDraftGate`, `firstDraftDeliveryProofRequirements`, `mustCarryForward`, `step10OutputMustNotContain`, `step10CompletenessChecklist`, and `firstDraftVerdict`.

Each `draftSections` item must include actual section copy, `sectionId`, heading, outline refs, evidence refs when required, depth proof, examples used, obligations fulfilled, and relevant claim/CTA/link notes. High-depth/core sections must expand with definition or explanation, why it matters, process or decision rule, example, caveat or mistake when relevant, and transition. The introduction must pass `introductionQualityGate` by starting with the reader's real problem, confirming intent, promising the page outcome, setting scope, avoiding generic filler, and leading into the page.

The draft must meet Step 8 `minimumWordCount` without padding or repetition. Required assets must appear visibly as text, table, checklist, flow, matrix, framework, decision rule, or accessible fallback. Planned FAQ answers and draft CTA/internal-link copy must be written. New factual claims are forbidden unless routed back to Step 6; audience-language evidence cannot support factual claims.

`antiGenericDraftGate` blocks placeholders and generic prose such as "This section should explain", "Use this section to", "It is important to", vague "choose the right product" advice, or contextless "consult a professional". `draftUniquenessCheck` blocks repeated intros, body patterns, examples, tables, FAQ answers, CTA copy, and asset logic across current-batch and accessible historical pages.

Step 10 returns `continue_to_step11` only after `firstDraftHash` is frozen. Step 11 may optimize on-page SEO, but it must carry `firstDraftHash` and produce `firstDraftDeliveryProof`; final QA must verify the draft's section content, assets, claims, FAQ, CTA/internal links, intro promise, high-depth substance, anti-generic rules, and completeness were preserved or validly improved.

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

Each selected batch page must first pass Step 0B, Step 1, Step 2, Step 3, Step 4, Step 5, Step 6, Step 7, Step 8, Step 9, and Step 10, receiving its own Page Scope Contract, Page Job Contract, Search Intent Contract, Page Format Contract, Next Action Contract, SERP Competitor Analysis, Topic Research Bank, Unique Angle And Information Gain contract, SEO Content Brief, SEO Page Outline, and SEO First Draft. Batch mode must run duplicate and isolation checks across current-batch and historical pages before generation by comparing `targetKeyword`, `targetQueryIntent`, `primaryIntent`, `primaryReaderStage`, `pageType`, `pageScopeSummary`, `uniqueContribution`, `mustCover`, `mustNotCover`, `nextActionStatement`, `serpCompetitorSummaryStatement`, `researchSummaryStatement`, `primaryImprovementAngle`, `informationGainAssets`, `areasToExceed`, `contentBriefSummaryStatement`, `readerOutcomePromise`, `instructionRegistry`, `antiGenericContract`, `workingH1`, `pageFlowType`, `sectionSequenceRationale`, `outlineSections`, `faqPlan`, `assetPlacementPlan`, `draftSummaryStatement`, `draftSections`, `requiredAssetDelivery`, `faqDraftDelivery`, `ctaInternalLinkDelivery`, `antiGenericDraftGate`, `mustCarryForward`, and optional `componentOpportunityHint`. Pages that only differ by keyword wording, share the same body promise, or would reuse the same section plan, SERP competitor findings, topic research bank, unique-angle logic, SEO content brief, SEO page outline, SEO first draft, examples, mistakes, reader questions, or decision content must be merged, split, repaired, rerouted, or blocked before downstream work. In batch mode, create `current-page.lock` only after Step 5 passes with action `continue_to_step6`; run Steps 6, 7, 8, 9, and 10 under that page lock and do not start Step 11 or downstream page work until Step 10 passes with action `continue_to_step11`.

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
