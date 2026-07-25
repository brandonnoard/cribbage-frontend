import type { UseQueryResult } from "@tanstack/react-query";
import { useLeagueHealthCheck } from "../hooks/useLeague";
import { useHealthCheck } from "../hooks/useUsers";
import type { HealthStatus } from "../types/api";

type HealthQuery = UseQueryResult<HealthStatus, Error>;

function statusLabel(health: HealthQuery): string {
  if (health.isLoading) {
    return "checking…";
  }

  if (health.isError) {
    return "unavailable";
  }

  return "ok";
}

function statusClass(health: HealthQuery): string {
  if (health.isError) {
    return "text-rose-400";
  }

  if (health.isLoading) {
    return "text-slate-400";
  }

  return "text-emerald-400";
}

function ServiceStatusRow({ name, health }: Readonly<{ name: string; health: HealthQuery }>) {
  return (
    <div className="flex items-baseline gap-3">
      <dt className="text-slate-300">{name}:</dt>
      <dd className={statusClass(health)}>{statusLabel(health)}</dd>
    </div>
  );
}

export function StatusPage() {
  const usersHealth = useHealthCheck();
  const leagueHealth = useLeagueHealthCheck();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-white">Status</h1>
        <p className="mt-1 text-sm text-slate-400">Health of platform API services.</p>
      </div>

      <dl className="space-y-3 text-sm">
        <ServiceStatusRow name="Users API" health={usersHealth} />
        <ServiceStatusRow name="League API" health={leagueHealth} />
      </dl>
    </div>
  );
}
