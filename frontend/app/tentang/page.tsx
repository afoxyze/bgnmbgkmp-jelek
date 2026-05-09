import { getLiveStats } from "@/lib/data";
import { SITE_CONFIG } from "@/lib/constants";
import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: `Tentang - ${SITE_CONFIG.NAME}`,
  description: "Tentang PBP.ID dan cara kami menyusun data publik proyek pemerintah.",
};

export default async function TentangPage() {
  const stats = await getLiveStats();

  return (
    <main className="content-page py-12 px-6">
      <div className="max-w-[1160px] mx-auto space-y-16">
        <section className="space-y-6">
          <div className="inline-block px-3 py-1 border border-[var(--accent-danger)] text-[var(--accent-danger)] font-mono text-[10px] font-bold uppercase tracking-widest">
            Tentang PBP.ID
          </div>
          <h1 className="text-4xl md:text-6xl font-bold font-serif text-[var(--text-primary)] leading-tight">
            Katalog data publik untuk melihat proyek pemerintah dengan lebih mudah.
          </h1>
          <p className="text-xl text-[var(--text-secondary)] leading-relaxed max-w-3xl">
            {SITE_CONFIG.NAME} dibuat untuk mengumpulkan data proyek pemerintah
            dari sumber terbuka, lalu menyajikannya dalam bentuk yang lebih
            mudah dibaca.
          </p>
        </section>

        <section className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <StatBox value={stats?.TOTAL_ENTITIES || 0} label="Entitas" />
          <StatBox value={stats?.TOTAL_RELATIONS || 0} label="Relasi" />
          <StatBox value={stats?.TOTAL_RED_FLAGS || 0} label="Catatan" highlight />
          <StatBox value={stats?.TOTAL_SPPG || 0} label="Titik SPPG" />
        </section>

        <section className="grid md:grid-cols-2 gap-12 border-t border-[var(--border-base)] pt-16">
          <div className="space-y-4">
            <h2 className="text-2xl font-bold font-serif text-[var(--text-primary)]">Kenapa dibuat?</h2>
            <p className="text-[var(--text-secondary)] leading-relaxed">
              Karena data proyek publik sering tersebar di banyak tempat dan
              tidak selalu mudah dibaca. Website ini membantu merapikannya
              supaya masyarakat bisa melihat angka, pola, dan relasi dengan
              lebih cepat.
            </p>
          </div>
          <div className="space-y-4">
            <h2 className="text-2xl font-bold font-serif text-[var(--text-primary)]">Cara bacanya</h2>
            <p className="text-[var(--text-secondary)] leading-relaxed">
              Anggap ini sebagai indeks awal. Sumbernya tetap dokumen publik
              seperti AHU, LPSE, SiRUP, data SPPG, dan berita. Kalau ada
              catatan yang terlihat penting, sebaiknya tetap dicek lagi ke
              sumber aslinya.
            </p>
          </div>
        </section>

        <section className="bg-[var(--bg-surface)] p-8 md:p-12 border border-[var(--border-strong)] text-center space-y-8 rounded-lg">
          <div className="space-y-2">
            <h3 className="text-2xl font-bold font-serif text-[var(--text-primary)]">Punya data proyek atau sumber publik?</h3>
            <p className="text-[var(--text-secondary)]">
              Simpan sumbernya, cek faktanya, lalu kontribusikan agar datanya
              bisa dibaca lebih banyak orang.
            </p>
          </div>
          <div className="flex flex-wrap justify-center gap-4">
            <Link
              href="https://github.com"
              className="px-8 py-3 bg-[var(--text-primary)] text-[var(--bg-base)] font-mono text-xs font-bold uppercase tracking-wider hover:opacity-90 transition-opacity"
            >
              GitHub
            </Link>
            <Link
              href="/dossier"
              className="px-8 py-3 border-2 border-[var(--text-primary)] text-[var(--text-primary)] font-mono text-xs font-bold uppercase tracking-wider hover:bg-[var(--text-primary)] hover:text-[var(--bg-base)] transition-all"
            >
              Lihat Catatan
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
