import type { LucideIcon } from "lucide-react";
import { ArrowLeft, ExternalLink } from "lucide-react";
import { Link } from "react-router-dom";

export interface LauncherTileProps {
  label: string;
  description: string;
  icon: LucideIcon;
  /** Internal route. Ignored when `href` is set. */
  to?: string;
  /** External tool. Opens in a new tab. */
  href?: string;
}

/**
 * A tile in the productivity launcher. Tiles point at internal routes today and
 * can point at external tools later without changing the grid.
 */
export function LauncherTile({ label, description, icon: Icon, to, href }: LauncherTileProps) {
  const body = (
    <>
      <span className="flex size-12 items-center justify-center rounded-lg bg-cm-blue/10">
        <Icon className="size-6 text-cm-blue" aria-hidden="true" />
      </span>
      <span className="flex flex-col gap-1">
        <span className="text-lg font-semibold text-cm-deep-blue">{label}</span>
        <span className="text-sm text-cm-slate">{description}</span>
      </span>
      {href ? (
        <ExternalLink className="size-4 shrink-0 text-cm-gray" aria-hidden="true" />
      ) : (
        <ArrowLeft className="size-4 shrink-0 text-cm-gray rtl:rotate-180" aria-hidden="true" />
      )}
    </>
  );

  const className =
    "flex items-start gap-4 rounded-lg border border-cm-mist bg-white p-6 transition-colors hover:border-cm-blue";

  if (href) {
    return (
      <a href={href} target="_blank" rel="noreferrer" className={className}>
        {body}
      </a>
    );
  }

  return (
    <Link to={to ?? "#"} className={className}>
      {body}
    </Link>
  );
}
