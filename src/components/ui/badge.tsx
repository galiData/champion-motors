import { cva, type VariantProps } from "class-variance-authority";
import type { HTMLAttributes } from "react";
import { cn } from "@/utils/cn";

/**
 * Status meaning is never carried by color alone — every badge shows a Hebrew
 * label. Color is reinforcement, not information.
 */
export const badgeVariants = cva(
  "inline-flex items-center rounded px-2.5 py-1 text-sm font-semibold",
  {
    variants: {
      tone: {
        neutral: "bg-cm-surface text-cm-graphite",
        info: "bg-cm-blue/10 text-cm-deep-blue",
        positive: "bg-cm-deep-blue/10 text-cm-deep-blue",
        muted: "bg-cm-surface text-cm-gray",
        alert: "bg-cm-red/10 text-cm-red",
      },
    },
    defaultVariants: { tone: "neutral" },
  },
);

export interface BadgeProps
  extends HTMLAttributes<HTMLSpanElement>,
    VariantProps<typeof badgeVariants> {}

export function Badge({ className, tone, ...props }: BadgeProps) {
  return <span className={cn(badgeVariants({ tone }), className)} {...props} />;
}
