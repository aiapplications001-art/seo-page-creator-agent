import assert from "node:assert/strict";
import { mkdtemp, readFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import path from "node:path";
import { test } from "node:test";
import { prepareV2PageWorkspace } from "../src/lib/v2/templates.js";
import {
  buildRefreshPacket,
  buildRefreshQaSummary,
  createVersionHistoryEntry,
  truncateVersionExcerpt
} from "../src/lib/v2/refresh.js";

test("page setup creates an empty section version history artifact", async () => {
  const cwd = await mkdtemp(path.join(tmpdir(), "seo-v2-refresh-"));

  await prepareV2PageWorkspace({
    cwd,
    clusterSlug: "acne-treatment",
    pageId: "P1",
    pageType: "product_category"
  });

  const historyPath = path.join(
    cwd,
    ".seo-agent-workspace",
    "v2",
    "page-packets",
    "acne-treatment",
    "P1",
    "section-version-history.json"
  );
  const history = JSON.parse(await readFile(historyPath, "utf8"));

  assert.equal(history.schemaVersion, "section-version-history.v2");
  assert.deepEqual(history.entries, []);
});

test("version history entries truncate excerpts and accept refresh_update events", () => {
  const longBefore = "Before ".repeat(80);
  const longAfter = "After ".repeat(80);

  assert.equal(truncateVersionExcerpt("short copy"), "short copy");
  assert.equal(truncateVersionExcerpt(longBefore).length, 280);
  assert.ok(truncateVersionExcerpt(longBefore).endsWith("..."));

  const entry = createVersionHistoryEntry({
    sectionId: "S4_main_content",
    event: "refresh_update",
    summary: "Updated outdated acne-treatment guidance.",
    reason: "Search guidance changed and newer references were added.",
    before: longBefore,
    after: longAfter,
    changedBy: "host_agent",
    timestamp: "2026-05-31T10:00:00.000Z"
  });

  assert.equal(entry.event, "refresh_update");
  assert.equal(entry.beforeExcerpt.length, 280);
  assert.equal(entry.afterExcerpt.length, 280);
  assert.notEqual(entry.beforeHash, entry.afterHash);
});

test("refresh packet includes only changed sections and update rationale", () => {
  const packet = buildRefreshPacket({
    pageId: "P1",
    trigger: "manual_refresh",
    reason: "Google Search Console showed lower CTR on the main content section.",
    changedSections: [
      {
        sectionId: "S4_main_content",
        heading: "Main content",
        currentIssue: "Section is too generic for the target keyword.",
        recommendedEdit: "Add source-backed specifics and sharper examples.",
        citationChanges: ["Replace outdated source with official guidance URL."],
        before: "Generic section copy",
        after: "Specific refreshed section copy"
      }
    ],
    unchangedSectionIds: ["S1_hero", "S8_faq"],
    qa: buildRefreshQaSummary([
      { sectionId: "S4_main_content", score: 74, threshold: 70 },
      { sectionId: "S8_faq", score: 42, threshold: 70, changed: false }
    ]),
    timestamp: "2026-05-31T10:05:00.000Z"
  });

  assert.equal(packet.json.schemaVersion, "refresh-packet.v2");
  assert.equal(packet.json.changedSections.length, 1);
  assert.equal(packet.json.changedSections[0]?.sectionId, "S4_main_content");
  assert.deepEqual(packet.json.unchangedSectionIds, ["S1_hero", "S8_faq"]);
  assert.equal(packet.json.qa.status, "passed");
  assert.match(packet.markdown, /# Refresh Packet: P1/);
  assert.match(packet.markdown, /Google Search Console showed lower CTR/);
  assert.match(packet.markdown, /S4_main_content/);
  assert.doesNotMatch(packet.markdown, /S8_faq \| 42/);
  assert.equal(packet.json.versionHistorySummary.totalChanges, 1);
  assert.equal(packet.json.versionHistorySummary.entries[0]?.event, "refresh_update");
});

test("refresh QA applies section threshold only to changed sections", () => {
  const passing = buildRefreshQaSummary([
    { sectionId: "S4_main_content", score: 71, threshold: 70 },
    { sectionId: "S8_faq", score: 40, threshold: 70, changed: false }
  ]);

  assert.equal(passing.status, "passed");
  assert.deepEqual(passing.failedSectionIds, []);

  const failing = buildRefreshQaSummary([
    { sectionId: "S4_main_content", score: 69, threshold: 70 },
    { sectionId: "S8_faq", score: 95, threshold: 70, changed: false }
  ]);

  assert.equal(failing.status, "failed");
  assert.deepEqual(failing.failedSectionIds, ["S4_main_content"]);
});
