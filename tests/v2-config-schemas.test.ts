import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { test } from "node:test";

const json = (path: string) => JSON.parse(readFileSync(path, "utf8"));

test("V2 editable config files define required defaults", () => {
  const generic = json("config/generic-phrase-patterns.json");
  const styles = json("config/narrative-style-profiles.json");
  const pageTypes = json("config/page-type-modifiers.json");
  const claims = json("config/claim-rewrite-patterns.json");
  const images = json("config/image-prompt-profiles.json");

  assert.equal(generic.schemaVersion, "generic-phrase-patterns.v1");
  assert.ok(generic.hardFailInOpening.includes("in today's fast-paced world"));
  assert.ok(generic.repairAnywhere.includes("game-changer"));

  assert.equal(styles.schemaVersion, "narrative-style-profiles.v1");
  assert.equal(styles.masterProfile.id, "advanced_india_seo_editorial_strategist");
  assert.ok(styles.profiles.some((profile: { id: string }) => profile.id === "professional_compact_guide"));
  assert.ok(styles.profiles.some((profile: { id: string }) => profile.id === "story_led_blog"));

  assert.equal(pageTypes.schemaVersion, "page-type-modifiers.v1");
  assert.ok(pageTypes.modifiers.some((modifier: { id: string }) => modifier.id === "product_category_modifier"));

  assert.equal(claims.schemaVersion, "claim-rewrite-patterns.v1");
  assert.ok(claims.patterns.some((pattern: { riskType: string }) => pattern.riskType === "medical_or_outcome_guarantee"));

  assert.equal(images.schemaVersion, "image-prompt-profiles.v1");
  assert.ok(images.profiles.some((profile: { id: string }) => profile.id === "og_image"));
  assert.ok(images.profiles.some((profile: { id: string }) => profile.id === "product_category_visual"));
});

test("V2 schema files expose expected schema ids", () => {
  const schemaIds = [
    ["schemas/v2-page-state.schema.json", "page-state.v2"],
    ["schemas/v2-serp-research-ledger.schema.json", "serp-research-ledger.v2"],
    ["schemas/v2-social-video-research.schema.json", "social-video-research.v2"],
    ["schemas/v2-audience-definition.schema.json", "audience-definition.v2"],
    ["schemas/v2-narrative-brief.schema.json", "narrative-brief.v2"],
    ["schemas/v2-citation-set.schema.json", "citation-set.v2"],
    ["schemas/v2-editorial-qa-report.schema.json", "editorial-qa-report.v2"],
    ["schemas/v2-section-version-history.schema.json", "section-version-history.v2"]
  ];

  for (const [path, schemaVersion] of schemaIds) {
    const schema = json(path);
    assert.equal(schema.properties.schemaVersion.const, schemaVersion);
    assert.ok(Array.isArray(schema.required), `${path} should declare required fields`);
  }
});
