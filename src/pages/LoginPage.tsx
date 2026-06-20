import { useAuth0 } from "@auth0/auth0-react";
import { useMemo } from "react";
import { Navigate, useLocation, useSearchParams } from "react-router-dom";
import { auth0AuthorizationParams } from "../config/auth0";
import { isAuth0PlaceholderConfig } from "../config/env";
import { Button } from "../components/ui/Button";
import { Alert } from "../components/ui/Alert";

function auth0ErrorMessage(error: string, description: string | null): string {
  if (error === "access_denied" && !description) {
    return "Auth0 rejected the login request. Common causes: missing .env.local values, a callback URL mismatch (expected an Allowed Callback URL such as the app entry URL), or VITE_BASE_PATH not matching Auth0.";
  }

  return description ?? error;
}

export function LoginPage() {
  const { isAuthenticated, isLoading, loginWithRedirect } = useAuth0();
  const location = useLocation();
  const [searchParams] = useSearchParams();

  const redirectPath =
    typeof location.state === "object" &&
    location.state !== null &&
    "from" in location.state &&
    typeof location.state.from === "string"
      ? location.state.from
      : "/";

  const authError = useMemo(() => {
    const error = searchParams.get("error");
    if (!error) {
      return null;
    }

    return auth0ErrorMessage(error, searchParams.get("error_description"));
  }, [searchParams]);

  if (isLoading) {
    return null;
  }

  if (isAuthenticated) {
    return <Navigate to={redirectPath} replace />;
  }

  return (
    <div className="flex min-h-screen items-center justify-center px-4">
      <div className="w-full max-w-md rounded-2xl border border-slate-800 bg-slate-900/70 p-8 shadow-xl">
        <p className="text-sm font-medium uppercase tracking-wide text-emerald-400">Cribbage</p>
        <h1 className="mt-2 text-2xl font-semibold text-white">Sign in to continue</h1>
        <p className="mt-2 text-sm text-slate-400">
          Manage cribbage user accounts after authenticating with Auth0.
        </p>

        {authError ? (
          <div className="mt-6">
            <Alert title="Sign-in failed" message={authError} />
          </div>
        ) : null}

        {isAuth0PlaceholderConfig() ? (
          <div className="mt-6">
            <Alert
              title="Auth0 not configured"
              message="Copy .env.example to .env.local, set your Auth0 values, then restart npm run dev."
            />
          </div>
        ) : null}

        <Button
          className="mt-8 w-full"
          disabled={isAuth0PlaceholderConfig()}
          onClick={() =>
            loginWithRedirect({
              appState: { returnTo: redirectPath },
              authorizationParams: auth0AuthorizationParams,
            })
          }
        >
          Sign in with Auth0
        </Button>
      </div>
    </div>
  );
}
