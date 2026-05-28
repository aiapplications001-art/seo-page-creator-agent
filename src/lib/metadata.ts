import { readFile, writeFile, mkdir } from "node:fs/promises";
import path from "node:path";
import { readConfig } from "./config.js";
import { classifyUrlType, type PageType } from "./url-classifier.js";

export interface PageMetadata {
  url: string;
  title?: string;
  metaDescription?: string;
  canonical?: string;
  h1?: string;
  h2s: string[];
  schemaTypes: string[];
  pageType: PageType;
  classificationReason: string;
}

export function extractHtmlMetadata(url: string, html: string): PageMetadata {
  const title = textContent(extractFirst(html, /<title[^>]*>([\s\S]*?)<\/title>/i));
  const metaDescription = getMetaDescription(html);
  const canonical = getCanonical(html);
  const h1 = textContent(extractFirst(html, /<h1[^>]*>([\s\S]*?)<\/h1>/i));
  const h2s = [...html.matchAll(/<h2[^>]*>([\s\S]*?)<\/h2>/gi)]
    .map((match) => textContent(match[1]))
    .filter(Boolean) as string[];
  const schemaTypes = extractSchemaTypes(html);
  const classification = classifyUrlType({ url, title, metaDescription, h1, h2s });

  return {
    url,
    title,
    metaDescription,
    canonical,
    h1,
    h2s,
    schemaTypes,
    pageType: classification.pageType,
    classificationReason: classification.reason
  };
}

export async function fetchPageMetadata(url: string): Promise<PageMetadata> {
  const response = await fetch(url, {
    headers: {
      "user-agent": "seo-page-creator-agent/0.1"
    }
  });
  if (!response.ok) {
    throw new Error(`Failed to fetch page ${url}: ${response.status}`);
  }
  return extractHtmlMetadata(url, await response.text());
}

export async function extractMetadataForInventory(limit?: number, cwd = process.cwd()): Promise<string> {
  const config = await readConfig(cwd);
  const inventoryRoot = path.resolve(cwd, config.workspace_path, "site-inventory");
  const urlsPath = path.join(inventoryRoot, "urls.json");
  const raw = await readFile(urlsPath, "utf8");
  const urls = JSON.parse(raw) as Array<{ url: string }>;
  const selected = urls.slice(0, limit ?? config.site_inventory.default_url_metadata_limit);
  const metadata: PageMetadata[] = [];

  for (const item of selected) {
    metadata.push(await fetchPageMetadata(item.url));
  }

  const metadataPath = path.join(inventoryRoot, "metadata.json");
  await mkdir(inventoryRoot, { recursive: true });
  await writeFile(metadataPath, `${JSON.stringify(metadata, null, 2)}\n`, "utf8");
  return metadataPath;
}

function getMetaDescription(html: string): string | undefined {
  return getAttributeFromTag(html, /<meta\s+[^>]*name=["']description["'][^>]*>/i, "content")
    ?? getAttributeFromTag(html, /<meta\s+[^>]*property=["']og:description["'][^>]*>/i, "content");
}

function getCanonical(html: string): string | undefined {
  return getAttributeFromTag(html, /<link\s+[^>]*rel=["']canonical["'][^>]*>/i, "href");
}

function getAttributeFromTag(html: string, tagPattern: RegExp, attribute: string): string | undefined {
  const tag = html.match(tagPattern)?.[0];
  if (!tag) return undefined;
  const attr = tag.match(new RegExp(`${attribute}=["']([^"']+)["']`, "i"))?.[1];
  return attr ? decodeHtml(attr.trim()) : undefined;
}

function extractSchemaTypes(html: string): string[] {
  const types = new Set<string>();
  for (const match of html.matchAll(/<script[^>]*type=["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/gi)) {
    const jsonText = textContent(match[1]);
    if (!jsonText) continue;
    try {
      collectSchemaTypes(JSON.parse(jsonText), types);
    } catch {
      const typeMatch = jsonText.match(/"@type"\s*:\s*"([^"]+)"/);
      if (typeMatch) types.add(typeMatch[1]);
    }
  }
  return [...types];
}

function collectSchemaTypes(value: unknown, types: Set<string>): void {
  if (Array.isArray(value)) {
    for (const item of value) collectSchemaTypes(item, types);
    return;
  }
  if (!value || typeof value !== "object") return;
  const record = value as Record<string, unknown>;
  const type = record["@type"];
  if (typeof type === "string") types.add(type);
  if (Array.isArray(type)) {
    for (const item of type) {
      if (typeof item === "string") types.add(item);
    }
  }
  for (const item of Object.values(record)) collectSchemaTypes(item, types);
}

function extractFirst(html: string, pattern: RegExp): string | undefined {
  return html.match(pattern)?.[1];
}

function textContent(value: string | undefined): string | undefined {
  if (!value) return undefined;
  const text = decodeHtml(value.replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim());
  return text || undefined;
}

function decodeHtml(value: string): string {
  return value
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, "\"")
    .replace(/&#39;/g, "'")
    .replace(/&nbsp;/g, " ");
}
