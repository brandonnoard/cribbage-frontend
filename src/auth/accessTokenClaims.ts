function decodeBase64Url(value: string): string {
  const base64 = value.replace(/-/g, "+").replace(/_/g, "/");
  const padding = (4 - (base64.length % 4)) % 4;

  return atob(base64.padEnd(base64.length + padding, "="));
}

function decodeAccessTokenPayload(token: string): Record<string, unknown> {
  const parts = token.split(".");

  if (parts.length !== 3) {
    throw new Error("Invalid access token");
  }

  const payload = parts[1];

  if (!payload) {
    throw new Error("Invalid access token");
  }

  return JSON.parse(decodeBase64Url(payload)) as Record<string, unknown>;
}

export const ACCESS_TOKEN_EMAIL_CLAIM = "https://noard.org/cribbage/email";

export type AccessTokenClaims = Readonly<{
  permissions: readonly string[];
  email: string | undefined;
}>;

function permissionsFromPayload(payload: Record<string, unknown>): readonly string[] {
  const permissions = payload.permissions;

  if (!Array.isArray(permissions)) {
    return [];
  }

  return permissions.filter((permission): permission is string => typeof permission === "string");
}

function emailFromPayload(payload: Record<string, unknown>): string | undefined {
  const email = payload[ACCESS_TOKEN_EMAIL_CLAIM];

  if (typeof email !== "string" || email.trim().length === 0) {
    return undefined;
  }

  return email.trim();
}

export function accessTokenClaimsFromToken(token: string): AccessTokenClaims {
  const payload = decodeAccessTokenPayload(token);

  return {
    permissions: permissionsFromPayload(payload),
    email: emailFromPayload(payload),
  };
}

export function permissionsFromAccessToken(token: string): readonly string[] {
  return accessTokenClaimsFromToken(token).permissions;
}
