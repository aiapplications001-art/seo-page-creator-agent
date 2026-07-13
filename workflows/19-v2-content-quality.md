# V2 Content Quality Workflow

V2 is a host-agent-first workflow. The CLI creates and checks deterministic artifacts, but the host agent performs live research, reviews sources, writes the copy, records judgment notes, and fills the artifacts.

Generate one page packet at a time. Start with one product/category cluster, one selected page, one audience definition, and one conversion goal.

V2.1 adds a human editorial layer before final copy. The Human Editorial Brief and Claim-First Section Plan are internal by default; the editor should normally see only a short summary in the QA report.

## Required Upstream Contract

Before downstream V2 research, drafting, final copy, image, commit, deploy, or publishing work begins, the cluster must have passing Step 0A through Step 10 contracts from `workflows/13-cluster-strategy.md`, ending with Step 10 SEO First Draft before Step 11 optimization begins.

The Step 0A foundation artifact must include:

- `selectedTopic`
- `topicBoundarySummary`
- `businessSideRelevance`
- `primarySearchProblem`
- `searchProblemBoundarySummary`
- `wrongPageRisk`
- `desiredOutcome`
- `readerState`
- `problemLanguage`
- `relationshipCheck`
- `foundationVerdict`
- `mustCarryForward`

Step 0A must prove that the topic, search problem, and problem-language connect clearly before V2 begins. `businessSideRelevance` must be evidence-based; business relevance is unclear is a critical blocker. `problemLanguage` must include 8 cleaned natural user phrases, at least 5-6 evidence-backed phrases, `cleanedPhrase`, source excerpt, `sourceRef`, `sourceType`, and `sourceClass` for evidence-backed entries. `sourceClass` must separate `search_surface` from `audience_language`, and at least one `audience_language` source is mandatory when available. At least 6/8 phrases must support the `primarySearchProblem`, at most 2/8 may be adjacent, and 0 contradictions are allowed.

The Page Scope Contract must include:

- `targetKeyword`
- `targetQueryIntent`
- `queryCluster`
- `selectedOpportunity`
- `pageScopeSummary`
- `uniqueContribution`
- `mustCover`
- `mustNotCover`
- `businessGoal`
- `existingUrlAction`
- rough `slugCandidate`
- frozen `contractHash`

Step 0B must have live keyword/search evidence from at least two approved source types, one true search-demand source, a light SERP overlap/page-type check for clustering and splitting, routed candidate phrases, a dominant fixed-enum `primaryIntent`, fixed-enum `pageType`, fixed-enum `primaryReaderStage`, evidence-linked `mustCover`, routed `mustNotCover`, and batch duplicate checks when applicable.

The Step 1 `pageJobContract` must include:

- `step0BContractHash`
- `pageJobHash`
- `pageJobStatement`
- `audience` with `audienceSentence`
- `userTask` with `taskConstraints`, `successCriteria`, and `nonGoals`
- `primaryHelpFormat`
- `secondaryHelpFormats`
- `userOutcome` with `outcomeConsequence`
- `businessRole` with `primaryBusinessRole`
- `riskLayer` with `riskLevel` and `claimSensitivity`
- `evidenceBasis`
- `jobUniquenessCheck`
- `pageJobVerdict`
- `inferenceRepairLog`

Step 1 must infer the page job from Step 0A and Step 0B. It must not directly modify Step 0B; if the selected opportunity or scope is wrong, return `return_to_0B`. Prewriting must not directly modify Step 1; if the page job is wrong or incomplete, return `return_to_step1`.

The Step 2 `searchIntentContract` must include `step0BContractHash`, `pageJobHash`, `searchIntentHash`, `intentStatement`, `dominantBroadIntent`, optional `coPrimaryBroadIntent`, `primaryDeeperIntent`, optional `projectSpecificIntentLabel`, `depthLevel`, `depthStyle`, `satisfactionCondition`, `tooShallowIf`, `wrongPageIf`, `recommendedPageType`, `dominantInternalContentFormat`, `supportingContentFormats`, `lightSerpValidation`, `mixedIntentHandling`, `pageJobAlignmentCheck`, `validatedIntentDecision`, `marketContextCheck`, optional `aiOverviewIntentSignal`, `intentVerdict`, `intentRepairLog`, and `mustCarryForward`.

Step 2 must check the top 5 SERP results lightly for result type and intent pattern. Normal pass requires 3/5 support for `dominantBroadIntent` and `primaryDeeperIntent`; 2/5 may continue only as non-critical `pass_with_warnings` when PAA, autocomplete, related searches, query cluster, and other search-surface evidence support the decision. `mixedIntentHandling` must route non-dominant intents as `adjacent` or `conflicting`. `validatedIntentDecision` must say whether evidence `confirm`, `refine`, or `correct` the query-only hypothesis. `marketContextCheck` must confirm target-market fit, and `aiOverviewIntentSignal` may be used only as optional light intent evidence, not factual authority.

Step 2 action must be `continue_to_prewriting`, `return_to_step1`, `return_to_0B`, `ask_user`, or `skip_page`. It may repair weak Step 2 fields up to 2 times, but true Step 0B mismatch, true Step 1 mismatch, no defensible dominant intent, no defensible primary deeper intent, or market-context mismatch must route back or block.

The Step 3 `pageFormatContract` must include `step0BContractHash`, `pageJobHash`, `searchIntentHash`, `pageFormatHash`, `primaryPageType`, `secondaryPageTypeInfluences`, `primaryInternalContentFormat`, `supportingFormatInfluences`, `supportingContentElements`, `step2RecommendationFit`, `formatEvidenceBasis`, `scopeBoundaryCheck`, `formatCompatibilityCheck`, `formatRiskCheck`, `formatUniquenessCheck`, `businessConnectionBoundary`, `adjacentNeedRouting`, `rejectedPageTypes`, `rejectedInternalFormats`, `formatDecisionStatement`, `step3OutputMustNotContain`, `formatRepairLog`, `formatVerdict`, and `mustCarryForward`.

Step 3 must choose one `primaryPageType`, one `primaryInternalContentFormat`, and 3-6 `supportingContentElements` with `allowedScope` and `notAllowedScope`. It uses inherited light evidence only from Step 0B, Step 1, and Step 2. It must not start new research, create headings, outline, CTA strategy, metadata, competitor gaps, final copy, image prompts, image manifest, or layout specification. It can define `businessConnectionBoundary` and scoped visual/media supporting elements only.

Step 3 action must be `continue_to_prewriting`, `return_to_step2`, `return_to_step1`, `return_to_0B`, `ask_user`, or `skip_page`. `formatVerdict` uses pass, pass_with_warnings, fail, or ask_user with confidence, not a scorecard. Step 3 may repair weak Step 3 fields through `formatRepairLog` up to 2 times, but true Step 2 contradiction, true Step 1 mismatch, Step 0B conflict, unsafe sensitive-topic format, or no defensible primary format must route back or block.

The Step 4 `nextActionContract` must include `step0BContractHash`, `pageJobHash`, `searchIntentHash`, `pageFormatHash`, `nextActionHash`, `userJourneyStage`, `secondaryJourneyStages`, `secondaryStageNotes`, `primaryNextAction`, `secondaryNextActions`, `ctaStrength`, `ctaStrengthMapping`, `ctaStrengthExceptionReason`, `ctaStrengthExceptionEvidenceRefs`, `internalJourneyPath`, `nextActionStatement`, `stageEvidenceBasis`, `nextActionEvidenceBasis`, `step4InputFit`, `formatBoundaryCheck`, `businessRoleBoundaryCheck`, `brandConnectionFit`, `sensitiveActionRiskCheck`, `internalDestinationCheck`, `rejectedNextActions`, `nextActionUniquenessCheck`, `step4OutputMustNotContain`, `nextActionRepairLog`, `nextActionVerdict`, and `mustCarryForward`.

Step 4 must choose exactly one primary `userJourneyStage` from `learning`, `evaluation`, or `action`, allow up to 3 `secondaryJourneyStages`, and choose exactly one `ctaStrength` from `soft`, `medium`, or `direct`. `ctaStrength` follows `ctaStrengthMapping` by default: learning -> soft, evaluation -> medium, action -> direct. Exceptions require `ctaStrengthExceptionReason` and `ctaStrengthExceptionEvidenceRefs`. It must define exactly one `primaryNextAction`, 1-3 `secondaryNextActions`, and an `internalJourneyPath` that avoids dead-end content. Every next action needs evidence refs and `finalCopyGuidance` without exact CTA wording.

Step 4 uses inherited evidence only from Step 0B, Step 1, Step 2, Step 3, and already-known site inventory or conversion destinations. Accessible site inventory or repo pages must be checked; inaccessible inventory may continue with `pass_with_warnings`. `internalDestinationCheck.destinationStatus` must be `existing_internal_destination`, `missing_but_recommended`, `external_destination`, or `ask_user_required`. `brandConnectionFit` must be `direct_business_connection`, `soft_brand_bridge`, `authority_building_internal_education`, or `no_brand_connection_reader_first_justified`. It must run `nextActionUniquenessCheck`, reject at least 2 plausible wrong actions, use broad placement guidance only, and must not start new SERP research, competitor analysis, Reddit/video/PAA research, outline work, exact CTA placement, CTA copy, final prose, metadata, image prompts, image manifest, or publishing instructions.

Step 4 action must be `continue_to_prewriting`, `return_to_step3`, `return_to_step2`, `return_to_step1`, `return_to_0B`, `ask_user`, or `skip_page`. `nextActionVerdict` uses pass, pass_with_warnings, fail, or ask_user with confidence, not a scorecard. Step 4 may repair weak Step 4 fields through `nextActionRepairLog` up to 2 times, but unsafe sensitive destination, impossible internal destination, business positioning conflict, true Step 3 format conflict, true Step 2 stage/intent conflict, true Step 1 business-role conflict, Step 0B scope conflict, no defensible primary next action, or no defensible CTA strength must route back or block.

The Step 5 `serpCompetitorAnalysis` must include `step0BContractHash`, `pageJobHash`, `searchIntentHash`, `pageFormatHash`, `nextActionHash`, `serpCompetitorHash`, `serpContext`, `sourceRegistry`, `primarySerpResults`, `reviewedCompetitors`, `supportingQuerySerpChecks`, `serpFeatureInventory`, `marketSerpFitCheck`, `deviceSerpCheck`, `mobileFirstSerpInterpretation`, `globalBenchmarkRelevanceCheck`, `indiaGlobalInfluenceBoundary`, `serpCannibalizationCheck`, optional `differentiationRequirement`, `commercialSerpSignals`, `serpQuestionAndRelatedSignals`, `serpStrengthLabel`, `minimumBarToMatch`, `opportunityGapsToExplore`, `coveragePatterns`, `contentAnglePatterns`, `depthBenchmark`, `trustSignalBenchmark`, `uxComponentBenchmark`, `competitorStrengthsToRespect`, `competitorWeaknessesAndGaps`, `serpInformedScopeProtection`, `directionValidation`, `competitorImitationRisk`, `analysisConfidence`, `batchSerpIsolationCheck`, `step5CompletenessChecklist`, `serpCompetitorSummaryStatement`, `serpCompetitorVerdict`, and `mustCarryForward`.

Step 5 must save both `serp-competitor-analysis.json` and `serp-competitor-analysis.md`. For the primary `targetKeyword`, collect the top 10 organic results when available, attempt direct page review for the top 5 organic competitors, and complete at least 3 direct competitor reviews. For supporting queries, check 3-5 important Step 0B supporting queries with top 3 light SERP checks when available. Preserve original ranks, record `excludedResults`, classify Reddit/forums/videos/official docs separately, and keep global benchmarks separate from the primary market competitor count.

Step 5 must evidence-link major conclusions, keep `minimumBarToMatch` separate from `opportunityGapsToExplore`, run moderate `serpCannibalizationCheck` when inventory is accessible, create `differentiationRequirement` for continuing partial overlap, and route every synthesized strength/gap through `utilizationRouting` or `pageImpact`. It may identify `superiorityComponentOpportunities`, but must not create final H1/H2/H3 structure, final factual claims, final unique angle, final superiority component, CTA copy, metadata, image prompts, or copied competitor material.

Step 5 action must be `continue_to_step6`, `return_to_step4`, `return_to_step3`, `return_to_step2`, `return_to_step1`, `return_to_0B`, `ask_user`, or `skip_page`. It may repair weak Step 5 fields up to 2 times, but fewer than 3 direct competitor reviews, no primary SERP evidence, no fixed SERP context, access failure that prevents competitive read, major Step 1-4 contradiction, copy-like competitor material, no evidence-linked minimum bar, no evidence-linked opportunity gaps, no direction validation, or no defensible SERP strength judgment must route back, ask, fail, or skip in batch.

The Step 6 `topicResearchBank` must include `step0BContractHash`, `pageJobHash`, `searchIntentHash`, `pageFormatHash`, `nextActionHash`, `serpCompetitorHash`, `topicResearchHash`, `researchDepthDecision`, `researchAgenda`, `sourceRegistry`, `topicEvidenceSources`, `audienceSearchLanguageSources`, `extractedFacts`, `agendaCoverage`, `step5CarryForwardCoverage`, `researchBank`, `sourceConflictNotes`, `researchGaps`, `doNotUse`, `mustCarryForward`, `researchCompletenessChecklist`, `researchSummaryStatement`, and `topicResearchVerdict`.

Step 6 must save both `topic-research-bank.json` and `topic-research-bank.md`. It must declare the research depth tier before source collection; enforce source and fact minimums by risk tier; keep competitor pages out of authoritative topic evidence; separate topic evidence from audience/search-language evidence; evidence-link examples, workflows, common mistakes, and reader questions; require local-market evidence for India-sensitive claims; handle source conflicts; capture weak or unsafe material in `doNotUse`; and prohibit copied source, product, or competitor material. It must not create final outline, H1/H2/H3 structure, final unique angle, required superiority component, CTA copy, metadata, image prompts, final prose, citation display strategy, or trust module design.

Step 6 action must be `continue_to_step7`, `return_to_step5`, `return_to_step4`, `return_to_step3`, `return_to_step2`, `return_to_step1`, `return_to_0B`, `ask_user`, or `skip_page`. It may repair weak Step 6 fields up to 2 times, but no credible topic sources, no authoritative support for critical claims, unresolved critical research gaps, no required local-market evidence, copied source material, or major Step 0B-5 contradictions must route back, ask, fail, or skip in batch.

The Step 7 `uniqueAngleInformationGain` must save `unique-angle-information-gain.json` and `unique-angle-information-gain.md`, freeze `uniqueAngleHash`, carry all upstream hashes, and include `primaryImprovementAngle`, 1-3 `supportingImprovementAngles`, `step5GapRouting`, `step6OpportunityRouting`, `informationGainAssets`, `baselineToMatch`, `areasToExceed`, `informationGainStatement`, `differentiationStatement`, `whyThisPageDeservesToCompeteStatement`, `informationGainQualificationCheck`, `formatCompatibilityCheck`, `safetyAndBrandFitCheck`, `originalityContract`, `multiSurfaceEvidenceCoverage`, `uniqueAngleUniquenessCheck`, `mustCarryForward`, `step7OutputMustNotContain`, `step7CompletenessChecklist`, `uniqueAngleRepairLog`, and `uniqueAngleVerdict`.

Step 7 performs no new research. Require one mandatory primary asset, one mandatory supporting asset, and one conditional optional asset, all with `accessibleContentFallback`. The primary asset needs at least 2 Step 5 refs and 3 Step 6 evidence items from at least 2 credible sources. Require at least 2 `baselineToMatch` items and 5-7 distinct `areasToExceed` with multi-surface evidence. Hard-block weak information gain, Step 3 incompatibility, unsafe or conversion-first assets, current-batch duplication, copied competitor logic, and missing mandatory evidence. Step 7 action must be `continue_to_step8`, `return_to_step6`, `return_to_step5`, `return_to_step4`, `return_to_step3`, `return_to_step2`, `return_to_step1`, `return_to_0B`, `ask_user`, or `skip_page`.

The Step 8 `seoContentBrief` must save `seo-content-brief.json` and `seo-content-brief.md`, freeze `contentBriefHash`, carry `step0AHash`, `step0BHash`, `pageJobHash`, `searchIntentHash`, `pageFormatHash`, `nextActionHash`, `serpCompetitorHash`, `topicResearchHash`, and `uniqueAngleHash`, and include `contentBriefSummaryStatement`, `readerOutcomePromise`, `provisionalWorkingTitle`, `targetWordCountContract`, `depthRequirements`, `depthBoundaries`, `instructionRegistry`, `upstreamCoverageMatrix`, `requiredInclusions`, `conditionalInclusions`, `exclusions`, `queryCoverageContract`, `sourceUseGuidance`, `assetBriefingContract`, `voiceAndQualityContract`, `readabilityAndScanabilityRequirements`, `antiGenericContract`, `synthesisRequirement`, `brandFitBoundaries`, `marketLocalizationRequirements`, `recencySensitivityCheck`, `readerObjectionHandling`, `internalLinkGuidance`, `practicalDeviceRequirements`, `minimumCompletenessStandard`, `draftRepairGuidance`, `batchBriefIsolationCheck`, `semanticBriefUniquenessCheck`, `contentBriefDeliveryProofRequirements`, `mustCarryForward`, `step8OutputMustNotContain`, `step8CompletenessChecklist`, `contentBriefRepairLog`, and `contentBriefVerdict`.

Step 8 is a compiler and must not start new research, change upstream strategy, invent missing evidence, create final H1/H2/H3s, choose section order, write final prose, create metadata, image prompts, exact CTA wording, or exact citation placement. It must use `config/step8-practical-device-baselines.json` for shared practical-device minimums, record page-specific adjustments and evidence, enforce a hard `minimumWordCount`, maintain Markdown parity for major decisions, and block generic brief logic through `antiGenericContract`, `synthesisRequirement`, `batchBriefIsolationCheck`, and `semanticBriefUniquenessCheck`.

Step 8 action must be `continue_to_step9`, `repair_step8`, `return_to_step7`, `return_to_step6`, `return_to_step5`, `return_to_step4`, `return_to_step3`, `return_to_step2`, `return_to_step1`, `return_to_0B`, `return_to_onboarding`, `ask_user`, or `skip_page`. It may repair weak Step 8 fields up to 2 times, but missing upstream hashes, missing brand voice, mandatory depth obligations, required assets, safety boundaries, evidence, current-batch uniqueness, hard word-count basis, Markdown parity, or strategy conflicts must route back, ask, fail, or skip in batch.

The Step 9 `seoPageOutline` must save `seo-page-outline.json` and `seo-page-outline.md`, freeze `pageOutlineHash`, carry `step0AHash`, `step0BHash`, `pageJobHash`, `searchIntentHash`, `pageFormatHash`, `nextActionHash`, `serpCompetitorHash`, `topicResearchHash`, `uniqueAngleHash`, and `contentBriefHash`, and include `workingH1`, `pageFlowType`, `pageFlowReason`, `pageFlowStep8Refs`, `readerJourneySummaryStatement`, `sectionSequenceRationale`, `mainIntentVisibilityCheck`, `outlineSections`, `queryCoveragePlan`, `assetPlacementPlan`, `internalLinkPlacementPlan`, `ctaPlacementPlan`, `faqPlan`, `contentBriefDeliveryProof`, optional `step8RefinementPatch`, `outlineOriginalityCheck`, `outlineScanabilityCheck`, `headingHierarchyCheck`, `batchOutlineIsolationCheck`, `outlineDeliveryProofRequirements`, `mustCarryForward`, `step9OutputMustNotContain`, `step9CompletenessChecklist`, `step9RepairLog`, and `pageOutlineVerdict`.

Step 9 is the blueprint gate. It may create a working H1 and H2 outline, but it must not write final paragraphs, exact CTA wording, metadata, image prompts, exact asset rows or branches, final citation display strategy, new facts, new claims, copied competitor/source structure, or Step 10 draft copy. It performs no new research. Normal pages should use 8-14 H2 sections unless Step 2 depth, Step 3 format, Step 8 brief, or page type justifies an exception. The main search intent must be visible within the first 1-2 H2 sections. Every H2 needs a `sectionId`, `sectionRole`, `mappedStep8Refs`, `depthLevel`, `depthReason`, `expectedTreatment`, `contentObligations`, query mapping, claim/evidence notes, and section-level scope boundaries when relevant.

Step 9 action must be `continue_to_step10`, `repair_step9`, `return_to_step8`, `return_to_step7`, `return_to_step6`, `return_to_step5`, `return_to_step4`, `return_to_step3`, `return_to_step2`, `return_to_step1`, `return_to_0B`, `ask_user`, or `skip_page`. It may repair weak Step 9 fields up to 2 times, but missing `contentBriefHash`, missing `contentBriefDeliveryProof`, hidden main intent, missing required assets, current-batch outline duplication, unsafe section plan, copied structure, or strategic conflicts must route back, ask, fail, or skip in batch.

V2 artifacts must reference the same `contractHash`, `step0BContractHash`, `pageJobHash`, `searchIntentHash`, `pageFormatHash`, `nextActionHash`, `serpCompetitorHash`, `topicResearchHash`, `uniqueAngleHash`, `contentBriefHash`, and `pageOutlineHash`. If V2 research shows the `targetKeyword`, `targetQueryIntent`, query cluster, selected opportunity, `pageScopeSummary`, `uniqueContribution`, `mustCover`, or `mustNotCover` is wrong, stop and regenerate Step 0B instead of silently expanding the page scope. If V2 research or prewriting shows the `pageJobStatement`, audience, user task, help format, outcome, business role, risk boundary, evidence basis, or uniqueness is wrong, stop and regenerate Step 1. If V2 research or prewriting shows the intent, expected depth, satisfaction condition, recommended page type, internal content format, or page-job alignment is wrong, stop and regenerate Step 2. If prewriting or later work changes page type, internal format, supporting elements, adjacent routing, or format boundaries, stop and regenerate Step 3. If prewriting or later work changes user journey stage, primary next action, secondary next actions, CTA strength, internal journey path, or next-action boundaries, stop and regenerate Step 4. If Step 6 research or later work changes SERP context, competitor set, SERP strength, minimum bar, opportunity gaps, cannibalization, differentiation requirement, or direction validation, stop and regenerate Step 5. If downstream work changes research depth tier, research agenda, source registry, agenda coverage, extracted facts, local-market evidence, source conflicts, `doNotUse`, or `mustCarryForward`, stop and regenerate Step 6. Final copy or page-packet QA must include `nextActionDeliveryProof`, `serpCompetitorDeliveryProof`, `differentiationDeliveryProof`, and `topicResearchDeliveryProof` when relevant.

All Step 8 and later artifacts must additionally carry `uniqueAngleHash`. If downstream work changes the primary/supporting angles, assets, baselines, `areasToExceed`, `whyThisPageDeservesToCompeteStatement`, or delivery requirements, stop and regenerate Step 7. Final copy or page-packet QA must include `informationGainDeliveryProof`. Step 7 `step7OutputMustNotContain` forbids final outline, headings, section order, detailed asset content, final prose, CTA wording, metadata, image prompts, citation-display strategy, new research, and unsupported claims.

All Step 9 and later artifacts must carry `contentBriefHash`. If downstream work changes writer instructions, word-count floor, depth obligations, source-use guidance, asset brief, voice, brand-fit boundaries, anti-generic rules, practical-device requirements, market/localization instructions, or delivery proof requirements, stop and regenerate Step 8. Step 9 must include `contentBriefDeliveryProof` for outline planning; Step 10 must map mandatory instructions to visible draft content; final QA must verify `contentBriefHash`, minimum word count, completeness tests, safety boundaries, required assets, differentiation obligations, and exclusions.

All Step 10 and later artifacts must carry `pageOutlineHash`. If downstream work changes the working H1, `pageFlowType`, H2 section order, `sectionId`s, section roles, content obligations, asset placement, FAQ plan, broad CTA/internal-link placement, scope boundaries, or outline delivery requirements, stop and regenerate Step 9. Step 10 and final QA must include `pageOutlineDeliveryProof` or `outlineDeliveryProof` showing the frozen outline was visibly delivered and not replaced by a generic reusable page structure.

## Command Order

```bash
seo-agent v2 prepare-page --cluster acne-treatment --page-id P1 --page-type product_category
seo-agent v2 status --cluster acne-treatment --page-id P1
seo-agent v2 validate-human --cluster acne-treatment --page-id P1
seo-agent v2 validate-gates --cluster acne-treatment --page-id P1
seo-agent v2 validate-depth --cluster acne-treatment --page-id P1
seo-agent final-copy expand --cluster acne-treatment --page-id P1
seo-agent v2 qa --cluster acne-treatment --page-id P1
seo-agent v2 debug-bundle --cluster acne-treatment --page-id P1
```

Use the existing image workflow after content passes:

```bash
seo-agent images plan --cluster acne-treatment --page-id P1
```

Refresh packets are built for changed sections only and should be written beside the V2 page packet artifacts.

## Mandatory Gates

The final page packet must not be generated until all mandatory gates pass.

1. SERP Research Ledger Gate
2. Social/Video Research Gate
3. Audience Definition Gate
4. Narrative Brief Gate
5. Citation Set Gate
6. Page Depth Contract

Hard gate failures cannot be overridden. Advisory scores can be overridden by an editor, but the override must not bypass missing research, unsupported claims, or missing required artifacts.

## SERP Research Ledger Gate

The host agent must review live search results before finalizing structure or copy.

- Top 10 meaningful SERP body extractions are required.
- Search up to 25 results when replacements are needed.
- Title, meta, H1, and H2 extraction alone does not count as a successful read.
- YouTube, Instagram, Shorts, and other social/video assets do not count toward the 10 SERP webpages.
- Forums, directories, marketplaces, and community pages can count only when genuinely ranking and useful, with a maximum of 2 in the 10.
- Official sources can enrich citations but cannot replace competitor/page research.

The ledger should store summaries, normalized hashes where possible, and excerpts of 500 characters or less.

## Social/Video Research Gate

Social and video research is mandatory because it improves human language, hooks, objections, and examples.

- Attempt at least 7 assets total.
- At least 5 assets must be successfully reviewed if accessible.
- If fewer than 5 are accessible, log why and mark limited confidence.
- Prioritize competitor/category creator videos, Shorts, reels, and captions.
- Comments may be used as audience-language signals only, not factual sources.
- Do not quote comments or creator scripts verbatim unless explicitly approved and legally safe.

## Audience Definition Gate

Before writing, define:

- Target cohort.
- Awareness stage.
- Reader takeaway.
- Top objections or trust barriers.
- CTA/actionable connection for the page.

Audience definition is a separate gate. It is not merged into citations or narrative brief.

## Narrative Brief Gate

The user must explicitly choose the page tone unless they say "you decide."

The host agent should recommend 2-3 tone options and ask the user to choose one primary style plus, optionally, one secondary flavor. It should also ask separately for the reader takeaway.

The Narrative Brief Gate must include:

- Primary narrative style.
- Optional secondary flavor.
- Opening angle.
- Brand point of view.
- Section-level writing direction.
- Objection awareness.
- Sensitivity note if the page touches health, finance, legal, safety, or similar topics.

Sensitive topics should avoid dramatic or high-pressure styles and prefer calmer expert/professional styles.

## Human Editorial Brief

After the Narrative Brief, complete `human-editorial-brief.json` and `human-editorial-brief.md`.

The brief should translate research and audience context into human editorial choices:

- Voice model: category manager with editorial empathy.
- Opinionation: adaptive by page type.
- Depth: comparison uses decision-relevant depth, product/category uses medium depth, guide/blog uses full depth.
- Background: decision-first, then 5W plus causal chain depth when useful.
- Examples: at least 2 useful examples or scenarios per page.
- Decision framework: required once per page, with user asked once for preferred format.
- Common mistakes: mandatory, blended into relevant sections by default.
- Not-right-for-you guidance: mandatory for product/category and comparison pages, recommended for guide/blog pages.
- Brand POV: clear but not salesy, with occasional first-person only where useful.
- Human devices: natural reader questions, practical analogies, mini decision trees, micro-summaries after complex explanations, and short human closing before CTA.

Example:

```yaml
reader_tension:
  what_reader_is_confused_about: "Why acne keeps returning even after changing products."
category_manager_pov:
  what_to_choose: "Start with understanding acne pattern before choosing stronger products."
  what_to_avoid: "Do not treat every breakout as random."
example_requirement:
  minimum_examples_per_page: 2
  priority: category context first, India context when relevant, brand context only with proof
```

## Claim-First Section Plan

Before final copy, complete `claim-first-section-plan.json` and `claim-first-section-plan.md`.

Start from `pageStructure.intentPattern`, `pageStructure.structureVariant`, and the exact `pageStructure.sections` generated by the Pre-Writing Strategy. Section IDs are stable within a page packet but are not globally fixed across all page types. Do not assume old category IDs such as `S3_context` or `S4_main_content`; every visible generated section needs a matching claim-first entry.

The structure must also be unique to the current page research. Before final copy, images, commit, or publish, compare the page structure against current-batch pages and historical pages from previous runs. Repeated section order, decision matrix shape, mistake/troubleshooting pattern, FAQ shape, superiority component, CTA placement, or CTA body can fail the page even when the wording is paraphrased. Different title, hook, or slug is insufficient.

Every visible section should have:

- Section claim.
- Reader question.
- Evidence needed, aligned to the section's `evidenceNeeded` array.
- Example or tradeoff.
- Caveat or not-right-for-you note where relevant.
- Decision purpose.
- Transition purpose.

This prevents sections from becoming keyword-shaped summaries. The section should earn its place by helping the reader understand, choose, avoid, compare, or act.

Example:

```yaml
section_id: S4_pricing_ranges
section_claim: Acne treatment pricing changes most when package scope, review cadence, and product format change.
reader_question: What will change the price for someone like me?
evidence_needed: Source-backed pricing model or package logic, plus a citation for any stated range.
example_or_tradeoff: A lower upfront plan can still be poor value if it excludes review support the reader needs.
decision_purpose: Help the reader compare cost against fit and expected support.
```

## Page Depth Contract

Before final copy, images, commit, or publishing, complete the depth artifacts and run:

```bash
seo-agent v2 validate-depth --cluster acne-treatment --page-id P1
```

The Page Depth Contract proves the agent did not merely count sources. It must show what was extracted, compared, synthesized, and applied to each section.

Required artifacts:

- `research-extraction-matrix.json`: at least 40 extracted facts, with at least 3 facts per analyzed source.
- `competitor-depth-delta.json`: primary keyword top 5 SERP pages with full competitor strength scoring, at least one secondary keyword or long-tail SERP with top 3 pages, at least 5 competing pages, and 10 specific improvements over them.
- `audience-pain-point-ledger.json`: at least 20 audience signals mapped to page sections.
- `pre-draft-synthesis-brief.json`: 500-900 words covering search intent, anxieties, competitor gaps, recommended angle, section promises, and evidence inventory.
- `pre-draft-quality-brief.json`: pre-copy proof that the page covers sub-intents, diagnostic depth, market nuance, safety/trust, a standout element, brand connection, publish-worthiness, SERP superiority, extractable answer targets, and internal links.
- `depth-score.json`: overall score at least 85, every dimension at least 4/5, at least 8 information-gain items, and section evidence budgets.

The Pre-Draft Quality Brief is the anti-thin-page gate. It must show:

- At least 6 sub-intents.
- At least 4 diagnostic depth items, such as identification tables, symptom-to-action maps, decision matrices, not-right-for-you guidance, or escalation criteria.
- At least 4 India-specific angles when India is part of the page promise.
- At least 4 safety/trust requirements for health, finance, legal, or other high-trust topics.
- One standout element competitors do not have.
- A natural brand connection that explains why the brand helps this reader's uncertainty.
- At least 8 real reader questions from SERP/social/video/forum research.
- At least 3 recommendation sanity checks for any products, tools, services, or actives mentioned.
- At least 5 claim-risk items that must be cited or carefully rewritten.
- At least 4 troubleshooting plan items that answer what to do if the advice makes things worse.
- 4-7 main intent dimensions, with superiority required on the top 4 intent dimensions and parity allowed only on lower-priority dimensions.
- At least 1 required superiority component custom-created from the specific research findings.
- At least 5 differentiated improvements across visible sections, each mapped to source refs and intent dimensions.
- At least 3 extractable answer blocks: quick answer near the top, decision/action answer, and troubleshooting/safety answer when relevant.
- A brand CTA fit that states the supported reader problem, supported CTA promise, and unsupported claims to avoid.
- At least 3 AI Overview/extractable answer targets.
- At least 5 internal link targets.

## SERP Superiority Gate

The page must deserve to compete, not merely be comprehensive.

Use a broader evidence set:

- Primary keyword top 5 SERP pages, fully scored.
- Secondary keyword or long-tail top 3 SERP pages, lightly scored for useful gaps.
- Reddit, forums, video/social, People Also Ask, and audience-language sources.
- AI Overview summary or equivalent search-summary weakness when available.
- Trust/citation sources for medical, skincare, safety, or other high-trust claims.

Competitor strength scoring must include `intentMatch`, `topIntentCoverage`, `depthAndSpecificity`, `decisionUsefulness`, `informationArchitecture`, `evidenceAndTrust`, `originalityInformationGain`, `audienceSpecificity`, `riskHandling`, `practicalCompleteness`, and `uxPageExperience`. A competitor is strong when it scores at least 4/5 on `intentMatch` and `topIntentCoverage`, at least 3/5 on `decisionUsefulness`, `depthAndSpecificity`, `practicalCompleteness`, and `uxPageExperience`, and includes at least 3 concrete evidence notes. Strong competitors make parity insufficient.

The agent must prove:

- Superiority on the top 4 main intent dimensions for the query.
- At least one major required superiority component, such as a decision matrix, diagnostic table, checklist, calculator-style table, flow, image, or interactive component.
- At least 5 differentiated improvements across sections. Differentiation may come from primary SERP gaps, secondary keyword gaps, long-tail variants, Reddit/forum/video gaps, PAA gaps, or AI Overview weaknesses.
- Source diversity from at least one primary SERP competitor, one secondary keyword or long-tail source, one audience-language source, and one trust/citation source when claims are medical, skincare, or safety-related.
- A final `whyThisDeservesToRank` explanation in plain human language.

The required superiority component must serve the reader first. Include a light brand-fit explanation only where natural. If no strong competitor component exists, the agent must prove it reviewed the top competitors and explain why the new component fills an empty gap.

Pre-draft planning is not enough. The promised top-4 intent wins, required superiority component, differentiated improvements, extractable answer blocks, and citation/source handling must appear in `final-copy-draft.json` and the final expanded copy.

## Research-Derived Structure Gate

The Pre-Draft Quality Brief must include `researchDerivedStructurePlan`. This is a hard blocker before final copy, even for one-off pages, because one weak structure can become the next reusable template.

The plan must prove:

- The main search intent and primary reader concern are visible within the first 3 visible sections.
- Important risk, harm, safety, price, eligibility, or action information is not buried behind generic background.
- Normal informational sections have at least 2 evidence links.
- Decision tools, matrices, comparison tables, troubleshooting blocks, FAQs, superiority components, and CTA structure decisions have at least 3 evidence links.
- Objection, mistake, troubleshooting, and FAQ sections include at least one audience-language source such as Reddit, forum, video, social, PAA, or long-tail evidence.
- Differentiation or superiority sections include at least one primary or secondary SERP competitor gap source.
- Medical, skincare, safety, or brand-capability claims include trust/citation evidence or are softened.
- The structure has at least one research-derived mutation: add, expand, reorder, replace, merge, or remove.
- The page structure is materially different from current batch pages and historical pages from previous runs. Shared body section patterns are forbidden.

`final-copy-draft.json` must include `structurePlanDeliveryProof`. The proof must point to visible snippets in the final section markdown showing that the primary concern, every high-impact structure component, and every promised visible section output made it into final copy. Strategy notes alone do not count.

## Publish-Worthiness Gate

The Pre-Draft Quality Brief must prove the page is publish-worthy before prose exists. A page that has headings, a table, and a CTA can still fail if it does not answer real reader doubts, sanity-check recommendations, ground risky claims, include troubleshooting, and connect the brand CTA honestly.

For skincare and other high-trust pages, the host agent must explicitly plan:

- Reader questions: long-tail doubts and objections the final copy will answer.
- Recommendation sanity: why each recommended product, active, service, or tool belongs, who should avoid it, and what evidence is required.
- Claim risk: phrases such as clinically proven, dermatologist-approved, safest, non-comedogenic, guaranteed, AI diagnosis, or direct detection claims that need citations or softer wording.
- Troubleshooting: what to do if the routine, product, treatment, or advice causes breakouts, tightness, irritation, burning, worsening symptoms, or no improvement.
- Brand CTA fit: what the brand can genuinely help track, compare, or clarify, plus what it must not claim.

Weak filler is not allowed even when counts are met. Reject entries such as "What is this?", "Recommend good products", "Cite claims", or "Help if it gets worse." Every reader question, recommendation sanity check, claim-risk item, and troubleshooting item must be specific, evidence-aware, and decision-useful.

Every item inside `readerQuestionCoverage`, `recommendationSanityPlan`, `claimRiskPlan`, and `troubleshootingPlan` must be a structured object with `item`, `sourceRefs`, `mappedSectionId`, `whyThisMatters`, and `finalCopyUse`. `sourceRefs` must point to extracted fact ids, audience signal ids, or analyzed source URLs already present in the depth artifacts, so the publish-worthiness plan is evidence-linked instead of invented.

Every major section must meet or exceed its generated `evidenceBudget`. If an older artifact has no generated budget, use the fallback minimum:

- 2 specific facts.
- 1 cited claim.
- 1 concrete usefulness item such as an example, use case, diagnostic cue, decision rule, mistake, comparison, table, or checklist.

Variant-specific proof is mandatory: comparison pages need methodology and matrix evidence, best-list pages need ranking criteria, pricing pages need cost drivers and price/source caveats, local pages need local availability or service-area proof, and how-to pages need step rationale plus safety or escalation boundaries.

If the Page Depth Contract fails during repair, add new research before rewriting prose. A repair that only rephrases shallow copy is not a valid repair.

## Step 10 SEO First Draft Gate

Before final-copy expansion or Step 11 on-page SEO optimization, the host adapter must create `seoFirstDraft` as `seo-first-draft.json` and `seo-first-draft.md`, freeze `firstDraftHash`, and prove the draft follows the frozen `pageOutlineHash`.

Step 10 is the drafting step, not the optimization step. It writes actual section-by-section prose in `draftSections`, including required assets, FAQ answers, and draft CTA/internal-link copy. It must not change the outline, start new research, invent factual claims, create metadata, finalize citation display, create image prompts, or leave placeholders.

Every first draft must include:

- `draftSummaryStatement`
- `wordCountContract` with Step 8 `minimumWordCount`, actual word count, and no-padding proof
- `draftSections` with `sectionId`, heading, draft copy, outline refs, evidence refs when required, `depthProof`, examples, obligations fulfilled, and claim/CTA/link notes
- `introductionQualityGate`
- `sectionExpansionGate`
- `draftCompletenessProof`
- `requiredAssetDelivery`
- `draftClaimSafetyCheck`
- `naturalQueryCoverageCheck`
- `draftReadabilityScanabilityGate`
- `faqDraftDelivery`
- `ctaInternalLinkDelivery`
- `voiceAndBrandFitCheck`
- `draftUniquenessCheck`
- `antiGenericDraftGate`
- `firstDraftDeliveryProofRequirements`
- `step10OutputMustNotContain`
- `step10CompletenessChecklist`
- `firstDraftVerdict`

High-depth, safety, recommendation, comparison, troubleshooting, example-heavy, asset/component, claim-heavy, factual, medical, finance, legal, product, market, pricing, or safety sections require evidence refs. New factual claims must return to Step 6. Audience-language evidence cannot be used as factual proof.

The intro must start with the reader's real problem or task, confirm intent, state the page promise, set scope, avoid generic filler, and lead into the page. High-depth/core sections must expand with definition or explanation, why it matters, process or decision rule, example/scenario, caveat or mistake when relevant, and transition.

Required assets must be visibly delivered as text, table, checklist, flow, matrix, framework, decision rule, or accessible fallback. Planned FAQ must be drafted. Draft CTA/internal-link copy must appear where planned and remain non-final for later optimization.

`antiGenericDraftGate` rejects placeholder and generic prose such as "This section should explain", "Use this section to", "It is important to", vague "choose the right product", and contextless "consult a professional". `draftUniquenessCheck` rejects repeated intros, body patterns, examples, tables, FAQ answers, CTA copy, and asset logic across current-batch and accessible historical pages.

`firstDraftVerdict.status` may be `pass`, narrow `pass_with_warnings`, `fail`, or `ask_user`; the only onward action is `continue_to_step11`. Step 10 may repair weak draft fields up to 3 times. Missing evidence, unsupported risky claims, unsafe advice, structural conflicts, missing hashes, below-floor word count, current-batch duplication, or required assets undefined upstream return to the owner step, ask, or skip.

Step 11 and final QA must include `firstDraftDeliveryProof`, proving section content, required assets, claim handling, FAQ, CTA/internal links, intro promise, high-depth substance, anti-generic rules, and completeness were preserved or intentionally improved.

## Final Copy Draft Gate

The deterministic CLI does not write V2.1 final prose. The host adapter must fill `final-copy-draft.json` with adapter-written section markdown after `validate-human`, `validate-gates`, and `validate-depth` pass.

`seo-agent final-copy expand` validates and merges `final-copy-draft.json` into `page-packet.expanded.json` and `page-packet.expanded.md`. It must reject placeholder or scaffold prose such as "This section should", "Use this section", "Replace this", "Editable scaffold", or "Reference URLs still need".

Every visible informational section in `final-copy-draft.json` needs evidence refs and citation claim ids. The references section must be populated from real source records, not placeholder instructions.

`final-copy-draft.json` must include `superiorityProof` and `structurePlanDeliveryProof`. This proof must show:

- 4 delivered intent wins with section ids, evidence refs, and visible final-copy evidence.
- At least 1 visible superiority component.
- 5 visible differentiated improvements.
- 3 visible extractable answer blocks: quick answer, decision/action answer, and troubleshooting/safety answer when relevant.
- Visible citation/source handling for important medical, skincare, safety, or brand-capability claims.
- `whyThisDeservesToRank`, a human-readable summary of why this page can compete.
- Visible delivery of `researchDerivedStructurePlan`: primary concern near the top, high-impact components, and promised visible outputs.

When a V2 workspace exists for a page, advancement commands enforce this contract:

- `seo-agent final-copy expand` refuses to run until `validate-human`, `validate-gates`, and `validate-depth` pass, and then refuses to emit expanded artifacts unless `final-copy-draft.json` passes final-copy validation.
- `seo-agent images plan` refuses to run until `validate-human`, `validate-gates`, and `validate-depth` pass.
- Publish adapters should call the same transaction guard before committing or deploying.

## Citation Set Gate

Every high-strength or critical claim must have source support. Critical claims should be rewritten down automatically when possible. If a user insists on a critical claim, require explicit approval and source support.

Use natural visible links where helpful. Include a references/source metadata section. Machine-readable JSON should mirror source mappings. Invisible or unstyled links may be recommended only when not deceptive and when the CMS/editor can control final styling.

## QA And Repair

The QA report is required before final packet release.

- Final gate status requires both machine-checkable fields and host-agent judgment notes.
- Include overall advisory score and subscores.
- Include section-level scores and brief notes.
- Every visible changed/final section must meet the section threshold, default 70.
- Auto-repair once for safe issues, then re-score.
- Include auto-repair summary and top remaining recommendations only if repair actually happened.
- If the second manual reattempt fails, revisit research and narrative artifacts before trying again.
- Show brief failed excerpts only when useful; do not publish the full failed draft.

No hard-gate override is allowed.

## Content And Publishing State

`content_ready` means the final page packet and editorial QA report can be reviewed by an editor.

`publish_ready` means content is ready and image requirements are also complete:

- Image manifest exists.
- `IMG_OG` exists.
- `IMG_HERO` exists and maps to `S1_hero`.
- Prompt-only required images count only when accepted by the user.

Final editor-facing outputs are the final page packet, editorial QA report, and image manifest. Internal research artifacts stay in page state/debug bundle unless requested.

## Image Workflow After Content Passes

Run image planning after content passes. The final packet should reference image slots, while the image manifest carries file paths, URLs, prompts, licensing/source metadata, and image QA.

Required image rules:

- `IMG_OG` is separate from in-page visuals.
- `IMG_HERO` is mandatory for every page packet.
- Generate actual image files when possible.
- Prompt-only is acceptable only after timeout/failure or user choice.
- Logo usage is mandatory for OG and hero visuals unless the user or brand guideline disallows it.

## Refresh Workflow

Refresh packets should cover only changed sections and update rationale. Apply hard gates only to changed sections and affected claims unless the core intent or page strategy changed.

Record section version history with hashes and short excerpts. Use event type `refresh_update` for refresh edits.

## Debugging

Use the debug bundle only for troubleshooting bad output or missing artifacts:

```bash
seo-agent v2 debug-bundle --cluster acne-treatment --page-id P1
```

The debug bundle should include summaries and artifact paths, not full scraped pages or large image binaries.
