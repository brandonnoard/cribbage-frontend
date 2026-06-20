import { Link } from "react-router-dom";
import { canUpdateUser } from "../../auth/canUpdateUser";
import type { User } from "../../types/api";

type UserTableProps = Readonly<{
  users: User[];
  permissions: readonly string[] | undefined;
  accessTokenEmail: string | undefined;
}>;

function formatOptionalField(value: string | undefined): string {
  return value ?? "—";
}

export function UserTable({ users, permissions, accessTokenEmail }: UserTableProps) {
  if (users.length === 0) {
    return (
      <div className="rounded-xl border border-dashed border-slate-700 bg-slate-900/40 px-6 py-12 text-center text-slate-400">
        No users yet. Create the first account to get started.
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-xl border border-slate-800">
      <table className="min-w-full divide-y divide-slate-800 text-sm">
        <thead className="bg-slate-900/80">
          <tr>
            <th className="px-4 py-3 text-left font-medium text-slate-400">Display name</th>
            <th className="px-4 py-3 text-left font-medium text-slate-400">Given name</th>
            <th className="px-4 py-3 text-left font-medium text-slate-400">Surname</th>
            <th className="px-4 py-3 text-left font-medium text-slate-400">Email</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-800 bg-slate-950/40">
          {users.map((user) => {
            const showEditLink =
              permissions !== undefined && canUpdateUser(user, permissions, accessTokenEmail);

            return (
              <tr key={user.id} className="transition hover:bg-slate-900/60">
                <td className="px-4 py-3">
                  {showEditLink ? (
                    <Link
                      to={`/users/${user.id}`}
                      className="font-medium text-emerald-400 hover:underline"
                    >
                      {user.displayName}
                    </Link>
                  ) : (
                    <span className="font-medium text-white">{user.displayName}</span>
                  )}
                </td>
                <td className="px-4 py-3 text-slate-300">{formatOptionalField(user.givenName)}</td>
                <td className="px-4 py-3 text-slate-300">{formatOptionalField(user.surname)}</td>
                <td className="px-4 py-3 text-slate-300">{user.email}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
