import { readFile, writeFile, mkdir } from "node:fs/promises";
import { existsSync } from "node:fs";
import path from "node:path";
import { readConfig } from "../../lib/config.js";

export const GOOGLE_SEARCH_CONSOLE_SCOPE = "https://www.googleapis.com/auth/webmasters.readonly";
export const GOOGLE_ADS_SCOPE = "https://www.googleapis.com/auth/adwords";

export interface GoogleOAuthToken {
  access_token: string;
  refresh_token?: string;
  expires_in?: number;
  token_type?: string;
  scope?: string;
  obtained_at: string;
}

export interface GoogleOAuthConfig {
  clientId: string;
  clientSecret?: string;
  redirectUri: string;
  scopes: string[];
}

export function buildGoogleOAuthUrl(config: GoogleOAuthConfig): string {
  const params = new URLSearchParams({
    client_id: config.clientId,
    redirect_uri: config.redirectUri,
    response_type: "code",
    access_type: "offline",
    prompt: "consent",
    scope: config.scopes.join(" ")
  });

  return `https://accounts.google.com/o/oauth2/v2/auth?${params.toString()}`;
}

export async function googleTokenPath(cwd = process.cwd()): Promise<string> {
  const config = await readConfig(cwd);
  return path.resolve(cwd, config.workspace_path, "credentials", "google-oauth.json");
}

export async function readGoogleToken(cwd = process.cwd()): Promise<GoogleOAuthToken | null> {
  const tokenPath = await googleTokenPath(cwd);
  if (!existsSync(tokenPath)) {
    return null;
  }
  const raw = await readFile(tokenPath, "utf8");
  return JSON.parse(raw) as GoogleOAuthToken;
}

export async function saveGoogleToken(token: GoogleOAuthToken, cwd = process.cwd()): Promise<string> {
  const tokenPath = await googleTokenPath(cwd);
  await mkdir(path.dirname(tokenPath), { recursive: true });
  await writeFile(tokenPath, `${JSON.stringify(token, null, 2)}\n`, { encoding: "utf8", mode: 0o600 });
  return tokenPath;
}

export async function exchangeOAuthCode(config: GoogleOAuthConfig, code: string): Promise<GoogleOAuthToken> {
  if (!config.clientSecret) {
    throw new Error("GOOGLE_CLIENT_SECRET is required to exchange an OAuth code.");
  }

  const response = await fetch("https://oauth2.googleapis.com/token", {
    method: "POST",
    headers: {
      "content-type": "application/x-www-form-urlencoded"
    },
    body: new URLSearchParams({
      code,
      client_id: config.clientId,
      client_secret: config.clientSecret,
      redirect_uri: config.redirectUri,
      grant_type: "authorization_code"
    })
  });

  if (!response.ok) {
    throw new Error(`Google OAuth token exchange failed: ${response.status} ${await response.text()}`);
  }

  const token = await response.json() as Omit<GoogleOAuthToken, "obtained_at">;
  return {
    ...token,
    obtained_at: new Date().toISOString()
  };
}
