import { Link } from "react-router-dom";
import { useHasPermission } from "../auth/useAccessTokenPermissions";
import { LeagueTable } from "../components/leagues/LeagueTable";
import { Alert } from "../components/ui/Alert";
import { Spinner } from "../components/ui/Spinner";
import { useLeaguesList } from "../hooks/useLeague";
import { ApiRequestError } from "../types/api";

function errorMessage(error: unknown): string {
  if (error instanceof ApiRequestError) {
    return error.message;
  }

  if (error instanceof Error) {
    return error.message;
  }

  return "Something went wrong while loading leagues.";
}

export function LeaguesListPage() {
  const leaguesQuery = useLeaguesList();
  const canCreateLeague = useHasPermission("league:create");
  const canManagePlayers = useHasPermission("league:update");

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-white">Leagues</h1>
          <p className="mt-1 text-sm text-slate-400">
            Browse leagues stored in the cribbage-league service.
          </p>
        </div>
        {canCreateLeague ? (
          <Link
            to="/leagues/new"
            className="inline-flex items-center justify-center rounded-lg bg-emerald-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-emerald-500"
          >
            Create League
          </Link>
        ) : null}
      </div>

      {leaguesQuery.isLoading ? <Spinner label="Loading leagues…" /> : null}

      {leaguesQuery.isError ? (
        <Alert title="Failed to load leagues" message={errorMessage(leaguesQuery.error)} />
      ) : null}

      {leaguesQuery.data ? (
        <LeagueTable leagues={leaguesQuery.data} canManagePlayers={canManagePlayers} />
      ) : null}
    </div>
  );
}
