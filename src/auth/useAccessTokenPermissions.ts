import { useAuth0 } from "@auth0/auth0-react";
import { useQuery } from "@tanstack/react-query";
import { accessTokenClaimsFromToken } from "./accessTokenClaims";
import { useApiToken } from "./useApiToken";

const accessTokenClaimsKey = ["accessToken", "claims"] as const;

export function useAccessTokenClaims() {
  const { isAuthenticated } = useAuth0();
  const getToken = useApiToken();

  return useQuery({
    queryKey: accessTokenClaimsKey,
    queryFn: async () => {
      const token = await getToken();
      return accessTokenClaimsFromToken(token);
    },
    enabled: isAuthenticated,
    staleTime: 5 * 60_000,
  });
}

export function useHasPermission(permission: string): boolean {
  const claimsQuery = useAccessTokenClaims();

  if (claimsQuery.isLoading || claimsQuery.isError || !claimsQuery.data) {
    return false;
  }

  return claimsQuery.data.permissions.includes(permission);
}
