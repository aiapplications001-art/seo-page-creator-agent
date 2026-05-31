import assert from "node:assert/strict";
import { test } from "node:test";
import {
  applyImageReadinessToState,
  createInitialV2PageState,
  markContentReady
} from "../src/lib/v2/state.js";
import {
  evaluateV2ImageReadiness,
  imageSlotComplete,
  requiredImageIds
} from "../src/lib/v2/image-readiness.js";

test("V2 image readiness requires OG and hero reserved slots", () => {
  assert.deepEqual(requiredImageIds(), ["IMG_OG", "IMG_HERO"]);

  const readiness = evaluateV2ImageReadiness({
    manifestGenerated: true,
    assets: [
      { id: "IMG_OG", assetType: "generated" },
      { id: "IMG_HERO", sectionId: "S1_hero", assetType: "generated" },
      { id: "IMG_02", sectionId: "S3_methodology", assetType: "generated" },
      { id: "IMG_03", sectionId: "S5_comparison", assetType: "prompt_only", promptOnlyAcceptedByUser: true }
    ]
  });

  assert.equal(readiness.requiredSlotsComplete, true);
  assert.equal(readiness.heroMappedToS1, true);
  assert.equal(readiness.inPageImageCount, 3);
  assert.equal(readiness.inPageImageTargetMet, true);
  assert.deepEqual(readiness.blockingIssues, []);
});

test("OG image is excluded from in-page image count but hero is included", () => {
  const readiness = evaluateV2ImageReadiness({
    manifestGenerated: true,
    assets: [
      { id: "IMG_OG", assetType: "generated" },
      { id: "IMG_HERO", sectionId: "S1_hero", assetType: "generated" },
      { id: "IMG_02", sectionId: "S4_main_content", assetType: "generated" }
    ]
  });

  assert.equal(readiness.inPageImageCount, 2);
  assert.equal(readiness.inPageImageTargetMet, false);
  assert.ok(readiness.advisoryIssues.some((issue) => issue.includes("3-5")));
});

test("prompt-only required images count only after user acceptance", () => {
  assert.equal(imageSlotComplete({
    id: "IMG_HERO",
    sectionId: "S1_hero",
    assetType: "prompt_only"
  }), false);

  assert.equal(imageSlotComplete({
    id: "IMG_HERO",
    sectionId: "S1_hero",
    assetType: "prompt_only",
    promptOnlyAcceptedByUser: true
  }), true);

  const readiness = evaluateV2ImageReadiness({
    manifestGenerated: true,
    assets: [
      { id: "IMG_OG", assetType: "generated" },
      { id: "IMG_HERO", sectionId: "S1_hero", assetType: "prompt_only" }
    ]
  });

  assert.equal(readiness.requiredSlotsComplete, false);
  assert.ok(readiness.blockingIssues.some((issue) => issue.includes("IMG_HERO")));
});

test("content_ready can exist before image manifest but publish_ready requires complete required image slots", () => {
  const initial = createInitialV2PageState({
    clusterSlug: "acne-treatment",
    pageId: "P1",
    pageType: "product_category",
    updatedAt: "2026-05-31T00:00:00.000Z"
  });

  const contentReady = markContentReady(initial, {
    packetGenerated: true,
    qaReportGenerated: true,
    minimumSectionScore: 72,
    updatedAt: "2026-05-31T00:01:00.000Z"
  });

  assert.equal(contentReady.status, "content_ready");
  assert.equal(contentReady.publishReady, false);
  assert.equal(contentReady.images.manifestGenerated, false);

  const stillContentReady = applyImageReadinessToState(contentReady, evaluateV2ImageReadiness({
    manifestGenerated: false,
    assets: [
      { id: "IMG_OG", assetType: "generated" },
      { id: "IMG_HERO", sectionId: "S1_hero", assetType: "generated" }
    ]
  }), "2026-05-31T00:02:00.000Z");

  assert.equal(stillContentReady.status, "content_ready");
  assert.equal(stillContentReady.publishReady, false);
  assert.equal(stillContentReady.nextRecommendedAction, "Complete the image manifest and required image slots.");

  const publishReady = applyImageReadinessToState(contentReady, evaluateV2ImageReadiness({
    manifestGenerated: true,
    assets: [
      { id: "IMG_OG", assetType: "generated" },
      { id: "IMG_HERO", sectionId: "S1_hero", assetType: "generated" },
      { id: "IMG_02", sectionId: "S4_main_content", assetType: "generated" },
      { id: "IMG_03", sectionId: "S8_faq", assetType: "prompt_only", promptOnlyAcceptedByUser: true }
    ]
  }), "2026-05-31T00:03:00.000Z");

  assert.equal(publishReady.status, "publish_ready");
  assert.equal(publishReady.publishReady, true);
  assert.equal(publishReady.images.manifestGenerated, true);
  assert.equal(publishReady.images.requiredSlotsComplete, true);
});
