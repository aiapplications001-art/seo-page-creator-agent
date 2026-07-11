import test from "node:test";
import assert from "node:assert/strict";
import {
  mergeFinalCopyDraft,
  validateFinalCopyDraft,
  type FinalCopyDraft
} from "../src/lib/v2/final-copy-draft.js";
import type { PagePacket } from "../src/lib/page-packet.js";

test("merges adapter-written final copy into matching packet sections", () => {
  const draft = validDraft();

  const expanded = mergeFinalCopyDraft(packet, draft);

  assert.equal(expanded.metadata.copyStatus, "adapter_written_review_ready");
  assert.match(
    expanded.sections.find((section) => section.id === "S2_quick_answer")?.markdown ?? "",
    /Acne treatment choices depend on breakout pattern/
  );
  assert.match(
    expanded.sections.find((section) => section.id === "S10_references")?.markdown ?? "",
    /ClearNest research note: https:\/\/example.com\/source-1/
  );
  assert.equal(
    expanded.machineReadable.sections.find((section) => section.id === "S3_context")?.markdown,
    expanded.sections.find((section) => section.id === "S3_context")?.markdown
  );
});

test("rejects placeholder and generic scaffold prose", () => {
  const draft = validDraft();
  draft.sections[1].markdown = "Use this section to explain why acne treatment matters.";

  const result = validateFinalCopyDraft(draft, packet);

  assert.equal(result.status, "failed");
  assert.match(result.blockingIssues.join("\n"), /generic scaffold prose/i);
});

test("rejects visible informational sections without evidence references", () => {
  const draft = validDraft();
  draft.sections[1].evidenceRefs = [];

  const result = validateFinalCopyDraft(draft, packet);

  assert.equal(result.status, "failed");
  assert.match(result.blockingIssues.join("\n"), /S2_quick_answer: final copy section requires evidenceRefs/);
});

test("rejects references section when real source records are missing", () => {
  const draft = validDraft();
  draft.references = [];

  const result = validateFinalCopyDraft(draft, packet);

  assert.equal(result.status, "failed");
  assert.match(result.blockingIssues.join("\n"), /References section requires at least one real source record/);
});

test("rejects final copy when post-draft superiority proof is missing", () => {
  const draft = validDraft();
  delete draft.superiorityProof;

  const result = validateFinalCopyDraft(draft, packet);

  assert.equal(result.status, "failed");
  assert.match(result.blockingIssues.join("\n"), /Final copy superiority proof is required/);
});

test("rejects final copy when superiority proof evidence is not visible in markdown", () => {
  const draft = validDraft();
  draft.superiorityProof!.intentWinsDelivered![0]!.finalCopyEvidence = "invisible promised superiority snippet";

  const result = validateFinalCopyDraft(draft, packet);

  assert.equal(result.status, "failed");
  assert.match(result.blockingIssues.join("\n"), /finalCopyEvidence must be a visible snippet/);
});

test("rejects final copy when research-derived primary concern is not delivered", () => {
  const draft = validDraft();
  draft.structurePlanDeliveryProof!.primaryConcernDelivered!.finalCopyEvidence = "invisible primary concern answer";

  const result = validateFinalCopyDraft(draft, packet, {
    expectedQualityBrief: expectedQualityBriefWithStructurePlan()
  });

  assert.equal(result.status, "failed");
  assert.match(result.blockingIssues.join("\n"), /must deliver the research-derived primary user concern/);
});

test("rejects final copy when promised high-impact structure component is absent", () => {
  const draft = validDraft();
  draft.structurePlanDeliveryProof!.highImpactComponentsDelivered = [];

  const result = validateFinalCopyDraft(draft, packet, {
    expectedQualityBrief: expectedQualityBriefWithStructurePlan()
  });

  assert.equal(result.status, "failed");
  assert.match(result.blockingIssues.join("\n"), /must deliver every high-impact component promised by researchDerivedStructurePlan/);
});

test("rejects final copy when structure proof snippet does not match the promised output", () => {
  const draft = validDraft();
  draft.structurePlanDeliveryProof!.highImpactComponentsDelivered![0].finalCopyEvidence = "Recurring jawline acne and occasional clogged-pore bumps";

  const result = validateFinalCopyDraft(draft, packet, {
    expectedQualityBrief: expectedQualityBriefWithStructurePlan()
  });

  assert.equal(result.status, "failed");
  assert.match(result.blockingIssues.join("\n"), /must visibly match the promised research-derived output/);
});

test("rejects final copy when promised structure decision output is absent", () => {
  const draft = validDraft();
  draft.structurePlanDeliveryProof!.expectedVisibleOutputsDelivered = [
    {
      mappedSectionId: "S3_context",
      finalCopyEvidence: "maps symptoms to next actions"
    }
  ];

  const qualityBrief = expectedQualityBriefWithStructurePlan();
  qualityBrief.researchDerivedStructurePlan.structureDecisions = [
    {
      sectionId: "S3_context",
      expectedVisibleOutput: "Escalation checklist tells readers when to stop guessing",
      finalCopyAcceptanceCheck: "Final copy includes an escalation checklist."
    }
  ];

  const result = validateFinalCopyDraft(draft, packet, {
    expectedQualityBrief: qualityBrief
  });

  assert.equal(result.status, "failed");
  assert.match(result.blockingIssues.join("\n"), /must deliver every structure decision promised by researchDerivedStructurePlan/);
});

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
    primaryKeyword: "acne treatment",
    secondaryKeywords: ["acne marks treatment"],
    ogTitle: "Acne Treatment Category Page | ClearNest",
    ogDescription: "Acne Treatment Category Page for Indian adults with visible acne.",
    twitterTitle: "Acne Treatment Category Page | ClearNest",
    twitterDescription: "Acne Treatment Category Page for Indian adults with visible acne."
  },
  authorship: {
    author: { name: "ClearNest Editorial Team", descriptor: "Skin care editorial team" },
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
    { id: "S2_quick_answer", heading: "Quick Answer", role: "seo", markdown: "Editable section scaffold for Quick Answer." },
    { id: "S3_context", heading: "Context", role: "ux", markdown: "Editable section scaffold for Context." },
    { id: "S10_references", heading: "References", role: "reference", markdown: "Add reference URLs after live search." }
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

function validDraft(): FinalCopyDraft {
  return {
    schemaVersion: "final-copy-draft.v2",
    adapter: "antigravity",
    generatedAt: "2026-07-02T10:00:00.000Z",
    sections: [
      {
        sectionId: "S1_hero",
        markdown: "ClearNest helps readers decide what kind of acne pattern they are dealing with before changing another product.",
        evidenceRefs: ["F1"],
        citationClaimIds: ["C1"],
        audienceSignalIds: ["A1"]
      },
      {
        sectionId: "S2_quick_answer",
        markdown: "Acne treatment choices depend on breakout pattern, tolerance, and how quickly the reader needs visible change. Quick answer block: start with acne pattern before changing products.",
        evidenceRefs: ["F2"],
        citationClaimIds: ["C2"],
        audienceSignalIds: ["A2"]
      },
      {
        sectionId: "S3_context",
        markdown: "Recurring jawline acne and occasional clogged-pore bumps often need different next steps, so the page starts with pattern recognition. The acne pattern decision tree maps symptoms to next actions. Differentiated improvement 1 is present. Differentiated improvement 2 is present. Differentiated improvement 3 is present. Differentiated improvement 4 is present. Differentiated improvement 5 is present.",
        evidenceRefs: ["F3"],
        citationClaimIds: ["C3"],
        audienceSignalIds: ["A3"],
        standoutElementRefs: ["decision-tree-acne-patterns"]
      },
      {
        sectionId: "S10_references",
        markdown: "References are generated from reviewed source records.",
        evidenceRefs: ["F1", "F2", "F3"],
        citationClaimIds: ["C1", "C2", "C3"]
      }
    ],
    references: [
      {
        sourceUrl: "https://example.com/source-1",
        label: "ClearNest research note",
        claimIds: ["C1"]
      }
    ],
    standoutElements: [
      {
        id: "decision-tree-acne-patterns",
        type: "decision_tree",
        title: "Acne pattern decision tree"
      }
    ],
    superiorityProof: {
      intentWinsDelivered: [
        deliveredIntentWin("D1", "S2_quick_answer", ["F1"]),
        deliveredIntentWin("D2", "S3_context", ["F2"]),
        deliveredIntentWin("D3", "S3_context", ["F3"]),
        deliveredIntentWin("D4", "S2_quick_answer", ["F1", "F2"])
      ],
      superiorityComponentsDelivered: [
        {
          componentId: "decision-tree-acne-patterns",
          sectionId: "S3_context",
          visibleOutputType: "decision_tree",
          finalCopyEvidence: "acne pattern decision tree"
        }
      ],
      differentiatedImprovementsDelivered: Array.from({ length: 5 }, (_, index) => ({
        improvementId: `DI${index + 1}`,
        sectionId: index < 3 ? "S3_context" : "S2_quick_answer",
        visibleOutputType: index === 0 ? "table" : "copy",
        finalCopyEvidence: index < 3 ? `Differentiated improvement ${index + 1} is present` : "Quick answer block"
      })),
      extractableAnswerBlocksDelivered: [
        deliveredAnswer("quick_answer", "S2_quick_answer"),
        deliveredAnswer("decision_action", "S3_context"),
        deliveredAnswer("troubleshooting_safety", "S3_context")
      ],
      visibleCitationHandling: [
        {
          claim: "Acne treatment choices depend on breakout pattern and tolerance.",
          claimImportance: "important",
          sourceRefs: ["F2"],
          finalCopyEvidence: "Acne treatment choices depend on breakout pattern, tolerance"
        }
      ],
      whyThisDeservesToRank: "This page deserves to compete because it beats the SERP on diagnosis, decision support, safer acne guidance, and visible pattern tracking with a custom decision tree."
    },
    structurePlanDeliveryProof: {
      primaryConcernDelivered: {
        sectionId: "S2_quick_answer",
        finalCopyEvidence: "Acne treatment choices depend on breakout pattern"
      },
      highImpactComponentsDelivered: [
        {
          componentType: "decision_tree",
          mappedSectionId: "S3_context",
          finalCopyEvidence: "acne pattern decision tree"
        }
      ],
      expectedVisibleOutputsDelivered: [
        {
          mappedSectionId: "S3_context",
          finalCopyEvidence: "maps symptoms to next actions"
        },
        {
          mappedSectionId: "S3_context",
          finalCopyEvidence: "acne pattern decision tree"
        }
      ],
      structureDecisionsDelivered: [
        {
          sectionId: "S3_context",
          finalCopyEvidence: "maps symptoms to next actions"
        }
      ]
    },
    qaNotes: ["Draft is adapter-written and evidence-backed."]
  };
}

function expectedQualityBriefWithStructurePlan(): any {
  return {
    intentDimensions: [
      { id: "D1", priority: 1 },
      { id: "D2", priority: 2 },
      { id: "D3", priority: 3 },
      { id: "D4", priority: 4 }
    ],
    superiorityComponents: [
      { id: "decision-tree-acne-patterns" }
    ],
    researchDerivedStructurePlan: {
      primaryUserConcern: "Which acne pattern needs which next step?",
      primaryConcernVisibleBySectionId: "S2_quick_answer",
      highImpactComponents: [
        {
          componentType: "decision_tree",
          mappedSectionId: "S3_context",
          expectedVisibleOutput: "Decision tree maps symptoms to next actions"
        }
      ],
      structureDecisions: [
        {
          sectionId: "S3_context",
          expectedVisibleOutput: "Decision tree maps symptoms to next actions",
          finalCopyAcceptanceCheck: "Final copy includes the decision tree."
        }
      ]
    }
  };
}

function deliveredIntentWin(intentDimensionId: string, sectionId: string, evidenceRefs: string[]) {
  return {
    intentDimensionId,
    sectionId,
    evidenceRefs,
    finalCopyEvidence: sectionId === "S2_quick_answer" ? "Acne treatment choices depend on breakout pattern" : "pattern recognition"
  };
}

function deliveredAnswer(blockType: string, sectionId: string) {
  return {
    blockType,
    sectionId,
    finalCopyEvidence: sectionId === "S2_quick_answer" ? "Quick answer block" : "acne pattern decision tree"
  };
}
