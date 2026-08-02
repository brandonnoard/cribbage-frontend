import { Link, useNavigate, useParams } from "react-router-dom";
import { LeagueForm } from "../components/leagues/LeagueForm";
import { Alert } from "../components/ui/Alert";
import { Spinner } from "../components/ui/Spinner";
import { useLeague, useUpdateLeague } from "../hooks/useLeague";
import { ApiRequestError, formatValidationMessage } from "../types/api";

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

  return "Unable to update league.";
}

export function LeagueEditPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const leagueQuery = useLeague(id);
  const updateLeague = useUpdateLeague(id ?? "");

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

  if (league.locked) {
    return (
      <div className="mx-auto max-w-xl space-y-6">
        <div>
          <Link to="/leagues" className="text-sm text-emerald-400 hover:underline">
            ← Back to leagues
          </Link>
          <h1 className="mt-3 text-2xl font-semibold text-white">{league.name}</h1>
        </div>
        <Alert
          variant="info"
          title="League locked"
          message="This league is locked and can no longer be edited."
        />
      </div>
    );
  }

  const minSizeLimit = Math.max(4, league.players.length);

  return (
    <div className="mx-auto max-w-xl space-y-6">
      <div>
        <Link to="/leagues" className="text-sm text-emerald-400 hover:underline">
          ← Back to leagues
        </Link>
        <h1 className="mt-3 text-2xl font-semibold text-white">Edit League</h1>
        <p className="mt-1 text-sm text-slate-400">
          Update the name, format, start date, or capacity.
        </p>
      </div>

      {updateLeague.isError ? (
        <Alert title="Could not update league" message={errorMessage(updateLeague.error)} />
      ) : null}

      <div className="rounded-xl border border-slate-800 bg-slate-900/50 p-6">
        <LeagueForm
          mode="edit"
          initialValues={{
            name: league.name,
            sizeLimit: league.sizeLimit,
            startDate: league.startDate,
            format: league.format,
          }}
          minSizeLimit={minSizeLimit}
          submitLabel="Save changes"
          isSubmitting={updateLeague.isPending}
          onSubmit={(values) => {
            updateLeague.mutate(values, {
              onSuccess: () => {
                navigate("/leagues");
              },
            });
          }}
        />
      </div>
    </div>
  );
}
