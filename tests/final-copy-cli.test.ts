import test from "node:test";
import assert from "node:assert/strict";
import { mkdtemp, mkdir, readFile, writeFile } from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import { expandPagePacketFromWorkspace } from "../src/cli/final-copy.js";
import { writeConfig } from "../src/lib/config.js";
import type { PagePacket } from "../src/lib/page-packet.js";
import { prepareV2PageWorkspace } from "../src/lib/v2/templates.js";

test("writes expanded page packet artifacts next to the original packet", async () => {
  const cwd = await mkdtemp(path.join(os.tmpdir(), "seo-final-copy-"));
  await writeConfig({
    workspace_path: ".seo-agent-workspace",
    default_market: "India",
    timezone: "Asia/Kolkata",
    site_inventory: {
      default_url_metadata_limit: 500,
      fetch_full_content_by_default: false,
      prioritize_url_types: ["product_category", "product", "guide_blog", "comparison", "faq_support", "pricing_trust"]
    },
    weekly_watcher: {
      enabled: true,
      schedule: "Tuesday morning",
      official_sources_only: true,
      custom_watch_urls: []
    },
    integrations: {
      google_search_console: { enabled: true, auth: "oauth_read_only" },
      google_ads_keyword_planner: { enabled: true, auth: "oauth_application_read_only" }
    },
    output: {
      write_markdown: true,
      write_json: true,
      include_json_mirror_in_markdown: true
    }
  }, cwd);

  const packetRoot = path.join(cwd, ".seo-agent-workspace", "page-packets", "acne-treatment", "P1");
  await mkdir(packetRoot, { recursive: true });
  const packet: PagePacket = {
    metadata: {
      schemaVersion: "page-packet.v1",
      sourcePrewritingPageId: "P1",
      companyName: "ClearNest",
      market: "India",
      pageType: "product_category",
      createdDate: "2026-05-28",
      updatedDate: "2026-05-28"
    },
    seo: {
      title: "Acne Treatment Category Page | ClearNest",
      description: "Acne Treatment Category Page for Indian adults with visible acne.",
      slug: "acne-treatment",
      h1: "Acne Treatment Category Page",
      secondaryKeywords: [],
      ogTitle: "Acne Treatment Category Page | ClearNest",
      ogDescription: "Acne Treatment Category Page for Indian adults with visible acne.",
      twitterTitle: "Acne Treatment Category Page | ClearNest",
      twitterDescription: "Acne Treatment Category Page for Indian adults with visible acne."
    },
    authorship: {
      author: { name: "ClearNest Editorial Team" },
      reviewedByVisible: false
    },
    cta: {
      primary: {
        label: "Start your free skin analysis now",
        microcopy: "Scan your face in about 60 seconds."
      },
      mobileSticky: {
        label: "Start analysis"
      }
    },
    rendering: {
      mobileFirst: true,
      desktopNotes: [],
      mobileNotes: []
    },
    sections: [
      { id: "S1_hero", heading: "Hero", role: "conversion", markdown: "Editable section scaffold for Hero." },
      { id: "S2_context", heading: "Context", role: "ux", markdown: "Editable section scaffold for Context." }
    ],
    links: { internal: [], external: [] },
    images: [],
    schemaDrafts: [],
    machineReadable: {
      sections: [],
      images: [],
      links: { internal: [], external: [] }
    }
  };
  await writeFile(path.join(packetRoot, "page-packet.json"), `${JSON.stringify(packet, null, 2)}\n`, "utf8");

  const outputs = await expandPagePacketFromWorkspace({
    clusterSlug: "acne-treatment",
    pageId: "P1",
    cwd
  });

  assert.equal(outputs.jsonPath.endsWith("page-packet.expanded.json"), true);
  assert.equal(outputs.markdownPath.endsWith("page-packet.expanded.md"), true);

  const json = JSON.parse(await readFile(outputs.jsonPath, "utf8"));
  assert.equal(json.metadata.copyStatus, "expanded_review_ready");

  const markdown = await readFile(outputs.markdownPath, "utf8");
  assert.match(markdown, /# Page Packet: Acne Treatment Category Page/);
  assert.match(markdown, /expanded_review_ready/);
});

test("blocks final copy expansion when a V2 page workspace has not passed depth validation", async () => {
  const cwd = await mkdtemp(path.join(os.tmpdir(), "seo-final-copy-"));
  await writeConfig({
    workspace_path: ".seo-agent-workspace",
    default_market: "India",
    timezone: "Asia/Kolkata",
    site_inventory: {
      default_url_metadata_limit: 500,
      fetch_full_content_by_default: false,
      prioritize_url_types: ["product_category", "product", "guide_blog", "comparison", "faq_support", "pricing_trust"]
    },
    weekly_watcher: {
      enabled: true,
      schedule: "Tuesday morning",
      official_sources_only: true,
      custom_watch_urls: []
    },
    integrations: {
      google_search_console: { enabled: true, auth: "oauth_read_only" },
      google_ads_keyword_planner: { enabled: true, auth: "oauth_application_read_only" }
    },
    output: {
      write_markdown: true,
      write_json: true,
      include_json_mirror_in_markdown: true
    }
  }, cwd);
  await seedPagePacket(cwd);
  await prepareV2PageWorkspace({
    cwd,
    clusterSlug: "acne-treatment",
    pageId: "P1",
    pageType: "product_category"
  });

  await assert.rejects(
    () => expandPagePacketFromWorkspace({ clusterSlug: "acne-treatment", pageId: "P1", cwd }),
    /Page cannot advance to final-copy until validate-depth passes/
  );
});

test("blocks V2 final copy expansion when adapter-written draft is incomplete", async () => {
  const cwd = await mkdtemp(path.join(os.tmpdir(), "seo-final-copy-"));
  await writeConfig({
    workspace_path: ".seo-agent-workspace",
    default_market: "India",
    timezone: "Asia/Kolkata",
    site_inventory: {
      default_url_metadata_limit: 500,
      fetch_full_content_by_default: false,
      prioritize_url_types: ["product_category", "product", "guide_blog", "comparison", "faq_support", "pricing_trust"]
    },
    weekly_watcher: {
      enabled: true,
      schedule: "Tuesday morning",
      official_sources_only: true,
      custom_watch_urls: []
    },
    integrations: {
      google_search_console: { enabled: true, auth: "oauth_read_only" },
      google_ads_keyword_planner: { enabled: true, auth: "oauth_application_read_only" }
    },
    output: {
      write_markdown: true,
      write_json: true,
      include_json_mirror_in_markdown: true
    }
  }, cwd);
  await seedPagePacket(cwd);
  await prepareV2PageWorkspace({
    cwd,
    clusterSlug: "acne-treatment",
    pageId: "P1",
    pageType: "product_category"
  });
  await seedPassingV2Artifacts(cwd);

  await assert.rejects(
    () => expandPagePacketFromWorkspace({ clusterSlug: "acne-treatment", pageId: "P1", cwd }),
    /Final copy draft requires adapter/
  );
});

test("blocks V2 final copy expansion when superiority proof does not match pre-draft promises", async () => {
  const cwd = await mkdtemp(path.join(os.tmpdir(), "seo-final-copy-"));
  await writeConfig({
    workspace_path: ".seo-agent-workspace",
    default_market: "India",
    timezone: "Asia/Kolkata",
    site_inventory: {
      default_url_metadata_limit: 500,
      fetch_full_content_by_default: false,
      prioritize_url_types: ["product_category", "product", "guide_blog", "comparison", "faq_support", "pricing_trust"]
    },
    weekly_watcher: {
      enabled: true,
      schedule: "Tuesday morning",
      official_sources_only: true,
      custom_watch_urls: []
    },
    integrations: {
      google_search_console: { enabled: true, auth: "oauth_read_only" },
      google_ads_keyword_planner: { enabled: true, auth: "oauth_application_read_only" }
    },
    output: {
      write_markdown: true,
      write_json: true,
      include_json_mirror_in_markdown: true
    }
  }, cwd);
  await seedPagePacket(cwd);
  await prepareV2PageWorkspace({
    cwd,
    clusterSlug: "acne-treatment",
    pageId: "P1",
    pageType: "product_category"
  });
  await seedPassingV2Artifacts(cwd);
  const proof = completedFinalCopySuperiorityProof();
  proof.superiorityComponentsDelivered = [
    {
      componentId: "wrong-component-id",
      sectionId: "S1_hero",
      visibleOutputType: "decision_tree",
      finalCopyEvidence: "The wrong component appears in the final copy."
    }
  ];
  await seedValidFinalCopyDraft(cwd, proof);

  await assert.rejects(
    () => expandPagePacketFromWorkspace({ clusterSlug: "acne-treatment", pageId: "P1", cwd }),
    /must deliver every required superiority component/
  );
});

test("merges V2 adapter-written final copy into expanded page packet", async () => {
  const cwd = await mkdtemp(path.join(os.tmpdir(), "seo-final-copy-"));
  await writeConfig({
    workspace_path: ".seo-agent-workspace",
    default_market: "India",
    timezone: "Asia/Kolkata",
    site_inventory: {
      default_url_metadata_limit: 500,
      fetch_full_content_by_default: false,
      prioritize_url_types: ["product_category", "product", "guide_blog", "comparison", "faq_support", "pricing_trust"]
    },
    weekly_watcher: {
      enabled: true,
      schedule: "Tuesday morning",
      official_sources_only: true,
      custom_watch_urls: []
    },
    integrations: {
      google_search_console: { enabled: true, auth: "oauth_read_only" },
      google_ads_keyword_planner: { enabled: true, auth: "oauth_application_read_only" }
    },
    output: {
      write_markdown: true,
      write_json: true,
      include_json_mirror_in_markdown: true
    }
  }, cwd);
  await seedPagePacket(cwd);
  await prepareV2PageWorkspace({
    cwd,
    clusterSlug: "acne-treatment",
    pageId: "P1",
    pageType: "product_category"
  });
  await seedPassingV2Artifacts(cwd);
  await seedValidFinalCopyDraft(cwd);

  const outputs = await expandPagePacketFromWorkspace({ clusterSlug: "acne-treatment", pageId: "P1", cwd });

  const json = JSON.parse(await readFile(outputs.jsonPath, "utf8"));
  assert.equal(json.metadata.copyStatus, "adapter_written_review_ready");
  assert.match(json.sections[0].markdown, /ClearNest helps readers decide what kind of acne pattern/);
  assert.doesNotMatch(json.sections[0].markdown, /This section should|Use this section|Reference URLs still need/);
});

async function seedPagePacket(cwd: string): Promise<void> {
  const packetRoot = path.join(cwd, ".seo-agent-workspace", "page-packets", "acne-treatment", "P1");
  await mkdir(packetRoot, { recursive: true });
  const packet: PagePacket = {
    metadata: {
      schemaVersion: "page-packet.v1",
      sourcePrewritingPageId: "P1",
      companyName: "ClearNest",
      market: "India",
      pageType: "product_category",
      createdDate: "2026-05-28",
      updatedDate: "2026-05-28"
    },
    seo: {
      title: "Acne Treatment Category Page | ClearNest",
      description: "Acne Treatment Category Page for Indian adults with visible acne.",
      slug: "acne-treatment",
      h1: "Acne Treatment Category Page",
      secondaryKeywords: [],
      ogTitle: "Acne Treatment Category Page | ClearNest",
      ogDescription: "Acne Treatment Category Page for Indian adults with visible acne.",
      twitterTitle: "Acne Treatment Category Page | ClearNest",
      twitterDescription: "Acne Treatment Category Page for Indian adults with visible acne."
    },
    authorship: {
      author: { name: "ClearNest Editorial Team" },
      reviewedByVisible: false
    },
    cta: {
      primary: {
        label: "Start your free skin analysis now",
        microcopy: "Scan your face in about 60 seconds."
      },
      mobileSticky: {
        label: "Start analysis"
      }
    },
    rendering: {
      mobileFirst: true,
      desktopNotes: [],
      mobileNotes: []
    },
    sections: [
      { id: "S1_hero", heading: "Hero", role: "conversion", markdown: "Editable section scaffold for Hero." },
      { id: "S2_context", heading: "Context", role: "ux", markdown: "Editable section scaffold for Context." }
    ],
    links: { internal: [], external: [] },
    images: [],
    schemaDrafts: [],
    machineReadable: {
      sections: [],
      images: [],
      links: { internal: [], external: [] }
    }
  };
  await writeFile(path.join(packetRoot, "page-packet.json"), `${JSON.stringify(packet, null, 2)}\n`, "utf8");
}

async function seedPassingV2Artifacts(cwd: string): Promise<void> {
  const pageDir = path.join(cwd, ".seo-agent-workspace", "v2", "page-packets", "acne-treatment", "P1");
  const depthContract = completedDepthContract();

  await writeFile(path.join(pageDir, "human-editorial-brief.json"), `${JSON.stringify(completedHumanBrief(), null, 2)}\n`, "utf8");
  await writeFile(path.join(pageDir, "claim-first-section-plan.json"), `${JSON.stringify(completedClaimPlan(), null, 2)}\n`, "utf8");
  await writeFile(path.join(pageDir, "serp-research-ledger.json"), `${JSON.stringify(completedSerpLedger(), null, 2)}\n`, "utf8");
  await writeFile(path.join(pageDir, "social-video-research.json"), `${JSON.stringify(completedSocialVideoResearch(), null, 2)}\n`, "utf8");
  await writeFile(path.join(pageDir, "audience-definition.json"), `${JSON.stringify(completedAudienceDefinition(), null, 2)}\n`, "utf8");
  await writeFile(path.join(pageDir, "narrative-brief.json"), `${JSON.stringify(completedNarrativeBrief(), null, 2)}\n`, "utf8");
  await writeFile(path.join(pageDir, "citation-set.json"), `${JSON.stringify(completedCitationSet(), null, 2)}\n`, "utf8");
  await writeFile(path.join(pageDir, "research-extraction-matrix.json"), `${JSON.stringify(depthContract.researchExtractionMatrix, null, 2)}\n`, "utf8");
  await writeFile(path.join(pageDir, "competitor-depth-delta.json"), `${JSON.stringify(depthContract.competitorDepthDelta, null, 2)}\n`, "utf8");
  await writeFile(path.join(pageDir, "audience-pain-point-ledger.json"), `${JSON.stringify(depthContract.audiencePainPointLedger, null, 2)}\n`, "utf8");
  await writeFile(path.join(pageDir, "pre-draft-synthesis-brief.json"), `${JSON.stringify(depthContract.preDraftSynthesisBrief, null, 2)}\n`, "utf8");
  await writeFile(path.join(pageDir, "pre-draft-quality-brief.json"), `${JSON.stringify(depthContract.preDraftQualityBrief, null, 2)}\n`, "utf8");
  await writeFile(path.join(pageDir, "depth-score.json"), `${JSON.stringify(depthContract.pageDepthScore, null, 2)}\n`, "utf8");
}

async function seedValidFinalCopyDraft(cwd: string, superiorityProof = completedFinalCopySuperiorityProof()): Promise<void> {
  const pageDir = path.join(cwd, ".seo-agent-workspace", "v2", "page-packets", "acne-treatment", "P1");
  await writeFile(path.join(pageDir, "final-copy-draft.json"), `${JSON.stringify({
    schemaVersion: "final-copy-draft.v2",
    adapter: "antigravity",
    generatedAt: "2026-07-02T10:00:00.000Z",
    sections: [
      {
        sectionId: "S1_hero",
        markdown: "ClearNest helps readers decide what kind of acne pattern they are dealing with before changing another product. The acne pattern decision tree is visible here, with a quick answer block and cautious source-backed claim handling.",
        evidenceRefs: ["F1"],
        citationClaimIds: ["C1"],
        audienceSignalIds: ["A1"]
      },
      {
        sectionId: "S2_context",
        markdown: "The context section explains why acne pattern and irritation tolerance should shape the next step.",
        evidenceRefs: ["F2"],
        citationClaimIds: ["C1"],
        audienceSignalIds: ["A2"]
      }
    ],
    references: [
      { sourceUrl: "https://example.com/source-1", label: "ClearNest research note", claimIds: ["C1"] }
    ],
    standoutElements: [
      { id: "decision-tree-acne-patterns", type: "decision_tree", title: "Acne pattern decision tree" }
    ],
    superiorityProof,
    structurePlanDeliveryProof: {
      primaryConcernDelivered: {
        sectionId: "S1_hero",
        finalCopyEvidence: "what kind of acne pattern they are dealing with"
      },
      highImpactComponentsDelivered: [
        {
          componentType: "decision_tree",
          mappedSectionId: "S1_hero",
          finalCopyEvidence: "acne pattern decision tree"
        }
      ],
      expectedVisibleOutputsDelivered: [
        {
          mappedSectionId: "S1_hero",
          finalCopyEvidence: "quick answer block"
        },
        {
          mappedSectionId: "S2_context",
          finalCopyEvidence: "pattern and irritation tolerance should shape the next step"
        }
      ],
      structureDecisionsDelivered: [
        {
          sectionId: "S1_hero",
          finalCopyEvidence: "quick answer block"
        }
      ]
    },
    qaNotes: ["Adapter-written draft."]
  }, null, 2)}\n`, "utf8");
}

function completedHumanBrief(): Record<string, unknown> {
  return {
    schemaVersion: "human-editorial-brief.v2",
    status: "draft",
    voiceModel: "category_manager_with_editorial_empathy",
    visibility: { default: "internal_only" },
    depthStrategy: { pageType: "product_category", depth: "medium", framework: "five_w_plus_causal_chain" },
    readerTension: {
      whatReaderIsConfusedAbout: "Why acne keeps returning.",
      whatReaderIsAnxiousAbout: "Choosing the wrong routine.",
      decisionReaderNeedsToMake: "Whether to start with diagnosis or another product."
    },
    categoryManagerPov: {
      whatToChoose: "Start with identifying the acne pattern.",
      whatToAvoid: "Do not treat every breakout as random.",
      whereBuyersGoWrong: "They compare treatment strength before understanding the trigger.",
      whatTheBrandBelieves: "ClearNest believes acne care should start with pattern recognition.",
      tradeoffsThatMatter: ["speed versus tolerability"]
    },
    exampleRequirement: {
      minimumExamplesPerPage: 2,
      plannedExamples: [
        { sectionId: "S1_hero", contextType: "category", purpose: "Recurring jawline acne versus occasional forehead bumps." },
        { sectionId: "S1_hero", contextType: "india_market", purpose: "Humid-weather routine tradeoffs." }
      ]
    },
    humanDevices: {
      decisionFramework: { required: true, selectedFormat: "if_this_then_that" },
      commonMistakes: {
        required: true,
        mistakesToCover: [{ sectionId: "S1_hero", mistake: "Using harsher cleansers.", betterWayToThink: "Identify the trigger first." }]
      },
      notRightForYou: {
        required: true,
        conditions: [{ condition: "Painful recurring acne", reason: "Needs expert attention.", saferAlternativeOrNextStep: "Consult a dermatologist." }]
      },
      brandPov: { mode: "clear_not_salesy", firstPerson: "occasional", statement: "Our view is that treatment should start with understanding the acne pattern." },
      finalClosingBeforeCta: { required: true, plannedClosing: "If you are unsure what is triggering your acne, start with a skin analysis before changing another product." }
    },
    qaSummary: { includeInEditorialQaReport: true }
  };
}

function completedClaimPlan(): Record<string, unknown> {
  return {
    schemaVersion: "claim-first-section-plan.v2",
    status: "draft",
    sectionPlanTemplate: { requiredFields: ["sectionId", "sectionClaim"] },
    sections: [
      {
        sectionId: "S1_hero",
        sectionClaim: "Acne treatment works better when the reader first identifies the acne pattern.",
        readerQuestion: "Why did my previous acne products not work?",
        evidenceNeeded: ["Source-backed acne type or trigger guidance."],
        exampleOrTradeoff: "Recurring jawline acne may need a different path from occasional forehead bumps.",
        caveatOrNotRightForYou: "Do not treat painful or worsening acne casually.",
        decisionPurpose: "Help the reader choose diagnosis-first action.",
        transitionPurpose: "Move from background explanation to decision framework."
      }
    ]
  };
}

function completedSerpLedger(): Record<string, unknown> {
  return {
    schemaVersion: "serp-research-ledger.v2",
    analyzedSources: Array.from({ length: 10 }, (_, index) => ({
      url: `https://example.com/serp-${index + 1}`,
      sourceType: "article",
      extractionStatus: "success",
      bodySummary: "This source gives a detailed explanation of acne treatment choices, decision criteria, product tolerance, and when users should seek expert guidance.",
      h2h3Outline: ["Treatment types", "Decision criteria"]
    })),
    contentGapSynthesis: {
      gaps: ["Competitors do not connect acne pattern to next-step selection."],
      differentiationOpportunities: ["Add a diagnosis-first decision framework."]
    },
    judgmentChecks: { passed: true }
  };
}

function completedSocialVideoResearch(): Record<string, unknown> {
  return {
    schemaVersion: "social-video-research.v2",
    assets: Array.from({ length: 7 }, (_, index) => ({
      id: `V${index + 1}`,
      accessStatus: index < 5 ? "reviewed" : "inaccessible",
      failureReason: index < 5 ? undefined : "No transcript available."
    })),
    insights: ["Users worry that strong products will worsen irritation."],
    judgmentChecks: { passed: true }
  };
}

function completedAudienceDefinition(): Record<string, unknown> {
  return {
    schemaVersion: "audience-definition.v2",
    targetCohort: "Indian adults comparing acne treatment options",
    awarenessStage: "problem-aware",
    readerTakeaway: "Identify the acne pattern before choosing another treatment.",
    objections: ["I do not know which ingredient is right for me."],
    ctaConnection: "The skin analysis gives a practical next step.",
    judgmentChecks: { passed: true }
  };
}

function completedNarrativeBrief(): Record<string, unknown> {
  return {
    schemaVersion: "narrative-brief.v2",
    primaryStyle: "category-manager-with-editorial-empathy",
    openingAngle: "Start from acne pattern, not product strength.",
    brandPov: "ClearNest believes treatment should begin with visible pattern recognition.",
    pagePromise: "Help readers choose a safer acne-treatment path.",
    sectionDirections: [{ sectionId: "S1_hero", direction: "Give a direct, decision-first answer." }],
    judgmentChecks: { passed: true }
  };
}

function completedCitationSet(): Record<string, unknown> {
  return {
    schemaVersion: "citation-set.v2",
    claims: [
      { claim: "Acne treatment choice should consider breakout pattern and irritation tolerance.", strength: "high", sourceUrl: "https://example.com/source-1", approvalStatus: "not_required" }
    ],
    judgmentChecks: { passed: true }
  };
}

function completedDepthContract(): Record<string, any> {
  return {
    researchExtractionMatrix: {
      schemaVersion: "research-extraction-matrix.v2",
      extractedFacts: Array.from({ length: 40 }, (_, index) => ({
        id: `F${index + 1}`,
        claim: `Specific extracted fact ${index + 1}`,
        sourceUrl: `https://example.com/source-${Math.floor(index / 4) + 1}`,
        sourceRole: sourceRoleForFact(index),
        sectionRelevance: "S1_hero",
        evidenceType: "clinical_guidance",
        confidence: "medium",
        freshness: "current"
      }))
    },
    competitorDepthDelta: {
      schemaVersion: "competitor-depth-delta.v2",
      primaryKeyword: "acne treatment India",
      primarySerpTop5: Array.from({ length: 5 }, (_, index) => ({
        url: `https://competitor.example/page-${index + 1}`,
        rankingPosition: index + 1,
        strengthLabel: index < 2 ? "strong" : "moderate",
        scores: fullCompetitorScores(index < 2 ? 4 : 3),
        evidenceNotes: [
          "Strong intent match with acne treatment guidance.",
          "Useful structure but incomplete troubleshooting.",
          "Reader can act, though safety boundaries are thinner than needed."
        ],
        standoutAssets: index < 2 ? ["acne treatment comparison table"] : [],
        whyUsersMightStopSearching: index < 2 ? "It gives enough context for many acne treatment readers." : undefined
      })),
      secondaryKeywordSerps: [
        {
          keyword: "oily acne routine India",
          topPages: Array.from({ length: 3 }, (_, index) => ({
            url: `https://secondary.example/page-${index + 1}`,
            rankingPosition: index + 1,
            intentContribution: "Adds oily-acne sub-intent for the primary page.",
            usefulGap: "Does not connect routine changes to stop/switch rules."
          }))
        }
      ],
      competitors: Array.from({ length: 5 }, (_, index) => ({
        url: `https://competitor.example/page-${index + 1}`,
        coverageGaps: [`Gap ${index + 1}`]
      })),
      specificityImprovements: Array.from({ length: 10 }, (_, index) => ({
        sectionId: "S1_hero",
        improvement: `More specific improvement ${index + 1}`,
        competitorGapAddressed: `Gap ${index + 1}`
      }))
    },
    audiencePainPointLedger: {
      schemaVersion: "audience-pain-point-ledger.v2",
      signals: Array.from({ length: 20 }, (_, index) => ({
        id: `A${index + 1}`,
        sourceType: index % 2 === 0 ? "video" : "forum",
        audienceLanguage: `Real user concern ${index + 1}`,
        concernType: "objection",
        mappedSectionId: "S1_hero"
      }))
    },
    preDraftSynthesisBrief: {
      schemaVersion: "pre-draft-synthesis-brief.v2",
      wordCount: 650,
      searchIntent: "Readers want to choose acne treatment without worsening irritation.",
      audienceAnxieties: ["Choosing the wrong ingredient"],
      competitorGaps: ["Competitors skip decision rules for recurring acne."],
      recommendedAngle: "Diagnosis-first acne treatment decisions.",
      sectionPromises: [{ sectionId: "S1_hero", promise: "Explain why acne pattern changes the right treatment." }],
      evidenceInventory: ["F1", "F2", "F3"]
    },
    preDraftQualityBrief: {
      schemaVersion: "pre-draft-quality-brief.v2",
      status: "complete",
      searchIntent: "Readers want to identify their acne pattern, choose a safe India-specific first step, and know when not to self-treat.",
      subIntents: [
        "identify acne pattern",
        "understand likely triggers",
        "compare active ingredients",
        "avoid irritation",
        "India climate routine changes",
        "when to see a dermatologist"
      ],
      diagnosticPlan: [
        "acne pattern decision table",
        "trigger to first-step map",
        "not-right-for-you guidance",
        "dermatologist escalation checklist"
      ],
      indiaSpecificity: [
        "humid weather routine",
        "pollution and sunscreen buildup",
        "melanin-rich PIH risk",
        "lightweight SPF availability"
      ],
      safetyTrustPlan: [
        "reviewer credentials",
        "active ingredient stop rules",
        "pregnancy and irritation caveats",
        "source-backed references"
      ],
      standoutElement: {
        type: "decision_matrix",
        title: "Acne pattern to first-step matrix",
        whyCompetitorsMissIt: "Competitors explain routines but do not help readers classify the pattern before choosing actives."
      },
      brandConnection: "The skin analysis helps readers track acne, redness, and marks instead of guessing after every product change.",
      readerQuestionCoverage: [
        evidenceLinkedItem("What acne pattern do I have?", "S1_hero", ["F1", "A1"]),
        evidenceLinkedItem("Which trigger is most likely for recurring acne?", "S1_hero", ["F2", "A2"]),
        evidenceLinkedItem("Which active should I start with for oily acne-prone skin?", "S1_hero", ["F3", "A3"]),
        evidenceLinkedItem("Can I combine acne actives without irritating my skin?", "S1_hero", ["F4", "A4"]),
        evidenceLinkedItem("What if my skin burns after starting an acne active?", "S1_hero", ["F5", "A5"]),
        evidenceLinkedItem("When should I see a dermatologist for painful acne?", "S1_hero", ["F6", "A6"]),
        evidenceLinkedItem("How should India humidity change my acne routine?", "S1_hero", ["F7", "A7"]),
        evidenceLinkedItem("How long should I wait before switching acne products?", "S1_hero", ["F8", "A8"])
      ],
      recommendationSanityPlan: [
        evidenceLinkedItem("Every product or active recommendation must name its routine role.", "S1_hero", ["F9", "A9"]),
        evidenceLinkedItem("Every recommendation needs an avoid-if condition for irritation, pregnancy, or prescription acne care.", "S1_hero", ["F10", "A10"]),
        evidenceLinkedItem("Face-use suitability and source support must be checked before inclusion.", "S1_hero", ["F11", "A11"])
      ],
      claimRiskPlan: [
        evidenceLinkedItem("Cite clinically proven claims or rewrite them.", "S1_hero", ["F12", "A12"]),
        evidenceLinkedItem("Use dermatologist-reviewed only when reviewer proof exists.", "S1_hero", ["F13", "A13"]),
        evidenceLinkedItem("Avoid safest scoring claims unless methodology and evidence source are included.", "S1_hero", ["F14", "A14"]),
        evidenceLinkedItem("Cite non-comedogenic claims with product label or source evidence.", "S1_hero", ["F15", "A15"]),
        evidenceLinkedItem("Limit AI scan claims to supported tracking language.", "S1_hero", ["F16", "A16"])
      ],
      troubleshootingPlan: [
        evidenceLinkedItem("If new bumps appear, stop the new active and switch to a basic cleanser while monitoring.", "S1_hero", ["F17", "A17"]),
        evidenceLinkedItem("If skin feels tight, reduce cleansing frequency and repair the barrier before adding actives.", "S1_hero", ["F18", "A18"]),
        evidenceLinkedItem("If redness increases, pause exfoliating products and seek guidance if irritation persists.", "S1_hero", ["F19", "A19"]),
        evidenceLinkedItem("When acne becomes painful or cystic, stop experimenting and seek medical advice.", "S1_hero", ["F20", "A20"])
      ],
      brandCtaFit: {
        readerProblem: "The reader needs a way to track whether acne, redness, and marks are improving after routine changes.",
        supportedCtaPromise: "MyMirror can help compare visible acne, redness, and mark changes over time.",
        unsupportedClaimsToAvoid: ["Diagnosing acne subtype without clinician review", "Guaranteeing treatment outcome"]
      },
      researchDerivedStructurePlan: researchDerivedStructurePlan(),
      intentDimensions: [
        intentDimension("D1", "diagnosis", 1, ["https://competitor.example/page-1", "F1", "A1"]),
        intentDimension("D2", "India product fit", 2, ["https://competitor.example/page-2", "https://secondary.example/page-1", "F2"]),
        intentDimension("D3", "troubleshooting", 3, ["https://competitor.example/page-3", "A2", "F3"]),
        intentDimension("D4", "safe recommendation boundaries", 4, ["https://competitor.example/page-4", "F4", "A3"])
      ],
      superiorityComponents: [
        {
          id: "decision-tree-acne-patterns",
          componentType: "decision_tree",
          title: "Acne pattern decision tree",
          researchBasis: "Primary competitors explain treatments but do not map reader symptoms to safe next steps.",
          sourceRefs: ["https://competitor.example/page-1", "https://secondary.example/page-1", "A1", "F1"],
          mappedSectionId: "S1_hero",
          intentDimensionSupported: "D1",
          competitorGapAddressed: "Top pages lack a visible diagnosis-first decision component.",
          whyThisIsInformationGain: "It changes the reader's first action before picking actives.",
          competitorComponentComparison: {
            comparisonPath: "beat_existing_component",
            competitorsReviewed: ["https://competitor.example/page-1"],
            whyOursIsBetterOrNeeded: "The competitor table lists options; our tree maps patterns to next actions."
          },
          finalCopyBlock: "Markdown decision tree with pattern, likely next step, and stop rule.",
          imageOrInteractiveNeed: "Can be rendered as a table or visual flow.",
          fallbackContent: "Static markdown decision tree.",
          primaryReaderJob: "Decide whether to self-adjust or seek expert care.",
          brandFit: "MyMirror can support visual change tracking without diagnosing acne.",
          naturalCtaConnection: "soft",
          unsupportedBrandClaimsToAvoid: ["diagnosing acne", "guaranteeing treatment outcome"]
        }
      ],
      differentiatedImprovements: Array.from({ length: 5 }, (_, index) => ({
        improvement: `Differentiated improvement ${index + 1} adds a visible reader-useful decision detail.`,
        sourceRefs: [
          `https://competitor.example/page-${index + 1}`,
          index === 0 ? "https://secondary.example/page-1" : `F${index + 1}`,
          `A${index + 1}`
        ],
        intentDimension: `D${Math.min(index + 1, 4)}`,
        competitorOrUserGapAddressed: `Competitor or user gap ${index + 1}`,
        mappedSectionId: index < 3 ? "S1_hero" : "S2_context",
        visibleOutputType: index === 0 ? "table" : "copy",
        finalOutputLocation: "S1_hero final copy",
        finalCopyEvidence: `Visible differentiated improvement ${index + 1} is present.`,
        whyDifferentiated: `This goes beyond restating the SERP by adding action ${index + 1}.`
      })),
      extractableAnswerBlocks: [
        extractableAnswer("quick_answer", "S1_hero", ["https://competitor.example/page-1", "F6", "A6"]),
        extractableAnswer("decision_action", "S1_hero", ["https://secondary.example/page-2", "F7", "A7"]),
        extractableAnswer("troubleshooting_safety", "S1_hero", ["F8", "A8", "https://competitor.example/page-2"])
      ],
      aiOverviewTargets: [
        "direct answer block",
        "ingredient comparison table",
        "when-to-see-dermatologist FAQ"
      ],
      internalLinkPlan: [
        "acne types guide",
        "salicylic acid guide",
        "niacinamide guide",
        "sunscreen guide",
        "skin barrier repair guide"
      ]
    },
    pageDepthScore: {
      schemaVersion: "page-depth-score.v2",
      overallScore: 88,
      dimensions: {
        searchIntentCoverage: 5,
        serpGapCoverage: 4,
        socialPainPointCoverage: 4,
        topicalEntityCompleteness: 5,
        brandProductSpecificity: 4,
        evidenceCitationQuality: 5,
        originalInsightUsefulness: 4,
        structureReadability: 5,
        conversionUsefulness: 4,
        technicalSeoCompleteness: 4
      },
      informationGainItems: Array.from({ length: 8 }, (_, index) => `Information gain item ${index + 1}`),
      sectionEvidenceBudgets: [
        {
          sectionId: "S1_hero",
          facts: ["Fact 1", "Fact 2"],
          citedClaims: ["Claim 1"],
          usefulnessItems: ["Decision rule 1"]
        }
      ]
    }
  };
}

function evidenceLinkedItem(item: string, mappedSectionId: string, sourceRefs: string[]): Record<string, unknown> {
  return {
    item,
    sourceRefs,
    mappedSectionId,
    whyThisMatters: `${item} matters because it changes the reader decision.`,
    finalCopyUse: `Use this in ${mappedSectionId} to make the final copy more specific.`
  };
}

function researchDerivedStructurePlan(): Record<string, unknown> {
  return {
    primaryUserConcern: "What acne pattern am I dealing with before I choose another product?",
    primaryConcernVisibleBySectionId: "S1_hero",
    primaryConcernVisibleBySectionIndex: 1,
    importantInformationNotBuried: true,
    scanPriorityRationale: "Audience signals ask how to identify the breakout pattern, so classification appears before ingredient detail.",
    sectionOrderRationale: "The page opens with pattern recognition and then moves into context, decision support, and evidence-backed next steps.",
    sections: [
      {
        sectionId: "S1_hero",
        sectionRole: "quick answer",
        sectionAction: "expand",
        targetSectionTitle: "Start by identifying the acne pattern",
        whyThisSectionExists: "Readers ask pattern-identification questions while competitors move too quickly into product choices.",
        sourceRefs: ["F1", "F2", "A1", "https://competitor.example/page-1"],
        intentDimensionRefs: ["D1"],
        competitorOrUserGap: "Competitor acne pages discuss treatments before giving readers a scannable pattern check.",
        expectedVisibleOutput: "Quick answer block that tells readers to classify acne pattern before changing products.",
        competitorGapRefs: ["https://competitor.example/page-1"],
        audienceLanguageRefs: ["A1"],
        trustCitationRefs: ["F1"],
        finalCopyUse: "Open with acne-pattern classification instead of a generic treatment introduction.",
        finalCopyAcceptanceCheck: "Final copy includes a near-top answer naming acne pattern as the first decision.",
        scanPriority: "top",
        readerQuestionAnswered: "What kind of acne pattern am I dealing with?",
        differentiatesFromPageIds: ["previous-acne-treatment-template"]
      },
      {
        sectionId: "S2_context",
        sectionRole: "context",
        sectionAction: "expand",
        targetSectionTitle: "Why pattern and tolerance change the next step",
        whyThisSectionExists: "Search and audience sources show readers need context on irritation tolerance before choosing actives.",
        sourceRefs: ["F1", "F3", "A2", "https://competitor.example/page-2"],
        intentDimensionRefs: ["D3"],
        competitorOrUserGap: "Competitors list acne actives without enough stop or switch boundaries for irritated readers.",
        expectedVisibleOutput: "Context paragraph linking pattern, tolerance, and safer next action.",
        competitorGapRefs: ["https://competitor.example/page-2"],
        audienceLanguageRefs: ["A2"],
        trustCitationRefs: ["F1"],
        finalCopyUse: "Explain why the next step changes when irritation tolerance is low.",
        finalCopyAcceptanceCheck: "Final copy links acne pattern and irritation tolerance to the next step.",
        scanPriority: "supporting",
        readerQuestionAnswered: "Why should I not just pick a stronger acne active?",
        differentiatesFromPageIds: ["previous-acne-treatment-template"]
      }
    ],
    highImpactComponents: [
      {
        componentType: "decision_tree",
        mappedSectionId: "S1_hero",
        readerJob: "Classify the visible acne pattern before picking an active or routine change.",
        whyThisComponentExists: "Primary competitors and audience signals show readers need a diagnosis-first action path.",
        sourceRefs: ["F1", "F2", "A1", "https://competitor.example/page-1"],
        intentDimensionRefs: ["D1"],
        competitorOrAudienceGapAddressed: "Top competitors list treatments but do not give a visible pattern-to-action tree.",
        competitorGapRefs: ["https://competitor.example/page-1"],
        audienceLanguageRefs: ["A1"],
        trustCitationRefs: ["F1"],
        visibleReaderBenefit: "Readers can scan the pattern and choose a safer first step before comparing products.",
        notGenericReason: "This component is built from acne-pattern questions and competitor gaps, not a generic product table.",
        columnsOrSteps: ["visible pattern", "likely reader concern", "first safe next step", "when to stop guessing"],
        whyThisShape: "A decision tree mirrors the reader's pattern-classification task.",
        expectedVisibleOutput: "Markdown decision tree with pattern, next step, and stop rule.",
        finalCopyAcceptanceCheck: "Final copy includes the decision tree with pattern-to-action guidance."
      }
    ],
    structureDecisions: [
      {
        sectionId: "S1_hero",
        sectionAction: "expand",
        targetSectionTitle: "Start by identifying the acne pattern",
        sourceRefs: ["F1", "F2", "A1", "https://competitor.example/page-1"],
        competitorOrUserGap: "Competitor acne pages begin with treatment categories instead of the reader's pattern question.",
        whyThisStructureIsNeeded: "Readers need acne pattern classification before comparing product strength or routine changes.",
        expectedVisibleOutput: "Near-top quick answer and decision tree.",
        finalCopyAcceptanceCheck: "Final copy puts the acne-pattern answer visibly near the top."
      }
    ],
    structureComparison: {
      comparedCurrentBatchPageIds: ["P0"],
      comparedHistoricalPageIds: ["previous-acne-treatment-template"],
      reusedStructureRisk: "low",
      materialDifferences: [
        "The page opens with acne-pattern classification rather than product categories.",
        "The superiority component is a decision tree mapped to the primary intent."
      ]
    }
  };
}

function sourceRoleForFact(index: number): string {
  if (index === 0) return "trust_citation_source";
  if (index === 1) return "long_tail_source";
  if (index === 2) return "paa_source";
  if (index === 3) return "ai_overview_source";
  return "trust_citation_source";
}

function fullCompetitorScores(baseScore: number): Record<string, { score: number; evidence: string }> {
  const dimensions = [
    "intentMatch",
    "topIntentCoverage",
    "depthAndSpecificity",
    "decisionUsefulness",
    "informationArchitecture",
    "evidenceAndTrust",
    "originalityInformationGain",
    "audienceSpecificity",
    "riskHandling",
    "practicalCompleteness",
    "uxPageExperience"
  ];
  return Object.fromEntries(dimensions.map((dimension) => [
    dimension,
    {
      score: dimension === "intentMatch" || dimension === "topIntentCoverage" ? Math.max(baseScore, 4) : baseScore,
      evidence: `${dimension} evidence note from reviewed competitor page.`
    }
  ]));
}

function intentDimension(id: string, label: string, priority: number, sourceRefs: string[]): Record<string, unknown> {
  return {
    id,
    label,
    priority,
    sourceRefs,
    plannedWin: `${label} will beat competitors with specific, visible decision support.`,
    competitorBenchmark: `${label} is only partially handled in the current SERP.`
  };
}

function extractableAnswer(blockType: string, mappedSectionId: string, sourceRefs: string[]): Record<string, unknown> {
  return {
    blockType,
    answer: `${blockType} answer gives a concise, safer, reader-friendly response with keyword context.`,
    sourceRefs,
    mappedSectionId,
    keywordUse: ["acne treatment India"],
    aiOverviewDelta: "Adds safety boundaries and human troubleshooting that AI Overview oversimplifies."
  };
}

function completedFinalCopySuperiorityProof(): Record<string, unknown> {
  return {
    intentWinsDelivered: [
      deliveredIntentWin("D1", "S1_hero", ["F1"]),
      deliveredIntentWin("D2", "S1_hero", ["F2"]),
      deliveredIntentWin("D3", "S1_hero", ["F3"]),
      deliveredIntentWin("D4", "S1_hero", ["F4"])
    ],
    superiorityComponentsDelivered: [
      {
        componentId: "decision-tree-acne-patterns",
        sectionId: "S1_hero",
        visibleOutputType: "decision_tree",
        finalCopyEvidence: "acne pattern decision tree"
      }
    ],
    differentiatedImprovementsDelivered: Array.from({ length: 5 }, (_, index) => ({
      improvementId: `DI${index + 1}`,
      sectionId: "S1_hero",
      visibleOutputType: index === 0 ? "table" : "copy",
      finalCopyEvidence: "acne pattern"
    })),
    extractableAnswerBlocksDelivered: [
      deliveredAnswer("quick_answer", "S1_hero"),
      deliveredAnswer("decision_action", "S1_hero"),
      deliveredAnswer("troubleshooting_safety", "S1_hero")
    ],
    visibleCitationHandling: [
      {
        claim: "Acne treatment choices should consider breakout pattern and irritation tolerance.",
        claimImportance: "important",
        sourceRefs: ["F1"],
        finalCopyEvidence: "cautious source-backed claim handling"
      }
    ],
    whyThisDeservesToRank: "This page deserves to compete because it beats the SERP on diagnosis, decision support, safer acne guidance, and visible pattern tracking with a custom decision tree."
  };
}

function deliveredIntentWin(intentDimensionId: string, sectionId: string, evidenceRefs: string[]): Record<string, unknown> {
  return {
    intentDimensionId,
    sectionId,
    evidenceRefs,
    finalCopyEvidence: "acne pattern"
  };
}

function deliveredAnswer(blockType: string, sectionId: string): Record<string, unknown> {
  return {
    blockType,
    sectionId,
    finalCopyEvidence: "quick answer block"
  };
}
