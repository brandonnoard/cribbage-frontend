type AlertProps = Readonly<{
  title?: string;
  message: string;
  variant?: "error" | "info" | "success";
}>;

const variantClasses: Record<NonNullable<AlertProps["variant"]>, string> = {
  error: "border-rose-800 bg-rose-950/60 text-rose-100",
  info: "border-slate-700 bg-slate-900/80 text-slate-200",
  success: "border-emerald-800 bg-emerald-950/50 text-emerald-100",
};

export function Alert({ title, message, variant = "error" }: AlertProps) {
  return (
    <div className={`rounded-lg border px-4 py-3 text-sm ${variantClasses[variant]}`}>
      {title ? <p className="mb-1 font-medium">{title}</p> : null}
      <p className="whitespace-pre-wrap">{message}</p>
    </div>
  );
}
