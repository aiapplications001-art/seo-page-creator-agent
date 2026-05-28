# Google Watcher Scheduler V1 Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add a GitHub Actions scheduler that runs the official Google guidance watcher every Tuesday morning and uploads reports as artifacts.

**Architecture:** Keep scheduling outside the app code in `.github/workflows/google-guidance-watcher.yml`. Add a lightweight test that validates the workflow schedule, manual dispatch, CLI command, and artifact upload configuration.

**Tech Stack:** GitHub Actions YAML, TypeScript Node test runner, existing CLI.

---

### Task 1: Workflow Contract Test

**Files:**
- Create: `tests/github-actions.test.ts`

- [x] **Step 1: Write failing test**

Test that `.github/workflows/google-guidance-watcher.yml` exists and includes the Tuesday schedule, manual dispatch, watcher command, and artifact upload paths.

- [x] **Step 2: Run tests to verify RED**

Run: `npm test`
Expected: FAIL because the workflow does not exist.

### Task 2: GitHub Actions Workflow

**Files:**
- Create: `.github/workflows/google-guidance-watcher.yml`

- [x] **Step 1: Add workflow**

Create a workflow with:
- `schedule` cron `30 3 * * 2`
- `workflow_dispatch`
- Node setup
- `npm ci`
- `npm run build`
- `node dist/cli/index.js init`
- `node dist/cli/index.js watcher google-guidance`
- artifact upload for watcher reports/state

- [x] **Step 2: Run tests to verify GREEN**

Run: `npm test`
Expected: PASS.

### Task 3: Docs

**Files:**
- Modify: `README.md`
- Modify: `workflows/18-google-guidance-watcher.md`

- [x] **Step 1: Document scheduler**

Add GitHub Actions scheduler notes and artifact behavior.

- [x] **Step 2: Validate**

Run: `npm run validate`
Expected: TypeScript build and tests pass.

### Task 4: Commit And Deploy

**Files:**
- All files above.

- [x] **Step 1: Inspect diff**

Run: `git diff --stat`
Expected: Only scheduler workflow, test, plan/spec, and docs changed.

- [x] **Step 2: Commit as aiapplications001-art**

Run: `git commit --author="aiapplications001-art <aiapplications001-art@users.noreply.github.com>" -m "Add Google guidance watcher scheduler"`

- [ ] **Step 3: Push branch and fast-forward main**

Run: `git push -u origin codex/google-watcher-scheduler-v1`
Run: `git push origin codex/google-watcher-scheduler-v1:main`

- [ ] **Step 4: Verify remote**

Run: `git ls-remote origin refs/heads/main refs/heads/codex/google-watcher-scheduler-v1`
Expected: Both point to the same commit.
