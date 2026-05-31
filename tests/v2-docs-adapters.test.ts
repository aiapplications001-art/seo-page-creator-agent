import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { test } from "node:test";

test("V2 workflow docs and adapters expose content quality flow", () => {
  const workflow = readFileSync("workflows/19-v2-content-quality.md", "utf8");
  const readme = readFileSync("README.md", "utf8");
  const agent = readFileSync("AGENT.md", "utf8");
  const gemini = readFileSync("adapters/gemini-cli/GEMINI.md", "utf8");
  const command = readFileSync("adapters/gemini-cli/commands/seo/v2.toml", "utf8");
  const codexSkill = readFileSync("adapters/codex/skills/seo-page-creator/SKILL.md", "utf8");

  assert.match(workflow, /SERP Research Ledger Gate/);
  assert.match(workflow, /Social\/Video Research Gate/);
  assert.match(workflow, /Narrative Brief Gate/);
  assert.match(workflow, /Top 10 meaningful SERP body extractions/);
  assert.match(workflow, /content_ready/);
  assert.match(workflow, /publish_ready/);

  assert.match(readme, /seo-agent v2 prepare-page/);
  assert.match(readme, /final page packet, editorial QA report, and image manifest/);

  assert.match(agent, /workflows\/19-v2-content-quality\.md/);
  assert.match(agent, /No hard-gate override/);

  assert.match(gemini, /\/seo:v2/);
  assert.match(command, /Generate one V2 content-quality page workflow/);
  assert.match(command, /validate-gates/);

  assert.match(codexSkill, /V2 Content Quality/);
  assert.match(codexSkill, /debug-bundle/);
});
