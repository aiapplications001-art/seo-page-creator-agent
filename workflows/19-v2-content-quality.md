# V2 Content Quality Workflow

V2 is a host-agent-first workflow. The CLI creates and checks deterministic artifacts, but the host agent performs live research, reviews sources, writes the copy, records judgment notes, and fills the artifacts.

Generate one page packet at a time. Start with one product/category cluster, one selected page, one audience definition, and one conversion goal.

V2.1 adds a human editorial layer before final copy. The Human Editorial Brief and Claim-First Section Plan are internal by default; the editor should normally see only a short summary in the QA report.

## Command Order

```bash
seo-agent v2 prepare-page --cluster acne-treatment --page-id P1 --page-type product_category
seo-agent v2 status --cluster acne-treatment --page-id P1
seo-agent v2 validate-gates --cluster acne-treatment --page-id P1
seo-agent v2 qa --cluster acne-treatment --page-id P1
seo-agent v2 debug-bundle --cluster acne-treatment --page-id P1
```

Use the existing image workflow after content passes:

```bash
seo-agent images plan --cluster acne-treatment --page-id P1
```

Refresh packets are built for changed sections only and should be written beside the V2 page packet artifacts.

## Mandatory Gates

The final page packet must not be generated until all five gates pass.

1. SERP Research Ledger Gate
2. Social/Video Research Gate
3. Audience Definition Gate
4. Narrative Brief Gate
5. Citation Set Gate

Hard gate failures cannot be overridden. Advisory scores can be overridden by an editor, but the override must not bypass missing research, unsupported claims, or missing required artifacts.

## SERP Research Ledger Gate

The host agent must review live search results before finalizing structure or copy.

- Top 10 meaningful SERP body extractions are required.
- Search up to 25 results when replacements are needed.
- Title, meta, H1, and H2 extraction alone does not count as a successful read.
- YouTube, Instagram, Shorts, and other social/video assets do not count toward the 10 SERP webpages.
- Forums, directories, marketplaces, and community pages can count only when genuinely ranking and useful, with a maximum of 2 in the 10.
- Official sources can enrich citations but cannot replace competitor/page research.

The ledger should store summaries, normalized hashes where possible, and excerpts of 500 characters or less.

## Social/Video Research Gate

Social and video research is mandatory because it improves human language, hooks, objections, and examples.

- Attempt at least 7 assets total.
- At least 5 assets must be successfully reviewed if accessible.
- If fewer than 5 are accessible, log why and mark limited confidence.
- Prioritize competitor/category creator videos, Shorts, reels, and captions.
- Comments may be used as audience-language signals only, not factual sources.
- Do not quote comments or creator scripts verbatim unless explicitly approved and legally safe.

## Audience Definition Gate

Before writing, define:

- Target cohort.
- Awareness stage.
- Reader takeaway.
- Top objections or trust barriers.
- CTA/actionable connection for the page.

Audience definition is a separate gate. It is not merged into citations or narrative brief.

## Narrative Brief Gate

The user must explicitly choose the page tone unless they say "you decide."

The host agent should recommend 2-3 tone options and ask the user to choose one primary style plus, optionally, one secondary flavor. It should also ask separately for the reader takeaway.

The Narrative Brief Gate must include:

- Primary narrative style.
- Optional secondary flavor.
- Opening angle.
- Brand point of view.
- Section-level writing direction.
- Objection awareness.
- Sensitivity note if the page touches health, finance, legal, safety, or similar topics.

Sensitive topics should avoid dramatic or high-pressure styles and prefer calmer expert/professional styles.

## Human Editorial Brief

After the Narrative Brief, complete `human-editorial-brief.json` and `human-editorial-brief.md`.

The brief should translate research and audience context into human editorial choices:

- Voice model: category manager with editorial empathy.
- Opinionation: adaptive by page type.
- Depth: comparison uses decision-relevant depth, product/category uses medium depth, guide/blog uses full depth.
- Background: decision-first, then 5W plus causal chain depth when useful.
- Examples: at least 2 useful examples or scenarios per page.
- Decision framework: required once per page, with user asked once for preferred format.
- Common mistakes: mandatory, blended into relevant sections by default.
- Not-right-for-you guidance: mandatory for product/category and comparison pages, recommended for guide/blog pages.
- Brand POV: clear but not salesy, with occasional first-person only where useful.
- Human devices: natural reader questions, practical analogies, mini decision trees, micro-summaries after complex explanations, and short human closing before CTA.

Example:

```yaml
reader_tension:
  what_reader_is_confused_about: "Why acne keeps returning even after changing products."
category_manager_pov:
  what_to_choose: "Start with understanding acne pattern before choosing stronger products."
  what_to_avoid: "Do not treat every breakout as random."
example_requirement:
  minimum_examples_per_page: 2
  priority: category context first, India context when relevant, brand context only with proof
```

## Claim-First Section Plan

Before final copy, complete `claim-first-section-plan.json` and `claim-first-section-plan.md`.

Every visible section should have:

- Section claim.
- Reader question.
- Evidence needed.
- Example or tradeoff.
- Caveat or not-right-for-you note where relevant.
- Decision purpose.
- Transition purpose.

This prevents sections from becoming keyword-shaped summaries. The section should earn its place by helping the reader understand, choose, avoid, compare, or act.

Example:

```yaml
section_id: S3_context
section_claim: Acne treatment works better when the reader first identifies the acne pattern.
reader_question: Why did my previous acne products not work?
evidence_needed: Source-backed acne type or trigger guidance.
example_or_tradeoff: Recurring jawline acne may need a different path from occasional forehead bumps after a new product.
decision_purpose: Help the reader choose diagnosis-first action instead of random product switching.
```

## Citation Set Gate

Every high-strength or critical claim must have source support. Critical claims should be rewritten down automatically when possible. If a user insists on a critical claim, require explicit approval and source support.

Use natural visible links where helpful. Include a references/source metadata section. Machine-readable JSON should mirror source mappings. Invisible or unstyled links may be recommended only when not deceptive and when the CMS/editor can control final styling.

## QA And Repair

The QA report is required before final packet release.

- Final gate status requires both machine-checkable fields and host-agent judgment notes.
- Include overall advisory score and subscores.
- Include section-level scores and brief notes.
- Every visible changed/final section must meet the section threshold, default 70.
- Auto-repair once for safe issues, then re-score.
- Include auto-repair summary and top remaining recommendations only if repair actually happened.
- If the second manual reattempt fails, revisit research and narrative artifacts before trying again.
- Show brief failed excerpts only when useful; do not publish the full failed draft.

No hard-gate override is allowed.

## Content And Publishing State

`content_ready` means the final page packet and editorial QA report can be reviewed by an editor.

`publish_ready` means content is ready and image requirements are also complete:

- Image manifest exists.
- `IMG_OG` exists.
- `IMG_HERO` exists and maps to `S1_hero`.
- Prompt-only required images count only when accepted by the user.

Final editor-facing outputs are the final page packet, editorial QA report, and image manifest. Internal research artifacts stay in page state/debug bundle unless requested.

## Image Workflow After Content Passes

Run image planning after content passes. The final packet should reference image slots, while the image manifest carries file paths, URLs, prompts, licensing/source metadata, and image QA.

Required image rules:

- `IMG_OG` is separate from in-page visuals.
- `IMG_HERO` is mandatory for every page packet.
- Generate actual image files when possible.
- Prompt-only is acceptable only after timeout/failure or user choice.
- Logo usage is mandatory for OG and hero visuals unless the user or brand guideline disallows it.

## Refresh Workflow

Refresh packets should cover only changed sections and update rationale. Apply hard gates only to changed sections and affected claims unless the core intent or page strategy changed.

Record section version history with hashes and short excerpts. Use event type `refresh_update` for refresh edits.

## Debugging

Use the debug bundle only for troubleshooting bad output or missing artifacts:

```bash
seo-agent v2 debug-bundle --cluster acne-treatment --page-id P1
```

The debug bundle should include summaries and artifact paths, not full scraped pages or large image binaries.
