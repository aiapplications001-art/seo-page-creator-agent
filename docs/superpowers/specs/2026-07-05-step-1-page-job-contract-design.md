# Step 1 Page Job Contract Design

Step 1 defines the page's job after Step 0A has defined the search opportunity and Step 0B has frozen exactly one page scope.

Step 1 answers: what exactly is this page supposed to do for the user?

The page must not be treated as only "a page targeting a keyword." It must be treated as "a page created to help a specific user achieve a specific outcome."

## Position In Workflow

The required order is:

```text
Step 0A Foundation
-> Step 0B Page Scope Contract
-> selected page opportunity
-> Step 1 Page Job Contract
-> Pre-Writing Strategy
-> V2 research, depth gates, final copy, images, QA, publish
```

Step 1 is a hard gate before prewriting. Prewriting, V2 research, final copy, page packets, images, commits, deploys, and publishing must not start unless Step 1 returns `pass` or non-critical `pass_with_warnings`.

Step 1 may infer the page job from Step 0A and Step 0B. It must not directly modify Step 0B. If Step 0B is wrong or incomplete, Step 1 must return `return_to_0B` with the exact issue. Prewriting must not directly modify Step 1; if the page job is wrong or incomplete, it must return `return_to_step1`.

## Required Artifact

Step 1 must produce `pageJobContract` with:

- `step0BContractHash`: the frozen Step 0B `contractHash`.
- `pageJobHash`: frozen identifier for the Step 1 contract.
- `pageJobStatement`: one clear sentence using the pattern "This page should help [audience] [do/understand/solve something specific] by giving them [kind of help], so that they can [user outcome]."
- `audience`: structured audience plus `audienceSentence`.
- `userTask`: structured task plus `taskSentence`.
- `primaryHelpFormat`: exactly one controlled-enum help format.
- `secondaryHelpFormats`: 0-3 controlled-enum support formats.
- `userOutcome`: structured outcome with required `outcomeConsequence`.
- `businessRole`: structured business role with `primaryBusinessRole`.
- `riskLayer`: light safety framing with `riskLevel` and `claimSensitivity`.
- `evidenceBasis`: Step 0A/0B refs proving the job was inferred, not invented.
- `jobUniquenessCheck`: duplicate check against current batch, planned cluster, and historical page jobs when available.
- `pageJobVerdict`: `pass`, `pass_with_warnings`, `fail`, or `ask_user`.
- `inferenceRepairLog`: up to 2 automatic repair attempts and their outcome.

All downstream artifacts must carry both `step0BContractHash` and `pageJobHash`. If audience, task, help format, outcome, business role, risk, non-goals, evidence, uniqueness, or `pageJobStatement` changes, regenerate Step 1 and create a new `pageJobHash`.

## Audience Rules

`audience` must include:

- `audienceSentence`
- `audienceSegment`
- `experienceLevel`
- `marketContext`
- `readerSituation`
- `primaryConcern`
- `awarenessLevel`
- `decisionStage`
- `exclusions`

`experienceLevel` must be one of `beginner`, `beginner_to_intermediate`, `intermediate`, `advanced`, or `mixed`.

`awarenessLevel` must be one of `unaware`, `problem_aware`, `solution_aware`, `product_aware`, or `most_aware`.

`decisionStage` must be one of `learning`, `evaluating_fit`, `comparing_options`, `ready_to_act`, or `troubleshooting`.

Audience must trace to Step 0A `readerState` and `problemLanguage`. It fails if it is so broad that multiple pages in the cluster could use the same audience without change.

## User Task Rules

`userTask` must include:

- `taskSentence`: exactly 1 plain-language sentence.
- `taskAction`: exactly 1 controlled-enum action.
- `taskObject`: exactly 1 specific object.
- `taskConstraints`: 1-3 constraints.
- `successCriteria`: 3-6 testable criteria.
- `nonGoals`: 3-8 boundaries.

`taskAction` must be one of `understand`, `learn`, `decide`, `compare`, `choose`, `troubleshoot`, `diagnose_non_medical`, `plan`, `start`, `avoid_mistakes`, `evaluate_fit`, or `prepare_to_act`.

`taskConstraints` are required because they prevent generic jobs. `successCriteria` must be specific enough that final copy can be checked against them. `nonGoals` must align with Step 0B `mustNotCover`. Sensitive topics must include unsafe framings in `nonGoals` when relevant.

## Help Format Rules

`primaryHelpFormat` is the reader's needed help shape, not the final page type or section structure. It must be exactly one value from:

- `educational_explainer`
- `how_to`
- `step_by_step_walkthrough`
- `decision_guide`
- `comparison`
- `eligibility_or_fit`
- `problem_diagnosis`
- `troubleshooting`
- `product_selection`
- `service_selection`
- `local_provider_selection`
- `pricing_or_cost`
- `best_options_roundup`
- `checklist`
- `example_led_teaching`

`secondaryHelpFormats` may include up to 3 supporting values. More than 3 means the job is likely bloated and should be tightened or split.

## Outcome Rules

`userOutcome` must include:

- `outcomeSentence`: exactly 1 plain-language sentence.
- `knowledgeGained`: 2-5 items.
- `decisionEnabled`: 0-1 item.
- `actionEnabled`: 0-1 item.
- `outcomeConsequence`: exactly 1 controlled value.
- `confidenceLevel`: exactly 1 value.

`outcomeConsequence` must be one of `understand_topic`, `make_decision`, `adjust_routine`, `shortlist_options`, `compare_options`, `avoid_risky_action`, `book_consultation`, `start_process`, `prepare_next_step`, or `save_for_later`.

Either `decisionEnabled` or `actionEnabled` should usually be present. Sensitive-topic outcomes must be safe and bounded.

## Business Role Rules

`businessRole` must use a fixed enum and stay behind the user job. It must include exactly one `primaryBusinessRole` and up to 3 secondary roles.

Allowed roles:

- `authority_building`
- `topical_coverage`
- `demand_creation`
- `problem_education`
- `internal_link_support`
- `soft_conversion_support`
- `lead_capture_support`
- `product_fit_education`
- `service_fit_education`
- `comparison_support`
- `local_trust_building`
- `retention_or_support`
- `refresh_existing_page`

The role must trace to Step 0A `businessSideRelevance` and Step 0B `businessGoal`. It fails if the business role overrides the reader's task.

## Risk Layer Rules

`riskLayer` is a light safety boundary, not the full citation gate. It must include:

- `riskLevel`: `low`, `medium`, `high`, or `ymyl`.
- `claimSensitivity`: one or more of `medical_or_skincare_safety`, `financial_decision`, `legal_or_regulatory`, `physical_safety`, `children_or_vulnerable_groups`, `education_or_career_outcome`, or `none`.
- `jobSafetyBoundary`
- `prohibitedJobFraming`
- `requiredCaution`

High or YMYL risk does not fail by itself. Unsafe framing fails. For skincare, medical, finance, legal, or safety topics, the job must not promise diagnosis, treatment, cure, guaranteed results, or replacement for professional advice.

## Evidence Basis Rules

`evidenceBasis` must prove Step 1 did not invent the job. It may only cite Step 0A and Step 0B fields. It must include source refs for `audience`, `userTask`, `userOutcome`, `businessRole`, `riskLayer`, and `pageJobStatement`.

Each major field needs at least 1 source ref. `userTask`, `userOutcome`, and `pageJobStatement` should usually have at least 2 source refs. If Step 0A/0B evidence is insufficient, Step 1 must ask the user or return to Step 0A/0B.

## Uniqueness Rules

`jobUniquenessCheck` is required in batch mode and whenever current-batch, planned-cluster, or historical page jobs are available.

Compare:

- `audience.audienceSegment`
- `audience.readerSituation`
- `audience.primaryConcern`
- `userTask.taskAction`
- `userTask.taskObject`
- `primaryHelpFormat`
- `userOutcome.outcomeConsequence`
- `pageJobStatement`

Fail if two pages share the same audience, task, primary help format, and outcome consequence, or if only keyword wording differs. If history is inaccessible, allow non-critical `pass_with_warnings` and carry the uniqueness warning forward.

## Repair And Fallback

Step 1 may make up to 2 automatic repair attempts for vague audience, vague task, missing constraints, thin success criteria, weak non-goals, unclear help format notes, weak business role notes, weak evidence mapping, incomplete `pageJobStatement`, or missing formula parts.

Do not auto-repair true 0A/0B conflicts, unsafe framing, duplicate page jobs, business role overriding user need, two primary jobs, or missing/failed 0A or 0B.

If repairs fail:

- Single-page mode stops with `ask_user` and exact blockers.
- Batch mode preserves the failed `pageJobContract`, records the reason, skips the page, and selects a replacement opportunity.
- Allowed fallback actions are `repair_step1`, `return_to_0B`, `return_to_0A`, `merge_with_existing_page`, `split_page_opportunity`, `ask_user`, and `skip_page`.

Failure must be diagnostic and name the issue area: `audience`, `userTask`, `helpFormat`, `userOutcome`, `businessRole`, `risk`, `evidenceBasis`, or `uniqueness`.

## Final Copy Carry-Forward

Final copy QA must check the finished page against Step 1. The final page must visibly serve the `audienceSentence`, `taskSentence`, `primaryHelpFormat`, `outcomeConsequence`, `successCriteria`, `nonGoals`, and `riskLayer` safety boundary. If final copy fails the Page Job Contract, return `return_to_step1` when the job is wrong or repair final copy when the job is correct but under-delivered.
