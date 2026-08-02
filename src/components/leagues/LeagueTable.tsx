import { Link } from "react-router-dom";
import type { League } from "../../types/api";

type LeagueTableProps = Readonly<{
  leagues: League[];
  canManagePlayers?: boolean;
}>;

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

export function LeagueTable({ leagues, canManagePlayers = false }: LeagueTableProps) {
  if (leagues.length === 0) {
    return (
      <div className="rounded-xl border border-dashed border-slate-700 bg-slate-900/40 px-6 py-12 text-center text-slate-400">
        No leagues yet.
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-xl border border-slate-800">
      <table className="min-w-full divide-y divide-slate-800 text-sm">
        <thead className="bg-slate-900/80">
          <tr>
            <th className="px-4 py-3 text-left font-medium text-slate-400">Name</th>
            <th className="px-4 py-3 text-left font-medium text-slate-400">Start date</th>
            <th className="px-4 py-3 text-left font-medium text-slate-400">Players</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-800 bg-slate-950/40">
          {leagues.map((league) => {
            const showManageLink = canManagePlayers && !league.locked;
            const remainingSpots = Math.max(0, league.sizeLimit - league.players.length);
            const playersLabel = `${league.players.length} (${remainingSpots} remaining)`;

            return (
              <tr key={league.id} className="transition hover:bg-slate-900/60">
                <td className="px-4 py-3 font-medium text-white">{league.name}</td>
                <td className="px-4 py-3 text-slate-300">{formatStartDate(league.startDate)}</td>
                <td className="px-4 py-3 text-slate-300">
                  {showManageLink ? (
                    <Link
                      to={`/leagues/${league.id}/players`}
                      className="font-medium text-emerald-400 hover:underline"
                    >
                      {playersLabel}
                    </Link>
                  ) : (
                    playersLabel
                  )}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
