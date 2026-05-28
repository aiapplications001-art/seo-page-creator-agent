# Pre-Writing Strategy Workflow

The Pre-Writing Strategy is the required gate between cluster selection and full publish-ready page drafting. It converts one selected page opportunity into the page-specific writing brief.

## Inputs

- Existing cluster strategy
- Selected page opportunity ID, such as `P1`
- Target audience cohort
- Primary keyword
- Secondary keywords
- Tone selection, chosen by the user from 2-3 suggestions
- Content depth target range
- Optional known CTA destination override

## CLI Command

```bash
seo-agent prewriting plan --cluster acne-treatment --page-id P1 --audience "Indian adults with visible acne" --tone "professional compact" --primary-keyword "acne treatment"
```

Generated files:

```text
.seo-agent-workspace/clusters/<category-slug>/prewriting/<page-id>/strategy.json
.seo-agent-workspace/clusters/<category-slug>/prewriting/<page-id>/strategy.md
```

## What It Must Decide

- Page type and selected opportunity
- Target audience cohort
- Tone options and selected tone
- Content depth target range
- Primary CTA goal and recommended destination
- First-fold CTA requirements
- Mobile sticky CTA requirements
- Sequential section plan
- Reference and SERP review requirements
- Image generation requirements
- Approval queues by component and risk
- Source-backed inference notes

## Writing Gate

The agent must not generate full page copy until:

1. A Pre-Writing Strategy exists.
2. The user has selected or confirmed page tone.
3. Critical approvals are resolved.
4. Live search/reference review has been completed by the adapter when needed.

Fast mode may skip low-risk structure approvals only when the user explicitly enables fast mode. It must not skip critical approval items such as competitor names, external brand logos, product screenshots, or external brand images.

## Section Plan

Use the standardized section IDs:

```text
S1_hero
S2_quick_answer
S3_context
S4_main_content
S5_decision_support
S6_product_or_solution_block
S7_trust_proof
S8_faq
S9_final_cta
S10_references
```

Each section can have a different role. Some sections are mainly SEO, some are user experience, some are conversion, and some are trust/reference sections.

## Agent Rules

- Generate only one page strategy at a time.
- Treat depth and length as target ranges unless the user explicitly says strict.
- Do not choose a default tone silently.
- Ask the user to choose a tone for every page.
- Include one primary CTA path by default.
- Recommend keeping the CTA destination stable unless the editor changes it.
- Require first-fold action visibility.
- Recommend mobile sticky CTA labels where useful.
- Include FAQ and JSON-LD guidance when FAQ content is present.
- Keep the machine-readable JSON block for CMS and parser workflows.
