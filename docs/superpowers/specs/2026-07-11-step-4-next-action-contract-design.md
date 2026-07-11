# Step 4 Next Action Contract Design

## Purpose

Step 4 defines what the user should naturally do after consuming the page. It comes after Step 3 has locked the page type and internal content format, and before prewriting, V2 research, page packet generation, final copy, images, commit, deploy, or live publishing.

The goal is to prevent dead-end SEO pages while avoiding forced sales CTAs that do not match the reader's stage.

## Contract

Step 4 produces `nextActionContract` with:

- `step0BContractHash`
- `pageJobHash`
- `searchIntentHash`
- `pageFormatHash`
- `nextActionHash`
- `userJourneyStage`
- `secondaryJourneyStages`
- `secondaryStageNotes`
- `primaryNextAction`
- `secondaryNextActions`
- `ctaStrength`
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
- `sensitiveActionRiskCheck`
- `internalDestinationCheck`
- `rejectedNextActions`
- `nextActionUniquenessCheck`
- `step4OutputMustNotContain`
- `nextActionRepairLog`
- `nextActionVerdict`
- `mustCarryForward`

## Rules

`userJourneyStage` is exactly one primary fixed enum: `learning`, `evaluation`, or `action`.

`secondaryJourneyStages` may include up to 3 adjacent readiness states, but they cannot control the main CTA.

`ctaStrength` is a fixed enum: `soft`, `medium`, or `direct`.

`ctaStrengthMapping` is strict by default: `learning` -> `soft`, `evaluation` -> `medium`, and `action` -> `direct`.

Any mismatch requires `ctaStrengthExceptionReason` and `ctaStrengthExceptionEvidenceRefs`. Secondary journey stages cannot justify a mismatch by themselves.

`primaryNextAction` is the one most logical next step after the page satisfies the search need.

`secondaryNextActions` must include 1-3 softer or alternate next steps for users not ready for the primary action.

Every primary and secondary action must include evidence refs and `finalCopyGuidance`. The guidance must explain how the action should become visible later without writing exact CTA copy.

`finalCopyGuidance` can use broad placement labels such as `near_end`, `after_decision_tool`, `after_troubleshooting`, `after_comparison`, `after_key_takeaway`, or `contextual_internal_link_only`. It must not include exact section IDs, exact CTA copy, button text, layout, or final prose.

`internalJourneyPath` must prevent dead-end content by naming the next internal page, resource, tool, diagnostic, product/category page, contact route, or destination type.

`internalJourneyPath` is primarily internal. External destinations are allowed only for trust, safety, compliance, official medical/legal/financial guidance, platform documentation, required third-party action, or other recommended products where relevant. They must not replace a brand-owned next step unless safety or trust requires it.

`internalDestinationCheck.destinationStatus` must be one of:

- `existing_internal_destination`
- `missing_but_recommended`
- `external_destination`
- `ask_user_required`

If inventory or repo pages are accessible, Step 4 must check them. If inventory is inaccessible, Step 4 may continue with `pass_with_warnings`. If an ideal support resource is missing and does not affect business positioning or safety, infer `missing_but_recommended` instead of asking the user.

`brandConnectionFit` is required and must use one of:

- `direct_business_connection`
- `soft_brand_bridge`
- `authority_building_internal_education`
- `no_brand_connection_reader_first_justified`

The action may be purely educational when that best fits the user's stage. It may reference other pages/resources of the same business when that is the natural user-first continuation.

`rejectedNextActions` must include at least 2 plausible wrong actions.

`nextActionUniquenessCheck` lightly compares primary/secondary actions and journey path across current-batch and historical pages. Identical paths require a page-specific reason, repair, or failure.

`nextActionStatement` must be a compact human-readable sentence in the user's Step 4 style.

## Boundaries

Step 4 must not:

- define broad business role
- choose page type
- choose internal content format
- create the full outline
- create exact CTA placement
- write final CTA copy
- write final prose
- create metadata
- create image prompts
- create image manifest
- publish or deploy

Step 4 uses only inherited evidence from Step 0B, Step 1, Step 2, Step 3, and already-known site inventory/conversion destinations. It must not start new SERP, competitor, Reddit, video, PAA, or keyword research.

## Routing

`nextActionVerdict.status` may be `pass`, `pass_with_warnings`, `fail`, or `ask_user`.

`nextActionVerdict.action` must be one of:

- `continue_to_prewriting`
- `return_to_step3`
- `return_to_step2`
- `return_to_step1`
- `return_to_0B`
- `ask_user`
- `skip_page`

Return to Step 3 when the page format cannot support the intended next action.

Return to Step 2 when the user stage contradicts validated intent.

Return to Step 1 when the action contradicts page job, user outcome, or business role.

Return to Step 0B when the action reveals the selected scope/query cluster is wrong.

## Repairs

Allow up to 2 automatic repairs for weak Step 4 fields:

- vague next-action statement
- missing evidence refs
- missing `finalCopyGuidance`
- weak destination label
- weak `rejectedNextActions`
- CTA strength mismatch without exception fields
- missing secondary action

Do not auto-repair:

- unsafe sensitive destination
- impossible internal destination
- business positioning conflict
- true Step 3 format conflict
- true Step 2 stage/intent conflict
- true Step 1 business-role conflict
- Step 0B scope conflict
- unsafe sensitive-topic action
- no defensible primary next action
- no defensible CTA strength

Non-repairables must route to the owning previous step, `ask_user`, or `skip_page` in batch mode after allowed attempts.

`pass_with_warnings` may continue automatically only for non-critical issues such as inaccessible inventory, `missing_but_recommended` support resource, a secondary journey stage that does not control the CTA, or a missing internal URL with clear destination type.

## Carry Forward

All downstream artifacts must carry `nextActionHash`.

If `userJourneyStage`, `primaryNextAction`, `secondaryNextActions`, `ctaStrength`, `internalJourneyPath`, `nextActionStatement`, or next-action boundaries change, return to Step 4 before continuing.

Final copy or page-packet QA must include `nextActionDeliveryProof` showing the primary next action, secondary next actions, CTA strength, and internal journey path became visible in final copy or visible link guidance.
