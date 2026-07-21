import { Suspense, useState } from "react";
import { Outlet } from "react-router-dom";
import { Sidebar } from "@/components/layout/Sidebar";
import { Topbar } from "@/components/layout/Topbar";
import { Skeleton } from "@/components/ui/skeleton";

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
          <Suspense
            fallback={
              <div aria-busy="true" aria-label="טוען את הדף">
                <Skeleton className="mb-8 h-10 w-64" />
                <Skeleton className="h-96 w-full" />
              </div>
            }
          >
            <Outlet />
          </Suspense>
        </main>
      </div>
    </div>
  );
}
