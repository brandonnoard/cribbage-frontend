type Env = Readonly<{
  auth0Domain: string;
  auth0ClientId: string;
  auth0Audience: string;
  apiBaseUrl: string;
}>;

function requireEnv(name: string): string {
  const value = import.meta.env[name];

  if (typeof value !== "string" || value.trim().length === 0) {
    throw new Error(`Missing required environment variable: ${name}`);
  }

  return value.trim();
}

function normalizeBaseUrl(url: string): string {
  return url.replace(/\/+$/, "");
}

export const env: Env = {
  auth0Domain: requireEnv("VITE_AUTH0_DOMAIN"),
  auth0ClientId: requireEnv("VITE_AUTH0_CLIENT_ID"),
  auth0Audience: requireEnv("VITE_AUTH0_AUDIENCE"),
  apiBaseUrl: normalizeBaseUrl(requireEnv("VITE_API_BASE_URL")),
};

export function isAuth0PlaceholderConfig(): boolean {
  return (
    env.auth0Domain === "placeholder.auth0.com" || env.auth0ClientId === "placeholder-client-id"
  );
}
