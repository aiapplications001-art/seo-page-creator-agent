# Step 8 SEO Content Brief Design

Step 8 is the writer-ready content brief gate after Step 7 Unique Angle And Information Gain and before Step 9 outline creation. It compiles Steps 0A through 7 into a concise, traceable instruction contract for the writer.

Step 8 is not the outline, draft, metadata, image, citation-display, CTA-copy, or final page packet step. It may translate upstream decisions into usable writer instructions, but it must not change strategy, start new research, invent missing evidence, create final headings, decide section order, or write final prose.

## Artifacts

Every page must create:

- `seo-content-brief.json`
- `seo-content-brief.md`
- `contentBriefHash`

The JSON is the machine-validated source of truth. The Markdown is the human review view and must maintain strict parity for major decisions: verdict, summary statement, word-count floor/range, high-depth obligations, mandatory/prohibited instructions, Step 7 assets, voice rules, claim boundaries, `mustCarryForward`, and delivery-proof requirements.

## Required Upstream Hashes

Step 8 must hard-fail if any required upstream hash is missing or invalid:

- `step0AHash`
- `step0BHash`
- `pageJobHash`
- `searchIntentHash`
- `pageFormatHash`
- `nextActionHash`
- `serpCompetitorHash`
- `topicResearchHash`
- `uniqueAngleHash`

If an upstream contract is incomplete, speculative briefs are forbidden. Step 8 must route to the owner step, ask the user, or skip the page in batch mode.

## Required Contract Fields

`seoContentBrief` must include:

- `upstreamHashes`
- `contentBriefHash`
- `contentBriefSummaryStatement`
- `readerOutcomePromise`
- `provisionalWorkingTitle`
- `targetWordCountContract`
- `depthRequirements`
- `depthBoundaries`
- `instructionRegistry`
- `upstreamCoverageMatrix`
- `requiredInclusions`
- `conditionalInclusions`
- `exclusions`
- `queryCoverageContract`
- `sourceUseGuidance`
- `assetBriefingContract`
- `voiceAndQualityContract`
- `readabilityAndScanabilityRequirements`
- `antiGenericContract`
- `synthesisRequirement`
- `brandFitBoundaries`
- `marketLocalizationRequirements`
- `recencySensitivityCheck`
- `readerObjectionHandling`
- `internalLinkGuidance`
- `practicalDeviceRequirements`
- `minimumCompletenessStandard`
- `draftRepairGuidance`
- `openQuestionsAndAssumptions`
- `batchBriefIsolationCheck`
- `semanticBriefUniquenessCheck`
- `contentBriefDeliveryProofRequirements`
- `mustCarryForward`
- `step8OutputMustNotContain`
- `step8CompletenessChecklist`
- `contentBriefRepairLog`
- `contentBriefVerdict`

## Summary And Outcome

`contentBriefSummaryStatement` is mandatory. It is a compact human sanity check describing what the page must become, including audience, format, hard depth, key boundaries, unique asset or differentiation, query coverage, and major exclusions.

`readerOutcomePromise` is mandatory. It states what the reader should be able to decide, understand, or do after reading. Step 10 and final QA must test delivery against it.

`provisionalWorkingTitle` is allowed only as a non-final page identity. It must be derived from upstream contracts and cannot introduce a new promise, modifier, intent, or scope. Step 9 owns H1; metadata owns final title/meta.

## Word Count And Depth

Step 8 must define:

- `minimumWordCount`
- `targetWordCountRange`
- `rangeBasis`
- `rangeFlexibility`

The minimum is a hard floor. Draft and final QA block below it. The target range is evidence-derived from Step 2 depth, Step 5 competitor depth benchmark, Step 6 evidence volume, Step 3 format, Step 7 assets/improvements, and Step 0B exclusions. Going above the range is allowed when useful; filler is forbidden.

`depthRequirements` must include:

- `highDepthRequirements`: normally 3-7.
- `supportingDepthRequirements`: normally 2-6.
- `keepBriefOrExclude`: at least 2.

Each high-depth item needs what, why, evidence refs, completeness test, and at least two relevant depth devices such as example, process guidance, comparison, caveat, mistake, edge case, decision rule, or troubleshooting action.

`depthBoundaries` explicitly tells the writer where not to go deep, what to exclude, and what to route elsewhere. This prevents a comprehensive page from becoming bloated or mixing separate page opportunities.

## Instruction Registry

Every writer instruction must appear in `instructionRegistry` with:

- `instructionId`
- `instructionType`
- `writerInstruction`
- `priority`
- `sourceRefs`
- `scopeBoundary`
- `step9Use`
- `step10Use`
- `deliveryTest`

Priority enum:

- `mandatory`
- `conditional`
- `supporting`
- `prohibited`

Mandatory and prohibited instructions are hard gates.

`upstreamCoverageMatrix` maps every Step 0A through Step 7 `mustCarryForward` item and required delivery obligation to a Step 8 instruction, conditional instruction, exclusion, or owner-step return.

## Evidence, Sources, And Claims

`sourceUseGuidance` tells the writer which claims need visible support, softening, qualification, avoidance, or illustrative framing. It must preserve the Step 6 separation between authoritative topic evidence and audience/search-language evidence. Audience language can support questions, objections, phrasing, confusion, and mistakes; it cannot support medical, legal, finance, safety, product-efficacy, or factual truth claims by itself.

Step 8 may define which claims need support or softening, but it must not decide exact citation placement or citation display style.

`recencySensitivityCheck` is mandatory for every page. Detailed freshness instructions are required when `recencySensitive` is true, including recent support needs, stale facts to avoid, product/pricing/regulation/platform volatility, and whether a SERP or research refresh is required before Step 9 or Step 10.

## Assets And Practical Devices

`assetBriefingContract` translates Step 7 assets into writer instructions. Each asset must define purpose, reader input/output, required information categories, evidence refs, accessible fallback, content boundaries, and delivery test. Step 8 must not define exact rows, branches, labels, wording, placement, image prompts, or styling.

Practical device baselines live in `config/step8-practical-device-baselines.json`. Codex, Gemini, and Antigravity adapters must read the shared config and may not maintain separate baseline lists in prompts. Step 8 records page-specific device minimums, replacements, reasons, and evidence.

## Voice, Brand, Market, And Readability

`voiceAndQualityContract` is mandatory and must be inherited from brand profile, Step 1 audience, Step 2 intent/depth, Step 3 format, and project voice rules. Missing brand voice is a blocker or return to onboarding; the agent must not invent brand voice.

`brandFitBoundaries` is mandatory. It defines what the brand can credibly say, where a natural brand connection is allowed, what is forced, unsafe, outside authority, or over-salesy, and when to route to internal pages, professional advice, support, diagnostic flow, product/category page, or other destinations.

`marketLocalizationRequirements` is mandatory when market-sensitive. For Indian-market pages, it must preserve local assumptions, allowed India-specific examples/constraints, weak-local-evidence softening, and global assumptions that must not be imported.

`readabilityAndScanabilityRequirements` are content-level only. They can require plain early answer, short paragraphs, scannable explanation blocks, unavoidable safety caveats, defined terms, and text fallbacks for decision tools. They cannot dictate exact layout, styling, or placement.

## Anti-Generic And Synthesis Requirements

`antiGenericContract` is mandatory and must include:

- `genericFailureRisks`
- `pageSpecificityRequirements`
- `genericPhrasesOrMovesToAvoid`

Step 10 and final QA must block reusable, page-swappable prose.

`synthesisRequirement` is mandatory. It tells the writer what must be synthesized: Step 5 gaps with Step 6 evidence, research into reader decisions, examples, mistakes, caveats, practical rules, and Step 7 assets that are useful rather than decorative. Source-by-source summary writing fails.

## Reader Questions And Objections

`readerObjectionHandling` is mandatory when Step 6 or Step 7 found objections, fears, confusion, or hesitation. Each item needs evidence refs, why it matters, depth level, and routing to core content, caveat, troubleshooting, FAQ candidate, separate page, or exclusion.

`answerObligationRouting` should route reader questions as `answer_as_core_content`, `support_briefly`, `faq_candidate_for_step9`, `separate_page`, or `exclude_with_reason`. Core intent questions must not be buried in FAQ only.

## Links And Next Action

`internalLinkGuidance` may use only Step 4 validated destinations and accessible inventory already checked upstream. It defines link purpose, destination status, anchor-theme guidance, and reader moment. Step 9 chooses exact placement. Step 8 must not invent URLs or restart site research.

## Completion And Delivery Proof

`minimumCompletenessStandard` defines page completeness. A page is complete only when it satisfies every Step 2 satisfaction condition, mandatory instruction, high-depth completeness test, Step 7 required asset/improvement, claim boundary, practical-device minimum, hard word-count floor, and hard exclusion.

`contentBriefDeliveryProofRequirements` creates a progressive proof chain:

- Step 9 proves every mandatory brief instruction is represented in the outline plan without writing it.
- Step 10 maps each mandatory instruction to visible draft content, assets, examples, evidence handling, or approved conditional omission.
- Final QA verifies the delivered page still satisfies `contentBriefHash`, minimum word count, completeness tests, safety boundaries, required assets, differentiation obligations, and exclusions.

Missing mandatory delivery or any prohibited-item violation blocks progression or publishing.

## Batch Isolation And Uniqueness

Every page gets its own `seo-content-brief.json` and `seo-content-brief.md`. Shared sources and shared config are allowed, but page promise, depth logic, examples, mistakes, assets, instructions, and anti-generic risks must be page-specific.

`batchBriefIsolationCheck` verifies no prior brief was reused and current-batch similarity is low or explained.

`semanticBriefUniquenessCheck` compares current-batch and accessible historical briefs. Current-batch duplication is a blocker. Inaccessible historical artifacts may continue only as `pass_with_warnings`.

## Open Questions And Repairs

`openQuestionsAndAssumptions` must label every item as:

- `non_critical_assumption`
- `critical_blocker`
- `owner_step_return`
- `user_input_required`

Critical uncertainty blocks Step 9.

Step 8 may auto-repair weak Step 8 fields up to 2 times: vague instructions, missing refs, incomplete delivery tests, weak word-count reasoning, inconsistent priorities, missing coverage mappings, or removable accidental boundary detail.

Step 8 must not repair missing evidence, unresolved safety, absent upstream contracts, missing brand voice, semantic duplication, strategy conflicts, missing required assets, invalid upstream hashes, or current-batch duplication. Those route to owner steps, ask the user, or skip in batch mode.

## Boundary Contract

`step8OutputMustNotContain` must prohibit:

- final H1/H2/H3 headings
- detailed outline or section order
- exact component, example, CTA, citation, or internal-link placement
- final paragraphs or page copy
- final CTA wording
- metadata
- image prompts or visual strategy
- exact rows, branches, labels, or copy for Step 7 assets
- new facts, research, claims, or competitor findings
- silent upstream strategy changes
- keyword-density requirements
- copied source or competitor wording and structure

## Verdict

`contentBriefVerdict.status` may be `pass`, `pass_with_warnings`, `fail`, or `ask_user`. `confidence` may be `low`, `medium`, or `high`; no numerical scorecard is allowed.

`contentBriefVerdict.action` may be:

- `continue_to_step9`
- `repair_step8`
- `return_to_step7`
- `return_to_step6`
- `return_to_step5`
- `return_to_step4`
- `return_to_step3`
- `return_to_step2`
- `return_to_step1`
- `return_to_0B`
- `return_to_onboarding`
- `ask_user`
- `skip_page`

`continue_to_step9` is allowed only after a valid `contentBriefHash` is frozen.

`pass_with_warnings` is allowed only for non-critical environmental limitations such as inaccessible historical uniqueness artifacts, nonmandatory missing-but-recommended internal destination, non-critical safe assumption, optional support/asset omission risk, or inaccessible supporting source while mandatory evidence remains complete.

Hard blockers include missing brand voice, mandatory depth obligations, required assets, safety boundaries, evidence, upstream hashes, current-batch uniqueness, semantic duplication, hard word-count basis, Markdown parity, or boundary violations.

## Completeness Checklist

`step8CompletenessChecklist` must mechanically confirm:

- `allUpstreamHashesPresent`
- `coverageMatrixComplete`
- `instructionRegistryComplete`
- `wordCountFloorJustified`
- `depthRequirementsComplete`
- `depthBoundariesComplete`
- `voiceContractComplete`
- `queryCoverageComplete`
- `claimEvidenceContractComplete`
- `assetBriefsComplete`
- `readabilityRequirementsComplete`
- `antiGenericContractComplete`
- `synthesisRequirementComplete`
- `brandFitBoundariesComplete`
- `recencySensitivityChecked`
- `marketLocalizationHandledWhenNeeded`
- `readerObjectionsHandledWhenNeeded`
- `batchIsolationChecked`
- `semanticUniquenessChecked`
- `mustCarryForwardComplete`
- `markdownParityChecked`
- `noStep8BoundaryViolation`

Any false value triggers repair, warning, fail, or routing based on criticality.
