import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { test } from "node:test";

const json = (filePath: string) => JSON.parse(readFileSync(filePath, "utf8"));

test("category discovery schemas expose stable schema versions", () => {
  const expected = [
    ["schemas/category-seed-universe-contract.schema.json", "category-seed-universe-contract.v1"],
    ["schemas/category-cluster-portfolio-discovery.schema.json", "category-cluster-portfolio-discovery.v1"],
    ["schemas/category-cluster-boundary-contract.schema.json", "category-cluster-boundary-contract.v1"],
    ["schemas/category-discovery-validation.schema.json", "category-discovery-validation.v1"],
    ["schemas/category-discovery-lock.schema.json", "category-discovery-lock.v1"]
  ];

  for (const [file, schemaVersion] of expected) {
    const schema = json(file);
    assert.equal(schema.properties.schemaVersion.const, schemaVersion);
    assert.ok(Array.isArray(schema.required), `${file} should declare required fields`);
  }
});
