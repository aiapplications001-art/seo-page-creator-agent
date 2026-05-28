export type PageType =
  | "guide_blog"
  | "comparison"
  | "product"
  | "product_category"
  | "landing"
  | "faq_support"
  | "policy"
  | "pricing_trust"
  | "unknown";

export interface UrlClassificationInput {
  url: string;
  title?: string;
  metaDescription?: string;
  h1?: string;
  h2s?: string[];
}

export interface UrlClassification {
  pageType: PageType;
  reason: string;
}

export function classifyUrlType(input: UrlClassificationInput): UrlClassification {
  const haystack = [
    input.url,
    input.title ?? "",
    input.metaDescription ?? "",
    input.h1 ?? "",
    ...(input.h2s ?? [])
  ].join(" ").toLowerCase();

  if (matches(haystack, ["privacy", "terms", "refund", "cancellation", "policy", "legal"])) {
    return { pageType: "policy", reason: "URL or metadata contains policy/legal terms." };
  }

  if (matches(haystack, ["faq", "help", "support", "contact", "shipping"])) {
    return { pageType: "faq_support", reason: "URL or metadata contains FAQ/support terms." };
  }

  if (matches(haystack, ["compare", "comparison", " vs ", "-vs-", " versus ", "alternative"])) {
    return { pageType: "comparison", reason: "URL or metadata indicates comparison intent." };
  }

  if (matches(haystack, ["blog", "guide", "how-to", "how to", "what is", "learn", "tips"])) {
    return { pageType: "guide_blog", reason: "URL or metadata indicates guide/blog intent." };
  }

  if (matches(haystack, ["pricing", "reviews", "testimonial", "security", "trust"])) {
    return { pageType: "pricing_trust", reason: "URL or metadata indicates pricing/trust content." };
  }

  if (matches(haystack, ["category", "categories", "collection", "collections"])) {
    return { pageType: "product_category", reason: "URL or metadata indicates product/category collection." };
  }

  if (matches(haystack, ["product", "products", "service", "services"])) {
    return { pageType: "product", reason: "URL or metadata indicates product/service detail." };
  }

  return { pageType: "unknown", reason: "No known page type pattern matched." };
}

function matches(value: string, terms: string[]): boolean {
  return terms.some((term) => value.includes(term));
}
