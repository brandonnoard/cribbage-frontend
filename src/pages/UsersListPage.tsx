import { Link } from "react-router-dom";
import { useAccessTokenClaims, useHasPermission } from "../auth/useAccessTokenPermissions";
import { UserTable } from "../components/users/UserTable";
import { Alert } from "../components/ui/Alert";
import { Spinner } from "../components/ui/Spinner";
import { useUsersList } from "../hooks/useUsers";
import { ApiRequestError } from "../types/api";

function errorMessage(error: unknown): string {
  if (error instanceof ApiRequestError) {
    return error.message;
  }

  if (error instanceof Error) {
    return error.message;
  }

  return "Something went wrong while loading users.";
}

export function UsersListPage() {
  const usersQuery = useUsersList();
  const claimsQuery = useAccessTokenClaims();
  const canCreateUser = useHasPermission("user:create");

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-white">Users</h1>
          <p className="mt-1 text-sm text-slate-400">
            Browse and manage accounts stored in the cribbage-users service.
          </p>
        </div>
        {canCreateUser ? (
          <Link
            to="/users/new"
            className="inline-flex items-center justify-center rounded-lg bg-emerald-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-emerald-500"
          >
            Create user
          </Link>
        ) : null}
      </div>

      {usersQuery.isLoading ? <Spinner label="Loading users…" /> : null}

      {usersQuery.isError ? (
        <Alert title="Failed to load users" message={errorMessage(usersQuery.error)} />
      ) : null}

      {usersQuery.data ? (
        <UserTable
          users={usersQuery.data}
          permissions={claimsQuery.data?.permissions}
          accessTokenEmail={claimsQuery.data?.email}
        />
      ) : null}
    </div>
  );
}
