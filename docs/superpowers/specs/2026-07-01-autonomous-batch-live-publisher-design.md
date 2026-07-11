# Autonomous Batch Live Publisher Design

## Purpose

Enable a user to request a target number of live SEO pages and have the agent autonomously identify the right cluster, then produce, publish, and verify pages by repeating the existing one-page V2.1 workflow as a strict serial page transaction.

The intended user command is:

```bash
seo-agent batch live --count <target-live-count> [--cluster <cluster-slug>]
```

The batch runner should not weaken the one-page quality workflow. It should automate repeated execution of that workflow.

## Core Contract

- The target count means successfully live pages, not merely attempted pages.
- The maximum total attempts is `targetLiveCount * 2`.
- The runner stops when either `liveCount === targetLiveCount` or `totalAttemptsUsed === maxTotalAttempts`.
- Work runs directly on the `main` branch.
- The project repository must have a clean working tree before the batch starts and before every page attempt.
- Each successful page gets exactly one commit.
- The runner pushes and deploys after every successful page commit.
- Live verification for v1 is HTTP `200 OK` from the production URL.
- Failed pages are skipped after three total repair attempts, preserved in the failure backlog, and replaced by new opportunities until the target or attempt limit is reached.
- Cluster identification is a preflight step. It may identify an existing cluster or create a cluster plan, but it must not create page packets, page copy, images, or future-page assets.
- The runner batches by completed live page, not by workflow stage.
- The page worker must complete one page end to end before the next opportunity is selected.
- Future-page research, packets, copy, and images are forbidden until the current page is live or skipped.
- Each page must meet the V2.1 research depth contract before final copy and images are treated as usable: at least 10 meaningful SERP sources, 7 social/video attempts, 5 reviewed social/video assets, claim-specific citations, and a passing `validate-depth` result.

## Lifecycle

1. Preflight
   - Confirm the project repo is on `main`.
   - Confirm the working tree is clean.
   - Confirm the publish playbook exists and is valid.
   - Identify the right cluster from project/site/category/keyword context.
   - If a suitable cluster plan already exists, select it and record why.
   - If no suitable cluster exists, create or discover the cluster plan and record why.
   - Do not create page packets, page copy, images, or future-page assets during cluster identification.
   - Compute `maxTotalAttempts = targetLiveCount * 2`.

2. Opportunity discovery
   - Read the existing cluster plan.
   - Run live SERP and keyword research.
   - Generate additional page opportunities beyond the existing cluster plan when needed.
   - Score, dedupe, and avoid obvious cannibalization.
   - Keep generating replacement opportunities until the live target or max attempts is reached.

3. Page production
   - Select the next best opportunity.
   - Run the full V2.1 workflow for one SEO page.
   - Use the `category-manager-with-editorial-empathy` voice.
   - Do deep SERP and social/video research only for the current page.
   - Require at least 10 meaningful SERP sources, 7 attempted social/video assets, 5 reviewed social/video assets, and claim-specific citations.
   - Fill all internal artifacts.
   - Run `validate-human`.
   - Run `validate-gates`.
   - Run `validate-depth`.
   - Repair failures up to three total attempts.
   - Produce the final page packet, editorial QA report, and image manifest.
   - Do not create images, copy, or page packets for any future page in this step.

4. Publishing
   - Integrate the page into the target project using that project's existing per-page process.
   - Run the project validation commands.
   - Commit only that page.
   - Push `main` immediately.
   - Wait for deployment.
   - Verify the production URL returns HTTP `200 OK`.
   - Mark the page live.

5. Failure handling
   - If the page fails after three repair attempts, mark it `failed_after_3_repairs`.
   - Preserve artifacts and failure reasons.
   - Do not commit or publish that page.
   - Generate or select a replacement opportunity and continue.

6. Final report
   - List live pages with URLs, commit SHAs, artifact paths, and verification status.
   - List failed attempts with failed stage, repair attempts used, failure reason, recommended fix, and retryability.
   - If the attempt limit is reached before the target live count, mark the run `partial_complete_attempt_limit_reached`.

## Components

### Batch Live Runner

Owns the full batch loop: target live count, max attempts, cluster preflight, page queue, retries, skip/replace behavior, push/deploy cadence, and final report. The runner must enforce serial page transactions by calling the page worker for one opportunity, then the publisher for that same page, before requesting the next opportunity.

### Opportunity Engine

Reads the cluster plan, performs live SERP and keyword research, creates additional opportunities, scores candidates, dedupes against existing site inventory and current batch attempts, and feeds the runner until the batch ends.

Generated opportunities must record:

- Search intent.
- SERP or keyword evidence.
- Competitor or content gap.
- Target audience.
- Proposed slug.
- Canonical decision.
- Why the page is not duplicate or thin.
- Opportunity confidence: `strong`, `medium`, or `exploratory`.

The requested count is mandatory, so weak discovery does not stop the run. If fewer strong opportunities exist, the engine generates medium or exploratory opportunities and still runs them through the full gates.

### Cluster Planner

Runs once in preflight when `--cluster` is omitted. It identifies the best existing cluster from available project context or creates/discovers a new cluster plan. It returns the selected cluster slug, source, mode, and rationale.

The cluster planner is not allowed to start page production. It must not create page packets, final copy, images, image manifests, or future-page assets.

### Page Worker

Runs the established one-page process:

- Full V2.1 workflow.
- Deep SERP and social/video research.
- Internal artifact completion.
- Human editorial validation.
- Gate validation.
- Depth validation.
- Three total repair attempts.
- Final page packet.
- Editorial QA report.
- Image manifest.

The page worker does not publish. It returns either a publishable page package or a structured page-level failure.

The page worker must obey the serial transaction contract:

- Work only on the current page opportunity.
- Do not prepare assets, copy, images, or manifests for later pages.
- Complete research before final copy.
- Complete `research-extraction-matrix.json`, `competitor-depth-delta.json`, `audience-pain-point-ledger.json`, `pre-draft-synthesis-brief.json`, and `depth-score.json` before final copy.
- Pass `validate-depth` before final copy, images, commit, or publish.
- Treat thin research as a page-level failure that can be repaired up to three total attempts.
- For depth repairs, add new research before rewriting prose.
- Return control to the runner after the current page is ready or skipped.

### Project Publish Playbook

Defines how a completed page becomes live for a specific company/project. The playbook keeps the SEO runner portable and prevents hard-coding a CMS or repo layout.

Example path:

```text
.seo-agent-workspace/projects/<project-id>/publish-playbook.json
```

Example:

```json
{
  "schemaVersion": "publish-playbook.v1",
  "projectId": "my-vercel-site",
  "adapter": "git_push_deploy",
  "repoPath": "/path/to/project",
  "branch": "main",
  "requiresCleanWorkingTree": true,
  "contentIntegration": {
    "mode": "project_existing_page_process",
    "instructions": "Use the same process used for an individual SEO page."
  },
  "validationCommands": [
    "npm run build"
  ],
  "commit": {
    "strategy": "one_commit_per_page",
    "messageTemplate": "seo: publish {pageTitle}"
  },
  "deploy": {
    "trigger": "git_push",
    "pushAfterEachCommit": true
  },
  "liveVerification": {
    "mode": "http_200",
    "timeoutMinutes": 10,
    "retryEverySeconds": 30
  }
}
```

Initial adapter styles:

- `git_push_deploy`: for Vercel-style repos where pushing `main` deploys production.
- `custom_script`: for projects with an existing page publishing script.

### Batch State And Report

Stores durable state so long runs can be resumed and audited.

Suggested path:

```text
.seo-agent-workspace/batch-runs/<run-id>/
  batch-run.json
  run-ledger.jsonl
  current-page.lock
  batch-report.md
  opportunities.json
  failed-attempts.json
```

`current-page.lock` is created before the page worker starts and cleared only after that page is recorded as live, publish-failed, deploy-failed, or failed-after-repairs in `batch-run.json`. If the lock exists at the start of a new attempt, the runner must stop instead of selecting another page. `run-ledger.jsonl` records `run_started`, `page_attempt_started`, `page_attempt_finished`, and `run_completed` events so interrupted sessions are auditable across process boundaries.

Run state example:

```json
{
  "schemaVersion": "batch-live-run.v1",
  "runId": "2026-07-01-acne-treatment-live-50",
  "clusterSlug": "acne-treatment",
  "clusterSelection": {
    "mode": "auto_identified",
    "clusterSlug": "acne-treatment",
    "source": "existing_cluster_plan",
    "rationale": "The project context and existing cluster plan both match acne treatment pages."
  },
  "targetLiveCount": 50,
  "maxTotalAttempts": 100,
  "totalAttemptsUsed": 17,
  "liveCount": 12,
  "status": "running",
  "branch": "main",
  "requiresCleanWorkingTree": true,
  "repairAttemptsPerPage": 3,
  "workflowMode": "serial_page_transaction",
  "liveVerification": {
    "mode": "http_200"
  },
  "pages": []
}
```

Live page attempt example:

```json
{
  "attemptNumber": 7,
  "opportunityId": "P7",
  "status": "live",
  "pageTitle": "Best Acne Treatment Options for Sensitive Skin",
  "slug": "acne-treatment-sensitive-skin",
  "commitSha": "abc123",
  "productionUrl": "https://example.com/acne-treatment-sensitive-skin",
  "httpStatus": 200,
  "artifacts": {
    "pagePacket": "...",
    "qaReport": "...",
    "imageManifest": "..."
  },
  "repairAttemptsUsed": 1,
  "failureReason": null
}
```

Failed page attempt example:

```json
{
  "attemptNumber": 11,
  "status": "failed_after_3_repairs",
  "failedStage": "validate-gates",
  "failureReason": "Citation set still has unsupported high-strength claims.",
  "repairAttemptsUsed": 3,
  "recommendedFix": "Downgrade claims or add approved source URLs.",
  "retryable": true
}
```

## Failure Handling

### Hard Stop Failures

These stop the whole batch immediately:

- Project repo has uncommitted changes.
- Project repo is not on `main`.
- Publish playbook is missing or invalid.
- Git push fails because remote `main` moved.
- Validation command cannot run at all.
- Deployment provider is repeatedly unreachable.
- Credentials or required environment variables are missing.

### Page-Level Failures

These skip the page after three total repair attempts and continue:

- `validate-human` still fails.
- `validate-gates` still fails.
- `validate-depth` still fails.
- Editorial QA still fails.
- Image manifest cannot become publish-ready.
- Page integration creates a route or slug conflict.
- Production URL never returns HTTP `200 OK`.

Each skipped page records `failedStage`, `failureReason`, `repairAttemptsUsed`, `artifactPaths`, `recommendedFix`, and `retryable`.

### Deployment Verification Failure

If the page was committed and pushed but the production URL does not return `200 OK`, mark the attempt `deploy_verification_failed`.

V1 does not attempt automatic rollback. It preserves the commit SHA and recommends a manual fix or revert.

## Testing Strategy

Implementation starts with mocked tests for:

- Opportunity generation continues until target live count or max attempts.
- Max attempts equals `targetLiveCount * 2`.
- Page failures are skipped after three repairs.
- Replacement opportunities are generated after failures.
- Dirty working tree blocks the batch before start.
- Dirty working tree blocks the next page.
- One commit is created per successful page.
- Push/deploy is invoked after each successful commit.
- HTTP `200 OK` marks a page live.
- Final report includes live pages, failed attempts, commit SHAs, URLs, and recommended fixes.

Integration tests can then cover a fake project playbook with a temporary git repo and local HTTP verification endpoint.

## Implementation Boundary

The implementation plan must start by mapping the existing single-page flow into a callable `PageWorker` interface. It must also define how host-agent research work is invoked from a CLI runner without weakening the current V2.1 quality contract.
