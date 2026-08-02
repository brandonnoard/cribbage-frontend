import { useState, type FormEvent } from "react";
import { z } from "zod";
import { addUtcCalendarDays, utcToday } from "../../lib/calendar-date";
import type { LeagueFormat } from "../../types/api";
import { Button } from "../ui/Button";
import { Input } from "../ui/Input";
import { Select } from "../ui/Select";

const leagueFormatSchema = z.enum(["round-robin", "bracket", "prelims-bracket"]);

function buildLeagueSchema(minSizeLimit: number, earliestStartDate: string) {
  return z.object({
    name: z
      .string()
      .trim()
      .min(2, "Name must be at least 2 characters")
      .max(100, "Name is too long"),
    sizeLimit: z
      .number()
      .int()
      .min(minSizeLimit, `Minimum size is ${minSizeLimit}`)
      .max(128, "Maximum size is 128"),
    startDate: z
      .string()
      .regex(/^\d{4}-\d{2}-\d{2}$/, "Start date must be YYYY-MM-DD")
      .refine((value) => value >= earliestStartDate, {
        message: "Start date must be tomorrow or later (UTC)",
      }),
    format: leagueFormatSchema,
  });
}

export type LeagueFormValues = Readonly<{
  name: string;
  sizeLimit: number;
  startDate: string;
  format: LeagueFormat;
}>;

type LeagueFormMode = "create" | "edit";

type LeagueFormProps = Readonly<{
  mode?: LeagueFormMode;
  initialValues?: LeagueFormValues;
  /** Floor for size limit (at least 4; edit uses max(4, roster size)). */
  minSizeLimit?: number;
  submitLabel: string;
  isSubmitting?: boolean;
  onSubmit: (values: LeagueFormValues) => void;
}>;

export function LeagueForm({
  mode = "create",
  initialValues,
  minSizeLimit = 4,
  submitLabel,
  isSubmitting = false,
  onSubmit,
}: LeagueFormProps) {
  const earliestStartDate = addUtcCalendarDays(utcToday(), 1);
  const [name, setName] = useState(initialValues?.name ?? "");
  const [sizeLimit, setSizeLimit] = useState(String(initialValues?.sizeLimit ?? 16));
  const [startDate, setStartDate] = useState(() => initialValues?.startDate ?? earliestStartDate);
  const [format, setFormat] = useState<LeagueFormat>(initialValues?.format ?? "round-robin");
  const [errors, setErrors] = useState<Record<string, string>>({});

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const parsedSize = Number(sizeLimit);
    const parsed = buildLeagueSchema(minSizeLimit, earliestStartDate).safeParse({
      name,
      sizeLimit: Number.isFinite(parsedSize) ? parsedSize : Number.NaN,
      startDate,
      format,
    });

    if (!parsed.success) {
      setErrors(
        Object.fromEntries(
          parsed.error.issues.map((issue) => [issue.path.join(".") || "form", issue.message]),
        ),
      );
      return;
    }

    setErrors({});
    onSubmit(parsed.data);
  }

  return (
    <form className="space-y-4" onSubmit={handleSubmit}>
      <Input
        label="Name"
        value={name}
        onChange={(event) => setName(event.target.value)}
        error={errors.name}
      />

      <Input
        label="Size limit"
        type="number"
        min={minSizeLimit}
        max={128}
        value={sizeLimit}
        onChange={(event) => setSizeLimit(event.target.value)}
        error={errors.sizeLimit}
      />
      {mode === "edit" && minSizeLimit > 4 ? (
        <p className="text-xs text-slate-500">
          Cannot be below the current roster size ({minSizeLimit}).
        </p>
      ) : null}

      <Input
        label="Start date"
        type="date"
        value={startDate}
        min={earliestStartDate}
        onChange={(event) => setStartDate(event.target.value)}
        error={errors.startDate}
      />
      <p className="text-xs text-slate-500">Must be at least 1 calendar day after today (UTC).</p>

      <Select
        label="Format"
        value={format}
        onChange={(event) => setFormat(event.target.value as LeagueFormat)}
        error={errors.format}
      >
        <option value="round-robin">Round Robin</option>
        <option value="bracket">Bracket</option>
        <option value="prelims-bracket">Qualifying/Bracket</option>
      </Select>
      <p className="text-xs text-slate-500">
        For Qualifying/Bracket, pairing options and qualifier count are chosen when the schedule is
        created.
      </p>

      <Button type="submit" disabled={isSubmitting}>
        {isSubmitting ? "Saving…" : submitLabel}
      </Button>
    </form>
  );
}
