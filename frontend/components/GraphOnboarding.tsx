"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { getEntrySummaries, getEntryFocusIds } from "@/lib/entry";

/**
 * Lightweight onboarding hint overlay shown on first visit to /graf when
 * no ?focus= is active. Gives the user three pre-filtered starting points
 * instead of confronting them with 60+ nodes at once.
 *
 * Dismissed permanently via localStorage once the user either:
 *   - clicks one of the shortcut chips, or
 *   - explicitly hits the close button, or
 *   - interacts with the graph (handled by consumer).
 *
 * Renders nothing when already dismissed or when focusActive = true.
 */

const STORAGE_KEY = "pbp:graph-onboarded";

interface GraphOnboardingProps {
  focusActive: boolean;
}

export function GraphOnboarding({ focusActive }: GraphOnboardingProps) {
  const [visible, setVisible] = useState(false);
  const [entries, setEntries] = useState<
    ReadonlyArray<{ slug: string; label: string; ids: readonly string[] }>
  >([]);

  useEffect(() => {
    // Build shortcuts from the entry registry so they auto-update when
    // entries are added. Keep at most three — more than that becomes wall-
    // of-chips and defeats the simplicity goal.
    const shortcuts = getEntrySummaries()
      .slice(0, 3)
      .map((e) => ({
        slug: e.slug,
        label: e.categoryShort,
        ids: getEntryFocusIds(e.slug),
      }))
      .filter((s) => s.ids.length > 0);
    setEntries(shortcuts);

    if (typeof window === "undefined") return;
    const dismissed = window.localStorage.getItem(STORAGE_KEY) === "1";
    setVisible(!dismissed);
  }, []);

  const dismiss = () => {
    setVisible(false);
    try {
      window.localStorage.setItem(STORAGE_KEY, "1");
    } catch {
      /* storage disabled — hint stays dismissed for session via state */
    }
  };

  if (!visible || focusActive || entries.length === 0) return null;

  return (
    <div
      role="region"
      aria-label="Pintasan eksplorasi graf"
      className="absolute top-4 right-4 z-[30] max-w-[calc(100%-2rem)] w-[320px] rounded-lg border border-[var(--border-strong)] bg-[var(--bg-surface)]/95 backdrop-blur-md p-4 shadow-xl"
    >
      <div className="flex items-start justify-between gap-3 mb-3">
        <div>
          <div className="font-mono text-[10px] font-bold uppercase tracking-[0.14em] text-[var(--accent-danger)]">
            Mulai dari sini
          </div>
          <p className="mt-1.5 text-xs text-[var(--text-secondary)] leading-relaxed">
            Klik salah satu untuk fokus ke aktor-aktor yang muncul di satu
            entri. Atau langsung klik simpul di graf.
          </p>
        </div>
        <button
          type="button"
          onClick={dismiss}
          className="flex-shrink-0 -mr-1 -mt-1 w-7 h-7 flex items-center justify-center rounded-md text-[var(--text-tertiary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-surface-2)] transition-colors"
          aria-label="Tutup pintasan"
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <path d="M6 18L18 6M6 6l12 12" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>
      </div>

      <div className="flex flex-wrap gap-2">
        {entries.map((e) => (
          <Link
            key={e.slug}
            href={`/graf?focus=${e.ids.join(",")}&from=${e.slug}`}
            onClick={dismiss}
            className="inline-flex items-center gap-1.5 rounded-md border border-[var(--border-base)] bg-[var(--bg-surface-2)] px-3 py-1.5 font-mono text-[11px] font-bold uppercase tracking-[0.12em] text-[var(--text-primary)] no-underline transition-colors hover:border-[var(--accent-danger)] hover:text-[var(--accent-danger)]"
          >
            <span
              className="inline-block w-1.5 h-1.5 rounded-full bg-[var(--accent-danger)]"
              aria-hidden="true"
            />
            {e.label}
          </Link>
        ))}
      </div>
    </div>
  );
}
