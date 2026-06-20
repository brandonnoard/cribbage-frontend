import type { InputHTMLAttributes } from "react";

type InputProps = InputHTMLAttributes<HTMLInputElement> & {
  label: string;
  error?: string;
};

export function Input({ label, error, id, className = "", ...props }: InputProps) {
  const inputId = id ?? label.toLowerCase().replace(/\s+/g, "-");

  return (
    <label className="block space-y-1.5" htmlFor={inputId}>
      <span className="text-sm font-medium text-slate-300">{label}</span>
      <input
        id={inputId}
        className={`w-full rounded-lg border border-slate-700 bg-slate-900 px-3 py-2 text-sm text-white outline-none ring-emerald-500/40 placeholder:text-slate-500 focus:border-emerald-500 focus:ring-2 ${className}`}
        {...props}
      />
      {error ? <span className="block text-sm text-rose-400">{error}</span> : null}
    </label>
  );
}
