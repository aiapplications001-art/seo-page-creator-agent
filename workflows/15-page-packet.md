# Page Packet Workflow

The page packet is the editor-facing and machine-readable artifact for one SEO page. It is created only after a Pre-Writing Strategy exists.

## Inputs

- Pre-Writing Strategy JSON
- Optional author name and descriptor
- Optional reviewer name and descriptor
- Optional creation/update dates

## CLI Command

```bash
seo-agent page-packet build --cluster acne-treatment --page-id P1 --author "ClearNest Editorial Team" --author-descriptor "Skin care editorial team"
```

Generated files:

```text
.seo-agent-workspace/page-packets/<category-slug>/<page-id>/page-packet.json
.seo-agent-workspace/page-packets/<category-slug>/<page-id>/page-packet.md
```

## Packet Contents

- Meta title, description, slug, H1, OG, and Twitter copy
- Author block and hidden reviewer metadata
- Primary CTA and mobile sticky CTA recommendation
- Mobile-first and desktop rendering notes
- Editable section blocks from the prewriting strategy's intent-aware structure
- Internal links and external reference slots
- Image slots, including reserved `IMG_OG`
- JSON-LD drafts where relevant
- Machine-readable JSON mirror

## Editing Rules

- Keep one H1.
- Keep one primary CTA path unless the editor intentionally changes strategy.
- Keep section IDs stable for CMS parsing within the generated packet.
- Do not assume section IDs are globally fixed across page types; read `pageStructure.intentPattern`, `pageStructure.structureVariant`, and `pageStructure.sections`.
- Do not reuse page structure from another page, batch, or previous run. The page packet must follow the current page's research-derived `pageStructure.structureUniquenessRationale`; section order, decision tools, mistakes, troubleshooting, tables, FAQs, superiority component, and CTA placement must be visibly distinct when research differs.
- External links used as destinations should open in a new tab.
- Reference-only URLs should stay in the references section.
- Image metadata and generated asset paths may be supplied in a companion artifact.
- Do not publish or update a CMS from this workflow.

## Adapter Rules

Agent adapters may expand section scaffolds into final prose, but they must preserve:

- `metadata.schemaVersion`
- section IDs
- section order from the prewriting strategy
- image IDs
- link groups
- JSON mirror structure
- source prewriting page ID

If a user asks for fully written final copy, the adapter should use this packet as the container and replace editable section scaffolds with final reviewed copy.
