import type { LucideIcon } from "lucide-react";
import { Inbox } from "lucide-react";
import { cn } from "@/utils/cn";

export interface EmptyStateProps {
  title: string;
  description: string;
  icon?: LucideIcon;
  className?: string;
}

/** An empty list explains itself — never a bare zero. */
export function EmptyState({ title, description, icon: Icon = Inbox, className }: EmptyStateProps) {
  return (
    <div className={cn("flex flex-col items-center gap-3 px-6 py-16 text-center", className)}>
      <Icon className="size-10 text-cm-mist" aria-hidden="true" />
      <p className="text-lg font-semibold text-cm-deep-blue">{title}</p>
      <p className="max-w-md text-base text-cm-slate">{description}</p>
    </div>
  );
}
