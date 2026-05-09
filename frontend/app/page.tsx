import Link from "next/link";
import { getLiveStats } from "@/lib/data";
import type { Metadata } from "next";

import { SITE_CONFIG } from "@/lib/constants";
import { getDossierSummaries } from "@/lib/dossier";
import { DossierIndexCard } from "@/components/dossier/DossierIndexCard";

export const metadata: Metadata = {
  title: `${SITE_CONFIG.NAME} - Katalog Data Proyek Pemerintah`,
  description: SITE_CONFIG.DESCRIPTION,
  keywords: SITE_CONFIG.KEYWORDS,
};

type LiveStats = Awaited<ReturnType<typeof getLiveStats>>;

export default async function HomePage() {
  const stats = await getLiveStats();
  return <LandingPage stats={stats} />;
}

interface LandingPageProps {
  stats: LiveStats;
}

function LandingPage({ stats }: LandingPageProps) {
  const totalEntitas = stats?.TOTAL_ENTITIES ?? 0;
  const totalRelasi = stats?.TOTAL_RELATIONS ?? 0;
  const totalRedFlags = stats?.TOTAL_RED_FLAGS ?? 0;
  const totalSppg = stats?.TOTAL_SPPG ?? 0;
  const mappedSppg = stats?.MAPPED_SPPG ?? 0;
  const latestUpdate = stats?.LATEST_UPDATE ?? "2026-04-18";

  return (
    <main className="content-page" style={{ fontFamily: "'Inter', 'system-ui', sans-serif" }}>
      <div style={{ maxWidth: "1160px", margin: "0 auto" }}>
        <HeroSection
          totalEntitas={totalEntitas}
          totalRelasi={totalRelasi}
          totalRedFlags={totalRedFlags}
          totalSppg={totalSppg}
          latestUpdate={latestUpdate}
        />
        <InvestigationsSection />
        <OpenDataBand
          totalSppg={totalSppg}
          mappedSppg={mappedSppg}
          certificationRate={stats?.CERTIFICATION_RATE ?? "0%"}
        />
        <EditorialPrinciples />
        <Footer />
      </div>
    </main>
  );
}

interface HeroSectionProps {
  totalEntitas: number;
  totalRelasi: number;
  totalRedFlags: number;
  totalSppg: number;
  latestUpdate: string;
}

function HeroSection({
  totalEntitas,
  totalRelasi,
  totalRedFlags,
  totalSppg,
  latestUpdate,
}: HeroSectionProps) {
  return (
    <section className="pb-14 md:pb-20">
      <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,1fr)_420px] gap-8 lg:gap-12 items-end">
        <div>
          <div className="flex flex-wrap gap-3 mb-7">
            <MetaPill label="Data" value="Dokumen publik" />
            <MetaPill label="Update" value={latestUpdate} />
            <MetaPill label="Mode" value="Ringkas" danger />
          </div>

          <h1
            style={{
              fontFamily: "'IBM Plex Serif', 'Georgia', serif",
              fontSize: "clamp(2.75rem, 7vw, 5rem)",
              fontWeight: 700,
              lineHeight: 0.98,
              color: "var(--text-primary)",
              letterSpacing: "-0.03em",
              marginBottom: "1.35rem",
              maxWidth: "820px",
            }}
          >
            Data proyek pemerintah yang perlu dilihat lebih dekat.
          </h1>

          <p
            style={{
              fontSize: "1.08rem",
              lineHeight: 1.7,
              color: "var(--text-secondary)",
              marginBottom: "2rem",
              maxWidth: "680px",
            }}
          >
            {SITE_CONFIG.NAME} mengumpulkan data publik soal proyek pemerintah,
            mulai dari angka anggaran, vendor, sumber, sampai relasi antar
            entitas. Tujuannya sederhana: supaya data yang tersebar bisa lebih
            mudah dibaca.
          </p>

          <div className="flex flex-col sm:flex-row gap-3">
            <Link
              href="/dossier"
              className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-md bg-[var(--accent-danger)] text-white font-mono text-xs font-bold tracking-[0.14em] no-underline transition-all shadow-[0_12px_22px_-10px_rgba(196,30,58,0.65)] hover:opacity-90 hover:translate-y-[-1px] active:translate-y-0"
            >
              LIHAT CATATAN
              <ArrowRight />
            </Link>
            <Link
              href="/graf"
              className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-md border border-[var(--border-strong)] bg-[var(--bg-surface)] text-[var(--text-primary)] font-mono text-xs font-bold tracking-[0.14em] no-underline transition-all hover:border-[var(--accent-danger)] hover:text-[var(--accent-danger)]"
            >
              BUKA GRAF
            </Link>
          </div>
        </div>

        <aside className="border border-[var(--border-base)] rounded-lg bg-[var(--bg-surface)] shadow-sm overflow-hidden">
          <div className="flex items-center justify-between gap-4 px-5 py-4 border-b border-[var(--border-base)]">
            <span className="font-mono text-[10px] font-bold tracking-[0.14em] uppercase text-[var(--text-tertiary)]">
              Ringkasan Data
            </span>
            <span className="font-mono text-[10px] font-bold tracking-[0.12em] uppercase text-[var(--accent-danger)]">
              Publik
            </span>
          </div>

          <div className="grid grid-cols-2">
            <StatCell value={totalRelasi} label="Relasi" />
            <StatCell value={totalEntitas} label="Entitas" />
            <StatCell value={totalRedFlags} label="Catatan" danger />
            <StatCell value={formatCompact(totalSppg)} label="Titik SPPG" />
          </div>

          <SignalMap />
        </aside>
      </div>
    </section>
  );
}

function MetaPill({ label, value, danger = false }: { label: string; value: string; danger?: boolean }) {
  return (
    <div className="inline-flex items-center gap-2 rounded-md border border-[var(--border-base)] bg-[var(--bg-surface)] px-3 py-2">
      <span className={`h-1.5 w-1.5 rounded-full ${danger ? "bg-[var(--accent-danger)]" : "bg-[var(--text-tertiary)]"}`} />
      <span className="font-mono text-[10px] font-bold uppercase tracking-[0.14em] text-[var(--text-tertiary)]">
        {label}
      </span>
      <span className="font-mono text-[10px] font-bold uppercase tracking-[0.08em] text-[var(--text-primary)]">
        {value}
      </span>
    </div>
  );
}

interface StatCellProps {
  value: number | string;
  label: string;
  danger?: boolean;
}

function StatCell({ value, label, danger = false }: StatCellProps) {
  const formattedValue = typeof value === "number" ? value.toLocaleString("id-ID") : value;

  return (
    <div className="p-5 border-b border-r border-[var(--border-base)] last:border-r-0 odd:last:border-r">
      <div
        style={{
          fontFamily: "'IBM Plex Mono', monospace",
          fontSize: "clamp(1.45rem, 4vw, 2.35rem)",
          fontWeight: 700,
          lineHeight: 1,
          color: danger ? "var(--accent-danger)" : "var(--text-primary)",
          marginBottom: "0.55rem",
          fontVariantNumeric: "tabular-nums",
        }}
      >
        {formattedValue}
      </div>
      <div className="font-mono text-[10px] font-bold uppercase tracking-[0.14em] text-[var(--text-secondary)]">
        {label}
      </div>
    </div>
  );
}

function SignalMap() {
  return (
    <div className="relative min-h-[190px] bg-[var(--bg-surface-2)]">
      <svg className="absolute inset-0 h-full w-full" viewBox="0 0 420 190" aria-hidden="true">
        <path d="M88 95 C140 28, 238 40, 318 88" stroke="var(--border-strong)" strokeWidth="1.5" fill="none" />
        <path d="M88 95 C162 150, 235 148, 318 88" stroke="var(--border-strong)" strokeWidth="1.5" fill="none" />
        <path d="M200 48 L200 143" stroke="var(--border-strong)" strokeWidth="1.5" />
        <circle cx="88" cy="95" r="26" fill="var(--bg-surface)" stroke="var(--accent-danger)" strokeWidth="2" />
        <circle cx="200" cy="48" r="18" fill="var(--bg-surface)" stroke="#3B82F6" strokeWidth="2" />
        <circle cx="200" cy="143" r="18" fill="var(--bg-surface)" stroke="#10B981" strokeWidth="2" />
        <circle cx="318" cy="88" r="30" fill="var(--bg-surface)" stroke="#F59E0B" strokeWidth="2" />
      </svg>
      <div className="relative z-10 grid h-full min-h-[190px] grid-cols-2 content-between p-5">
        <span className="font-mono text-[10px] font-bold uppercase tracking-[0.12em] text-[var(--accent-danger)]">
          Perlu dicek
        </span>
        <span className="text-right font-mono text-[10px] font-bold uppercase tracking-[0.12em] text-[var(--text-tertiary)]">
          AHU / LPSE / SiRUP
        </span>
        <span className="col-span-2 max-w-[260px] self-end text-sm leading-relaxed text-[var(--text-secondary)]">
          Graf ini menyambungkan data yang muncul di dokumen publik supaya
          relasi antar entitas lebih mudah dibaca.
        </span>
      </div>
    </div>
  );
}

function InvestigationsSection() {
  return (
    <section className="pb-12 md:pb-16">
      <SectionHeader
        eyebrow="Catatan"
        title="Beberapa proyek yang bisa ditelusuri dari data publik."
        actionHref="/dossier"
        actionLabel="Semua catatan"
      />

      <div className="flex flex-col gap-4">
        {getDossierSummaries().map((dossier) => (
          <DossierIndexCard key={dossier.slug} dossier={dossier} />
        ))}
      </div>
    </section>
  );
}

function OpenDataBand({
  totalSppg,
  mappedSppg,
  certificationRate,
}: {
  totalSppg: number;
  mappedSppg: number;
  certificationRate: string;
}) {
  return (
    <section className="py-12 md:py-16 border-y border-[var(--border-base)]">
      <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,1fr)_360px] gap-8 items-start">
        <div>
          <p className="font-mono text-[10px] font-bold uppercase tracking-[0.16em] text-[var(--accent-danger)] mb-4">
            Data Publik
          </p>
          <h2
            style={{
              fontFamily: "'IBM Plex Serif', 'Georgia', serif",
              fontSize: "clamp(1.8rem, 4vw, 2.7rem)",
              fontWeight: 700,
              color: "var(--text-primary)",
              lineHeight: 1.08,
              letterSpacing: "-0.025em",
              maxWidth: "760px",
              marginBottom: "1rem",
            }}
          >
            Dataset tersedia untuk diperiksa ulang.
          </h2>
          <p className="max-w-[720px] text-[var(--text-secondary)] leading-relaxed">
            Data inti disajikan dalam format JSON dan CSV agar bisa dibuka,
            dibandingkan, dan diperiksa lagi oleh siapa pun.
          </p>
          <div className="mt-6 flex flex-col sm:flex-row gap-3">
            <Link className="data-link-primary" href="/exports/koneksi_id_sppg_data.csv">
              Unduh CSV
            </Link>
            <Link className="data-link-secondary" href="/exports/koneksi_id_sppg_data.json">
              Unduh JSON
            </Link>
            <Link className="data-link-secondary" href="/cari">
              Cari entitas
            </Link>
          </div>
        </div>

        <div className="rounded-lg border border-[var(--border-base)] bg-[var(--bg-surface)] p-5 shadow-sm">
          <MetricRow label="Unit resmi" value={totalSppg.toLocaleString("id-ID")} />
          <MetricRow label="Titik terpetakan" value={mappedSppg.toLocaleString("id-ID")} />
          <MetricRow label="Sertifikasi SLHS" value={certificationRate} danger />
        </div>
      </div>
    </section>
  );
}

function EditorialPrinciples() {
  return (
    <section className="py-14 md:py-16">
      <SectionHeader eyebrow="Cara Baca" title="Cara membaca data ini." />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        <PrincipleCard
          num="01"
          title="Pakai sumber terbuka"
          body="Setiap angka dan relasi diusahakan bisa ditelusuri ke sumber seperti AHU, LPSE, SiRUP, arsip berita, atau dokumen resmi."
        />
        <PrincipleCard
          num="02"
          title="Catatan bukan vonis"
          body="Situs ini membantu menunjukkan pola yang perlu diperiksa. Kesimpulan hukum tetap menjadi kewenangan lembaga yang berwenang."
        />
        <PrincipleCard
          num="03"
          title="Bisa diperiksa ulang"
          body="Dataset ekspor, halaman entitas, dan catatan proyek dibuat supaya informasinya bisa dicek ulang dengan lebih mudah."
        />
      </div>
    </section>
  );
}

function SectionHeader({
  eyebrow,
  title,
  actionHref,
  actionLabel,
}: {
  eyebrow: string;
  title: string;
  actionHref?: string;
  actionLabel?: string;
}) {
  return (
    <div className="mb-8 flex flex-col gap-4 border-b border-[var(--border-strong)] pb-5 md:flex-row md:items-end md:justify-between">
      <div>
        <p className="font-mono text-[10px] font-bold uppercase tracking-[0.16em] text-[var(--accent-danger)] mb-2">
          {eyebrow}
        </p>
        <h2
          style={{
            fontFamily: "'IBM Plex Serif', 'Georgia', serif",
            fontSize: "clamp(1.45rem, 4vw, 2.1rem)",
            fontWeight: 700,
            color: "var(--text-primary)",
            lineHeight: 1.12,
            letterSpacing: "-0.02em",
            margin: 0,
            maxWidth: "680px",
          }}
        >
          {title}
        </h2>
      </div>
      {actionHref && actionLabel && (
        <Link
          href={actionHref}
          className="inline-flex w-fit items-center gap-2 font-mono text-[11px] font-bold uppercase tracking-[0.14em] text-[var(--text-primary)] hover:text-[var(--accent-danger)]"
        >
          {actionLabel}
          <ArrowRight size={14} />
        </Link>
      )}
    </div>
  );
}

function PrincipleCard({ num, title, body }: { num: string; title: string; body: string }) {
  return (
    <article className="rounded-lg border border-[var(--border-base)] bg-[var(--bg-surface)] p-5 shadow-sm">
      <div className="mb-6 font-mono text-[10px] font-bold uppercase tracking-[0.16em] text-[var(--accent-danger)]">
        {num}
      </div>
      <h3
        style={{
          fontFamily: "'IBM Plex Serif', 'Georgia', serif",
          fontSize: "1.25rem",
          fontWeight: 700,
          color: "var(--text-primary)",
          marginBottom: "0.75rem",
        }}
      >
        {title}
      </h3>
      <p className="text-sm leading-relaxed text-[var(--text-secondary)]">{body}</p>
    </article>
  );
}

function MetricRow({ label, value, danger = false }: { label: string; value: string; danger?: boolean }) {
  return (
    <div className="flex items-baseline justify-between gap-4 border-b border-[var(--border-base)] py-4 first:pt-0 last:border-b-0 last:pb-0">
      <span className="font-mono text-[10px] font-bold uppercase tracking-[0.12em] text-[var(--text-tertiary)]">
        {label}
      </span>
      <span
        className={`font-mono text-lg font-bold ${danger ? "text-[var(--accent-danger)]" : "text-[var(--text-primary)]"}`}
      >
        {value}
      </span>
    </div>
  );
}

function Footer() {
  return (
    <footer className="border-t border-[var(--border-base)] py-12">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
        <div className="md:col-span-1">
          <Link
            href="/"
            className="mb-4 block text-lg font-black tracking-tight text-[var(--text-primary)] no-underline"
          >
            {SITE_CONFIG.NAME}
          </Link>
          <p className="text-sm leading-relaxed text-[var(--text-secondary)]">
            {SITE_CONFIG.DISCLAIMER}
          </p>
        </div>

        <FooterColumn title="Baca">
          <FooterLink href="/dossier">Catatan proyek</FooterLink>
          <FooterLink href="/graf">Graf relasi</FooterLink>
          <FooterLink href="/cari">Cari entitas</FooterLink>
          <FooterLink href="/sppg">Titik SPPG</FooterLink>
        </FooterColumn>

        <FooterColumn title="Data">
          <FooterLink href="/exports/koneksi_id_sppg_data.csv">Ekspor CSV</FooterLink>
          <FooterLink href="/exports/koneksi_id_sppg_data.json">Ekspor JSON</FooterLink>
          <FooterLink href="/data/case_study_bgn_peruri.json">Contoh catatan JSON</FooterLink>
        </FooterColumn>

        <FooterColumn title="Tentang">
          <FooterLink href="/tentang">Metodologi</FooterLink>
          <FooterLink href="https://github.com">GitHub</FooterLink>
          <FooterLink href="/tentang">Kontribusi</FooterLink>
        </FooterColumn>
      </div>

      <div className="mt-12 flex flex-wrap items-center justify-between gap-3 border-t border-[var(--border-base)] pt-6 font-mono text-[10px] font-bold uppercase tracking-[0.14em] text-[var(--text-tertiary)]">
        <span>2026 {SITE_CONFIG.NAME}</span>
        <span>JKT-NODE-01 / STATIC EXPORT</span>
      </div>
    </footer>
  );
}

function FooterColumn({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div>
      <h3 className="mb-4 font-mono text-[10px] font-bold uppercase tracking-[0.16em] text-[var(--text-primary)]">
        {title}
      </h3>
      <ul className="m-0 flex list-none flex-col gap-2 p-0">{children}</ul>
    </div>
  );
}

function FooterLink({ href, children }: { href: string; children: React.ReactNode }) {
  const className = "text-sm text-[var(--text-secondary)] no-underline transition-colors hover:text-[var(--accent-danger)]";

  if (href.startsWith("http")) {
    return (
      <li>
        <a href={href} target="_blank" rel="noreferrer" className={className}>
          {children}
        </a>
      </li>
    );
  }

  return (
    <li>
      <Link href={href} className={className}>
        {children}
      </Link>
    </li>
  );
}

function formatCompact(value: number): string {
  if (value >= 1000) return `${Math.round(value / 1000).toLocaleString("id-ID")}K+`;
  return value.toLocaleString("id-ID");
}

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
