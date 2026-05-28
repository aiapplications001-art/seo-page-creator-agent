#!/usr/bin/env node

import { runGoogleAuth } from "./auth-google.js";
import { runClusterCommand } from "./cluster.js";
import { runFinalCopyCommand } from "./final-copy.js";
import { runInitWorkspace } from "./init-workspace.js";
import { runMetadataCommand } from "./metadata.js";
import { runPagePacketCommand } from "./page-packet.js";
import { runPreWritingCommand } from "./prewriting.js";
import { runSitemapCommand } from "./sitemap.js";

function printHelp(): void {
  console.log(`SEO Page Creator Agent CLI

Usage:
  seo-agent init
  seo-agent auth google
  seo-agent auth google --code <AUTH_CODE>
  seo-agent sitemap fetch <sitemap-url>
  seo-agent metadata extract [--limit <number>]
  seo-agent cluster plan --category <name> --company <name> [--market India] [--keywords <comma-separated>]
  seo-agent prewriting plan --cluster <slug> --page-id <P1> --audience <cohort> [--tone <tone>]
  seo-agent page-packet build --cluster <slug> --page-id <P1> [--author <name>]
  seo-agent final-copy expand --cluster <slug> --page-id <P1>
  seo-agent help

V1 CLI scope:
  - deterministic helpers
  - workspace setup
  - Google OAuth token setup
  - sitemap, metadata, and cluster strategy helpers
  - future validation and import commands

Creative strategy, page copy, approval queues, and image generation are handled by agent adapters.
`);
}

async function main(): Promise<void> {
  const [, , command, subcommand, ...args] = process.argv;

  if (!command || command === "help" || command === "--help" || command === "-h") {
    printHelp();
    return;
  }

  if (command === "init") {
    await runInitWorkspace();
    return;
  }

  if (command === "auth" && subcommand === "google") {
    await runGoogleAuth(args);
    return;
  }

  if (command === "sitemap") {
    await runSitemapCommand([subcommand, ...args].filter((item): item is string => Boolean(item)));
    return;
  }

  if (command === "metadata") {
    await runMetadataCommand([subcommand, ...args].filter((item): item is string => Boolean(item)));
    return;
  }

  if (command === "cluster") {
    await runClusterCommand([subcommand, ...args].filter((item): item is string => Boolean(item)));
    return;
  }

  if (command === "prewriting") {
    await runPreWritingCommand([subcommand, ...args].filter((item): item is string => Boolean(item)));
    return;
  }

  if (command === "page-packet") {
    await runPagePacketCommand([subcommand, ...args].filter((item): item is string => Boolean(item)));
    return;
  }

  if (command === "final-copy") {
    await runFinalCopyCommand([subcommand, ...args].filter((item): item is string => Boolean(item)));
    return;
  }

  console.error(`Unknown command: ${[command, subcommand].filter(Boolean).join(" ")}`);
  printHelp();
  process.exitCode = 1;
}

main().catch((error: unknown) => {
  console.error(error instanceof Error ? error.message : String(error));
  process.exitCode = 1;
});
