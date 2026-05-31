import { mkdir, writeFile } from "node:fs/promises";
import { createInitialV2PageState } from "./state.js";
import type { V2PageState } from "./types.js";
import { getV2PageDir, v2ArtifactPath } from "./paths.js";

export interface PrepareV2PageWorkspaceInput {
  cwd: string;
  clusterSlug: string;
  pageId: string;
  pageType: string;
}

export interface PrepareV2PageWorkspaceResult {
  pageDir: string;
  state: V2PageState;
  createdFiles: string[];
}

export async function prepareV2PageWorkspace(input: PrepareV2PageWorkspaceInput): Promise<PrepareV2PageWorkspaceResult> {
  const pageDir = await getV2PageDir(input.cwd, input.clusterSlug, input.pageId);
  const state = createInitialV2PageState(input);
  const createdFiles: string[] = [];

  await mkdir(pageDir, { recursive: true });

  await writeJson(pageDir, "page-state.json", state, createdFiles);
  await writeJson(pageDir, "serp-research-ledger.json", seedSerpResearchLedger(), createdFiles);
  await writeMarkdown(pageDir, "serp-research-ledger.md", "# SERP Research Ledger\n\nStatus: missing\n", createdFiles);
  await writeJson(pageDir, "social-video-research.json", seedSocialVideoResearch(), createdFiles);
  await writeMarkdown(pageDir, "social-video-research.md", "# Social/Video Research\n\nStatus: missing\n", createdFiles);
  await writeJson(pageDir, "audience-definition.json", seedAudienceDefinition(), createdFiles);
  await writeMarkdown(pageDir, "audience-definition.md", "# Audience Definition\n\nStatus: missing\n", createdFiles);
  await writeJson(pageDir, "narrative-brief.json", seedNarrativeBrief(), createdFiles);
  await writeMarkdown(pageDir, "narrative-brief.md", "# Narrative Brief\n\nStatus: missing\n", createdFiles);
  await writeJson(pageDir, "citation-set.json", seedCitationSet(), createdFiles);
  await writeMarkdown(pageDir, "citation-set.md", "# Citation Set\n\nStatus: missing\n", createdFiles);
  await writeJson(pageDir, "section-version-history.json", {
    schemaVersion: "section-version-history.v2",
    entries: []
  }, createdFiles);
  await writeMarkdown(pageDir, "section-version-history.md", "# Section Version History\n\nNo section changes recorded yet.\n", createdFiles);

  return { pageDir, state, createdFiles };
}

async function writeJson(pageDir: string, fileName: string, value: unknown, createdFiles: string[]): Promise<void> {
  const target = v2ArtifactPath(pageDir, fileName);
  await writeFile(target, `${JSON.stringify(value, null, 2)}\n`, "utf8");
  createdFiles.push(target);
}

async function writeMarkdown(pageDir: string, fileName: string, value: string, createdFiles: string[]): Promise<void> {
  const target = v2ArtifactPath(pageDir, fileName);
  await writeFile(target, value, "utf8");
  createdFiles.push(target);
}

function seedSerpResearchLedger(): Record<string, unknown> {
  return {
    schemaVersion: "serp-research-ledger.v2",
    status: "missing",
    primaryKeyword: "",
    originalTop10: [],
    analyzedSources: [],
    contentGapSynthesis: {
      gaps: [],
      differentiationOpportunities: []
    }
  };
}

function seedSocialVideoResearch(): Record<string, unknown> {
  return {
    schemaVersion: "social-video-research.v2",
    status: "missing",
    assets: [],
    insights: [],
    confidence: "limited"
  };
}

function seedAudienceDefinition(): Record<string, unknown> {
  return {
    schemaVersion: "audience-definition.v2",
    status: "missing",
    targetCohort: "",
    awarenessStage: "",
    readerTakeaway: "",
    objections: [],
    ctaConnection: ""
  };
}

function seedNarrativeBrief(): Record<string, unknown> {
  return {
    schemaVersion: "narrative-brief.v2",
    status: "missing",
    primaryStyle: "",
    readerTakeaway: "",
    openingAngle: "",
    brandPov: "",
    sectionDirections: []
  };
}

function seedCitationSet(): Record<string, unknown> {
  return {
    schemaVersion: "citation-set.v2",
    status: "missing",
    claims: [],
    sources: []
  };
}
