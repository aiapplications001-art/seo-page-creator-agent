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

## Google Data Access

Before starting OAuth or fetching private Google account data, ask the user for approval.

Use the local CLI helpers for deterministic tasks:

```bash
npm run dev -- init
npm run dev -- auth google
```

Google integrations are read-only by policy.

## Image Generation

Use available Gemini/image tooling in the host environment to generate image assets when possible. If generation fails or exceeds the user-approved time budget, create `image-prompts.md` from `templates/image-prompt-briefs.template.md`.
