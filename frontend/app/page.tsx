import Link from "next/link";
import { getCaseStudy, getLiveStats } from "@/lib/data";
import type { CaseStudy } from "@/types/graph";
import type { Metadata } from "next";

import { SITE_CONFIG } from "@/lib/constants";
import { InvestigationCard } from "@/components/InvestigationCard";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: `${SITE_CONFIG.NAME} — Platform Investigasi Bisnis-Politik Indonesia`,
  description: SITE_CONFIG.DESCRIPTION,
  keywords: SITE_CONFIG.KEYWORDS,
};

export default async function HomePage() {
  const [caseStudy, stats] = await Promise.all([
    getCaseStudy(),
    getLiveStats()
  ]);

  return <LandingPage caseStudy={caseStudy} stats={stats} />;
}

// ─── Sub-components ───────────────────────────────────────────────────────────

interface LandingPageProps {
  caseStudy: CaseStudy | null;
  stats: any;
}

function LandingPage({ caseStudy, stats }: LandingPageProps) {
  const totalEntitas = stats?.TOTAL_ENTITIES || 0; 
  const totalRelasi = stats?.TOTAL_RELATIONS || 0;
  const totalRedFlags = stats?.TOTAL_RED_FLAGS || 0;

  return (
    <main
      className="content-page"
      style={{ fontFamily: "'Inter', 'system-ui', sans-serif" }}
    >
      <div style={{ maxWidth: "860px", margin: "0 auto" }}>
        <HeroSection
          totalEntitas={totalEntitas}
          totalRelasi={totalRelasi}
          totalRedFlags={totalRedFlags}
        />
        <InvestigationsSection totalSppg={stats?.TOTAL_SPPG || 0} />
        <BottomCTA />
      </div>
    </main>
  );
}

// ─── Hero ─────────────────────────────────────────────────────────────────────

interface HeroSectionProps {
  totalEntitas: number;
  totalRelasi: number;
  totalRedFlags: number;
}

function HeroSection({ totalEntitas, totalRelasi, totalRedFlags }: HeroSectionProps) {
  return (
    <section style={{ paddingBottom: "clamp(3rem, 6vw, 5rem)" }}>
      {/* Eyebrow label */}
      <div style={{ marginBottom: "1.5rem" }}>
        <span
          style={{
            fontFamily: "'IBM Plex Mono', monospace",
            fontSize: "0.688rem",
            fontWeight: 500,
            letterSpacing: "0.12em",
            textTransform: "uppercase",
            color: "var(--accent-danger)",
            borderBottom: "1px solid var(--accent-danger)",
            paddingBottom: "2px",
          }}
        >
          OSINT Investigation
        </span>
      </div>

      {/* Main headline */}
      <h1
        style={{
          fontFamily: "'IBM Plex Serif', 'Georgia', serif",
          fontSize: "clamp(2.25rem, 6vw, 3.75rem)",
          fontWeight: 700,
          lineHeight: 1.1,
          color: "var(--text-primary)",
          letterSpacing: "-0.03em",
          marginBottom: "1.25rem",
          maxWidth: "760px",
        }}
      >
        Menyingkap Jaringan
        <br />
        di Balik Kebijakan.
      </h1>

      {/* Subheadline */}
      <p
        style={{
          fontSize: "1.125rem",
          lineHeight: 1.6,
          color: "var(--text-secondary)",
          marginBottom: "2.5rem",
          maxWidth: "600px",
        }}
      >
        {SITE_CONFIG.NAME} memetakan aliansi bisnis-politik, konsentrasi kepemilikan saham, 
        dan potensi konflik kepentingan dalam proyek strategis nasional yang berdampak luas bagi publik.
      </p>

      {/* Live stats row - Relasi, Entitas, Indikasi only */}
      <div
        className="flex flex-wrap border-t border-l border-[var(--border-base)] mb-10"
      >
        <StatCell value={totalRelasi} label="Relasi" />
        <StatCell value={totalEntitas} label="Entitas" />
        <StatCell value={totalRedFlags} label="Indikasi" danger />
      </div>

      {/* CTA */}
      <div className="flex flex-col sm:flex-row gap-4">
        <Link
          href="/graf"
          className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-[var(--accent-danger)] text-white font-mono text-sm font-bold tracking-wider no-underline transition-opacity shadow-[0_10px_15px_-3px_rgba(196,30,58,0.2)]"
        >
          EKSPLORASI GRAF
          <ArrowRight />
        </Link>
      </div>
    </section>
  );
}

interface StatCellProps {
  value: number;
  label: string;
  danger?: boolean;
}

function StatCell({ value, label, danger = false }: StatCellProps) {
  return (
    <div
      className={`flex-1 min-w-[120px] p-4 md:p-6 border-r border-b border-[var(--border-base)] ${danger ? "bg-[var(--accent-danger-bg)]" : ""}`}
    >
      <div
        style={{
          fontFamily: "'IBM Plex Mono', monospace",
          fontSize: "clamp(1.5rem, 4vw, 2.75rem)",
          fontWeight: 600,
          lineHeight: 1,
          color: danger ? "var(--accent-danger)" : "var(--text-primary)",
          marginBottom: "0.5rem",
        }}
      >
        {value.toLocaleString()}
      </div>
      <div
        style={{
          fontFamily: "'IBM Plex Mono', monospace",
          fontSize: "0.6rem",
          letterSpacing: "0.08em",
          textTransform: "uppercase",
          color: danger ? "var(--accent-danger)" : "var(--text-secondary)",
        }}
      >
        {label}
      </div>
    </div>
  );
}

// ─── Investigations ───────────────────────────────────────────────────────────

function InvestigationsSection({ totalSppg }: { totalSppg: number }) {
  return (
    <section className="pb-12 md:pb-20">
      {/* Section header */}
      <div
        className="flex items-baseline gap-4 mb-10 pb-5 border-b border-[var(--text-primary)]"
      >
        <h2
          style={{
            fontFamily: "'IBM Plex Serif', 'Georgia', serif",
            fontSize: "clamp(1.25rem, 4vw, 1.75rem)",
            fontWeight: 700,
            color: "var(--text-primary)",
            margin: 0,
            letterSpacing: "-0.02em",
          }}
        >
          Pusat Investigasi Aktif
        </h2>
        <div className="flex-1" />
        <span
          style={{
            fontFamily: "'IBM Plex Mono', monospace",
            fontSize: "clamp(0.6rem, 2vw, 0.75rem)",
            letterSpacing: "0.05em",
            textTransform: "uppercase",
            color: "var(--accent-danger)",
            fontWeight: 600,
          }}
        >
          ● LIVE MONITORING
        </span>
      </div>

      {/* Vertical List Layout — Following 'menurun' preference */}
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "2rem",
        }}
      >
        {/* HERO CARD: 1. MBG — Makan Bergizi Gratis */}
        <InvestigationCard
          variant="hero"
          thread="Proyek 01"
          status="CRITICAL"
          source="MK-RI / KEMENKEU / ICW"
          judul="MBG: Krisis Konstitusi & Anggaran Rp335 Triliun"
          poin={[
            "Anggaran 2026 melonjak ke Rp335T, dengan dugaan 'penculikan' Dana Pendidikan (Mandatory Spending) sebesar Rp223,55T yang kini digugat di Mahkamah Kstitusi.",
            "Krisis Transparansi: Berdasarkan data LKPP, baru 8,6% (Rp1,05T) dari total Rencana Umum Pengadaan (RUP) Badan Gizi Nasional yang diumumkan secara terbuka.",
            "Patronase Politik: ICW mengidentifikasi 28 yayasan mitra pelaksana terafiliasi partai politik, dengan pengurus yang mencakup anggota DPR aktif dan mantan napi korupsi.",
          ]}
          entitas={28}
          redFlags={12}
        />

        {/* SIDE CARD: 2. BGN — Badan Gizi Nasional */}
        <InvestigationCard
          thread="Proyek 02"
          status="ACTIVE"
          source="BPK-RI / E-PURCHASING / TEMPO"
          judul="BGN: Anomali Pengadaan Alat IT & Logistik"
          poin={[
            "Audit Investigatif: Dugaan mark-up Rp7,95 Juta per unit pada pengadaan Tablet Samsung (Total Rp508,49 Miliar) untuk program Sarjana Penggerak (SPPI).",
            "Kontrak Rp1,4T pengadaan motor listrik MBG dimenangkan PT Yasa Artha, yang jajaran direksinya merupakan saksi kunci dalam kasus korupsi bansos di KPK.",
            "Pemborosan Anggaran: Temuan item pengadaan sekunder (semir & sikat sepatu) dengan markup harga hingga 300% melalui sistem E-Purchasing.",
          ]}
          entitas={26}
          redFlags={10}
        />

        {/* SIDE CARD: 3. KMP — Koperasi Merah Putih */}
        <InvestigationCard
          thread="Proyek 03"
          status="VERIFIED"
          source="AHU-ONLINE / KPK / INVESTIGASI"
          judul="KMP: Gurita Monopoli & Infrastruktur Desa"
          poin={[
            "Monopoli Vertikal: PT Agrinas (Yayasan Kemenhan) memegang kendali penuh konstruksi 80.000+ gerai KMP dengan estimasi nilai proyek Rp128T+.",
            "Indikasi Markup Konstruksi: Selisih anggaran pembangunan gerai hingga Rp700 Juta per unit dibandingkan nilai fisik riil di lapangan (studi kasus Denpasar).",
            "Skandal Identitas: CEO PT IMI (vendor rak SPPG Rp375M) terdeteksi memiliki 3 NIK ganda dan menggunakan gudang militer Pusziad untuk penyimpanan unit komersial.",
          ]}
          entitas={17}
          redFlags={11}
        />

        {/* OPEN DATA CARD: Dataset Portal — OSINT Toolkit */}
        <article
          style={{
            padding: "2rem",
            backgroundColor: "var(--bg-surface)",
            color: "var(--text-primary)",
            display: "flex",
            flexDirection: "column",
            gap: "1.25rem",
            position: "relative",
            overflow: "hidden",
            border: "1px solid var(--border-strong)"
          }}
        >
           <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: "0.5rem" }}>
              <span style={{ 
                fontFamily: "'IBM Plex Mono', monospace", 
                fontSize: "0.75rem", 
                color: "var(--accent-danger)",
                fontWeight: 600,
                letterSpacing: "0.1em" 
              }}>
                [ SYSTEM ACCESS: OPEN DATA ]
              </span>
              <span style={{ 
                fontFamily: "'IBM Plex Mono', monospace", 
                fontSize: "0.625rem", 
                border: "1px solid var(--border-base)", 
                padding: "2px 6px", 
                borderRadius: "2px",
                color: "var(--text-tertiary)",
              }}>
                RAW_DATABASE_V1.0
              </span>
           </div>
           <h3 style={{ fontFamily: "'IBM Plex Serif', serif", fontSize: "1.75rem", fontWeight: 700, margin: 0, color: "var(--text-primary)" }}>Eksplorasi Mandiri: Database & Conflict Engine</h3>
           <p style={{ fontSize: "1rem", color: "var(--text-secondary)", lineHeight: 1.6, margin: 0, maxWidth: "600px" }}>
             Kami menyediakan akses penuh ke {totalSppg.toLocaleString()} titik operasional dalam format JSON/CSV. 
             Gunakan alat pencarian kami untuk mendeteksi tumpang tindih pengurus lintas entitas secara otomatis.
           </p>
           <div style={{ marginTop: "1rem", display: "flex", gap: "1rem", flexWrap: "wrap" }}>
              <Link 
                href="/tentang" 
                style={{ 
                  backgroundColor: "var(--text-primary)", 
                  color: "var(--bg-base)", 
                  padding: "0.75rem 1.5rem", 
                  textDecoration: "none", 
                  fontSize: "0.8125rem", 
                  fontFamily: "'IBM Plex Mono', monospace",
                  fontWeight: 600
                }}
              >
                UNDUH DATASET (.JSON)
              </Link>
              <Link 
                href="/cari" 
                style={{ 
                  border: "1px solid var(--text-primary)", 
                  color: "var(--text-primary)", 
                  padding: "0.75rem 1.5rem", 
                  textDecoration: "none", 
                  fontSize: "0.8125rem", 
                  fontFamily: "'IBM Plex Mono', monospace",
                  fontWeight: 600
                }}
              >
                CARI ENTITAS
              </Link>
           </div>
        </article>
      </div>
    </section>
  );
}

// ─── Bottom CTA ───────────────────────────────────────────────────────────────

function BottomCTA() {
  return (
    <section
      style={{
        paddingTop: "4rem",
        paddingBottom: "4rem",
        borderTop: "1px solid var(--border-base)",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        textAlign: "center",
        gap: "2rem",
      }}
    >
      <div style={{ maxWidth: "700px" }}>
        <h3
          style={{
            fontFamily: "'IBM Plex Serif', 'Georgia', serif",
            fontSize: "1.75rem",
            fontWeight: 700,
            color: "var(--text-primary)",
            margin: "0 0 1rem 0",
            letterSpacing: "-0.02em"
          }}
        >
          Transparansi Radikal. Akuntabilitas Publik.
        </h3>
        <p style={{ 
          color: "var(--text-secondary)", 
          margin: 0, 
          fontSize: "1.0625rem",
          lineHeight: 1.6
        }}>
          {SITE_CONFIG.NAME} adalah inisiatif independen. Seluruh analisis kami berbasis pada dokumen publik (AHU, LPSE, SiRUP) yang diverifikasi untuk mendukung keterbukaan informasi nasional.
        </p>
      </div>

      <div style={{ display: "flex", gap: "1rem", flexWrap: "wrap", justifyContent: "center" }}>
        <Link
          href="/tentang"
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "0.5rem",
            paddingInline: "1.75rem",
            paddingBlock: "0.875rem",
            backgroundColor: "var(--text-primary)",
            color: "var(--bg-base)",
            fontFamily: "'IBM Plex Mono', monospace",
            fontSize: "0.8125rem",
            fontWeight: 600,
            letterSpacing: "0.04em",
            textDecoration: "none",
          }}
        >
          Pelajari Metodologi
        </Link>
        <Link
          href="https://github.com"
          target="_blank"
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "0.5rem",
            paddingInline: "1.75rem",
            paddingBlock: "0.875rem",
            backgroundColor: "transparent",
            color: "var(--text-primary)",
            fontFamily: "'IBM Plex Mono', monospace",
            fontSize: "0.8125rem",
            fontWeight: 600,
            letterSpacing: "0.04em",
            textDecoration: "none",
            border: "2px solid var(--text-primary)",
          }}
        >
          Kontribusi Data
        </Link>
      </div>
      
      <p style={{ 
        fontSize: "0.6875rem", 
        color: "var(--text-tertiary)", 
        fontFamily: "'IBM Plex Mono', monospace",
        maxWidth: "600px",
        marginTop: "1rem"
      }}>
        DISCLAIMER: Data disajikan "sebagaimana adanya" dari sumber resmi. Kami tidak bertanggung jawab atas interpretasi pihak ketiga yang menyimpang dari fakta dokumen.
      </p>
    </section>
  );
}

// ─── Icon ─────────────────────────────────────────────────────────────────────

interface ArrowRightProps {
  size?: number;
}

function ArrowRight({ size = 16 }: ArrowRightProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 14 14"
      fill="none"
      aria-hidden="true"
      style={{ flexShrink: 0 }}
    >
      <path
        d="M2 7h10M8 3l4 4-4 4"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
