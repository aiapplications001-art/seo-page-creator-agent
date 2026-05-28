# Google Data Access Policy

## Principle

Google integrations are read-only in V1. They improve strategy and scoring; they do not modify accounts.

## Allowed

- Read Search Console performance data.
- Read Search Console site/query/page data.
- Read Keyword Planner ideas and historical metrics.
- Import CSV/XLSX exports.
- Store OAuth tokens locally in ignored workspace credentials.
- Use aggregated data in cluster strategy and page refresh recommendations.

## Not Allowed

- Create or edit Google Ads campaigns.
- Change budgets, bids, targeting, or ads.
- Submit URL indexing/removal actions.
- Change Search Console settings.
- Write annotations back to Google tools.
- Store credentials in generated page packets.
- Commit credential files.

## Credential Storage

Default local path:

```text
.seo-agent-workspace/credentials/google-oauth.json
```

Environment variables may override local credentials for CI/server workflows.

Credential lookup order:

1. Environment variables
2. Local credential file
3. Ask user to run OAuth
4. Fall back to CSV/XLSX upload

## Public Repo Safety

The public repo may include:

- connector code
- setup docs
- `.env.example`
- schemas
- fallback import scripts

The public repo must not include:

- OAuth tokens
- client secrets
- refresh tokens
- real account IDs
- real client data exports
