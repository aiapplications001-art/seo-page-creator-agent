# Final Copy Expansion V1 Design

## Scope

Build a deterministic expansion layer that turns a page packet scaffold into a fuller review-ready draft while preserving the packet schema. This slice does not perform live SERP research, does not publish to CMS, and does not claim that copy is final without editor review.

## Approach

The expansion layer reads a `page-packet.json`, replaces editable scaffold text in each section with section-specific draft copy, and writes an expanded packet artifact. It preserves section IDs, image IDs, links, JSON-LD drafts, metadata, and the machine-readable mirror.

## Key Decisions

- The expanded packet uses the same `page-packet.v1` schema.
- Expansion status is stored in metadata as an optional `copyStatus`.
- Sections are expanded deterministically based on section ID, page type, audience, CTA, and keyword metadata already inside the packet.
- External references remain placeholders until live review is done.
- Critical approval items are not bypassed.

## Files

- `src/lib/final-copy.ts`: pure expansion logic.
- `src/cli/final-copy.ts`: workspace command to write expanded packet files.
- `workflows/16-final-copy-expansion.md`: rules for using expanded copy.
- Tests for pure expansion and workspace output.

## Testing

Tests verify that expanded copy:

- Preserves schema version and section IDs.
- Replaces scaffold wording with review-ready copy.
- Updates machine-readable sections to match visible sections.
- Leaves reference and image structures intact.
- Writes `page-packet.expanded.json` and `page-packet.expanded.md`.
