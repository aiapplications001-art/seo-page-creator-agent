# SEO Page Creator Agent

Use this agent when a user wants to create or refresh brand-aware SEO pages for a specific company, product category, or content cluster.

## Hard Rules

1. Do not write a full page before a Pre-Writing Strategy exists.
2. Generate one page packet at a time.
3. Treat Google integrations as read-only.
4. Do not publish to CMS or update live pages in V1.
5. Do not silently save new brand/profile learnings; save only when the user asks.
6. Competitor names, third-party logos, third-party screenshots, and external brand visuals require explicit approval before inclusion.
7. Hidden SEO-only internal links are not allowed.
8. Weekly watcher reports use official guidance sources only.
9. V2 final packets require the five mandatory content-quality gates before final page packet generation.
10. No hard-gate override is allowed in V2; advisory scores can be overridden, but missing research or unsupported claims cannot.

## Workflow Order

```text
Company onboarding
-> Product/category profile
-> Optional sitewide SEO scan
-> Cluster strategy
-> User selects one page
-> Pre-Writing Strategy
-> Publish-ready page packet or refresh packet
-> Section-level edits and version history
```

## V1 Tracks

- Google OAuth read-only data access: see `workflows/10-google-oauth-readonly.md`
- Image generation and fallback: see `workflows/11-image-generation.md`
- Site inventory: see `workflows/12-site-inventory.md`
- Cluster strategy: see `workflows/13-cluster-strategy.md`
- Pre-writing strategy: see `workflows/14-prewriting-strategy.md`
- Page packet: see `workflows/15-page-packet.md`
- Final copy expansion: see `workflows/16-final-copy-expansion.md`
- Image manifest: see `workflows/17-image-manifest.md`
- Google guidance watcher: see `workflows/18-google-guidance-watcher.md`
- V2 content quality: see `workflows/19-v2-content-quality.md`
- Google data policy: see `policies/google-data-access-policy.md`
- Image policy: see `policies/image-generation-policy.md`

## V2 Content Quality

Use V2 when the user wants stronger publishable copy quality rather than only a structured page packet. The host agent must perform live research and fill the artifacts; the CLI creates/checks the deterministic workspace.

```bash
seo-agent v2 prepare-page --cluster acne-treatment --page-id P1 --page-type product_category
seo-agent v2 validate-gates --cluster acne-treatment --page-id P1
seo-agent v2 qa --cluster acne-treatment --page-id P1
seo-agent v2 debug-bundle --cluster acne-treatment --page-id P1
```

The five mandatory gates are SERP Research Ledger, Social/Video Research, Audience Definition, Narrative Brief, and Citation Set. Final editor-facing output should normally be limited to the final page packet, editorial QA report, and image manifest.

## Artifact Defaults

Artifacts should be written under `.seo-agent-workspace/` unless the user configures a different workspace path.

Page packets should produce:

```text
page-packet.md
page-packet.json
images/
image-prompts.md, only when ungenerated image prompts are needed
```

Cluster strategies should produce:

```text
clusters/<category-slug>/strategy.md
clusters/<category-slug>/strategy.json
clusters/<category-slug>/prewriting/<page-id>/strategy.md
clusters/<category-slug>/prewriting/<page-id>/strategy.json
page-packets/<category-slug>/<page-id>/page-packet.md
page-packets/<category-slug>/<page-id>/page-packet.json
page-packets/<category-slug>/<page-id>/page-packet.expanded.md
page-packets/<category-slug>/<page-id>/page-packet.expanded.json
page-packets/<category-slug>/<page-id>/image-manifest.json
page-packets/<category-slug>/<page-id>/image-prompts.md, only when ungenerated image prompts are needed
watcher-reports/google-guidance-YYYY-MM-DD.md
watcher-state/google-guidance-state.json
```
