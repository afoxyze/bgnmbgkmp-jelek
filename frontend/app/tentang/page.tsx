"use client";

import { useState, useEffect } from "react";
import { SITE_CONFIG } from "@/lib/constants";
import Link from "next/link";

export default function TentangPage() {
  const [stats, setStats] = useState<any>(null);

  useEffect(() => {
    fetch("/api/casestudy")
      .then(res => res.json())
      .then(data => setStats(data.stats))
      .catch(err => console.error("Failed to fetch stats on Tentang page:", err));
  }, []);

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
            {SITE_CONFIG.NAME} adalah inisiatif OSINT (Open Source Intelligence) independen yang memetakan jejaring bisnis-politik di balik proyek strategis nasional yang berdampak luas bagi publik.
          </p>
        </section>

        {/* Dynamic Stats Section */}
        <section className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <StatBox 
            label="Total Entitas" 
            value={stats?.TOTAL_ENTITIES || "..."} 
            sub="Individu & Organisasi"
          />
          <StatBox 
            label="Relasi Graf" 
            value={stats?.TOTAL_RELATIONS || "..."} 
            sub="Koneksi Terverifikasi"
          />
          <StatBox 
            label="Red Flags" 
            value={stats?.TOTAL_RED_FLAGS || "..."} 
            sub="Indikasi Konflik"
            highlight
          />
        </section>

        {/* Project Pillars Section */}
        <section className="space-y-8">
          <h2 className="text-2xl font-bold text-[var(--text-primary)] font-serif border-b border-[var(--border-strong)] pb-3">
            Fokus Investigasi Aktif (April 2026)
          </h2>
          <div className="grid gap-6">
            <ProjectPillar 
              id="01"
              title="MBG (Makan Bergizi Gratis)"
              desc="Pemantauan alokasi anggaran Rp335 Triliun, deteksi patronase politik pada 28 yayasan mitra, dan pengawasan konstitusional atas penggunaan dana pendidikan Rp223,55T."
            />
            <ProjectPillar 
              id="02"
              title="BGN (Badan Gizi Nasional)"
              desc="Audit independen atas pengadaan aset IT dan logistik nasional. Melacak anomali harga pada sistem E-Purchasing dan latar belakang vendor pemenang kontrak triliunan rupiah."
            />
            <ProjectPillar 
              id="03"
              title="KMP (Koperasi Merah Putih)"
              desc="Pemetaan monopoli infrastruktur desa oleh entitas yang dikendalikan lingkaran inti kekuasaan, serta deteksi markup biaya konstruksi gerai di seluruh Indonesia."
            />
          </div>
        </section>

        {/* Methodology Section */}
        <section className="bg-[var(--bg-surface)] p-8 border border-[var(--border-strong)] space-y-8">
          <h2 className="text-xl font-bold text-[var(--text-primary)] font-mono uppercase tracking-tight">Metodologi & Sumber Data</h2>
          <div className="grid md:grid-cols-2 gap-10">
            <div className="space-y-4">
              <h3 className="text-sm font-bold text-[var(--accent-danger)] uppercase font-mono tracking-widest">Sourcing</h3>
              <p className="text-[var(--text-secondary)] text-sm leading-relaxed">
                Data kami bersumber dari dokumen resmi yang tersedia untuk publik: 
                <br /><br />
                • <strong>AHU Online</strong> (Akta Perusahaan & Yayasan)<br />
                • <strong>SiRUP LKPP</strong> (Rencana Pengadaan)<br />
                • <strong>LPSE</strong> (Pemenang Tender)<br />
                • <strong>Laporan Investigasi</strong> (ICW, Tempo, BPK-RI, MK-RI)
              </p>
            </div>
            <div className="space-y-4">
              <h3 className="text-sm font-bold text-[var(--accent-danger)] uppercase font-mono tracking-widest">Graph Engine</h3>
              <p className="text-[var(--text-secondary)] text-sm leading-relaxed">
                Kami menggunakan algoritma pemetaan graf untuk mendeteksi <strong>Beneficial Ownership</strong> yang tersembunyi dan <strong>Revolving Door</strong> antara jabatan publik dan struktur korporasi.
              </p>
            </div>
          </div>
        </section>

        {/* Disclaimer Section */}
        <section className="space-y-4 text-center py-8">
          <p className="text-[10px] font-mono text-[var(--text-tertiary)] uppercase leading-loose max-w-2xl mx-auto">
            DISCLAIMER: {SITE_CONFIG.NAME} adalah alat bantu analisis berbasis fakta dokumen. Kami tidak membuat kesimpulan hukum; seluruh data disajikan untuk mendorong akuntabilitas publik dan transparansi anggaran negara.
          </p>
          <div className="flex justify-center gap-4 pt-4">
             <Link href="/" className="text-xs font-mono font-bold text-[var(--text-primary)] underline decoration-[var(--accent-danger)]">KEMBALI KE BERANDA</Link>
             <Link href="/graf" className="text-xs font-mono font-bold text-[var(--text-primary)] underline decoration-[var(--accent-danger)]">EKSPLORASI GRAF</Link>
          </div>
        </section>

        {/* Footer Meta */}
        <footer className="pt-8 border-t border-[var(--border-base)] flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="text-[9px] font-mono text-[var(--text-tertiary)] uppercase tracking-widest">
            Sistem Sinkronisasi: {stats?.LATEST_UPDATE || "..."}
          </div>
          <div className="text-[9px] font-mono text-[var(--text-tertiary)] uppercase tracking-widest">
            PLATFORM VERSI 1.0.4 — © 2026 {SITE_CONFIG.NAME}
          </div>
        </footer>
      </div>
    </main>
  );
}

function StatBox({ label, value, sub, highlight = false }: any) {
  return (
    <div className={`p-4 border border-[var(--border-base)] bg-[var(--bg-surface)] ${highlight ? 'border-[var(--accent-danger)] border-b-4' : ''}`}>
      <div className="text-[9px] font-mono font-bold text-[var(--text-tertiary)] uppercase tracking-widest mb-1">
        {label}
      </div>
      <div className={`text-2xl md:text-3xl font-bold font-mono ${highlight ? 'text-[var(--accent-danger)]' : 'text-[var(--text-primary)]'}`}>
        {value}
      </div>
      <div className="text-[9px] text-[var(--text-tertiary)] mt-1 uppercase">
        {sub}
      </div>
    </div>
  );
}

function ProjectPillar({ id, title, desc }: any) {
  return (
    <div className="flex gap-6 group">
      <div className="text-[var(--accent-danger)] font-mono font-bold text-lg pt-1">
        [{id}]
      </div>
      <div className="space-y-2">
        <h3 className="text-lg font-bold text-[var(--text-primary)] font-serif group-hover:text-[var(--accent-danger)] transition-colors">
          {title}
        </h3>
        <p className="text-sm text-[var(--text-secondary)] leading-relaxed">
          {desc}
        </p>
      </div>
    </div>
  );
}
