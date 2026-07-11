# SERP Superiority Gate Design

Date: 2026-07-03
Status: Approved for implementation planning
Scope: Local replica only

## Purpose

V2.1 currently proves that required SEO artifacts exist, but it does not strongly prove that a generated page deserves to compete against the current SERP. The SERP Superiority Gate upgrades the existing depth workflow so a page must demonstrate researched, visible, reader-useful differentiation before final delivery or publishing.

The gate should not create a new artifact every time a problem is found. It should extend the existing V2.1 artifacts and make `validate-depth`, final-copy validation, and QA stricter.

## Core Principle

A page cannot pass just because it is comprehensive. It must prove it is meaningfully better than the current SERP for the query's main intent.

The page must be superior on the top four intent dimensions for the primary query. It may reach parity on lower-priority dimensions, but it must not be worse on important dimensions. Comprehensive-but-undifferentiated pages fail.

## Existing Artifacts To Extend

The design extends these existing files:

- `competitor-depth-delta.json`
- `pre-draft-quality-brief.json`
- `claim-first-section-plan.json`
- `page-depth-score.json`
- `final-copy-draft.json`
- Editorial QA report output

No separate recurring `serp-superiority-gate.json` is required.

## Research Scope

For every page, the agent must analyze:

- Top 5 organic SERP pages for the primary keyword.
- Top 3 organic SERP pages for each secondary keyword.
- Reddit, forums, video, social, People Also Ask, and audience-language signals.
- Google AI Overview when available.
- Long-tail variants and secondary-intent gaps.
- Trust or citation sources for skincare, medical, safety, finance, legal, or other claim-sensitive topics.

The top 5 primary SERP pages are the main benchmark. Secondary SERPs, long-tail sources, Reddit, forums, videos, PAA, and AI Overview can create differentiation, but the differentiation must still improve satisfaction of the primary keyword's main intent.

## Source Roles

Every source reference used in superiority proof must have a role. A source can only support claims allowed by its role.

Allowed roles:

- `primary_serp_competitor`: benchmark, structure, competitor gap.
- `secondary_serp_competitor`: sub-intent expansion, alternate framing, long-tail support.
- `long_tail_source`: sub-intent discovery, phrasing, niche angle.
- `paa_source`: question discovery, answer framing, missing FAQ coverage.
- `ai_overview_source`: summary benchmark, oversimplification gap, risk or omission detection.
- `reddit_forum_source`: audience language, lived confusion, objections, edge cases.
- `video_social_source`: demonstration, routine behavior, visual pain points, comments and questions.
- `trust_citation_source`: factual support, medical, skincare, or safety claim support.
- `brand_source`: brand capability, CTA boundaries, product or service truth.

Validation examples:

- Reddit can support "users are worried about X," but not "ingredient Y causes acne."
- AI Overview can support "Google summarizes the topic this way," but not final medical proof.
- Competitor pages can support "competitors miss this," but not necessarily factual truth.
- Official or medical sources support factual and safety claims.
- Brand sources support only what the brand can honestly claim.

## Source Diversity

Superiority proof must not rely on a single source type.

The top four intent wins, major superiority component, and five differentiated improvements must collectively use:

- Primary SERP competitors.
- At least one secondary keyword SERP or long-tail source.
- At least one audience-language source: Reddit, forum, video, social, or PAA.
- At least one trust/citation source when claims are medical, skincare, safety, finance, legal, or otherwise trust-sensitive.

Hard fail examples:

- All improvements come from one competitor page.
- All reader questions come from PAA only.
- Skincare advice has no trusted citation source.
- Reddit insight is used as factual proof instead of audience-language insight.
- Competitor gap is claimed without reviewing primary SERP pages.
- Long-tail keyword coverage is added without tying it to primary intent.

## Competitor Strength Scoring

Primary top 5 competitors require full scoring. Secondary top 3 pages require lighter scoring so the workflow stays practical.

### Primary Competitor Dimensions

Each primary top 5 competitor is scored from 0 to 5 on:

1. Intent match.
2. Top-intent coverage.
3. Depth and specificity.
4. Decision usefulness.
5. Information architecture.
6. Evidence and trust.
7. Originality or information gain.
8. Audience specificity.
9. Risk handling.
10. Practical completeness.
11. UX or page experience.

Each score must include a short evidence note. A number without evidence does not count.

### Score Anchors

- `0`: absent or wrong.
- `1`: mentioned superficially.
- `2`: basic but incomplete.
- `3`: useful and acceptable.
- `4`: strong, specific, decision-helpful.
- `5`: excellent, hard to beat, materially improves reader outcome.

### Strength Labels

A competitor is `excellent` only if:

- Intent match is `5`.
- Top-intent coverage is at least `4`.
- At least five dimensions are `4+`.
- No top-four intent dimension is below `4`.
- UX/page experience is at least `3`.
- It has at least one real standout asset such as a table, tool, checklist, framework, original examples, expert detail, interactive element, strong visuals, or unusually good troubleshooting.
- The evaluator explains why users might stop searching after reading it.

A competitor is `strong` only if:

- Intent match is at least `4`.
- Top-intent coverage is at least `4`.
- Decision usefulness is at least `3`.
- Depth and specificity is at least `3`.
- Practical completeness is at least `3`.
- The evaluator gives at least three concrete evidence-backed reasons.

A competitor is `moderate` when it answers the query but has obvious gaps, or has an average score of at least `3` while missing the strong non-negotiables.

A competitor is `weak` if it:

- Does not satisfy the primary query.
- Is mostly generic SEO filler.
- Lacks concrete next steps.
- Has no examples, decision support, or meaningful user nuance.
- Has an average below `3`.

If UX/page experience is `1` or lower, the competitor cannot be stronger than `moderate`. If the content is shallow, excellent UX cannot make the competitor strong.

## Strong Competitor Rule

If two or more primary top 5 competitors are `strong` or `excellent`, parity is not enough. The generated page must include at least one evidence-backed information-gain asset that those competitors do not meaningfully provide.

## Intent Dimension Superiority

Each page must identify four to seven main intent dimensions for the target query, then rank them by importance.

Examples:

- How-to: steps, safety boundaries, troubleshooting, examples, mistakes, expected timeline.
- Best X: selection criteria, comparison table, recommendation sanity, avoid-if guidance, market availability.
- Comparison: fair methodology, side-by-side criteria, tradeoffs, who should choose what.
- Skincare or medical: safety, evidence, nuance, escalation signs, contraindications, realistic expectations.
- Local or India: availability, pricing context, climate, skin tone, product-market specificity, local constraints.
- Alternatives: decision fit, switching reasons, risks, gaps, transition path.

Rules:

- The page must be superior on the top four intent dimensions.
- Lower-priority dimensions may be parity.
- Important dimensions must not be worse than competitors.
- The page fails if it only adds length without improving intent satisfaction.

## Structure Adaptation

Page generation owns the improvement. The superiority gate polices whether it happened.

The agent must change the page structure when research demands it. Allowed responses include:

- New sections.
- Expanded sections.
- Reordered sections.
- Comparison tables.
- Decision trees.
- Troubleshooting flows.
- Checklists.
- FAQs.
- Image prompts.
- Interactive-style components with static fallback.
- India/local/product-fit matrices.
- Safety or escalation blocks.

Every added or expanded section must map to source refs, an intent dimension, and a competitor or user gap.

## Required Superiority Component

Every page must include at least one major superiority component.

The component may use a reusable pattern, but the actual content must be custom-created from the page's specific SERP, Reddit/forum/video, PAA, AI Overview, long-tail, and citation research.

Valid component examples:

- Decision tree.
- Symptom-to-action matrix.
- India-specific product or routine fit table.
- Avoid-if framework.
- Mistake diagnosis checklist.
- Comparison table.
- Troubleshooting flow.
- Myth-vs-reality section with citations.
- Static fallback for an interactive-style calculator or checklist.

The component must include:

- `componentType`
- `title`
- `researchBasis`
- `sourceRefs`
- `mappedSectionId`
- `intentDimensionSupported`
- `competitorGapAddressed`
- `whyThisIsInformationGain`
- `competitorComponentComparison`
- `finalCopyBlock`
- `imageOrInteractiveNeed`
- `fallbackContent`
- `primaryReaderJob`
- `brandFit`
- `naturalCtaConnection`
- `unsupportedBrandClaimsToAvoid`

The component fails if:

- It is generic enough to reuse across pages without changes.
- It has no source refs.
- It does not support a top intent dimension.
- It does not address a competitor or user gap.
- It is recommended but missing from final copy.
- It is only a visual idea without content fallback.

## Component Competitor Delta

Every superiority component must either beat an existing competitor component or fill a proven empty component gap.

Path A: Beat existing component.

- Identify which competitors have comparable components.
- Explain what those components do well.
- Explain what they miss.
- Explain how our component is more specific, safer, more useful, more local, more actionable, or better mapped to intent.

Path B: Fill empty gap.

- Prove the top 5 primary competitors were checked.
- Lightly check secondary top 3 pages.
- State that no competitor has a meaningful component for this reader problem.
- Show that Reddit/forum/video/PAA/AI Overview or long-tail research proves the need exists.
- Explain how our component fills the gap.
- Include the component in final copy.

## UX And Page Experience Response

UX/page experience is both a competitor scoring input and a required page response.

If strong or excellent competitors use tables, sticky TOCs, comparison modules, calculators, product cards, visual explainers, or other components that materially improve intent satisfaction, the generated page packet must recommend equivalent or better on-page components.

The final copy must include the content version of those components as markdown tables, checklists, flows, decision trees, image manifest entries, layout notes, schema recommendations, or static fallbacks. Strategy notes alone do not count.

## Differentiated Improvements

Every page must include at least five differentiated improvements across sections, in addition to the major superiority component.

Each improvement must include:

- `improvement`
- `sourceRefs`
- `intentDimension`
- `competitorOrUserGapAddressed`
- `mappedSectionId`
- `visibleOutputType`
- `finalOutputLocation`
- `finalCopyEvidence`
- `whyDifferentiated`

Valid visible output types include:

- `copy`
- `table`
- `checklist`
- `flow`
- `image`
- `interactive_component`
- `schema`
- `layout_note`

Text/content improvements must appear directly in final copy. Hidden strategy notes do not count.

Hard fails:

- Fewer than five improvements appear in visible output.
- All improvements are concentrated in one section.
- The major superiority component is absent from final copy or page packet.
- An improvement exists only in internal notes.
- An improvement is generic or not source-backed.

## AI Overview And Extractable Answers

When Google AI Overview is available, the agent must identify:

- What AI Overview summarizes.
- What it omits.
- What it oversimplifies.
- What could be unsafe or too broad.
- What keyword or sub-intent language it includes.
- What related questions it triggers.
- What our page should answer more safely, completely, humanely, and readably.

The page must include at least three extractable answer blocks:

1. Quick answer near the top.
2. Decision/action answer.
3. Troubleshooting/safety answer when relevant.

Each extractable answer block must:

- Be visible in final copy.
- Be concise and human-readable.
- Be safer or more complete than AI Overview where AI Overview exists.
- Avoid copying AI Overview.
- Naturally include relevant primary, secondary, or long-tail language without keyword stuffing.
- Map to source refs.
- Use visible source handling for trust-sensitive claims.

## Visible Citation Handling

Internal source mapping is not enough for medical, skincare, safety, finance, legal, or other trust-sensitive claims.

The final copy must include visible citation or source handling for high-trust claims. Acceptable forms include:

- Inline citation link.
- "According to..." phrasing.
- References section with claim/source mapping.
- Source note below a table.
- Evidence note box.
- Cautious phrasing with source-backed boundaries.
- Expert or dermatology source callout if available and true.

Claim repair is tiered:

- `minor`: low-risk guidance; can be softened if citation is weak.
- `important`: affects product choice, safety, skin reaction, treatment expectation, or escalation; requires better trust/citation support or material rewrite/removal.
- `critical`: diagnosis, guarantee, disease claim, strong efficacy claim, or brand capability claim; fails unless strongly cited and safe, otherwise remove.
- `brand_capability`: must be supported by brand source or removed.

## Brand Fit

The superiority component and differentiated improvements should serve the reader first. Brand fit is required, but conversion pressure is not.

Each major component must include:

- `primaryReaderJob`
- `brandFit`
- `naturalCtaConnection`: `none`, `soft`, or `direct`
- `unsupportedBrandClaimsToAvoid`

Rules:

- The component must be useful even if the reader never clicks the CTA.
- Brand connection must explain why the brand is relevant to the reader's uncertainty.
- Informational or safety-heavy pages should usually use `none` or `soft`.
- The component must not exaggerate brand capability.
- If the component naturally maps to the brand, final copy may include a subtle transition.
- If it does not, final copy must not force a CTA inside the component.

## Pre-Draft Checkpoint

Before final copy, `validate-depth` must fail unless the page proves:

- Primary top 5 competitors were analyzed.
- Secondary top 3 pages were analyzed lightly.
- Source roles and source diversity are satisfied.
- Four to seven intent dimensions are identified.
- The top four intent dimensions have planned superiority.
- Competitor strength labels are assigned with evidence.
- At least one major superiority component is planned.
- At least five differentiated improvements are planned.
- At least three extractable answer blocks are planned.
- Page structure was adapted where research demanded it.
- Trust-sensitive claims have citation or softening plans.
- Brand fit is reader-first and non-exaggerated.

## Post-Draft Checkpoint

After final copy, the page must prove:

- The top four intent dimensions are actually served in final copy.
- The major superiority component appears as usable final content.
- The five differentiated improvements appear in visible output.
- Extractable answer blocks are visible and safe.
- Required citations/source handling are visible for trust-sensitive claims.
- UX/component recommendations appear in page packet, image manifest, layout notes, schema notes, or final copy.
- The page did not drift into generic filler.
- Brand CTA is natural and does not overclaim.

Post-draft superiority is a hard gate. A page cannot be delivered, marked `content_ready`, marked `publish_ready`, committed in batch mode, deployed, or published live unless it passes.

## QA Report Requirement

The editorial QA report must include a required "Why This Deserves To Rank" summary.

The summary must state:

- Target primary keyword.
- Top competitors benchmarked.
- Top four intent dimensions won.
- Custom superiority component.
- Most important SERP, PAA, social, video, forum, long-tail, or AI Overview gap filled.
- Strongest brand-safe reason the page is better.
- Any remaining weakness or watchout.

If the report cannot honestly explain why the page deserves to rank, the page fails.

## Repair Behavior

If pre-draft superiority fails:

- Add research.
- Revise competitor scoring.
- Adapt page structure.
- Strengthen the component plan.

If post-draft superiority fails:

- Revise final copy.
- Add missing visible component content.
- Add missing image, layout, schema, or static fallback notes.
- Improve citations.
- Soften or remove unsupported claims.
- If failure comes from weak research, return to research instead of rewriting shallow copy.

In batch mode, failed pages follow the configured repair limit. If still failing, the page is skipped and the runner continues.

## Acceptance Criteria

Implementation is complete when:

- Existing V2.1 artifact templates include the new superiority fields.
- `validate-depth` blocks final copy when pre-draft superiority is missing or weak.
- Final-copy validation or QA blocks release when post-draft superiority is missing or weak.
- Required source roles and source diversity are machine-validated for all superiority fields represented in JSON artifacts.
- Competitor strength scoring requires evidence notes and non-negotiable label rules.
- Every page requires one major superiority component and five visible differentiated improvements.
- Every page requires at least three extractable answer blocks.
- Trust-sensitive final copy requires visible source handling.
- Editorial QA includes "Why This Deserves To Rank."
- Existing adapter docs instruct Codex, Gemini, and Antigravity to follow this process page by page.
- Tests cover passing and failing superiority scenarios.
