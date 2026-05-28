# Cluster Strategy Workflow

Cluster strategy is created after company setup, product/category profiling, and site inventory. It decides which SEO pages should exist for one selected product/category before the agent drafts any page packet.

## Inputs

- Company name
- Product/category name
- Target market, default India
- Site inventory metadata
- Optional seed keywords
- Optional Search Console or Keyword Planner exports
- Optional competitor/reference URLs

## CLI Command

```bash
seo-agent cluster plan --category "Acne Treatment" --company "ClearNest" --market India --keywords "acne treatment,acne marks treatment"
```

Generated files:

```text
.seo-agent-workspace/clusters/<category-slug>/strategy.json
.seo-agent-workspace/clusters/<category-slug>/strategy.md
```

## Strategy Categories

The strategy may classify opportunities as:

- `first_organic_wins`: Long-tail or specific pages expected to be easier early wins.
- `highest_conversion`: Product/category pages closest to commercial action.
- `startup_conversion`: Needed conversion page where the existing site has little evidence.
- `low_competition`: Narrow, specific search intent with likely lower competition.
- `high_competition`: Important head terms or comparison spaces that may need stronger authority.
- `competitor_category`: Pages involving alternatives, comparisons, or competitor framing.

These labels are advisory. They help the editor choose which one page packet to generate next.

## Source-Backed Inference Notes

Critical recommendations should include evidence strength:

- `high`: Directly supported by matching site metadata or explicit user input.
- `medium`: Supported by partial metadata, seed keywords, or common SEO structure.
- `low`: Agent inference because the site has weak or missing evidence.

Use evidence strength for strategic choices such as primary CTA direction, existing URL recommendation, and page structure.

## Refresh Rules

- Create a cluster strategy once per product/category.
- Refresh it only when the user asks.
- If the user says something should be saved for the cluster, add it to the cluster strategy document.
- Live SERP competitor/reference URLs may be used temporarily for the current strategy.
- Do not save live SERP URLs to the Reference Library unless the user explicitly asks.

## Agent Rules

- Recommend a cluster strategy before drafting a page packet.
- Generate one page packet at a time.
- Ask the user which page opportunity should be generated next.
- Recommend updating an existing URL when a relevant URL already exists.
- Include cross-category internal linking suggestions when useful.
- Keep quality score advisory, and recalculate it only when the user asks for a re-score.
- Competitor names, third-party logos, product screenshots, and external brand visuals still require explicit approval before page packet inclusion.
