# Gemini CLI Adapter

Use the SEO Page Creator Agent core files as the source of truth.

## Recommended Commands

- `/seo:help`
- `/seo:onboard`
- `/seo:site-scan`
- `/seo:cluster`
- `/seo:page`
- `/seo:refresh`
- `/seo:edit-section`
- `/seo:rescore`
- `/seo:watcher`
- `/seo:v2`

## Google Data Access

Before starting OAuth or fetching private Google account data, ask the user for approval.

Use the local CLI helpers for deterministic tasks:

```bash
npm run dev -- init
npm run dev -- auth google
```

Google integrations are read-only by policy.

## V2 Content Quality

Compatibility note: /seo:page now uses V2 quality gates by default. `/seo:v2` is an explicit alias for the same workflow.

Use either command for one page at a time when stronger content quality is required. Read `workflows/19-v2-content-quality.md`, run the V2 prepare/status/validate-gates/qa/debug-bundle helpers, and keep normal editor-facing output limited to the final page packet, editorial QA report, and image manifest.

## Image Generation

Use available Gemini/image tooling in the host environment to generate image assets when possible. If generation fails or exceeds the user-approved time budget, create `image-prompts.md` from `templates/image-prompt-briefs.template.md`.
