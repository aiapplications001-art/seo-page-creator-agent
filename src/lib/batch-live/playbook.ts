import type { PublishPlaybook, PublishPlaybookAdapter } from "./types.js";

export function validatePublishPlaybook(input: unknown): PublishPlaybook {
  if (!isObject(input)) {
    throw new Error("Publish playbook must be an object.");
  }

  const playbook = input as Record<string, unknown>;
  assertString(playbook.schemaVersion, "schemaVersion");
  assertString(playbook.projectId, "projectId");
  assertString(playbook.adapter, "adapter");
  assertStringType(playbook.repoPath, "repoPath");
  assertString(playbook.branch, "branch");
  assertObject(playbook.contentIntegration, "contentIntegration");
  assertObject(playbook.commit, "commit");
  assertObject(playbook.deploy, "deploy");
  assertObject(playbook.liveVerification, "liveVerification");

  if (playbook.schemaVersion !== "publish-playbook.v1") {
    throw new Error("schemaVersion must be publish-playbook.v1.");
  }
  if (!["git_push_deploy", "custom_script"].includes(playbook.adapter)) {
    throw new Error("adapter must be git_push_deploy or custom_script.");
  }
  if (playbook.repoPath.trim().length === 0) {
    throw new Error("repoPath is required.");
  }
  if (playbook.branch !== "main") {
    throw new Error("branch must be main.");
  }
  if (playbook.requiresCleanWorkingTree !== true) {
    throw new Error("requiresCleanWorkingTree must be true.");
  }
  if (!Array.isArray(playbook.validationCommands) || playbook.validationCommands.length === 0) {
    throw new Error("validationCommands must include at least one command.");
  }
  if (!playbook.validationCommands.every((command) => typeof command === "string" && command.trim().length > 0)) {
    throw new Error("validationCommands must be non-empty strings.");
  }

  const contentIntegration = playbook.contentIntegration as Record<string, unknown>;
  assertString(contentIntegration.mode, "contentIntegration.mode");
  assertString(contentIntegration.instructions, "contentIntegration.instructions");
  if (contentIntegration.mode !== "project_existing_page_process") {
    throw new Error("contentIntegration.mode must be project_existing_page_process.");
  }

  const commit = playbook.commit as Record<string, unknown>;
  assertString(commit.strategy, "commit.strategy");
  assertString(commit.messageTemplate, "commit.messageTemplate");
  if (commit.strategy !== "one_commit_per_page") {
    throw new Error("commit.strategy must be one_commit_per_page.");
  }

  const deploy = playbook.deploy as Record<string, unknown>;
  assertString(deploy.trigger, "deploy.trigger");
  if (!["git_push", "custom_script"].includes(deploy.trigger)) {
    throw new Error("deploy.trigger must be git_push or custom_script.");
  }
  if (deploy.pushAfterEachCommit !== true) {
    throw new Error("deploy.pushAfterEachCommit must be true.");
  }

  const liveVerification = playbook.liveVerification as Record<string, unknown>;
  assertString(liveVerification.mode, "liveVerification.mode");
  assertNumber(liveVerification.timeoutMinutes, "liveVerification.timeoutMinutes");
  assertNumber(liveVerification.retryEverySeconds, "liveVerification.retryEverySeconds");
  if (liveVerification.mode !== "http_200") {
    throw new Error("liveVerification.mode must be http_200.");
  }

  return {
    schemaVersion: "publish-playbook.v1",
    projectId: playbook.projectId,
    adapter: playbook.adapter as PublishPlaybookAdapter,
    repoPath: playbook.repoPath,
    branch: "main",
    requiresCleanWorkingTree: true,
    contentIntegration: {
      mode: "project_existing_page_process",
      instructions: contentIntegration.instructions
    },
    validationCommands: playbook.validationCommands as string[],
    commit: {
      strategy: "one_commit_per_page",
      messageTemplate: commit.messageTemplate
    },
    deploy: {
      trigger: deploy.trigger as "git_push" | "custom_script",
      pushAfterEachCommit: true
    },
    liveVerification: {
      mode: "http_200",
      timeoutMinutes: liveVerification.timeoutMinutes,
      retryEverySeconds: liveVerification.retryEverySeconds
    }
  };
}

function isObject(value: unknown): value is Record<string, unknown> {
  return Boolean(value && typeof value === "object" && !Array.isArray(value));
}

function assertObject(value: unknown, name: string): asserts value is Record<string, unknown> {
  if (!isObject(value)) {
    throw new Error(`${name} must be an object.`);
  }
}

function assertString(value: unknown, name: string): asserts value is string {
  if (typeof value !== "string" || value.trim().length === 0) {
    throw new Error(`${name} must be a non-empty string.`);
  }
}

function assertStringType(value: unknown, name: string): asserts value is string {
  if (typeof value !== "string") {
    throw new Error(`${name} must be a string.`);
  }
}

function assertNumber(value: unknown, name: string): asserts value is number {
  if (typeof value !== "number" || !Number.isFinite(value) || value <= 0) {
    throw new Error(`${name} must be a positive number.`);
  }
}
