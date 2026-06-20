import type { User } from "../types/api";
import { canUpdateUser } from "./canUpdateUser";
import { useAccessTokenClaims } from "./useAccessTokenPermissions";

export function useCanUpdateUser(user: User | undefined): boolean {
  const claimsQuery = useAccessTokenClaims();

  if (!user || claimsQuery.isLoading || claimsQuery.isError || !claimsQuery.data) {
    return false;
  }

  return canUpdateUser(user, claimsQuery.data.permissions, claimsQuery.data.email);
}
