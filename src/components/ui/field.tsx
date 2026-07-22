import type { ReactNode } from "react";
import { cn } from "@/utils/cn";

export interface FieldProps {
  /** Wired to the control via htmlFor / id — the caller supplies a stable id. */
  htmlFor: string;
  label: string;
  /** Hebrew error message. Shown as text, never color alone — per design.md forms. */
  error?: string;
  required?: boolean;
  className?: string;
  children: ReactNode;
}

/**
 * Label-above-control field wrapper for forms. Labels are right-aligned in RTL
 * by the document direction; errors render in `cm-red` with a message.
 */
export function Field({ htmlFor, label, error, required, className, children }: FieldProps) {
  const errorId = `${htmlFor}-error`;
  return (
    <div className={cn("flex flex-col gap-2", className)}>
      <label htmlFor={htmlFor} className="text-sm font-semibold text-cm-deep-blue">
        {label}
        {required ? <span className="text-cm-red"> *</span> : null}
      </label>
      {children}
      {error ? (
        <p id={errorId} role="alert" className="text-sm text-cm-red">
          {error}
        </p>
      ) : null}
    </div>
  );
}
