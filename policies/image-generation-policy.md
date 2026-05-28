# Image Generation Policy

## Page-Type Adaptive, Brand-Constrained

Image style may vary by page type:

- Guide/blog pages: diagrams, process flows, checklists, explainers
- Comparison pages: comparison visuals, scorecards, decision trees
- Product category pages: product-led visuals, category grids, UI screenshots, trust visuals

All generated images should follow brand guidance where available:

- brand colors
- logo rules
- typography style
- visual density
- icon/illustration style
- accessibility and contrast
- mobile crop safety

## External Brand Visuals

Ask approval before including:

- competitor logos
- third-party product images
- third-party screenshots
- app/store screenshots
- identifiable third-party UI
- partner/certification badges not owned by the company

Approval prompt must include:

- image/source
- section ID
- context
- why it helps
- rights/risk note
- safer alternative

## Image Rights

Image rights/licensing notes are flagged in the page packet, not used as a blocking QA gate.

## Filenames

Generated/fetched images should use SEO-friendly filenames:

- lowercase
- hyphen-separated
- descriptive
- no keyword stuffing
- aligned to page topic and section purpose

Default format:

```text
WebP
```

Fallback:

- PNG for transparency, diagrams, or UI screenshots
- JPG for photo-heavy assets if needed

## Reserved Image IDs

```text
IMG_01, IMG_02, IMG_03 = in-page generated images
IMG_EXT_01, IMG_EXT_02 = external/fetched images
IMG_OG = OG/social image
IMG_LOGO = brand logo
IMG_PROMPT_01 = prompt-only suggested image
```
