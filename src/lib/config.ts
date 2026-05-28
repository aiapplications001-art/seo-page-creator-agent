import { readFile, writeFile } from "node:fs/promises";
import { existsSync } from "node:fs";
import path from "node:path";

export interface SeoAgentConfig {
  workspace_path: string;
  default_market: string;
  timezone: string;
  site_inventory: {
    default_url_metadata_limit: number;
    fetch_full_content_by_default: boolean;
    prioritize_url_types: string[];
  };
  weekly_watcher: {
    enabled: boolean;
    schedule: string;
    official_sources_only: boolean;
    custom_watch_urls: Array<{
      url: string;
      label?: string;
      reason?: string;
      source_type?: "official" | "custom" | "unknown";
    }>;
  };
  integrations: {
    google_search_console: {
      enabled: boolean;
      auth: "oauth_read_only";
    };
    google_ads_keyword_planner: {
      enabled: boolean;
      auth: "oauth_application_read_only";
    };
  };
  output: {
    write_markdown: boolean;
    write_json: boolean;
    include_json_mirror_in_markdown: boolean;
  };
}

export const CONFIG_FILE = ".seo-agent.config.json";
export const CONFIG_EXAMPLE_FILE = ".seo-agent.config.example.json";

export async function readConfig(cwd = process.cwd()): Promise<SeoAgentConfig> {
  const configPath = path.join(cwd, CONFIG_FILE);
  const examplePath = path.join(cwd, CONFIG_EXAMPLE_FILE);
  const sourcePath = existsSync(configPath) ? configPath : examplePath;
  const raw = await readFile(sourcePath, "utf8");
  return JSON.parse(raw) as SeoAgentConfig;
}

export async function writeConfig(config: SeoAgentConfig, cwd = process.cwd()): Promise<void> {
  await writeFile(path.join(cwd, CONFIG_FILE), `${JSON.stringify(config, null, 2)}\n`, "utf8");
}
