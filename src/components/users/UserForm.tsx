import { useState, type FormEvent } from "react";
import { z } from "zod";
import { Button } from "../ui/Button";
import { Input } from "../ui/Input";

const optionalNameSchema = z.string().trim().min(1, "Cannot be empty").optional();

const createUserSchema = z.object({
  email: z.string().email("Enter a valid email address"),
  displayName: z.string().trim().min(1, "Display name is required"),
  givenName: optionalNameSchema,
  surname: optionalNameSchema,
});

const updateUserSchema = z.object({
  displayName: z.string().trim().min(1, "Display name is required"),
  givenName: optionalNameSchema,
  surname: optionalNameSchema,
});

type UserFormMode = "create" | "edit";

type UserFormValues = Readonly<{
  email?: string;
  displayName: string;
  givenName?: string;
  surname?: string;
}>;

type UserFormProps = Readonly<{
  mode: UserFormMode;
  initialValues?: Readonly<{
    email?: string;
    displayName?: string;
    givenName?: string;
    surname?: string;
  }>;
  submitLabel: string;
  isSubmitting?: boolean;
  onSubmit: (values: UserFormValues) => void;
}>;

function optionalTrimmedName(value: string): string | undefined {
  const trimmed = value.trim();
  return trimmed.length === 0 ? undefined : trimmed;
}

export function UserForm({
  mode,
  initialValues,
  submitLabel,
  isSubmitting = false,
  onSubmit,
}: UserFormProps) {
  const [email, setEmail] = useState(initialValues?.email ?? "");
  const [displayName, setDisplayName] = useState(initialValues?.displayName ?? "");
  const [givenName, setGivenName] = useState(initialValues?.givenName ?? "");
  const [surname, setSurname] = useState(initialValues?.surname ?? "");
  const [errors, setErrors] = useState<Record<string, string>>({});

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (mode === "create") {
      const parsed = createUserSchema.safeParse({
        email,
        displayName,
        givenName: optionalTrimmedName(givenName),
        surname: optionalTrimmedName(surname),
      });

      if (!parsed.success) {
        setErrors(
          Object.fromEntries(parsed.error.issues.map((issue) => [issue.path[0], issue.message])),
        );
        return;
      }

      setErrors({});
      onSubmit(parsed.data);
      return;
    }

    const parsed = updateUserSchema.safeParse({
      displayName,
      givenName: optionalTrimmedName(givenName),
      surname: optionalTrimmedName(surname),
    });

    if (!parsed.success) {
      setErrors(
        Object.fromEntries(parsed.error.issues.map((issue) => [issue.path[0], issue.message])),
      );
      return;
    }

    setErrors({});
    onSubmit(parsed.data);
  }

  return (
    <form className="space-y-4" onSubmit={handleSubmit}>
      {mode === "create" ? (
        <Input
          label="Email"
          type="email"
          autoComplete="email"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          error={errors.email}
        />
      ) : null}

      <Input
        label="Display name"
        autoComplete="name"
        value={displayName}
        onChange={(event) => setDisplayName(event.target.value)}
        error={errors.displayName}
      />

      <Input
        label="Given name"
        autoComplete="given-name"
        value={givenName}
        onChange={(event) => setGivenName(event.target.value)}
        error={errors.givenName}
      />
      <Input
        label="Surname"
        autoComplete="family-name"
        value={surname}
        onChange={(event) => setSurname(event.target.value)}
        error={errors.surname}
      />

      <Button type="submit" disabled={isSubmitting}>
        {isSubmitting ? "Saving…" : submitLabel}
      </Button>
    </form>
  );
}
