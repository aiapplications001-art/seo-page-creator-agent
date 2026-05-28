import test from "node:test";
import assert from "node:assert/strict";
import { workspaceFolders } from "../src/lib/workspace.js";

test("workspace folder list includes credentials and page packet outputs", () => {
  assert.ok(workspaceFolders.includes("credentials"));
  assert.ok(workspaceFolders.includes("page-packets"));
  assert.ok(workspaceFolders.includes("watcher-reports"));
});
