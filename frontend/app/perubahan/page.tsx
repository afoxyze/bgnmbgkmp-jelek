import Link from "next/link";
import type { Metadata } from "next";
import { SITE_CONFIG } from "@/lib/constants";
import { ENTRY_REGISTRY, loadEntry } from "@/lib/entry";
import { formatIsoDateId, timeAgoId } from "@/lib/format";

export const metadata: Metadata = {
  title: "Perubahan",
  description: "Riwayat perubahan data di PBP.ID. Tiap entri dicatat dengan tanggal dan sumbernya.",
};

interface ChangeLogItem {
  date: string;          // ISO "YYYY-MM-DD"
  entrySlug: string;
  entryCode: string;
  entryTitle: string;
  event: string;
}

// Build the changelog from each entry's case_study metadata + per-entry
// timeline items. Server-side only — reads the same files as the entry
// detail page.
async function buildChangeLog(): Promise<readonly ChangeLogItem[]> {
  const items: ChangeLogItem[] = [];
  for (const meta of ENTRY_REGISTRY) {
    const loaded = await loadEntry(meta.slug);
    if (!loaded) continue;
    // One implicit change entry: the research date on the case study itself.
    const updated = loaded.caseStudy.metadata.tanggal_riset;
    if (updated) {
      items.push({
        date: updated,
        entrySlug: meta.slug,
        entryCode: meta.code,
        entryTitle: meta.title,
        event: `Entri ${meta.code.toLowerCase()} terakhir diperbarui.`,
      });
    }
  }
  // Sort descending (newest first). ISO-ish strings compare correctly.
  items.sort((a, b) => (a.date < b.date ? 1 : a.date > b.date ? -1 : 0));
  return items;
}

// Read the source audit summary so the page can surface data health.
async function loadAuditSummary(): Promise<{ checked_at: string; summary: Record<string, number> } | null> {
  try {
    const { readFile } = await import("fs/promises");
    const { join } = await import("path");
    const raw = await readFile(
      join(process.cwd(), "public", "data", "source_audit.json"),
      "utf-8"
    );
    const parsed = JSON.parse(raw);
    return { checked_at: parsed.checked_at, summary: parsed.summary };
  } catch {
    return null;
  }
}

export default async function PerubahanPage() {
  const log = await buildChangeLog();
  const audit = await loadAuditSummary();

  return (
    <main className="content-page py-12 px-6">
      <div className="max-w-[860px] mx-auto space-y-12">
        <section className="space-y-4">
          <div className="inline-block px-3 py-1 border border-[var(--accent-danger)] text-[var(--accent-danger)] font-mono text-[10px] font-bold uppercase tracking-widest">
            Perubahan
          </div>
          <h1
            className="text-4xl md:text-5xl font-bold leading-tight text-[var(--text-primary)]"
            style={{ fontFamily: "'IBM Plex Serif', 'Georgia', serif" }}
          >
            Riwayat perubahan data.
          </h1>
          <p className="text-[var(--text-secondary)] leading-relaxed max-w-2xl">
            Tiap entri mencatat tanggal pembaruan terakhirnya. Perubahan data
            mentah dicatat di riwayat commit repositori.
          </p>
          <div className="flex flex-wrap gap-3 pt-2">
            <Link
              href={SITE_CONFIG.REPO_URL + "/commits/main"}
              target="_blank"
              rel="noreferrer"
              className="px-4 py-2 rounded-md border border-[var(--border-strong)] bg-[var(--bg-surface)] text-[var(--text-primary)] font-mono text-[11px] font-bold uppercase tracking-[0.12em] no-underline transition-colors hover:border-[var(--accent-danger)] hover:text-[var(--accent-danger)]"
            >
              Riwayat Commit →
            </Link>
          </div>
        </section>

        {audit && (
          <section className="rounded-lg border border-[var(--border-base)] bg-[var(--bg-surface)] p-6 space-y-3">
            <div className="flex items-center justify-between gap-4 flex-wrap">
              <h2
                className="text-lg font-bold text-[var(--text-primary)]"
                style={{ fontFamily: "'IBM Plex Serif', 'Georgia', serif" }}
              >
                Kesehatan Sumber
              </h2>
              <span className="font-mono text-[10px] font-bold uppercase tracking-[0.14em] text-[var(--text-tertiary)]">
                Audit terakhir: {formatIsoDateId(audit.checked_at.slice(0, 10))}
              </span>
            </div>
            <div className="grid grid-cols-3 gap-3">
              <AuditStat label="URL Hidup" value={audit.summary.ok ?? 0} tone="ok" />
              <AuditStat label="Gagal" value={audit.summary.fail ?? 0} tone={audit.summary.fail ? "danger" : "ok"} />
              <AuditStat label="Dilewati" value={audit.summary.skipped ?? 0} tone="muted" />
            </div>
            <p className="text-[11px] text-[var(--text-tertiary)] leading-relaxed">
              &ldquo;Dilewati&rdquo; = host yang memblok bot (paywall / anti-scrape)
              namun URL-nya valid. Cek manual bila ragu. Laporan lengkap tersedia di
              {" "}
              <Link
                href="/data/source_audit.json"
                className="underline decoration-dotted hover:text-[var(--accent-danger)]"
              >
                /data/source_audit.json
              </Link>
              .
            </p>
          </section>
        )}

        <section className="space-y-4">
          <h2
            className="text-2xl font-bold text-[var(--text-primary)]"
            style={{ fontFamily: "'IBM Plex Serif', 'Georgia', serif" }}
          >
            Riwayat Entri
          </h2>
          <ol className="flex flex-col gap-3 m-0 p-0 list-none">
            {log.map((item, i) => (
              <li
                key={`${item.entrySlug}-${i}`}
                className="flex flex-col md:flex-row md:items-baseline gap-2 md:gap-6 border-b border-[var(--border-base)] pb-3 last:border-b-0"
              >
                <div
                  className="font-mono text-[11px] font-bold uppercase tracking-[0.14em] text-[var(--text-tertiary)] md:w-[160px] shrink-0"
                  title={formatIsoDateId(item.date)}
                >
                  {timeAgoId(item.date)}
                  <span className="block text-[10px] text-[var(--text-tertiary)] opacity-70 font-normal normal-case tracking-normal">
                    {formatIsoDateId(item.date)}
                  </span>
                </div>
                <div className="flex-1 min-w-0">
                  <span className="font-mono text-[10px] font-bold uppercase tracking-[0.12em] text-[var(--accent-danger)]">
                    {item.entryCode}
                  </span>
                  <span className="text-[var(--text-tertiary)] mx-2">·</span>
                  <Link
                    href={`/etalase/${item.entrySlug}`}
                    className="text-[var(--text-primary)] font-medium hover:text-[var(--accent-danger)]"
                  >
                    {item.entryTitle}
                  </Link>
                  <p className="mt-1 text-sm text-[var(--text-secondary)] leading-relaxed">
                    {item.event}
                  </p>
                </div>
              </li>
            ))}
          </ol>
        </section>
      </div>
    </main>
  );
}

function AuditStat({
  label,
  value,
  tone,
}: {
  label: string;
  value: number;
  tone: "ok" | "danger" | "muted";
}) {
  const color =
    tone === "danger"
      ? "text-[var(--accent-danger)]"
      : tone === "muted"
        ? "text-[var(--text-secondary)]"
        : "text-[var(--text-primary)]";
  return (
    <div className="rounded-md border border-[var(--border-base)] bg-[var(--bg-surface-2)] p-4 text-center">
      <div className={`text-2xl font-bold font-mono ${color}`}>
        {value.toLocaleString("id-ID")}
      </div>
      <div className="mt-1 text-[10px] font-mono font-bold uppercase tracking-[0.14em] text-[var(--text-tertiary)]">
        {label}
      </div>
    </div>
  );
}
