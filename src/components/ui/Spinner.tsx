type SpinnerProps = Readonly<{
  label?: string;
}>;

export function Spinner({ label = "Loading…" }: SpinnerProps) {
  return (
    <div className="flex items-center gap-3 text-sm text-slate-300" role="status">
      <span className="inline-block h-5 w-5 animate-spin rounded-full border-2 border-slate-600 border-t-emerald-400" />
      <span>{label}</span>
    </div>
  );
}
