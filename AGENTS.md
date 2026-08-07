# SEO Page Creator Agent

This repository contains SEO Page Creator Agent, an AI SEO workflow package for Codex, Claude, Gemini CLI, and agentic coding environments.

Use this project when the user wants to create, refresh, or QA:

- SEO landing pages
- programmatic SEO page packets
- product category pages
- comparison pages
- content briefs
- keyword cluster plans
- SERP-informed outlines
- local HTML previews
- editorial QA reports
- image manifests and image prompt plans

## Agent Operating Notes

- Generate one page packet at a time unless the user explicitly starts a batch workflow.
- Treat Google integrations as read-only.
- Do not publish to a CMS or push/deploy generated pages without explicit user approval.
- Prefer evidence-backed sections over generic AI copy.
- Keep source references, research ledgers, QA reports, and image manifests traceable to the final page packet.
- Use `AGENT.md` for the detailed workflow contract and hard rules.

## Useful Commands

```bash
npm install
npm run build
npm test
seo-agent init
seo-agent v2 prepare-page --cluster acne-treatment --page-id P1 --page-type product_category
seo-agent v2 validate-gates --cluster acne-treatment --page-id P1
seo-agent v2 qa --cluster acne-treatment --page-id P1
seo-agent images plan --cluster acne-treatment --page-id P1
```

