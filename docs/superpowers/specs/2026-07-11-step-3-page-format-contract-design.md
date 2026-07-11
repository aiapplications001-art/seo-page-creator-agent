# Step 3 Page Format Contract Design

Step 3 is the hard gate after Step 2 and before prewriting. Step 0B freezes page scope, Step 1 defines the page job, Step 2 validates search intent, and Step 3 chooses the content vehicle: the page type, internal content format, supporting elements, and format boundaries.

Step 3 does not create the outline. It must not write H1/H2/H3 headings, exact section order, CTA strategy, competitor gaps, metadata, final copy, image prompts, image manifest, or layout specs. Those belong to later steps.

## Required Artifact

`pageFormatContract` must include:

- `step0BContractHash`
- `pageJobHash`
- `searchIntentHash`
- `pageFormatHash`
- `primaryPageType`
- `secondaryPageTypeInfluences`
- `primaryInternalContentFormat`
- `supportingFormatInfluences`
- `supportingContentElements`
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

## Core Rules

`primaryPageType` is required and must be exactly one fixed-enum page type. `secondaryPageTypeInfluences` may shape delivery style, but they must stay subordinate. Blended primary labels such as guide/tutorial/explainer fail.

`primaryInternalContentFormat` is required and must be exactly one fixed-enum delivery spine. `supportingFormatInfluences` are optional, with a maximum of 3. Supporting influences cannot become equal delivery spines.

`supportingContentElements` must contain 3-6 items. Each item must map to Step 2 `satisfactionCondition`, include `allowedScope`, include `notAllowedScope`, and support the selected page type and internal content format. Visual or media ideas may appear only as supporting elements, never as image strategy.

Step 3 may lightly refine Step 2 recommendations inside the validated intent. If Step 2 recommends guide/tutorial, Step 3 may choose final guide plus step-by-step walkthrough. If Step 3 wants to change guide into comparison_page, it must return `return_to_step2`.

## Evidence And Boundaries

Step 3 uses light inherited evidence only. It must not start new SERP, competitor, Reddit, video, PAA, or keyword research. `formatEvidenceBasis` must cite upstream fields from Step 0B, Step 1, and Step 2.

`scopeBoundaryCheck` must prove the selected format respects Step 0B `mustCover` and `mustNotCover`. If the format requires content outside current scope, return `return_to_0B`.

`formatRiskCheck` is required for sensitive topics when relevant. It must use Step 1 `riskLayer` and `claimSensitivity` to catch risky format choices such as tutorial-style diagnosis, treatment instructions, guarantees, financial advice, legal advice, or unsafe self-assessment framing.

`businessConnectionBoundary` may describe what kind of business connection is compatible with the format, such as soft internal link or contextual brand bridge. Step 3 must not define CTA copy, CTA placement, or conversion strategy.

## Routing And Rejections

`adjacentNeedRouting` must route every adjacent need that does not fit the current page. Allowed decisions are `support_as_element`, `brief_mention_only`, `internal_link_if_available`, `separate_page`, `future_page_opportunity`, `exclude_from_current_page`, `return_to_step2`, or `ask_user`.

`rejectedPageTypes` and `rejectedInternalFormats` are mandatory. Each should include 2-5 plausible-but-wrong options with evidence-linked reasons. Rejections must cite upstream Step 0B, Step 1, or Step 2 fields.

`formatCompatibilityCheck` must classify the selected page type plus internal format as `strong`, `acceptable_with_reason`, `weak`, or `invalid`. Invalid combinations fail. Weak combinations usually repair or return to Step 2.

`formatUniquenessCheck` is a light batch/historical check. It compares `primaryPageType`, `primaryInternalContentFormat`, `supportingContentElements`, `formatDecisionStatement`, and `formatBoundaries`. Identical current-batch format signatures are blockers unless there is a specific page-level reason.

## Verdicts And Repairs

`formatVerdict.status` may be `pass`, `pass_with_warnings`, `fail`, or `ask_user`. Its action must be one of `continue_to_prewriting`, `return_to_step2`, `return_to_step1`, `return_to_0B`, `ask_user`, or `skip_page`.

Step 3 may repair weak Step 3 fields up to 2 times. Repairable issues include missing reason, weak `formatDecisionStatement`, too many supporting elements, missing `allowedScope`, missing `notAllowedScope`, missing rejected format, weak evidence mapping, or unclear adjacent routing. It must not auto-repair true Step 2 contradiction, true Step 1 mismatch, Step 0B scope conflict, unsafe sensitive-topic format, no defensible `primaryPageType`, or no defensible `primaryInternalContentFormat`.

`mustCarryForward` must include the selected `primaryPageType`, `primaryInternalContentFormat`, supporting element names, `formatDecisionStatement`, and format boundaries. All downstream artifacts must carry `pageFormatHash`; if page type, internal format, supporting elements, or boundaries change, return to Step 3.

## Batch Placement

Batch runs must process:

```text
Select one opportunity
-> Step 0B Page Scope Contract
-> Step 1 Page Job Contract
-> Step 2 Search Intent Contract
-> Step 3 Page Format Contract
-> create current-page.lock
-> begin prewriting/research/content work
```

`current-page.lock` must not be created until Step 3 returns `pass` or non-critical `pass_with_warnings` with action `continue_to_prewriting`.
