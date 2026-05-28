# Final Copy Expansion Workflow

Final copy expansion turns a page-packet scaffold into fuller review-ready draft copy while preserving the same page-packet schema.

## Inputs

- Existing `page-packet.json`
- Existing page-packet sections and metadata
- Existing CTA, image, link, and schema draft structures

## CLI Command

```bash
seo-agent final-copy expand --cluster acne-treatment --page-id P1
```

Generated files:

```text
.seo-agent-workspace/page-packets/<category-slug>/<page-id>/page-packet.expanded.json
.seo-agent-workspace/page-packets/<category-slug>/<page-id>/page-packet.expanded.md
```

## Rules

- Preserve `page-packet.v1`.
- Preserve section IDs.
- Preserve image IDs and image slots.
- Preserve internal and external link groups.
- Preserve JSON-LD draft structure.
- Keep reference URLs as source-review placeholders until live review is complete.
- Treat expanded copy as review-ready, not auto-approved final copy.
- Do not publish to CMS.

## Editor Use

The expanded Markdown is intended for a writer or editor to review section by section. The JSON artifact is intended for CMS or machine parsing once the copy has been approved.
