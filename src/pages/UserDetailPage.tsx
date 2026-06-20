import { Link, useParams } from "react-router-dom";
import { useCanUpdateUser } from "../auth/useCanUpdateUser";
import { UserForm } from "../components/users/UserForm";
import { Alert } from "../components/ui/Alert";
import { Spinner } from "../components/ui/Spinner";
import { useUpdateUser, useUser } from "../hooks/useUsers";
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

  return "Something went wrong.";
}

export function UserDetailPage() {
  const { id } = useParams<{ id: string }>();
  const userQuery = useUser(id);
  const updateUser = useUpdateUser(id ?? "");
  const canUpdate = useCanUpdateUser(userQuery.data);

  if (!id) {
    return <Alert message="Missing user id in URL." />;
  }

  if (userQuery.isLoading) {
    return <Spinner label="Loading user…" />;
  }

  if (userQuery.isError) {
    return (
      <div className="space-y-4">
        <Alert title="User not found" message={errorMessage(userQuery.error)} />
        <Link to="/users" className="text-sm text-emerald-400 hover:underline">
          Back to users
        </Link>
      </div>
    );
  }

  const user = userQuery.data;

  if (!user) {
    return null;
  }

  return (
    <div className="mx-auto max-w-xl space-y-6">
      <div>
        <Link to="/users" className="text-sm text-emerald-400 hover:underline">
          ← Back to users
        </Link>
        <h1 className="mt-3 text-2xl font-semibold text-white">{user.displayName}</h1>
        <p className="mt-1 text-sm text-slate-400">{user.email}</p>
        <p className="mt-2 font-mono text-xs text-slate-500">{user.id}</p>
      </div>

      {updateUser.isSuccess ? <Alert variant="success" message="Display name updated." /> : null}

      {updateUser.isError ? (
        <Alert title="Update failed" message={errorMessage(updateUser.error)} />
      ) : null}

      {canUpdate ? (
        <div className="rounded-xl border border-slate-800 bg-slate-900/50 p-6">
          <h2 className="mb-4 text-lg font-medium text-white">Edit display name</h2>
          <UserForm
            mode="edit"
            initialValues={{ displayName: user.displayName }}
            submitLabel="Save changes"
            isSubmitting={updateUser.isPending}
            onSubmit={(values) => {
              updateUser.mutate({ displayName: values.displayName });
            }}
          />
        </div>
      ) : null}
    </div>
  );
}
