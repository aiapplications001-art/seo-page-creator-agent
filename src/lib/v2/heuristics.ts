export interface HeuristicIssue {
  severity: "hard_fail" | "repair" | "advisory";
  code: string;
  sectionId?: string;
  message: string;
  matchedText?: string;
}

export interface GenericPhrasePatterns {
  hardFailInOpening: string[];
  repairAnywhere: string[];
}

export interface ClaimRewritePattern {
  riskPattern: string;
  riskType: string;
  defaultRewrite: string;
  requiresApprovalIfKept: boolean;
}

export interface ClaimRewriteSuggestion {
  matchedText: string;
  riskType: string;
  defaultRewrite: string;
  requiresApprovalIfKept: boolean;
}

export function detectPlaceholderCopy(markdown: string): HeuristicIssue[] {
  const patterns = [
    { label: "TBD", pattern: /\bTBD\b/i },
    { label: "TODO", pattern: /\bTODO\b/i },
    { label: "replace this", pattern: /replace this/i },
    { label: "lorem ipsum", pattern: /lorem ipsum/i },
    { label: "add reference here", pattern: /add reference here/i },
    { label: "editable scaffold", pattern: /editable scaffold/i }
  ];

  return patterns
    .filter(({ pattern }) => pattern.test(markdown))
    .map(({ label }) => ({
      severity: "hard_fail",
      code: "placeholder_copy",
      message: `Placeholder pattern detected: ${label}`,
      matchedText: label
    }));
}

export function detectGenericPhraseIssues(input: {
  sectionId: string;
  markdown: string;
  patterns: GenericPhrasePatterns;
}): HeuristicIssue[] {
  const issues: HeuristicIssue[] = [];
  const openingSection = input.sectionId === "S1_hero" || input.sectionId === "S2_quick_answer";

  for (const phrase of input.patterns.hardFailInOpening) {
    if (containsPhrase(input.markdown, phrase)) {
      issues.push({
        severity: openingSection ? "hard_fail" : "repair",
        code: "generic_phrase",
        sectionId: input.sectionId,
        message: openingSection
          ? "Generic phrase found in opening section."
          : "Generic opening phrase found outside the opening and should be repaired.",
        matchedText: phrase
      });
    }
  }

  for (const phrase of input.patterns.repairAnywhere) {
    if (containsPhrase(input.markdown, phrase)) {
      issues.push({
        severity: "repair",
        code: "generic_phrase",
        sectionId: input.sectionId,
        message: "Generic phrase should be rewritten with more specific copy.",
        matchedText: phrase
      });
    }
  }

  return issues;
}

export function detectBannedPhraseIssues(input: {
  markdown: string;
  bannedPhrases: string[];
  scope: "brand" | "page";
}): HeuristicIssue[] {
  return input.bannedPhrases
    .filter((phrase) => containsPhrase(input.markdown, phrase))
    .map((phrase) => ({
      severity: "hard_fail",
      code: input.scope === "brand" ? "brand_banned_phrase" : "page_banned_phrase",
      message: `${input.scope === "brand" ? "Brand" : "Page"} banned phrase detected.`,
      matchedText: phrase
    }));
}

export function suggestClaimRewrites(input: {
  text: string;
  patterns: ClaimRewritePattern[];
}): ClaimRewriteSuggestion[] {
  const suggestions: ClaimRewriteSuggestion[] = [];

  for (const pattern of input.patterns) {
    const regex = new RegExp(pattern.riskPattern, "i");
    const match = input.text.match(regex);
    if (!match?.[0]) continue;
    suggestions.push({
      matchedText: match[0],
      riskType: pattern.riskType,
      defaultRewrite: pattern.defaultRewrite,
      requiresApprovalIfKept: pattern.requiresApprovalIfKept
    });
  }

  return suggestions;
}

export function truncateExcerpt(value: string, maxLength: number): string {
  if (value.length <= maxLength) return value;
  if (maxLength <= 3) return ".".repeat(maxLength);
  return `${value.slice(0, maxLength - 3)}...`;
}

function containsPhrase(markdown: string, phrase: string): boolean {
  return markdown.toLowerCase().includes(phrase.toLowerCase());
}
