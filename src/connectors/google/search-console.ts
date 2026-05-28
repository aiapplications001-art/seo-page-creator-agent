import { readGoogleToken } from "./auth.js";

export interface SearchConsoleQueryRequest {
  siteUrl: string;
  startDate: string;
  endDate: string;
  dimensions?: Array<"query" | "page" | "country" | "device" | "searchAppearance" | "date">;
  rowLimit?: number;
}

export interface SearchConsoleQueryRow {
  keys?: string[];
  clicks: number;
  impressions: number;
  ctr: number;
  position: number;
}

export async function fetchSearchConsolePerformance(
  request: SearchConsoleQueryRequest,
  cwd = process.cwd()
): Promise<SearchConsoleQueryRow[]> {
  const token = await readGoogleToken(cwd);
  if (!token?.access_token) {
    throw new Error("Google OAuth token not found. Run `seo-agent auth google` or use CSV/XLSX fallback.");
  }

  const endpoint = `https://searchconsole.googleapis.com/webmasters/v3/sites/${encodeURIComponent(request.siteUrl)}/searchAnalytics/query`;
  const response = await fetch(endpoint, {
    method: "POST",
    headers: {
      authorization: `Bearer ${token.access_token}`,
      "content-type": "application/json"
    },
    body: JSON.stringify({
      startDate: request.startDate,
      endDate: request.endDate,
      dimensions: request.dimensions ?? ["query", "page"],
      rowLimit: request.rowLimit ?? 25000
    })
  });

  if (!response.ok) {
    throw new Error(`Search Console request failed: ${response.status} ${await response.text()}`);
  }

  const data = await response.json() as { rows?: SearchConsoleQueryRow[] };
  return data.rows ?? [];
}
