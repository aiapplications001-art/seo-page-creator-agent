---
name: seo-page-creator
description: Create brand-aware, E-E-A-T-oriented SEO page packets with company onboarding, product/category cluster strategy, Google read-only data inputs, image workflows, and CMS-friendly Markdown/JSON outputs.
---

# SEO Page Creator

Use this skill when the user wants to create or refresh SEO pages for a specific company or product/category.

## Core Workflow

1. Read `AGENT.md`.
2. Load the relevant workflow file:
   - Google OAuth: `workflows/10-google-oauth-readonly.md`
   - Image generation: `workflows/11-image-generation.md`
   - V2 Content Quality: `workflows/19-v2-content-quality.md`
3. Apply relevant policies:
   - `policies/google-data-access-policy.md`
   - `policies/image-generation-policy.md`
4. Use CLI helpers for deterministic tasks when available.

## V2 Content Quality

Use V2 for stronger page-copy quality when the user wants one carefully researched page packet. Start with:

```bash
seo-agent v2 prepare-page --cluster <cluster-slug> --page-id <page-id> --page-type product_category
seo-agent v2 validate-gates --cluster <cluster-slug> --page-id <page-id>
seo-agent v2 qa --cluster <cluster-slug> --page-id <page-id>
seo-agent v2 debug-bundle --cluster <cluster-slug> --page-id <page-id>
```

The host agent performs live research and fills the SERP, social/video, audience, narrative, and citation artifacts. The final page packet should not be generated when hard gates fail. Use `debug-bundle` only when the user asks to inspect troubleshooting artifacts.

## Hard Rules

- Generate one page packet at a time.
- Use Google data read-only.
- Ask before OAuth or private account fetches.
- Require approval for competitor names and third-party brand visuals.
- Do not publish to CMS in V1.
- Do not override V2 hard gates.
