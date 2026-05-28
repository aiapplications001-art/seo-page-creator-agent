import test from "node:test";
import assert from "node:assert/strict";
import { classifyUrlType } from "../src/lib/url-classifier.js";

test("classifies common SEO page types from URL and headings", () => {
  assert.equal(
    classifyUrlType({
      url: "https://example.com/blog/how-to-choose-acne-treatment/",
      title: "How to Choose Acne Treatment",
      h1: "How to Choose Acne Treatment"
    }).pageType,
    "guide_blog"
  );

  assert.equal(
    classifyUrlType({
      url: "https://example.com/compare/acne-cream-vs-face-wash/",
      title: "Acne Cream vs Face Wash",
      h1: "Acne Cream vs Face Wash"
    }).pageType,
    "comparison"
  );

  assert.equal(
    classifyUrlType({
      url: "https://example.com/products/acne-kit/",
      title: "Acne Kit",
      h1: "Acne Kit"
    }).pageType,
    "product"
  );
});

test("classifies support and policy pages separately", () => {
  assert.equal(
    classifyUrlType({
      url: "https://example.com/help/shipping/",
      title: "Shipping Help",
      h1: "Shipping Help"
    }).pageType,
    "faq_support"
  );

  assert.equal(
    classifyUrlType({
      url: "https://example.com/privacy-policy/",
      title: "Privacy Policy",
      h1: "Privacy Policy"
    }).pageType,
    "policy"
  );
});
