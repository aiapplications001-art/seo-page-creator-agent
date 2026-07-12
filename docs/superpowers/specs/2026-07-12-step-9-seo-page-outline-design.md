# Step 9 SEO Page Outline Design

Step 9 is the dedicated hard gate after Step 8 SEO Content Brief and before Step 10 drafting. It turns the frozen `seoContentBrief` into a writer-ready page blueprint. It creates `seoPageOutline`, saves `seo-page-outline.json` and `seo-page-outline.md`, and freezes `pageOutlineHash`.

## Purpose

Step 9 answers: how should this page be structured so it satisfies the content brief clearly, completely, and logically?

Step 9 can choose the working H1, page flow, H2 structure, useful H3s, depth allocation by section, section purpose, broad asset/example/link/CTA placement, FAQ plan, and outline validation.

Step 9 must not redo research, change strategy, write final copy, create metadata, create final CTA wording, create image prompts, finalize citation display, or copy competitor headings, heading order, table logic, or section sequence.

## Artifacts

- `seo-page-outline.json`: machine-validated Step 9 contract.
- `seo-page-outline.md`: human-readable review view.
- `pageOutlineHash`: frozen outline contract hash.

The Markdown must maintain Markdown parity with the JSON for major decisions: working H1, page flow, H2 structure, depth map, asset placement, FAQ plan, verdict, and must-carry-forward summary.

## Required Hashes

Step 9 must include all upstream hashes:

- `step0AHash`
- `step0BHash`
- `pageJobHash`
- `searchIntentHash`
- `pageFormatHash`
- `nextActionHash`
- `serpCompetitorHash`
- `topicResearchHash`
- `uniqueAngleHash`
- `contentBriefHash`

Missing hashes hard-fail Step 9. Full hash chaining prevents stale or reused outline artifacts.

## Step 8 Refinement Rule

Step 9 may make only non-strategic Step 8 refinements through `step8RefinementPatch`.

Allowed refinements:

- clarify writer instructions
- merge overlapping inclusions
- adjust section-level depth when outline logic proves it
- move conditional inclusions into a specific outline section

Forbidden refinements:

- change target keyword
- change page job
- change intent
- change page type or internal format
- change next action
- change unique angle
- change required assets
- change exclusions
- change safety boundaries
- invent evidence or strategy

Strategic problems return to the owner step.

## Required Fields

`seoPageOutline` must include:

- `schemaVersion`
- `upstreamHashes`
- `pageOutlineHash`
- `workingH1`
- `pageFlowType`
- `pageFlowReason`
- `pageFlowStep8Refs`
- `readerJourneySummaryStatement`
- `sectionSequenceRationale`
- `mainIntentVisibilityCheck`
- `outlineSections`
- `queryCoveragePlan`
- `assetPlacementPlan`
- `internalLinkPlacementPlan`
- `ctaPlacementPlan`
- `faqPlan`
- `contentBriefDeliveryProof`
- `step8RefinementPatch`
- `outlineOriginalityCheck`
- `outlineScanabilityCheck`
- `headingHierarchyCheck`
- `batchOutlineIsolationCheck`
- `outlineDeliveryProofRequirements`
- `mustCarryForward`
- `step9OutputMustNotContain`
- `step9CompletenessChecklist`
- `step9RepairLog`
- `pageOutlineVerdict`

## Page Flow

Step 9 must choose exactly one primary `pageFlowType`, with reason and Step 8 refs.

Allowed examples:

- `beginner_to_advanced`
- `step_by_step`
- `problem_to_solution`
- `decision_making`
- `diagnosis_to_action`
- `safety_first`
- `comparison_to_recommendation`

The page flow controls the H2 order. Headings must not drive the flow.

## Main Intent Visibility

The main search intent must be visibly addressed within the first 1-2 H2 sections. This is a hard blocker.

This prevents pages from burying the real user concern under background context. Context can still appear, but the primary search need must appear early.

## Outline Sections

Normal pages should include 8-14 H2 sections. Exceptions must be justified by Step 2 depth, Step 3 format, Step 8 brief, and page type.

Each H2 must include:

- `sectionId`
- `headingText`
- `sectionRole`
- `mappedStep8Refs`
- `purpose`
- `depthLevel`
- `depthReason`
- `expectedTreatment`
- `mappedDepthRequirementRefs`
- `contentObligations`
- `h3s`
- `h3Rationale`
- `assetPlacements`
- `examplePlacements`
- `internalLinkNotes`
- `ctaNotes`
- `claimEvidenceNotes`
- `scopeBoundaryNotes`
- `transitionFromPrevious`

Only H2 sections get stable `sectionId`. H3s are nested without IDs. H3s should appear only when useful; a high-depth H2 without H3s must explain why it remains clear without substructure.

## Section Roles

Every H2 gets a fixed `sectionRole`, such as:

- `quick_answer`
- `context`
- `core_explanation`
- `process_step`
- `decision_support`
- `safety_boundary`
- `troubleshooting`
- `example`
- `asset_delivery`
- `comparison`
- `faq`
- `next_action`
- `summary`

Section roles make the outline more than a heading list and help Step 10 understand how each section should be drafted.

## Depth And Obligations

Every H2 must include a structured depth contract:

- `depthLevel`
- `depthReason`
- `expectedTreatment`
- `mappedDepthRequirementRefs`

Every H2 also needs section-level `contentObligations`, such as answer, explanation, example, caveat, evidence use, mistake, decision rule, asset, link, or next-action support.

## Query Coverage

`queryCoveragePlan` must map the target keyword and supporting queries to natural sections and implied needs. It must also list `doNotForceTerms` so long-tail or adjacent terms are not stuffed into the page.

## Assets, Links, CTA, And FAQ

Step 9 must place Step 7 assets and Step 8 practical devices at section level. It must not write final asset rows, labels, branches, details, or copy.

Step 9 plans internal links and CTA at broad section level only, with reader-moment rationale. Exact CTA wording and final internal-link optimization belong later.

FAQ is required by default as `short` or `detailed`. A `none` FAQ decision is allowed only with strong evidence that FAQ would duplicate the main body or harm page flow.

## Originality And Scanability

Step 9 must include `outlineOriginalityCheck` and `outlineScanabilityCheck`.

It must not copy competitor headings, heading order, table logic, or section sequence. Synthesized SERP expectations are allowed only when converted into a page-specific structure.

The scanability check must verify important answer early, clear section order, no overloaded H2s, no buried safety or decision information, and scannable headings.

## Brief Delivery Proof

`contentBriefDeliveryProof` must show every mandatory Step 8 instruction is represented in the outline, intentionally routed, or returned to Step 8.

Step 9 must not allow a strong brief to become a weak outline.

## Batch Isolation

`batchOutlineIsolationCheck` is mandatory. It must confirm this page has its own outline artifacts, no prior outline was reused, same section journey/roles/assets/examples/FAQ/CTA flow were not copied, and current-batch similarity is low or justified.

Current-batch uniqueness is a hard blocker. Historical uniqueness is required when accessible; unavailable history can pass only with warnings.

## Downstream Proof

Step 10 must map draft content to `pageOutlineHash` and H2 `sectionId`s. Final QA must verify the frozen outline was delivered or approved changes were logged.

## Must Carry Forward

`mustCarryForward` must tell Step 10 the non-negotiables:

- working H1
- page flow type
- H2 order and section IDs
- section obligations
- depth allocation
- asset placements
- FAQ plan
- CTA and link placement
- scope boundaries
- evidence notes
- query coverage
- originality constraints

## Boundary Contract

`step9OutputMustNotContain` must prohibit:

- full paragraphs
- final page copy
- final CTA wording
- SEO title or meta
- final citation display
- image prompts
- new research
- new facts
- copied competitor/source headings
- copied competitor/source structure
- exact asset rows or details

## Repairs And Routing

Step 9 may repair weak Step 9 fields up to 2 times.

Repairable:

- weak section purpose
- missing refs
- unclear depth reason
- missing FAQ routing
- weak scanability note
- missing placement rationale
- unclear transition note

Not repairable:

- missing Step 8 hash
- strategic conflict
- copied competitor structure
- no defensible flow
- failure to address main intent early
- unsafe outline
- duplicate current-batch outline
- missing required asset
- broken Step 8 delivery proof

Non-repairable failures route to the owner step:

- brief issue: `return_to_step8`
- unique angle or asset issue: `return_to_step7`
- research or evidence issue: `return_to_step6`
- SERP or competitor issue: `return_to_step5`
- next-action issue: `return_to_step4`
- format issue: `return_to_step3`
- intent issue: `return_to_step2`
- page job issue: `return_to_step1`
- scope/query issue: `return_to_0B`
- unresolved batch issue: `skip_page`

## Verdict

`pageOutlineVerdict.status`:

- `pass`
- `pass_with_warnings`
- `fail`
- `ask_user`

`pageOutlineVerdict.action`:

- `continue_to_step10`
- `repair_step9`
- `return_to_step8`
- `return_to_step7`
- `return_to_step6`
- `return_to_step5`
- `return_to_step4`
- `return_to_step3`
- `return_to_step2`
- `return_to_step1`
- `return_to_0B`
- `ask_user`
- `skip_page`

`pass_with_warnings` is allowed only for non-critical limitations.

Hard blockers include missing upstream hashes, no working H1, no page flow type, main intent not visible in first 1-2 H2s, missing Step 8 delivery proof, missing required assets, missing section mappings, unsafe outline, copied competitor structure, duplicate current-batch outline, no Markdown parity, and Step 9 boundary violations.

## Completeness Checklist

`step9CompletenessChecklist` must confirm:

- upstream hashes present
- `contentBriefHash` present
- working H1 present
- pageFlowType chosen
- reader journey summary present
- section sequence rationale present
- H2 count valid or exception justified
- main intent visible in first 1-2 H2s
- all H2s mapped to Step 8
- all H2s have section roles
- all H2s have depth contracts
- all H2s have content obligations
- H3s used only where useful
- assets placed
- internal links planned
- CTA placement planned
- FAQ plan complete
- query coverage plan complete
- claim/evidence notes complete
- scope boundary notes complete where needed
- scanability checked
- originality checked
- batch isolation checked
- Step 8 proof complete
- mustCarryForward complete
- no Step 9 boundary violation
- Markdown parity verified
