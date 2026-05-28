# SEO Page Creator Agent

A portable open-source agent framework for creating company-specific SEO pages that are structured, source-backed, design-aware, and ready for editorial review.

The agent produces publish-ready page packets for guide/blog pages, comparison pages, and product category pages. It supports company onboarding, product/category cluster strategy, Google read-only data inputs, image workflows, and CMS-friendly Markdown plus JSON outputs.

## V1 Scope

- Company and product/category SEO profiling
- Sitemap/site inventory support
- Google Search Console OAuth read-only integration
- Google Ads Keyword Planner data access through a read-only application policy
- CSV/XLSX fallback imports
- Sitemap fetch and URL metadata extraction
- Cluster strategy and page packet workflows
- Image generation workflow specs and prompt fallback
- TypeScript CLI helpers
- Gemini/Codex adapter-ready structure

## Out Of Scope For V1

- CMS publishing
- Direct live page updates
- Analytics/event tracking
- Google account write actions
- Paid ad campaign management
- Batch page generation

## Quick Start

```bash
npm install
npm run build
seo-agent init
```

For local development before publishing/installing the CLI:

```bash
npm run dev -- init
npm run dev -- help
```

Useful CLI helpers:

```bash
seo-agent sitemap fetch https://example.com/sitemap.xml
seo-agent metadata extract --limit 500
```

## Workspace

Private company data is stored outside the public repo in:

```text
.seo-agent-workspace/
```

This folder is ignored by git by default.

## License

Apache-2.0
