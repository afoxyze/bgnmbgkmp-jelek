import Link from "next/link";
import type { DossierMeta } from "@/lib/dossier";
import { getDossierFocusIds } from "@/lib/dossier";

interface Props {
  dossier: DossierMeta;
}

const SEVERITY_LABELS: Record<DossierMeta["severity"], string> = {
  CRITICAL: "Perlu Dicek",
  ACTIVE: "Berjalan",
  VERIFIED: "Ada Sumber",
};

export function DossierIndexCard({ dossier }: Props) {
  const focusIds = getDossierFocusIds(dossier.slug);
  const graphHref =
    focusIds.length > 0 ? `/graf?focus=${focusIds.join(",")}` : "/graf";

  return (
    <div className="relative">
      <Link
        href={`/dossier/${dossier.slug}`}
        className="group grid gap-5 rounded-lg border border-[var(--border-base)] bg-[var(--bg-surface)] p-5 text-inherit no-underline shadow-sm transition-all hover:-translate-y-0.5 hover:border-[var(--accent-danger)] hover:bg-[var(--bg-raised)] hover:shadow-lg md:grid-cols-[150px_minmax(0,1fr)_140px] md:items-center md:p-6"
      >
      <div className="flex items-center justify-between gap-4 md:block">
        <div className="font-mono text-[10px] font-bold uppercase tracking-[0.16em] text-[var(--text-tertiary)]">
          {dossier.code}
        </div>
        <div
          style={{ fontFamily: "'IBM Plex Serif', 'Georgia', serif" }}
          className="mt-0 text-4xl font-bold leading-none tracking-[-0.04em] text-[var(--accent-danger)] md:mt-3"
        >
          {dossier.categoryShort}
        </div>
      </div>

      <div className="min-w-0">
        <div className="mb-3 flex flex-wrap items-center gap-2">
          <span className="rounded border border-[var(--border-base)] px-2 py-1 font-mono text-[10px] font-bold uppercase tracking-[0.12em] text-[var(--text-tertiary)]">
            {dossier.categoryLong}
          </span>
          <span className="rounded border border-[var(--accent-danger-border)] bg-[var(--accent-danger-bg)] px-2 py-1 font-mono text-[10px] font-bold uppercase tracking-[0.12em] text-[var(--accent-danger)]">
            {SEVERITY_LABELS[dossier.severity]}
          </span>
        </div>

        <h3
          style={{
            fontFamily: "'IBM Plex Serif', 'Georgia', serif",
            fontSize: "clamp(1.3rem, 2.5vw, 1.9rem)",
          }}
          className="m-0 font-bold leading-tight tracking-[-0.02em] text-[var(--text-primary)]"
        >
          {dossier.title}
        </h3>
        <p className="mb-0 mt-3 max-w-[680px] text-sm leading-relaxed text-[var(--text-secondary)] md:text-base">
          {dossier.subtitle}
        </p>
      </div>

      <div className="flex items-end justify-between gap-4 border-t border-[var(--border-base)] pt-4 md:block md:border-l md:border-t-0 md:pl-5 md:pt-0">
        {dossier.anggaranFokus ? (
          <div>
            <div
              style={{ fontFamily: "'IBM Plex Serif', 'Georgia', serif" }}
              className="text-2xl font-bold leading-none text-[var(--accent-danger)]"
            >
              {dossier.anggaranFokus}
            </div>
            <div className="mt-2 font-mono text-[10px] font-bold uppercase tracking-[0.12em] text-[var(--text-tertiary)]">
              {dossier.anggaranLabel}
            </div>
          </div>
        ) : (
          <span />
        )}

        <span className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-[var(--border-base)] text-[var(--text-primary)] transition-all group-hover:translate-x-1 group-hover:border-[var(--accent-danger)] group-hover:bg-[var(--accent-danger)] group-hover:text-white md:mt-7">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <path d="M5 12h14M13 6l6 6-6 6" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </span>
      </div>
    </Link>

      {focusIds.length > 0 && (
        <Link
          href={graphHref}
          className="absolute right-4 top-4 z-10 inline-flex items-center gap-1.5 rounded-md border border-[var(--border-base)] bg-[var(--bg-surface)]/95 px-2.5 py-1 font-mono text-[9px] font-bold uppercase tracking-[0.12em] text-[var(--text-tertiary)] no-underline shadow-sm transition-all hover:border-[var(--accent-danger)] hover:text-[var(--accent-danger)] md:right-6 md:top-6"
          aria-label={`Buka graf dengan fokus ${focusIds.length} aktor dari ${dossier.title}`}
        >
          Graf
          <svg width="10" height="10" viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <path d="M7 17L17 7M7 7h10v10" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </Link>
      )}
    </div>
  );
}
