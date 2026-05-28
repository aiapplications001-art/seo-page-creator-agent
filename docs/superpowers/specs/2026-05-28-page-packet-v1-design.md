# Page Packet V1 Design

## Scope

Build a deterministic publish-ready page packet scaffold from one completed Pre-Writing Strategy. This slice does not publish to CMS, does not fetch live SERPs, and does not generate long-form creative copy. It creates the structured Markdown and JSON package that an agent adapter can later expand into final prose or that an editor can review section by section.

## Approach

The page packet generator consumes `prewriting/<page-id>/strategy.json` and writes a packet under `.seo-agent-workspace/page-packets/<cluster-slug>/<page-id>/`. The packet contains SEO metadata, URL slug recommendation, H1 rule, section-level Markdown copy scaffolds, CTA guidance, mobile/desktop rendering notes, image slots, reference slots, JSON-LD drafts, and a machine-readable JSON mirror.

## Key Decisions

- One packet per run.
- Output Markdown is the primary editor artifact.
- Output JSON mirrors key metadata, links, images, and sections for CMS parsing.
- Section IDs remain standardized and sequential.
- The packet includes editable section blocks, not CMS publishing instructions.
- The packet includes image slots and prompts/brief references, but actual generated image metadata can live in a companion artifact later.
- The packet is valid only when the source Pre-Writing Strategy has a selected tone.

## Files

- `src/lib/page-packet.ts`: pure packet builder and Markdown renderer.
- `src/cli/page-packet.ts`: workspace reader/writer and CLI command handler.
- `schemas/page-packet.schema.json`: public output contract.
- `workflows/15-page-packet.md`: adapter and editor workflow.
- Tests for pure generation and workspace output.

## Testing

Tests should verify:

- Packet generation requires a selected tone.
- Packet has one H1, meta fields, URL slug, CTA microcopy, mobile sticky CTA guidance, section copy blocks, references, image slots, JSON-LD drafts, and machine metadata.
- Workspace command writes `page-packet.md` and `page-packet.json` to the page-packets directory.
