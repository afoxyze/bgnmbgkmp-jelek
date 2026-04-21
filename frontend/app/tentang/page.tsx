import { getLiveStats } from "@/lib/data";
import { SITE_CONFIG } from "@/lib/constants";
import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: `Tentang — ${SITE_CONFIG.NAME}`,
  description: "Metodologi dan misi di balik platform investigasi KONEKSI.ID.",
};

export default async function TentangPage() {
  const stats = await getLiveStats();

  return (
    <main className="content-page py-12 px-6">
      <div className="max-w-4xl mx-auto space-y-16">
        {/* Header Section */}
        <section className="space-y-6">
          <div className="inline-block px-3 py-1 border border-[var(--accent-danger)] text-[var(--accent-danger)] font-mono text-[10px] font-bold uppercase tracking-widest">
            Mission Briefing
          </div>
          <h1 className="text-4xl md:text-6xl font-bold font-serif text-[var(--text-primary)] leading-tight">
            Transparansi Radikal untuk Indonesia.
          </h1>
          <p className="text-xl text-[var(--text-secondary)] leading-relaxed max-w-2xl">
            {SITE_CONFIG.NAME} adalah platform intelijen sumber terbuka (OSINT) yang didedikasikan untuk memetakan konsentrasi kekuasaan dan aliansi bisnis di balik kebijakan publik.
          </p>
        </section>

        {/* Stats Grid */}
        <section className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <StatBox value={stats?.TOTAL_ENTITIES || 0} label="Entitas Terpetakan" />
          <StatBox value={stats?.TOTAL_RELATIONS || 0} label="Relasi Ditemukan" />
          <StatBox value={stats?.TOTAL_RED_FLAGS || 0} label="Indikasi Konflik" highlight />
          <StatBox value={stats?.TOTAL_SPPG || 0} label="Titik Operasional" />
        </section>

        {/* Mission Section */}
        <section className="grid md:grid-cols-2 gap-12 border-t border-[var(--border-base)] pt-16">
          <div className="space-y-4">
            <h2 className="text-2xl font-bold font-serif text-[var(--text-primary)]">Mengapa Ini Penting?</h2>
            <p className="text-[var(--text-secondary)] leading-relaxed">
              Keputusan besar nasional sering kali melibatkan perputaran anggaran triliunan rupiah. Tanpa pengawasan publik yang tajam, risiko korupsi strategis dan monopoli vertikal dapat merugikan ketahanan ekonomi bangsa. Kami percaya data adalah alat pertahanan sipil terbaik.
            </p>
          </div>
          <div className="space-y-4">
            <h2 className="text-2xl font-bold font-serif text-[var(--text-primary)]">Metodologi Kami</h2>
            <p className="text-[var(--text-secondary)] leading-relaxed">
              Kami tidak berasumsi. Seluruh data kami ditarik dari pendaftaran resmi AHU Online, laporan LPSE, dan portal berita nasional yang terverifikasi. Kami menggunakan algoritma deteksi konflik untuk menemukan pengurus ganda (interlocking directorates) yang sering kali tersembunyi.
            </p>
          </div>
        </section>

        {/* Footer CTA */}
        <section className="bg-[var(--bg-surface)] p-8 md:p-12 border border-[var(--border-strong)] text-center space-y-8">
          <div className="space-y-2">
            <h3 className="text-2xl font-bold font-serif text-[var(--text-primary)]">Dukung Transparansi Publik</h3>
            <p className="text-[var(--text-secondary)]">Kontribusikan temuan atau laporkan anomali data melalui repositori kami.</p>
          </div>
          <div className="flex flex-wrap justify-center gap-4">
            <Link 
              href="https://github.com" 
              className="px-8 py-3 bg-[var(--text-primary)] text-[var(--bg-base)] font-mono text-xs font-bold uppercase tracking-wider hover:opacity-90 transition-opacity"
            >
              GitHub Repository
            </Link>
            <Link 
              href="/graf" 
              className="px-8 py-3 border-2 border-[var(--text-primary)] text-[var(--text-primary)] font-mono text-xs font-bold uppercase tracking-wider hover:bg-[var(--text-primary)] hover:text-[var(--bg-base)] transition-all"
            >
              Mulai Investigasi
            </Link>
          </div>
        </section>
      </div>
    </main>
  );
}

function StatBox({ value, label, highlight = false }: { value: number | string, label: string, highlight?: boolean }) {
  return (
    <div className={`p-6 border border-[var(--border-base)] ${highlight ? 'bg-[var(--accent-danger-bg)] border-[var(--accent-danger)]/20' : ''}`}>
      <div className={`text-3xl font-bold font-mono mb-1 ${highlight ? 'text-[var(--accent-danger)]' : 'text-[var(--text-primary)]'}`}>
        {typeof value === 'number' ? value.toLocaleString() : value}
      </div>
      <div className="text-[10px] font-mono uppercase tracking-widest text-[var(--text-tertiary)]">
        {label}
      </div>
    </div>
  );
}
