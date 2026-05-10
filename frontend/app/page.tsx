import Link from "next/link";
import { getLiveStats } from "@/lib/data";
import type { Metadata } from "next";

import { SITE_CONFIG } from "@/lib/constants";
import { getDossierSummaries } from "@/lib/dossier";
import { DossierIndexCard } from "@/components/dossier/DossierIndexCard";
import { timeAgoId, formatIsoDateId } from "@/lib/format";

export const metadata: Metadata = {
  title: SITE_CONFIG.NAME_LONG,
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
  const latestUpdate = stats?.LATEST_UPDATE ?? "2026-04-18";

  // JSON-LD: WebSite + Organization for search engines
  const siteSchema = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebSite",
        "@id": `${SITE_CONFIG.URL}/#website`,
        url: SITE_CONFIG.URL,
        name: SITE_CONFIG.NAME,
        description: SITE_CONFIG.DESCRIPTION,
        inLanguage: "id-ID",
        potentialAction: {
          "@type": "SearchAction",
          target: `${SITE_CONFIG.URL}/cari?q={search_term_string}`,
          "query-input": "required name=search_term_string",
        },
      },
      {
        "@type": "Organization",
        "@id": `${SITE_CONFIG.URL}/#org`,
        name: SITE_CONFIG.NAME,
        url: SITE_CONFIG.URL,
        logo: `${SITE_CONFIG.URL}/og-image.png`,
        description: SITE_CONFIG.DESCRIPTION,
      },
    ],
  };

  return (
    <main className="content-page" style={{ fontFamily: "'Inter', 'system-ui', sans-serif" }}>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(siteSchema) }}
      />
      <div style={{ maxWidth: "1160px", margin: "0 auto" }}>
        <HeroSection
          totalEntitas={totalEntitas}
          totalRelasi={totalRelasi}
          totalRedFlags={totalRedFlags}
          latestUpdate={latestUpdate}
        />
        <InvestigationsSection />
        <OpenDataBand />
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
  latestUpdate: string;
}

function HeroSection({
  totalEntitas,
  totalRelasi,
  totalRedFlags,
  latestUpdate,
}: HeroSectionProps) {
  return (
    <section className="pb-14 md:pb-20">
      <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,1fr)_420px] gap-8 lg:gap-12 items-end">
        <div>
          <div className="flex flex-wrap gap-3 mb-7">
            <MetaPill label="Sumber" value="Dokumen publik" />
            <MetaPill label="Mutakhir" value={timeAgoId(latestUpdate)} title={formatIsoDateId(latestUpdate)} />
            <MetaPill label="Sifat" value="Arsip" danger />
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
            Proyek bagus pemerintah.
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
            Arsip proyek pemerintah yang dirangkum dari dokumen publik. Tidak
            ada yang baru di sini, hanya lebih rapi.
          </p>

          <div className="flex flex-col sm:flex-row gap-3">
            <Link
              href="/dossier"
              className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-md bg-[var(--accent-danger)] text-white font-mono text-xs font-bold tracking-[0.14em] no-underline transition-all shadow-[0_12px_22px_-10px_rgba(196,30,58,0.65)] hover:opacity-90 hover:translate-y-[-1px] active:translate-y-0"
            >
              BUKA KATALOG
              <ArrowRight />
            </Link>
            <Link
              href="/graf"
              className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-md border border-[var(--border-strong)] bg-[var(--bg-surface)] text-[var(--text-primary)] font-mono text-xs font-bold tracking-[0.14em] no-underline transition-all hover:border-[var(--accent-danger)] hover:text-[var(--accent-danger)]"
            >
              PETA RELASI
            </Link>
          </div>
        </div>

        <aside className="border border-[var(--border-base)] rounded-lg bg-[var(--bg-surface)] shadow-sm overflow-hidden">
          <div className="flex items-center justify-between gap-4 px-5 py-4 border-b border-[var(--border-base)]">
            <span className="font-mono text-[10px] font-bold tracking-[0.14em] uppercase text-[var(--text-tertiary)]">
              Ringkasan
            </span>
            <span className="font-mono text-[10px] font-bold tracking-[0.12em] uppercase text-[var(--accent-danger)]">
              Terbuka
            </span>
          </div>

          <div className="grid grid-cols-3">
            <StatCell value={totalEntitas} label="Entitas" />
            <StatCell value={totalRelasi} label="Relasi" />
            <StatCell value={totalRedFlags} label="Sorotan" danger />
          </div>

          <SignalMap />
        </aside>
      </div>
    </section>
  );
}

function MetaPill({
  label,
  value,
  danger = false,
  title,
}: {
  label: string;
  value: string;
  danger?: boolean;
  title?: string;
}) {
  return (
    <div
      className="inline-flex items-center gap-2 rounded-md border border-[var(--border-base)] bg-[var(--bg-surface)] px-3 py-2"
      title={title}
    >
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
    <div className="p-5 border-b border-r border-[var(--border-base)] last:border-r-0">
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
          Sorotan
        </span>
        <span className="text-right font-mono text-[10px] font-bold uppercase tracking-[0.12em] text-[var(--text-tertiary)]">
          AHU / LPSE / SiRUP
        </span>
        <span className="col-span-2 max-w-[260px] self-end text-sm leading-relaxed text-[var(--text-secondary)]">
          Peta ini menyambungkan entitas yang namanya sudah muncul di dokumen
          publik. Tinggal lihat sendiri.
        </span>
      </div>
    </div>
  );
}

function InvestigationsSection() {
  return (
    <section className="pb-12 md:pb-16">
      <SectionHeader
        eyebrow="Katalog"
        title="Proyek yang sudah ada di dokumen publik."
        actionHref="/dossier"
        actionLabel="Semua entri"
      />

      <div className="flex flex-col gap-4">
        {getDossierSummaries().map((dossier) => (
          <DossierIndexCard key={dossier.slug} dossier={dossier} />
        ))}
      </div>
    </section>
  );
}

function OpenDataBand() {
  return (
    <section className="py-12 md:py-16 border-y border-[var(--border-base)]">
      <div className="max-w-[760px]">
        <p className="font-mono text-[10px] font-bold uppercase tracking-[0.16em] text-[var(--accent-danger)] mb-4">
          Data Terbuka
        </p>
        <h2
          style={{
            fontFamily: "'IBM Plex Serif', 'Georgia', serif",
            fontSize: "clamp(1.8rem, 4vw, 2.7rem)",
            fontWeight: 700,
            color: "var(--text-primary)",
            lineHeight: 1.08,
            letterSpacing: "-0.025em",
            marginBottom: "1rem",
          }}
        >
          Unduh mentahnya, cek sendiri.
        </h2>
        <p className="text-[var(--text-secondary)] leading-relaxed">
          Dataset dalam JSON dan CSV. Kalau ada yang salah, repo GitHub-nya
          terbuka.
        </p>
        <div className="mt-6 flex flex-col sm:flex-row gap-3">
          <Link className="data-link-primary" href="/exports/pbp_id_sppg_data.csv">
            Unduh CSV
          </Link>
          <Link className="data-link-secondary" href="/exports/pbp_id_sppg_data.json">
            Unduh JSON
          </Link>
          <Link className="data-link-secondary" href="/cari">
            Cari entitas
          </Link>
        </div>
      </div>
    </section>
  );
}

function EditorialPrinciples() {
  return (
    <section className="py-14 md:py-16">
      <SectionHeader eyebrow="Cara Pakai" title="Bukan media, bukan penyidik." />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        <PrincipleCard
          num="01"
          title="Hanya mengumpulkan"
          body="Semuanya sudah ada di AHU, LPSE, SiRUP, atau arsip berita. Kami menaruhnya di satu tempat."
        />
        <PrincipleCard
          num="02"
          title="Tidak menuduh"
          body="Tidak ada analisis atau kesimpulan hukum. Sorotan hanyalah penanda, bukan vonis."
        />
        <PrincipleCard
          num="03"
          title="Bisa dicek ulang"
          body="Tiap entitas punya tautan ke dokumen aslinya. Kalau keliru, laporkan lewat GitHub."
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
          <FooterLink href="/dossier">Katalog proyek</FooterLink>
          <FooterLink href="/graf">Peta relasi</FooterLink>
          <FooterLink href="/cari">Cari entitas</FooterLink>
          <FooterLink href="/sppg">Titik SPPG</FooterLink>
        </FooterColumn>

        <FooterColumn title="Data">
          <FooterLink href="/exports/pbp_id_sppg_data.csv">Unduh CSV</FooterLink>
          <FooterLink href="/exports/pbp_id_sppg_data.json">Unduh JSON</FooterLink>
          <FooterLink href="/data/case_study_bgn_peruri.json">Contoh entri JSON</FooterLink>
        </FooterColumn>

        <FooterColumn title="Tentang">
          <FooterLink href="/tentang">Metodologi</FooterLink>
          <FooterLink href={SITE_CONFIG.REPO_URL}>GitHub</FooterLink>
          <FooterLink href="/kontak">Kontak & Koreksi</FooterLink>
        </FooterColumn>
      </div>

      <div className="mt-12 flex flex-wrap items-center justify-between gap-3 border-t border-[var(--border-base)] pt-6 font-mono text-[10px] font-bold uppercase tracking-[0.14em] text-[var(--text-tertiary)]">
        <span>© 2026 {SITE_CONFIG.NAME_LONG}</span>
        <span>Dokumen publik · Open source</span>
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
