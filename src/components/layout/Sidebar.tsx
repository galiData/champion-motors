import { NavLink } from "react-router-dom";
import { X } from "lucide-react";
import { HUB_ITEM, NAV_SECTIONS, type NavItem } from "@/app/navigation";
import { cn } from "@/utils/cn";

/**
 * The single global navigation, and the one navy identity block in the layout.
 * Active items use Champion Blue — the action color — against navy.
 */
export interface SidebarProps {
  isOpen: boolean;
  onNavigate: () => void;
}

function SidebarLink({ item, onNavigate }: { item: NavItem; onNavigate: () => void }) {
  const Icon = item.icon;
  return (
    <NavLink
      to={item.path}
      end={item.path === "/"}
      onClick={onNavigate}
      className={({ isActive }) =>
        cn(
          "flex items-center gap-3 rounded-md px-3 py-2.5 text-base transition-colors",
          isActive
            ? "bg-cm-blue font-semibold text-white"
            : "text-white/80 hover:bg-white/10 hover:text-white",
        )
      }
    >
      <Icon className="size-5 shrink-0" aria-hidden="true" />
      {item.label}
    </NavLink>
  );
}

export function Sidebar({ isOpen, onNavigate }: SidebarProps) {
  return (
    <nav
      aria-label="ניווט ראשי"
      className={cn(
        "fixed inset-y-0 start-0 z-40 w-72 flex-col overflow-y-auto bg-cm-navy p-4",
        "lg:flex",
        isOpen ? "flex" : "hidden",
      )}
    >
      <div className="mb-8 flex items-center justify-between px-3 pt-2">
        {/*
          Text wordmark stands in for the official logo file. Replace with the
          supplied asset — design.md forbids reconstructing the mark by hand.
        */}
        <span className="flex flex-col leading-tight">
          <span className="text-lg font-bold text-white">צ'מפיון מוטורס</span>
          <span className="text-xs font-semibold tracking-wide text-cm-sky" dir="ltr">
            Champion Motors
          </span>
        </span>
        <button
          type="button"
          onClick={onNavigate}
          aria-label="סגירת התפריט"
          className="rounded p-1 text-white/80 hover:bg-white/10 hover:text-white lg:hidden"
        >
          <X className="size-5" aria-hidden="true" />
        </button>
      </div>

      <div className="flex flex-col gap-6">
        <SidebarLink item={HUB_ITEM} onNavigate={onNavigate} />

        {NAV_SECTIONS.map((section) => (
          <div key={section.id} className="flex flex-col gap-1">
            <h2 className="px-3 pb-1 text-xs font-semibold text-cm-sky">{section.label}</h2>
            {section.items.map((item) => (
              <SidebarLink key={item.path} item={item} onNavigate={onNavigate} />
            ))}
          </div>
        ))}
      </div>
    </nav>
  );
}
