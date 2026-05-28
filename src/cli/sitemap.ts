import { fetchSitemapUrls, prioritizeUrls, writeSiteInventory } from "../lib/sitemap.js";

export async function runSitemapCommand(args: string[]): Promise<void> {
  const [subcommand, sitemapUrl] = args;
  if (subcommand !== "fetch" || !sitemapUrl) {
    console.error("Usage: seo-agent sitemap fetch <sitemap-url>");
    process.exitCode = 1;
    return;
  }

  const urls = await fetchSitemapUrls(sitemapUrl);
  const inventory = prioritizeUrls(urls);
  const paths = await writeSiteInventory(inventory);

  console.log(`Fetched ${urls.length} sitemap URLs.`);
  console.log(`Included ${inventory.included.length} SEO inventory URLs.`);
  console.log(`Skipped ${inventory.skipped.length} low-value URLs.`);
  console.log(`Stored inventory: ${paths.urlsPath}`);
  console.log(`Stored skipped URLs: ${paths.skippedPath}`);
  console.log(`Stored supporting URLs: ${paths.supportingPath}`);
}
