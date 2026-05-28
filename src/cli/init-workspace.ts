import { initWorkspace } from "../lib/workspace.js";

export async function runInitWorkspace(): Promise<void> {
  const createdPaths = await initWorkspace();
  console.log("SEO agent workspace initialized.");
  console.log(`Created or verified ${createdPaths.length} paths.`);
  for (const createdPath of createdPaths) {
    console.log(`- ${createdPath}`);
  }
}
