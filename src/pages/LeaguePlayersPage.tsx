import { useState } from "react";
import { Link, useParams } from "react-router-dom";
import { useHasPermission } from "../auth/useAccessTokenPermissions";
import { Alert } from "../components/ui/Alert";
import { Button } from "../components/ui/Button";
import { Select } from "../components/ui/Select";
import { Spinner } from "../components/ui/Spinner";
import { useAddLeaguePlayer, useLeague, useRemoveLeaguePlayer } from "../hooks/useLeague";
import { useUsersList } from "../hooks/useUsers";
import { isRosterEditable } from "../lib/calendar-date";
import { ApiRequestError, formatValidationMessage, type User } from "../types/api";

function errorMessage(error: unknown): string {
  if (error instanceof ApiRequestError) {
    if (error.code === "VALIDATION_ERROR") {
      return formatValidationMessage(error.details);
    }

    return error.message;
  }

  if (error instanceof Error) {
    return error.message;
  }

  return "Something went wrong.";
}

function formatStartDate(startDate: string): string {
  const parsed = new Date(`${startDate}T00:00:00.000Z`);
  if (Number.isNaN(parsed.getTime())) {
    return startDate;
  }

  return parsed.toLocaleDateString(undefined, {
    timeZone: "UTC",
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

function userOptionLabel(user: User): string {
  return `${user.displayName} (${user.email})`;
}

export function LeaguePlayersPage() {
  const { id } = useParams<{ id: string }>();
  const leagueQuery = useLeague(id);
  const canReadUsers = useHasPermission("user:read");
  const usersQuery = useUsersList({ enabled: canReadUsers });
  const addPlayer = useAddLeaguePlayer(id ?? "");
  const removePlayer = useRemoveLeaguePlayer(id ?? "");
  const [selectedUserId, setSelectedUserId] = useState("");

  if (!id) {
    return <Alert message="Missing league id in URL." />;
  }

  if (leagueQuery.isLoading) {
    return <Spinner label="Loading league…" />;
  }

  if (leagueQuery.isError) {
    return (
      <div className="space-y-4">
        <Alert title="League not found" message={errorMessage(leagueQuery.error)} />
        <Link to="/leagues" className="text-sm text-emerald-400 hover:underline">
          Back to leagues
        </Link>
      </div>
    );
  }

  const league = leagueQuery.data;
  if (!league) {
    return null;
  }

  const rosterEditable = isRosterEditable(league.startDate);
  const rosterPlayerIds = new Set(league.players.map((player) => player.playerId));
  const availableUsers = (usersQuery.data ?? []).filter((user) => !rosterPlayerIds.has(user.id));
  const leagueFull = league.players.length >= league.sizeLimit;
  const mutationPending = addPlayer.isPending || removePlayer.isPending;
  const mutationError = addPlayer.error ?? removePlayer.error;

  function handleAddPlayer() {
    const user = availableUsers.find((candidate) => candidate.id === selectedUserId);
    if (!user || !rosterEditable || leagueFull) {
      return;
    }

    addPlayer.mutate(
      {
        playerId: user.id,
        displayName: user.displayName,
        email: user.email,
      },
      {
        onSuccess: () => {
          setSelectedUserId("");
        },
      },
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <Link to="/leagues" className="text-sm text-emerald-400 hover:underline">
          ← Back to leagues
        </Link>
        <h1 className="mt-3 text-2xl font-semibold text-white">Manage players</h1>
        <p className="mt-1 text-sm text-slate-400">
          {league.name} · starts {formatStartDate(league.startDate)} · {league.players.length}/
          {league.sizeLimit} players
        </p>
      </div>

      {!rosterEditable ? (
        <Alert
          variant="info"
          title="Roster locked"
          message="Players cannot be added or removed within 7 calendar days of the league start date."
        />
      ) : null}

      {mutationError ? (
        <Alert title="Could not update roster" message={errorMessage(mutationError)} />
      ) : null}

      <section className="space-y-4">
        <h2 className="text-lg font-medium text-white">Current roster</h2>
        {league.players.length === 0 ? (
          <div className="rounded-xl border border-dashed border-slate-700 bg-slate-900/40 px-6 py-10 text-center text-slate-400">
            No players on this league yet.
          </div>
        ) : (
          <div className="overflow-hidden rounded-xl border border-slate-800">
            <table className="min-w-full divide-y divide-slate-800 text-sm">
              <thead className="bg-slate-900/80">
                <tr>
                  <th className="px-4 py-3 text-left font-medium text-slate-400">Display name</th>
                  <th className="px-4 py-3 text-left font-medium text-slate-400">Email</th>
                  <th className="px-4 py-3 text-right font-medium text-slate-400">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800 bg-slate-950/40">
                {league.players.map((player) => (
                  <tr key={player.playerId} className="transition hover:bg-slate-900/60">
                    <td className="px-4 py-3 font-medium text-white">{player.displayName}</td>
                    <td className="px-4 py-3 text-slate-300">{player.email}</td>
                    <td className="px-4 py-3 text-right">
                      <Button
                        variant="danger"
                        disabled={!rosterEditable || mutationPending}
                        onClick={() => removePlayer.mutate(player.playerId)}
                      >
                        Remove
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>

      <section className="space-y-4">
        <h2 className="text-lg font-medium text-white">Add player</h2>
        {!canReadUsers ? (
          <Alert
            variant="info"
            message="You need the user:read permission to look up accounts and add players."
          />
        ) : usersQuery.isLoading ? (
          <Spinner label="Loading users…" />
        ) : usersQuery.isError ? (
          <Alert title="Failed to load users" message={errorMessage(usersQuery.error)} />
        ) : (
          <div className="rounded-xl border border-slate-800 bg-slate-900/50 p-6">
            {leagueFull ? (
              <Alert
                variant="info"
                message={`This league is full (${league.sizeLimit} players).`}
              />
            ) : availableUsers.length === 0 ? (
              <p className="text-sm text-slate-400">
                Every user account is already on this roster, or there are no users to add.
              </p>
            ) : (
              <div className="flex flex-col gap-4 sm:flex-row sm:items-end">
                <div className="min-w-0 flex-1">
                  <Select
                    label="User"
                    value={selectedUserId}
                    disabled={!rosterEditable || mutationPending}
                    onChange={(event) => setSelectedUserId(event.target.value)}
                  >
                    <option value="">Select a user…</option>
                    {availableUsers.map((user) => (
                      <option key={user.id} value={user.id}>
                        {userOptionLabel(user)}
                      </option>
                    ))}
                  </Select>
                </div>
                <Button
                  disabled={!selectedUserId || !rosterEditable || mutationPending}
                  onClick={handleAddPlayer}
                >
                  {addPlayer.isPending ? "Adding…" : "Add player"}
                </Button>
              </div>
            )}
          </div>
        )}
      </section>
    </div>
  );
}
