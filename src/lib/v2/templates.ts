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
  await writeJson(pageDir, "human-editorial-brief.json", seedHumanEditorialBrief(input.pageType), createdFiles);
  await writeMarkdown(pageDir, "human-editorial-brief.md", renderHumanEditorialBriefMarkdown(input.pageType), createdFiles);
  await writeJson(pageDir, "claim-first-section-plan.json", seedClaimFirstSectionPlan(), createdFiles);
  await writeMarkdown(pageDir, "claim-first-section-plan.md", renderClaimFirstSectionPlanMarkdown(), createdFiles);
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

function seedHumanEditorialBrief(pageType: string): Record<string, unknown> {
  const depth = depthForPageType(pageType);

  return {
    schemaVersion: "human-editorial-brief.v2",
    status: "missing",
    voiceModel: "category_manager_with_editorial_empathy",
    visibility: {
      default: "internal_only",
      editorVisibleSummary: "editorial_qa_report",
      debugBundle: "include_artifact_path_and_summary"
    },
    depthStrategy: {
      pageType,
      depth,
      framework: "five_w_plus_causal_chain",
      lengthBehavior: depth === "full" ? "auto_expand_when_useful" : "controlled_by_usefulness",
      requiredAngles: depth === "decision_relevant"
        ? ["what affects the decision", "what to choose", "what to avoid", "what tradeoffs matter"]
        : ["what", "why", "how", "who", "when", "where", "types or variants", "common mistakes", "practical next step"]
    },
    readerTension: {
      whatReaderIsConfusedAbout: "",
      whatReaderIsAnxiousAbout: "",
      decisionReaderNeedsToMake: ""
    },
    categoryManagerPov: {
      whatToChoose: "",
      whatToAvoid: "",
      whereBuyersGoWrong: "",
      whatTheBrandBelieves: "",
      tradeoffsThatMatter: []
    },
    exampleRequirement: {
      minimumExamplesPerPage: 2,
      priority: ["category_context", "india_context_when_relevant", "brand_context_only_when_proof_exists"],
      plannedExamples: []
    },
    humanDevices: {
      decisionFramework: {
        required: true,
        askUserOnce: true,
        selectedFormat: "",
        recommendedFormats: ["if_this_then_that", "comparison_table", "checklist", "scorecard", "criteria_table"]
      },
      commonMistakes: {
        required: true,
        standaloneSectionDefault: false,
        placement: "blended_into_relevant_sections",
        mistakesToCover: []
      },
      notRightForYou: {
        required: pageType === "product_category" || pageType === "comparison",
        recommended: pageType === "guide_blog",
        conditions: []
      },
      brandPov: {
        mode: "clear_not_salesy",
        firstPerson: "occasional"
      },
      readerQuestions: "natural_when_useful",
      analogies: "use_when_useful",
      decisionTrees: "preferred",
      microSummaries: "after_complex_explanations",
      simpleWordsExplainer: "only_when_necessary",
      finalClosingBeforeCta: "required"
    },
    qaSummary: {
      includeInEditorialQaReport: true,
      fields: [
        "voice model",
        "depth level",
        "examples count",
        "decision framework type",
        "brand POV used",
        "top human quality risks"
      ]
    }
  };
}

function seedClaimFirstSectionPlan(): Record<string, unknown> {
  return {
    schemaVersion: "claim-first-section-plan.v2",
    status: "missing",
    sectionPlanTemplate: {
      requiredFields: [
        "sectionId",
        "sectionClaim",
        "readerQuestion",
        "evidenceNeeded",
        "exampleOrTradeoff",
        "caveatOrNotRightForYou",
        "decisionPurpose",
        "transitionPurpose"
      ],
      guidance: "Draft every visible section from a claim, reader question, evidence need, and usefulness reason before writing final copy."
    },
    sections: []
  };
}

function renderHumanEditorialBriefMarkdown(pageType: string): string {
  const depth = depthForPageType(pageType);
  return `# Human Editorial Brief

Status: missing
Visibility: internal-only by default. Show only a short summary in the editorial QA report.

## Voice Model

Category Manager With Editorial Empathy

- Write in English only.
- Be commercially aware and opinionated where useful.
- Explain background deeply when the topic is complex.
- Reduce anxiety through clarity, not generic reassurance.
- Use occasional first-person brand POV only in key POV, trust, and CTA moments.

## Depth Strategy

- Page type: ${pageType}
- Depth: ${depth}
- Framework: 5W plus causal chain

Use decision-first background: begin with the practical reader decision, then explain the background behind it.

For deep topics, answer what, why, how, who, when, where, types or variants, common mistakes, and practical next step.

## Required Human Touches

- At least 2 useful examples or scenarios per page.
- Example priority: category context first, India context when relevant, brand context only with proof.
- Decision framework/table required once per page. Ask the user once for the preferred format.
- Common mistakes are mandatory but should be blended into relevant sections by default.
- "Not right for you" guidance is mandatory for product/category and comparison pages, recommended for guide/blog pages.
- Use natural reader questions when they mirror real confusion.
- Use simple practical analogies only when useful.
- Use micro-summaries after complex explanations.
- Add a short human closing before the CTA.

## Example Pattern

\`\`\`yaml
planned_example:
  section_id: S4_main_content
  context_type: category
  purpose: clarify the decision or tradeoff
  proof_required: false
  example_note: If the reader is choosing acne treatment, show how recurring jawline acne differs from occasional clogged-pore breakouts.
\`\`\`
`;
}

function renderClaimFirstSectionPlanMarkdown(): string {
  return `# Claim-First Section Plan

Status: missing

Before final copy, every visible section should be planned from a claim and a reader decision.

## Section Template

\`\`\`yaml
section_id:
section_claim:
reader_question:
evidence_needed:
example_or_tradeoff:
caveat_or_not_right_for_you:
decision_purpose:
transition_purpose:
\`\`\`

## Example

\`\`\`yaml
section_id: S3_context
section_claim: Acne treatment works better when the reader first identifies the acne pattern.
reader_question: Why did my previous acne products not work?
evidence_needed: Source-backed acne type or trigger guidance.
example_or_tradeoff: Recurring jawline acne may need a different path from occasional forehead bumps after a new product.
caveat_or_not_right_for_you: Do not treat painful or worsening acne casually.
decision_purpose: Help the reader choose diagnosis-first action instead of random product switching.
transition_purpose: Move from background explanation to decision framework.
\`\`\`
`;
}

function depthForPageType(pageType: string): "decision_relevant" | "medium" | "full" {
  if (pageType === "comparison") return "decision_relevant";
  if (pageType === "guide_blog") return "full";
  return "medium";
}
