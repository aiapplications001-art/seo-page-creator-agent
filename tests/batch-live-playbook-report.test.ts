import assert from "node:assert/strict";
import { test } from "node:test";
import { validatePublishPlaybook } from "../src/lib/batch-live/playbook.js";
import {
  buildBatchLiveQualitySummary,
  renderBatchLiveCompletionEmail,
  renderBatchLiveReport
} from "../src/lib/batch-live/report.js";
import type { BatchLiveRun } from "../src/lib/batch-live/types.js";

test("validates a git push deploy playbook", () => {
  const playbook = validatePublishPlaybook({
    schemaVersion: "publish-playbook.v1",
    projectId: "my-vercel-site",
    adapter: "git_push_deploy",
    repoPath: "/tmp/my-vercel-site",
    branch: "main",
    requiresCleanWorkingTree: true,
    contentIntegration: {
      mode: "project_existing_page_process",
      instructions: "Use the same process used for one SEO page."
    },
    validationCommands: ["npm run build"],
    commit: {
      strategy: "one_commit_per_page",
      messageTemplate: "seo: publish {pageTitle}"
    },
    deploy: {
      trigger: "git_push",
      pushAfterEachCommit: true
    },
    liveVerification: {
      mode: "http_200",
      timeoutMinutes: 10,
      retryEverySeconds: 30
    }
  });

  assert.equal(playbook.adapter, "git_push_deploy");
  assert.equal(playbook.branch, "main");
  assert.deepEqual(playbook.validationCommands, ["npm run build"]);
});

test("rejects playbooks that cannot safely publish from main", () => {
  assert.throws(() => validatePublishPlaybook({
    schemaVersion: "publish-playbook.v1",
    projectId: "bad",
    adapter: "git_push_deploy",
    repoPath: "",
    branch: "main",
    requiresCleanWorkingTree: true,
    contentIntegration: {
      mode: "project_existing_page_process",
      instructions: "Use the same process used for one SEO page."
    },
    validationCommands: ["npm run build"],
    commit: {
      strategy: "one_commit_per_page",
      messageTemplate: "seo: publish {pageTitle}"
    },
    deploy: {
      trigger: "git_push",
      pushAfterEachCommit: true
    },
    liveVerification: {
      mode: "http_200",
      timeoutMinutes: 10,
      retryEverySeconds: 30
    }
  }), /repoPath is required/);

  assert.throws(() => validatePublishPlaybook({
    schemaVersion: "publish-playbook.v1",
    projectId: "bad",
    adapter: "git_push_deploy",
    repoPath: "/tmp/site",
    branch: "preview",
    requiresCleanWorkingTree: true,
    contentIntegration: {
      mode: "project_existing_page_process",
      instructions: "Use the same process used for one SEO page."
    },
    validationCommands: ["npm run build"],
    commit: {
      strategy: "one_commit_per_page",
      messageTemplate: "seo: publish {pageTitle}"
    },
    deploy: {
      trigger: "git_push",
      pushAfterEachCommit: true
    },
    liveVerification: {
      mode: "http_200",
      timeoutMinutes: 10,
      retryEverySeconds: 30
    }
  }), /branch must be main/);

  assert.throws(() => validatePublishPlaybook({
    schemaVersion: "publish-playbook.v1",
    projectId: "bad",
    adapter: "git_push_deploy",
    repoPath: "/tmp/site",
    branch: "main",
    requiresCleanWorkingTree: true,
    contentIntegration: {
      mode: "project_existing_page_process",
      instructions: "Use the same process used for one SEO page."
    },
    validationCommands: [],
    commit: {
      strategy: "one_commit_per_page",
      messageTemplate: "seo: publish {pageTitle}"
    },
    deploy: {
      trigger: "git_push",
      pushAfterEachCommit: true
    },
    liveVerification: {
      mode: "http_200",
      timeoutMinutes: 10,
      retryEverySeconds: 30
    }
  }), /validationCommands must include at least one command/);
});

test("renders a batch live report with live pages and actionable failures", () => {
  const run = {
    schemaVersion: "batch-live-run.v1",
    runId: "run-1",
    clusterSlug: "acne-treatment",
    targetLiveCount: 2,
    maxTotalAttempts: 4,
    totalAttemptsUsed: 3,
    liveCount: 2,
    status: "complete",
    branch: "main",
    requiresCleanWorkingTree: true,
    repairAttemptsPerPage: 3,
    liveVerification: { mode: "http_200" },
    pages: [
      {
        attemptNumber: 1,
        opportunityId: "P1",
        status: "failed_after_3_repairs",
        pageTitle: "Failed Page",
        slug: "failed-page",
        confidence: "medium",
        artifacts: {
          pagePacket: ".seo-agent-workspace/page-packets/failed/page-packet.json"
        },
        repairAttemptsUsed: 3,
        failedStage: "validate-gates",
        failureReason: "Citation set still has unsupported high-strength claims.",
        recommendedFix: "Downgrade claims or add approved source URLs.",
        retryable: true
      },
      {
        attemptNumber: 2,
        opportunityId: "P2",
        status: "live",
        pageTitle: "Live Page",
        slug: "live-page",
        confidence: "strong",
        commitSha: "abc123",
        productionUrl: "https://example.com/live-page",
        httpStatus: 200,
        artifacts: {
          pagePacket: ".seo-agent-workspace/page-packets/live/page-packet.json",
          qaReport: ".seo-agent-workspace/v2/page-packets/live/editorial-qa-report.md",
          imageManifest: ".seo-agent-workspace/page-packets/live/image-manifest.json"
        },
        repairAttemptsUsed: 1
      }
    ]
  } satisfies BatchLiveRun;
  const markdown = renderBatchLiveReport(run);
  const summary = buildBatchLiveQualitySummary(run);
  const email = renderBatchLiveCompletionEmail(run, { to: "owner@example.com" });

  assert.match(markdown, /# Batch Live Report: run-1/);
  assert.match(markdown, /Live: 2\/2/);
  assert.match(markdown, /Batch score: \d+\/100/);
  assert.match(markdown, /Batch confidence: medium/);
  assert.match(markdown, /Live Page/);
  assert.match(markdown, /abc123/);
  assert.match(markdown, /https:\/\/example.com\/live-page/);
  assert.match(markdown, /Failed Page/);
  assert.match(markdown, /validate-gates/);
  assert.match(markdown, /Downgrade claims or add approved source URLs/);
  assert.equal(summary.confidence, "medium");
  assert.equal(email.to, "owner@example.com");
  assert.match(email.subject, /\[SEO Batch QA\] acne-treatment: 2\/2 live, score \d+\/100, medium confidence/);
  assert.match(email.bodyMarkdown, /# SEO Batch QA Report/);
  assert.match(email.bodyMarkdown, /Batch score: \d+\/100/);
  assert.match(email.bodyMarkdown, /Confidence: medium/);
  assert.match(email.bodyMarkdown, /QA report: \.seo-agent-workspace\/v2\/page-packets\/live\/editorial-qa-report\.md/);
});
