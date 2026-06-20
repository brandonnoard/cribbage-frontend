import { useState, type FormEvent } from "react";
import { z } from "zod";
import { Button } from "../ui/Button";
import { Input } from "../ui/Input";

const createUserSchema = z.object({
  email: z.string().email("Enter a valid email address"),
  displayName: z.string().trim().min(1, "Display name is required"),
});

const updateUserSchema = z.object({
  displayName: z.string().trim().min(1, "Display name is required"),
});

type UserFormMode = "create" | "edit";

type UserFormProps = Readonly<{
  mode: UserFormMode;
  initialValues?: Readonly<{ email?: string; displayName?: string }>;
  submitLabel: string;
  isSubmitting?: boolean;
  onSubmit: (values: { email?: string; displayName: string }) => void;
}>;

export function UserForm({
  mode,
  initialValues,
  submitLabel,
  isSubmitting = false,
  onSubmit,
}: UserFormProps) {
  const [email, setEmail] = useState(initialValues?.email ?? "");
  const [displayName, setDisplayName] = useState(initialValues?.displayName ?? "");
  const [errors, setErrors] = useState<Record<string, string>>({});

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (mode === "create") {
      const parsed = createUserSchema.safeParse({ email, displayName });

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

    const parsed = updateUserSchema.safeParse({ displayName });

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

      <Button type="submit" disabled={isSubmitting}>
        {isSubmitting ? "Saving…" : submitLabel}
      </Button>
    </form>
  );
}
