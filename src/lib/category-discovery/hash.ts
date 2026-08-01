import { createHash } from "node:crypto";

export function stripFieldGuidance(value: unknown): unknown {
  if (Array.isArray(value)) return value.map(stripFieldGuidance);
  if (value && typeof value === "object") {
    const entries = Object.entries(value as Record<string, unknown>)
      .filter(([key]) => key !== "fieldGuidance")
      .sort(([left], [right]) => left.localeCompare(right))
      .map(([key, item]) => [key, stripFieldGuidance(item)]);
    return Object.fromEntries(entries);
  }
  return value;
}

export function hashCategoryArtifact(value: unknown): string {
  return createHash("sha256")
    .update(JSON.stringify(stripFieldGuidance(value)))
    .digest("hex");
}
