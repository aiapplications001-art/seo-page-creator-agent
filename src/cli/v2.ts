import { existsSync } from "node:fs";
import { readFile } from "node:fs/promises";
import path from "node:path";
import {
  allMandatoryGatesPassed,
  validateAudienceDefinitionGate,
  validateCitationSetGate,
  validateNarrativeBriefGate,
  validateSerpResearchGate,
  validateSocialVideoResearchGate,
  type V2GateValidationResult
} from "../lib/v2/gates.js";
import { getV2PageDir } from "../lib/v2/paths.js";
import { prepareV2PageWorkspace } from "../lib/v2/templates.js";

interface GateStatusOutput {
  label: string;
  result: V2GateValidationResult;
}

function argValue(args: string[], name: string): string | undefined {
  const index = args.indexOf(name);
  return index >= 0 ? args[index + 1] : undefined;
}

export async function runV2Command(args: string[]): Promise<void> {
  const [subcommand, ...rest] = args;
  const clusterSlug = argValue(rest, "--cluster");
  const pageId = argValue(rest, "--page-id");
  const pageType = argValue(rest, "--page-type") ?? "product_category";

  if (!subcommand || subcommand === "help" || subcommand === "--help" || subcommand === "-h") {
    printV2Help();
    return;
  }

  if (!clusterSlug || !pageId) {
    console.error("Usage: seo-agent v2 <command> --cluster <slug> --page-id <id>");
    process.exitCode = 1;
    return;
  }

  if (subcommand === "prepare-page") {
    const result = await prepareV2PageWorkspace({ cwd: process.cwd(), clusterSlug, pageId, pageType });
    console.log(`Prepared V2 page workspace: ${result.pageDir}`);
    console.log("Next: complete the SERP research ledger.");
    return;
  }

  if (subcommand === "status") {
    const state = await readPageState(clusterSlug, pageId);
    console.log(`Status: ${state.status}`);
    console.log(`Publish ready: ${state.publishReady}`);
    console.log(`Next: ${state.nextRecommendedAction}`);
    return;
  }

  if (subcommand === "validate-gates") {
    const results = await validateGateArtifacts(clusterSlug, pageId);
    for (const gate of results) {
      console.log(`${gate.label}: ${gate.result.status}`);
      for (const issue of gate.result.blockingIssues) {
        console.log(`- ${issue}`);
      }
    }
    if (!allMandatoryGatesPassed(results.map((gate) => gate.result))) {
      process.exitCode = 1;
    }
    return;
  }

  if (subcommand === "qa") {
    const pageDir = await getV2PageDir(process.cwd(), clusterSlug, pageId);
    const qaPath = path.join(pageDir, "editorial-qa-report.md");
    if (!existsSync(qaPath)) {
      console.error(`No editorial QA report found at ${qaPath}.`);
      process.exitCode = 1;
      return;
    }
    console.log(await readFile(qaPath, "utf8"));
    return;
  }

  console.error(`Unknown v2 command: ${subcommand}`);
  printV2Help();
  process.exitCode = 1;
}

async function readPageState(clusterSlug: string, pageId: string): Promise<Record<string, unknown>> {
  const pageDir = await getV2PageDir(process.cwd(), clusterSlug, pageId);
  return readJson(path.join(pageDir, "page-state.json")) as Promise<Record<string, unknown>>;
}

async function validateGateArtifacts(clusterSlug: string, pageId: string): Promise<GateStatusOutput[]> {
  const pageDir = await getV2PageDir(process.cwd(), clusterSlug, pageId);
  const serp = await readJson(path.join(pageDir, "serp-research-ledger.json"));
  const socialVideo = await readJson(path.join(pageDir, "social-video-research.json"));
  const audience = await readJson(path.join(pageDir, "audience-definition.json"));
  const narrative = await readJson(path.join(pageDir, "narrative-brief.json"));
  const citations = await readJson(path.join(pageDir, "citation-set.json"));

  return [
    { label: "SERP Research Ledger", result: validateSerpResearchGate(serp as Parameters<typeof validateSerpResearchGate>[0]) },
    { label: "Social/Video Research", result: validateSocialVideoResearchGate(socialVideo as Parameters<typeof validateSocialVideoResearchGate>[0]) },
    { label: "Audience Definition", result: validateAudienceDefinitionGate(audience as Parameters<typeof validateAudienceDefinitionGate>[0]) },
    { label: "Narrative Brief", result: validateNarrativeBriefGate(narrative as Parameters<typeof validateNarrativeBriefGate>[0]) },
    { label: "Citation Set", result: validateCitationSetGate(citations as Parameters<typeof validateCitationSetGate>[0]) }
  ];
}

async function readJson(filePath: string): Promise<unknown> {
  return JSON.parse(await readFile(filePath, "utf8")) as unknown;
}

function printV2Help(): void {
  console.log(`SEO Page Creator Agent V2

Usage:
  seo-agent v2 prepare-page --cluster <slug> --page-id <id> [--page-type product_category]
  seo-agent v2 status --cluster <slug> --page-id <id>
  seo-agent v2 validate-gates --cluster <slug> --page-id <id>
  seo-agent v2 qa --cluster <slug> --page-id <id>
`);
}
