"use client";

// Global runtime error boundary. Caught by Next.js when any route below
// throws during render. Keeps the shell (header/footer) intact and lets
// the user navigate away instead of seeing a blank page.

import Link from "next/link";
import { useEffect } from "react";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Surface to the browser console for inspection; server-side errors
    // are already logged by Next.js itself.
    // eslint-disable-next-line no-console
    console.error("App error boundary caught:", error);
  }, [error]);

  return (
    <main className="content-page py-16 px-6">
      <div className="max-w-[720px] mx-auto space-y-8 text-center">
        <div className="inline-block px-3 py-1 border border-[var(--accent-danger)] text-[var(--accent-danger)] font-mono text-[10px] font-bold uppercase tracking-widest">
          Gangguan Teknis
        </div>
        <h1
          className="text-4xl md:text-5xl font-bold leading-tight text-[var(--text-primary)]"
          style={{ fontFamily: "'IBM Plex Serif', 'Georgia', serif" }}
        >
          Ada gangguan di halaman ini.
        </h1>
        <p className="text-[var(--text-secondary)] leading-relaxed max-w-lg mx-auto">
          Kami tidak berhasil memuat konten ini sekarang. Coba muat ulang, atau
          kembali ke beranda. Kalau terus terjadi, laporkan lewat halaman
          kontak biar bisa diperbaiki.
        </p>

        {error.digest && (
          <p className="font-mono text-[11px] text-[var(--text-tertiary)]">
            Kode gangguan: <span className="text-[var(--text-secondary)]">{error.digest}</span>
          </p>
        )}

        <div className="flex flex-wrap justify-center gap-3 pt-4">
          <button
            type="button"
            onClick={() => reset()}
            className="px-5 py-2.5 rounded-md border border-[var(--accent-danger)] bg-[var(--accent-danger)] text-white font-mono text-xs font-bold uppercase tracking-[0.14em] transition-opacity hover:opacity-90"
          >
            Muat Ulang
          </button>
          <Link
            href="/"
            className="px-5 py-2.5 rounded-md border border-[var(--border-strong)] bg-[var(--bg-surface)] text-[var(--text-primary)] font-mono text-xs font-bold uppercase tracking-[0.14em] no-underline transition-colors hover:border-[var(--accent-danger)] hover:text-[var(--accent-danger)]"
          >
            Beranda
          </Link>
          <Link
            href="/kontak"
            className="px-5 py-2.5 rounded-md border border-[var(--border-base)] bg-[var(--bg-surface)] text-[var(--text-secondary)] font-mono text-xs font-bold uppercase tracking-[0.14em] no-underline transition-colors hover:text-[var(--text-primary)]"
          >
            Laporkan
          </Link>
        </div>
      </div>
    </main>
  );
}
