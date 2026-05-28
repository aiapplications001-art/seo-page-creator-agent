# Google Guidance Watcher Workflow

The Google guidance watcher checks official Google Search guidance sources and writes a weekly Markdown report.

## Schedule

Default schedule: Tuesday morning.

The CLI runs on demand. A scheduler such as cron, GitHub Actions, or a host automation can call it weekly.

The public repo includes a GitHub Actions scheduler at:

```text
.github/workflows/google-guidance-watcher.yml
```

It runs every Tuesday at `03:30 UTC`, which is Tuesday morning in India, and can also be started manually from GitHub Actions.

## CLI Command

```bash
seo-agent watcher google-guidance
seo-agent watcher google-guidance --date 2026-05-28
```

Generated files:

```text
.seo-agent-workspace/watcher-reports/google-guidance-YYYY-MM-DD.md
.seo-agent-workspace/watcher-state/google-guidance-state.json
```

In GitHub Actions, these files are uploaded as a `google-guidance-watcher` artifact. The workflow does not commit generated reports back into the repository.

## Official Sources

V1 uses official Google sources only:

- Google Search documentation updates
- Google Search Essentials
- Helpful, reliable, people-first content
- Google Search core updates
- AI features and website guidance

## Report Rules

- Always write a report, even when no meaningful changes are found.
- Group changes by urgency.
- Suggest cluster or page packet review when urgency is high.
- Do not refresh a cluster unless the user asks.
- Do not update page packets automatically.
- Do not use non-official SEO commentary in this watcher.

## Urgency Signals

High urgency can be triggered by changes involving:

- AI features
- Structured data
- Core updates
- Helpful or people-first content

Medium and low urgency changes should be reported, but refresh actions remain user-controlled.
