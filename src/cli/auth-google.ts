import {
  GOOGLE_ADS_SCOPE,
  GOOGLE_SEARCH_CONSOLE_SCOPE,
  buildGoogleOAuthUrl,
  exchangeOAuthCode,
  saveGoogleToken
} from "../connectors/google/auth.js";

export async function runGoogleAuth(args: string[]): Promise<void> {
  const clientId = process.env.GOOGLE_CLIENT_ID;
  const clientSecret = process.env.GOOGLE_CLIENT_SECRET;
  const redirectUri = process.env.GOOGLE_OAUTH_REDIRECT_URI ?? "http://127.0.0.1:53682/oauth2callback";
  const codeArgIndex = args.indexOf("--code");
  const code = codeArgIndex >= 0 ? args[codeArgIndex + 1] : undefined;

  if (!clientId) {
    console.error("GOOGLE_CLIENT_ID is required. Add it to your environment or .env loader before running auth.");
    process.exitCode = 1;
    return;
  }

  const oauthConfig = {
    clientId,
    clientSecret,
    redirectUri,
    scopes: [GOOGLE_SEARCH_CONSOLE_SCOPE, GOOGLE_ADS_SCOPE]
  };

  if (!code) {
    console.log("Open this Google OAuth URL and grant read access for SEO research:");
    console.log(buildGoogleOAuthUrl(oauthConfig));
    console.log("");
    console.log("After Google redirects back with a code, run:");
    console.log("seo-agent auth google --code <AUTH_CODE>");
    return;
  }

  const token = await exchangeOAuthCode(oauthConfig, code);
  const tokenPath = await saveGoogleToken(token);
  console.log(`Saved Google OAuth token to ${tokenPath}`);
}
