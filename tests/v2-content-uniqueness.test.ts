import assert from "node:assert/strict";
import { test } from "node:test";
import { validateBatchContentUniqueness } from "../src/lib/v2/content-uniqueness.js";
import type { PageContentForUniqueness } from "../src/lib/v2/content-uniqueness.js";

test("fails when batch pages reuse the same body template despite different hooks", () => {
  const result = validateBatchContentUniqueness([
    page("P1", "Texture smoothing routine", "Texture smoothing hook for Indian acne-prone skin.", sharedBodySections()),
    page("P2", "Double cleansing routine", "Double cleansing hook for oily acne-prone skin.", sharedBodySections())
  ]);

  assert.equal(result.status, "failed");
  assert.match(result.blockingIssues.join("\n"), /Shared body templates across pages are not allowed/);
  assert.match(result.blockingIssues.join("\n"), /Matrix, mistakes, troubleshooting, decision, and CTA content must be custom/);
  assert.ok(result.comparisons[0].sharedBodySimilarity > 0.9);
  assert.equal(result.comparisons[0].repeatedLongSectionCount, 5);
});

test("passes when page bodies use distinct section copy and decision content", () => {
  const result = validateBatchContentUniqueness([
    page("P1", "Texture smoothing routine", "Texture smoothing hook.", [
      section("S3_diagnosis", "Diagnosis", "Texture smoothing readers need to separate pitted marks, closed comedones, flaky retinoid irritation, and makeup settling before choosing a routine. The page explains how to inspect pores after cleansing, what changes after sunscreen, and when a dermatologist is the safer next step."),
      section("S4_matrix", "Residue-to-action matrix", "If cheeks feel rough but the T-zone is oily, use a low-strength leave-on exfoliant twice weekly. If makeup clings around active acne, stop scrubs and repair barrier first. If pits cast shadows in side light, skincare can support tone but procedures may be needed."),
      section("S5_troubleshooting", "Troubleshooting", "Trigger: stinging after every active. Action: pause exfoliation for one week, use a bland moisturiser, and restart only one active at a time. Trigger: new bumps after heavy cream. Action: simplify the night routine and check for occlusive layering."),
      section("S8_cta", "Brand fit", "MyMirror can help readers compare texture photos over time and decide whether the next step is routine adjustment, product suitability review, or professional support.")
    ]),
    page("P2", "Double cleansing routine", "Double cleansing hook.", [
      section("S3_diagnosis", "Oil and residue check", "Double cleansing readers need to know whether the problem is sunscreen film, cleanser residue, hard-water tightness, or over-washing. The page teaches a two-minute rinse test and explains why squeaky skin is not the goal for acne-prone skin."),
      section("S4_matrix", "Cleanser fit matrix", "If sunscreen beads under the second cleanse, switch to a lighter first cleanser. If cheeks burn after gel cleanser, reduce contact time. If jawline bumps follow balm use, patch test the balm and avoid fragranced or heavy wax textures."),
      section("S5_troubleshooting", "Troubleshooting", "Trigger: oil returns within an hour. Action: avoid adding a third cleanse and review moisturiser weight. Trigger: whiteheads after starting balm. Action: stop the balm for ten days and reintroduce only if bumps settle."),
      section("S8_cta", "Brand fit", "MyMirror can help readers track whether fewer residue-related bumps appear after changing cleanser type, rinse time, or sunscreen texture.")
    ])
  ]);

  assert.equal(result.status, "passed");
  assert.equal(result.blockingIssues.length, 0);
  assert.ok(result.comparisons[0].sharedBodySimilarity < 0.5);
});

test("fails when pages reuse the same page structure even with different copy", () => {
  const result = validateBatchContentUniqueness([
    page("P1", "Texture smoothing routine", "Texture smoothing hook.", [
      section("S3_diagnosis", "Diagnosis", "Separate pitted marks from flakes and bumps before choosing actives for texture smoothing.", "diagnostic sorter"),
      section("S4_matrix", "Decision matrix", "Map rough cheeks, makeup cling, and shadow-like pits to different skincare or dermatologist actions.", "decision tool"),
      section("S5_mistakes", "Common mistakes", "Avoid scrubs, stacked exfoliants, and changing sunscreen while judging texture progress.", "mistake prevention"),
      section("S6_troubleshooting", "Troubleshooting", "If stinging starts, pause acids and rebuild barrier before restarting a lower frequency.", "trigger action troubleshooting"),
      section("S8_cta", "Brand fit", "Track texture photos in MyMirror to judge whether the routine is changing bumps or just lighting.", "reader first brand bridge")
    ]),
    page("P2", "Double cleansing routine", "Double cleansing hook.", [
      section("S3_diagnosis", "Diagnosis", "Separate sunscreen film from cleanser tightness and balm breakouts before changing products.", "diagnostic sorter"),
      section("S4_matrix", "Decision matrix", "Map residue, tight cheeks, and jawline bumps to cleanser texture, rinse time, or balm removal changes.", "decision tool"),
      section("S5_mistakes", "Common mistakes", "Avoid triple cleansing, harsh foaming cleansers, fragranced balms, and skipping moisturiser.", "mistake prevention"),
      section("S6_troubleshooting", "Troubleshooting", "If whiteheads appear after balm, stop it for ten days and restart only if bumps settle.", "trigger action troubleshooting"),
      section("S8_cta", "Brand fit", "Track residue-linked bumps in MyMirror after changing cleanser texture or rinse duration.", "reader first brand bridge")
    ])
  ], {
    requireResearchDerivedStructure: true,
    requireDistinctPageStructure: true
  });

  assert.equal(result.status, "failed");
  assert.match(result.blockingIssues.join("\n"), /page structure similarity/);
  assert.match(result.blockingIssues.join("\n"), /page structure repeats the same body section pattern/);
  assert.equal(result.comparisons[0].repeatedStructure, true);
});

test("fails when structure is not traceable to page-specific research", () => {
  const result = validateBatchContentUniqueness([
    {
      pageId: "P1",
      title: "Texture smoothing routine",
      slug: "texture-smoothing-routine",
      sections: [
        section("S3_diagnosis", "Diagnosis", "This page has a section but no structure rationale or research refs.")
      ]
    }
  ], {
    requireResearchDerivedStructure: true
  });

  assert.equal(result.status, "failed");
  assert.match(result.blockingIssues.join("\n"), /page structure must be research-derived/);
  assert.match(result.blockingIssues.join("\n"), /requires researchRefs/);
});

function page(
  pageId: string,
  title: string,
  hook: string,
  bodySections: PageContentForUniqueness["sections"]
): PageContentForUniqueness {
  return {
    pageId,
    title,
    slug: pageId.toLowerCase(),
    intentPattern: "diagnostic how-to",
    structureVariant: `research-derived-${pageId}`,
    researchDerivedStructureRationale: `Structure follows page-specific SERP, PAA, video, and forum gaps for ${pageId}.`,
    researchRefs: [`serp-${pageId}`, `paa-${pageId}`],
    sections: [
      section("S1_hero", "Hero", `# ${title}\n\n${hook}`),
      ...bodySections,
      section("S10_references", "References", "- Source records are listed in the page packet.")
    ]
  };
}

function sharedBodySections(): PageContentForUniqueness["sections"] {
  return [
    section("S3_main", "Main routine", "Start with the same morning and night routine for every concern. Use a gentle cleanser, one treatment serum, moisturiser, and sunscreen. Keep the steps simple for two weeks, avoid changing multiple products together, and compare skin response before adding anything stronger."),
    section("S4_matrix", "Decision matrix", "If the skin feels oily, choose a lightweight gel. If the skin feels dry, choose a cream. If breakouts continue, reduce actives. If irritation appears, pause products. Use this matrix to move from a symptom to a next step without overcomplicating the routine."),
    section("S5_mistakes", "Common mistakes", "The biggest mistakes are using too many actives, skipping sunscreen, scrubbing active acne, changing products too quickly, and expecting results overnight. Avoid these mistakes by keeping a stable routine and introducing one new product at a time."),
    section("S6_troubleshooting", "Troubleshooting", "Trigger: redness or stinging after product use. Action: stop the newest active and repair the barrier. Trigger: bumps keep appearing. Action: simplify the routine and check whether any heavy product is clogging skin. Trigger: dryness. Action: moisturise more consistently."),
    section("S8_cta", "CTA", "Use MyMirror to track your skin, compare progress, and decide what to adjust next. The brand helps you understand whether the routine is working and supports a calmer, more confident skincare decision.")
  ];
}

function section(
  sectionId: string,
  heading: string,
  markdown: string,
  sectionIntent?: string
): PageContentForUniqueness["sections"][number] {
  return { sectionId, heading, markdown, sectionIntent };
}
