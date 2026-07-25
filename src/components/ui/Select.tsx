import type { SelectHTMLAttributes } from "react";

type SelectProps = SelectHTMLAttributes<HTMLSelectElement> & {
  label: string;
  error?: string;
};

export function Select({ label, error, id, className = "", children, ...props }: SelectProps) {
  const selectId = id ?? label.toLowerCase().replace(/\s+/g, "-");

  return (
    <label className="block space-y-1.5" htmlFor={selectId}>
      <span className="text-sm font-medium text-slate-300">{label}</span>
      <select
        id={selectId}
        className={`w-full rounded-lg border border-slate-700 bg-slate-900 px-3 py-2 text-sm text-white outline-none ring-emerald-500/40 focus:border-emerald-500 focus:ring-2 ${className}`}
        {...props}
      >
        {children}
      </select>
      {error ? <span className="block text-sm text-rose-400">{error}</span> : null}
    </label>
  );
}
