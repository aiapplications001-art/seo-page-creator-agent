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

## V2 Content Quality

V2 adds mandatory research, narrative, citation, QA, repair, and image-readiness gates before a final page packet is treated as ready for editorial review.

Normal editor-facing output is the final page packet, editorial QA report, and image manifest. Internal research ledgers, source notes, page state, version history, and debug bundles stay available for troubleshooting without cluttering the editor review flow.

Useful V2 commands:

```bash
seo-agent v2 prepare-page --cluster acne-treatment --page-id P1 --page-type product_category
seo-agent v2 status --cluster acne-treatment --page-id P1
seo-agent v2 validate-gates --cluster acne-treatment --page-id P1
seo-agent v2 qa --cluster acne-treatment --page-id P1
seo-agent v2 debug-bundle --cluster acne-treatment --page-id P1
seo-agent images plan --cluster acne-treatment --page-id P1
```

Read the full flow in `workflows/19-v2-content-quality.md`.

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
seo-agent cluster plan --category "Acne Treatment" --company "ClearNest" --market India --keywords "acne treatment,acne marks treatment"
seo-agent prewriting plan --cluster acne-treatment --page-id P1 --audience "Indian adults with visible acne" --tone "professional compact"
seo-agent page-packet build --cluster acne-treatment --page-id P1 --author "ClearNest Editorial Team"
seo-agent final-copy expand --cluster acne-treatment --page-id P1
seo-agent images plan --cluster acne-treatment --page-id P1
seo-agent watcher google-guidance
seo-agent v2 prepare-page --cluster acne-treatment --page-id P1 --page-type product_category
seo-agent v2 validate-gates --cluster acne-treatment --page-id P1
seo-agent v2 qa --cluster acne-treatment --page-id P1
seo-agent v2 debug-bundle --cluster acne-treatment --page-id P1
```

The Google guidance watcher is also scheduled through GitHub Actions every Tuesday morning India time. Reports are uploaded as workflow artifacts rather than committed to the repo.

Cluster strategy outputs are written to:

```text
.seo-agent-workspace/clusters/<category-slug>/strategy.json
.seo-agent-workspace/clusters/<category-slug>/strategy.md
.seo-agent-workspace/clusters/<category-slug>/prewriting/<page-id>/strategy.json
.seo-agent-workspace/clusters/<category-slug>/prewriting/<page-id>/strategy.md
.seo-agent-workspace/page-packets/<category-slug>/<page-id>/page-packet.json
.seo-agent-workspace/page-packets/<category-slug>/<page-id>/page-packet.md
.seo-agent-workspace/page-packets/<category-slug>/<page-id>/page-packet.expanded.json
.seo-agent-workspace/page-packets/<category-slug>/<page-id>/page-packet.expanded.md
.seo-agent-workspace/page-packets/<category-slug>/<page-id>/image-manifest.json
.seo-agent-workspace/page-packets/<category-slug>/<page-id>/image-prompts.md
.seo-agent-workspace/v2/page-packets/<category-slug>/<page-id>/page-state.json
.seo-agent-workspace/v2/page-packets/<category-slug>/<page-id>/serp-research-ledger.json
.seo-agent-workspace/v2/page-packets/<category-slug>/<page-id>/social-video-research.json
.seo-agent-workspace/v2/page-packets/<category-slug>/<page-id>/audience-definition.json
.seo-agent-workspace/v2/page-packets/<category-slug>/<page-id>/narrative-brief.json
.seo-agent-workspace/v2/page-packets/<category-slug>/<page-id>/citation-set.json
.seo-agent-workspace/v2/page-packets/<category-slug>/<page-id>/editorial-qa-report.md
.seo-agent-workspace/v2/page-packets/<category-slug>/<page-id>/debug-bundle.md
.seo-agent-workspace/watcher-reports/google-guidance-YYYY-MM-DD.md
.seo-agent-workspace/watcher-state/google-guidance-state.json
```

## Workspace

Private company data is stored outside the public repo in:

```text
.seo-agent-workspace/
```

This folder is ignored by git by default.

## License

Apache-2.0
