import test from "node:test";
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import path from "node:path";

test("Google guidance watcher GitHub Action is scheduled and uploads reports", async () => {
  const workflow = await readFile(
    path.join(process.cwd(), ".github", "workflows", "google-guidance-watcher.yml"),
    "utf8"
  );

  assert.match(workflow, /name:\s*Google Guidance Watcher/);
  assert.match(workflow, /cron:\s*["']30 3 \* \* 2["']/);
  assert.match(workflow, /workflow_dispatch:/);
  assert.match(workflow, /node dist\/cli\/index\.js init/);
  assert.match(workflow, /node dist\/cli\/index\.js watcher google-guidance/);
  assert.match(workflow, /actions\/upload-artifact@v4/);
  assert.match(workflow, /\.seo-agent-workspace\/watcher-reports/);
  assert.match(workflow, /\.seo-agent-workspace\/watcher-state/);
});
