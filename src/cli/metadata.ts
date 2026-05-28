import { extractMetadataForInventory } from "../lib/metadata.js";

export async function runMetadataCommand(args: string[]): Promise<void> {
  const [subcommand, ...rest] = args;
  if (subcommand !== "extract") {
    console.error("Usage: seo-agent metadata extract [--limit <number>]");
    process.exitCode = 1;
    return;
  }

  const limitIndex = rest.indexOf("--limit");
  const limit = limitIndex >= 0 ? Number(rest[limitIndex + 1]) : undefined;
  if (limit !== undefined && (!Number.isInteger(limit) || limit <= 0)) {
    console.error("--limit must be a positive integer.");
    process.exitCode = 1;
    return;
  }

  const metadataPath = await extractMetadataForInventory(limit);
  console.log(`Stored metadata: ${metadataPath}`);
}
