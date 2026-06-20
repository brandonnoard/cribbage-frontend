import { useAuth0 } from "@auth0/auth0-react";
import { Link, Outlet, useLocation } from "react-router-dom";
import { useHasPermission } from "../../auth/useAccessTokenPermissions";
import { absoluteAppUrl } from "../../config/basePath";
import { auth0AuthorizationParams } from "../../config/auth0";
import { isAuth0PlaceholderConfig } from "../../config/env";
import { useHealthCheck } from "../../hooks/useUsers";
import { Button } from "../ui/Button";

export function AppShell() {
  const { user, isAuthenticated, isLoading, loginWithRedirect, logout } = useAuth0();
  const location = useLocation();
  const health = useHealthCheck();
  const canReadUsers = useHasPermission("user:read");

  const healthLabel = health.isLoading
    ? "API: checking…"
    : health.isError
      ? "API: unreachable"
      : "API: ok";

  const healthClass = health.isError
    ? "text-rose-400"
    : health.isLoading
      ? "text-slate-400"
      : "text-emerald-400";

  const returnTo = `${location.pathname}${location.search}`;

  return (
    <div className="min-h-screen">
      <header className="border-b border-slate-800 bg-slate-900/80 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-4">
          <div className="flex items-center gap-6">
            <Link to="/" className="text-lg font-semibold text-white">
              Cribbage Admin
            </Link>
            <nav className="flex items-center gap-3 text-sm">
              {canReadUsers ? (
                <Link
                  to="/users"
                  className="rounded-md px-2 py-1 text-slate-300 transition hover:bg-slate-800 hover:text-white"
                >
                  Users
                </Link>
              ) : null}
            </nav>
          </div>

          <div className="flex items-center gap-4">
            <span className={`hidden text-xs sm:inline ${healthClass}`}>{healthLabel}</span>
            {isAuthenticated ? (
              <span className="hidden text-sm text-slate-400 sm:inline">{user?.email}</span>
            ) : null}
            {isLoading ? null : isAuthenticated ? (
              <Button
                variant="secondary"
                onClick={() =>
                  logout({
                    logoutParams: {
                      returnTo: absoluteAppUrl(window.location.origin),
                    },
                  })
                }
              >
                Log out
              </Button>
            ) : (
              <Button
                variant="secondary"
                disabled={isAuth0PlaceholderConfig()}
                onClick={() =>
                  loginWithRedirect({
                    appState: { returnTo },
                    authorizationParams: auth0AuthorizationParams,
                  })
                }
              >
                Log in
              </Button>
            )}
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-4 py-8">
        <Outlet />
      </main>
    </div>
  );
}
