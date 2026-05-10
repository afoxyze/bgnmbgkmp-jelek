import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Halaman tidak ditemukan",
  robots: { index: false, follow: false },
};

export default function NotFound() {
  return (
    <main className="content-page py-16 px-6">
      <div className="max-w-[720px] mx-auto space-y-8 text-center">
        <div className="inline-block px-3 py-1 border border-[var(--accent-danger)] text-[var(--accent-danger)] font-mono text-[10px] font-bold uppercase tracking-widest">
          Error 404
        </div>
        <h1
          className="text-5xl md:text-6xl font-bold leading-tight text-[var(--text-primary)]"
          style={{ fontFamily: "'IBM Plex Serif', 'Georgia', serif" }}
        >
          Halaman ini tidak ditemukan.
        </h1>
        <p className="text-[var(--text-secondary)] leading-relaxed max-w-lg mx-auto">
          Tautannya mungkin sudah pindah atau tidak pernah ada. Coba navigasi
          ke salah satu bagian di bawah.
        </p>

        <div className="flex flex-wrap justify-center gap-3 pt-4">
          <Link
            href="/"
            className="px-5 py-2.5 rounded-md border border-[var(--accent-danger)] bg-[var(--accent-danger)] text-white font-mono text-xs font-bold uppercase tracking-[0.14em] no-underline transition-opacity hover:opacity-90"
          >
            Beranda
          </Link>
          <Link
            href="/etalase"
            className="px-5 py-2.5 rounded-md border border-[var(--border-strong)] bg-[var(--bg-surface)] text-[var(--text-primary)] font-mono text-xs font-bold uppercase tracking-[0.14em] no-underline transition-colors hover:border-[var(--accent-danger)] hover:text-[var(--accent-danger)]"
          >
            Catatan Proyek
          </Link>
          <Link
            href="/cari"
            className="px-5 py-2.5 rounded-md border border-[var(--border-base)] bg-[var(--bg-surface)] text-[var(--text-secondary)] font-mono text-xs font-bold uppercase tracking-[0.14em] no-underline transition-colors hover:text-[var(--text-primary)]"
          >
            Cari Entitas
          </Link>
          <Link
            href="/graf"
            className="px-5 py-2.5 rounded-md border border-[var(--border-base)] bg-[var(--bg-surface)] text-[var(--text-secondary)] font-mono text-xs font-bold uppercase tracking-[0.14em] no-underline transition-colors hover:text-[var(--text-primary)]"
          >
            Graf
          </Link>
        </div>
      </div>
    </main>
  );
}
