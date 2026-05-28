import test from "node:test";
import assert from "node:assert/strict";
import { buildSectionImageFilename, normalizeImageFilename } from "../src/lib/image-filenames.js";

test("normalizes image filenames for SEO use", () => {
  assert.equal(
    normalizeImageFilename("Student Forex Card: Comparison Table!", "webp"),
    "student-forex-card-comparison-table.webp"
  );
});

test("builds section image filenames from page slug and purpose", () => {
  assert.equal(
    buildSectionImageFilename("acne-treatment-guide-india", "Hero CTA", "png"),
    "acne-treatment-guide-india-hero-cta.png"
  );
});
