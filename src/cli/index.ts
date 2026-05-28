#!/usr/bin/env node

import { runGoogleAuth } from "./auth-google.js";
import { runInitWorkspace } from "./init-workspace.js";

function printHelp(): void {
  console.log(`SEO Page Creator Agent CLI

Usage:
  seo-agent init
  seo-agent auth google
  seo-agent auth google --code <AUTH_CODE>
  seo-agent help

V1 CLI scope:
  - deterministic helpers
  - workspace setup
  - Google OAuth token setup
  - future sitemap, metadata, validation, and import commands

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

  console.error(`Unknown command: ${[command, subcommand].filter(Boolean).join(" ")}`);
  printHelp();
  process.exitCode = 1;
}

main().catch((error: unknown) => {
  console.error(error instanceof Error ? error.message : String(error));
  process.exitCode = 1;
});
