# Cluster Strategy Workflow

Cluster strategy is created after company setup, product/category profiling, and site inventory. It decides which SEO pages should exist for one selected product/category before the agent drafts any page packet.

## Inputs

- Company name
- Product/category name
- Target market, default India
- Site inventory metadata
- Optional seed keywords
- Optional Search Console or Keyword Planner exports
- Optional competitor/reference URLs

## CLI Command

```bash
seo-agent cluster plan --category "Acne Treatment" --company "ClearNest" --market India --keywords "acne treatment,acne marks treatment"
```

Generated files:

```text
.seo-agent-workspace/clusters/<category-slug>/strategy.json
.seo-agent-workspace/clusters/<category-slug>/strategy.md
```

## Foundation Gates

Cluster strategy must start with the Step 0A foundation before keyword targeting begins. Step 0A defines the topic, primary search problem, problem-language, business-side relevance, and reader state. If Step 0A has not returned `pass` or `pass_with_warnings`, do not start Step 0B, SERP research, page structure, page packet, final copy, images, batch publishing, or live deployment.

### Step 0A Foundation Gate

Step 0A is the first hard gate. It defines the search opportunity before keyword targeting starts.

The agent must begin by asking:

- What broad subject are we in?
- What real problem is the user trying to solve?
- How would the user naturally describe that problem?

Step 0A must produce a compact foundation artifact with:

- `selectedTopic`
- `topicBoundarySummary`
- `includedSubareas`
- `excludedSubareas`
- `candidateTopics`
- `businessSideRelevance`
- `deferredKeywordCandidates`
- `deferredIntentSignals`
- `notAcceptedAsTopicExamples`
- `primarySearchProblem`
- `secondaryProblems`
- `searchProblemBoundarySummary`
- `wrongPageRisk`
- `desiredOutcome`
- `readerState`
- `problemLanguage`
- `relationshipCheck`
- `foundationVerdict`
- `mustCarryForward`

When user input is messy, broad, or ambiguous, create 2-4 candidate topics and select one only when the winner is clear. Score candidates using user-stated fit, `businessSideRelevance`, site inventory fit, cluster usefulness, specificity, audience problem clarity, risk/manageability, and strategic value. Ask the user instead of choosing automatically when top candidates are within 10 points, business/site fit conflicts with user intent, risk changes the topic boundary, or a candidate cannot be routed cleanly.

Rejected or non-topic inputs must be routed as `deferredKeywordCandidates`, `deferredPageOpportunities`, `deferredIntentSignals`, `excludedSubareas`, `parentCategory`, `adjacentTopic`, or `needsUserClarification`. Do not discard possible keywords just because they are not the topic.

`businessSideRelevance` must check explicit user/project input, company or product profile, existing site inventory, existing conversion destinations, existing content authority, audience fit, expertise/risk fit, and commercial or strategic fit. Its status must be `supported`, `partially_supported`, `not_supported`, or `unknown`, with evidence references, reasoning, and confidence. Business relevance is unclear is a critical blocker.

`primarySearchProblem` must name the real user task, pain, confusion, or goal. It must not be the topic or keyword repeated in sentence form. It must include `wrongPageRisk`, `desiredOutcome`, and `readerState`. `readerState` must cover `likelyKnows`, `likelyDoesNotKnow`, `likelyFeels`, `likelyFears`, `likelyMisunderstands`, and `needsReassuranceAbout`.

`problemLanguage` must include 8 cleaned natural user phrases. At least 5-6 must be evidence-backed, preferably all 8 when sources are available. Each evidence-backed phrase must include `cleanedPhrase`, `sourceOriginalExcerpt`, `sourceRef`, `sourceType`, and `sourceClass`. Use `sourceClass` values `search_surface` for PAA/autocomplete/related searches/Search Console/site search/query exports and `audience_language` for Reddit, Quora, forums, video comments, reviews, support chats, emails, or community/social comments. Competitor pages do not count as audience-language evidence. At least one `audience_language` source is mandatory when available.

The 8 phrases must not all say the same thing. They must include confusion/friction, desired-format, desired-outcome, and when relevant risk/objection and comparison/decision language. Each phrase must map to one primary implied content need, optional secondary content needs, `readerStateSignals`, `supportsPrimarySearchProblem`, `supportStrength`, and `supportReason`. At least 6/8 phrases must support the `primarySearchProblem`, at most 2/8 may be adjacent, and 0 contradictions are allowed.

`relationshipCheck` must pass with reasons showing that the topic, search problem, and problem-language connect clearly. Fail if the search problem does not sit inside the topic, problem-language mostly points elsewhere, language drifts outside the topic boundary, the explanation is vague, or the compact Step 0A output cannot be written clearly.

`foundationVerdict` must be `pass`, `pass_with_warnings`, `fail`, or `ask_user`, with confidence, reason, `mustCarryForward`, warnings, and blocking issues. `pass_with_warnings` may continue automatically only for non-critical warnings. Critical blockers include business relevance is unclear, keyword/topic restatement, fewer than 6/8 phrases supporting the primary problem, any contradiction, no audience-language source when one was available, unrouted rejected candidates, missing `wrongPageRisk`, or missing `readerState`.

Step 0B is the Page Scope Contract gate. It turns the approved Step 0A search problem into exactly one frozen page opportunity before any page-level work starts.

Step 0B must produce:

- `targetKeyword`: one exact keyword phrase for the selected SEO page.
- `targetQueryIntent`: the human meaning behind the selected keyword.
- `queryCluster`: 3-8 supporting queries that share the same search task, unless a narrow scope is explicitly justified.
- `selectedOpportunity`: exactly one selected page opportunity from any ranked list.
- `pageScopeSummary`: one sentence naming the page, reader, primary search task, and what the page will not try to do.
- `uniqueContribution`: evidence-linked reason this page deserves to exist separately from other cluster or batch pages.
- `mustCover`: 5-12 specific items, each with light evidence refs.
- `mustNotCover`: 3-10 specific exclusions, each with a route such as `futurePageOpportunity`, `separatePageOpportunity`, `internalLinkOut`, `refreshExistingPage`, `mergeWithExistingPage`, `lightMentionOnly`, `excludeEntirely`, or `ask_user`.
- `businessGoal`: a soft or hard business goal that fits the reader intent.
- `existingUrlAction`: `create_new_page`, `refresh_existing_page`, `merge_with_existing_page`, `skip_duplicate`, or `ask_user`.
- `slugCandidate`: rough identity slug for inventory and cannibalization checks only.
- `contractHash`: frozen Page Scope Contract identifier that all downstream artifacts must reference.

Step 0B requires live keyword/search evidence. It must use at least two approved source types, and at least one must be a true search-demand source such as Google SERP/manual search, People Also Ask, autocomplete/related searches, Search Console, Keyword Planner, Ahrefs/Semrush or similar, or internal site search. Reddit, forums, video comments, and reviews may support audience language, but they do not prove keyword demand by themselves.

Step 0B includes a light SERP overlap/page-type check only for clustering and splitting. Deep competitor quality, SERP superiority scoring, AI Overview gaps, Reddit/forum/video gap synthesis, and required superiority components stay in the later SERP Superiority Gate.

Every collected candidate phrase must be routed as one of: `selectedTargetCandidate`, `supportingQuery`, `closeVariant`, `questionQuery`, `modifierQuery`, `futurePageOpportunity`, `separatePageOpportunity`, `refreshExistingPage`, `mergeWithExistingPage`, `excludedForCurrentPage`, or `needsUserClarification`. Unrouted phrases fail the gate.

Use fixed enums for `pageType`, `primaryIntent`, and `primaryReaderStage`. The selected opportunity must have exactly one dominant `primaryIntent`; mixed SERPs may be recorded as context, but the page must not try to serve all intents equally.

Step 0B uses structured pass/fail plus a scorecard for target keyword candidates. Hard blockers override the score. Critical blockers include no live evidence, no exact `targetKeyword`, target keyword contradiction with Step 0A, mixed primary intent, skipped accessible inventory, likely duplicate existing URL without routing, generic `pageScopeSummary`, generic `uniqueContribution`, unrouted `mustNotCover`, and a selected opportunity that is not frozen.

Step 0B may perform up to 2 automatic repair attempts for repairable failures such as missing routes, vague summary, generic unique contribution, too many supporting queries, or weak light evidence refs. If still failing, return `ask_user` with the exact blocker.

Downstream workflows must not start page packet, prewriting, final copy, images, commit, deploy, or publish until Step 0B returns `pass` or non-critical `pass_with_warnings`. Every downstream artifact must carry the same `contractHash`; if target keyword, query cluster, selected opportunity, or page scope changes, regenerate and revalidate Step 0B.

### Step 1 Page Job Contract Gate

Step 1 defines the page's job after Step 0B freezes the selected opportunity. It converts the page from "a page targeting a keyword" into "a page created to help a specific user achieve a specific outcome." Step 1 is a hard blocker before prewriting, V2 research, final copy, page packet, images, commit, deploy, or publish.

Step 1 must produce `pageJobContract` with:

- `step0BContractHash`: the frozen Step 0B `contractHash`.
- `pageJobHash`: frozen identifier for the Page Job Contract.
- `pageJobStatement`: one sentence using the pattern "This page should help [audience] [do/understand/solve something specific] by giving them [kind of help], so that they can [user outcome]."
- `audience`: structured audience with `audienceSentence`, `audienceSegment`, `experienceLevel`, `marketContext`, `readerSituation`, `primaryConcern`, `awarenessLevel`, `decisionStage`, and `exclusions`.
- `userTask`: structured task with one `taskSentence`, one `taskAction`, one `taskObject`, 1-3 `taskConstraints`, 3-6 `successCriteria`, and 3-8 `nonGoals`.
- `primaryHelpFormat`: exactly one fixed-enum help format.
- `secondaryHelpFormats`: up to 3 fixed-enum supporting help formats.
- `userOutcome`: `outcomeSentence`, 2-5 `knowledgeGained`, optional `decisionEnabled`, optional `actionEnabled`, required `outcomeConsequence`, and `confidenceLevel`.
- `businessRole`: exactly one `primaryBusinessRole`, up to 3 secondary roles, and notes that keep the business role behind the reader job.
- `riskLayer`: `riskLevel`, `claimSensitivity`, `jobSafetyBoundary`, `prohibitedJobFraming`, and `requiredCaution`.
- `evidenceBasis`: Step 0A and Step 0B refs proving the job was inferred rather than invented.
- `jobUniquenessCheck`: current-batch, planned-cluster, and historical page-job comparison when available.
- `pageJobVerdict`: `pass`, `pass_with_warnings`, `fail`, or `ask_user`.
- `inferenceRepairLog`: up to 2 automatic repair attempts with outcomes.

`taskAction`, `primaryHelpFormat`, `primaryBusinessRole`, `riskLevel`, `claimSensitivity`, and `outcomeConsequence` must use controlled values. `nonGoals` must align with Step 0B `mustNotCover`; for sensitive topics they must include unsafe framings where relevant.

`evidenceBasis` may cite only Step 0A and Step 0B fields. Each major field needs at least 1 source ref, and `userTask`, `userOutcome`, and `pageJobStatement` should usually have at least 2 refs. If evidence is insufficient, return to Step 0A or Step 0B or ask the user.

Step 1 must not directly modify Step 0B. If the selected opportunity, scope, `mustCover`, `mustNotCover`, or business goal is wrong, return `return_to_0B` with the exact issue. Prewriting must not directly modify Step 1. If prewriting finds the job wrong or incomplete, return `return_to_step1`.

`jobUniquenessCheck` fails when two pages share the same audience, task, `primaryHelpFormat`, and `outcomeConsequence`, or differ only by keyword wording. If accessible history is missing, allow non-critical `pass_with_warnings` and carry the warning forward. Step 1 may repair vague audience, task, constraints, success criteria, non-goals, help format notes, business role notes, evidence mapping, or missing formula parts up to 2 times. It must not auto-repair true 0A/0B conflicts, unsafe framing, duplicate page jobs, business-role-over-user conflicts, two primary jobs, or missing/failed 0A or 0B.

### Step 2 Search Intent Contract Gate

Step 2 validates whether the Step 1 page job matches the intent behind the selected Step 0B query. It is a hard blocker before prewriting, V2 research, page structure, final copy, page packet, images, commit, deploy, or publish. Step 2 must not silently override earlier contracts: return `return_to_0B` if the query scope is wrong, and return `return_to_step1` if the page job is wrong or incomplete.

Step 2 must produce `searchIntentContract` with:

- `step0BContractHash`
- `pageJobHash`
- `searchIntentHash`
- `intentStatement`
- `dominantBroadIntent`: exactly one of informational, commercial, transactional, or navigational.
- optional `coPrimaryBroadIntent`: at most one secondary broad intent that cannot override the dominant intent.
- `primaryDeeperIntent`: one universal fixed-enum deeper intent.
- optional `projectSpecificIntentLabel`: local nuance, not the validator source of truth.
- `depthLevel`: `short`, `moderate`, `comprehensive`, or `deep`.
- `depthStyle`: the shape of depth, such as quick answer, walkthrough, framework, example-heavy, checklist, decision support, troubleshooting, template, or tool-supported.
- `satisfactionCondition` with `mustInclude`, `mustFeelHelpedBy`, `tooShallowIf`, and `wrongPageIf`.
- `recommendedPageType`
- `dominantInternalContentFormat`
- `supportingContentFormats`
- `lightSerpValidation`
- `mixedIntentHandling`
- `pageJobAlignmentCheck`
- `validatedIntentDecision`
- `marketContextCheck`
- optional `aiOverviewIntentSignal`
- `intentVerdict`
- `intentRepairLog`
- `mustCarryForward`

Use fixed enums for broad and deeper intent. `dominantBroadIntent` controls structure, depth, CTA direction, and SERP alignment. `coPrimaryBroadIntent` and secondary deeper intents may inform support sections only; if no dominant intent is defensible, return `return_to_0B`.

`lightSerpValidation` must check the top 5 SERP results when accessible, recording title, URL or domain when available, result type, snippet-level intent pattern, and whether each result supports the chosen intent. Normal pass requires 3/5 support for `dominantBroadIntent` and `primaryDeeperIntent`. Allow non-critical `pass_with_warnings` at 2/5 only when PAA, autocomplete, related searches, Step 0B query cluster, or other search-surface evidence strongly supports the classification. Do not perform deep competitor-quality scoring here; SERP Superiority handles that later.

`mixedIntentHandling` must classify every non-dominant intent as `adjacent` or `conflicting`, then route it to support on page, internal link, separate page, `return_to_0B`, or exclusion. `validatedIntentDecision` must state whether evidence `confirm`, `refine`, or `correct` the query-only hypothesis. `marketContextCheck` must record target market, location sensitivity, recency sensitivity, and whether the SERP was interpreted in the right context. `aiOverviewIntentSignal` may be used only as optional light intent evidence when visible, not as factual authority or citation support.

`pageJobAlignmentCheck` must prove the intent matches Step 1 `primaryHelpFormat`, `secondaryHelpFormats`, user task, `taskConstraints`, `successCriteria`, `nonGoals`, `outcomeConsequence`, and `pageJobStatement`. If aligned, `intentVerdict` action is `continue_to_prewriting`. If not aligned, action is `return_to_step1` or `return_to_0B`; use `ask_user` in single-page mode or `skip_page` in batch mode when intent cannot be resolved after allowed repairs.

`intentVerdict` may be `pass`, non-critical `pass_with_warnings`, `fail`, or `ask_user`. Critical blockers include no defensible dominant intent, no defensible `primaryDeeperIntent`, Step 0B mismatch, Step 1 mismatch, SERP contradiction, heavily mixed SERP with no dominant intent, market mismatch changing scope, and missing top 5 SERP validation when SERP access is available. Step 2 may repair vague `intentStatement`, missing evidence refs, incomplete `lightSerpValidation`, incomplete `mixedIntentHandling`, weak `satisfactionCondition`, missing `tooShallowIf`, missing `wrongPageIf`, or unclear recommendations up to 2 times, but it must not auto-repair true Step 0B or Step 1 conflicts.

### Step 3 Page Format Contract Gate

Step 3 chooses the page type and internal content format after Step 2 validates intent. It is a hard blocker before prewriting, V2 research, page structure, final copy, page packet, images, commit, deploy, or publish. It chooses the content vehicle only; Step 9 or later structure work creates H1, H2, H3, detailed outline, and flow.

Step 3 must produce `pageFormatContract` with:

- `step0BContractHash`
- `pageJobHash`
- `searchIntentHash`
- `pageFormatHash`
- `primaryPageType`: exactly one fixed-enum page type.
- `secondaryPageTypeInfluences`: optional subordinate influences.
- `primaryInternalContentFormat`: exactly one fixed-enum delivery spine.
- `supportingFormatInfluences`: optional, maximum 3, subordinate to the primary format.
- `supportingContentElements`: 3-6 elements mapped to Step 2 `satisfactionCondition`.
- `step2RecommendationFit`
- `formatEvidenceBasis`
- `scopeBoundaryCheck`
- `formatCompatibilityCheck`
- `formatRiskCheck` when relevant
- `formatUniquenessCheck`
- `businessConnectionBoundary`
- `adjacentNeedRouting`
- `rejectedPageTypes`
- `rejectedInternalFormats`
- `formatDecisionStatement`
- `step3OutputMustNotContain`
- `formatRepairLog`
- `formatVerdict`
- `mustCarryForward`

Step 3 may lightly refine Step 2 recommendations only inside the validated intent. If Step 2 recommends guide/tutorial, Step 3 may choose final guide plus `step_by_step_walkthrough`. If Step 3 wants to change guide into comparison page, return `return_to_step2`. If the page job is too vague or conflicting, return `return_to_step1`. If the query cluster, selected scope, `mustCover`, or `mustNotCover` is wrong, return `return_to_0B`.

`primaryPageType`, `secondaryPageTypeInfluences`, `primaryInternalContentFormat`, `supportingFormatInfluences`, supporting element names/roles, adjacent routing decisions, `formatVerdict.status`, and `formatVerdict.action` must use fixed enums plus explanation fields. Do not allow labels such as "educational helpful page" or blended primary types such as guide/tutorial/explainer.

Every `supportingContentElements` item must include `allowedScope`, `notAllowedScope`, `mappedSatisfactionNeed`, role, and reason. Visual or media elements such as process diagram or screenshot example may appear only here as scoped support; Step 3 must not create image prompts, image manifest, visual design, asset generation plan, layout spec, or interactive component spec.

`formatEvidenceBasis` may cite only Step 0B, Step 1, and Step 2 fields. Step 3 must not start new SERP, competitor, Reddit, video, PAA, or keyword research. `scopeBoundaryCheck` must prove the selected format respects Step 0B `mustCover` and `mustNotCover`; conflicts are blockers unless routed back to Step 0B.

`formatCompatibilityCheck` must classify the chosen page type and internal format as `strong`, `acceptable_with_reason`, `weak`, or `invalid`. `formatRiskCheck` must catch sensitive-topic format risk when relevant, such as tutorial-style diagnosis, treatment instructions, guarantees, financial/legal advice, or unsafe self-assessment. `businessConnectionBoundary` may allow a soft internal link or contextual brand bridge, but Step 3 must not write CTA copy, choose CTA placement, or set conversion strategy.

`adjacentNeedRouting` must route adjacent needs instead of forcing separate opportunities into the page. Decisions include `support_as_element`, `brief_mention_only`, `internal_link_if_available`, `separate_page`, `future_page_opportunity`, `exclude_from_current_page`, `return_to_step2`, or `ask_user`. Empty adjacent routing is allowed only with a reason.

`rejectedPageTypes` and `rejectedInternalFormats` are mandatory with at least 2 plausible wrong options each, not only absurd options. Each rejection must include a specific upstream evidence reason. `formatUniquenessCheck` must lightly compare current-batch and historical format signatures when available; identical current-batch signatures are blockers unless there is a page-specific reason.

`step3OutputMustNotContain` must explicitly block H1, H2, H3, exact section order, detailed outline, CTA copy, CTA placement, conversion strategy, metadata, title tag, meta description, competitor gap analysis, SERP superiority component, final copy, image prompts, image manifest, and layout specification.

`formatVerdict` uses structured pass/fail only, not a scorecard. Status may be `pass`, `pass_with_warnings`, `fail`, or `ask_user`; action must be `continue_to_prewriting`, `return_to_step2`, `return_to_step1`, `return_to_0B`, `ask_user`, or `skip_page`. Step 3 may repair weak Step 3 fields up to 2 times through `formatRepairLog`, but it must not auto-repair real Step 2 contradiction, real Step 1 mismatch, Step 0B scope conflict, unsafe sensitive-topic format, no defensible `primaryPageType`, or no defensible `primaryInternalContentFormat`.

`mustCarryForward` must include `primaryPageType`, `primaryInternalContentFormat`, selected supporting elements, `formatDecisionStatement`, and format boundaries. All downstream artifacts must carry `pageFormatHash`; if page type, internal format, supporting elements, adjacent routing, or boundaries change, return to Step 3.

### Step 4 Next Action Contract Gate

Step 4 defines the next action after Step 3 locks the page type and internal format. It is a hard blocker before prewriting, V2 research, page structure, final copy, page packet, images, commit, deploy, or publish. It chooses the natural user journey continuation only; Step 4 does not write CTA copy, place CTAs, build the outline, choose the page type, or redefine the business role.

Step 4 must produce `nextActionContract` with:

- `step0BContractHash`
- `pageJobHash`
- `searchIntentHash`
- `pageFormatHash`
- `nextActionHash`
- `userJourneyStage`: exactly one primary fixed-enum value: `learning`, `evaluation`, or `action`.
- `secondaryJourneyStages`: optional, maximum 3 adjacent readiness states.
- `secondaryStageNotes`
- `primaryNextAction`
- `secondaryNextActions`: 1-3 alternate or softer next actions.
- `ctaStrength`: exactly one fixed-enum value: `soft`, `medium`, or `direct`.
- `ctaStrengthMapping`
- `ctaStrengthExceptionReason`
- `ctaStrengthExceptionEvidenceRefs`
- `internalJourneyPath`
- `nextActionStatement`
- `stageEvidenceBasis`
- `nextActionEvidenceBasis`
- `step4InputFit`
- `formatBoundaryCheck`
- `businessRoleBoundaryCheck`
- `brandConnectionFit`
- `sensitiveActionRiskCheck` when relevant
- `internalDestinationCheck`
- `rejectedNextActions`
- `nextActionUniquenessCheck`
- `step4OutputMustNotContain`
- `nextActionRepairLog`
- `nextActionVerdict`
- `mustCarryForward`

`userJourneyStage` must come from Step 2 validated intent, Step 1 user task/outcome, and Step 3 page format. `secondaryJourneyStages` may capture adjacent readiness states, but they must not control `ctaStrength`. `ctaStrengthMapping` is strict by default: `learning` -> `soft`, `evaluation` -> `medium`, and `action` -> `direct`. A mismatch is allowed only when `ctaStrengthExceptionReason` and `ctaStrengthExceptionEvidenceRefs` are present and strong; secondary journey stages alone cannot justify changing CTA strength.

`primaryNextAction` is exactly one most logical next step if the reader takes only one action after the page. `secondaryNextActions` must include 1-3 softer or alternative next steps for readers not ready for the primary action. Each action must include action type, target resource or action, user benefit, readiness fit, destination type, destination status, evidence refs, reason, and `finalCopyGuidance`. `finalCopyGuidance` should explain how the action should become visible later without writing exact CTA copy. Broad placement guidance may use labels such as `near_end`, `after_decision_tool`, `after_troubleshooting`, `after_comparison`, `after_key_takeaway`, or `contextual_internal_link_only`; exact placement, section IDs, button text, and final CTA wording are forbidden.

`internalJourneyPath` must show the page's continuation path, such as checklist -> next guide -> diagnostic flow or comparison page -> pricing page -> consultation page. It should be primarily internal and use actual internal URLs or resource IDs when already known. If inventory or repo pages are accessible, Step 4 must check them; failure to check accessible inventory is a blocker. If inventory is inaccessible, Step 4 may continue with `pass_with_warnings`. `internalDestinationCheck.destinationStatus` must use only `existing_internal_destination`, `missing_but_recommended`, `external_destination`, or `ask_user_required`. If a useful destination is missing and does not affect business positioning or safety, infer `missing_but_recommended`; ask only when the destination affects business positioning, conversion promise, medical/skincare safety, finance/legal risk, or sensitive routing.

External destinations are allowed only when required for trust, safety, compliance, official medical/legal/financial guidance, platform documentation, required third-party action, or other recommended products where relevant. They must not replace a brand-owned next step unless safety or trust demands it.

`stageEvidenceBasis` and `nextActionEvidenceBasis` may cite only Step 0B, Step 1, Step 2, Step 3, and already-known site inventory, conversion destinations, or product/profile data. Each `primaryNextAction` and `secondaryNextActions` item must include evidence refs. Step 4 must not start new SERP, competitor, Reddit, video, PAA, or keyword research.

`step4InputFit` must prove the next action follows the frozen page scope, page job, search intent, and page format. `formatBoundaryCheck` must prove the next action does not change the page type or internal content format. `businessRoleBoundaryCheck` must prove the action respects Step 1 `primaryBusinessRole` without turning an educational page into a forced sales page or making an action page too weak to satisfy the user.

`brandConnectionFit` is required and must use one fixed label: `direct_business_connection`, `soft_brand_bridge`, `authority_building_internal_education`, or `no_brand_connection_reader_first_justified`. It can reference other web pages, topic hubs, resources, product pages, or tools of the same business when that is the most natural user-first continuation. A purely educational next action is allowed when it best fits the primary stage.

`sensitiveActionRiskCheck` is required for skincare, medical, finance, legal, safety, or other sensitive topics. It must block unsafe next actions such as self-diagnosis, treatment guarantees, prescription-style instructions, risky financial/legal advice, urgency pressure, or conversion paths that imply expertise the brand/project has not established.

`rejectedNextActions` must reject at least 2 plausible wrong next actions, not only absurd options. Each rejection must include the rejected action, why it is wrong for the current `userJourneyStage`, which upstream evidence it conflicts with, and whether it should be excluded, softened, delayed, or routed to a future page.

`nextActionUniquenessCheck` must lightly compare `primaryNextAction`, `secondaryNextActions`, and `internalJourneyPath` across current-batch and historical pages when available. Identical next-action paths require a page-specific reason, repair, or failure before prewriting.

`step4OutputMustNotContain` must explicitly block broad business role definition, page type selection, internal content format selection, H1, H2, H3, detailed outline, exact CTA placement, final CTA copy, conversion copy, metadata, title tag, meta description, final prose, image prompts, image manifest, visual design, and publishing instructions.

`nextActionStatement` must be a human-readable sentence in this pattern: after reading this page, the user should primarily do X; if not ready, they should do Y/Z; the CTA should be soft/medium/direct because the primary stage is learning/evaluation/action and this fits the page job.

`nextActionVerdict` uses structured pass/fail only, not a scorecard. Status may be `pass`, `pass_with_warnings`, `fail`, or `ask_user`; action must be `continue_to_prewriting`, `return_to_step3`, `return_to_step2`, `return_to_step1`, `return_to_0B`, `ask_user`, or `skip_page`. `pass_with_warnings` may continue automatically only for non-critical issues such as inaccessible inventory, `missing_but_recommended` support resource, secondary journey stage that does not control the CTA, external destination used only as trust/safety support, or missing internal URL with clear destination type.

Step 4 may repair weak Step 4 fields up to 2 times through `nextActionRepairLog`: vague `nextActionStatement`, missing evidence refs, missing `finalCopyGuidance`, weak destination label, weak `rejectedNextActions`, CTA strength mismatch without exception fields, or missing secondary action. It must not auto-repair unsafe sensitive destination, impossible internal destination, business positioning conflict, true Step 3 format conflict, true Step 2 stage/intent conflict, Step 0B scope conflict, no defensible `primaryNextAction`, or no defensible `ctaStrength`. Non-repairables must route to the owning step: `return_to_step3` for format conflict, `return_to_step2` for intent/stage contradiction, `return_to_step1` for page job/business-role conflict, `return_to_0B` for scope conflict, `ask_user` for single-page ambiguity or safety/business decision, or `skip_page` in batch after allowed attempts.

`mustCarryForward` must include `userJourneyStage`, `secondaryJourneyStages`, `primaryNextAction`, `secondaryNextActions`, `ctaStrength`, `internalJourneyPath`, `nextActionStatement`, `brandConnectionFit`, and next-action boundaries. All downstream artifacts must carry `nextActionHash`; if the journey stage, next action, CTA strength, internal journey path, or boundaries change, return to Step 4. Final copy or page-packet QA must include `nextActionDeliveryProof` proving the primary next action, secondary next actions, CTA strength, and internal journey path became visible in the page or visible link guidance.

### Step 5 SERP Competitor Analysis Gate

Step 5 analyzes the live SERP and competitors after Step 4 freezes the next action. It is a hard blocker before `current-page.lock`, prewriting, V2 research, page structure, final copy, page packet, images, commit, deploy, or publishing. Step 5 creates a dedicated `serpCompetitorAnalysis` artifact pair:

- `serp-competitor-analysis.json`: machine-validated contract, source registry, hashes, structured fields, and verdict.
- `serp-competitor-analysis.md`: human-readable summary with the same verdict and major findings.

The JSON is the gate. The Markdown is a review/debug view and cannot replace the JSON.

Step 5 must produce:

- `step0BContractHash`
- `pageJobHash`
- `searchIntentHash`
- `pageFormatHash`
- `nextActionHash`
- `serpCompetitorHash`
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
- optional `differentiationRequirement`
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

`serpContext` must fix `targetQuery`, `targetCountry`, optional `targetRegionOrCity`, `language`, `deviceChecked`, `dateChecked`, `marketContextReason`, and `contextConfidence`. For India-sensitive skincare, product, service, local, or consumer pages, `marketSerpFitCheck.marketFit` must be `matched` or strongly justified as `partially_matched`; `not_matched` fails or asks the user because a global SERP can mislead the competitor set, product assumptions, examples, trust bar, and next action.

Mobile-first interpretation is required for Indian consumer/skincare/product/service/local queries. `deviceSerpCheck` must record `mobile`, `desktop`, or `both`; dual-device checking is required when SERP features are likely device-sensitive. Desktop-only checks may continue only with warning and confidence notes when the query is low device-sensitivity or mobile access is unavailable.

For the primary Step 0B `targetKeyword`, Step 5 must collect the top 10 organic results when available and preserve original rank order in `primarySerpResults`. Attempt direct page review of the top 5 organic competitors and complete at least 3 direct competitor reviews. If a top-5 page is blocked or inaccessible, record `accessStatus`, keep the rank visible, and replace it with the next accessible organic result when possible. Fewer than 3 direct competitor reviews is a critical blocker or `ask_user` in single-page mode.

For supporting queries, Step 5 must check 3-5 important Step 0B supporting queries when available, with a light top 3 SERP check per query. Prioritize queries with different wording, potential hidden intent, or risky scope-drift words such as best, side effects, near me, price, routine, alternatives, reviews, template, tool, or service. Each supporting query must use `relationshipToCurrentPage`: `same_search_task`, `close_variant`, `supporting_subquestion`, `adjacent_need`, `different_opportunity`, or `conflicting_intent`; and `routingDecision`: `keep_in_current_scope`, `briefly_support_only`, `separate_page_candidate`, `exclude_from_current_page`, or `return_to_0B_required`.

`discoveredQueryCandidates` may be created from SERP features, PAA, autocomplete, related searches, video suggestions, forums, or repeated competitor subtopics, but Step 5 must not silently expand the Step 0B scope. Route each discovered query as `add_to_current_scope_candidate`, `separate_page_candidate`, `exclude_from_current_page`, or `return_to_0B_required`.

`sourceRegistry` must make evidence auditable. Each source needs `sourceRef`, `sourceClass`, `sourceType`, query, rank when applicable, title, URL, `accessStatus`, `reviewDepth`, `dateChecked`, `allowedEvidenceUse`, and `notAllowedEvidenceUse` when useful. Use `sourceClass` values such as `primary_serp_competitor`, `primary_serp_surface`, `supporting_query_serp_result`, `serp_feature`, `ai_overview_signal`, `existing_site_inventory`, and `global_benchmark_competitor`. Reddit, forums, video comments, PAA, and AI Overview can show audience language, objections, result shape, or answer shape; they cannot serve as medical/skincare/finance/legal factual authority. Official sources can set trust and safety standards, but they do not replace competitor-quality analysis.

Ranking organic surfaces such as Reddit, Quora, YouTube, forums, official docs, marketplaces, news, and medical sites must be recorded and classified separately with `resultRole`, `surfaceType`, and `competitorUse`. A Reddit thread ranking on page 1 can be an audience signal or format signal without being scored like a polished competitor article. Ads and shopping results must go into `commercialSerpSignals` or `excludedResults`; they do not count as organic competitors.

For each directly reviewed competitor, include structured scoring and notes for `intentMatch`, `coverageDepth`, `structureClarity`, `examplesAndPracticality`, `trustSignals`, `freshness`, `uxAndReadability`, and `distinctiveAssets`, plus `competitorStrengthScore`, `competitorStrengthLabel`, and `strengthReason`. Weak is 1.0-2.4, moderate is 2.5-3.7, and strong is 3.8-5.0. A competitor can still be labeled strong when it has high authority/trust, strong intent match, and strong UX/components even if one smaller dimension is weaker.

Each reviewed competitor must also include:

- `pageExperienceNotes`: scanability, above-fold clarity, intrusive ads/popups, mobile readability, navigation ease, visual support, and why it matters.
- `aboveFoldIntentMatch`: whether the main intent is visible near the top, opening framing, delay or mismatch risk, and notes.
- `freshnessSignals`: visible published/updated dates when available, freshness assessment, and why it matters.
- `rankingHypothesis`: concise, evidence-grounded hypothesis for why the page likely ranks, with low/medium/high confidence.
- strengths, weaknesses, `whatToRespect`, and `whatToAvoid`.

`serpStrengthLabel` must synthesize the overall competitive bar as `weak`, `mixed`, `moderate`, or `strong`. A strong SERP usually has 3+ strong top-5 competitors or the top 2 are very strong; moderate SERP has mostly moderate competitors and at least 1 strong result; mixed SERP is uneven; weak SERP has mostly weak/moderate results and no strong competitor. Include strong/moderate/weak counts, strongest refs, and the reason.

Separate `minimumBarToMatch` from `opportunityGapsToExplore`. A minimum-bar item is something our page must do to be credible in this SERP; each item needs `requirement`, `whyRequired`, competitor or SERP feature refs, and linked intent or satisfaction need. An opportunity gap is a weakness or missing piece that may feed Step 6 topic research, Step 7 unique angle, Step 9 structure, or the SERP Superiority Gate; each item needs `gap`, `whyItMatters`, evidence refs, `laterStepUse`, and when useful `pageInclusionCandidate`, `candidateInclusionType`, `inclusionRisk`, and `mustResolveBy`.

Step 5 must produce evidence-linked `coveragePatterns`, `contentAnglePatterns`, `depthBenchmark`, `trustSignalBenchmark`, and `uxComponentBenchmark`. Coverage patterns preserve repeated subtopics, questions, definitions, steps, examples, components, trust signals, UX patterns, and missing/rare subtopics without creating H2/H3s or section order. Content angle patterns explain how competitors position the promise, such as beginner-friendly, safety-first, product-fit, troubleshooting-led, comparison-led, example-led, or local-market-specific.

For normal pages, Step 5 should include at least 2 `contentAnglePatterns`, 4 `coveragePatterns`, 3 `competitorStrengthsToRespect`, 3 `competitorWeaknessesAndGaps`, 2 `minimumBarToMatch`, 2 `opportunityGapsToExplore`, and 3 `serpQuestionAndRelatedSignals` when visible. If fewer exist, Step 5 may continue only with non-critical warning and a reason that the SERP is unusually sparse or narrow.

`competitorStrengthsToRespect` must classify strengths as `must_match`, `nice_to_respect`, or `not_relevant_to_our_page`. `competitorWeaknessesAndGaps` must classify gaps as `useful_gap`, `possible_gap`, `not_relevant_to_current_page`, `separate_page_opportunity`, `trust_or_safety_gap`, or `ux_component_gap`. Synthesis items must include `utilizationRouting` or `pageImpact`: `must_apply`, `consider_for_step6`, `consider_for_step7`, `consider_for_step9`, `consider_for_superiority_gate`, `do_not_use`, or `separate_page_candidate`. `must_apply` items require `pageImpact`; `do_not_use` items require `whyNotUsed`; `proofRequired: true` items must later appear in `serpCompetitorDeliveryProof`.

For India-sensitive pages, Step 5 should attempt 2 global benchmark competitors only when `globalBenchmarkRelevanceCheck` says they are relevant. Global benchmark pages must use `sourceClass: global_benchmark_competitor` and must not count toward primary competitor minimums. `indiaGlobalInfluenceBoundary` must state that Indian SERP competitors and Indian/local search features define market reality, while global pages can raise quality, trust, UX, explanation clarity, and safety-boundary standards. Global benchmarks cannot override Indian product availability, pricing, climate/context, user language, local SERP intent, or brand next action, and they cannot become `must_apply` unless supported by Indian SERP competitors, Step 6 trustworthy research, Step 7 approved unique angle, or a safety/trust requirement.

`serpCannibalizationCheck` is required when site inventory, sitemap, repo routes, known published URLs, or historical page packets are accessible. It must compare target keyword, query cluster, page job, intent, page format, SERP shape, audience, and next action. Use overlap types `same_query_same_intent`, `same_query_different_intent`, `different_query_same_serp_shape`, `adjacent_supporting_page`, `partially_duplicate`, or `no_meaningful_overlap`. Adjacent, safe, or partial overlap may continue; if continuing with partial overlap, Step 5 must create `differentiationRequirement` with `mustDifferentiateOn`, `mustNotRepeat`, `requiredUniqueContribution`, and `downstreamProofRequired`. High or critical duplication must return to Step 0B, ask the user, merge/refresh, or skip the page in batch.

`directionValidation` must compare Step 1, Step 2, Step 3, and Step 4 against SERP reality using `confirm`, `refine`, or `reconsider`. `refinementSeverity` may be `none`, `minor_refinement`, or `contract_changing_refinement`. Minor refinements can continue to Step 6 and must be carried forward. Contract-changing refinements must return to the owner step: Step 4 for next-action conflict, Step 3 for format conflict, Step 2 for intent conflict, Step 1 for job conflict, or Step 0B for scope/cluster conflict.

`competitorImitationRisk` is required. Step 5 must not copy competitor wording, headings, examples, tables, proprietary frameworks, or product-ranking logic. Store only short snippets when truly needed, prefer paraphrased observations, and synthesize observed patterns across sources. Copy-like competitor material is a critical blocker.

`step5BoundaryNotes` must state that Step 5 does not resolve final factual claims, medical/skincare source citations, final unique angle, final superiority component, final outline, metadata, final CTA wording, image prompts, or final copy. It must list unresolved items and owner steps when competitor analysis exposes a question that Step 6 or later must validate.

`batchSerpIsolationCheck` must prove the Step 5 artifact is page-specific. Batch runners cannot reuse another page's Step 5 artifact unless the target keyword, query cluster, page job, intent, format, and next-action hashes are identical. If two pages produce highly similar Step 5 summaries, coverage patterns, or opportunity gaps, trigger uniqueness warning or repair.

`step5CompletenessChecklist` must include booleans for fixed SERP context, mobile-first or device-justified interpretation, primary top 10 collected, primary top 5 direct review attempted, minimum 3 direct reviews completed, supporting queries checked, SERP features captured, source registry complete, major conclusions evidence-linked, direction validation completed, cannibalization checked, imitation risk checked, boundary notes completed, and must-carry-forward completed. False values must trigger repair, warning, fail, or ask_user depending on severity.

`serpCompetitorSummaryStatement` is required in this pattern: For [targetKeyword] in [market], the SERP is dominated by [page types] with [content angles]. The competitive bar is [weak/mixed/moderate/strong] because [reason]. Our planned page direction is [confirmed/refined/reconsidered]; to compete, it must at minimum [minimum bar], while later steps should explore [opportunity gaps] without copying [imitation risks].

`serpCompetitorVerdict` uses structured pass/fail only. Status may be `pass`, `pass_with_warnings`, `fail`, or `ask_user`; action must be `continue_to_step6`, `return_to_step4`, `return_to_step3`, `return_to_step2`, `return_to_step1`, `return_to_0B`, `ask_user`, or `skip_page`. `pass_with_warnings` may continue only for access/availability limits that do not break the competitive read, such as 8-9 organic results visible instead of 10, AI Overview unavailable, 1-2 top-5 pages blocked while at least 3 direct reviews completed, only 2 supporting queries relevant, device-specific SERP unavailable with context clear, or some SERP feature details missing while primary competitor evidence is strong.

Step 5 may repair weak or missing Step 5 fields up to 2 times: missing evidence refs, weak SERP feature implications, incomplete competitor scoring notes, missing content angle patterns, missing coverage classification, weak minimum bar wording, weak opportunity gap routing, missing imitation-risk guardrail, or incomplete direction validation explanation. It must not auto-repair fewer than 3 direct competitor reviews, no primary SERP evidence, no fixed SERP context, access failure that prevents competitive read, major Step 1-4 contradiction, copy-like competitor material, no evidence-linked minimum bar, no evidence-linked opportunity gaps, no direction validation, or no defensible SERP strength judgment.

Ask the user only when the competitive read cannot be safely inferred: ambiguous market/location, target query has multiple SERPs with different meanings, major prior-contract contradiction cannot be routed automatically, fewer than 3 direct reviews are possible in single-page mode, sensitive-topic SERP implies unresolved brand/safety boundary, or discovered query routing cannot be decided. In batch mode, unresolved cases may become `skip_page` with reasons instead of blocking the full batch.

`mustCarryForward` must include SERP context, dominant SERP reality, `serpStrengthLabel`, `minimumBarToMatch`, `opportunityGapsToExplore`, direction validation, imitation warnings, `serpInformedScopeProtection`, any `differentiationRequirement`, and `serpCompetitorSummaryStatement`. All downstream artifacts must carry `serpCompetitorHash`; final copy or page-packet QA must include `serpCompetitorDeliveryProof`, and `differentiationDeliveryProof` when a differentiation requirement exists. If Step 6 research or later work materially changes the SERP assumptions, return to Step 5. A lightweight `serpRefreshCheck` may run before Step 9 when the workflow took a long time, the SERP is volatile, or Step 6 found contradictory market/intent evidence.

## Strategy Categories

The strategy may classify opportunities as:

- `first_organic_wins`: Long-tail or specific pages expected to be easier early wins.
- `highest_conversion`: Product/category pages closest to commercial action.
- `startup_conversion`: Needed conversion page where the existing site has little evidence.
- `low_competition`: Narrow, specific search intent with likely lower competition.
- `high_competition`: Important head terms or comparison spaces that may need stronger authority.
- `competitor_category`: Pages involving alternatives, comparisons, or competitor framing.

These labels are advisory. They help the editor choose which one page packet to generate next.

## Keyword Opportunity Rules

Prioritize unfocused and long-tail keywords where the page can win through specificity, depth, or a better answer rather than search volume alone. Strong opportunities usually show one or more of these signals: messy SERP intent, thin competitor coverage, specific reader problems, Reddit/forum/video language, comparison or alternative intent, pricing or objection intent, local or market-specific modifiers, or diagnostic/how-to modifiers.

Every selected opportunity should capture the primary keyword, at least 5 long-tail variants, at least 5 related questions, why the intent is underserved, the competitor miss, and the standout angle. Reject volume-only selection when the page idea cannot explain what it will answer better than existing results.

After Step 0B, these opportunity fields are advisory unless they are present in the frozen Page Scope Contract. Do not pull deferred opportunities, excluded phrases, or routed-out search tasks into the current page.

## Batch Page Scope Rules

In batch mode, compare each selected Page Scope Contract against every other planned or completed page in the current batch and against historical pages when available.

The duplicate check must compare:

- `targetKeyword`
- `targetQueryIntent`
- `primaryIntent`
- `primaryReaderStage`
- `pageType`
- `pageScopeSummary`
- `uniqueContribution`
- `mustCover`
- `mustNotCover`
- optional `componentOpportunityHint`

Fail or repair when two pages differ only by keyword wording, share the same page-body promise, share the same `uniqueContribution`, would naturally use the same section plan or decision content, or have heavy `mustCover` overlap.

Step 0B may include an optional `componentOpportunityHint` only when the query cluster obviously implies a reader aid. Required superiority components are not decided here; they are custom-created later by the SERP Superiority Gate.

In strict batch mode, process one page as: select one opportunity -> Step 0B -> Step 1 -> Step 2 -> Step 3 -> Step 4 -> Step 5 -> create `current-page.lock` -> begin Step 6, prewriting, research, and content work. Do not create `current-page.lock` until Step 5 returns `pass` or non-critical `pass_with_warnings` with action `continue_to_step6`.

## Source-Backed Inference Notes

Critical recommendations should include evidence strength:

- `high`: Directly supported by matching site metadata or explicit user input.
- `medium`: Supported by partial metadata, seed keywords, or common SEO structure.
- `low`: Agent inference because the site has weak or missing evidence.

Use evidence strength for strategic choices such as primary CTA direction, existing URL recommendation, and page structure.

## Refresh Rules

- Create a cluster strategy once per product/category.
- Refresh it only when the user asks.
- If the user says something should be saved for the cluster, add it to the cluster strategy document.
- Live SERP competitor/reference URLs may be used temporarily for the current strategy.
- Do not save live SERP URLs to the Reference Library unless the user explicitly asks.

## Agent Rules

- Recommend a cluster strategy before drafting a page packet.
- Generate one page packet at a time.
- Ask the user which page opportunity should be generated next.
- Recommend updating an existing URL when a relevant URL already exists.
- Include cross-category internal linking suggestions when useful.
- Keep quality score advisory, and recalculate it only when the user asks for a re-score.
- Competitor names, third-party logos, product screenshots, and external brand visuals still require explicit approval before page packet inclusion.
