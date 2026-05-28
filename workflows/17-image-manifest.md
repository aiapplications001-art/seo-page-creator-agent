# Image Manifest Workflow

The image manifest is a companion artifact for one page packet. It tracks required image assets, SEO filenames, prompt briefs, licensing notes, and future generated file paths or URLs.

## Inputs

- Existing `page-packet.json`
- Existing `page-packet.expanded.json`, optionally
- Page packet image slots

## CLI Command

```bash
seo-agent images plan --cluster acne-treatment --page-id P1
seo-agent images plan --cluster acne-treatment --page-id P1 --expanded
```

Generated files:

```text
.seo-agent-workspace/page-packets/<category-slug>/<page-id>/image-manifest.json
.seo-agent-workspace/page-packets/<category-slug>/<page-id>/image-prompts.md
```

`image-prompts.md` is written only when ungenerated images exist.

## Rules

- Default image format is WebP.
- Use `IMG_OG` for the Open Graph image slot.
- Keep image metadata outside the page packet unless the page packet explicitly references the image slot.
- Mark licensing and rights status in the manifest.
- Use prompt briefs only for images that still need generation or fetching.
- Do not call an image generation API from this workflow.
- Do not use external brand logos, screenshots, or product visuals without explicit approval.

## Future Use

Image generation adapters can update `filePath`, `publicUrl`, `status`, and licensing fields in the manifest after assets are generated or approved.
