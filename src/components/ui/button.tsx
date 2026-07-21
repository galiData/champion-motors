import { cva, type VariantProps } from "class-variance-authority";
import type { ButtonHTMLAttributes } from "react";
import { cn } from "@/utils/cn";

/**
 * Variants follow the button table in .claude/rules/design.md.
 * Radius stays restrained — fully rounded pills read consumer-promotional.
 */
export const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 rounded-md font-semibold transition-colors disabled:pointer-events-none disabled:opacity-50 [&_svg]:size-4 [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        primary: "bg-cm-blue text-white hover:bg-cm-navy",
        secondary:
          "border border-cm-deep-blue text-cm-deep-blue hover:bg-cm-deep-blue hover:text-white",
        tertiary: "text-cm-blue hover:underline",
        onNavy: "bg-white text-cm-navy hover:bg-cm-sky hover:text-cm-navy",
        ghost: "text-cm-graphite hover:bg-cm-surface hover:text-cm-deep-blue",
      },
      size: {
        sm: "h-9 px-4 text-sm",
        md: "h-12 px-8 text-base",
        icon: "size-11",
      },
    },
    defaultVariants: { variant: "primary", size: "md" },
  },
);

export interface ButtonProps
  extends ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {}

export function Button({ className, variant, size, ...props }: ButtonProps) {
  return <button className={cn(buttonVariants({ variant, size }), className)} {...props} />;
}
