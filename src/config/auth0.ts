import { absoluteAppUrl } from "./basePath";
import { env } from "./env";

/** Must match an Allowed Callback URL in Auth0 (see cribbage-infra/auth0/spa_app.tf). */
export function auth0RedirectUri(): string {
  return absoluteAppUrl(window.location.origin);
}

export const auth0AuthorizationParams = {
  redirect_uri: auth0RedirectUri(),
  audience: env.auth0Audience,
} as const;
