import { readGoogleToken } from "./auth.js";

export interface KeywordIdeaRequest {
  customerId: string;
  loginCustomerId?: string;
  languageResourceName?: string;
  geoTargetResourceNames?: string[];
  keywordSeeds: string[];
  pageUrl?: string;
}

export interface KeywordIdea {
  text: string;
  avgMonthlySearches?: string | number;
  competition?: string;
  lowTopOfPageBidMicros?: string | number;
  highTopOfPageBidMicros?: string | number;
}

export function buildKeywordIdeasRequest(request: KeywordIdeaRequest): Record<string, unknown> {
  return {
    language: request.languageResourceName,
    geoTargetConstants: request.geoTargetResourceNames ?? [],
    keywordPlanNetwork: "GOOGLE_SEARCH",
    keywordAndUrlSeed: request.pageUrl
      ? {
          url: request.pageUrl,
          keywords: request.keywordSeeds
        }
      : undefined,
    keywordSeed: request.pageUrl
      ? undefined
      : {
          keywords: request.keywordSeeds
        }
  };
}

export async function fetchKeywordIdeas(
  request: KeywordIdeaRequest,
  developerToken: string,
  cwd = process.cwd()
): Promise<KeywordIdea[]> {
  const token = await readGoogleToken(cwd);
  if (!token?.access_token) {
    throw new Error("Google OAuth token not found. Run `seo-agent auth google` or use CSV/XLSX fallback.");
  }

  const endpoint = `https://googleads.googleapis.com/v18/customers/${request.customerId}:generateKeywordIdeas`;
  const headers: Record<string, string> = {
    authorization: `Bearer ${token.access_token}`,
    "developer-token": developerToken,
    "content-type": "application/json"
  };

  if (request.loginCustomerId) {
    headers["login-customer-id"] = request.loginCustomerId;
  }

  const response = await fetch(endpoint, {
    method: "POST",
    headers,
    body: JSON.stringify(buildKeywordIdeasRequest(request))
  });

  if (!response.ok) {
    throw new Error(`Keyword Planner request failed: ${response.status} ${await response.text()}`);
  }

  const data = await response.json() as { results?: Array<{ text: string; keywordIdeaMetrics?: Record<string, unknown> }> };
  return (data.results ?? []).map((item) => ({
    text: item.text,
    avgMonthlySearches: item.keywordIdeaMetrics?.avgMonthlySearches as string | number | undefined,
    competition: item.keywordIdeaMetrics?.competition as string | undefined,
    lowTopOfPageBidMicros: item.keywordIdeaMetrics?.lowTopOfPageBidMicros as string | number | undefined,
    highTopOfPageBidMicros: item.keywordIdeaMetrics?.highTopOfPageBidMicros as string | number | undefined
  }));
}
