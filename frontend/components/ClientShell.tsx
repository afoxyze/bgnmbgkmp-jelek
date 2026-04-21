"use client";

import { useEffect, useState } from "react";
import { ThemeProvider, useTheme } from "@/lib/theme-context";
import { Header } from "@/components/Header";
import { usePathname } from "next/navigation";

interface ClientShellProps {
  children: React.ReactNode;
}

export function ClientShell({ children }: ClientShellProps) {
  return (
    <ThemeProvider>
      <ShellInner>{children}</ShellInner>
    </ThemeProvider>
  );
}
function ShellInner({ children }: { children: React.ReactNode }) {
  const { isDark } = useTheme();
  const pathname = usePathname();
  const [ready, setReady] = useState(false);

  // Is this the graph page?
  const isGraphPage = pathname === "/graf" || pathname?.startsWith("/graf/");

  useEffect(() => {
    // Instant activation for non-graph pages
    if (!isGraphPage) {
      document.body.style.visibility = 'visible';
      setReady(true);
      return;
    }

    // Graph page still needs a tiny guard to prevent FOUC
    const timer = setTimeout(() => {
      setReady(true);
      const antiFouc = document.getElementById('anti-fouc-style');
      if (antiFouc) antiFouc.remove();
      document.body.style.visibility = 'visible';
    }, 50);
    return () => clearTimeout(timer);
  }, [isGraphPage]);

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        height: "100dvh",
        backgroundColor: "var(--bg-base)",
      }}
    >
      <Header />

      <main
        className="relative flex-1 min-h-0 flex flex-col"
        style={{
          color: "var(--text-primary)",
          // On non-graph pages, we want instant interaction.
          opacity: isGraphPage ? (ready ? 1 : 0) : 1,
          visibility: isGraphPage ? (ready ? "visible" : "hidden") : "visible",
          transition: isGraphPage ? "opacity 0.2s ease-in-out" : "none"
        }}
      >
        <div style={{ flex: 1, minHeight: 0, display: "flex", flexDirection: "column" }}>
          {children}
        </div>

        {/* Mask Overlay: Only for Graph Page */}
        {isGraphPage && !ready && (
          <div className="absolute inset-0 z-[10000] flex items-center justify-center bg-[var(--bg-base)]">
            <div className="flex flex-col items-center gap-4">
              <div className="w-8 h-8 border-2 rounded-full animate-spin border-[var(--border-strong)] border-t-[var(--accent-danger)]" />
            </div>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}


function Footer() {
  return (
    <footer className="flex-shrink-0 px-5 py-2 border-t border-[var(--border-header)] bg-[var(--bg-header)]">
      <p className="text-xs text-center text-[var(--text-tertiary)]">
        Data bersumber dari dokumen publik. Bersifat informatif, bukan tuduhan hukum.
      </p>
    </footer>
  );
}
