# Google OAuth Read-Only Workflow

V1 supports direct Google data access through OAuth plus CSV/XLSX fallback. The integration exists to improve SEO research and opportunity scoring, not to modify Google accounts.

## Data Sources

### Google Search Console

Use for:

- query/page impressions
- clicks
- CTR
- average position
- existing-page refresh opportunities
- possible cannibalization signals
- sitewide opportunity scan

OAuth scope:

```text
https://www.googleapis.com/auth/webmasters.readonly
```

### Google Ads Keyword Planner

Use for:

- keyword ideas
- historical keyword metrics
- search volume ranges
- competition signals
- bid ranges as commercial intent proxy
- long-tail discovery

Google Ads API uses:

```text
https://www.googleapis.com/auth/adwords
```

This scope is broader than read-only, so V1 enforces read-only behavior at the application level. The agent and CLI must only call keyword planning and read/report endpoints.

## Setup Flow

1. User runs `seo-agent auth google`.
2. CLI creates a Google OAuth authorization URL.
3. User grants access through Google.
4. CLI stores tokens locally in `.seo-agent-workspace/credentials/`.
5. Agent uses stored tokens for read-only research.
6. If OAuth fails, user can upload CSV/XLSX exports.

## Fallback Flow

Accepted fallback files:

- Search Console CSV/XLSX export
- Keyword Planner CSV/XLSX export
- custom keyword sheet
- third-party keyword export

If direct access fails, the agent should continue with:

- uploaded files
- sitemap inventory
- live SERP research
- user-provided keyword seeds

## Agent Rules

- Ask before starting OAuth.
- Be transparent before fetching private account data.
- Never write to Google accounts.
- Never place tokens in page packets.
- Never commit credentials.
- Use Search Console as site opportunity data.
- Use Keyword Planner as keyword opportunity data.
- Use SERP research for organic competition and structure.

## Official References

- Google Search Console API authorization: https://developers.google.com/webmaster-tools/v1/how-tos/authorizing
- Google OAuth scopes: https://developers.google.com/identity/protocols/oauth2/scopes
- Google Ads API keyword planning: https://developers.google.cn/google-ads/api/docs/keyword-planning/overview
