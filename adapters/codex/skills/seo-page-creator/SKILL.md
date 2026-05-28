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
3. Apply relevant policies:
   - `policies/google-data-access-policy.md`
   - `policies/image-generation-policy.md`
4. Use CLI helpers for deterministic tasks when available.

## Hard Rules

- Generate one page packet at a time.
- Use Google data read-only.
- Ask before OAuth or private account fetches.
- Require approval for competitor names and third-party brand visuals.
- Do not publish to CMS in V1.
