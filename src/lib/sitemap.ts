import { writeFile, mkdir } from "node:fs/promises";
import path from "node:path";
import { readConfig } from "./config.js";
import { classifyUrlType, type PageType } from "./url-classifier.js";

export interface SitemapEntry {
  url: string;
  lastmod?: string;
}

export type SitemapParseResult =
  | { type: "urlset"; urls: SitemapEntry[] }
  | { type: "sitemapindex"; sitemaps: SitemapEntry[] };

export interface PrioritizedUrl extends SitemapEntry {
  pageType: PageType;
  priority: number;
}

export interface SkippedUrl extends SitemapEntry {
  reason: string;
}

export interface PrioritizedUrls {
  included: PrioritizedUrl[];
  skipped: SkippedUrl[];
  supporting: SkippedUrl[];
}

export function parseSitemapXml(xml: string): SitemapParseResult {
  if (/<sitemapindex[\s>]/i.test(xml)) {
    return {
      type: "sitemapindex",
      sitemaps: extractXmlBlocks(xml, "sitemap").map(parseSitemapEntry)
    };
  }

  return {
    type: "urlset",
    urls: extractXmlBlocks(xml, "url").map(parseSitemapEntry)
  };
}

export async function fetchSitemapUrls(sitemapUrl: string, maxSitemaps = 25): Promise<SitemapEntry[]> {
  const response = await fetch(sitemapUrl);
  if (!response.ok) {
    throw new Error(`Failed to fetch sitemap ${sitemapUrl}: ${response.status}`);
  }

  const parsed = parseSitemapXml(await response.text());
  if (parsed.type === "urlset") {
    return parsed.urls;
  }

  const entries: SitemapEntry[] = [];
  for (const sitemap of parsed.sitemaps.slice(0, maxSitemaps)) {
    entries.push(...await fetchSitemapUrls(sitemap.url, maxSitemaps));
  }
  return entries;
}

export function prioritizeUrls(urls: SitemapEntry[]): PrioritizedUrls {
  const included: PrioritizedUrl[] = [];
  const skipped: SkippedUrl[] = [];
  const supporting: SkippedUrl[] = [];

  for (const entry of urls) {
    const skipReason = getSkipReason(entry.url);
    if (skipReason) {
      const skippedEntry = { ...entry, reason: skipReason };
      skipped.push(skippedEntry);
      if (isSupportingUrl(skipReason)) {
        supporting.push(skippedEntry);
      }
      continue;
    }

    const classification = classifyUrlType({ url: entry.url });
    included.push({
      ...entry,
      pageType: classification.pageType,
      priority: pageTypePriority(classification.pageType)
    });
  }

  included.sort((a, b) => a.priority - b.priority || a.url.localeCompare(b.url));
  return { included, skipped, supporting };
}

export async function writeSiteInventory(
  inventory: PrioritizedUrls,
  cwd = process.cwd()
): Promise<{ urlsPath: string; skippedPath: string; supportingPath: string }> {
  const config = await readConfig(cwd);
  const inventoryRoot = path.resolve(cwd, config.workspace_path, "site-inventory");
  await mkdir(inventoryRoot, { recursive: true });

  const urlsPath = path.join(inventoryRoot, "urls.json");
  const skippedPath = path.join(inventoryRoot, "skipped-urls.json");
  const supportingPath = path.join(inventoryRoot, "supporting-urls.json");

  await writeFile(urlsPath, `${JSON.stringify(inventory.included, null, 2)}\n`, "utf8");
  await writeFile(skippedPath, `${JSON.stringify(inventory.skipped, null, 2)}\n`, "utf8");
  await writeFile(supportingPath, `${JSON.stringify(inventory.supporting, null, 2)}\n`, "utf8");

  return { urlsPath, skippedPath, supportingPath };
}

function extractXmlBlocks(xml: string, tagName: string): string[] {
  const pattern = new RegExp(`<${tagName}(?:\\s[^>]*)?>[\\s\\S]*?<\\/${tagName}>`, "gi");
  return xml.match(pattern) ?? [];
}

function parseSitemapEntry(block: string): SitemapEntry {
  const url = decodeXml(extractTagText(block, "loc") ?? "");
  const lastmod = extractTagText(block, "lastmod");
  return lastmod ? { url, lastmod: decodeXml(lastmod) } : { url };
}

function extractTagText(block: string, tagName: string): string | undefined {
  const match = block.match(new RegExp(`<${tagName}(?:\\s[^>]*)?>([\\s\\S]*?)<\\/${tagName}>`, "i"));
  return match?.[1]?.trim();
}

function decodeXml(value: string): string {
  return value
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, "\"")
    .replace(/&#39;/g, "'");
}

function getSkipReason(url: string): string | null {
  const lower = url.toLowerCase();
  if (/\.(png|jpe?g|gif|svg|webp|pdf|zip|mp4|webm)(?:[?#].*)?$/.test(lower)) return "asset";
  if (/[?&](s|search|q)=/.test(lower) || lower.includes("/search")) return "search";
  if (lower.includes("/login") || lower.includes("/account") || lower.includes("/signup")) return "login_page";
  if (lower.includes("/cart") || lower.includes("/checkout") || lower.includes("/payment")) return "cart";
  if (lower.includes("/tag/") || lower.includes("/author/") || lower.includes("/archive/")) return "tag_archive";
  if (lower.includes("privacy") || lower.includes("terms") || lower.includes("refund") || lower.includes("policy")) return "policy";
  return null;
}

function isSupportingUrl(reason: string): boolean {
  return reason === "policy";
}

function pageTypePriority(pageType: PageType): number {
  switch (pageType) {
    case "product_category":
      return 1;
    case "product":
      return 2;
    case "guide_blog":
      return 3;
    case "comparison":
      return 4;
    case "faq_support":
      return 5;
    case "pricing_trust":
      return 6;
    case "landing":
      return 7;
    default:
      return 8;
  }
}
