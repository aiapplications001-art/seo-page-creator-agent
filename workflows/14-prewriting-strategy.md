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
- Intent pattern and structure variant
- Sequential section plan with per-section evidence requirements
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

Do not assume one global section sequence. The Pre-Writing Strategy must infer an intent pattern and structure variant from the selected page opportunity, then write `pageStructure.intentPattern`, `pageStructure.structureVariant`, `pageStructure.inference`, `pageStructure.researchBasis`, `pageStructure.structureUniquenessRationale`, `pageStructure.mustDifferFromPages`, and `pageStructure.sections`.

Page structure must be research-derived and intentionally different per page. During batch or refresh work, compare the proposed section order, decision tools, mistake/troubleshooting pattern, tables, FAQs, superiority component, CTA placement, and CTA body against current-batch pages and historical pages from previous runs. Different titles, hooks, slugs, or paraphrased wording are not enough if the page follows the same body section pattern.

Supported variants:

| Intent pattern | Structure variant | Reader job |
| --- | --- | --- |
| `product_category` | `category_solution` | Diagnose fit, choose criteria, map to the right solution path. |
| `comparison` | `comparison_matrix` | Compare options with methodology, criteria, matrix, and reader-fit tradeoffs. |
| `alternatives` | `alternatives_evaluator` | Evaluate alternatives fairly and explain switching tradeoffs. |
| `best_list` | `ranked_shortlist` | Rank options by transparent criteria and best-fit use cases. |
| `how_to` | `step_by_step_guide` | Teach a process with prerequisites, steps, mistakes, and outcomes. |
| `pricing` | `pricing_decision` | Explain cost drivers, pricing ranges/models, value, and hidden costs. |
| `local` | `local_service` | Answer local availability and booking/selection questions. |
| `informational` | `educational_guide` | Explain a topic deeply and convert knowledge into reader judgment. |

`S1_hero`, `S8_faq`, `S9_final_cta`, and `S10_references` are common anchors when relevant. Middle section IDs are variant-specific. Treat section IDs as stable within the generated packet, not globally fixed across all page types.

Each section can have a different role. Some sections are mainly SEO, some are user experience, some are conversion, and some are trust/reference sections.

Each section must also include:

- `sectionIntent`
- `evidenceNeeded`
- `requiredDevices`
- `evidenceBudget.minimumFacts`
- `evidenceBudget.minimumCitedClaims`
- `evidenceBudget.minimumConcreteExamples`

Adapters must read these fields before drafting. Do not hardcode old IDs such as `S3_context` or `S4_main_content`.

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
