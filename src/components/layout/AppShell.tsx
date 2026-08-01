import { useAuth0 } from "@auth0/auth0-react";
import { Link, Outlet, useLocation } from "react-router-dom";
import { useHasPermission } from "../../auth/useAccessTokenPermissions";
import { absoluteAppUrl } from "../../config/basePath";
import { auth0AuthorizationParams } from "../../config/auth0";
import { isAuth0PlaceholderConfig } from "../../config/env";
import { Button } from "../ui/Button";

export function AppShell() {
  const { user, isAuthenticated, isLoading, loginWithRedirect, logout } = useAuth0();
  const location = useLocation();
  const canReadUsers = useHasPermission("user:read");
  const canViewAllLeagues = useHasPermission("league:view");
  const canViewOwnLeagues = useHasPermission("league:view:self");
  const canViewLeagues = canViewAllLeagues || canViewOwnLeagues;

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
              {canViewLeagues ? (
                <Link
                  to="/leagues"
                  className="rounded-md px-2 py-1 text-slate-300 transition hover:bg-slate-800 hover:text-white"
                >
                  Leagues
                </Link>
              ) : null}
            </nav>
          </div>

          <div className="flex flex-col items-end gap-1">
            <div className="flex items-center gap-4">
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
            <Link to="/status" className="text-xs text-slate-400 transition hover:text-white">
              Status
            </Link>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-4 py-8">
        <Outlet />
      </main>
    </div>
  );
}
