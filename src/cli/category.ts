import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import { getCategoryDiscoveryPaths } from "../lib/category-discovery/paths.js";
import { createCategoryDiscoveryTemplates } from "../lib/category-discovery/templates.js";
import type { CategoryDiscoveryMode } from "../lib/category-discovery/types.js";
import { validateCategoryDiscoveryRun, type CategoryDiscoveryValidationResult } from "../lib/category-discovery/validation.js";
import { readConfig } from "../lib/config.js";

export interface CategoryDiscoveryInitOptions {
  cwd?: string;
  runId?: string;
  business?: string;
  company?: string;
  market?: string;
  mode?: CategoryDiscoveryMode;
  seeds: string[];
  sites: string[];
  competitors: string[];
  references: string[];
  imports: {
    searchConsole: string[];
    keywords: string[];
    siteInventory: string[];
  };
  now?: string;
}

export interface CategoryDiscoveryInitOutputs {
  runId: string;
  runRoot: string;
  seedUniversePath: string;
  clusterPortfolioPath: string;
  clusterBoundaryPath: string;
}

export interface CategoryDiscoveryValidateOutputs {
  result: CategoryDiscoveryValidationResult;
  validationPath: string;
  lockPath: string;
}

export async function initCategoryDiscoveryFromWorkspace(options: CategoryDiscoveryInitOptions): Promise<CategoryDiscoveryInitOutputs> {
  const cwd = options.cwd ?? process.cwd();
  const config = await readConfig(cwd);
  const workspaceRoot = path.resolve(cwd, config.workspace_path);
  const now = options.now ?? new Date().toISOString();
  const runId = options.runId ?? `cat-${now.replace(/[-:.]/g, "").slice(0, 15)}Z`;
  const paths = getCategoryDiscoveryPaths(workspaceRoot, runId);
  const templates = createCategoryDiscoveryTemplates({
    runId,
    createdAt: now,
    business: options.business,
    company: options.company,
    market: options.market ?? config.default_market,
    mode: options.mode,
    seeds: options.seeds,
    sites: options.sites,
    competitors: options.competitors,
    references: options.references,
    imports: options.imports
  });

  await mkdir(paths.runRoot, { recursive: true });
  await writeFile(paths.seedUniverse, `${JSON.stringify(templates.seedUniverse, null, 2)}\n`, "utf8");
  await writeFile(paths.clusterPortfolio, `${JSON.stringify(templates.clusterPortfolio, null, 2)}\n`, "utf8");
  await writeFile(paths.clusterBoundary, `${JSON.stringify(templates.clusterBoundary, null, 2)}\n`, "utf8");

  return {
    runId,
    runRoot: paths.runRoot,
    seedUniversePath: paths.seedUniverse,
    clusterPortfolioPath: paths.clusterPortfolio,
    clusterBoundaryPath: paths.clusterBoundary
  };
}

export async function validateCategoryDiscoveryFromWorkspace(options: {
  cwd?: string;
  runId: string;
  now?: string;
}): Promise<CategoryDiscoveryValidateOutputs> {
  const cwd = options.cwd ?? process.cwd();
  const config = await readConfig(cwd);
  const workspaceRoot = path.resolve(cwd, config.workspace_path);
  const paths = getCategoryDiscoveryPaths(workspaceRoot, options.runId);
  const result = await validateCategoryDiscoveryRun({
    workspaceRoot,
    runId: options.runId,
    writeReport: true,
    now: options.now
  });

  return { result, validationPath: paths.validation, lockPath: paths.lock };
}

export async function runCategoryCommand(args: string[]): Promise<void> {
  const [subcommand, ...rest] = args;

  if (subcommand === "init") {
    const outputs = await initCategoryDiscoveryFromWorkspace({
      business: readFlag(rest, "--business"),
      company: readFlag(rest, "--company"),
      market: readFlag(rest, "--market"),
      mode: readFlag(rest, "--mode") as CategoryDiscoveryMode | undefined,
      runId: readFlag(rest, "--run-id"),
      seeds: readCsvFlag(rest, "--seed"),
      sites: readRepeatedFlag(rest, "--site"),
      competitors: readRepeatedFlag(rest, "--competitor"),
      references: readRepeatedFlag(rest, "--reference"),
      imports: {
        searchConsole: readRepeatedFlag(rest, "--search-console-export"),
        keywords: readRepeatedFlag(rest, "--keyword-export"),
        siteInventory: readRepeatedFlag(rest, "--site-inventory-export")
      }
    });
    console.log(`Category discovery run: ${outputs.runId}`);
    console.log(`Seed universe contract: ${outputs.seedUniversePath}`);
    console.log(`Cluster portfolio discovery: ${outputs.clusterPortfolioPath}`);
    console.log(`Cluster boundary contract: ${outputs.clusterBoundaryPath}`);
    console.log("Fill these artifacts with live evidence, then run category validate.");
    return;
  }

  if (subcommand === "validate") {
    const runId = readFlag(rest, "--run-id");
    if (!runId) {
      console.error("--run-id is required.");
      process.exitCode = 1;
      return;
    }
    const outputs = await validateCategoryDiscoveryFromWorkspace({ runId });
    console.log(`Category discovery validation: ${outputs.validationPath}`);
    console.log(`Status: ${outputs.result.combinedVerdict.status}`);
    if (outputs.result.combinedVerdict.status === "pass" || outputs.result.combinedVerdict.status === "pass_with_warnings") {
      console.log(`Lock file: ${outputs.lockPath}`);
    }
    return;
  }

  console.error("Usage: seo-agent category init --business <description> --company <name> [--market India] [--seed acne,acne scars]");
  console.error("   or: seo-agent category validate --run-id <id>");
  process.exitCode = 1;
}

function readFlag(args: string[], flag: string): string | undefined {
  const index = args.indexOf(flag);
  if (index < 0) return undefined;
  return args[index + 1];
}

function readCsvFlag(args: string[], flag: string): string[] {
  const value = readFlag(args, flag);
  if (!value) return [];
  return value.split(",").map((item) => item.trim()).filter(Boolean);
}

function readRepeatedFlag(args: string[], flag: string): string[] {
  const values: string[] = [];
  for (let index = 0; index < args.length; index += 1) {
    if (args[index] === flag && args[index + 1]) values.push(args[index + 1]);
  }
  return values;
}
