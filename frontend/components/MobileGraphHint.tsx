"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

/**
 * Small dismissible hint that appears on the mobile graph viewer to point
 * users at the list-style alternatives (Cari, Etalase) — the graph is
 * hard to use with a touch screen and 60+ small nodes.
 *
 * Mobile-only (md:hidden). Persists dismissal in localStorage.
 */

const STORAGE_KEY = "pbp:mobile-graph-hint-dismissed";

export function MobileGraphHint() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const dismissed = window.localStorage.getItem(STORAGE_KEY) === "1";
    setVisible(!dismissed);
  }, []);

  const dismiss = () => {
    setVisible(false);
    try {
      window.localStorage.setItem(STORAGE_KEY, "1");
    } catch {
      /* ignore */
    }
  };

  if (!visible) return null;

  return (
    <div
      role="note"
      aria-label="Tip tampilan mobile"
      className="md:hidden absolute top-4 left-4 right-4 z-[25] rounded-lg border border-[var(--border-strong)] bg-[var(--bg-surface)]/95 backdrop-blur-md p-3 shadow-lg flex items-start gap-3"
    >
      <div className="flex-1 min-w-0">
        <div className="text-[11px] font-mono font-bold uppercase tracking-[0.12em] text-[var(--accent-danger)] mb-1">
          Lebih nyaman di desktop
        </div>
        <p className="text-[11px] leading-relaxed text-[var(--text-secondary)] mb-2">
          Graf banyak titik kecil. Untuk telusuri by nama:
        </p>
        <div className="flex flex-wrap gap-2">
          <Link
            href="/cari"
            onClick={dismiss}
            className="inline-flex items-center rounded-md border border-[var(--border-base)] bg-[var(--bg-surface-2)] px-2.5 py-1 font-mono text-[10px] font-bold uppercase tracking-[0.12em] text-[var(--text-primary)] no-underline hover:border-[var(--accent-danger)] hover:text-[var(--accent-danger)]"
          >
            Cari Entitas
          </Link>
          <Link
            href="/etalase"
            onClick={dismiss}
            className="inline-flex items-center rounded-md border border-[var(--border-base)] bg-[var(--bg-surface-2)] px-2.5 py-1 font-mono text-[10px] font-bold uppercase tracking-[0.12em] text-[var(--text-primary)] no-underline hover:border-[var(--accent-danger)] hover:text-[var(--accent-danger)]"
          >
            Buka Etalase
          </Link>
        </div>
      </div>
      <button
        type="button"
        onClick={dismiss}
        aria-label="Tutup tip"
        className="flex-shrink-0 -mr-1 -mt-1 w-7 h-7 flex items-center justify-center rounded-md text-[var(--text-tertiary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-surface-2)]"
      >
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden="true">
          <path d="M6 18L18 6M6 6l12 12" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>
    </div>
  );
}
