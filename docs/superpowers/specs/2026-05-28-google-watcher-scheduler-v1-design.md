# Google Watcher Scheduler V1 Design

## Scope

Add a GitHub Actions workflow that runs the Google guidance watcher weekly on Tuesday morning and lets maintainers run it manually. The workflow should not commit generated reports back to the repo; it should upload watcher outputs as artifacts.

## Approach

The workflow installs dependencies, builds the CLI, initializes the workspace, runs `seo-agent watcher google-guidance`, and uploads `.seo-agent-workspace/watcher-reports/` plus `.seo-agent-workspace/watcher-state/` as an artifact.

## Schedule

Use `cron: "30 3 * * 2"`, which is Tuesday 03:30 UTC. This is Tuesday morning in India.

## Rules

- Use official Google guidance watcher only.
- Do not publish or update page packets.
- Do not commit generated watcher reports from CI.
- Preserve manual `workflow_dispatch`.
