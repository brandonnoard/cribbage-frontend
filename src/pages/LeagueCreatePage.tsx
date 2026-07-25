import { useNavigate } from "react-router-dom";
import { LeagueForm } from "../components/leagues/LeagueForm";
import { Alert } from "../components/ui/Alert";
import { useCreateLeague } from "../hooks/useLeague";
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

  return "Unable to create league.";
}

export function LeagueCreatePage() {
  const navigate = useNavigate();
  const createLeague = useCreateLeague();

  return (
    <div className="mx-auto max-w-xl space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-white">Create League</h1>
        <p className="mt-1 text-sm text-slate-400">
          Set up a new competition with capacity, format, and start date.
        </p>
      </div>

      {createLeague.isError ? (
        <Alert title="Could not create league" message={errorMessage(createLeague.error)} />
      ) : null}

      <div className="rounded-xl border border-slate-800 bg-slate-900/50 p-6">
        <LeagueForm
          submitLabel="Create League"
          isSubmitting={createLeague.isPending}
          onSubmit={(values) => {
            createLeague.mutate(values, {
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
