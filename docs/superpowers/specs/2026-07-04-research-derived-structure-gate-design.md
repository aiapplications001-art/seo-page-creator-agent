# Research-Derived Structure Gate Design

## Goal

Make page structure a hard, evidence-linked quality gate before final copy for every V2.1 page.

The agent must prove that the page's section order, visible components, scan path, FAQ, troubleshooting, CTA, and superiority assets are derived from the current page's research. Different titles, hooks, slugs, or paraphrased body copy are not enough. A one-off page can become a historical template, so this gate applies to single-page and batch/live workflows.

## Chosen Approach

Extend `pre-draft-quality-brief.json` with a required `researchDerivedStructurePlan` object.

This keeps the workflow simple: the existing `validate-depth` gate becomes responsible for blocking final copy when structure is weak, generic, copied, or not traceable to research.

## Gate Placement

The gate runs as part of `validate-depth`.

It must pass before:

- `seo-agent final-copy expand`
- image manifest generation
- page packet delivery
- commit
- publish

The final copy validator should also verify that the delivered draft still follows the approved structure plan. This prevents final copy from drifting away from the pre-draft structure proof.

Model-written status fields or validation notes must not be trusted. Pass/fail is computed only from resolvable evidence refs, source-role compatibility, structure coverage, uniqueness checks, and final-copy delivery.

## Artifact Shape

`pre-draft-quality-brief.json` must include:

```json
{
  "researchDerivedStructurePlan": {
    "primaryUserConcern": "harmful effects of using adapalene gel",
    "primaryConcernVisibleBySectionId": "S2_quick_answer",
    "primaryConcernVisibleBySectionIndex": 2,
    "importantInformationNotBuried": true,
    "scanPriorityRationale": "The query is harm/risk-led, so adverse effects, when to stop, and who should avoid use appear before general background.",
    "sectionOrderRationale": "The page starts with risk clarity, then explains context, then gives decision and troubleshooting support.",
    "sections": [
      {
        "sectionId": "S2_quick_answer",
        "sectionRole": "quick answer",
        "sectionAction": "reorder",
        "targetSectionTitle": "Can adapalene gel harm your skin?",
        "whyThisSectionExists": "Searchers are asking about harm, so they need a direct risk summary before background.",
        "sourceRefs": ["F1", "F2", "A1"],
        "intentDimensionRefs": ["D1"],
        "competitorOrUserGap": "Competitor pages explain adapalene before answering the harm concern.",
        "expectedVisibleOutput": "A direct quick answer that separates common irritation from warning signs.",
        "competitorGapRefs": ["https://competitor.example/adapalene"],
        "audienceLanguageRefs": ["A1"],
        "trustCitationRefs": ["F2"],
        "finalCopyUse": "Open with a direct harm/risk answer and link risk severity to next actions.",
        "finalCopyAcceptanceCheck": "Final copy includes a near-top answer naming harmful effects and next actions.",
        "scanPriority": "top",
        "readerQuestionAnswered": "Can adapalene harm my skin?",
        "differentiatesFromPageIds": ["historical-adapalene-side-effects"]
      }
    ],
    "highImpactComponents": [
      {
        "componentType": "risk_table",
        "mappedSectionId": "S3_harm_risks",
        "whyThisComponentExists": "The research shows readers need to distinguish common irritation from warning signs.",
        "sourceRefs": ["F1", "F2", "A3"],
        "intentDimensionRefs": ["D1", "D3"],
        "readerJob": "Separate expected irritation from urgent warning signs.",
        "competitorOrAudienceGapAddressed": "Competitors list side effects but do not separate expected adjustment symptoms from stop-and-seek-help symptoms.",
        "visibleReaderBenefit": "Lets the reader scan severity, action, and urgency without reading the full background.",
        "notGenericReason": "This table exists because the query is harm-led and audience signals mention burning, peeling, and fear of skin damage.",
        "columnsOrSteps": ["effect type", "severity signal", "what to do now", "when to seek medical help"],
        "whyThisShape": "Severity and action columns match the risk-triage job in the query.",
        "expectedVisibleOutput": "A table with common effects, serious warning signs, and next actions.",
        "finalCopyAcceptanceCheck": "Final copy contains a visible table separating common irritation, stop-use signs, and clinician escalation."
      }
    ],
    "structureDecisions": [
      {
        "sectionId": "S3_harm_risks",
        "sectionAction": "add",
        "targetSectionTitle": "Possible harmful effects: what is common vs serious",
        "sourceRefs": ["F1", "F2", "A3"],
        "competitorOrUserGap": "Competitor pages list effects but do not clearly separate expected irritation from urgent warning signs.",
        "whyThisStructureIsNeeded": "The searcher is harm-led and needs triage before background.",
        "expectedVisibleOutput": "A risk-severity table with common effects, warning signs, and next actions.",
        "finalCopyAcceptanceCheck": "Final copy contains a visible table separating common irritation, stop-use signs, and clinician escalation."
      }
    ],
    "structureComparison": {
      "comparedCurrentBatchPageIds": ["P1", "P2"],
      "comparedHistoricalPageIds": ["historical-adapalene-side-effects"],
      "reusedStructureRisk": "low",
      "materialDifferences": [
        "Risk table appears before background because this query is harm-led.",
        "Troubleshooting is organized by stop/continue/escalate rather than generic routine steps."
      ]
    }
  }
}
```

## Hard Validation Rules

### Search Intent Visibility

The plan must include:

- `primaryUserConcern`
- `primaryConcernVisibleBySectionId`
- `primaryConcernVisibleBySectionIndex`
- `importantInformationNotBuried: true`
- `scanPriorityRationale`
- `sectionOrderRationale`

The primary concern must be visible within the first 2-3 visible sections. If the page targets "harmful effects of using adapalene gel," harm/risk content must appear near the top. Background can exist, but it cannot bury the reason the user searched.

For risk, harm, side-effect, contraindication, pregnancy, allergic reaction, or other safety-led queries:

- the first substantive section must answer the safety/risk question directly
- mild/common effects must be separated from serious warning signs
- "who should avoid/call a doctor" and "what to do now" must appear before broad background
- commercial CTAs, product comparisons, affiliate modules, or best-product sections cannot appear before the safety answer is complete
- headings must be scan-friendly and explicit, not vague, clever, or SEO-stuffed
- if a high-priority safety/trust intent exists, it must appear before any strong recommendation or CTA section

### Section-Level Evidence

Every visible non-reference section must include:

- `sectionId`
- `sectionRole`
- `sectionAction`: `add`, `expand`, `reorder`, `replace`, `merge`, or `remove`
- `targetSectionTitle`
- `whyThisSectionExists`
- `sourceRefs`
- `intentDimensionRefs`
- `competitorOrUserGap`
- `expectedVisibleOutput`
- `finalCopyUse`
- `finalCopyAcceptanceCheck`
- `scanPriority`
- `readerQuestionAnswered`

Evidence minimums:

- Normal informational sections require at least 2 valid source refs.
- High-impact sections require at least 3 valid source refs.
- Objection, mistake, troubleshooting, and FAQ sections require at least 1 audience-language ref.
- Differentiation or superiority sections require at least 1 competitor or SERP-gap ref.
- Medical, skincare, safety, or harm/risk sections require at least 1 trust/citation ref when making safety-sensitive claims.
- Safety-led pages require at least 2 authoritative trust/citation sources, and at least 1 must directly support the primary risk answer.

Each section action must be traceable to at least one source-backed gap. Plans that only say "expand existing sections" without a concrete visible artifact fail.

Top 3 intent dimensions must appear in the first half of non-reference sections. Priority 1 intent must appear in the hero, quick answer/verdict, first body section, or first decision device. Priority intent cannot appear only in FAQ, references, final CTA, or bottom troubleshooting.

### Component-Level Evidence

Every visible structural component must have its own proof:

- decision tools
- matrices
- comparison tables
- risk tables
- checklists
- flows
- FAQ blocks
- troubleshooting blocks
- image or interactive components
- superiority components
- CTA blocks

Each component requires:

- `componentType`
- `mappedSectionId`
- `readerJob`
- `whyThisComponentExists`
- `sourceRefs`
- `intentDimensionRefs`
- `competitorOrAudienceGapAddressed`
- `visibleReaderBenefit`
- `notGenericReason`
- `expectedVisibleOutput`
- `finalCopyAcceptanceCheck`

High-impact components require at least 3 valid source refs.

Tables and matrices also need `columnsOrSteps` and `whyThisShape`. Generic table shapes such as "Feature / Benefit / Notes" fail unless the research specifically supports those columns.

Every page must include at least one page-specific structural mutation: an added or reordered section, custom table, decision flow, diagnostic matrix, FAQ cluster, safety block, local-market module, or other visible artifact. The mutation must be justified by current-page research.

At least one scan-first device must appear in the top third of the page. Pages where every section is planned as prose blocks fail.

### Anti-Generic Rationale

Reject `whyThisSectionExists`, `whyThisComponentExists`, `scanPriorityRationale`, and `sectionOrderRationale` when they are generic.

Generic rationale includes:

- "helps users understand"
- "answers common questions"
- "improves SEO"
- "provides value"
- "supports decision-making"
- "covers the topic"
- "improves UX"
- "adds depth"
- "better for readers"
- "more comprehensive"
- repeating the title or keyword without a reader-specific reason

Valid rationale must mention at least one concrete:

- reader problem
- SERP or competitor gap
- audience-language signal
- safety or trust concern
- India or market nuance
- pricing, selection, or suitability constraint
- visible output consequence

The validator should compare normalized rationale text against current-batch and historical pages. Reused rationale fails unless the page proves a distinct source-backed reader path and visible output.

### Structure Uniqueness

The plan must compare against:

- successful pages already live in the current batch
- historical pages from previous runs for the same cluster

The gate should fail if the page repeats:

- body section order
- section role sequence
- section action sequence
- decision matrix shape
- table or matrix column semantics
- FAQ pattern
- mistake or troubleshooting pattern
- CTA pattern
- superiority component type without a new research-backed reason
- source-to-section mapping shape

The standard is research-justified distinctness, not novelty for novelty's sake. Reuse is acceptable only when the plan proves the same structure is genuinely required and materially differentiated by source-backed section reasons.

Similarity checks should be weighted. Mandatory sections such as hero, references, and trust proof can overlap with lower weight. Blocking should require overlap across multiple dimensions, such as section sequence plus device pattern, FAQ pattern plus CTA pattern, or device pattern plus source-to-section mapping.

### Final Copy Drift

After final copy is drafted, the final copy validator should check that:

- promised top-priority sections are present
- primary concern still appears near the top
- high-impact components appear in visible copy
- `finalCopyUse` promises are delivered
- `expectedVisibleOutput` appears as visible markdown, table, checklist, flow, FAQ, or block
- `finalCopyAcceptanceCheck` is satisfied by an actual snippet
- superiority or differentiation structures did not disappear
- CTA stays within supported claims and avoids unsupported claims
- final draft evidence refs include the planned refs or documented replacements with equal or better source roles

`final-copy-draft.json` should include a `structurePlanDeliveryProof`, but the validator must verify the proof against the actual markdown instead of trusting it.

## Source Ref Validation

Source refs must point to known evidence already present in the page's research artifacts:

- extracted fact ids
- analyzed source URLs
- audience signal ids
- competitor URLs
- secondary SERP URLs
- trust/citation source ids or URLs

The validator must reject unknown source refs.

It must also reject source-role misuse:

- Reddit/forum/video/PAA can support audience language, objections, and reader phrasing, but not medical truth by itself.
- Trust/citation sources can support safety claims, but cannot substitute for competitor analysis.
- Competitor pages can support SERP gap analysis, but cannot substitute for medical or safety evidence.
- Brand CTAs must include brand-source support for the supported brand claim.
- Reader-question-driven sections must include PAA, Reddit/forum, video/social, long-tail, or equivalent audience-language refs.

Every `sourceRef` should resolve to an evidence object with source role metadata. Validation must be resolver-backed, not string-backed.

Typed refs such as `audienceLanguageRefs`, `trustCitationRefs`, and `competitorGapRefs` are filtered subsets of `sourceRefs`, not separate evidence pools. A typed ref must also appear in `sourceRefs` for the same section or component unless it is inherited from a mapped high-impact component in that section.

Recommended compatibility rules:

- `competitorOrUserGap` and `competitorOrAudienceGapAddressed` use `primary_serp_competitor`, `secondary_serp_competitor`, `paa_source`, `reddit_forum_source`, `video_social_source`, or `long_tail_source`.
- `audienceLanguageRefs` use `paa_source`, `reddit_forum_source`, `video_social_source`, or `long_tail_source`.
- `trustCitationRefs` use `trust_citation_source`.
- brand CTA support uses `brand_source` when making brand-capability claims.

## Repair Behavior

When the gate fails, repair must update the underlying research or structure plan before rewriting final copy.

Examples:

- If the primary concern is buried, reorder sections or add a near-top answer block.
- If a matrix lacks enough evidence, add research or remove the matrix.
- If troubleshooting lacks audience-language evidence, review forum/PAA/video sources or remove unsupported troubleshooting.
- If structure matches another page, redesign section order and components from current-page gaps.
- If a safety page opens with generic background, move risk triage above background.
- If final copy omits a planned structural device, restore the device or update and revalidate the structure plan.

## Gate Result Shape

The validator should return structured diagnostics:

- `status: passed | failed`
- `blockingIssues[]`
- `warnings[]`
- `currentBatchMatches[]`
- `historicalMatches[]`
- `unresolvedSourceRefs[]`
- `sourceRoleMismatchIssues[]`
- `buriedIntentIssues[]`
- `genericRationaleIssues[]`
- `structureSimilarityIssues[]`
- `finalCopyDriftIssues[]`
- `falsePositiveReviewHints[]`

## Tests To Add

Unit tests should cover:

- missing `researchDerivedStructurePlan` fails `validate-depth`
- primary concern below section 3 fails
- normal section with fewer than 2 valid refs fails
- high-impact component with fewer than 3 valid refs fails
- FAQ/troubleshooting without audience-language evidence fails
- superiority section without competitor/SERP evidence fails
- safety/harm section without trust/citation evidence fails
- generic rationale fails
- reused rationale from another page fails
- unknown source refs fail
- source-role misuse fails
- table/matrix with generic columns fails
- section action without a source-backed gap fails
- safety-led page with generic background before risk answer fails
- safety-led page with commercial CTA before risk answer fails
- safety-led page mixing mild effects and serious warning signs fails
- valid plan passes
- final copy fails when it omits promised near-top primary concern
- final copy fails when a promised high-impact component disappears
- final copy fails when planned evidence refs are dropped without equal or better replacements
- final copy fails when brand CTA expands beyond brand-source support

Adapter/docs tests should pin:

- Codex, Gemini, and Antigravity instructions require this hard gate before final copy
- final copy cannot start until `researchDerivedStructurePlan` passes
- batch/live publishing must compare current and historical page structure

## Open Risks

- The gate may be too strict for very simple pages. The mitigation is to keep the evidence minimum lower for normal informational sections while staying strict for high-impact blocks.
- LLMs may produce source refs performatively. The mitigation is known-ref validation and source-role checks.
- Historical structure comparison may false-positive when two pages genuinely need similar structures. The mitigation is allowing reuse only with source-backed material differences.
- Manual edits outside the agent can make the history index stale. The mitigation is to treat history comparison as best-effort unless the page was generated through the agent.
