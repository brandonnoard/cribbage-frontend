import { Auth0Provider, type AppState } from "@auth0/auth0-react";
import type { ReactNode } from "react";
import { useNavigate } from "react-router-dom";
import { auth0AuthorizationParams } from "../config/auth0";
import { env } from "../config/env";

type Auth0ProviderWithNavigateProps = Readonly<{
  children: ReactNode;
}>;

export function Auth0ProviderWithNavigate({ children }: Auth0ProviderWithNavigateProps) {
  const navigate = useNavigate();

  return (
    <Auth0Provider
      domain={env.auth0Domain}
      clientId={env.auth0ClientId}
      authorizationParams={auth0AuthorizationParams}
      cacheLocation="localstorage"
      onRedirectCallback={(appState?: AppState) => {
        navigate(appState?.returnTo ?? "/", { replace: true });
      }}
    >
      {children}
    </Auth0Provider>
  );
}
