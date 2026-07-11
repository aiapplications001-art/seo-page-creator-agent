import { mkdir, readFile, rm, writeFile } from "node:fs/promises";
import { existsSync } from "node:fs";
import path from "node:path";
import type {
  BatchLiveOpportunity,
  BatchLivePageAttempt,
  BatchLiveRun,
  BatchLiveRunStore
} from "./types.js";
import type { PageContentForUniqueness } from "../v2/content-uniqueness.js";

export interface BatchLiveFileStoreOptions {
  workspaceRoot: string;
  runId: string;
  now?: () => string;
}

export interface CurrentPageLock {
  runId: string;
  attemptNumber: number;
  opportunityId: string;
  pageTitle: string;
  slug: string;
  startedAt: string;
}

export interface ContentUniquenessHistoryRecord {
  recordedAt: string;
  clusterSlug: string;
  runId: string;
  opportunityId: string;
  pageTitle: string;
  slug: string;
  productionUrl?: string;
  content: PageContentForUniqueness;
}

export class BatchLiveFileStore implements BatchLiveRunStore {
  private readonly runDir: string;
  private readonly now: () => string;

  constructor(private readonly options: BatchLiveFileStoreOptions) {
    this.runDir = path.join(options.workspaceRoot, "batch-runs", options.runId);
    this.now = options.now ?? (() => new Date().toISOString());
  }

  async ensureRunDirectory(): Promise<void> {
    await mkdir(this.runDir, { recursive: true });
  }

  async initializeRun(run: BatchLiveRun): Promise<void> {
    await this.ensureRunDirectory();
    await this.writeRun(run);
    await this.appendLedger({
      event: "run_started",
      runId: run.runId,
      clusterSlug: run.clusterSlug,
      targetLiveCount: run.targetLiveCount
    });
  }

  async beginPageAttempt(run: BatchLiveRun, opportunity: BatchLiveOpportunity): Promise<void> {
    await this.ensureRunDirectory();
    const lockPath = this.currentPageLockPath();
    if (existsSync(lockPath)) {
      throw new Error(`Cannot start page attempt because current-page.lock already exists at ${lockPath}.`);
    }

    const lock: CurrentPageLock = {
      runId: run.runId,
      attemptNumber: run.totalAttemptsUsed,
      opportunityId: opportunity.id,
      pageTitle: opportunity.pageTitle,
      slug: opportunity.slug,
      startedAt: this.now()
    };
    await writeFile(lockPath, `${JSON.stringify(lock, null, 2)}\n`, "utf8");
    await this.appendLedger({
      event: "page_attempt_started",
      runId: run.runId,
      attemptNumber: lock.attemptNumber,
      opportunityId: opportunity.id,
      pageTitle: opportunity.pageTitle,
      slug: opportunity.slug
    });
  }

  async finishPageAttempt(run: BatchLiveRun, page: BatchLivePageAttempt): Promise<void> {
    await this.ensureRunDirectory();
    await this.writeRun(run);
    await this.appendLedger({
      event: "page_attempt_finished",
      runId: run.runId,
      attemptNumber: page.attemptNumber,
      opportunityId: page.opportunityId,
      status: page.status,
      productionUrl: page.productionUrl,
      commitSha: page.commitSha,
      failureReason: page.failureReason
    });
    await rm(this.currentPageLockPath(), { force: true });
  }

  async completeRun(run: BatchLiveRun): Promise<void> {
    await this.ensureRunDirectory();
    await this.writeRun(run);
    await this.appendLedger({
      event: "run_completed",
      runId: run.runId,
      status: run.status,
      liveCount: run.liveCount,
      totalAttemptsUsed: run.totalAttemptsUsed
    });
  }

  async readCurrentPageLock(): Promise<CurrentPageLock | undefined> {
    const lockPath = this.currentPageLockPath();
    if (!existsSync(lockPath)) return undefined;
    return JSON.parse(await readFile(lockPath, "utf8")) as CurrentPageLock;
  }

  async loadHistoricalPageContent(clusterSlug: string): Promise<PageContentForUniqueness[]> {
    const historyPath = this.contentUniquenessHistoryPath(clusterSlug);
    if (!existsSync(historyPath)) return [];
    const records = JSON.parse(await readFile(historyPath, "utf8")) as ContentUniquenessHistoryRecord[];
    return records.map((record) => record.content);
  }

  async recordLivePageContent(
    run: BatchLiveRun,
    page: BatchLivePageAttempt,
    content: PageContentForUniqueness
  ): Promise<void> {
    if (page.status !== "live") return;
    const historyPath = this.contentUniquenessHistoryPath(run.clusterSlug);
    await mkdir(path.dirname(historyPath), { recursive: true });
    const records = existsSync(historyPath)
      ? JSON.parse(await readFile(historyPath, "utf8")) as ContentUniquenessHistoryRecord[]
      : [];
    records.push({
      recordedAt: this.now(),
      clusterSlug: run.clusterSlug,
      runId: run.runId,
      opportunityId: page.opportunityId,
      pageTitle: page.pageTitle,
      slug: page.slug,
      productionUrl: page.productionUrl,
      content
    });
    await writeFile(historyPath, `${JSON.stringify(records, null, 2)}\n`, "utf8");
  }

  private async writeRun(run: BatchLiveRun): Promise<void> {
    await writeFile(path.join(this.runDir, "batch-run.json"), `${JSON.stringify(run, null, 2)}\n`, "utf8");
  }

  private async appendLedger(event: Record<string, unknown>): Promise<void> {
    const ledgerPath = path.join(this.runDir, "run-ledger.jsonl");
    const previous = existsSync(ledgerPath) ? await readFile(ledgerPath, "utf8") : "";
    const next = {
      timestamp: this.now(),
      ...event
    };
    await writeFile(ledgerPath, `${previous}${JSON.stringify(next)}\n`, "utf8");
  }

  private currentPageLockPath(): string {
    return path.join(this.runDir, "current-page.lock");
  }

  private contentUniquenessHistoryPath(clusterSlug: string): string {
    return path.join(this.options.workspaceRoot, "content-uniqueness", `${clusterSlug}.json`);
  }
}
