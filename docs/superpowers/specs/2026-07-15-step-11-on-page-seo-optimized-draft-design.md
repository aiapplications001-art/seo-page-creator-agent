# Step 11 On-Page SEO Optimized Draft Design

Step 11 is the hard on-page SEO optimization gate after Step 10 SEO First Draft and before Step 12 trust/authority work. It improves the completed draft for relevance, clarity, topical completeness, answer placement, internal links, assets, and natural query coverage without changing strategy, rebuilding the outline, doing new research, or finalizing metadata.

## Artifacts

- `onPageSeoOptimizedDraft`
- `on-page-seo-optimized-draft.json`
- `on-page-seo-optimized-draft.md`
- `onPageSeoHash`

The JSON is the machine gate. The Markdown is the human review view and must maintain strict parity for optimized H1/H2/H3s, optimized copy or meaningful before/after summaries, topical completeness map, keyword coverage, internal-link and asset notes, change log, unresolved owner-step items, must-carry-forward block, and verdict.

## Required Upstream Hashes

Step 11 requires:

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
- `pageOutlineHash`
- `firstDraftHash`

If any required hash is missing or stale, Step 11 cannot create a speculative optimized draft.

## Allowed Edits

Step 11 may:

- optimize the H1
- optimize the introduction
- optimize H2/H3 wording while preserving the Step 9 section set and hierarchy
- improve section copy inside the frozen structure
- add or expand missing topical coverage when already required or clearly implied by Steps 5, 6, 8, 9, or 10
- increase depth where needed without reducing required depth
- move or remove off-intent, repetitive, over-covered, generic, or scope-drifting content
- improve answer placement
- improve internal-link anchor context using validated destinations only
- improve asset support, alt text, captions, and text fallback notes
- improve readability and scanability
- improve natural keyword/query coverage without stuffing

If Step 11 discovers that the structure itself is wrong, it must return to Step 9. If new factual research is needed, it must return to Step 6. If the brief or inclusion/depth contract is wrong, it must return to Step 8. If the first draft is incomplete or violates Step 10, it must return to Step 10.

## Required Fields

Step 11 must include:

- `onPageSeoHash`
- `onPageSeoSummaryStatement`
- `optimizedDraft`
- `seoChangeLog`
- `unresolvedOwnerStepItems`
- `intentAlignmentCheck`
- `h1OptimizationCheck`
- `introOptimizationGate`
- `headingOptimizationCheck`
- `topicalCompletenessMap`
- `naturalQueryCoverageContract`
- `sectionRelevanceCheck`
- `contentFocusChangeLog`
- `internalLinkOptimization`
- `assetOptimization`
- `readabilityScanabilityCheck`
- `answerPlacementCheck`
- `naturalLanguageOptimizationGate`
- `lightClaimSourceUseCheck`
- `metadataCandidates`
- `onPageSeoUniquenessCheck`
- `onPageSeoDeliveryProofRequirements`
- `mustCarryForward`
- `step11OutputMustNotContain`
- `step11CompletenessChecklist`
- `onPageSeoVerdict`

## Topical Completeness Map

Each topical completeness item must include:

- required topic or reader need
- current coverage
- depth needed
- status
- action: `add`, `expand`, `increase`, `move`, `remove`, `link`, `keep`, `return_to_step6`, `return_to_step8`, or `return_to_step9`
- upstream refs
- evidence refs where relevant
- delivery proof in the optimized draft

Step 11 uses the map to compare the draft against Step 8, Step 9, Step 5 baseline expectations, Step 6 research, user questions, required inclusions, and depth requirements. It must not run a new research phase.

## Keyword And Language Rules

Step 11 uses natural query coverage:

- represent the exact `targetKeyword` naturally in high-signal places where appropriate
- map supporting queries to reader needs rather than forced phrase insertion
- prohibit keyword-density targets
- prohibit awkward exact-match repetition
- prohibit forced synonyms
- prohibit scope expansion just to include keywords
- preserve the reader-first voice from Step 8 and Step 10

## Internal Links And Assets

Step 11 may optimize only validated internal-link destinations from Step 4/8/site inventory. It must preserve destination status and cannot invent URLs or pretend a `missing_but_recommended` destination exists.

Step 11 may optimize asset support, surrounding context, alt text, captions, and text fallback notes. It must not create final image prompts, generate images, or redesign assets.

## Metadata Boundary

Step 11 may propose non-final:

- `slugCandidate`
- `seoTitleCandidate`
- `metaDescriptionCandidate`

They must be labeled non-final. Final title tag, meta description, slug approval, and SERP snippet polish belong to a later metadata step.

## Warnings And Blockers

Allowed statuses:

- `pass`
- `pass_with_warnings`
- `fail`
- `ask_user`

Allowed onward action after a passing Step 11 is `continue_to_step12`.

`pass_with_warnings` is narrow and only allowed for non-critical limitations such as historical uniqueness being inaccessible, final metadata pending, minor copy polish pending, final citation display pending, or an optional omitted asset not needing alt text.

Hard blockers include intent mismatch, buried main answer, missing topical completeness map, missing required coverage, keyword stuffing, unsupported new claims, silent Step 9 hierarchy changes, missing required internal-link/asset handling, current-batch duplication, generic optimization, missing `onPageSeoHash`, missing Markdown parity, and Step 11 boundary violations.

## Repair Rules

Step 11 may repair weak Step 11 fields up to 2 times:

- missing change-log detail
- weak topical-completeness map
- unclear keyword coverage notes
- vague heading optimization rationale
- weak internal-link or asset notes
- incomplete readability proof
- missing non-final metadata labels
- weak natural-language proof

Step 11 must not repair true intent mismatch, structural issues requiring Step 9, new research needs requiring Step 6, missing Step 8/10 obligations, unsupported risky claims, current-batch duplication, or a non-defensible optimized draft.

## Must Carry Forward

`mustCarryForward` must include:

- `onPageSeoHash`
- optimized H1
- optimized heading map
- topical-completeness actions delivered
- natural query coverage
- internal-link notes
- asset-alt/fallback notes
- candidate metadata
- unresolved owner-step items
- downstream proof requirements

Step 12 and final QA must include `onPageSeoDeliveryProof` proving the on-page SEO improvements were preserved or intentionally improved.

## Must Not Contain

Step 11 must not contain:

- final title tag or meta description
- final schema
- final citation display strategy
- new research
- unsupported new claims
- final image prompts or generated images
- technical SEO QA
- live URL checks
- publishing decisions
- hidden Step 9 structure changes
- keyword-density targets
- copied competitor/source wording

## Completion Checklist

`step11CompletenessChecklist` must verify upstream hashes, Step 10 draft preservation, optimized draft, intent alignment, H1, intro, headings, topical completeness map, natural keyword coverage, section relevance, off-intent content handling, internal links, asset alt/fallback, readability, answer placement, natural language, claim safety, uniqueness, Markdown parity, and no boundary violations.
