# Site Inventory Workflow

The site inventory is the company-level URL source of truth. It helps the agent find existing pages, avoid cannibalization, select design/content references, and decide whether to create a new page packet or refresh an existing page.

## Inputs

- XML sitemap URL
- sitemap index URL
- CMS URL export, later
- manual URL export, later

## CLI Commands

```bash
seo-agent sitemap fetch <sitemap-url>
seo-agent metadata extract --limit 500
```

## Sitemap Fetch

The CLI should:

1. Fetch the sitemap URL.
2. Support normal sitemap and sitemap index XML.
3. Extract URL and `lastmod` where available.
4. Skip low-value URLs.
5. Store inventory files in `.seo-agent-workspace/site-inventory/`.

Generated files:

```text
urls.json
skipped-urls.json
supporting-urls.json
metadata.json
```

## URL Prioritization

Prioritize:

1. Product/category pages
2. Product/service pages
3. Blog/guide pages
4. Comparison pages
5. FAQ/support pages
6. Pricing/trust pages
7. Landing/unknown pages

Skip obvious low-value SEO inventory URLs:

- login/account/signup
- cart/checkout/payment
- search pages
- tag/author/archive pages
- asset/media URLs
- policy pages

Policy/support URLs may still be stored as supporting URLs when useful for trust links.

## Metadata Extraction

For prioritized URLs, extract:

- title tag
- meta description
- canonical
- H1
- H2s
- schema types
- inferred page type
- classification reason

Fetch full page content only for selected relevant pages later.

## Agent Rules

- Use site inventory before suggesting a new page.
- Recommend refresh when an existing URL already matches the intent.
- Do not automatically change product/category mappings.
- Do not include support/policy URLs in page packets unless context requires them.
