import Link from "next/link";
import type { Metadata } from "next";
import { SITE_CONFIG } from "@/lib/constants";

export const metadata: Metadata = {
  title: "Kontak & Koreksi",
  description:
    "Cara melaporkan data yang perlu dikoreksi, mengusulkan dossier baru, atau berkontribusi ke repositori publik PBP.ID.",
};

export default function KontakPage() {
  const repoIssueUrl = `${SITE_CONFIG.REPO_URL}/issues/new`;
  const dataCorrectionUrl = `${SITE_CONFIG.REPO_URL}/issues/new?template=data-correction.md&labels=data-correction&title=%5BKoreksi%5D+`;
  const newDossierUrl = `${SITE_CONFIG.REPO_URL}/issues/new?template=new-dossier.md&labels=new-dossier&title=%5BUsul+Dossier%5D+`;

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
            Temukan data yang perlu diperbaiki?
          </h1>
          <p className="text-lg text-[var(--text-secondary)] leading-relaxed max-w-2xl">
            Data di {SITE_CONFIG.NAME} disusun dari dokumen publik. Kalau ada
            angka, nama, atau relasi yang tidak tepat, kabarkan lewat jalur
            berikut agar bisa diperbaiki dan dicatat secara terbuka.
          </p>
        </section>

        <section className="grid gap-6 md:grid-cols-2">
          <ContactCard
            label="Koreksi Data"
            title="Laporkan kesalahan fakta"
            description="Angka keliru, nama tidak cocok, sumber rusak, atau klaim yang perlu diperbarui. Sertakan tautan dokumen publik sebagai bukti."
            href={dataCorrectionUrl}
            cta="Buat issue koreksi"
            external
          />
          <ContactCard
            label="Dossier Baru"
            title="Usulkan topik investigasi"
            description="Proyek pemerintah yang belum tercakup dan punya jejak dokumen publik (AHU, LPSE, SiRUP, berita arus utama)."
            href={newDossierUrl}
            cta="Usulkan dossier"
            external
          />
          <ContactCard
            label="Kontribusi Kode"
            title="Pull request terbuka"
            description="Semua kode, data JSON, dan skrip ETL ada di repositori publik. Fork, ubah, lalu kirim pull request."
            href={SITE_CONFIG.REPO_URL}
            cta="Buka repositori"
            external
          />
          <ContactCard
            label="Kontak Umum"
            title="Email redaksi"
            description="Untuk pertanyaan yang tidak cocok dijadikan issue publik, kirim ke alamat di bawah."
            href={`mailto:${SITE_CONFIG.CONTACT_EMAIL}`}
            cta={SITE_CONFIG.CONTACT_EMAIL}
          />
        </section>

        <section className="space-y-6 border-t border-[var(--border-base)] pt-12">
          <h2
            className="text-2xl md:text-3xl font-bold text-[var(--text-primary)]"
            style={{ fontFamily: "'IBM Plex Serif', 'Georgia', serif" }}
          >
            Kebijakan koreksi
          </h2>
          <div className="space-y-4 text-[var(--text-secondary)] leading-relaxed max-w-3xl">
            <p>
              Setiap laporan koreksi ditangani secara terbuka melalui issue
              di GitHub. Perbaikan data dicatat dalam riwayat commit agar
              bisa dilacak kembali.
            </p>
            <p>
              Jika laporan menyangkut nama individu atau perusahaan,
              mohon sertakan tautan ke dokumen publik (putusan pengadilan,
              rilis resmi lembaga, arsip berita) sebagai rujukan. Koreksi
              tanpa sumber sulit untuk diverifikasi.
            </p>
            <p>
              {SITE_CONFIG.NAME} bukan media massa dan tidak menayangkan
              opini atau tuduhan. Laporan yang hanya berisi penilaian pribadi
              tanpa dokumen pendukung tidak akan diproses.
            </p>
          </div>
        </section>

        <section className="space-y-6 border-t border-[var(--border-base)] pt-12">
          <h2
            className="text-2xl md:text-3xl font-bold text-[var(--text-primary)]"
            style={{ fontFamily: "'IBM Plex Serif', 'Georgia', serif" }}
          >
            Cepat menuju
          </h2>
          <div className="flex flex-wrap gap-3">
            <Link
              href={repoIssueUrl}
              target="_blank"
              rel="noreferrer"
              className="px-5 py-2.5 rounded-md border border-[var(--border-strong)] bg-[var(--bg-surface)] text-[var(--text-primary)] font-mono text-xs font-bold uppercase tracking-[0.12em] no-underline transition-colors hover:border-[var(--accent-danger)] hover:text-[var(--accent-danger)]"
            >
              Issue baru (bebas)
            </Link>
            <Link
              href="/dossier"
              className="px-5 py-2.5 rounded-md border border-[var(--border-base)] bg-[var(--bg-surface)] text-[var(--text-secondary)] font-mono text-xs font-bold uppercase tracking-[0.12em] no-underline transition-colors hover:border-[var(--accent-danger)] hover:text-[var(--accent-danger)]"
            >
              Baca dossier
            </Link>
            <Link
              href="/tentang"
              className="px-5 py-2.5 rounded-md border border-[var(--border-base)] bg-[var(--bg-surface)] text-[var(--text-secondary)] font-mono text-xs font-bold uppercase tracking-[0.12em] no-underline transition-colors hover:border-[var(--accent-danger)] hover:text-[var(--accent-danger)]"
            >
              Metodologi
            </Link>
          </div>
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
      className="group flex flex-col gap-4 rounded-lg border border-[var(--border-base)] bg-[var(--bg-surface)] p-6 no-underline transition-all hover:-translate-y-0.5 hover:border-[var(--accent-danger)] hover:shadow-lg"
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
