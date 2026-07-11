# Step 6 Topic Research Bank Design

## Purpose

Step 6 is the deep topic research gate after Step 5 SERP Competitor Analysis and before unique-angle, brief, structure, final copy, images, or publishing work.

It answers: what does the agent need to know, verify, support, avoid, and carry forward so the page can become accurate, useful, practical, market-aware, and trustworthy?

Step 6 is not competitor analysis, final outline, unique angle, superiority component, CTA strategy, metadata, image planning, trust module design, or final copy.

## Artifacts

Every page creates:

- `topic-research-bank.json`: machine-validated source registry, research depth decision, agenda, extracted facts, research bank, conflicts, gaps, verdict, and hash.
- `topic-research-bank.md`: human-readable summary of what was researched, what was found, what is safe to use, what needs caution, and what must carry forward.
- `topicResearchHash`: frozen hash carried by later artifacts.

Batch runners cannot reuse another page's Step 6 artifact unless Step 0B through Step 5 hashes are identical. Shared sources are allowed, but agenda, extracted facts, examples, mistakes, and page-use mapping must be page-specific.

## Required Fields

`topicResearchBank` must include:

- `step0BContractHash`
- `pageJobHash`
- `searchIntentHash`
- `pageFormatHash`
- `nextActionHash`
- `serpCompetitorHash`
- `topicResearchHash`
- `researchDepthDecision`
- `researchAgenda`
- `sourceRegistry`
- `topicEvidenceSources`
- `audienceSearchLanguageSources`
- `extractedFacts`
- `agendaCoverage`
- `step5CarryForwardCoverage`
- `researchBank`
- `sourceConflictNotes`
- `researchGaps`
- `doNotUse`
- `mustCarryForward`
- `researchCompletenessChecklist`
- `researchSummaryStatement`
- `topicResearchVerdict`

## Research Depth Decision

Before collecting sources, Step 6 must declare `researchDepthDecision` with `researchRiskTier`, `depthReason`, `minimumSourceRequirements`, and `derivedFrom`.

Risk-tier minimums:

- `low_risk`: 6+ credible sources and 20+ useful extracted facts.
- `standard`: 8+ credible sources, 2+ high/authoritative sources, and 30+ useful extracted facts.
- `market_sensitive`: 10+ credible sources, 2+ local/market sources, 2+ high/authoritative sources, and 35+ useful extracted facts.
- `sensitive_or_medical`: 12+ credible sources, 4+ authoritative medical/scientific/expert sources, and 45+ useful extracted facts.
- `high_competition_or_deep`: 12-15+ credible sources, 4+ high/authoritative sources, and 50-70+ useful extracted facts.

Each credible source used as evidence should contribute at least 2 useful extracted facts unless it is a narrow source such as a product label, official warning, ingredient list, policy page, or short official guidance. Exceptions require a reason.

## Source Rules

Competitor pages from Step 5 do not count as authoritative Step 6 topic-research sources. They can create research prompts, but factual support must come from credible topical, official, expert, medical/scientific, product, market, brand, or audience/search-language sources as appropriate.

Every source must include `sourceClass`, `sourceReliability`, and `allowedUse`.

`sourceReliability` values:

- `authoritative`
- `high`
- `medium`
- `low`
- `unusable`

`allowedUse` values:

- `define_concept`
- `verify_claim`
- `support_safety_boundary`
- `support_market_context`
- `support_product_context`
- `support_example`
- `answer_user_question`
- `capture_audience_language`
- `identify_common_mistake`
- `support_workflow`
- `not_allowed_for_claims`
- `do_not_use`

Step 6 must separate `topicEvidenceSources` from `audienceSearchLanguageSources`. Audience/search-language sources can support reader language, objections, confusion, mistakes, examples, and questions. They cannot support medical, legal, finance, safety, product-efficacy, or factual truth claims by themselves.

## Research Agenda

Step 6 must create `researchAgenda` before collecting sources. It is derived from Step 0A through Step 5, including Step 5 `minimumBarToMatch`, `competitorStrengthsToRespect` marked `must_match`, `differentiationRequirement`, `serpInformedScopeProtection`, and `mustCarryForward`.

Each agenda question needs `question`, `whyThisMatters`, `questionType`, `requiredEvidenceClass`, `sourceRefs`, `route`, and `answerStatus`.

Routes:

- `must_answer_for_page`
- `supporting_context`
- `claim_verification`
- `safety_or_risk_boundary`
- `example_or_workflow_support`
- `market_or_product_context`
- `audience_question`
- `do_not_research_now`

Answer statuses:

- `answered`
- `partially_answered`
- `not_answered`
- `rejected`
- `routed_later`

Every `must_answer_for_page`, `claim_verification`, `safety_or_risk_boundary`, and `market_or_product_context` question needs enough extracted facts to support its answer. The agent cannot pass by collecting many facts for only one easy question. `agendaCoverage` must show which questions are well-supported, weakly supported, routed later, or unresolved.

Critical unresolved gaps fail Step 6 or route to `ask_user` or `skip_page` in batch. Critical means safety, medical/skincare, finance/legal, core user decision, or Step 5 minimum SERP bar.

## Research Bank

The `researchBank` must be organized by final page usefulness:

- `coreConcepts`
- `processOrWorkflow`
- `practicalExamples`
- `commonMistakes`
- `supportingEvidence`
- `safetyBoundaries`
- `marketContext`
- `productContext`
- `readerQuestions`
- `counterpointsOrCaveats`
- `sourceConflicts`
- `doNotUse`

Each item must include `sourceRefs`, `pageUseRole`, `claimSensitivity`, `mappedAgendaQuestionRefs`, and `finalCopyUseHint`.

`pageUseRole` values:

- `core_concept`
- `process_step`
- `example_support`
- `mistake_to_avoid`
- `claim_support`
- `safety_boundary`
- `market_context`
- `product_context`
- `audience_question_answer`
- `counterpoint_or_caveat`
- `definition_or_term`
- `stat_or_data_point`
- `source_conflict`
- `do_not_use`

Every extracted fact gets `claimSensitivity`: `low`, `medium`, `high`, or `critical`. High and critical facts require authoritative support or must be softened, routed to Step 12, rejected, or blocked.

Examples, workflows, and mistakes must be evidence-linked. Practical examples need `sourceRefs` or `illustrative_only`. Workflow/process steps need credible topic evidence. Common mistakes need audience/search-language evidence, expert guidance, or Step 5 gap evidence. Generic mistakes fail unless made specific and evidence-linked.

Reader questions must include `question`, `sourceRefs`, `sourceClass`, `impliedNeed`, `mappedAgendaQuestionRefs`, `routingDecision`, and `finalCopyUseHint`. Deduplicate by actual user need. Routing decisions are `answer_in_page`, `briefly_support_only`, `separate_page_candidate`, `exclude_from_current_page`, `route_to_step9_faq`, and `route_to_step12_trust`.

## India And Market Evidence

For Indian-market skincare, product, or service pages, Step 6 requires local-market evidence for product availability, pricing or budget fit, Indian climate/context, local routines or usage patterns, Indian regulations or labels, and brand/category/site-specific fit.

If local evidence is unavailable, mark the claim as `unsupported_local_context`, soften it, route it to later validation, or avoid using it.

## Conflict And Do-Not-Use Handling

Create `sourceConflictNotes` when credible sources disagree, especially for skincare, medical, finance, legal, or safety claims. Each conflict must include conflicting facts, source refs, why they differ, current safe interpretation, whether to soften/avoid/route to Step 12, and whether final copy must mention uncertainty or limits.

Capture tempting weak material in `doNotUse`, including unsupported Reddit medical claims, unverified competitor claims, outdated product/pricing claims, global-market assumptions that do not apply to India, overconfident claims, and unresolved conflicts. Each item needs `item`, `sourceRefs`, `whyNotUse`, `riskIfUsed`, and `safeAlternative` or `routeToLaterStep`.

## No-Copy Rule

Store short factual notes and paraphrased findings only. Do not copy long passages, competitor phrasing, source headings, product descriptions, routines, examples, tables, or frameworks. If a source phrase must be preserved, keep it short and mark it as `short_quote`. Copied-looking research bank material fails or triggers repair.

## Must Carry Forward And Delivery Proof

`mustCarryForward` contains only non-ignorable research conclusions: core facts, safety boundaries, market/product constraints, common mistakes, reader questions, claims requiring citation or softening, conflicts/uncertainties, and Step 5 minimum-bar items validated by topic research.

Final copy or page-packet QA must include `topicResearchDeliveryProof` proving each `mustCarryForward` item was visibly used, used in a table/checklist/decision tool, converted into a citation/safety note, intentionally rejected with a clear reason, or routed to another page/step.

## Boundary Contract

Step 6 must not produce final outline, H1/H2/H3 structure, final unique angle, required superiority component, final CTA wording, metadata, image prompts, final page copy, final citations display strategy, final trust module design, competitor imitation, or copied competitor structure.

## Verdict And Repairs

`topicResearchVerdict.status` may be `pass`, `pass_with_warnings`, `fail`, or `ask_user`.

`topicResearchVerdict.action` may be `continue_to_step7`, `return_to_step5`, `return_to_step4`, `return_to_step3`, `return_to_step2`, `return_to_step1`, `return_to_0B`, `ask_user`, or `skip_page`.

Step 6 may repair weak fields up to 2 times: missing evidence refs, weak agenda coverage notes, weak reliability labels, missing `finalCopyUseHint`, incomplete `doNotUse`, incomplete conflict notes, or weak `mustCarryForward`.

Do not auto-repair no credible topic sources, no authoritative support for critical claims, unresolved critical research gaps, no local evidence for required India-specific claims, copied source material, or major Step 0B-5 contradictions. Route those to the owner step, `ask_user`, or `skip_page` in batch.

## Completeness Checklist

`researchCompletenessChecklist` must include:

- `researchAgendaCreated`
- `sourceRegistryComplete`
- `riskTierMinimumsMet`
- `agendaCoverageComplete`
- `step5CarryForwardCovered`
- `topicVsAudienceEvidenceSeparated`
- `localMarketEvidenceChecked`
- `readerQuestionsEvidenceBacked`
- `examplesWorkflowsMistakesEvidenceLinked`
- `sourceConflictsHandled`
- `criticalResearchGapsResolved`
- `doNotUseCompleted`
- `mustCarryForwardCompleted`
- `noCopiedSourceMaterial`
- `boundaryContractRespected`
- `batchIsolationChecked`

False values trigger repair, warning, fail, or routing depending on whether the issue is critical.

## Summary Statement

`researchSummaryStatement` is required:

For this page, Step 6 researched [topic/problem] at a [risk/depth tier] level using [source mix]. The usable evidence shows [core finding], with important cautions around [safety/market/conflict limits]. Later steps must use [must-carry-forward highlights] and avoid [do-not-use highlights].
