import type { ReactNode } from "react";
import { AccessDeniedPage } from "../pages/AccessDeniedPage";
import { Spinner } from "../components/ui/Spinner";
import { useAccessTokenClaims } from "./useAccessTokenPermissions";

type PermissionRouteProps = Readonly<{
  permission: string;
  children: ReactNode;
  deniedMessage?: string;
}>;

export function PermissionRoute({ permission, children, deniedMessage }: PermissionRouteProps) {
  const claimsQuery = useAccessTokenClaims();

  if (claimsQuery.isLoading) {
    return <Spinner label="Checking permissions…" />;
  }

  if (claimsQuery.isError || !claimsQuery.data?.permissions.includes(permission)) {
    return <AccessDeniedPage message={deniedMessage} />;
  }

  return children;
}
