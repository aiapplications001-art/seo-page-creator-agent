import { mkdir, readFile, writeFile } from "node:fs/promises";
import { existsSync } from "node:fs";
import path from "node:path";
import { readConfig } from "../lib/config.js";
import {
  compareGuidanceSnapshots,
  createGuidanceSnapshot,
  createWatcherState,
  defaultGoogleGuidanceSources,
  renderGuidanceReport,
  type GuidanceSnapshot,
  type GuidanceWatcherState
} from "../lib/google-guidance-watcher.js";

export interface RunGoogleGuidanceWatcherOptions {
  cwd?: string;
  date?: string;
  fetchText?: (url: string) => Promise<string>;
}

export interface GoogleGuidanceWatcherOutputs {
  reportPath: string;
  statePath: string;
}

export async function runGoogleGuidanceWatcher(
  options: RunGoogleGuidanceWatcherOptions = {}
): Promise<GoogleGuidanceWatcherOutputs> {
  const cwd = options.cwd ?? process.cwd();
  const date = options.date ?? new Date().toISOString().slice(0, 10);
  const fetchText = options.fetchText ?? fetchUrlText;
  const config = await readConfig(cwd);
  const workspaceRoot = path.resolve(cwd, config.workspace_path);
  const reportRoot = path.join(workspaceRoot, "watcher-reports");
  const stateRoot = path.join(workspaceRoot, "watcher-state");
  const reportPath = path.join(reportRoot, `google-guidance-${date}.md`);
  const statePath = path.join(stateRoot, "google-guidance-state.json");
  const previous = await readPreviousSnapshots(statePath);
  const current = [];

  for (const source of defaultGoogleGuidanceSources) {
    current.push(await createGuidanceSnapshot(source, await fetchText(source.url)));
  }

  const result = compareGuidanceSnapshots(previous, current, date);
  const state = createWatcherState(current, date);

  await mkdir(reportRoot, { recursive: true });
  await mkdir(stateRoot, { recursive: true });
  await writeFile(reportPath, renderGuidanceReport(result), "utf8");
  await writeFile(statePath, `${JSON.stringify(state, null, 2)}\n`, "utf8");

  return { reportPath, statePath };
}

export async function runWatcherCommand(args: string[]): Promise<void> {
  const [subcommand, ...rest] = args;
  if (subcommand !== "google-guidance") {
    console.error("Usage: seo-agent watcher google-guidance [--date YYYY-MM-DD]");
    process.exitCode = 1;
    return;
  }

  const outputs = await runGoogleGuidanceWatcher({
    date: readFlag(rest, "--date")
  });

  console.log(`Stored Google guidance watcher report: ${outputs.reportPath}`);
  console.log(`Stored Google guidance watcher state: ${outputs.statePath}`);
}

async function readPreviousSnapshots(statePath: string): Promise<GuidanceSnapshot[]> {
  if (!existsSync(statePath)) return [];
  const state = JSON.parse(await readFile(statePath, "utf8")) as GuidanceWatcherState;
  return state.snapshots ?? [];
}

async function fetchUrlText(url: string): Promise<string> {
  const response = await fetch(url, {
    headers: {
      "user-agent": "seo-page-creator-agent/0.1"
    }
  });
  if (!response.ok) {
    throw new Error(`Failed to fetch Google guidance source ${url}: ${response.status}`);
  }
  return response.text();
}

function readFlag(args: string[], flag: string): string | undefined {
  const index = args.indexOf(flag);
  if (index < 0) return undefined;
  return args[index + 1];
}
