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
  format: z.union([
    z.object({
      type: z.literal("single-phase"),
      phase: z.literal("round-robin"),
    }),
    z.object({
      type: z.literal("single-phase"),
      phase: z.literal("knockout"),
    }),
    z.object({
      type: z.literal("two-phase"),
      firstPhase: z.literal("round-robin"),
      qualifyPercent: z.number().int().min(1).max(100),
      secondPhase: z.literal("knockout"),
    }),
    z.object({
      type: z.literal("two-phase"),
      firstPhase: z.literal("group"),
      secondPhase: z.literal("knockout"),
    }),
  ]),
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

type FormatType = "single-phase" | "two-phase";
type SinglePhase = "round-robin" | "knockout";
type FirstPhase = "round-robin" | "group";

function utcDatePlusDays(days: number): string {
  const date = new Date();
  const utc = new Date(Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate()));
  utc.setUTCDate(utc.getUTCDate() + days);
  return utc.toISOString().slice(0, 10);
}

function buildFormat(
  formatType: FormatType,
  singlePhase: SinglePhase,
  firstPhase: FirstPhase,
  qualifyPercent: number,
): LeagueFormat {
  if (formatType === "single-phase") {
    if (singlePhase === "round-robin") {
      return { type: "single-phase", phase: "round-robin" };
    }
    return { type: "single-phase", phase: "knockout" };
  }

  if (firstPhase === "round-robin") {
    return {
      type: "two-phase",
      firstPhase: "round-robin",
      qualifyPercent,
      secondPhase: "knockout",
    };
  }

  return { type: "two-phase", firstPhase: "group", secondPhase: "knockout" };
}

export function LeagueForm({ submitLabel, isSubmitting = false, onSubmit }: LeagueFormProps) {
  const [name, setName] = useState("");
  const [sizeLimit, setSizeLimit] = useState("16");
  const [startDate, setStartDate] = useState(() => utcDatePlusDays(14));
  const [formatType, setFormatType] = useState<FormatType>("single-phase");
  const [singlePhase, setSinglePhase] = useState<SinglePhase>("round-robin");
  const [firstPhase, setFirstPhase] = useState<FirstPhase>("round-robin");
  const [qualifyPercent, setQualifyPercent] = useState("50");
  const [errors, setErrors] = useState<Record<string, string>>({});

  const needsQualifyPercent = formatType === "two-phase" && firstPhase === "round-robin";

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const parsedSize = Number(sizeLimit);
    const parsedQualify = Number(qualifyPercent);
    const format = buildFormat(formatType, singlePhase, firstPhase, parsedQualify);

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
        min={utcDatePlusDays(14)}
        onChange={(event) => setStartDate(event.target.value)}
        error={errors.startDate}
      />
      <p className="text-xs text-slate-500">Must be at least 14 calendar days after today (UTC).</p>

      <Select
        label="League type"
        value={formatType}
        onChange={(event) => setFormatType(event.target.value as FormatType)}
        error={errors["format.type"]}
      >
        <option value="single-phase">Single-phase</option>
        <option value="two-phase">Two-phase</option>
      </Select>

      {formatType === "single-phase" ? (
        <Select
          label="Phase"
          value={singlePhase}
          onChange={(event) => setSinglePhase(event.target.value as SinglePhase)}
          error={errors["format.phase"]}
        >
          <option value="round-robin">Round-robin</option>
          <option value="knockout">Knockout</option>
        </Select>
      ) : (
        <>
          <Select
            label="First phase"
            value={firstPhase}
            onChange={(event) => setFirstPhase(event.target.value as FirstPhase)}
            error={errors["format.firstPhase"]}
          >
            <option value="round-robin">Round-robin</option>
            <option value="group">Group</option>
          </Select>
          <p className="text-xs text-slate-500">Second phase is always knockout.</p>
        </>
      )}

      {needsQualifyPercent ? (
        <Input
          label="Percentage of players who qualify for the playoffs"
          type="number"
          min={1}
          max={100}
          value={qualifyPercent}
          onChange={(event) => setQualifyPercent(event.target.value)}
          error={errors["format.qualifyPercent"]}
        />
      ) : null}

      <Button type="submit" disabled={isSubmitting}>
        {isSubmitting ? "Saving…" : submitLabel}
      </Button>
    </form>
  );
}
