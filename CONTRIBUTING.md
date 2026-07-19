# Contributing

Thanks for improving SEO Page Creator Agent.

## Local Setup

```bash
git clone https://github.com/aiapplications001-art/seo-page-creator-agent.git
cd seo-page-creator-agent
npm ci
npm run validate
```

Use Node.js 22 or later.

## Development Workflow

1. Create a branch for your change.
2. Keep changes focused on one feature, fix, workflow gate, adapter, or documentation area.
3. Run `npm run validate` before opening a pull request.
4. Update tests when changing validators, schemas, CLI behavior, workflow contracts, or adapter requirements.
5. Update README or workflow docs when changing user-facing behavior.

## Content-Workflow Changes

This project uses strict workflow contracts. When changing a gate or adapter, keep these in sync:

- TypeScript validators in `src/lib/`
- JSON schemas in `schemas/`
- Tests in `tests/`
- Workflow docs in `workflows/`
- Adapter instructions in `adapters/`
- README summaries when behavior changes

Do not loosen evidence, claim-safety, anti-generic, uniqueness, or batch-isolation checks without adding a clear rationale and tests.

## Pull Request Checklist

- `npm run validate` passes.
- New behavior has tests.
- Docs and adapters are updated when relevant.
- No private workspace data from `.seo-agent-workspace/` is committed.
- No Google credentials, API keys, source exports, client data, or unpublished page packets are committed.
