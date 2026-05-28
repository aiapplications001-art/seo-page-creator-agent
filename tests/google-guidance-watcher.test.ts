import test from "node:test";
import assert from "node:assert/strict";
import {
  compareGuidanceSnapshots,
  createGuidanceSnapshot,
  defaultGoogleGuidanceSources,
  renderGuidanceReport
} from "../src/lib/google-guidance-watcher.js";

test("creates official-source snapshots and detects guidance changes by urgency", async () => {
  const sources = defaultGoogleGuidanceSources.slice(0, 2);
  const before = await Promise.all(sources.map((source) => createGuidanceSnapshot(source, "Old content")));
  const after = [
    await createGuidanceSnapshot(sources[0], "Old content"),
    await createGuidanceSnapshot(sources[1], "New content about AI Overviews and structured data")
  ];

  const result = compareGuidanceSnapshots(before, after, "2026-05-28");

  assert.equal(result.officialSourcesOnly, true);
  assert.equal(result.meaningfulChangesFound, true);
  assert.equal(result.changes.length, 1);
  assert.equal(result.changes[0].sourceId, sources[1].id);
  assert.equal(result.changes[0].urgency, "high");
  assert.match(renderGuidanceReport(result), /High Urgency/);
  assert.match(renderGuidanceReport(result), /suggest reviewing existing clusters and page packets/i);
});

test("renders a no meaningful changes found report", async () => {
  const sources = defaultGoogleGuidanceSources.slice(0, 1);
  const before = await Promise.all(sources.map((source) => createGuidanceSnapshot(source, "Same content")));
  const after = await Promise.all(sources.map((source) => createGuidanceSnapshot(source, "Same content")));

  const result = compareGuidanceSnapshots(before, after, "2026-05-28");
  const markdown = renderGuidanceReport(result);

  assert.equal(result.meaningfulChangesFound, false);
  assert.equal(result.changes.length, 0);
  assert.match(markdown, /No meaningful official Google guidance changes found/);
  assert.match(markdown, /Official sources checked/);
});
