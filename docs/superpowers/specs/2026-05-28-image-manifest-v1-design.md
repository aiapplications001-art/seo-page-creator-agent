# Image Manifest V1 Design

## Scope

Build a deterministic image asset manifest and prompt-brief companion for one page packet. This slice does not call an image generation API. It organizes image slots, SEO filenames, licensing notes, and generation prompts so image generation or manual design can happen cleanly later.

## Approach

The image planner reads `page-packet.json` or `page-packet.expanded.json`, maps each image slot into an image asset record, and writes an image manifest under the same page packet folder. It writes `image-prompts.md` only when at least one image is not generated.

## Key Decisions

- Use `IMG_OG` as the reserved OG image ID.
- Default format is WebP.
- Recommended filenames are SEO-normalized from page slug and image purpose.
- Manifest includes licensing/review status directly.
- Prompt briefs are a separate companion artifact, not embedded in the page packet.
- Generated asset paths and URLs can be added later without changing page-packet structure.

## Files

- `src/lib/image-manifest.ts`: pure image manifest builder and prompt renderer.
- `src/cli/images.ts`: workspace command for image planning.
- `schemas/image-manifest.schema.json`: public manifest contract.
- `workflows/17-image-manifest.md`: image planning workflow.
- Tests for pure image manifest output and workspace file writing.
