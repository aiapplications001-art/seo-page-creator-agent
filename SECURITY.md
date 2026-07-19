# Security Policy

## Supported Versions

The `main` branch is the active development line for security fixes.

## Reporting A Vulnerability

Please report security issues privately instead of opening a public issue.

Use GitHub's private vulnerability reporting when available for this repository. If that is not available, contact the repository owner through GitHub and include:

- A clear description of the issue.
- Steps to reproduce.
- Impact and affected files or commands.
- Whether credentials, OAuth data, workspace artifacts, or generated page packets may be exposed.

## Sensitive Data

Do not commit:

- Google OAuth credentials or tokens.
- Search Console, Keyword Planner, CSV, XLSX, or client exports.
- `.seo-agent-workspace/` contents.
- Private company strategy, unpublished page packets, or source ledgers.
- API keys, CMS tokens, Vercel tokens, email credentials, or deployment secrets.

## Security Expectations

Changes that touch credentials, Google integrations, file imports, publishing, batch execution, or generated artifacts should preserve least-privilege behavior and avoid write access unless explicitly required by a documented workflow.
