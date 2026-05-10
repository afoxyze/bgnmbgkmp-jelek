import Link from "next/link";
import type { Metadata } from "next";
import { SITE_CONFIG } from "@/lib/constants";

export const metadata: Metadata = {
  title: "Kontak & Koreksi",
  description: "Lapor data yang salah atau usul entri baru.",
};

export default function KontakPage() {
  const repoIssueUrl = `${SITE_CONFIG.REPO_URL}/issues/new`;

  return (
    <main className="content-page py-12 px-6">
      <div className="max-w-[960px] mx-auto space-y-16">
        <section className="space-y-6">
          <div className="inline-block px-3 py-1 border border-[var(--accent-danger)] text-[var(--accent-danger)] font-mono text-[10px] font-bold uppercase tracking-widest">
            Kontak & Koreksi
          </div>
          <h1
            className="text-4xl md:text-5xl font-bold leading-tight text-[var(--text-primary)]"
            style={{ fontFamily: "'IBM Plex Serif', 'Georgia', serif" }}
          >
            Datanya salah? Laporkan.
          </h1>
          <p className="text-lg text-[var(--text-secondary)] leading-relaxed max-w-2xl">
            Semua koreksi ditangani lewat GitHub. Perbaikan dicatat di riwayat
            commit.
          </p>
        </section>

        <section className="grid gap-6 md:grid-cols-2">
          <ContactCard
            label="Koreksi Data"
            title="Lapor kesalahan fakta"
            description="Sertakan tautan dokumen publik sebagai rujukan."
            href={repoIssueUrl}
            cta="Buat issue"
            external
          />
          <ContactCard
            label="Entri Baru"
            title="Usulkan proyek"
            description="Proyek pemerintah yang belum tercakup dan punya jejak dokumen publik."
            href={repoIssueUrl}
            cta="Usulkan entri"
            external
          />
          <ContactCard
            label="Kontribusi Kode"
            title="Pull request terbuka"
            description="Kode dan data terbuka di repositori."
            href={SITE_CONFIG.REPO_URL}
            cta="Buka repositori"
            external
          />
          <ContactCard
            label="Email"
            title="Kontak umum"
            description="Untuk hal yang tidak cocok jadi issue publik."
            href={`mailto:${SITE_CONFIG.CONTACT_EMAIL}`}
            cta={SITE_CONFIG.CONTACT_EMAIL}
          />
        </section>

        <section className="space-y-4 border-t border-[var(--border-base)] pt-12 max-w-3xl">
          <h2
            className="text-2xl font-bold text-[var(--text-primary)]"
            style={{ fontFamily: "'IBM Plex Serif', 'Georgia', serif" }}
          >
            Kebijakan koreksi
          </h2>
          <ul className="text-[var(--text-secondary)] leading-relaxed list-disc pl-5 space-y-2">
            <li>Koreksi ditangani terbuka via GitHub issue.</li>
            <li>Sertakan tautan dokumen publik sebagai rujukan (putusan, rilis resmi, arsip berita).</li>
            <li>Laporan berupa opini tanpa dokumen pendukung tidak diproses.</li>
          </ul>
        </section>
      </div>
    </main>
  );
}

function ContactCard({
  label,
  title,
  description,
  href,
  cta,
  external = false,
}: {
  label: string;
  title: string;
  description: string;
  href: string;
  cta: string;
  external?: boolean;
}) {
  const externalProps = external ? { target: "_blank", rel: "noreferrer" } : {};

  return (
    <Link
      href={href}
      {...externalProps}
      className="group flex flex-col gap-3 rounded-lg border border-[var(--border-base)] bg-[var(--bg-surface)] p-6 no-underline transition-all hover:-translate-y-0.5 hover:border-[var(--accent-danger)] hover:shadow-lg"
    >
      <span className="font-mono text-[10px] font-bold uppercase tracking-[0.14em] text-[var(--accent-danger)]">
        {label}
      </span>
      <h3
        className="text-xl font-bold text-[var(--text-primary)] leading-tight"
        style={{ fontFamily: "'IBM Plex Serif', 'Georgia', serif" }}
      >
        {title}
      </h3>
      <p className="text-sm text-[var(--text-secondary)] leading-relaxed flex-1">
        {description}
      </p>
      <span className="flex items-center gap-2 font-mono text-[11px] font-bold uppercase tracking-[0.12em] text-[var(--text-primary)] transition-colors group-hover:text-[var(--accent-danger)]">
        {cta}
        <svg
          width="14"
          height="14"
          viewBox="0 0 24 24"
          fill="none"
          aria-hidden="true"
          className="transition-transform group-hover:translate-x-1"
        >
          <path d="M5 12h14M13 6l6 6-6 6" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </span>
    </Link>
  );
}
