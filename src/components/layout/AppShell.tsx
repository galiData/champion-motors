import { useState } from "react";
import { Outlet } from "react-router-dom";
import { Sidebar } from "@/components/layout/Sidebar";
import { Topbar } from "@/components/layout/Topbar";

/**
 * The protected application frame: navy sidebar pinned to the reading-start
 * side (right, in RTL), top bar, and the page outlet.
 */
export function AppShell() {
  const [isNavOpen, setIsNavOpen] = useState(false);

  return (
    <div className="min-h-screen bg-cm-surface">
      <Sidebar isOpen={isNavOpen} onNavigate={() => setIsNavOpen(false)} />

      {isNavOpen ? (
        <button
          type="button"
          aria-label="סגירת התפריט"
          onClick={() => setIsNavOpen(false)}
          className="fixed inset-0 z-30 bg-cm-navy/60 lg:hidden"
        />
      ) : null}

      <div className="flex min-h-screen flex-col lg:ms-72">
        <Topbar onOpenNav={() => setIsNavOpen(true)} />
        <main className="flex-1 p-6 lg:p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
