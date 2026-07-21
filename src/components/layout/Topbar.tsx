import { Menu, Search } from "lucide-react";
import { useLocation } from "react-router-dom";
import { labelForPath } from "@/app/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useCurrentUser } from "@/hooks/useCurrentUser";

export interface TopbarProps {
  onOpenNav: () => void;
}

export function Topbar({ onOpenNav }: TopbarProps) {
  const { pathname } = useLocation();
  const { user, signOut } = useCurrentUser();
  const title = labelForPath(pathname);

  return (
    <header className="sticky top-0 z-30 flex h-20 shrink-0 items-center gap-4 border-b border-cm-mist bg-white px-6 lg:px-8">
      <button
        type="button"
        onClick={onOpenNav}
        aria-label="פתיחת התפריט"
        className="rounded p-2 text-cm-graphite hover:bg-cm-surface lg:hidden"
      >
        <Menu className="size-5" aria-hidden="true" />
      </button>

      {title ? <h2 className="text-lg font-semibold text-cm-deep-blue">{title}</h2> : null}

      <div className="relative ms-auto hidden w-full max-w-xs md:block">
        <Search
          className="pointer-events-none absolute start-3 top-1/2 size-4 -translate-y-1/2 text-cm-gray"
          aria-hidden="true"
        />
        <Input
          type="search"
          placeholder="חיפוש בפורטל"
          aria-label="חיפוש בפורטל"
          className="h-11 ps-10"
        />
      </div>

      {user ? (
        <div className="flex items-center gap-3 md:ms-4">
          <span
            aria-hidden="true"
            className="flex size-10 shrink-0 items-center justify-center rounded-full bg-cm-deep-blue text-sm font-semibold text-white"
          >
            {user.initials}
          </span>
          <span className="hidden flex-col leading-tight sm:flex">
            <span className="text-sm font-semibold text-cm-ink">{user.name}</span>
            <span className="text-xs text-cm-slate">{user.role}</span>
          </span>
          <Button variant="tertiary" size="sm" onClick={signOut}>
            יציאה
          </Button>
        </div>
      ) : null}
    </header>
  );
}
