import Link from "next/link";
import { getLiveStats } from "@/lib/data";
import type { Metadata } from "next";

import { SITE_CONFIG } from "@/lib/constants";
import { getEntrySummaries } from "@/lib/entry";
import { EntryIndexCard } from "@/components/entry/EntryIndexCard";

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
        />
        <InvestigationsSection />
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
}

function HeroSection({
  totalEntitas,
  totalRelasi,
  totalRedFlags,
}: HeroSectionProps) {
  return (
    <section className="pb-14 md:pb-20">
      <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,1fr)_420px] gap-8 lg:gap-12 items-end">
        <div>
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
            Proyek <span style={{ color: "var(--accent-danger)" }}>&ldquo;Bagus&rdquo;</span> Pemerintah.
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
            Kumpulan proyek pemerintah. Dokumennya sudah ada di ruang
            publik, kami hanya menaruhnya di satu tempat.
          </p>

          <div className="flex flex-col sm:flex-row gap-3">
            <Link
              href="/etalase"
              className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-md bg-[var(--accent-danger)] text-white font-mono text-xs font-bold tracking-[0.14em] no-underline transition-all shadow-[0_12px_22px_-10px_rgba(196,30,58,0.65)] hover:opacity-90 hover:translate-y-[-1px] active:translate-y-0"
            >
              BUKA ETALASE
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
  // Show the headline number from each of the first three registry entries
  // instead of abstract circles. Same visual footprint, actual data.
  const entries = getEntrySummaries().slice(0, 3);

  return (
    <div className="relative min-h-[190px] bg-[var(--bg-surface-2)] p-5 flex flex-col justify-between">
      <div className="font-mono text-[10px] font-bold uppercase tracking-[0.14em] text-[var(--text-tertiary)]">
        Etalase
      </div>
      <div className="flex flex-col gap-1">
        {entries.map((entry) => (
          <Link
            key={entry.slug}
            href={`/etalase/${entry.slug}`}
            className="group flex items-baseline gap-3 no-underline border-t border-[var(--border-base)] pt-2 first:pt-0 first:border-t-0"
          >
            <span
              style={{ fontFamily: "'IBM Plex Serif', 'Georgia', serif" }}
              className="text-lg font-bold text-[var(--accent-danger)] tracking-tight w-[72px] shrink-0"
            >
              {entry.anggaranFokus ?? entry.code}
            </span>
            <span className="flex-1 min-w-0 text-[11px] leading-snug text-[var(--text-secondary)] group-hover:text-[var(--text-primary)] transition-colors truncate">
              {entry.categoryLong}
            </span>
          </Link>
        ))}
      </div>
    </div>
  );
}

function InvestigationsSection() {
  return (
    <section className="pb-12 md:pb-16">
      <SectionHeader
        eyebrow="Etalase"
        title="Proyek yang sudah ada di dokumen publik."
        actionHref="/etalase"
        actionLabel="Semua entri"
      />

      <div className="flex flex-col gap-4">
        {getEntrySummaries().map((entry) => (
          <EntryIndexCard key={entry.slug} entry={entry} />
        ))}
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
    <footer className="border-t border-[var(--border-base)] py-10">
      <div className="flex flex-col gap-6 md:flex-row md:items-start md:justify-between md:gap-10">
        <div className="max-w-md">
          <Link
            href="/"
            className="mb-2 block text-lg font-black tracking-tight text-[var(--text-primary)] no-underline"
          >
            {SITE_CONFIG.NAME}
          </Link>
          <p className="text-sm leading-relaxed text-[var(--text-secondary)]">
            {SITE_CONFIG.DISCLAIMER}
          </p>
        </div>

        <nav
          aria-label="Tautan footer"
          className="flex flex-wrap gap-x-5 gap-y-2 text-sm"
        >
          <FooterLink href="/tentang">Tentang</FooterLink>
          <FooterLink href="/perubahan">Perubahan</FooterLink>
          <FooterLink href="/kontak">Kontak</FooterLink>
          <FooterLink href={SITE_CONFIG.REPO_URL}>GitHub</FooterLink>
          <FooterLink href="/exports/pbp_id_sppg_data.csv">Unduh CSV</FooterLink>
          <FooterLink href="/exports/pbp_id_sppg_data.json">Unduh JSON</FooterLink>
        </nav>
      </div>

      <div className="mt-8 flex flex-wrap items-center justify-between gap-3 border-t border-[var(--border-base)] pt-5 font-mono text-[10px] font-bold uppercase tracking-[0.14em] text-[var(--text-tertiary)]">
        <span>
          © 2026 {" "}
          Proyek <span className="text-[var(--accent-danger)]">&ldquo;Bagus&rdquo;</span> Pemerintah
        </span>
        <span>Dokumen publik · Open source</span>
      </div>
    </footer>
  );
}

function FooterLink({ href, children }: { href: string; children: React.ReactNode }) {
  const className = "text-sm text-[var(--text-secondary)] no-underline transition-colors hover:text-[var(--accent-danger)]";

  if (href.startsWith("http")) {
    return (
      <a href={href} target="_blank" rel="noreferrer" className={className}>
        {children}
      </a>
    );
  }

  return (
    <Link href={href} className={className}>
      {children}
    </Link>
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
