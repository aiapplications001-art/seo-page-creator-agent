import { mkdir, copyFile } from "node:fs/promises";
import { existsSync } from "node:fs";
import path from "node:path";
import { CONFIG_EXAMPLE_FILE, CONFIG_FILE, readConfig, writeConfig } from "./config.js";

export const workspaceFolders = [
  "credentials",
  "reference-library",
  "site-inventory",
  "product-categories",
  "clusters",
  "page-packets",
  "refresh-packets",
  "images",
  "watcher-reports",
  "imports",
  "watcher-state"
] as const;

export async function initWorkspace(cwd = process.cwd()): Promise<string[]> {
  const configPath = path.join(cwd, CONFIG_FILE);
  const examplePath = path.join(cwd, CONFIG_EXAMPLE_FILE);

  if (!existsSync(configPath)) {
    if (existsSync(examplePath)) {
      await copyFile(examplePath, configPath);
    } else {
      await writeConfig({
        workspace_path: ".seo-agent-workspace",
        default_market: "India",
        timezone: "Asia/Kolkata",
        site_inventory: {
          default_url_metadata_limit: 500,
          fetch_full_content_by_default: false,
          prioritize_url_types: ["product_category", "product", "guide_blog", "comparison", "faq_support", "pricing_trust"]
        },
        weekly_watcher: {
          enabled: true,
          schedule: "Tuesday morning",
          official_sources_only: true,
          custom_watch_urls: []
        },
        integrations: {
          google_search_console: {
            enabled: true,
            auth: "oauth_read_only"
          },
          google_ads_keyword_planner: {
            enabled: true,
            auth: "oauth_application_read_only"
          }
        },
        output: {
          write_markdown: true,
          write_json: true,
          include_json_mirror_in_markdown: true
        }
      }, cwd);
    }
  }

  const config = await readConfig(cwd);
  const workspaceRoot = path.resolve(cwd, config.workspace_path);
  const createdPaths: string[] = [];

  await mkdir(workspaceRoot, { recursive: true });
  createdPaths.push(workspaceRoot);

  for (const folder of workspaceFolders) {
    const target = path.join(workspaceRoot, folder);
    await mkdir(target, { recursive: true });
    createdPaths.push(target);
  }

  return createdPaths;
}
