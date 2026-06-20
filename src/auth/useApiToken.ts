import { useAuth0 } from "@auth0/auth0-react";
import { useCallback } from "react";
import { env } from "../config/env";

export function useApiToken(): () => Promise<string> {
  const { getAccessTokenSilently } = useAuth0();

  return useCallback(async () => {
    return getAccessTokenSilently({
      authorizationParams: {
        audience: env.auth0Audience,
      },
    });
  }, [getAccessTokenSilently]);
}
