import test from "node:test";
import assert from "node:assert/strict";
import { extractHtmlMetadata } from "../src/lib/metadata.js";

test("extracts title, meta description, canonical, headings, and schema types", () => {
  const html = `<!doctype html>
  <html>
    <head>
      <title>Acne Treatment Guide | ClearNest</title>
      <meta name="description" content="A practical acne treatment guide for Indian skin." />
      <link rel="canonical" href="https://example.com/blog/acne-treatment-guide/" />
      <script type="application/ld+json">{"@context":"https://schema.org","@type":"Article"}</script>
    </head>
    <body>
      <h1>Acne Treatment Guide</h1>
      <h2>What causes acne?</h2>
      <h2>How to choose treatment</h2>
    </body>
  </html>`;

  const metadata = extractHtmlMetadata("https://example.com/blog/acne-treatment-guide/", html);

  assert.equal(metadata.title, "Acne Treatment Guide | ClearNest");
  assert.equal(metadata.metaDescription, "A practical acne treatment guide for Indian skin.");
  assert.equal(metadata.canonical, "https://example.com/blog/acne-treatment-guide/");
  assert.equal(metadata.h1, "Acne Treatment Guide");
  assert.deepEqual(metadata.h2s, ["What causes acne?", "How to choose treatment"]);
  assert.deepEqual(metadata.schemaTypes, ["Article"]);
});
