export interface ContentUniquenessSection {
  sectionId: string;
  heading?: string;
  role?: string;
  sectionIntent?: string;
  markdown: string;
}

export interface PageContentForUniqueness {
  pageId: string;
  title?: string;
  slug?: string;
  intentPattern?: string;
  structureVariant?: string;
  researchDerivedStructureRationale?: string;
  researchRefs?: string[];
  sections: ContentUniquenessSection[];
}

export interface ContentUniquenessOptions {
  maximumSharedBodySimilarity?: number;
  maximumSharedStructureSimilarity?: number;
  repeatedLongSectionLimit?: number;
  requireResearchDerivedStructure?: boolean;
  requireDistinctPageStructure?: boolean;
}

export interface ContentUniquenessComparison {
  leftPageId: string;
  rightPageId: string;
  sharedBodySimilarity: number;
  sharedStructureSimilarity: number;
  repeatedLongSectionCount: number;
  repeatedStructure: boolean;
}

export interface ContentUniquenessValidationResult {
  status: "passed" | "failed";
  blockingIssues: string[];
  comparisons: ContentUniquenessComparison[];
}

const defaultMaximumSharedBodySimilarity = 0.5;
const defaultMaximumSharedStructureSimilarity = 0.8;
const defaultRepeatedLongSectionLimit = 2;
const bodySectionExclusionPattern = /\b(hero|intro|introduction|quick[_ -]?answer|references?|sources?|citations?)\b/i;

export function validateBatchContentUniqueness(
  pages: PageContentForUniqueness[],
  options: ContentUniquenessOptions = {}
): ContentUniquenessValidationResult {
  const maximumSharedBodySimilarity = options.maximumSharedBodySimilarity ?? defaultMaximumSharedBodySimilarity;
  const maximumSharedStructureSimilarity = options.maximumSharedStructureSimilarity ?? defaultMaximumSharedStructureSimilarity;
  const repeatedLongSectionLimit = options.repeatedLongSectionLimit ?? defaultRepeatedLongSectionLimit;
  const blockingIssues: string[] = [];
  const comparisons: ContentUniquenessComparison[] = [];

  if (options.requireResearchDerivedStructure) {
    for (const page of pages) {
      if (!hasText(page.intentPattern) || !hasText(page.structureVariant) || !hasText(page.researchDerivedStructureRationale)) {
        blockingIssues.push(
          `${page.pageId}: page structure must be research-derived. Provide intentPattern, structureVariant, and researchDerivedStructureRationale explaining why this section sequence fits this page's SERP, audience-language, PAA, video/forum, and competitor-gap research.`
        );
      }
      if (!page.researchRefs?.length) {
        blockingIssues.push(
          `${page.pageId}: research-derived structure requires researchRefs so the section plan can be traced back to page-specific evidence.`
        );
      }
    }
  }

  for (let leftIndex = 0; leftIndex < pages.length; leftIndex += 1) {
    for (let rightIndex = leftIndex + 1; rightIndex < pages.length; rightIndex += 1) {
      const left = pages[leftIndex];
      const right = pages[rightIndex];
      const comparison = comparePages(left, right);
      comparisons.push(comparison);

      if (comparison.sharedBodySimilarity > maximumSharedBodySimilarity) {
        blockingIssues.push(
          `${left.pageId} and ${right.pageId}: shared body similarity ${formatPercent(comparison.sharedBodySimilarity)} exceeds ${formatPercent(maximumSharedBodySimilarity)}. Shared body templates across pages are not allowed.`
        );
      }
      if (options.requireDistinctPageStructure && comparison.sharedStructureSimilarity > maximumSharedStructureSimilarity) {
        blockingIssues.push(
          `${left.pageId} and ${right.pageId}: page structure similarity ${formatPercent(comparison.sharedStructureSimilarity)} exceeds ${formatPercent(maximumSharedStructureSimilarity)}. The section sequence, decision tools, FAQs, troubleshooting blocks, tables, and CTA placement must be differentiated from page-specific research, not reused from another batch or previous run.`
        );
      }
      if (options.requireDistinctPageStructure && comparison.repeatedStructure) {
        blockingIssues.push(
          `${left.pageId} and ${right.pageId}: page structure repeats the same body section pattern. Pages in a batch or later run cannot share the same structural template unless the structure is rebuilt and materially differentiated from current-page research.`
        );
      }
      if (comparison.repeatedLongSectionCount >= repeatedLongSectionLimit) {
        blockingIssues.push(
          `${left.pageId} and ${right.pageId}: ${comparison.repeatedLongSectionCount} long body sections are repeated exactly. Matrix, mistakes, troubleshooting, decision, and CTA content must be custom to the page.`
        );
      }
    }
  }

  return {
    status: blockingIssues.length === 0 ? "passed" : "failed",
    blockingIssues,
    comparisons
  };
}

function comparePages(left: PageContentForUniqueness, right: PageContentForUniqueness): ContentUniquenessComparison {
  const leftBodyShingles = toShingles(tokenize(bodyText(left)), 5);
  const rightBodyShingles = toShingles(tokenize(bodyText(right)), 5);
  const leftStructureShingles = toShingles(tokenize(structureText(left)), 2);
  const rightStructureShingles = toShingles(tokenize(structureText(right)), 2);

  return {
    leftPageId: left.pageId,
    rightPageId: right.pageId,
    sharedBodySimilarity: jaccard(leftBodyShingles, rightBodyShingles),
    sharedStructureSimilarity: jaccard(leftStructureShingles, rightStructureShingles),
    repeatedLongSectionCount: repeatedLongSections(left, right),
    repeatedStructure: structureSignature(left) === structureSignature(right) && bodySections(left).length >= 4
  };
}

function bodyText(page: PageContentForUniqueness): string {
  return bodySections(page)
    .map((section) => section.markdown)
    .join("\n\n");
}

function structureText(page: PageContentForUniqueness): string {
  return bodySections(page)
    .map((section) => `${section.heading ?? ""} ${section.role ?? ""} ${section.sectionIntent ?? ""}`)
    .join(" ");
}

function structureSignature(page: PageContentForUniqueness): string {
  return bodySections(page)
    .map((section) => normalizeText(`${section.heading ?? ""} ${section.role ?? ""} ${section.sectionIntent ?? ""}`))
    .join(" > ");
}

function bodySections(page: PageContentForUniqueness): ContentUniquenessSection[] {
  return page.sections
    .filter((section) => !bodySectionExclusionPattern.test(`${section.sectionId} ${section.heading ?? ""} ${section.role ?? ""}`));
}

function repeatedLongSections(left: PageContentForUniqueness, right: PageContentForUniqueness): number {
  const leftFingerprints = new Set(sectionFingerprints(left));
  const rightFingerprints = new Set(sectionFingerprints(right));
  let repeated = 0;
  for (const fingerprint of leftFingerprints) {
    if (rightFingerprints.has(fingerprint)) repeated += 1;
  }
  return repeated;
}

function sectionFingerprints(page: PageContentForUniqueness): string[] {
  return bodySections(page)
    .map((section) => normalizeText(section.markdown))
    .filter((text) => text.length >= 180);
}

function hasText(value: unknown): value is string {
  return typeof value === "string" && value.trim().length > 0;
}

function tokenize(value: string): string[] {
  return normalizeText(value)
    .split(" ")
    .filter((token) => token.length > 1);
}

function normalizeText(value: string): string {
  return value
    .toLowerCase()
    .replace(/```[\s\S]*?```/g, " ")
    .replace(/<[^>]+>/g, " ")
    .replace(/https?:\/\/\S+/g, " ")
    .replace(/[^a-z0-9\s]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function toShingles(tokens: string[], size: number): Set<string> {
  const shingles = new Set<string>();
  if (tokens.length < size) {
    if (tokens.length > 0) shingles.add(tokens.join(" "));
    return shingles;
  }
  for (let index = 0; index <= tokens.length - size; index += 1) {
    shingles.add(tokens.slice(index, index + size).join(" "));
  }
  return shingles;
}

function jaccard(left: Set<string>, right: Set<string>): number {
  if (left.size === 0 && right.size === 0) return 0;
  let intersection = 0;
  for (const value of left) {
    if (right.has(value)) intersection += 1;
  }
  const union = left.size + right.size - intersection;
  return union === 0 ? 0 : intersection / union;
}

function formatPercent(value: number): string {
  return `${Math.round(value * 100)}%`;
}
