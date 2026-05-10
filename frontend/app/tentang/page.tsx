import { getLiveStats } from "@/lib/data";
import { SITE_CONFIG } from "@/lib/constants";
import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: `Tentang`,
  description: "Tentang PBP.ID: siapa, kenapa, dan bagaimana kami mengumpulkan data yang sebenarnya sudah publik.",
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
            Proyek Bagus Pemerintah.
          </h1>
          <p className="text-xl text-[var(--text-secondary)] leading-relaxed max-w-3xl">
            {SITE_CONFIG.NAME} adalah katalog proyek pemerintah yang anggarannya
            besar, vendornya unik, dan dokumennya sudah tersedia di ruang
            publik. Kami hanya mengumpulkannya di satu tempat.
          </p>
        </section>

        <section className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <StatBox value={stats?.TOTAL_ENTITIES || 0} label="Entitas" />
          <StatBox value={stats?.TOTAL_RELATIONS || 0} label="Relasi" />
          <StatBox value={stats?.TOTAL_RED_FLAGS || 0} label="Sorotan" highlight />
          <StatBox value={stats?.TOTAL_SPPG || 0} label="Titik SPPG" />
        </section>

        <section className="grid md:grid-cols-2 gap-12 border-t border-[var(--border-base)] pt-16">
          <div className="space-y-4">
            <h2 className="text-2xl font-bold font-serif text-[var(--text-primary)]">Kenapa dibuat?</h2>
            <p className="text-[var(--text-secondary)] leading-relaxed">
              Karena data proyek pemerintah sebenarnya sudah terbuka — tersebar
              di AHU, LPSE, SiRUP, rilis kementerian, dan arsip berita. Tapi
              membacanya butuh ketekunan tinggi. Situs ini mengumpulkan
              potongan-potongan itu dan menaruhnya berdampingan supaya publik
              bisa lihat tanpa harus buka lima tab sekaligus.
            </p>
          </div>
          <div className="space-y-4">
            <h2 className="text-2xl font-bold font-serif text-[var(--text-primary)]">Apa yang TIDAK dilakukan?</h2>
            <ul className="text-[var(--text-secondary)] leading-relaxed space-y-2 list-disc pl-5">
              <li>Tidak menulis analisis atau opini.</li>
              <li>Tidak mewawancarai narasumber.</li>
              <li>Tidak menarik kesimpulan hukum.</li>
              <li>Tidak menuduh siapa pun.</li>
            </ul>
            <p className="text-[var(--text-secondary)] leading-relaxed pt-2">
              Kalau datanya aneh, itu bukan narasi kami. Itu datanya yang aneh.
            </p>
          </div>
        </section>

        <section className="grid md:grid-cols-3 gap-8 border-t border-[var(--border-base)] pt-16">
          <div className="space-y-3">
            <div className="font-mono text-[10px] font-bold uppercase tracking-[0.16em] text-[var(--accent-danger)]">
              01 / Sumber
            </div>
            <h3 className="text-lg font-bold font-serif text-[var(--text-primary)]">
              Semua sudah publik.
            </h3>
            <p className="text-sm text-[var(--text-secondary)] leading-relaxed">
              AHU Online, LPSE, SiRUP, arsip berita arus utama, rilis resmi
              lembaga. Tidak ada bocoran, tidak ada sumber anonim.
            </p>
          </div>
          <div className="space-y-3">
            <div className="font-mono text-[10px] font-bold uppercase tracking-[0.16em] text-[var(--accent-danger)]">
              02 / Sorotan
            </div>
            <h3 className="text-lg font-bold font-serif text-[var(--text-primary)]">
              Penanda, bukan vonis.
            </h3>
            <p className="text-sm text-[var(--text-secondary)] leading-relaxed">
              Hal yang kami tandai sebagai sorotan hanyalah hal yang menurut
              dokumen publik layak diperhatikan publik. Bukan tuduhan, bukan
              kesimpulan, bukan putusan.
            </p>
          </div>
          <div className="space-y-3">
            <div className="font-mono text-[10px] font-bold uppercase tracking-[0.16em] text-[var(--accent-danger)]">
              03 / Koreksi
            </div>
            <h3 className="text-lg font-bold font-serif text-[var(--text-primary)]">
              Kalau salah, laporkan.
            </h3>
            <p className="text-sm text-[var(--text-secondary)] leading-relaxed">
              Repositori kode dan data terbuka. Semua koreksi ditangani lewat
              GitHub issue secara terbuka dan dicatat di riwayat commit.
            </p>
          </div>
        </section>

        <section className="bg-[var(--bg-surface)] p-8 md:p-12 border border-[var(--border-strong)] text-center space-y-8 rounded-lg">
          <div className="space-y-2">
            <h3 className="text-2xl font-bold font-serif text-[var(--text-primary)]">Mau ikut merapikan?</h3>
            <p className="text-[var(--text-secondary)]">
              Repositori, data mentah, dan skrip ETL semuanya terbuka. Fork,
              koreksi, kirim pull request.
            </p>
          </div>
          <div className="flex flex-wrap justify-center gap-4">
            <Link
              href={SITE_CONFIG.REPO_URL}
              target="_blank"
              rel="noreferrer"
              className="px-8 py-3 bg-[var(--text-primary)] text-[var(--bg-base)] font-mono text-xs font-bold uppercase tracking-wider hover:opacity-90 transition-opacity"
            >
              GitHub
            </Link>
            <Link
              href="/dossier"
              className="px-8 py-3 border-2 border-[var(--text-primary)] text-[var(--text-primary)] font-mono text-xs font-bold uppercase tracking-wider hover:bg-[var(--text-primary)] hover:text-[var(--bg-base)] transition-all"
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
