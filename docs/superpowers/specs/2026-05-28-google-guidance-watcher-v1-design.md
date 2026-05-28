# Google Guidance Watcher V1 Design

## Scope

Build a weekly watcher helper that monitors official Google Search guidance sources and writes a Markdown report. This slice does not update pages, refresh clusters, or use non-official SEO commentary.

## Approach

The watcher has a pure analysis layer that compares current official-source snapshots against a prior state. It classifies changes by urgency and emits a report. The CLI fetches configured official URLs, writes watcher state, and writes a report even when no meaningful changes are found.

## Defaults

The default source list is official Google documentation only:

- Google Search documentation updates
- Search Essentials
- Helpful content guidance
- Core updates guidance
- AI optimization guidance

## Outputs

Reports are written to:

```text
.seo-agent-workspace/watcher-reports/google-guidance-YYYY-MM-DD.md
.seo-agent-workspace/watcher-state/google-guidance-state.json
```

## Rules

- Official Google sources only in V1.
- Weekly schedule target is Tuesday morning, but the CLI only runs on demand.
- Include a no meaningful changes found report.
- Group changes by urgency.
- Suggest possible page or cluster refresh, but do not perform it.
