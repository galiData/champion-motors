import type { SelectHTMLAttributes } from "react";
import { cn } from "@/utils/cn";

/** Native select styled to match Input — 48px, mist border, Champion Blue focus. */
export function Select({ className, ...props }: SelectHTMLAttributes<HTMLSelectElement>) {
  return (
    <select
      className={cn(
        "h-12 w-full rounded border border-cm-mist bg-white px-4 text-base text-cm-ink",
        "focus:border-cm-blue focus:outline-none",
        "disabled:cursor-not-allowed disabled:bg-cm-surface disabled:text-cm-gray",
        className,
      )}
      {...props}
    />
  );
}
