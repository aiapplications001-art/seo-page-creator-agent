# Antigravity Adapter Design

## Goal

Add an Antigravity adapter that follows the same SEO Page Creator rules as the Codex and Gemini adapters, with extra emphasis on autonomous batch execution safety.

The adapter must prevent the failure mode where an agent creates assets, copy, or page packets for many pages at once. In batch mode, Antigravity must complete one page end to end before selecting or touching the next page.

## Scope

Add a new adapter instruction file:

```text
adapters/antigravity/AGENTS.md
```

Update adapter documentation tests so Antigravity stays aligned with the V2.1 content-quality workflow and the stricter batch execution contract.

No live publishing adapter, network integration, credential handling, or real page generation is added in this slice.

## Source Of Truth

The Antigravity adapter should tell the host agent to use these project files as source of truth:

- `AGENT.md`
- `README.md`
- `workflows/19-v2-content-quality.md`
- `adapters/codex/skills/seo-page-creator/SKILL.md`
- `adapters/gemini-cli/GEMINI.md`

The Antigravity file should not invent a separate workflow. It should translate the existing workflow into Antigravity-friendly execution rules.

## Single Page Workflow

For one SEO page, Antigravity must:

1. Run or follow `seo-agent v2 prepare-page`.
2. Fill the V2.1 research, human editorial, citation, and depth artifacts.
3. Run `validate-human`, `validate-gates`, and `validate-depth`.
4. Repair failures before writing final copy.
5. Generate final page packet only after hard gates pass.
6. Generate image manifest only after content and depth validation pass.
7. Return the editor-facing final page packet, editorial QA report, and image manifest.

The adapter must keep internal ledgers and debug artifacts available but not make them the default editor-facing output.

## Batch Execution Contract

For multiple live pages, Antigravity must run a strict serial loop:

1. Confirm the target project repo is clean before starting.
2. Identify or create the cluster plan during preflight only.
3. Do not create page packets, final copy, images, or image manifests during cluster identification.
4. Select exactly one page opportunity.
5. Create or respect `.seo-agent-workspace/batch-runs/<run-id>/current-page.lock`.
6. Complete full V2.1 research, packet, copy, image manifest, QA, repair, commit, push/deploy, and HTTP 200 verification for that page.
7. Append progress to `.seo-agent-workspace/batch-runs/<run-id>/run-ledger.jsonl`.
8. Clear `current-page.lock` only after the page is live, skipped, publish-failed, deploy-failed, or failed after repairs.
9. Only then select the next page.

If `current-page.lock` exists, Antigravity must not choose a new opportunity. It must inspect, resume, repair, or explicitly report the locked page state first.

## Hard Prohibitions

Antigravity must not:

- Batch by workflow stage.
- Create images for future pages while the current page is still in progress.
- Write final copy for future pages while the current page is still in progress.
- Create page packets or image manifests for future pages during the active page transaction.
- Skip `validate-depth` before final copy, images, commit, or publish.
- Override hard gates.
- Continue after finding `current-page.lock` by selecting a different page.

## Failure And Repair

Each page gets up to three total repair attempts. If the page still fails:

- Mark that page failed or skipped with the reason.
- Keep artifacts and recommended fixes.
- Clear or terminally resolve the page lock only when state is recorded.
- Continue to replacement opportunities until the requested live count is reached or the max attempt limit is reached.

At the end of a batch, Antigravity must report how many pages went live, how many failed, and why.

## Testing

Update `tests/v2-docs-adapters.test.ts` to assert that `adapters/antigravity/AGENTS.md` exists and includes:

- `V2.1`
- `validate-human`
- `validate-gates`
- `validate-depth`
- `final page packet, editorial QA report, and image manifest`
- `current-page.lock`
- `run-ledger.jsonl`
- `Do not batch by workflow stage`
- no future-page copy/images/assets
- one commit/push/deploy before starting the next page

Run:

```bash
npm test -- tests/v2-docs-adapters.test.ts
npm run validate
```

## Non-Goals

- No real Antigravity plugin packaging.
- No remote publishing implementation.
- No changes to the existing Gemini command behavior.
- No git commit or push from this local replica unless the user explicitly requests it.
