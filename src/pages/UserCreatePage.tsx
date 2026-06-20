import { useNavigate } from "react-router-dom";
import { UserForm } from "../components/users/UserForm";
import { Alert } from "../components/ui/Alert";
import { useCreateUser } from "../hooks/useUsers";
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

  return "Unable to create user.";
}

export function UserCreatePage() {
  const navigate = useNavigate();
  const createUser = useCreateUser();

  return (
    <div className="mx-auto max-w-xl space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-white">Create user</h1>
        <p className="mt-1 text-sm text-slate-400">
          Add a new cribbage account with a unique email address.
        </p>
      </div>

      {createUser.isError ? (
        <Alert title="Could not create user" message={errorMessage(createUser.error)} />
      ) : null}

      <div className="rounded-xl border border-slate-800 bg-slate-900/50 p-6">
        <UserForm
          mode="create"
          submitLabel="Create user"
          isSubmitting={createUser.isPending}
          onSubmit={(values) => {
            if (!values.email) {
              return;
            }

            createUser.mutate(
              { email: values.email, displayName: values.displayName },
              {
                onSuccess: (user) => {
                  navigate(`/users/${user.id}`);
                },
              },
            );
          }}
        />
      </div>
    </div>
  );
}
