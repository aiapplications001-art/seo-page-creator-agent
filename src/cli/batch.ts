const DEFAULT_VOICE = "category-manager-with-editorial-empathy";

export interface BatchLiveCommandOptions {
  clusterSlug?: string;
  targetLiveCount: number;
  maxTotalAttempts: number;
  projectId?: string;
  completionEmailTo?: string;
  voice: string;
}

export async function runBatchCommand(args: string[]): Promise<void> {
  const [subcommand, ...rest] = args;
  if (subcommand !== "live") {
    printBatchUsage();
    process.exitCode = 1;
    return;
  }

  const clusterSlug = readFlag(rest, "--cluster");
  const count = readPositiveIntegerFlag(rest, "--count");
  const projectId = readFlag(rest, "--project");
  const completionEmailTo = readFlag(rest, "--email-to");
  const voice = readFlag(rest, "--voice") ?? DEFAULT_VOICE;

  if (count === undefined) {
    console.error("--count must be a positive integer.");
    process.exitCode = 1;
    return;
  }

  const options: BatchLiveCommandOptions = {
    clusterSlug,
    targetLiveCount: count,
    maxTotalAttempts: count * 2,
    projectId,
    completionEmailTo,
    voice
  };

  printPreparedBatchLiveRun(options);
}

function printPreparedBatchLiveRun(options: BatchLiveCommandOptions): void {
  console.log(`Prepared batch live run

Cluster: ${options.clusterSlug ?? "auto-identify during preflight"}
Cluster preflight: identify existing cluster or create one before page work
Cluster preflight guard: Do not create page packets, copy, or images during cluster identification
Target live pages: ${options.targetLiveCount}
Max total attempts: ${options.maxTotalAttempts}
Repair attempts per page: 3
Batch mode: completed live page, not workflow stage
Page transaction: finish research, packet, copy, images, validation, repair, commit, push, deploy, and HTTP 200 verification before selecting the next page
Asset/copy scope: No future-page assets or copy before the current page is live or skipped
Keyword discovery: prioritize unfocused and long-tail opportunities with messy SERP intent, thin competitor coverage, real Reddit/forum/video language, and specific reader problems
Reject volume-only page selection: every page needs an underserved reason, 5+ long-tail variants, 5+ related questions, and a standout angle
Research depth: at least 10 meaningful SERP sources, 7 social/video attempts, 5 reviewed assets, and claim-specific citations per page
Depth contract: validate-depth required before final copy, images, commit, and publish
Durable state: .seo-agent-workspace/batch-runs/<run-id>/batch-run.json, run-ledger.jsonl, and current-page.lock
Concurrency guard: refuse to start a new page while current-page.lock exists
Branch: main
Clean tree required: true
Commit strategy: one commit per successful page
Deploy strategy: push/deploy after each successful page commit
Live verification: HTTP 200 OK
Voice: ${options.voice}
Project: ${options.projectId ?? "auto-detect"}
Completion email: ${options.completionEmailTo ?? "not configured"}
Completion email packet: send final batch QA report with batch score, confidence, live URLs, failed attempts, QA report paths, and recommended fixes after the batch finishes

Next: connect the project publish playbook and page worker adapter to execute this run.`);
}

function printBatchUsage(): void {
  console.error("Usage: seo-agent batch live --count <number> [--cluster <slug>] [--project <id>] [--email-to <address>] [--voice <voice>]");
}

function readFlag(args: string[], flag: string): string | undefined {
  const index = args.indexOf(flag);
  if (index < 0) return undefined;
  return args[index + 1];
}

function readPositiveIntegerFlag(args: string[], flag: string): number | undefined {
  const value = readFlag(args, flag);
  if (!value) return undefined;
  const parsed = Number(value);
  if (!Number.isInteger(parsed) || parsed <= 0) return undefined;
  return parsed;
}
