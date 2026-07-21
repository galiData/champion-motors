import type { InputHTMLAttributes } from "react";
import { cn } from "@/utils/cn";

/** 48px minimum height, mist border, Champion Blue focus — per design.md forms. */
export function Input({ className, ...props }: InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      className={cn(
        "h-12 w-full rounded border border-cm-mist bg-white px-4 text-base text-cm-ink",
        "placeholder:text-cm-gray focus:border-cm-blue focus:outline-none",
        "disabled:cursor-not-allowed disabled:bg-cm-surface disabled:text-cm-gray",
        className,
      )}
      {...props}
    />
  );
}
