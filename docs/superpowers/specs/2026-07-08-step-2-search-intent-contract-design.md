# Step 2 Search Intent Contract Design

Step 2 is the hard gate after Step 1 and before prewriting. Step 0A defines the topic, search problem, and problem-language. Step 0B freezes the selected keyword and page scope. Step 1 defines the page's job. Step 2 validates whether that job matches what searchers expect from the query.

Step 2 must not silently rewrite Step 0B or Step 1. If the query scope is wrong, return `return_to_0B`. If the page job is wrong, return `return_to_step1`. If intent cannot be resolved after allowed repairs, use `ask_user` in single-page mode and `skip_page` in batch mode.

## Required Artifact

`searchIntentContract` must include:

- `step0BContractHash`
- `pageJobHash`
- `searchIntentHash`
- `intentStatement`
- `dominantBroadIntent`
- `coPrimaryBroadIntent`
- `secondaryBroadIntents`
- `primaryDeeperIntent`
- `secondaryDeeperIntents`
- `projectSpecificIntentLabel`
- `expectedDepth` with `depthLevel` and `depthStyle`
- `satisfactionCondition` with `mustInclude`, `mustFeelHelpedBy`, `tooShallowIf`, and `wrongPageIf`
- `recommendedPageType`
- `dominantInternalContentFormat`
- `supportingContentFormats`
- `lightSerpValidation`
- `mixedIntentHandling`
- `pageJobAlignmentCheck`
- `validatedIntentDecision`
- `marketContextCheck`
- `aiOverviewIntentSignal`
- `intentEvidence`
- `mustCarryForward`
- `intentVerdict`
- `intentRepairLog`

## Intent Rules

`dominantBroadIntent` must be exactly one of `informational`, `commercial`, `transactional`, or `navigational`. `coPrimaryBroadIntent` is optional and may contain one additional broad intent, but the dominant intent controls structure, depth, CTA direction, and SERP alignment.

`primaryDeeperIntent` must be one universal fixed-enum value. `projectSpecificIntentLabel` may add nuance, such as Indian acne routine fit intent, but validators must rely on the universal enum. Secondary deeper intents may support sections but must not bloat or redirect the page.

## Evidence Rules

Step 2 uses light evidence only: query wording, Step 0B query cluster, Step 0B keyword/search evidence, PAA, autocomplete, related searches, and a top 5 SERP pattern check. It must not perform full competitor-quality scoring, SERP Superiority scoring, deep Reddit/forum/video gap synthesis, or required superiority component creation.

`lightSerpValidation` must inspect the top 5 SERP results when available and record result title, URL or domain when available, result type, snippet-level intent pattern, and whether each result supports or contradicts the chosen intent. Normal pass requires 3/5 results supporting the chosen `dominantBroadIntent` and `primaryDeeperIntent`. `pass_with_warnings` may continue at 2/5 only when PAA, autocomplete, query cluster, and other search-surface evidence strongly support the classification.

`aiOverviewIntentSignal` is optional when visible. It may describe Google's summarized answer shape, but it must not be copied, treated as factual authority, or used as a citation source.

`marketContextCheck` must record target market, location sensitivity, recency sensitivity, and whether the SERP was interpreted in the right context. India-targeted pages must not use non-India SERP patterns without warning or correction.

## Depth And Result Shape

`depthLevel` describes amount of depth: `short`, `moderate`, `comprehensive`, or `deep`.

`depthStyle` describes shape of depth, such as `quick_answer`, `conceptual_explainer`, `step_by_step_walkthrough`, `framework_based`, `example_heavy`, `checklist_based`, `decision_support`, `troubleshooting_based`, `template_supported`, or `tool_supported`.

Step 2 outputs validated recommendations, not final structure: `recommendedPageType`, `dominantInternalContentFormat`, `supportingContentFormats`, and `satisfactionCondition`. Prewriting must use them when building the actual section structure, or return to Step 2 with reasons.

## Mixed Intent

`mixedIntentHandling` must classify every non-dominant intent as `adjacent` or `conflicting`, then route it as `support_on_page`, `internal_link`, `separate_page`, `return_to_0B`, or `exclude`. If no dominant intent is defensible, return `return_to_0B`.

## Alignment And Decision

`pageJobAlignmentCheck` must map the selected intent to Step 1 `primaryHelpFormat`, `secondaryHelpFormats`, `userTask`, `taskConstraints`, `successCriteria`, `nonGoals`, `outcomeConsequence`, and `pageJobStatement`.

`validatedIntentDecision` must record whether the SERP and search-surface evidence `confirm`, `refine`, or `correct` the query-only hypothesis. Corrections that affect page scope must return to Step 0B. Corrections that affect the page job must return to Step 1.

## Verdicts And Repairs

`intentVerdict.status` may be `pass`, `pass_with_warnings`, `fail`, or `ask_user`. Its action must be one of `continue_to_prewriting`, `return_to_step1`, `return_to_0B`, `ask_user`, or `skip_page`.

Critical blockers include no defensible dominant intent, no defensible primary deeper intent, Step 0B mismatch, Step 1 mismatch, SERP contradiction, heavily mixed SERP with no dominant intent, market/context mismatch that changes scope, and missing top 5 SERP check when SERP access is available.

Step 2 may repair weak or missing Step 2 fields up to 2 times, including vague `intentStatement`, missing evidence refs, incomplete `lightSerpValidation`, incomplete `mixedIntentHandling`, weak `satisfactionCondition`, missing `tooShallowIf`, missing `wrongPageIf`, or unclear page-type/format explanation. It must not auto-repair true Step 0B mismatch, true Step 1 mismatch, no defensible dominant intent, or market mismatch that changes the page scope.
