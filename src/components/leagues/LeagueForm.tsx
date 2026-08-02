import { useState, type FormEvent } from "react";
import { z } from "zod";
import type { LeagueFormat } from "../../types/api";
import { Button } from "../ui/Button";
import { Input } from "../ui/Input";
import { Select } from "../ui/Select";

const createLeagueSchema = z.object({
  name: z.string().trim().min(2, "Name must be at least 2 characters").max(100, "Name is too long"),
  sizeLimit: z.number().int().min(4, "Minimum size is 4").max(128, "Maximum size is 128"),
  startDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Start date must be YYYY-MM-DD"),
  format: z.enum(["round-robin", "bracket", "prelims-bracket"]),
});

export type LeagueFormValues = Readonly<{
  name: string;
  sizeLimit: number;
  startDate: string;
  format: LeagueFormat;
}>;

type LeagueFormProps = Readonly<{
  submitLabel: string;
  isSubmitting?: boolean;
  onSubmit: (values: LeagueFormValues) => void;
}>;

function utcDatePlusDays(days: number): string {
  const date = new Date();
  const utc = new Date(Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate()));
  utc.setUTCDate(utc.getUTCDate() + days);
  return utc.toISOString().slice(0, 10);
}

export function LeagueForm({ submitLabel, isSubmitting = false, onSubmit }: LeagueFormProps) {
  const [name, setName] = useState("");
  const [sizeLimit, setSizeLimit] = useState("16");
  const [startDate, setStartDate] = useState(() => utcDatePlusDays(1));
  const [format, setFormat] = useState<LeagueFormat>("round-robin");
  const [errors, setErrors] = useState<Record<string, string>>({});

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const parsedSize = Number(sizeLimit);
    const parsed = createLeagueSchema.safeParse({
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
        min={4}
        max={128}
        value={sizeLimit}
        onChange={(event) => setSizeLimit(event.target.value)}
        error={errors.sizeLimit}
      />

      <Input
        label="Start date"
        type="date"
        value={startDate}
        min={utcDatePlusDays(1)}
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
