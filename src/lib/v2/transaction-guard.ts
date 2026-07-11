import { existsSync } from "node:fs";
import { readFile } from "node:fs/promises";
import path from "node:path";
import { readConfig } from "../config.js";
import type { PagePacket } from "../page-packet.js";
import {
  allMandatoryGatesPassed,
  validateAudienceDefinitionGate,
  validateCitationSetGate,
  validateNarrativeBriefGate,
  validateSerpResearchGate,
  validateSocialVideoResearchGate
} from "./gates.js";
import {
  buildHumanEditorialQaSummary,
  validateClaimFirstSectionPlan,
  validateHumanEditorialBrief
} from "./human-editorial.js";
import { validatePageDepthContract } from "./depth.js";
import { getV2PageDir } from "./paths.js";

export type V2TransactionStage = "final-copy" | "images" | "publish";

export interface AssertV2PageCanAdvanceInput {
  cwd: string;
  clusterSlug: string;
  pageId: string;
  stage: V2TransactionStage;
}

export async function assertV2PageCanAdvance(input: AssertV2PageCanAdvanceInput): Promise<void> {
  const pageDir = await getV2PageDir(input.cwd, input.clusterSlug, input.pageId);
  if (!existsSync(pageDir)) return;

  const blockingIssues = [
    ...await validateDepth(input, pageDir),
    ...await validateHuman(pageDir, input.stage),
    ...await validateGates(pageDir, input.stage)
  ];

  if (blockingIssues.length > 0) {
    throw new Error(blockingIssues.join("\n"));
  }
}

async function validateDepth(input: AssertV2PageCanAdvanceInput, pageDir: string): Promise<string[]> {
  const result = validatePageDepthContract({
    researchExtractionMatrix: await readJson(path.join(pageDir, "research-extraction-matrix.json")) as Parameters<typeof validatePageDepthContract>[0]["researchExtractionMatrix"],
    competitorDepthDelta: await readJson(path.join(pageDir, "competitor-depth-delta.json")) as Parameters<typeof validatePageDepthContract>[0]["competitorDepthDelta"],
    audiencePainPointLedger: await readJson(path.join(pageDir, "audience-pain-point-ledger.json")) as Parameters<typeof validatePageDepthContract>[0]["audiencePainPointLedger"],
    preDraftSynthesisBrief: await readJson(path.join(pageDir, "pre-draft-synthesis-brief.json")) as Parameters<typeof validatePageDepthContract>[0]["preDraftSynthesisBrief"],
    preDraftQualityBrief: await readJson(path.join(pageDir, "pre-draft-quality-brief.json")) as Parameters<typeof validatePageDepthContract>[0]["preDraftQualityBrief"],
    pageDepthScore: await readJson(path.join(pageDir, "depth-score.json")) as Parameters<typeof validatePageDepthContract>[0]["pageDepthScore"],
    expectedSectionIds: await readGeneratedSectionIds(input.cwd, input.clusterSlug, input.pageId)
  });

  if (result.status === "passed") return [];
  return [
    `Page cannot advance to ${input.stage} until validate-depth passes.`,
    ...result.blockingIssues.map((issue) => `validate-depth: ${issue}`)
  ];
}

async function validateHuman(pageDir: string, stage: V2TransactionStage): Promise<string[]> {
  const humanBrief = await readJson(path.join(pageDir, "human-editorial-brief.json"));
  const claimPlan = await readJson(path.join(pageDir, "claim-first-section-plan.json"));
  const briefResult = validateHumanEditorialBrief(humanBrief);
  const planResult = validateClaimFirstSectionPlan(claimPlan);
  const summary = buildHumanEditorialQaSummary({ briefResult, planResult });

  if (summary.status === "passed") return [];
  return [
    `Page cannot advance to ${stage} until validate-human passes.`,
    ...briefResult.blockingIssues.map((issue) => `validate-human: ${issue}`),
    ...planResult.blockingIssues.map((issue) => `validate-human: ${issue}`)
  ];
}

async function validateGates(pageDir: string, stage: V2TransactionStage): Promise<string[]> {
  const results = [
    validateSerpResearchGate(await readJson(path.join(pageDir, "serp-research-ledger.json")) as Parameters<typeof validateSerpResearchGate>[0]),
    validateSocialVideoResearchGate(await readJson(path.join(pageDir, "social-video-research.json")) as Parameters<typeof validateSocialVideoResearchGate>[0]),
    validateAudienceDefinitionGate(await readJson(path.join(pageDir, "audience-definition.json")) as Parameters<typeof validateAudienceDefinitionGate>[0]),
    validateNarrativeBriefGate(await readJson(path.join(pageDir, "narrative-brief.json")) as Parameters<typeof validateNarrativeBriefGate>[0]),
    validateCitationSetGate(await readJson(path.join(pageDir, "citation-set.json")) as Parameters<typeof validateCitationSetGate>[0])
  ];

  if (allMandatoryGatesPassed(results)) return [];
  return [
    `Page cannot advance to ${stage} until validate-gates passes.`,
    ...results.flatMap((result) => result.blockingIssues.map((issue) => `validate-gates: ${issue}`))
  ];
}

async function readJson(filePath: string): Promise<unknown> {
  return JSON.parse(await readFile(filePath, "utf8")) as unknown;
}

async function readGeneratedSectionIds(cwd: string, clusterSlug: string, pageId: string): Promise<string[] | undefined> {
  const config = await readOptionalConfig(cwd);
  if (!config) return undefined;
  const packetPath = path.resolve(cwd, config.workspace_path, "page-packets", clusterSlug, pageId, "page-packet.json");
  if (!existsSync(packetPath)) return undefined;
  const packet = JSON.parse(await readFile(packetPath, "utf8")) as PagePacket;
  return packet.sections.filter((section) => section.role !== "reference").map((section) => section.id);
}

async function readOptionalConfig(cwd: string): Promise<Awaited<ReturnType<typeof readConfig>> | undefined> {
  try {
    return await readConfig(cwd);
  } catch (error) {
    if (isMissingFileError(error)) return undefined;
    throw error;
  }
}

function isMissingFileError(error: unknown): boolean {
  return Boolean(error && typeof error === "object" && "code" in error && error.code === "ENOENT");
}
