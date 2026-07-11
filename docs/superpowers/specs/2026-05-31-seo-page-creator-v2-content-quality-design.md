# SEO Page Creator V2 Content Quality Design

## Scope

Build V2 of the SEO Page Creator Agent around research-backed, human-quality page writing. V1 creates useful structure, but final copy can remain generic because the repo does not yet enforce proof of research, narrative intent, audience depth, citation support, or editorial QA before producing a page packet.

V2 keeps the host-agent-first model. Codex, Gemini, Claude Code, or another host AI agent performs live research, synthesis, writing, and judgment. The Node.js repo provides schemas, config, artifact templates, validators, gate tracking, QA report structure, and CLI orchestration. V2 still stops before CMS publishing.

## Goals

- Prevent final page packets from being generated from only keywords, scaffolds, or generic templates.
- Require evidence that the host agent reviewed ranking pages and competitor/category social or video assets.
- Make narrative style, audience stage, objections, reader takeaway, and brand proof part of the writing process.
- Generate final page packets only after hard gates pass, safe auto-repair has run when needed, and every visible section meets the quality threshold.
- Keep editor-facing output clean: final page packet, editorial QA report, and image manifest after the image workflow.
- Keep research and debug artifacts internal unless the user asks for them.

## Non-Goals

- No direct LLM provider API calls in V2.
- No automatic CMS publishing.
- No automatic social login workflows or scraping that depends on private access.
- No full plagiarism scanner claim. V2 provides heuristic originality checks.
- No full raw source storage. V2 stores summaries, outlines, hashes, and short excerpts.
- No image generation inside the content readiness gate. Image workflow runs after content passes.

## Architecture

V2 uses a gate-and-artifact pipeline:

1. `prepare-page` creates the page workspace, seeded artifacts, and page state.
2. The host agent performs live research and fills internal JSON and Markdown artifacts.
3. The CLI validates schemas, thresholds, and heuristic quality checks.
4. The host agent drafts, rewrites, and repairs content using the validated artifacts.
5. The CLI validates final eligibility and creates or accepts final editor-facing artifacts.
6. The image workflow runs after content is ready and produces the image manifest.

The repository acts as the enforceable operating system for the agent. The host AI remains the writer and researcher.

## Mandatory Gates

Final content copy cannot be generated unless all five mandatory gates pass:

1. SERP Research Ledger Gate
2. Social/Video Research Gate
3. Audience Definition Gate
4. Narrative Brief Gate
5. Citation Set Gate

Each gate uses hybrid enforcement:

- Machine checks validate required fields, counts, statuses, and thresholds.
- Host-agent judgment checks validate qualitative usefulness.
- Final gate status requires both machine checks and judgment checks.

### SERP Research Ledger Gate

The SERP ledger is the ranking-structure foundation.

Rules:

- Capture the original top 10 organic results for the primary keyword.
- Search up to top 25 organic results to obtain 10 meaningful webpage extractions.
- Title, meta, H1, or H2 extraction alone does not count as a successful read.
- YouTube and social pages do not count toward the 10 SERP webpages.
- Forums, directories, marketplaces, Reddit, Quora, and community pages can count only if they genuinely rank and are useful for intent.
- At most 2 of the 10 analyzed SERP sources can be from capped community, directory, forum, marketplace, or aggregator source types.
- Blocked or inaccessible top-10 results must be logged and replaced with the next eligible organic result.
- SERP gate hard fails if 10 meaningful webpage extractions cannot be achieved after checking up to top 25.

Each analyzed source should include:

- URL, rank, title, meta description if available, H1, H2/H3 outline.
- Meaningful body/content summary.
- Source type and authority/category classification.
- Content angle, important topics, claims, CTA pattern, FAQ/schema signals.
- Normalized text hash where possible.
- Source excerpt limited to 500 characters.
- Extraction status and access date.

The SERP ledger must include content gap synthesis:

- Top recurring ranking angles.
- Common page structures and FAQ patterns.
- Common CTA patterns.
- What competitors explain well.
- What they miss.
- Differentiation opportunities.
- AI Overview/direct-answer opportunities.
- Long-tail opportunities.

### Social/Video Research Gate

Social/video research exists to improve human language, hooks, objections, examples, and content texture. It is separate from SERP research because it serves a different purpose.

Rules:

- Attempt at least 7 social/video assets.
- Successfully review at least 5 assets if accessible.
- If fewer than 5 are accessible, log why and pass only with limited confidence.
- Primary focus is competitor/category creator content, not only brand-owned assets.
- User-provided competitor/category creator handles or URLs have highest priority.
- YouTube, Shorts, Instagram Reels/posts, and provided social/video URLs should be used where accessible.
- Comments may be used only as audience-language, pain point, confusion, objection, FAQ, or hook signals.
- Comments, captions, and transcripts must not be used as factual sources.
- Social/video scripts, captions, creator hooks, and comments must not be copied verbatim unless explicitly approved and legally safe.

The artifact should capture:

- Assets attempted, successfully reviewed, and inaccessible.
- Access failure reasons.
- Confidence level: high, medium, or limited.
- Recurring hooks, phrases, pain points, myths, objections, visual concepts, questions, and CTA styles.
- Section or content-use mapping.

### Audience Definition Gate

The audience definition prevents broad, faceless copy.

Required fields:

- Target cohort.
- Reader awareness stage: problem-aware, solution-aware, product-aware, comparison-ready, or ready-to-act.
- Desired reader takeaway.
- Reader situation and decision context.
- Top 2-3 objections/trust barriers for product/category and comparison pages; top 1-2 for low-risk guide/supporting pages.
- CTA connection.

The agent should recommend 2-3 reader takeaway options and 2-3 likely barriers, then ask the user to confirm or edit. If the user says "you decide," the agent can select and record the assumption.

### Narrative Brief Gate

The narrative brief makes the page write from an editorial angle rather than a template.

Required fields:

- Primary narrative style selected by the user or explicitly delegated with "you decide."
- Optional single secondary flavor.
- Reader situation, opening angle, page promise, brand POV, differentiation angle, and desired reader takeaway.
- Section-level narrative direction.
- CTA logic and what not to say.

The agent must recommend 2-3 narrative styles based on page type, keyword, audience, CTA goal, sensitivity, and cluster context. It must ask the user to choose a primary style unless the user says "you decide." Fast mode must not silently infer narrative style.

### Citation Set Gate

The citation set ensures important claims are source-supported.

Required fields:

- Claim, claim strength, section, source URL, source type, confidence, citation purpose, and allowed wording.
- Source-to-section mapping.
- External link purpose: citation/reference or destination/action.
- Display mode for links: visible, unstyled, invisible_or_hidden_reference, or reference_section_only.

Official or authority sources can enrich the citation set even if they do not rank in SERP. They do not replace the 10 meaningful SERP source requirement.

Sensitive or regulated-style claims require at least one relevant official or authority source. The agent auto-classifies page sensitivity and asks the user to confirm only when possible sensitivity is detected.

## Writing Pipeline

The final copy must not be generated directly from keywords or structure. It must be generated from:

- SERP research ledger.
- Social/video research.
- Audience definition.
- Narrative brief.
- Citation set.
- Optional proof points.
- Section writing plan.

Recommended pipeline:

1. SERP insight synthesis.
2. Social/video language and objection synthesis.
3. Audience definition.
4. Narrative brief.
5. Citation set and claim-safety plan.
6. Section writing plan.
7. Section-by-section draft.
8. Human editorial rewrite.
9. Editorial QA.
10. Safe auto-repair once when needed.
11. Re-score and final eligibility decision.

Every section needs a clear job, reader payoff, source of truth, and relationship to the page intent. The agent should use examples, natural transitions, varied sentence rhythm, mobile-readable paragraphs, and concrete reader-specific language.

## Profiles And Config

V2 uses editable config files:

- `config/generic-phrase-patterns.json`
- `config/narrative-style-profiles.json`
- `config/page-type-modifiers.json`
- `config/claim-rewrite-patterns.json`
- `config/image-prompt-profiles.json`

### Default Master Profile

The default master writing profile is `advanced_india_seo_editorial_strategist`.

Purpose:

An advanced Indian SEO editorial strategist who understands Indian search behavior, researches deeply, writes natural human editorial copy, structures pages for ranking and clicks, and keeps readers moving through the page without sounding robotic or over-optimized.

The profile emphasizes:

- Indian market and audience nuance.
- Google helpful content and E-E-A-T principles.
- SERP pattern analysis and content gap identification.
- Long-tail opportunity mapping.
- AI Overview-friendly answer structuring.
- Mobile-first readability.
- CTA alignment and conversion clarity.
- Source-backed claims and citation discipline.
- Storytelling hooks with editorial clarity.

### Page-Type Modifiers

Page-type modifiers live in `config/page-type-modifiers.json`.

Default modifiers:

- `guide_blog_modifier`
- `comparison_modifier`
- `product_category_modifier`

Page-type modifiers control page function and structure. They win over narrative style when structure and function conflict.

### Narrative Styles

Built-in narrative profiles are editable and include:

- Story-led blog.
- Professional compact guide.
- Expert explainer.
- Comparison/review.
- Founder/operator voice.
- Customer-problem narrative.
- Neutral editorial guide.
- High-conversion product/category page.

The user chooses one primary style and may choose one secondary flavor. The secondary flavor influences openings, examples, transitions, and CTA microcopy, but cannot override page type, brand rules, or user instructions.

### Custom Profiles

Company custom profiles are optional. They can be user-written, agent-inferred from brand assets, or hybrid. If the agent infers a custom profile, it must ask the user to approve, edit, reject, or save before adding it to the company reference library.

Profile priority:

1. User page-specific instructions.
2. Company custom profile.
3. Page-type modifier.
4. Selected narrative style.
5. Default master profile.
6. Global repo defaults.

The QA report shows only profile names by default, not full profile details.

## Quality Gates And QA

Final editor-facing packet generation is blocked by hard failures. Users cannot override hard gates. Users may override advisory scores and recommendations.

Hard failures include:

- Missing or failed mandatory gates.
- Missing SERP research coverage.
- Missing narrative style selection unless the user said "you decide."
- Placeholder copy.
- Generic or agentic opening.
- Unsupported risky claims.
- Critical claims without explicit approval and strong source support.
- Copied or near-copied competitor, SERP, social, or video wording.
- No clear first-fold value.
- No primary CTA logic.
- Visible competitor mention without approval.
- Unapproved external destination/action link.
- Any visible section below 70 after the allowed repair flow.

Advisory issues include:

- Weak metadata.
- FAQ could be expanded.
- Internal links could improve.
- Schema could be richer.
- Social/video research passed with limited confidence.
- No brand proof points provided.

### Scores

The QA report includes:

- Overall advisory score.
- Dimension subscores.
- Section-level subscores.
- Brief reason why points were lost.
- Notes and top remaining recommendations.

Dimension subscores:

- Research grounding.
- Narrative fit.
- Human readability.
- SEO completeness.
- Conversion clarity.

Section thresholds:

- 90-100: Strong.
- 80-89: Pass.
- 70-79: Advisory.
- Below 70: Needs repair.

Every visible section must score at least 70 after repair. Inserted sections, FAQ sections, methodology blocks, comparison tables, and CTA sections all count. `S10_references` is scored for source completeness rather than prose quality.

### Auto-Repair

V2 performs one automatic safe repair when needed, then re-scores.

Safe auto-repair can address:

- Generic opening.
- Weak transitions.
- Thin section copy.
- Poor sentence rhythm.
- Missing section usefulness.
- Bland CTA microcopy.
- Shallow FAQ.
- Sparse or forced keyword use.
- Weak metadata.
- Markdown formatting issues.

The agent must ask before repairing:

- New factual claims.
- Competitor mentions.
- Competitor comparisons.
- Brand positioning.
- CTA destination.
- Pricing or discount claims.
- Sensitive claims.
- External brand logos or images.
- User-approved structure.

If auto-repair fails, the user may request one manual second repair. If the second repair fails, further rewrites are blocked until an upstream artifact is revised.

Failure reports must recommend which upstream artifact likely needs revision: research ledger, social/video research, audience definition, narrative brief, citation set, brand profile, CTA strategy, page structure, or content depth.

### QA Report Visibility

The editor-facing QA report includes:

- Final status.
- Advisory score and subscores.
- Hard gate results.
- Writing profile names.
- Section-level QA table.
- Auto-repair summary only if auto-repair happened.
- Claim safety summary only if relevant.
- Originality summary.
- Top remaining recommendations.
- Page status summary.
- Image status pointer.

It does not dump all internal research notes by default.

## Claims And Sources

V2 classifies claims by strength:

- Low: general educational statement.
- Medium: brand/product capability, process claim, comparison criterion, or practical recommendation.
- High: measurable, statistical, authority, outcome, sensitive, or strong benefit claim.
- Critical: guarantee, diagnosis, cure, legal/financial promise, competitor superiority, safety certainty, or regulated claim.

Citation requirements:

- Low: no explicit citation unless sensitive or central to page.
- Medium: source, brand proof, or user-provided support.
- High: high-confidence source, preferably official/authority when relevant.
- Critical: rewrite down automatically where possible. If kept, require explicit user approval and strong source support.

Claim rewrite patterns are editable globally, at company level, and at page level. Page-specific rules win, company rules win next, and global rules apply last.

## Links

External links have two types:

- Citation/reference links.
- Destination/action links.

Citation/reference links do not require approval but must have purpose, section, display mode, and open-in-new-tab metadata. External destination/action links require approval if they send users away from the brand or platform.

Internal links do not require approval by default. Approval is needed only when a link changes primary CTA strategy, changes the primary CTA destination, points to an unconfirmed/sensitive page, or creates a claim/implication that needs approval.

Supported link display modes include visible, unstyled, invisible_or_hidden_reference, reference_section_only, visible_contextual, unstyled_contextual, CTA, breadcrumb, related_page, navigation/header, footer, and hidden_or_unstyled where design or CMS supports it.

The final packet should record link purpose and display mode. It should avoid deceptive UX.

## Competitors And Originality

Competitor research is allowed internally. Visible competitor mentions, competitor logos, competitor product screenshots, competitor brand images, external competitor destination links, and direct competitor comparison claims require explicit user approval.

The agent asks only when final copy proposes visible competitor usage, and it must show:

- Competitor name.
- Section ID.
- Exact context.
- Proposed wording.
- Reason for inclusion.
- Risk level.
- Alternative wording without the competitor mention.

Generic category comparisons without naming brands are allowed if source-backed and not misleading.

V2 includes heuristic originality checks against SERP content, social/video captions, transcripts, creator hooks, competitor copy, and competitor CTA phrasing. Exact or near-exact copied wording is a hard fail. Common industry terms, generic concepts, and shared FAQ themes are allowed.

## Section Model

Current implementation note: prewriting now generates an intent-aware `pageStructure.intentPattern`, `pageStructure.structureVariant`, and exact `pageStructure.sections` contract. Section IDs are stable within a generated packet, but middle section IDs are not globally fixed across page types. Adapters must read each section's `sectionIntent`, `evidenceNeeded`, `requiredDevices`, and `evidenceBudget` before drafting claim-first plans, depth artifacts, final copy, or images.

Common anchors usually remain:

- `S1_hero`
- `S8_faq`
- `S9_final_cta`
- `S10_references`

Research can refine structure after initial planning, but generated section IDs and order must remain synchronized across page packet, claim-first plan, depth artifacts, final-copy draft, images, and QA.

Final page packet Markdown uses both comments and visible headings:

```md
<!-- SECTION_ID: S4_pricing_ranges -->
## Section Heading
```

Section scores belong only in the QA report, not in the final page packet JSON mirror.

## Images

Image generation runs after content passes.

Editor-facing image artifacts:

- `image-manifest.json`
- `image-manifest.md`
- `image-prompts.md` only when ungenerated images remain.

Reserved image IDs:

- `IMG_OG`
- `IMG_HERO`

Rules:

- `IMG_OG` is separate from in-page image count.
- `IMG_HERO` is mandatory for every V2 page packet and maps to `S1_hero`.
- OG and hero images are generated separately by default.
- Hero image counts toward the 3-5 generated in-page image default.
- OG image and hero image require brand logo placement by default.
- In-page explanatory images can include the logo when it fits and does not distract.
- Generate 3-5 high-impact in-page images by default.
- Additional image ideas become prompts/briefs unless the user explicitly asks to generate more.
- Image generation budget is 5 minutes per batch of up to 2 images.

Image asset types:

- `generated`
- `fetched_external`
- `brand_asset`
- `prompt_only`
- `reserved`

Prompt-only images count toward `publish_ready` only if generation failed, generation timed out and the user chose prompts, or the user explicitly approved prompt-only assets.

Editorial QA focuses on content. Image QA lives in the image manifest.

## Status And State

V2 stores internal lifecycle state in:

- `page-state.json`

Statuses:

- `in_progress`
- `failed`
- `content_ready`
- `publish_ready`

Definitions:

- `content_ready`: final page packet and editorial QA passed, but image workflow may be pending or partial.
- `publish_ready`: final page packet, editorial QA report, image manifest, and required image slots or accepted prompts are complete.

`page-state.json` is internal, but status summaries can appear in CLI output and QA reports.

## Version History

V2 maintains section-level version history:

- `section-version-history.json`
- `section-version-history.md`

Create empty version history artifacts at page setup. Start recording once drafting begins.

Events:

- `initial_section_draft`
- `auto_repair`
- `manual_repair`
- `user_edit`
- `refresh_update`
- `finalization`

Store hashes and short excerpts, not full snapshots. Excerpts are limited to 280 characters. The same 280-character limit applies to failed excerpts in QA failure reports.

## Refresh Packets

V2 supports lightweight refresh packets for existing pages.

Visible refresh outputs:

- `refresh-packet.md`
- `refresh-packet.json`
- `refresh-qa-report.md`
- `refresh-qa-report.json`

Refresh packets cover only changed sections and update rationale. They do not include unchanged sections or full research dumps.

Refresh gates apply to changed sections, changed claims, affected citations, affected CTA/internal links, affected images, and affected schema/FAQ. A full re-gate is needed only when primary keyword, page intent, CTA strategy, page type, sensitivity classification, SERP landscape, or core page strategy materially changes.

Refresh workflows use the same auto-repair policy and section-version-history artifact.

## Debug Bundle

V2 includes a debug bundle command that keeps normal outputs clean while supporting troubleshooting.

Expected outputs:

- `debug-bundle.md`
- `debug-bundle.zip`, if practical.

The bundle includes internal diagnostics, page state, final page packet if generated, editorial QA report, image manifest, and image prompts if present. It does not include large generated image binaries, downloaded external image files, large raw source captures, or full scraped pages by default. Image paths and URLs are included instead.

## CLI Shape

Normal orchestration:

```bash
seo-agent v2 prepare-page --cluster <slug> --page-id <id>
```

Additional commands:

```bash
seo-agent v2 status --cluster <slug> --page-id <id>
seo-agent v2 validate-gates --cluster <slug> --page-id <id>
seo-agent v2 qa --cluster <slug> --page-id <id>
seo-agent v2 images --cluster <slug> --page-id <id>
seo-agent v2 refresh --cluster <slug> --page-id <id>
seo-agent v2 debug-bundle --cluster <slug> --page-id <id>
```

V2 should also expose separate/debug commands for each gate:

```bash
seo-agent v2 research
seo-agent v2 social-video
seo-agent v2 audience
seo-agent v2 narrative
seo-agent v2 citations
seo-agent v2 packet
```

`prepare-page` creates/checks artifacts and guides the host agent. It does not perform live research by itself.

## Output Visibility

Editor-facing after content flow:

- Final page packet.
- Editorial QA report.

Editor-facing after image flow:

- Image manifest.
- Image prompts only when ungenerated images remain.

Internal unless requested:

- SERP research ledger.
- Social/video research.
- Audience definition.
- Narrative brief.
- Citation set.
- Proof points.
- Section writing plan.
- Source inventory.
- Page state.
- Section version history.

The final page packet includes only pointers to the QA report and image manifest by default. Internal research pointers stay in `page-state.json` unless requested.

## Testing

V2 should add tests for:

- Gate schemas and required fields.
- SERP research coverage thresholds, replacement logic, capped source-type limit, and hard fail behavior.
- Social/video attempted/reviewed counts and limited confidence behavior.
- Audience definition required fields and awareness stage handling.
- Narrative brief style selection, reader takeaway, and profile names.
- Citation set claim-strength validation and critical claim handling.
- Generic phrase, placeholder, and risky claim heuristic validators.
- Section score threshold and repair attempt limits.
- Page state status transitions.
- Version history excerpt limits.
- Final packet eligibility when gates pass or fail.
- Image manifest reserved IDs, asset types, prompt-only acceptance rules, and publish readiness.
- Refresh packet changed-section gating.
- Debug bundle content selection without large binaries.

## Acceptance Criteria

V2 is successful when:

- A final page packet cannot be generated without passing the five mandatory gates.
- SERP research proves 10 meaningful webpage extractions or hard fails.
- Social/video research is attempted for at least 7 assets and reviewed where accessible.
- Narrative style, reader takeaway, awareness stage, objections, and CTA logic are captured before writing.
- Generic/template copy is caught before final packet generation.
- Safe auto-repair runs once and is summarized only when it happens.
- Section-level scores and lost-points notes appear in QA, and sections below 70 block final packet after repair.
- Internal artifacts remain available for debugging but do not clutter the editor-facing output.
- Content can reach `content_ready` separately from `publish_ready`.
- Image workflow produces JSON and Markdown manifests after content passes.
