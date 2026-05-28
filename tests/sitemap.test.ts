import test from "node:test";
import assert from "node:assert/strict";
import { parseSitemapXml, prioritizeUrls } from "../src/lib/sitemap.js";

test("parses sitemap urls with last modified dates", () => {
  const xml = `<?xml version="1.0" encoding="UTF-8"?>
  <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
    <url>
      <loc>https://example.com/products/acne-care/</loc>
      <lastmod>2026-05-20</lastmod>
    </url>
    <url>
      <loc>https://example.com/blog/acne-treatment-guide/</loc>
    </url>
  </urlset>`;

  const result = parseSitemapXml(xml);

  assert.equal(result.type, "urlset");
  assert.deepEqual(result.urls, [
    {
      url: "https://example.com/products/acne-care/",
      lastmod: "2026-05-20"
    },
    {
      url: "https://example.com/blog/acne-treatment-guide/"
    }
  ]);
});

test("parses sitemap index locations", () => {
  const xml = `<?xml version="1.0" encoding="UTF-8"?>
  <sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
    <sitemap>
      <loc>https://example.com/post-sitemap.xml</loc>
      <lastmod>2026-05-21</lastmod>
    </sitemap>
  </sitemapindex>`;

  const result = parseSitemapXml(xml);

  assert.equal(result.type, "sitemapindex");
  assert.deepEqual(result.sitemaps, [
    {
      url: "https://example.com/post-sitemap.xml",
      lastmod: "2026-05-21"
    }
  ]);
});

test("prioritizes useful SEO URLs and skips low-value URLs", () => {
  const prioritized = prioritizeUrls([
    { url: "https://example.com/login/" },
    { url: "https://example.com/category/acne-treatment/" },
    { url: "https://example.com/privacy-policy/" },
    { url: "https://example.com/blog/how-to-treat-acne/" },
    { url: "https://example.com/cart/" }
  ]);

  assert.deepEqual(prioritized.included.map((item) => item.url), [
    "https://example.com/category/acne-treatment/",
    "https://example.com/blog/how-to-treat-acne/"
  ]);
  assert.deepEqual(prioritized.skipped.map((item) => item.reason), [
    "login_page",
    "policy",
    "cart"
  ]);
});
