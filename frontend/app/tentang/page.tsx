import { getLiveStats } from "@/lib/data";
import { SITE_CONFIG } from "@/lib/constants";
import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: `Tentang`,
  description: "Tentang PBP.ID — arsip proyek pemerintah dari dokumen publik.",
};

export default async function TentangPage() {
  const stats = await getLiveStats();

  return (
    <main className="content-page py-12 px-6">
      <div className="max-w-[960px] mx-auto space-y-16">
        <section className="space-y-6">
          <div className="inline-block px-3 py-1 border border-[var(--accent-danger)] text-[var(--accent-danger)] font-mono text-[10px] font-bold uppercase tracking-widest">
            Tentang
          </div>
          <h1 className="text-4xl md:text-6xl font-bold font-serif text-[var(--text-primary)] leading-tight">
            Proyek Bagus Pemerintah.
          </h1>
          <p className="text-lg text-[var(--text-secondary)] leading-relaxed max-w-2xl">
            Arsip proyek pemerintah yang dokumennya sudah ada di ruang publik.
            Kami hanya mengumpulkannya di satu tempat.
          </p>
        </section>

        <section className="grid grid-cols-2 md:grid-cols-3 gap-4">
          <StatBox value={stats?.TOTAL_ENTITIES || 0} label="Entitas" />
          <StatBox value={stats?.TOTAL_RELATIONS || 0} label="Relasi" />
          <StatBox value={stats?.TOTAL_RED_FLAGS || 0} label="Sorotan" highlight />
        </section>

        <section className="grid md:grid-cols-2 gap-12 border-t border-[var(--border-base)] pt-16">
          <div className="space-y-3">
            <h2 className="text-2xl font-bold font-serif text-[var(--text-primary)]">Kenapa dibuat</h2>
            <p className="text-[var(--text-secondary)] leading-relaxed">
              Data proyek pemerintah tersebar di AHU, LPSE, SiRUP, rilis
              kementerian, dan arsip berita. Situs ini menaruhnya
              berdampingan supaya lebih mudah dibaca.
            </p>
          </div>
          <div className="space-y-3">
            <h2 className="text-2xl font-bold font-serif text-[var(--text-primary)]">Yang tidak dilakukan</h2>
            <ul className="text-[var(--text-secondary)] leading-relaxed space-y-1.5 list-disc pl-5">
              <li>Menulis analisis atau opini.</li>
              <li>Mewawancarai narasumber.</li>
              <li>Menarik kesimpulan hukum.</li>
              <li>Menuduh siapa pun.</li>
            </ul>
          </div>
        </section>

        <section className="grid md:grid-cols-3 gap-8 border-t border-[var(--border-base)] pt-16">
          <div className="space-y-2">
            <div className="font-mono text-[10px] font-bold uppercase tracking-[0.16em] text-[var(--accent-danger)]">
              01 / Sumber
            </div>
            <h3 className="text-lg font-bold font-serif text-[var(--text-primary)]">
              Semua sudah publik.
            </h3>
            <p className="text-sm text-[var(--text-secondary)] leading-relaxed">
              AHU, LPSE, SiRUP, arsip berita, rilis resmi. Tidak ada bocoran.
            </p>
          </div>
          <div className="space-y-2">
            <div className="font-mono text-[10px] font-bold uppercase tracking-[0.16em] text-[var(--accent-danger)]">
              02 / Sorotan
            </div>
            <h3 className="text-lg font-bold font-serif text-[var(--text-primary)]">
              Penanda, bukan vonis.
            </h3>
            <p className="text-sm text-[var(--text-secondary)] leading-relaxed">
              Sorotan hanya menandai entri yang angkanya janggal di dokumen
              publik.
            </p>
          </div>
          <div className="space-y-2">
            <div className="font-mono text-[10px] font-bold uppercase tracking-[0.16em] text-[var(--accent-danger)]">
              03 / Koreksi
            </div>
            <h3 className="text-lg font-bold font-serif text-[var(--text-primary)]">
              Kalau salah, laporkan.
            </h3>
            <p className="text-sm text-[var(--text-secondary)] leading-relaxed">
              Repo kode dan data terbuka. Koreksi ditangani lewat GitHub.
            </p>
          </div>
        </section>

        <section className="bg-[var(--bg-surface)] p-8 md:p-10 border border-[var(--border-strong)] text-center space-y-6 rounded-lg">
          <h3 className="text-xl md:text-2xl font-bold font-serif text-[var(--text-primary)]">Mau ikut merapikan?</h3>
          <div className="flex flex-wrap justify-center gap-3">
            <Link
              href={SITE_CONFIG.REPO_URL}
              target="_blank"
              rel="noreferrer"
              className="px-6 py-3 bg-[var(--text-primary)] text-[var(--bg-base)] font-mono text-xs font-bold uppercase tracking-wider hover:opacity-90 transition-opacity"
            >
              GitHub
            </Link>
            <Link
              href="/dossier"
              className="px-6 py-3 border-2 border-[var(--text-primary)] text-[var(--text-primary)] font-mono text-xs font-bold uppercase tracking-wider hover:bg-[var(--text-primary)] hover:text-[var(--bg-base)] transition-all"
            >
              Buka Katalog
            </Link>
          </div>
        </section>
      </div>
    </main>
  );
}

function StatBox({ value, label, highlight = false }: { value: number | string; label: string; highlight?: boolean }) {
  return (
    <div className={`p-6 rounded-lg border border-[var(--border-base)] ${highlight ? "bg-[var(--accent-danger-bg)] border-[var(--accent-danger)]/20" : "bg-[var(--bg-surface)]"}`}>
      <div className={`text-3xl font-bold font-mono mb-1 ${highlight ? "text-[var(--accent-danger)]" : "text-[var(--text-primary)]"}`}>
        {typeof value === "number" ? value.toLocaleString("id-ID") : value}
      </div>
      <div className="text-[10px] font-mono uppercase tracking-widest text-[var(--text-tertiary)]">
        {label}
      </div>
    </div>
  );
}
