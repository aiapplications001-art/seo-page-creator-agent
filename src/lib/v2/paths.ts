import { existsSync } from "node:fs";
import path from "node:path";
import { CONFIG_EXAMPLE_FILE, CONFIG_FILE, readConfig } from "../config.js";

export async function getV2PageDir(cwd: string, clusterSlug: string, pageId: string): Promise<string> {
  const workspacePath = await getWorkspacePath(cwd);
  return path.join(cwd, workspacePath, "v2", "page-packets", clusterSlug, pageId);
}

export function v2ArtifactPath(pageDir: string, fileName: string): string {
  return path.join(pageDir, fileName);
}

async function getWorkspacePath(cwd: string): Promise<string> {
  const hasConfig = existsSync(path.join(cwd, CONFIG_FILE)) || existsSync(path.join(cwd, CONFIG_EXAMPLE_FILE));
  if (!hasConfig) return ".seo-agent-workspace";
  const config = await readConfig(cwd);
  return config.workspace_path;
}
