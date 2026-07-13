# Step 10 SEO First Draft Design

Step 10 is the hard drafting gate after Step 9 SEO Page Outline and before Step 11 on-page SEO optimization. It turns the frozen outline into real section-by-section prose, but it does not change structure, start new research, finalize metadata, or perform final SEO polish.

## Position In Workflow

Step 10 starts only after Step 9 returns `pass` or non-critical `pass_with_warnings` with action `continue_to_step10`.

Step 10 creates:

- `seoFirstDraft`
- `seo-first-draft.json`
- `seo-first-draft.md`
- `firstDraftHash`

Step 10 blocks Step 11, final copy, images, page packet, commit, deploy, and publishing until `firstDraftVerdict.action` is `continue_to_step11`.

## Boundary

Step 10 must follow the frozen `pageOutlineHash`. It may not directly edit the outline. If drafting reveals a structural issue, Step 10 returns `return_to_step9` with the exact issue.

Step 10 may write full draft prose for the approved H1/H2/H3 structure. It must not output final SEO title, final meta description, final schema, final citation display strategy, image prompts, new research, new factual claims, hidden outline changes, keyword-density instructions, copied competitor/source prose, or placeholders.

Step 11 owns on-page SEO optimization after the draft exists: title tag, H1 refinement, headings, URL slug, intro SEO sharpening, keyword usage, internal links, image alt text, anchor text, and topical coverage.

## Required Hashes

`seoFirstDraft` must carry:

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

Missing or stale hashes are hard blockers.

## Required Fields

The JSON contract must include:

- `firstDraftHash`
- `draftSummaryStatement`
- `h1`
- `wordCountContract`
- `draftSections`
- `introductionQualityGate`
- `sectionExpansionGate`
- `draftCompletenessProof`
- `requiredAssetDelivery`
- `draftClaimSafetyCheck`
- `naturalQueryCoverageCheck`
- `draftReadabilityScanabilityGate`
- `faqDraftDelivery`
- `ctaInternalLinkDelivery`
- `voiceAndBrandFitCheck`
- `draftUniquenessCheck`
- `antiGenericDraftGate`
- `firstDraftDeliveryProofRequirements`
- `mustCarryForward`
- `step10OutputMustNotContain`
- `step10CompletenessChecklist`
- `firstDraftRepairLog`
- `firstDraftVerdict`

## Section Draft Shape

`draftSections` is section-by-section structured draft content. Each section must include:

- `sectionId`
- `heading`
- `draftCopy`
- `outlineRefs`
- `evidenceRefs` when evidence is required
- `depthProof`
- `examplesUsed`
- `contentObligationsFulfilled`
- `claimSafetyNotes` when relevant
- `ctaOrInternalLinkDelivered` when planned
- `openIssues`

High-depth, safety, recommendation, comparison, troubleshooting, example-heavy, asset/component, claim-heavy, factual, medical, finance, legal, product, market, pricing, or safety sections require evidence refs. Light transitions or summaries may rely on brief/outline refs only when they introduce no new factual claims.

## No New Factual Claims

Step 10 cannot invent new factual, medical, safety, finance, legal, product, market, pricing, competitor, or trend claims. If a needed claim lacks upstream support, Step 10 must return to Step 6.

Illustrative examples are allowed only when clearly marked `illustrative_only` or derived from Step 6, Step 8, or Step 9 evidence.

## Introduction Gate

`introductionQualityGate` must prove the introduction:

- starts with the reader's real problem or task
- confirms the validated intent
- states the page promise
- sets scope
- avoids generic filler
- leads naturally into the page

Weak SEO intros fail.

## Expansion Gate

Every high-depth/core section must include the right mix of definition or explanation, why it matters, how-to/process/decision rule, example/scenario, caution/mistake/caveat/edge case when relevant, and transition. Missing expected parts need an evidence-backed reason.

## Completeness Proof

`draftCompletenessProof` must prove the draft satisfies:

- Step 1 page job
- Step 2 search intent and satisfaction condition
- Step 8 content brief
- Step 9 outline
- exclusions and wrong-page risks

The draft must meet the Step 8 `minimumWordCount`. It may exceed the target range when useful, but padding and repetition are forbidden.

## Assets, FAQ, CTA, And Links

Required Step 7/8/9 assets must appear visibly in draft copy as usable text, table, checklist, flow, matrix, framework, decision rule, or text fallback. Placeholder assets fail.

If Step 9 plans a short or detailed FAQ, Step 10 must write usable FAQ answers.

Step 10 must deliver draft CTA and internal-link copy where planned, using non-final wording and respecting Step 4/8 boundaries. Exact final CTA polish can happen later.

## Claim And Source-Use Validation

`draftClaimSafetyCheck` must confirm risky claims are supported, softened, avoided, or routed; audience-language evidence is not used as factual proof; sensitive claims respect safety boundaries; and new factual claims are routed to Step 6.

## Anti-Generic And Uniqueness

`antiGenericDraftGate` blocks placeholder and generic prose such as:

- "This section should explain..."
- "Use this section to..."
- "It is important to..."
- "choose the right product" without specifics
- "consult a professional" without context or safety boundary

`draftUniquenessCheck` is a hard current-batch gate and historical check when accessible. It blocks repeated intros, section bodies, examples, tables, FAQ answers, CTA copy, asset logic, and same-page-in-different-words patterns.

## Markdown Parity

`seo-first-draft.md` must preserve strict parity with JSON for H1/H2/H3s, section copy, assets, FAQs, CTA/link draft, warnings, open issues, summary statement, and verdict. JSON remains the gate.

## Verdict And Repairs

`firstDraftVerdict.status` may be `pass`, `pass_with_warnings`, `fail`, or `ask_user`; actions are `continue_to_step11`, `repair_step10`, `return_to_step9`, `return_to_step8`, `return_to_step7`, `return_to_step6`, `return_to_step5`, `return_to_step4`, `return_to_step3`, `return_to_step2`, `return_to_step1`, `return_to_0B`, `ask_user`, or `skip_page`.

Allow up to 3 repairs for weak Step 10 fields only: weak intro, shallow section, missing example, generic prose, placeholder prose, missing transition, missing FAQ answer, missing draft CTA/internal link, readability issue, missing section-level proof, minor voice issue, or weak query coverage.

Do not repair in Step 10: missing/invalid Step 9 outline, structural conflict, missing evidence, new factual claim needing research, unsupported risky claim, unsafe advice, missing upstream hash, required asset undefined upstream, Step 8/9 contradiction, or duplicate page concept requiring scope/outline change.

`pass_with_warnings` is allowed only for non-critical polish limits such as minor polish needed, inaccessible historical uniqueness, final CTA wording pending, citation display style pending, or final SEO optimization pending.

## Carry Forward

`mustCarryForward` must include `firstDraftHash`, section IDs, required assets delivered, claims needing citation or softening, unresolved polish notes, CTA/internal-link draft notes, FAQ delivery notes, query coverage notes, uniqueness warnings, and proof requirements.

Later steps must provide `firstDraftDeliveryProof`, showing preserved or intentionally improved section content, assets, claim handling, CTA/internal links, FAQ content, intro promise, high-depth substance, anti-generic requirements, and completeness.
