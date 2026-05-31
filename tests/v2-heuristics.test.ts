import assert from "node:assert/strict";
import { test } from "node:test";
import {
  detectBannedPhraseIssues,
  detectGenericPhraseIssues,
  detectPlaceholderCopy,
  suggestClaimRewrites,
  truncateExcerpt
} from "../src/lib/v2/heuristics.js";

const genericPatterns = {
  hardFailInOpening: ["in today's fast-paced world", "unlock your potential"],
  repairAnywhere: ["game-changer", "comprehensive solution"]
};

const claimPatterns = [
  {
    riskPattern: "cure|permanent cure|guaranteed cure",
    riskType: "medical_or_outcome_guarantee",
    defaultRewrite: "help you understand visible patterns and choose a more informed next step",
    requiresApprovalIfKept: true
  },
  {
    riskPattern: "best in india|number one|#1",
    riskType: "unsupported_superlative",
    defaultRewrite: "a useful option for readers comparing this category",
    requiresApprovalIfKept: true
  }
];

test("detectPlaceholderCopy flags scaffold and placeholder wording as hard failures", () => {
  const issues = detectPlaceholderCopy("Editable scaffold for S4. Replace this with final copy.");

  assert.equal(issues.length, 2);
  assert.ok(issues.every((issue) => issue.severity === "hard_fail"));
  assert.ok(issues.some((issue) => issue.code === "placeholder_copy"));
});

test("detectGenericPhraseIssues hard-fails generic opening phrases in hero sections", () => {
  const issues = detectGenericPhraseIssues({
    sectionId: "S1_hero",
    markdown: "In today's fast-paced world, acne care needs a comprehensive solution.",
    patterns: genericPatterns
  });

  assert.ok(issues.some((issue) => issue.severity === "hard_fail" && issue.matchedText === "in today's fast-paced world"));
  assert.ok(issues.some((issue) => issue.severity === "repair" && issue.matchedText === "comprehensive solution"));
});

test("detectGenericPhraseIssues marks non-opening generic phrases as repair issues", () => {
  const issues = detectGenericPhraseIssues({
    sectionId: "S4_main_content",
    markdown: "This can be a game-changer when the explanation is specific.",
    patterns: genericPatterns
  });

  assert.equal(issues.length, 1);
  assert.equal(issues[0]?.severity, "repair");
  assert.equal(issues[0]?.code, "generic_phrase");
});

test("detectBannedPhraseIssues hard-fails brand and page banned phrases", () => {
  const issues = detectBannedPhraseIssues({
    markdown: "This page should never promise guaranteed results or say cure acne.",
    bannedPhrases: ["guaranteed results", "cure acne"],
    scope: "brand"
  });

  assert.equal(issues.length, 2);
  assert.ok(issues.every((issue) => issue.severity === "hard_fail"));
  assert.ok(issues.every((issue) => issue.code === "brand_banned_phrase"));
});

test("suggestClaimRewrites returns safer rewrites for risky claim patterns", () => {
  const suggestions = suggestClaimRewrites({
    text: "Our treatment can cure acne permanently and is the best in India.",
    patterns: claimPatterns
  });

  assert.equal(suggestions.length, 2);
  assert.ok(suggestions.some((suggestion) => suggestion.riskType === "medical_or_outcome_guarantee"));
  assert.ok(suggestions.some((suggestion) => suggestion.defaultRewrite === "a useful option for readers comparing this category"));
  assert.ok(suggestions.every((suggestion) => suggestion.requiresApprovalIfKept));
});

test("truncateExcerpt limits text and uses ellipsis when needed", () => {
  const value = "a".repeat(505);

  assert.equal(truncateExcerpt(value, 500).length, 500);
  assert.ok(truncateExcerpt(value, 500).endsWith("..."));
  assert.equal(truncateExcerpt("short", 500), "short");
});
