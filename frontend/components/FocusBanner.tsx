"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useCallback } from "react";
import { getDossierMeta } from "@/lib/dossier";

/**
 * Shown at the top of /graf when the graph is filtered by ?focus=....
 * Offers a way to exit focus mode (or roundtrip back to the source dossier).
 * Renders nothing when there is no focus param.
 */
export function FocusBanner({ focusCount }: { focusCount: number }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const focusParam = searchParams.get("focus");
  const fromSlug = searchParams.get("from");

  const handleClearFocus = useCallback(() => {
    // Drop focus+from, keep anything else we add later.
    const next = new URLSearchParams(searchParams.toString());
    next.delete("focus");
    next.delete("from");
    const qs = next.toString();
    router.replace(qs ? `/graf?${qs}` : "/graf", { scroll: false });
  }, [router, searchParams]);

  if (!focusParam || focusCount === 0) return null;

  const fromDossier = fromSlug ? getDossierMeta(fromSlug) : null;

  return (
    <div
      className="absolute top-4 left-1/2 -translate-x-1/2 z-[30] flex flex-wrap items-center gap-3 rounded-lg border border-[var(--border-strong)] bg-[var(--bg-surface)]/95 px-4 py-2.5 shadow-lg backdrop-blur-md max-w-[calc(100%-2rem)]"
      role="status"
      aria-live="polite"
    >
      <div className="flex items-center gap-2 text-[11px]">
        <span className="w-1.5 h-1.5 rounded-full bg-[var(--accent-danger)]" aria-hidden="true" />
        <span className="font-mono font-bold uppercase tracking-[0.12em] text-[var(--text-secondary)]">
          Fokus: {focusCount} aktor
        </span>
        {fromDossier && (
          <>
            <span className="text-[var(--text-tertiary)]" aria-hidden="true">•</span>
            <span className="font-mono text-[10px] uppercase tracking-[0.12em] text-[var(--text-tertiary)]">
              dari {fromDossier.categoryShort}
            </span>
          </>
        )}
      </div>

      <div className="flex items-center gap-1.5">
        {fromDossier && (
          <Link
            href={`/dossier/${fromDossier.slug}`}
            className="inline-flex items-center gap-1 rounded-md border border-[var(--border-base)] bg-[var(--bg-surface-2)] px-2.5 py-1 font-mono text-[10px] font-bold uppercase tracking-[0.12em] text-[var(--text-secondary)] no-underline transition-colors hover:border-[var(--accent-danger)] hover:text-[var(--accent-danger)]"
          >
            <svg width="10" height="10" viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <path d="M15 18l-6-6 6-6" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            Dossier
          </Link>
        )}
        <button
          type="button"
          onClick={handleClearFocus}
          className="inline-flex items-center gap-1 rounded-md border border-[var(--accent-danger)]/40 bg-[var(--accent-danger)]/10 px-2.5 py-1 font-mono text-[10px] font-bold uppercase tracking-[0.12em] text-[var(--accent-danger)] transition-colors hover:bg-[var(--accent-danger)] hover:text-white"
        >
          Lihat semua
          <svg width="10" height="10" viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <path d="M6 18L18 6M6 6l12 12" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>
      </div>
    </div>
  );
}
